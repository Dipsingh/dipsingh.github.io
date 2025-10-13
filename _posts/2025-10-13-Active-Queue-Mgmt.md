---
layout: post
title: Notes on Active Queue Management Techniques
---

>  "In theory, there is no difference between theory and practice. In practice, there is." - Jan L. A. van de Snepscheut

In packet-switched networks, buffers serve an essential function by temporarily storing packets, which helps smooth out bursts 
of incoming traffic and manage mismatches between the rates of incoming and outgoing links. However, since buffers have limited 
capacity, running out of buffer space leads to packet loss. 

Traditional methods, like Tail Drop, only discard packets once the buffer is full. This approach can cause synchronized reactions 
across multiple data flows—known as global synchronization—which ultimately leads to inefficient network utilization and decreased throughput.

Active Queue Management (AQM) techniques tackle these problems by proactively controlling queue lengths. By detecting congestion 
early and dropping or marking packets before severe congestion occurs, AQM significantly improves network stability and resource 
utilization. While there are many possible queuing disciplines for packet scheduling, two key considerations must be assessed when 
selecting a discipline: its ability to ensure bounded delay and the efficiency of its implementation.

# Packet Buffer Memory Structure

A packet buffer is divided into three distinct memory regions: Cell-data memory, Cell-pointer memory, and Packet Descriptor (PD) memory. 

Cell-data memory serves as the primary storage area for the bytes of packet payloads. To optimize memory usage and prevent fragmentation, 
the payload data is segmented into fixed-sized blocks known as cells, each identified by a unique index. Depending on the length of the 
packet, the payload may occupy one or more of these cells.

The cell-pointer memory manages the links between individual cells. Each cell pointer is a small metadata structure that indicates 
the location of a cell and points to the next cell in a packet's payload chain. When a packet enters the switch, a sequence of 
free cell pointers is allocated from a global linked list known as the free cell list. This free list is organized as a singly 
linked chain, which allows for constant-time (O(1)) allocation and deallocation of cells.

To allocate space for a new packet, the initial pointer of the packet is assigned to the current head of the free list, and then 
the head is moved to the next pointer in the list. This method eliminates the need for costly pointer writes for each cell. Similarly, 
once a packet has been transmitted and is no longer needed, its associated cell pointers can be returned efficiently by appending 
them back to the end of the global free list, again with minimal pointer updates.

Each packet entering the buffer is represented by a compact metadata structure known as a Packet Descriptor (PD). The PD contains 
essential information, such as the packet length and pointers that identify the beginning of the packet's cell-pointer chain. Within 
the switch, queues, such as Virtual Output Queues (VOQs), are organized as linked lists of these PDs. The switch's scheduler and 
traffic management logic interact directly with the PDs, rather than with the payload data.

{: .center}
![MemoryStructure](/images/post34/fig1.png "BufferMemoryStructure")

During normal operation, when a packet is ready for transmission, the scheduler removes the corresponding Packet Descriptor (PD) from its 
queue. The transmission pipeline then reads the packet's cell pointers in order, using them to access and transmit the payload data 
from the cell-data memory. This retrieval process efficiently overlaps access to the PD memory, pointer memory, and cell-data memory.


## Non-Preemptive Buffer Management 

Non-preemptive buffer management (BM) refers to a group of schemes that only make admit or deny decisions upon the arrival of 
packets and do not evict packets that are already in the buffer. In practice, this is implemented by using threshold logic on the 
admission path: a queue can accept bytes as long as its instantaneous occupancy is below a certain threshold. However, once 
this threshold is crossed, any new arriving packets must be dropped or marked. Previously admitted packets are allowed to drain 
naturally at the egress share. This principle of "allocate-on-enqueue, return-on-dequeue" is appealing because it is straightforward 
and cost-effective to implement in the traffic manager datapath.

The dominant non-preemptive scheme used in merchant switch ASICs is known as Dynamic Threshold (DT). DT calculates a time-varying, per-queue 
threshold $T(t)$ that is proportional to the currently available shared buffer. 

$$
T(t)=\alpha\Big(B-\sum_{i=1}^{N} q_i(t)\Big)
$$

Here, $B$ represents the total shared buffer, $q_i(t)$ represents queue occupancies, and $\alpha$ is a gain factor (often a power 
of two, allowing the hardware to implement the multiplication as a shift). Intuitively, DT is generous when the switch is empty 
and tightens limits as the buffer fills, balancing efficiency and fairness without requiring per-queue reservations.

However, the design has two fundamental drawbacks, both of which stem from the nature of non-preemption. First, it lacks agility. Since 
previously accepted packets cannot be evicted, the only way to reduce an over-allocated queue is to wait for it to drain at its egress 
rate. During arrival spikes (such as incast) or when competing queues receive most of the scheduler's share (either through 
strict or weighted priority), thresholds can decrease faster than these long-standing queues can be drained. This leads to the 
well-documented transient anomaly: newcomers may be dropped before achieving fairness while incumbents remain over-allocated, particularly 
when high-priority classes are starved by slowly draining low-priority queues.

Secondly, there is a problem of inefficiency. Because non-preemptive BMs cannot quickly create space for newly active queues, they 
must proactively reserve free headroom to absorb transients—headroom that remains idle at the moment of a drop. Under realistic settings (e.g.,  $\alpha=0.5$), the 
99th-percentile buffer utilization at the moment of a drop is only around 66%, which is a significant drawback given the scarcity of on-chip 
SRAM and the need for sufficient occupancy to handle both low-latency burst absorption and high throughput. Adjusting $\alpha$ reveals this 
trade-off rather than eliminating it: smaller values of $\alpha$ waste buffer space (resulting in more headroom and fewer drops), while larger values 
make DT more susceptible to anomalous behavior during bursts, as incumbents hold onto larger allocations that they cannot shed quickly.

Using the formula, we can get the Utilization $U(N,\alpha)$ and free head room $H(N,\alpha)$.

$$
U(N,\alpha)= 1- \frac{1}{1+\alpha N}
$$

$$
H(N,\alpha) = \frac{1}{1+\alpha N}
$$

For $N=4$, and $\alpha=0.5$, Utilization (U) = 66.7% and free buffer space (H) 33.3%. Below is a plot showing the relation between the 
Queues, $\alpha$ and Buffer utilization.

{: .center}
![DynamicThreshold](/images/post34/fig2.png "DynamicThreshold")

# Classic  AQM Schemes 

We examined the buffer memory structure and management. Now, we will shift our focus to Active Queue Management (AQM) schemes. AQM 
represents the router's proactive approach to stabilizing the feedback loop between finite buffers and various end-host rate controllers. Instead of 
waiting for buffers to fill and then reacting with a tail-drop, AQM actively regulates admission pressure to ensure that queues remain 
short enough to limit delay while still being flexible enough to accommodate bursts of traffic. This process helps reduce unnecessary 
packet loss, prevents issues like “lock-out” caused by aggressive senders, avoids herd backoff (also known as global synchronization), and 
maintains efficient link utilization, even when many flows and service classes are competing for bandwidth. In essence, AQM determines 
when and how much congestion signal to generate, which allows scheduling to function on healthy queues. This capability is crucial 
regardless of whether the upstream controllers operate based on window size, rate, or application-driven methods.

## RED and WRED

Random Early Detection (RED) is a foundational AQM algorithm. RED monitors the average queue length and, when congestion is building, begins 
dropping a probabilistic fraction of packets before the queue is full. As the average queue length grows from a minimum threshold to a 
maximum threshold, the drop probability increases from 0 to a configured maximum (linearly by default). By dropping (or marking) a few packets 
early, RED prompts some senders to slow down, thus avoiding a large burst of tail drops later. This reduces the likelihood of synchronized 
packet loss across flows and helps maintain lower average queue lengths.

Weighted RED (WRED) extends RED by supporting multiple traffic classes or priorities with different drop behaviors. Essentially, WRED is 
“RED with priorities” – it applies the RED algorithm on a per-class basis, allowing packets with lower priority (or DSCP markings) to face 
a higher drop probability earlier than high-priority packets. This way, WRED can preferentially protect critical traffic while still 
avoiding tail-drop for each class. In practice, this can be separate queues for classes with independent RED. WRED reduces the chances 
of tail drop by selectively dropping packets when the output interface begins to show signs of congestion. If congestion worsens beyond the 
RED range (i.e., the queue continues to fill), normal tail drop applies to any further packets.

### Explicit Congestion Notification (ECN) Integration

ECN is an essential enhancement to Active Queue Management (AQM). Instead of dropping packets to signal congestion, the Random Early 
Detection (RED) or Weighted Random Early Detection (WRED) algorithms can mark packets with an ECN flag when certain thresholds are 
exceeded. This marking prompts the endpoints to react as they would to packet loss, but without actually losing data.

Typically, ECN is implemented as an extension of WRED. When the average queue length surpasses a specified threshold, the router or 
switch marks the ECN bits in the packet instead of dropping it. This approach enables early detection of congestion while preventing 
data loss.

