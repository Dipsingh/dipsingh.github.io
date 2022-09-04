---
layout: post
title:  Experimenting TCP Congestion Control(WIP)
---
## Introduction
I have always found TCP congestion control algorithms fascinating, and at the same time, I know very little about them. 
So from time to time, I will try to spend some time with the hope of gaining some new insights. This blog post will 
share experiments with various TCP congestion control algorithms. We will start with TCP Reno, then look at
Cubic and end with BBR.I am using Linux network namespaces to emulate topology for experimentation, making it easier to 
run than setting up a physical test bed.

## TCP Reno
For many years, the main algorithm of congestion control was TCP Reno. The goal of congestion control is to determine 
how much capacity is available in the network, so that source knows how 
many packets it can safely have in transit (Inflight). Once a source has these packets in transit, it uses the ACK's 
arrival as a signal that packets are leaving the network, and therefore it's safe to send more packets into the network. 
By using ACKs for pacing the transmission of packets, TCP is self-clocking. The number of packets which 
TCP can inject into the network is controlled by Congestion Window(`cwnd`). 

{: .center}
![Congestion Window(cwnd)](/images/post13/cwnd.png "cwnd")


[Computer Networking: A Top Down Approach](http://gaia.cs.umass.edu/kurose_ross/index.php){text-align: center;}

TCP sending rate can be approximated by:

$$
TCP Sending Rate\approx \frac{cwnd}{RTT}bytes/sec
$$

where TCP sender limits transmission: $LastByteSent - LastByteAcked \le cwnd $ and `cwnd` is a dynamically adjusted in
response to observed network congestion.

### Slow-Start, Congestion Avoidance and Fast-Recovery
We know that TCP has various phases. They are mentioned here for posterity but won't go in detail as there are so many good
resources out there on this.

Slow-Start:
TCP begins in Slow Start by sending certain number of segment, called the Initial window(IW). This 
can be somewhere between 2 and 4 segments based on the size of the MSS. For simplicity if we assume IW = 1 MSS and no 
packets are lost, an ACK is returned for the first segment, allowing to send another segment. If one segment is ACKed, 
the cwnd is increased to 2 and two segments are sent. We can represent this as $W = 2^k$ where `k` is the number of 
RTTs and `W` is the Window size in units of packets.

Congestion Avoidance:
When the congestion window grows above a certain threshold known as `ssthresh`, it transitions to Congestion Avoidance phase,
where the windows grows linearly. For each ACK packet, the window grows by $\frac{1}{cwnd}$. This is the additive increase
part of the AIMD strategy where the TCP tries to put packets in the network unless it detects a loss.

Fast-Recovery:
If there is a packet loss, the TCP sender will receive duplicate ACK (or BAD ACks, which doesn't return a higher ACK number). 
Rather than going back to Slow-Start, TCP goes to Fast-Recovery state, where it tries to recover from the Packet loss and, once
the recovery is complete, moves back to the Congestion Avoidance phase. Reno Fast-Recovery was improved under New-Reno to
handle multiple packet losses. During this phase TCP slows down by cutting `cwnd` by half which is the Multiplicative
decrease of AIMD.

Here is the Finite State Machine for the TCP Reno:
![TCP Reno FSM](/images/post13/tcp_reno_fsm.png "TCP Reno FSM")
ref:

### TCP Reno Throughput
For approximating TCP Reno throughput, we have two equations:

Mathis Equation for TCP Reno throughput: $\frac{MSS}{RTT}*\frac{1}{\sqrt{p}}$

Padhye Equation for TCP Reno throughput: $\approx min(\frac{W_{max}}{RTT}, \frac{1}{RTT\sqrt{\frac{2bp}{3}}+T_{0}min(1,3\sqrt{\frac{3bp}{8}})p(1+32p^{2})})$

where `p` is the packet loss probability, $W_{max}$ is the max congestion window size and `b` is the number of packets of that
are acknowledged by a received ACK.

### Experimenting Single TCP Reno Session
Let's start with a simple two host(H1, H2) connected by two routers(R1, R2). Router `R1` has a small buffer of 100packets using FIFO
queuing discipline. The link between two routers is not a bottleneck link. We will run a single TCP Reno session from
host `H1` to `H2` for 200seconds and observe the behavior on `R1` and host. 

![Single Reno Session](/images/post13/single_host.png "Single Reno Session")

Stats are collected at every 200ms from `ss` and `tc` which should provide us a good approximation. Link utilization is 
calculated by aggregating all the bytes transferred within a second and then converting to Mbps. Below is the results of 
the output, and we can see in the top three plots: R1 Link Utilization, R1 Output Queue, Packet Drops at R1, and 
the bottom two shows `cwnd`,`ssthresh` and `RTT` observed.

![Single Reno Output](/images/post13/single_reno_output.png "Single Reno Output")

From the graph we can see how that how TCP Reno fills queues, and you can see the corresponding bumps in RTT as the buffer is filled.
As the host experience a packet drops, TCP receiver reduces its `cwnd`. You can also see the AIMD sawtooth pattern which emerges in the
link utilization.

### Experimenting Double TCP Reno Session
Now let's add another host pair and have TCP session between `H1->H3` and `H2-H4` and repeat the experiment.

![Double Reno Session](/images/post13/double_host.png "Double Host")

Below graph captures the results from the experiment. I have added the TCP sending rate in this graph as well.In this case,
the Router queue is now shared by two TCP sessions. We can see the buffer fills are more frequent now which should make sense,
due to the `R1-R2` link being the bottleneck link now and both TCP senders combined trying to push the maximum.

Also looking at the TCP sending rate graph, we can see how both TCP sessions are regulating each other.

![Double Reno Output](/images/post13/double_reno_output.png "Double Reno Output")

This brings the question on whether Reno TCP flows are fair to each other. We can look at the sum of the sending rate and 
see how much percentage each flow is contributing to that. We can see both TCP sessions are fluctuating around ~50% and the
average percentage for both flows is near 50%.

![Two Reno Flow Fairness](/images/post13/reno_fairness.png "Reno Fairness")

Formally we could also look at Jain's index for measuring fairness which has the following properties

1. Population size independence: the index is applicable to any number of flows.
2. Scale and metric independence: the index is independent of scale, i.e., the unit of
measurement does not matter.
3. Boundedness: the index is bounded between 0 and 1. A totally fair system has an
index of 1 and a totally unfair system has an index of 0.
4. Continuity: the index is continuous. Any change in allocation is reflected in the
fairness index. 

$
I = \frac{(\sum^{n}_{i=1}T_{i})^2}{n\sum^{n}_{i=1}T_{i})^2}
$
where
• 𝐼 is the fairness index, with values between 0 and 1.
• 𝑛 is the total number of flows.
• 𝑇1, 𝑇2, . . . , 𝑇𝑛 are the measured throughput of individual flows.

Plotting this for our two flows we see that how it fluctuates around 1 which is the perfect score.

![Jains Fairness Index](/images/post13/reno_fairness_index.png "Reno Fairness Index")

However Because TCP Reno's cwnd growth is proportional to RTT, a shorter RTT flow will be unfair to a longer RTT flow because of 
cwnd of the longer RTT flow will grow slowly. which we can see by modifying the RTT for `H2-H4`. This will result in the flow `H1-H3`
taking more bandwidth share.

![Double Reno Session](/images/post13/double_host.png "Double Host")

![Two Reno Flow Fairness](/images/post13/reno_rtt_fairness.png "Reno RTT Fairness")

![Jains Fairness Index](/images/post13/reno_rtt_fairness_index.png "Reno RTT Fairness Index")

## TCP Cubic
In order to provide higher throughput for large BDP networks, TCP Cubic which (modified version of BIC-TCP) came into picture. This
is currently the default congestion control algorithm for large number of Operating systems. It's still a loss-based congestion control
algorithm which indicates packet-loss as indication of Congestion. $W_{max}$ represents the window size where loss occurs.Cubic
decreases the `cwnd` by a constant decrease factor $\bar\beta$ and enters into congestion avoidance phase and begins to increase
`cwnd` size by using an increase factor called $\bar\alpha$ as concave feature of cubic function until the window size becomes 
$W_{max}$. The congestion window grows very fast after a windo reduction, but as it gets close to $W_{max}$, it slows down it's 
growth, around $W_{max}$, the window increment becomes almost zero. 


$W(t) = C(t-\bar{K})^3+W_{max}$

$\bar{K} = \sqrt{\frac{W_{max}\bar\beta}{C}}$

$\bar\alpha=\frac{3\bar\beta}{2-\beta}$

$\bar\beta=\mu\beta$

where C is the scaling constant factor with default C=0.4. $\bar\beta$ is the multiplicative decrease factor after packet
loss event, it's default value is 0.2.

(t) is the elapsed time from the last window reduction and $\bar{K}$ is the time period that the function requires to increase W to $W_{max}$. 

TCP Cubic sets the W(t+RTT) as the candidate target value of `cwnd` congestion window parameters $\bar\alpha$ and $\bar\beta$ of
TCP Cubic

Cubic behaves linear for low RTT's

Draw the graph.

### Experimenting Double TCP Cubic Session

Draw the graph showing 

Fairness

Fairness index.

### Experimenting Cubic and Reno

## TCP BBR
One of the problems with loss bases congestion control algorithms in high latency networks is that due to the 
cwnd growth being proportional to RTT, the growth in cwnd is slow. In case of BBR, it doesn't adhere to the AIMD
rule. BBR is a rate-based algorithm i.e. at any given time it sends data at a rate that is independent of current
packet losses.

The behavior of BBR can be described using Figure 3, which shows a TCP’s viewpoint of
an end-to-end connection. At any time, the connection has exactly one slowest link, or
bottleneck bandwidth (btlbw), that determines the location where queues are formed.
When router buffers are large, traditional congestion control keeps them full (i.e., they
keep increasing the rate during the additive increase phase). When buffers are small,
traditional congestion control misinterprets a loss as a signal of congestion, leading to low
throughput. The output port queue increases when the input link arrival rate exceeds
btlbw. The throughput of loss-based congestion control is less than btlbw because of the
frequent packet losses.


application limited region, the delivery rate/throughput increases as the amount of data
generated by the application layer increases, while the RTT remains constant. The
pipeline between sender and receiver becomes full when the inflight number of bits is
equal to the bandwidth multiplied by the RTT. This number is also called bandwidth-delay
product (BDP) and quantifies the number of bits that can be inflight if the sender
continuously sends segments. In the bandwidth limited region, the queue size at the
router of Figure 3(a) starts increasing, resulting in an increase of the RTT. The throughput
remains constant, as the bottleneck link is fully utilized. Finally, when no buffer is available
at the router to store arriving packets (the number of inflight bits is equal to BDP plus the
buffer size of the router), these are dropped.


It is important to understand that packets to be sent are paced at the estimated
bottleneck rate, which is intended to avoid network queuing that would otherwise be
encountered when the network performs rate adaptation at the bottleneck point. The
intended operational model here is that the sender is passing packets into the network at
a rate that is not anticipated to encounter queuing at any point within the entire path.
This is a significant contrast to protocols such as Reno, which tends to send packet bursts
at the epoch of the RTT and relies on the network’s queues to perform rate adaptation in
the interior of the network if the burst sending rate is higher than the bottleneck capacity.
BBR also periodically probes for additional bandwidth. It spends one RTT interval
deliberately sending at a rate that is higher than the current estimate bottleneck
bandwidth. Specifically, it sends data at 125% the bottleneck bandwidth. If the available
bottleneck bandwidth has not changed, then the increased sending rate will cause a
queue to form at the bottleneck. This will cause the ACK signaling to reveal an increased
RTT, but the bottleneck bandwidth estimate will be unaltered. If this is the case, then the
sender will subsequently send at a compensating reduced sending rate for an RTT interval.
The reduced rate is set to 75% the bottleneck bandwidth, allowing the bottleneck queue
to drain. On the other hand, if the available bottleneck bandwidth estimate has increased
because of this probe, then the sender will operate according to this new bottleneck
bandwidth estimate. The entire cycle duration lasts eight RTTs and is repeated indefinitely
in steady state. 

### Experimenting Double TCP BBR Session

### Experimenting TCP BBR and Cubic Session

### Experimenting TCP BBR and Cubic Session with buffer


## References
[draft-ietf-lsr-isis-flood-reflection](https://datatracker.ietf.org/doc/html/draft-ietf-lsr-isis-flood-reflection)

[Arista Area proxy Config](https://www.arista.com/en/support/toi/eos-4-25-1f/14654-areaproxy)