Switches and routers usually enable ECN marking on queues using a RED-like AQM algorithm, which is often configured with two 
thresholds: a minimum threshold, where marking begins, and a higher maximum threshold, where the likelihood of marking or dropping 
packets reaches 100%. For instance, a switch might start marking packets with ECN when a queue exceeds 150 KB and may ramp up to 
marking or dropping all packets once the queue occupancy reaches 3 MB.

The primary advantage of ECN is that it enables congestion notification without causing packet loss.

### How is the "Average Queue" computed?

WRED uses an exponentially weighted moving average (EWMA) of the instantaneous queue length to smooth bursts and react to persistent 
congestion. The critical factors which significantly impacts EWMA performance are:

- Weight ($w$)
- Nature of Network Traffic
- Samping Interval Duration

If $Q_{\text{avg(k)}}$ is the filtered (average) queue length, and $Q_{\text{sample(k)}}$ is the instantaneous queue occupancy when 
we update, the recurrence is:

$$
Q_{\text{avg(k+1)}} \leftarrow (1-w)\,Q_{\text{avg(k)}} + w\,Q_{\text{sample(k)}}
$$

Equivalently,

$$
Q_{\text{avg(k+1)}} \leftarrow Q_{\text{avg(k)}} + w\,(Q_{\text{sample(k)}}-Q_{\text{avg(k)}})
$$

with $0\le w\le 1$. In hardware, $w$ is chosen as a negative power of two, $w=2^{-n}$ , so the multiply becomes a shift which is 
pretty easy to implement in hardware.

Here, $w$ determines the responsiveness and stability of the average:
- Large $w \to$ faster reaction, less smoothing (more sensitive to short spikes).
- Small $w \to$ slower reaction, more smoothing (less sensitive to short spikes).

Below is a plot which shows how well different values of weight from higher to lower captures the original signal. 

{: .center}
![EWMA](/images/post34/fig3.png "EWMA")

### Averages can lie: Why the Mean Can Be... Mean

As you saw in earlier section that averages compress shape. The below example shows many datasets with the same mean and 
variance but wildly different patterns. Queues do this too.

{: .center}
![Dino](/images/post34/fig4.gif "Dino")

Ref: [Same State different Graph](https://www.research.autodesk.com/publications/same-stats-different-graphs/)

- **Same mean, different pain.** A queue that sits near 20 KB all the time behaves very differently from one that idles at 0 and 
spikes to 100 KB. The average is 20 KB in both, but only the spiky one blows past ECN thresholds, drives P99 latency, and triggers drops/trim.

- **EWMA can hide spikes.** A slow EWMA smooths bursty queues into a “nice” average; packets still saw the spike. Tune half-life 
from time goals, but validate on instant occupancy.


#### Signal Processing Foundations of EWMA

EWMA comes from signal processing theory, where it's used to filter noisy signals. You'll find the same mathematics in financial 
analysis, control systems, and anywhere else that needs to smooth time-series data.

**Impulse Response**

The impulse response answers a simple question: "If a single spike appears in otherwise steady data, how long does EWMA remember it?"

Consider a temperature sensor that has been reading a steady 20C for hours. At time t=0, there's a brief spike to 30C—just one reading—then 
immediately back to 20C. The impulse response tells us how that single 10-degree spike affects all future EWMA values.

Mathematically, for a unit impulse at t=0 (value of 1 at t=0, zero everywhere else), the EWMA response at time k is:
$$h_k = w(1-w)^k$$
This reveals a crucial insight: the influence of any single observation decays exponentially. Let's see this with $w=0.2$:

- At time 0: $0.2 \times (0.8)^0 = 0.2$
- At time 1: $0.2 \times (0.8)^1 = 0.16$
- At time 2: $0.2 \times (0.8)^2 = 0.128$
- At time 3: $0.2 \times (0.8)^3 = 0.1024$

The pattern is clear: each time step multiplies the remaining influence by (1-w). This creates a fundamental tradeoff:

- **Larger w**: Strong initial response (captures more of the spike) but forgets quickly (influence drops fast)
- **Smaller w**: Gentle initial response (captures less of the spike) but remembers longer (influence persists)

This is why choosing $w$ is about deciding what matters more: responsiveness to changes or stability against noise.

**Memory Characteristics**

While impulse response shows how quickly a spike fades, memory characteristics answer a different question: "How many past observations 
actually influence the current EWMA value?"

The key metric here is the effective memory length—roughly how many recent observations meaningfully contribute to the current average:

$$
N_{eff} \approx \frac{2}{w} - 1
$$

For example, with , the effective memory is  observations and with , the effective memory is  observations. This means the EWMA behaves 
roughly as if it's averaging the last 19 data points with $w=0.1$.  With $w=0.8$, effective memory $\approx$ 1.5 datapoints, i.e. EWMA 
barely looks beyound the last couple of values.

This reveals the fundamental memory tradeoff:

**Short memory (w close to 1):**
The filter tracks the input signal with minimal smoothing. You get a rapid response to changes, but also inherit most of the noise. Think 
of it as having tunnel vision on the most recent data.

**Long memory (w close to 0):**
The filter considers many past observations, heavily smoothing the output. You get stable, noise-free estimates but sluggish response 
to actual changes. It's like having a wide-angle view that includes lots of history.

The figure below illustrates this memory effect in action, where a single spike is remembered by the EWMA process for different weights.

{: .center}
![ImpulseResponse](/images/post34/fig5.png "ImpulseResponse")

**The Half-Life Perspective**

So far we've started with $w$ and explored its effects. But in practice, you often know the behavior you want and need to find the right 
$w$. This is where the half-life perspective becomes invaluable.

Consider radioactive decay—we describe uranium by its half-life (4.5 billion years) rather than its decay constant because half-life is 
intuitive: "How long until half of it's gone?" The same approach works for EWMA: "How many samples until the effect of a change is cut 
in half?"

Say your queue jumps from 100 to 200 packets. That's a 100-packet step change. The half-life $H$ tells you how many samples it takes 
for EWMA to close half the gap—to reach 150 packets.

The mathematics connecting half-life $H$ (in samples) to weight $w$:

**Given w, find half-life:**

$$
H = -\frac{\ln(2)}{\ln(1-w)}
$$

**Given desired half-life, find w:**

$$
w = 1 - 2^{-1/H}
$$

Let's see this in action with that 100 $\to$ 200 packet jump:

- **H = 1 sample** $\to$ w = 0.5
  After 1 sample: EWMA = 150 packets (halfway there in one step!)
  After 2 samples: EWMA = 175 packets
  
- **H = 8 samples** $\to$ w = 0.083  
  After 1 sample: EWMA = 108 packets (slow start)
  After 8 samples: EWMA = 150 packets (halfway there as promised)

With H=1, we absorb the half the change in one sample, i.e. the system reacts very quickly as it has a higher weight ($w=0.5$) vs. H = 8, 
which results in a relatively lower weight ($w=0.83$).

The half-life approach is powerful because you can specify behavior in terms of time: "I want microbursts (lasting 10ms) to fade 
quickly but real congestion (lasting 100ms) to register fully." Convert those times to samples based on your sampling rate, and 
you have your half-life specification.

**The Rise Time Perspective: How Fast Do We React?**

Sometimes you don't care about half-life; you care about how quickly the system responds to a sustained change. We often use 
the "10% to 90% rise time" - how many samples does it take for the EWMA to move from 10% to 90% of the way to a new steady state?

The relationship is simple:

$$
T_{10\to90} \approx \frac{ln(9)}{ln(2)}\times H \to 3.17 \times H
$$

So if you set your half-life to 4 samples, it takes about 13 samples to mostly complete a transition. This gives us another way to 
think about choosing $w$:

1. Decide how quickly you need to detect real changes (your rise time requirement)
2. Divide by 3.17 to get your half-life $H$.
3. Compute $w = 1 - 2^{-1/H}$

For instance, imagine if I know that my legitimate traffic patterns change on 100ms timescales, but microbursts last only 1-10ms. If 
I sample every millisecond:

- You want a rise time of ~100 samples (100ms).
- So $H = \frac{100}{3.17} \approx 32 \text{ samples}$. 
- Therefore $w = 1 - 2^{-1/32} \approx 0.021$

#### Importance of Sampling Interval ($T_s$)

The sampling interval $T_s$ is the time period between two consecutive measurements. Its duration significantly impacts EWMA accuracy 
and responsiveness. Shorter sampling interval allows to track short-duration bursts more accurately. The sampling interval must be 
shorter than the timescale of the changes we are trying to detect.

- With a fixed weight $w$, shorter sampling intervals means the EWMA responds to changes over a shorter absolute time window.
- With a fixed weight $w$, longer sampling intervals means the EWMA has a longer absolute time memory.

Below plot shows for a fixed weight with different sampling intervals.

{: .center}
![SamplingInterval](/images/post34/fig6.png "SamplingInterval")

**Sampling Rate Invariance: Keeping Behavior Consistent**

EWMA is just a discretized first-order low-pass filter. let's assume we have tuned our EWMA perfectly with $w = 0.1$, sampling every $10ms$. Now we 
change our sampling rate to be faster by changing it from 10ms to 1ms. If we keep the same weight $w = 0.1$, our system 
behavior completely changes! The half-life in real time becomes 10x shorter.

To maintain the same time-based behavior when changing sampling rates, we need to adjust $w$.

$$
w_{new} = 1 - (1 - w_{old})^{\frac{\Delta t_{new}}{\Delta t_{old}}}
$$

Let's look at an example.

- Sampling period: $\Delta t_{old} = 10ms$
- Weight: $w_{old} = 0.1$
- Time constant: $\tau = -\Delta t_{old}/\ln(1-w_{old}) \approx 95ms$

Now sampling 10x faster ($\Delta t_{new} = 1ms$):

$$
w_{new} = 1 - (1 - 0.1)^{1/10} = 1 - 0.9^{0.1} \approx 0.0105
$$

Now we need much smaller $w$. This is because we are updating 10x more often, so each update needs to be gentler to maintain the 
same overall time constant.

### WRED Linear Ramp

So we have this queue with an average Queue depth $Q_{avg}$ (not the instantaneous depth - that will make it too jittery). We want 
three distinct behaviors:

When the queue is pretty empty ($Q_{avg} \lt Q_{min}$), life is good. When the queue is getting concerning but not critical ($Q_{min} \le Q_{avg} \lt Q_{max}$), we 
start getting selective. We begin randomly dropping or marking packets with increasing probability as the queue fills up. When the 
queue is critically full ($Q_{avg} \ge Q_{max}$), we drop or mark every packets that arrive. 

Now in the middle zone ($Q_{min} \le Q_{avg} \lt Q_{max}$), we need to decide our drop/mark probability. The simplest thing that could 
work is a linear ramp:

$$
P_a \;=\; P_{\max}\,\frac{Q_{\text{avg}}-Q_{\min}}{Q_{\max}-Q_{\min}}
$$

The fraction $\frac{Q_{\text{avg}}-Q_{\min}}{Q_{\max}-Q_{\min}}$ is just asking "what percentage of the way are we from $Q_{min}$ to 
$Q_{max}$?". If $Q_{avg}=Q_{min}$, this fraction =0. if $Q_{avg}=Q_{max}$, this fraction =1, and it scales linearly in between. We then 
multiply it by $P_{max}$ to get our actual drop probability.

For instance, let's assume $Q_{min}=20 \text{ packets}$, $Q_{max}=60 \text{ packets}$, and $P_{max}=0.8$. If our average queue is at 40 
packets, then:

$$
P_{a} = 0.8 \times \frac{40-20}{60-20}= 0.4
$$

So we would drop or mark 40% of packets.

{: .center}
![WREDLinearRamp](/images/post34/fig7.png "WRED Linear Ramp")


_Note: In case of DCTCP, $Q_{min}$ and $Q_{max}$ is set to same value, so there is no linear ramp._

**RED’s “uniformization” using a packet counter**

Naively, we could just flip a biased coin with probability $P_a$ on each packet (where $P_a$ is the linear ramp above). But in 
practice two things will bite us:

1. **Burst clustering.** If $Q_{\text{avg}}$ rises quickly, repeated independent trials with the same $P_a$ can produce multiple drops in a tight clump, punishing whichever flow is unlucky.
2. **Fairness vs. burstiness.** You want drops spaced out so no single flow gets hammered by a few consecutive losses purely due to timing.

There is a two part solution to the above problem. First we know that not all packets are equal in size, and second it uses a 
packet counter trick to break the natural clustering of random drops.

Let's start with packet size fairness. Imagine we have 1500 byte packets and 64 byte ACK packets. If we treat them equally for 
dropping purposes, we are being unfair in terms of Queue consumption. The big packet is taking up 23 times more space compared 
to the small packet. So we solve this by adjusting the base probability for packet size:

$$
P_{a} \gets P_{a} \times \frac{PacketSize}{MaxPacketSize}
$$

For instance, if our $P_a$ is 0.1 and MaxPacketSize is 1500 bytes, then when 1500-byte packet arrives, its adjusted probability 
stays at 0.1. But when a 150 byte packet arrives, its probability becomes 0.01:

$$
P_{a} = 0.1 \times \frac{150}{1500} = 0.01
$$

This is proportional fairness. Now with this size adjusted $P_a$, RED implements the uniformization through packet counting. Instead 
of each packet having an independent drop probability (which creates clustering), RED keeps track of how many packets have passed 
since the last drop (the `count` variable) and computes:

$$
P_a = \frac{P_a}{1- (\text{count }\times P_a)}
$$

This is creating a "memory" in the system. Each packet that passes increases the `count`, which makes the denominator 
$(1-\text{count }\times P_a)$ smaller, which makes $P_a$ larger. This results in creating increasing "pressure" to drop. 

## Dynamic ECN

### The Core Problem: Why Queue Length Lies to Us

Traditional ECN assumes queue length indicates congestion. This made sense when queues had dedicated buffers—30KB queue meant 30KB 
consumed. But modern switches share a common buffer pool among all queues, breaking this assumption.

With shared buffers, queues borrow space dynamically. Queue A grabs extra during bursts, Queue B releases unused allocation back to 
the pool. Great for efficiency, but now queue length tells you nothing about actual congestion.

Consider a switch with 100KB shared buffer and two queues:

**False positive:** Queue A uses 30KB, Queue B uses 5KB. Static ECN marks Queue A for exceeding its 25KB threshold—even though 65KB sits free. You're signaling congestion at 35% utilization.

**False negative:** Twenty queues each using 4KB. Static ECN marks nothing—every queue looks fine at 4KB. Meanwhile, you're at 80% utilization and about to drop packets everywhere.

Same queue length, opposite realities. In shared buffer systems, 30KB might mean plenty of headroom or 4KB might mean imminent 
collapse—the queue length alone reveals nothing.

D-ECN tracks what actually matters: not "how long is my queue?" but "how much of my current allocation am I using?" Your allocation shifts 
with pool pressure, and D-ECN's thresholds shift with it. 

## How D-ECN's Dynamic Thresholds Work

Think of D-ECN as replacing a static speed limit sign with a dynamic one that adjusts based on road conditions. Static ECN is like 
having a fixed "Start braking at 60 mph" rule. D-ECN is like having a sign that says "Start braking when you're 100 feet from the car 
in front of you" where that car's position changes with traffic.

The key insight is that D-ECN tracks a moving target. Your queue's share of the pool expands and contracts based on how many other queues 
are active and how aggressively they're consuming buffer. The mathematics are handled by the buffer manager using alpha parameters, but 
conceptually it's simple: when the pool is empty, you might be allowed 100KB. When the pool is under pressure, your allowance might 
shrink to 20KB.

The threshold for marking moves with this allowance:

$$
\text{Mark when: } \text{Queue Size} \geq \text{Current Allowance} - \text{Safety Margin}
$$

This is different from static ECN's approach:

$$
\text{Static ECN: Mark when: } \text{Queue Average} \geq \text{Fixed Threshold}
$$

At its heart, D-ECN computes a threshold using three inputs, but only two are under your control.

$$
\text{Threshold} = min(\text{shared limit}, max(\text{shared limit}- \text{offset},\text{floor}))
$$

D-ECN is implementing three simple rules:

1. **Normal case**: Mark when you're within `offset` bytes of your limit
2. **Protection case**: Never mark below the `floor` (prevent over-aggressive marking)
3. **Saturation case**: Never mark above your actual `shared_limit` (obviously)

So let's imagine we have

- `DECN_OFFSET = 20KB` (your safety margin)
- `DECN_FLOOR = 10KB` (minimum queue before considering marking)

**Scenario 1: Plenty of buffer available** Your queue's shared_limit is currently 100KB.

```
Threshold = min(100KB, max(100KB - 20KB, 10KB))
         = min(100KB, max(80KB, 10KB))
         = min(100KB, 80KB)
         = 80KB
```

You'll mark packets when your queue reaches 80KB, giving you 20KB of headroom.

**Scenario 2: Buffer pool getting tight** Other queues are now active, your shared_limit shrinks to 25KB.

```
Threshold = min(25KB, max(25KB - 20KB, 10KB))
         = min(25KB, max(5KB, 10KB))
         = min(25KB, 10KB)
         = 10KB
```

The floor kicks in! You mark at 10KB instead of 5KB, preventing starvation.

**Scenario 3: Extreme congestion** The pool is nearly exhausted, your shared_limit is only 8KB.

```
Threshold = min(8KB, max(8KB - 20KB, 10KB))
         = min(8KB, max(-12KB, 10KB))
         = min(8KB, 10KB)
         = 8KB
```

Your actual limit becomes the cap. You can't mark packets for using buffer you don't have.

This three-case structure elegantly handles the full spectrum from empty to congested without any special cases or mode switches.

### The Parameters: What You Actually Control

You only set two parameters for D-ECN, but choosing them correctly is crucial. Let me show you how to think about each one.

#### DECN_OFFSET: Your Reaction Distance

The offset is fundamentally about time. It's answering: "How much buffer do I need between when I mark a packet and when the sender reacts?"

This buffer needs to accommodate:

1. **Packets in flight** that will arrive before the sender even receives the congestion signal
2. **Burst absorption** for natural traffic variations
3. **Safety margin** for measurement and reaction delays

Here's how to calculate it. Start with fundamental parameters:

$$
\text{DECN OFFSET} = n \times (\text{RTT} \times \text{Rate}) + \text{BurstSize} + \text{SafetyMargin}
$$

Where $n$ can be a multiple if we think it takes more than one RTT for the reaction time. For a concrete example with a 10 Gbps 
link, 100 microsecond RTT, and typical 10-packet bursts:

$$
\text{Bandwidth-Delay Product} = 10 \text{ Gbps} \times 100 \mu s = 125 \text{ KB}
$$
$$
\text{BurstSize} = 10 \times 1500 \text{ bytes} = 15 \text{ KB}
$$
$$
\text{SafetyMargin} = 0.2 \times 125 \text{ KB} = 25 \text{ KB}
$$
$$
\text{DECNOFFSET} = 125 + 15 + 25 = 165 \text{ KB}
$$

#### DECN_FLOOR: Your Minimum Operating Point

The floor prevents pathological behavior when buffers are nearly empty. Without it, you could end up marking packets in a 1KB queue 
just because the math says your threshold should be negative. The floor should be large enough to:

1. Maintain stable operation for at least one RTT
2. Avoid marking during normal, low-latency operation
3. Provide enough data for accurate congestion detection

A good starting point is:

$$
\text{DECN FLOOR} = \text{MinBDP} + \text{MinBurst}
$$

Where Min_BDP is the bandwidth-delay product of your shortest RTT flows. For a data center with 10 microsecond minimum RTT:

$$
\text{DECNFLOOR} = 10 \text{ Gbps} \times 10 \mu s + 5 \times 1500 \text{ bytes} = 12.5 \text{ KB} + 7.5 \text{ KB} = 20 \text{ KB}
$$

D-ECN is complementary to static ECN—both coexist and operate independently. When either WRED's probabilistic algorithm or D-ECN's 
dynamic threshold triggers, the packet gets marked, providing comprehensive congestion coverage without requiring any changes to 
your existing WRED configuration.

# Packet Trimming Mechanisms in AQM

## The Core Idea

Packet trimming is an Active Queue Management (AQM) strategy in which a switch, when experiencing congestion, removes part of the 
packet—typically the payload—rather than dropping the entire packet. By forwarding a truncated packet that contains only the header 
and minimal data, the network becomes “lossy” for the payload while still preserving important metadata. This approach maintains 
crucial information, such as sequence numbers, and provides immediate congestion signals to endpoints without the need to wait for timeouts. 

The idea was first proposed as cut payload ([CP](https://www.usenix.org/system/files/conference/nsdi14/nsdi14-paper-cheng.pdf)) and later 
refined in protocols like NDP. Trimming enables switches to run shallow queues since even when the queue overflows, most packets aren’t 
entirely dropped. This drastically reduces buffering delay while avoiding throughput collapse: senders quickly learn of congestion and 
can retransmit lost payloads with minimal delay.

Whenever an egress queue is full, the switch trims off the entire payload and forwards only the packet header. The trimmed header 
(marked with a “trim” bit) reaches the receiver or possibly is returned to the sender as a congestion signal. By only dropping payload, 
we avoid conventional packet loss; the receiver still sees a packet header and can immediately infer that the corresponding data 
segment was lost, prompting a fast retransmit (essentially an early negative acknowledgment). There is a priority header queue so that 
trimmed headers leapfrog full packets, ensuring the congestion signals propagate quickly. This mechanism prevents livelock: even under 
heavy incast, header-only packets get delivered promptly, giving senders timely feedback. Full-payload trimming, works well in 
datacenters with minimal propagation delay – the dropped payload can be retransmitted almost immediately, often arriving before the 
queue drains.

There is also selective chunk-level trimming scheme which was proposed as part of WAN/Video use cases and QUCO (Quality-aware Cutoff) 
is one such algorithm.

## Preventing Header-Only Livelock

A potential pitfall in trimming is that if too many packets are trimmed, the network could become livelocked sending mostly headers 
and very little payload. NDP avoids this by using a separate priority queue for trimmed headers. All trimmed packets enter a 
high-priority queue, ensuring they swiftly reach the receiver, while bandwidth is still allocated to full data packets (to avoid 
starvation of payload). In an ideal implementation, a WRR/WFQ by byte size can be used. This way, headers (very small) effectively 
jump ahead, but large packets still get service, preventing a scenario where the switch transmits nothing but headers. If even the 
header queue becomes saturated (e.g. in extreme incast with thousands of flows), NDP falls back to sending headers back to the 
source (source-directed congestion notification, Return-to-Sender, Back-to-Sender). An evolution of this idea is **Source Flow Control (SFC)**, which 
proactively returns trimmed headers to senders once a queue crosses a watermark. SFC (under standardization at IEEE) ensures that 
when a switch can’t even forward headers to the receiver, the congestion signal is delivered by bouncing the header back to the 
transmitter. These mechanisms guarantee that some form of congestion feedback (header to receiver or source) always gets through, maintaining 
stability.

## Hardware Implementations

Implementing packet trimming on real switches poses challenges, because most ASICs were not originally designed for dynamic packet 
resizing on the fly. Several approaches and hardware primitives are used to support trimming.

### Mirror-on-Drop (MoD) and Recirculation

Many switch ASICs provide a “mirror on drop” or deflect-on-drop feature in the traffic manager. Normally used for diagnostics 
(to capture packets that would be dropped), this feature can be repurposed for trimming. When an egress queue is about to overflow, 
instead of dropping a packet, the traffic manager redirects it to a special recirculation port. Many switch asics allows the traffic 
manager to directly mirror just the packet header into a MoD queue, without carrying the full payload through recirculation. In those 
ASICs, the hardware can automatically truncate the packet to a small size when deflecting, which is more efficient. The truncated 
copy is then enqueued either to the original output port’s header queue (for forward delivery) or to a return-to-sender queue 
(for SFC) - if ASICs supports it. This design minimizes extra latency – although recirculated headers incur a slight delay and use 
internal bandwidth, they remain much smaller than full packets. One limitation is oversubscription: if too many packets are deflected 
at once, the recirculation port per pipeline can become a bottleneck.

### Ingress Pipeline Trimming

A better approach is to perform trimming earlier, in the ingress stage, before packets enter the queue. If the ingress pipeline can 
query the current queue length (or an occupancy threshold flag) for the egress port, it could decide to trim packets preemptively 
on arrival. Implementing ingress trimming is complicated if precise queue information isn’t available or if there are many pipeline 
stages of latency in reading the queue state. Design must account for in-flight packets already in the pipeline which might overflow 
the queue before the trim logic activates.

# Conclusion

We started with the classics—RED and its per-class variant WRED—which were the first practical ways to “tap the brakes” before 
a queue hit tail-drop. By marking/dropping probabilistically as a smoothed queue crosses a minimum→maximum band, they keep delay 
bounded and prevent herd backoff, especially when paired with ECN. The main goal remains the same: to detect congestion early 
enough for senders to respond before buffer capacities are exceeded, all while not penalizing short bursts of traffic.

The challenging aspect lies in the implementation—specifically, selecting Exponentially Weighted Moving Average (EWMA) weights 
and sampling methods that align with the time scales of the traffic. Additionally, it involves setting moving thresholds with 
parameters (like DECN_OFFSET and DECN_FLOOR) that correspond effectively to the Bandwidth-Delay Product (BDP), burst size, and 
desired reaction time. We also examined how Packet Trimming can help reduce reaction time.

Once properly calibrated, AQM can replace the volatility caused by tail drop with a more controlled and fair signaling approach. This 
helps maintain short queues, keeps delays bounded, and ensures high utilization of network resources. I hope this was useful.

# References

- [Dynamic ECN](https://www.arista.com/en/support/toi/eos-4-33-1f/21065-dynamic-explicit-congestion-notification-d-ecn)
- [Re-architecting datacenter networks and stacks for low latency and high performance](https://dl.acm.org/doi/10.1145/3098822.3098825)
- [Implementing packet trimming support in hardware](https://arxiv.org/pdf/2207.04967)
- [Enhancing End-to-End Transport with Packet Trimming](https://escholarship.org/uc/item/3363b5x0)
- [EWMA](https://en.wikipedia.org/wiki/Moving_average#Exponential_moving_average)
- [Exponential Smoothing](https://en.wikipedia.org/wiki/Exponential_smoothing)
- [WRED](https://en.wikipedia.org/wiki/Weighted_random_early_detection)
- [Impulse Response](https://blog.mbedded.ninja/programming/signal-processing/digital-filters/exponential-moving-average-ema-filter/)
- [Half-Life of EWMA](https://stanford.edu/~boyd/papers/pdf/ewmm.pdf)
- [SFC: Near-Source Congestion Signaling and Flow Control](https://arxiv.org/pdf/2305.00538)
- [Cut Payload](https://www.usenix.org/system/files/conference/nsdi14/nsdi14-paper-cheng.pdf)






















# Introduction

Flow control is a fundamental component in the design of high-performance networks. While reviewing the scheduling mechanisms used in router architectures, I took 
the opportunity to revisit the core principles of flow control, examine its various mechanisms, and reflect on their practical implications. This write-up outlines 
key models, compares typical schemes, and highlights relevant system-level considerations.

# Principles of Flow Control

Flow control is a fundamental problem in feedback control for network communications. At its core, flow control addresses two 
critical questions that every network must solve: how do sources determine the appropriate transmission rate, and how do they 
detect when their collective demands exceed the available network or destination capacity? The solution lies in establishing 
effective feedback mechanisms from network contention points and destinations back to the sources, creating a self-regulating 
system that maintains network stability and performance.


{: .center}
![flowcontrol](/images/post33/fig1.png "FlowControl")

# The Fundamental Role of Round-Trip Time

Round-trip time (RTT) serves as the fundamental time constant in any feedback-based flow control system. RTT represents the minimum 
delay that a source must wait before observing the effects of its transmission decisions. When a source begins transmitting, it will 
only learn about the impact of that transmission one round-trip time (RTT) after it has started. Similarly, when congestion occurs 
at a contention point in the network, the corrective effects of any feedback mechanism will only manifest at that contention point 
one round-trip time (RTT) after the congestion event occurred. This inherent delay creates what we call it as a "**blind mode**" transmission—a 
period during which sources must transmit without knowledge of current network conditions.

{: .center}
![blindmode](/images/post33/fig2.png "Blindmode")


# Lossy vs. Lossless Flow Control Paradigms

Flow control systems fundamentally divide into two paradigms, each with distinct characteristics inherited from different engineering disciplines. Lossy 
flow control, inherited from communication engineering traditions, accepts that buffer overflows may occur and packets can be dropped. While this 
approach appears simple, it introduces significant complexity. Lost data necessitates retransmissions, which waste valuable communication 
capacity and create a gap between goodput (useful data delivered) and throughput (total data transmitted). Maintaining satisfactory goodput 
under lossy conditions requires carefully designed protocols that can efficiently detect losses and orchestrate retransmissions without exacerbating congestion.

In contrast, lossless flow control guarantees that buffers will never overflow, ensuring no data loss occurs. This approach, inherited from 
hardware engineering where processors never drop data, eliminates wasted communication capacity and minimizes delay. However, lossless systems 
introduce their own complexities, requiring multi-lane protocols to avoid head-of-line (HOL) blocking and to break potential cyclic buffer dependencies 
that can create deadlock. The choice between lossy and lossless approaches profoundly impacts system architecture and performance characteristics.

{: .center}
![Lossy vs. Lossless](/images/post33/fig3.png "Lossy vs. Lossless")

Ref: [Credit Based Flow Control](https://www.csd.uoc.gr/~hy534/16a/s61_creditFC_sl.pdf)

# Classification of Flow Control Schemes

Flow control schemes can be classified along multiple dimensions, each representing different design choices and trade-offs. The first 
major distinction is open-loop, closed-loop and hybrid control. Open-loop admission control makes static decisions at connection setup 
time, while closed-loop adaptive flow control continuously adjusts during runtime based on current conditions. Within the closed-loop 
systems, we further distinguish between implicit and explicit feedback mechanisms, end-to-end vs. hop-by-hop control, rate-based versus 
credit-based approaches (including window and back-pressure mechanisms), and indiscriminate versus per-flow control.

## Open vs. Closed-Loop Flow Control

### Open-Loop Control

Open-loop flow control requires a source to request and secure network resources before initiating data transmission. After making this 
request, the source must await approval, incurring at least one round-trip time (RTT) of additional delay compared to closed-loop methods. Once 
approved, the source transmits at the allocated, reserved rate. While this approach guarantees predictable service quality, it comes with 
significant drawbacks. Reserved but idle resources cannot be dynamically reallocated to other users, potentially leading to poor 
resource utilization. Historically, open-loop control has its roots in telephony systems, inheriting a binary approach to resource 
allocation: either admit new flows at the risk of degraded quality for existing flows or refuse new requests entirely. This rigid model 
often feels outdated in modern data networks.

Key characteristics of open-loop control:
- Sources must explicitly request network or destination resources.
- Transmission begins only after receiving explicit approval, causing additional delay (at least one RTT).
- Guaranteed resources cannot be reassigned dynamically, potentially causing under-utilization.

### Closed-Loop Control

Closed-loop flow control represents a fundamentally different strategy. Here, sources start transmitting data immediately without 
preliminary resource reservation. Instead, network resources are dynamically shared among active users based on priorities or weighted 
factors. Closed-loop systems significantly reduce initial delays and enable efficient resource allocation through statistical multiplexing.

Key characteristics of closed-loop control:
- Immediate transmission without prior approval.
- Dynamic allocation and sharing of network capacity based on prioritization and weighting mechanisms.

### Hybrid Schemes

Hybrid flow control schemes aim to blend advantages from both open and closed-loop strategies. Sources reserve and receive guaranteed 
minimum capacities, providing predictable baseline performance. Beyond these guarantees, resources are dynamically allocated, ensuring 
efficient and flexible utilization of residual network capacity.

Key characteristics of hybrid schemes:
- Guaranteed minimum resource reservation for predictable performance.
- Dynamic sharing of remaining network resources.

## Explicit vs. Implicit Feedback Mechanisms

Another crucial aspect of flow control design is the method of detecting and communicating network congestion. The two primary 
approaches are explicit and implicit feedback mechanisms, each with distinct advantages and disadvantages.

### Explicit Feedback Mechanisms

Explicit feedback mechanisms directly measure congestion within the network and communicate that information back to the sender 
using specialized signaling messages or headers. Instead of waiting for packet loss as an indirect sign of congestion, explicit 
methods proactively detect issues—such as rising queue lengths or increasing delays—and immediately inform data sources. This allows 
senders to quickly adjust their transmission rates, typically within a single round-trip time (RTT). Explicit feedback provides 
three key advantages:

1. **Avoids packet loss:** Because congestion is detected and reported early, senders can slow down before queues overflow. This 
reduces or eliminates the need for packet retransmissions, making data transmission more efficient.

2. **Rapid reaction to congestion:** Real-time congestion signals travel alongside regular data traffic, enabling senders to adjust 
their rate almost immediately. This prevents long delays caused by waiting for timeout-based detection methods.

3. **Flexible rate control policies:** Since explicit feedback does not rely on packet drops, network operators can independently design 
and tune rate-allocation strategies. For example, it becomes easier to implement fairness policies, prioritize latency-sensitive traffic, 
or guarantee minimum bandwidth to specific traffic classes without complicated drop configurations.

Practical implementations of explicit feedback include ATM’s ABR resource management cells, InfiniBand’s credit-based flow control, 
and modern ECN-based protocols. 

### Implicit Feedback Mechanisms

Implicit feedback mechanisms detect congestion indirectly, usually by noticing when packets are lost. Instead of directly measuring 
network conditions, the sender relies on missing acknowledgments (ACKs) or timeouts to identify congestion. While this approach is 
simple to implement, it has several limitations:

1. **Inefficient by design:** Congestion must first cause packets to be dropped before the sender notices a problem. This results in 
unnecessary retransmissions, wasting network bandwidth.
2. **Delayed response:** The sender must wait until a timeout occurs or duplicate ACKs are received, causing delays before corrective 
action is taken. This slow response reduces the effectiveness of congestion management.
3. **Unclear reason for packet loss:** Implicit feedback cannot distinguish whether packet loss is due to congestion, faulty hardware, 
or transmission errors. This ambiguity complicates network troubleshooting and makes accurate adjustments difficult.

Explicit feedback avoids these problems by directly signaling congestion before packet loss happens. Although explicit methods are 
somewhat more complex to implement, they provide quicker responses, reduce wasted bandwidth, and deliver clearer insights into network 
conditions. 

## End-to-End vs. Hop-by-Hop Control

The scope of flow control presents a final major design choice. End-to-end flow control manages the flow between ultimate source and 
destination, providing a simpler implementation at the cost of longer feedback paths and slower response times. The extended feedback 
loop makes it practically impossible to guarantee lossless operation in end-to-end systems, as the amount of data in flight during the 
feedback delay can exceed available buffer capacity.

Hop-by-hop flow control manages flow between adjacent network nodes, enabling faster response to congestion and making lossless 
operation practical. However, this approach requires more complex implementation and coordination between nodes. The shorter control 
loops in hop-by-hop systems enable more precise control and better isolation between different network segments, but at the cost of 
additional protocol complexity and potential for control loop interactions.

{: .center}
![End vs Hop](/images/post33/fig4.png "End vs. Hop")

## Rate Based Flow Control

In Rate-Based flow control, a contention point (switch, NIC, etc) measures some local metric that correlates with congestion 
(queue depth, output link utilisation, latency etc.) and feeds back a target sending rate or rate adjustment to the upstream sender. 
The sender then shapes its traffic so that its instantaneous departure rate follows that target.

Feedback style can be either Absolute or Differential. In the case of Absolute, Old rate($\lambda$) is replaced by new rate $\lambda_{new}$ (e.g. 
limit to X Gb/s), sender replaces current rate $\lambda \to \lambda_{new}$.  In the case of differential, rate adjustment is like 
"Speed-Up by $\bigtriangleup$" or "Slow-down by $\bigtriangleup$".

Absolute control converges in a single RTT is coarse; differential control is Lightweight on the wire and can track non-stationary traffic.

{: .center}
![Rate Based](/images/post33/fig5.png "Rate Based")

### Simplistic Rate Based Flow-Control (ON/OFF)

The simplest form of differential rate-based flow control is a two-level threshold-based scheme, commonly called ON/OFF or XON/XOFF flow control. Its operation 
is straightforward:

- When the receiver’s buffer occupancy hits a high watermark threshold, it sends an XOFF signal, instructing the sender to 
immediately stop transmission (sender rate $\to$ 0).
- Once the receiver buffer drains and occupancy falls below a lower low watermark threshold, it sends an XON signal, instructing the 
sender to resume transmission at the full, unrestricted rate (sender rate $\to$ peak).

Although this method is trivial to implement and widely used in standards like Ethernet Pause (802.3x) and Priority Flow 
Control (802.1Qbb), it is inefficient in terms of buffer usage. The inefficiency arises primarily because ON/OFF control signals are 
threshold-triggered rather than continuously updated based on precise buffer state, unlike credit-based flow control. 

{: .center}
![PFC](/images/post33/fig6.png "PFC")

#### Propagation Delay Overshoot

When the receiver’s buffer occupancy reaches the high watermark, it sends an XOFF signal. However, due to the propagation delay, 
the sender will continue to transmit packets until it actually receives and processes the XOFF signal. This delay leads to an overshoot 
in buffer occupancy, requiring sufficient extra space in the receiver buffer to accommodate packets already "in-flight." We can look at 
this at a high level as a sum of Reaction data, Wire data and small far-end data.

**Reaction Data**:  From the instant the near-end queue crosses $X_{off}$ until the far-end stops transmitting. This is basically time it 
takes to generate Pause frame, Traveling it back to the sender and the action time for the sender to pause the frame. 

$$
\hspace{5cm} \text{Reaction data} = R \times (T_{gen} + \text{Link Delay(One Way)} +T_{action})
$$

{: .center}
![PFC1](/images/post33/fig7.png "PFC1")

**Wire Data**: The time after the last bit has left the far-end but has not yet reached the near end. 

$$
\hspace{5cm} \text{wire data} = R \times \text{Link Delay(One Way)}
$$

{: .center}
![PFC2](/images/post33/fig8.png "PFC2")

There is some minor residual data from small far-end and near-end data which is in flight in addition to the reaction and wired data. So 
the total Headroom Buffer which needs to accommodated

$$
\hspace{5cm}  \text{HeadRoom}=  \text{Reaction Data} +  \text{Wire Data} +  \text{Small near-end data} +  \text{Small far-end data}
$$

Although for the sake of simplification, I am putting various components into big buckets of delays, one thing worth observing is 
that in both Reaction Data and Wire data, Link delay is a factor. As the link length starts growing, that becomes the dominating factor.

#### Hysteresis Margin to Avoid Oscillation

If we drop the pause as soon as the queue falls below $X_{OFF}$, the far-end starts transmitting again while local-queue still 
holds the residual bytes generated during the previous pause window, the queue can immediately re-hits the $X_{OFF}$ and we send yet 
another $\text{PAUSE}$. This will create oscillations between ON and OFF states also called as chattering. 

To avoid rapid oscillation between ON and OFF states, the receiver does not resume transmission immediately upon dropping slightly 
below the high watermark. Instead, a significant gap—the hysteresis window—is deliberately maintained between the high ($X_{OFF}$) 
and low ($X_{ON}$) thresholds. Typically, this hysteresis window is generally another full Reaction Data worth of packets (or some % 
of Pause threshold), ensuring that by the time transmission restarts, the buffer occupancy remains comfortably below the high watermark, 
to maintain system stability. 

{: .center}
![PFC3](/images/post33/fig9.png "PFC3")

#### Impact of Link Delay and Rate 

As we looked earlier that for headroom and the gap between XOFF and XON depends on the Reaction data and Wire data which are main 
contributors. As either distance or data rate increases, more bytes are “in flight,” requiring larger buffers to avoid packet loss. 

The below plot shows that at shorter distances, buffer requirements are modest and dominated primarily by fixed 
silicon delays (interface and higher-layer delays), but as the link length or speed grows beyond a certain point, the buffer requirement 
dramatically increases, driven predominantly by the propagation delay (which adds additional bytes proportional to the bandwidth-delay 
product). The plot assumes MTU = 9,216 bytes, PFC/PAUSE frame size = 64 bytes, Interface Delay = 250ns, Higher-layer delays = 100ns.

{: .center}
![PFC4](/images/post33/fig10.png "PFC4")

## Credit-Based flow control

In credit-based flow control, communication occurs between a sender and receiver. Since the sender only learns about buffer availability 
at the receiver only after an RTT delay. To regulate transmission, the sender uses “credits,” with each credit representing space in the 
receiver’s buffer. Transmission is permitted only when the sender has available credits. Upon processing a packet, the receiver returns 
a credit back to the sender, signaling that buffer space has become available again. 

So essentially RTT defines the control-loop delay, during this window sender's view of the buffer is stale, so receiver needs to have 
enough space to hold every data injected by the sender in one RTT.  

{: .center}
![CBFC1](/images/post33/fig11.png "CBFC1")

So one question arises here is, how big the buffer should be at the receiver to ensure that the communication remains loss-free and receiver has 
always enough data to keep its outgoing link fully utilized despite the presence of RTT delay. The answer turns out to be a buffer of one BDP is 
needed to keep the link loss-free while maintaining full utilization. At the sender, the data only leaves if a credit (representing a free slot) has already 
arrived. With $buffer \geq Rate \times RTT$, overflow is impossible even under abrupt stop/start conditions.

So let's look at a toy example, by assuming:

- Link Rate = 1 cell/time unit (tu). 
- One-way delay = 3 time units. 
- RTT = 6 time units.
- BDP = Rate x RTT = 1 x 6 = 6 cells.
- Receiver Buffer = 6 cells.

 Initial state (t=0):
- Receiver has dequeued 3 cells, which has resulted in sending 3 more credits back to the sender. Receiver buffer is empty at this point, but 
the receiver has just become congested, resulting in no dequeue happening. 
- Sender already has 3 credits from earlier dequeues. 

The below picture shows that 3 cell credits are in transit and the sender has sent 3 data cells towards the receiver, and it's credit count is 0. 

{: .center}
![CBFC2](/images/post33/fig12.png "CBFC2")

Once the 3 cells arrive at the receiver, sender also gets 3 more credits which results in injecting 3 more data cells, which receiver can accommodate, once full at 
this point the sender is stalled until it gets more credits.

{: .center}
![CBFC3](/images/post33/fig13.png "CBFC3")

Below is a time sequence diagram (“Click to enlarge”) which goes through all the events in more detail.

{: .center}
[![CBFC4](/images/post33/fig14.png "CBFC4")](/images/post33/timeline_full.png)

At time 6, buffer reaches 4/6 occupancy. The sender has consumed all 6 credits and sent 6 cells. This demonstrates why we need at least 6 cells of buffer - 
otherwise, cells arriving after time 6 would be dropped. A reader can play the same scenario with the initial conditions and with a buffer less 
than 6, and observe that it will result in a drop at the receiver.

### Infinite‑Queue Equivalence

For a link of rate R and round‑trip time (RTT), a receiver buffer protected by credit‑based flow control and sized to the bandwidth–delay product.

$$
\hspace{5cm} \text{BDP}=R\times RTT
$$

is strictly loss‑free and is indistinguishable, from the sender’s perspective, from an infinite queue positioned immediately downstream.


The “infinite queue” upstream is a conceptual tool—this theorem says that a finite downstream buffer (with credits) behaves exactly as if the sender 
sees an infinitely large queue directly in front of it. If the downstream ever got full, this scenario never actually happens; instead, the 
sender slows down in advance (because credits stop arriving) making it look like the infinite buffer upstream simply “pushes back” the data, 
never overflowing downstream.

{: .center}
![CBFC5](/images/post33/fig15.png "CBFC5")

Let's assume that we have:
 
   * DD(t) – cumulative downstream departures physically exiting the downstream node up to time `t`. 
   * UD(t) – cumulative upstream (sender) departures up to time `t`. it's the data sent by the upstream node, and depends directly on credits returned after downstream departures. 
   * DA(t) – cumulative data arrivals into the downstream buffer.  
   * Service‑rate constraint: $0\;\le\;DD(t+d)-DD(t)\;\le\;R\,d$. This is basically is that the amount of data exiting the node is less than or equal to $Rate \times d$, where is 
d is the time delta between `t+d` and `t`.

{: .center}
![CBFC6](/images/post33/fig16.png "CBFC6")

{: .center}
![CBFC7](/images/post33/fig17.png "CBFC7")

Ref: [Credit Based Flow Control](https://www.csd.uoc.gr/~hy534/16a/s61_creditFC_sl.pdf)

**Credit rule**:  At any instant the sender owns exactly the credits that represent free slots in the receiver buffer. Immediately after start‑up the sender holds $R\times RTT=\text{BDP}$ credits.

**Upstream departures**: Because the sender can transmit only when it owns credits, and each departure consumes one credit. 

$$
\hspace{5cm} UD(t) = DD(t - RTT) + RTT \times R
$$

At the start, sender has exactly $RTT \times R$ credits(This is the initial credit window). After initial credits are spent, new credits arrive exactly RTT time after 
downstream departs data. Thus, the total sent upstream at time “t” is the total departed downstream by (t - RTT) plus initial credits.

**Downstream Arrivals**: Since data takes exactly RTT to travel from upstream to downstream, we can say that Downstream Arrival function $DA(t)$ can be given as:

$$
\hspace{5cm} DA(t)=UD(t-RTT)=DD(t-RTT)+R\times RTT .
$$

This means that the data entering the downstream buffer at time “t” corresponds exactly to the downstream departures one RTT earlier, plus the fixed initial credit window.

**Buffer Occupancy:** The occupied buffer can be represented as the difference between data packets arriving and data packets departing.

$$
\hspace{5cm} BO(t)=DA(t)-DD(t)=R\times RTT-\bigl[DD(t)-DD(t-RTT)\bigr].
$$ 

The bracketed term $\bigl[DD(t)-DD(t-RTT)\bigr]$ is non‑negative and at most $R\times RTT$ by the service‑rate constraint, so

$$
\hspace{5cm} 0\;\le\;BO(t)\;\le\;R\times RTT=\text{BDP}.
$$ 

Hence, the buffer never overruns, and from the sender’s viewpoint the system behaves as if any excess data were “pushed back” into an infinite upstream queue.

#### BDP Sufficiency & Necessity (Corollary)

The proof establishes that a buffer of exactly one BDP is sufficient for lossless operation. Conversely, if the buffer were any smaller, the 
worst‑case blind‑period injection of $R\times RTT$ bytes could overflow it, so the BDP size is also tight. This formalises the sizing rule 
introduced in Credit‑Based Flow Control and quantified with the toy example there. 

## Comparing Credit-based vs. XON/XOFF

So we looked at both credit-based and XON/XOFF flow control mechanisms. As the link distance or link rate or both increases, Credit based scheme 
requires less buffer than XON/XOFF scheme.

**Credit-Based:** The minimum buffer requirement is precisely one BDP, ensuring overflow is inherently prevented:

$$
\hspace{5cm} B_{\min}=R \times RTT \quad(\text{one BDP})
$$

**XON/XOFF:**  The buffer headroom for XON/XOFF includes three distinct components:

- **Reaction Data:** Bytes transmitted during pause frame generation, propagation, and sender pipeline drain. $R(T_{gen}+T_{link}+T_{act})$
- **Wire Data:** Bytes already in transit on the link. $R\,T_{link}$
- **Hysteresis:** Typically another full reaction-data segment to prevent frequent toggling (ON/OFF chatter). 

The total buffer headroom requirement thus becomes:

$$
\hspace{5cm} \text{HeadRoom} = R(T_{gen}+T_{link}+T_{act})+ R\,T_{link}+\text{Hystersis (Another reaction data worth of space)}
$$

Because both reaction and wire-data terms scale linearly with link length, the overall buffer demand for XON/XOFF increases 
faster than BDP over longer distances.

# Flow Control in Switch ASICs

## Why do we need Parallel Pipelines?

So assume that we want to build a 25.6 Tbps (32 x 400G) switch. This translates into packet processing rate of $\approx$ 38 
billions pps for small 64-byte packets and $\approx$ 11.6 billion pps for 256 byte sized packets. If the switch asic is clocked 
at 1.2GHz, and 256B wide data bus, processing packets each clock cycle, a single pipeline can handle at most $\approx$ 1.2 
billion pps. This mismatch results in mandating parallelism. So typically trade-offs are made where we give up line rate for 
small packet sizes to keep the number of parallel pipelines small and parallel pipelines with wider internal datapaths allows 
to process more packets per second to maintain the overall switch throughput.

### Minimum Required Parallelism

A simple crude way to calculate the number of parallel pipelines we will need is by:
- Calculate the packet arrival rate.
- Calculate Single Pipeline processing rate.
- Calculate the number of Pipelines needed.

**Calculate the packet arrival rate (R):**
Packets on a link with a Bandwidth `B` bits per second, payload size `S` bytes, and overhead `G` bytes (includes 
preamble, SFD, IFG etc.) arrive at an average rate given by:

$$
\hspace{5cm} R = \frac{B}{8 \times (S+G)}
$$

**Calculate Single Pipeline Processing Rate(r):**
If each pipeline operates at a clock frequency $f$ (in Hz), has a datapath width `W`(in bytes), `c` is the packets per clock 
cycle, and processes packets that requires multiple cycles if they exceed the bus width, the single pipeline processing rate 
is:

$$
\hspace{5cm} r = \frac{f}{\left\lceil(\frac{S+G}{W})/c\right\rceil}
$$

Here, $\left\lceil(\frac{S+G}{W})/c\right\rceil$ represents the number of cycles required to process each packet, determined 
by the datapath width and packets per clock cycle.

**Determine Required Parallelism (P):**

To avoid packet loss, the number of parallel pipelines required is calculated as: 

$$
\hspace{5cm} P = \frac{R}{r} = \frac{B}{8(S+G)}\times \frac{\left\lceil(\frac{S+G}{W})/c\right\rceil}{f}
$$

If $P \gt 1$, multiple pipelines are required.


Below plot shows the number of pipelines needed, assuming 1.3 GHz, 256B databus for 12.8 Tbps, 25.6 Tbps and 51.2 Tbps.

{: .center}
![PP](/images/post33/fig18.png "PP")

Here is an abstracted logical view of what it looks like. Some vendors will also refer to this as a slice.

{: .center}
![PP1](/images/post33/fig19.png "PP1")

## Flow Control between Ingress and Egress

This brings us to the flow control mechanism between the ingress and egress pipelines within modern switches. Broadly, these 
ASICs can be classified into two categories based on their internal memory architecture. Monolithic ASICs have ingress and 
egress sides that share a common memory domain. Due to this shared memory architecture, congestion and buffer occupancy can 
be effectively managed using simple threshold-based counters. In these switches, the scheduler can directly observe the 
occupancy state of each egress queue by checking local occupancy counters, removing the need for explicit flow-control 
messaging.

On the other hand, there is another category of ASICs designed for distributed-style switches, either as a single-chassis or 
distributed architectures like DSF/DDC. These ASICs distribute buffering and forwarding responsibilities across separate ASICs 
interconnected via a switching fabric. The internal fabric usually will have a speed-up, ex: jericho 2c+ has a 33% speedup. Since 
ingress and egress ASICs maintain separate memory domains without direct visibility into each other’s occupancy states, explicit 
flow-control communication becomes necessary. Typically, this is implemented using Credit-Based Flow Control (CBFC), where ingress 
ASICs transmit data only after receiving explicit credits (grants) from egress ASICs, ensuring data transmission never exceeds the 
available buffering capacity at the egress. A receiver grants explicit credits to the sender, each credit representing permission 
to send a fixed number of bytes, known as the credit quantum. Additionally, these distributed-style systems often route packets 
internally as fixed-size cells to simplify scheduling and improve efficiency. However, some implementations do not break the packets 
into fixed-size cells.

Below is an abstracted view where the egress scheduler gives a credit grant to the Ingress before it can send the data to egress. It's 
also worth mentioning that having VOQ doesn't necessarily mean that it's using CBFC for flow control (ex: monolithic ASICs), as 
these two things are orthogonal, which folks sometimes confuse the two.

{: .center}
![PP2](/images/post33/fig20.png "PP2")

## Credit Quantum Sizing

As we saw that the receiver grants explicit credits to the sender, each credit representing permission to send fixed amount of data, 
known as the credit quantum. One question is how big or small the credit quantum size should be. If it's too small then it will 
lead to high control plane overhead, or if it's too big then it could result in inefficient utilization.

A small credit quantum means each credit message covers fewer bytes, which requires the receiver to issue more frequent credit 
messages, placing a higher demand on the control plane resources. On the other hand, if the credit quantum is too large, may result 
in being inefficient. 

The credit scheme, also need to make sure that it releases enough credit to account for the delay between the sender and receiver, 
and with no loss of throughput at the receiver. For example, let's assume that we have:

- Clock rate: 1 GHz
- Credit issue rate: 1 credit every 2 clock cycles, 0.5G credits per second.
- Rate: 400Gbps (50 GBps)
- Fabric Speed-up: 1.05 (5%)
- Cell size: 256B
- RTT Control loop delay: .8 $\mu\text{s}$

So with the above the minimum credit rate needs to be at least $C_{min} = \frac{50 GBps}{0.5}= 100\text{B}$ to keep the port busy. If 
we account for 5% speed-up in the fabric, then its $105\text{B}$. Typical cell size is 256 Bytes, so we can round this to 256 Bytes per credit.

If the credits are given at a slice level and not port level, for example, let's say 18 x 400G is one slice, then it will be $\approx 1800\text{B}$, which 
can be rounded to the nearest $2KB$ as the size of the credit. When sizing the credit quantum, some practical limits to keep in mind are: (1) the scheduler 
must issue credits fast enough to keep the pipe full, (2) on-chip counters must be wide enough to track all in-flight credits without roll-over, and (3) a 
small fabric speed-up is sometimes needed to mask any residual scheduler slack.

This does bring a fact that you have to be aware about how the credits are issued - Is it at a slice level or port level. If it's at a 
slice level then it can result into unfairness. 

{: .center}
![PP3](/images/post33/fig21.png "PP3")

Unfairness can happen at Slice level and this can be fixed by using Port level allocation though I think it will result in more 
control plane overhead in terms of credit message generation. It's worth mentioning this more of how a scheduler is allocating a 
resource problem then the whole credit/grant system and is applicable to monolithic ASICs as well. 

| Port  | Expected | Reality |
|-------|----------|---------|
| Port0 | 33%      | 25%     |
| Port1 | 33%      | 25%     |
| Port2 | 33%      | 50%     |

The worst amount of data which can be outstanding between ingress to egress will be ~1x BDP worth. Which in our example will be 
around 400Gbps (50 GB) x 800 ns = 40KB. Assuming 256B per cell, it is about ~156 in-flight cells. This also means the egress needs 
to have a small buffer worth at least ~40KB to ingest to avoid any drops.

## Buffering in the Cell Fabric

The cell fabric whether it's internal to a switch fabric or distributed chassis have some minimal buffering to handle the contention 
when cells from multiple inputs may compete for an output link. Shallow buffers are also important to provide minimal latency and 
jitter for the cells traveling the fabric.

{: .center}
![PP4](/images/post33/fig22.png "PP4")

The amount of buffering needed can be modeled by M/D/1 queueing model.

### Intuition behind using M/D/1 Queuing Model

Imagine you're at a toll booth on a highway. Each car represents a data cell arriving at an output link. Now, consider two 
different scenarios:

- **Scenario 1: M/M/1 queue**  
    Cars (data cells) arrive randomly — that’s the Markovian (M) arrival process. The toll booth operator also processes each car in a random amount of time — sometimes fast, sometimes slow. This randomness in both arrival and service times makes the system highly variable.

- **Scenario 2: M/D/1 queue**  
    Cars still arrive randomly, but the toll booth operator is now a machine that takes exactly 60 seconds to process each car, no matter what. The arrival process is still Markovian, but service is Deterministic (D).

Now ask yourself: which scenario would we rather be stuck in as a driver? The second one, with the predictable machine, will 
always have shorter average queues. Why? Because unpredictability compounds. In the M/M/1 case, you might face a burst of cars 
and slow processing at the same time — a worst-case scenario. But in M/D/1, you remove one major source of randomness: the 
service time. This greatly improves queue behavior and average wait times.

This is exactly what happens with a cell-based switching fabric. Cells may arrive randomly from multiple ingress points, but 
because each cell has a fixed size, the time to transmit each one is deterministic. That is, the service time is constant. This 
deterministic behavior in transmission mirrors the M/D/1 scenario. By eliminating variability in service time, the system 
maintains shorter queues and better overall throughput — even under bursty traffic conditions.

### Why Deterministic Service Helps

As we mentioned earlier, in an M/M/1 queue, you have two sources of randomness fighting each other. The queue length at any 
moment depends on the accumulated difference between random arrivals and random departures. It's like taking a random walk 
where both your forward and backward steps are random; we can wander quite far from the origin.

In an M/D/1 queue, you've replaced one random process with a deterministic process. Every tick, exactly one customer leaves 
(if there's anyone in the queue). The only randomness comes from arrivals. This is like a random walk where you always take 
exactly one step backward each time unit, but take a random number of steps forward. We will still wander, but much less wildly.

Mathematically, this manifests as the average queue length being exactly half in M/D/1 compared to M/M/1. For instance, if 
utilization $\rho = 0.9$, an M/M/1 queue averages 9 customers waiting, while M/D/1 averages only 4.5. 

Queuing result comparison between M/M/1 and M/D/1, where $\mu$ is the service rate,  $\lambda$ is arrival rate and $\rho$ is $\frac{\lambda}{\mu} (0 \lt \rho \lt 1)$.

| Metric            | M/M/1                        | M/D/1                       |
|-------------------|------------------------------|-----------------------------|
| Avg. Queue Length | $\frac{\rho^2}{(1-\rho)}$    | $\frac{\rho^2}{2(1-\rho)}$  |
| Avg. Waiting time | $\frac{\rho}{(\mu-\lambda)}$ | $\frac{\rho}{2\mu(1-\rho)}$ |

### Tail probability behavior

Typically, we don't just care about average behavior; we also care about rare events. What's the probability that the queue 
exceeds some large value N? This helps in determining for example, how much buffer memory we need to avoid dropping cells. 

Imagine tracking the queue size over time as a graph. Most of the time, it hovers around its average value. Occasionally, it 
spikes up due to a burst of arrivals. The tail probability P(Queue $\gt$ N) tells us how often these spikes exceed level N.

For both M/M/1 and M/D/1, these probabilities decay exponentially with N, but the decay rates differ. The M/D/1 queue "decays" 
faster, meaning large queues are even rarer than in M/M/1.

Queueing theory is a rabbit hole of its own, and diving deep into M/D/1 would take us too far afield. I’ll likely cover that in a separate post down the line.
However, we can look at M/D/1 Tail probability behavior using Large Deviation (LD) approximation, which can be given as:

$$
\hspace{5cm} P\{Q \gt N\} \approx C_{q}e^{-\theta N}
$$
with $\theta$ solving $\rho(e^{\theta}-1) = \theta$ and $C_{q}=\frac{1-\rho}{\rho+e^{-\theta}}$.

The way to solve theta $\theta$ is by using iterative algo's like Newton-Raphson method. If we want the Queue to be no larger 
than some target $P_{max}$ (e.g. $10^{-6}$), We can figure it out by using inequality

$$
\hspace{5cm} C_{q}e^{-\theta N} \leq P_{max}
$$

Which will reduce to 

$$
\hspace{5cm} \begin{equation} N \geq \frac{logC_{q} - logP_{max}}{\theta} \end{equation}
$$

For example, if we want to find what are the chances i.e. on an average at most one packet in a million arrives to a full queue, 
and what should be the size of the queue when the utilization rate is 90% ($\rho = 0.9$). Solving for the above equation, we 
get ~53 cells, which is $\approx 13.5kB$.

# Conclusion

This turned out longer than planned—classic case of flow control without a rate limiter :). I will leave the final conclusions 
to you. If you found it helpful, great! And if you spot any errors, think of them as lost packets—feel free to resend with 
corrections. 

# References

- [CS-534: Credit Based Flow Control](https://www.csd.uoc.gr/~hy534/16a/s61_creditFC_sl.pdf)
- [The Geometry of M/D/1 Queues and Large Deviation](https://onlinelibrary.wiley.com/doi/10.1111/1475-3995.00351)
- [Buffer requirements of credit-based flow control when a minimum draining rate is guaranteed](https://ieeexplore.ieee.org/document/864039)
- [Determining Priority Flow Control Headroom](https://www.ieee802.org/1/files/public/docs2021/cz-finn-pfc-headroom-0629-v01.pdf)
- [Annex N Updates](https://www.ieee802.org/1/files/public/docs2024/dt-lyu-annex-n-update-slide-0324-v01.pdf)
- [Receiver-Oriented Adaptive Buffer Allocation in Credit-Based Flow Control for ATM Networks](https://www.eecs.harvard.edu/~htk/publication/1995-infocom-kung-chang.pdf)
