---
layout: post
title:  Fat-Trees Routing Protocol Evaluation
---

Network design discussions often involve anecdotal evidence, and the arguments for preferring something follow up with 
*"We should do X because at Y place, we did this."*. This is alright in itself as we want to bring the experience to avoid 
repeating past mistakes in the future. Still, more often than not, it feels like we have memorized the answers and 
without reading the question properly, we want to write down the answer vs. learning the problem and solution space, putting that into the current context we are trying to 
solve with discussions about various tradeoffs and picking the best solution in the given context. Our best solution 
for the same problem may change as the context changes. Also, this problem is everywhere. For example: Take a look at this [twitter thread]( https://twitter.com/rakyll/status/1542583543187943425 )
 
Maybe one way to approach on how to think is to adopt [stochastic 
thinking]( https://ocw.mit.edu/courses/6-0002-introduction-to-computational-thinking-and-data-science-fall-2016/resources/lecture-4-stochastic-thinking/) 
and add qualifications while making a case if we don't have all the facts. The best engineers I have seen do apply similar 
thought processes. As world-class poker player Annie Duke points 
out in [Thinking in Bets](  https://www.amazon.com/Thinking-Bets-Making-Smarter-Decisions/dp/0735216355), even if you 
start at 90%, your ego will have a much easier time with a reversal than if you have committed to absolute, eternal certainty.
 
Now we aren't going to fix human behavior anytime soon. However, purely from an analytical perspective, for us to be able 
to quantify things, many times, we need to rely on modeling and simulation. But often, those frameworks don't exist. One 
such area was quantifying routing protocol implementation behavior for a given topology until [Sibyl Framework]( https://compunet.ing.uniroma3.it/assets/publications/Caiazzi-Scazzariello-Sibyl.pdf) 
came out to help us. At a high level, It proposes various metrics to measure routing protocol implementation, allows you 
to spin up the topology of a given size with a given protocol implementation, and then measures those metrics for a given failure.


# Sample Topology

We will start with the most basic topology to understand various metrics for a convergence event using Node Failure as a trigger event. 
In the below example, we have a simple 3-level Fat-Tree with a radix of 2. We will use FRR based eBGP for routing. One 
thing to note is that Sibyl refers to T3 switches as the Top of the fabric (tof). For type of failure test, we will assume Node 
failure and fail leaf_1_0_1.

{: .center}
![Sample Topology](/images/post18/fig_1.png "Sample Topology")

The routing stack is FRR. One behavior to remember with FRR/eBGP is that an ebgp neighbor advertises the routes back to its 
neighbor from whom it learned, which will eventually get rejected due to the AS-Path loop. This is important because it impacts the number of 
packets getting injected as part of a convergence event.
 
For example,  if we have three routers  `R1 - R2 - R3` using eBGP peering. You can see in the below output how R2 is advertising the 
R1 learned route back to R1. when R1 stops advertising its 10.0.0.1/32 to R2, we will see two BGP withdraws between R1 - R2.  
R1 will send one BGP withdraw to R2, and R2 will send a BGP withdraw to R1. If you are curious about why that behavior is, 
refer to this [thread](https://github.com/FRRouting/frr/discussions/10052).

```textmate
### R2 has eBGP session to R1 and R3.

R2# show ip bgp summary                                              

Neighbor        V         AS   MsgRcvd   MsgSent   TblVer  InQ OutQ  Up/Down State/PfxRcd   PfxSnt Desc
R1(eth1)        4      65000        62        61        0    0    0 00:02:21            1        3 R1
R3(eth2)        4      65002        62        61        0    0    0 00:02:21            1        3 R3

### R2 has 10.0.0.1/32 from R1 in the BGP RIB.
R2# show ip bgp                                                      

   Network          Next Hop            Metric LocPrf Weight Path
*> 10.0.0.1/32      10.1.0.1(R1)             0             0 65000 i
*> 10.0.0.2/32      0.0.0.0(R2)              0         32768 i
*> 10.0.0.3/32      10.1.0.6(R3)             0             0 65002 i

### R2 is receiving 10.0.0.1/32 from R1
R2# show ip bgp neighbors 10.1.0.1 received-routes                   

   Network          Next Hop            Metric LocPrf Weight Path
*> 10.0.0.1/32      10.1.0.1                 0             0 65000 i
*> 10.0.0.2/32      10.1.0.1                               0 65000 65001 i
*> 10.0.0.3/32      10.1.0.1                               0 65000 65001 65002 i

### R2 is advertising 10.0.0.1/32 back to R1
R2# show ip bgp neighbors 10.1.0.1 advertised-routes                

   Network          Next Hop            Metric LocPrf Weight Path
*> 10.0.0.1/32      0.0.0.0                                0 65000 i
*> 10.0.0.2/32      0.0.0.0                  0         32768 i
*> 10.0.0.3/32      0.0.0.0                                0 65002 I
```

If we look at the BGP events at R3, When the prefix is unreachable on R1, R3 receives a withdrawal from R2 and then 
sends another withdrawal back to R2.

```textmate
Withdraw Received:
2022-12-28 20:35:21.329 [DEBG] bgpd: [PAPP6-VDAWM] eth1(R2) rcvd UPDATE about 10.0.0.1/32 IPv4 unicast -- withdrawn

Withdraw sent

2022-12-28 20:35:21.380 [DEBG] bgpd: [WHJ94-YXNE1] u1:s1 send UPDATE 10.0.0.1/32 IPv4 unicast -- unreachable
2022-12-28 20:35:21.380 [DEBG] bgpd: [G259R-NCBEJ] u1:s1 send UPDATE (withdraw) len 28 numpfx 1
2022-12-28 20:35:21.380 [DEBG] bgpd: [QYC2K-N0CET] u2:s2 send MP_UNREACH for afi/safi IPv6/unicast
```


# Framework Methodology

The Sibly framework methodology includes failure and recovery tests. Failure tests include common faults like a node or link failure and 
measure how a routing protocol implementation reacts to those failures. For a given test, it verifies that the fabric 
has converged, measures the messaging load induced as part of the event, the blast radius (locality) of the messaging 
load, and the Number of rounds it took for the implementation to converge.
 
The framework avoids time synchronization issues by using a logical clock and only counts the relevant PDUs to the event.

## Metrics

### Messaging Load

Sibyl measures the messaging load by counting the number of packets originated by a test and computes the aggregate size. 
In our example, when an NLRI is withdrawn as part of the Leaf failure, we will see two withdraws between each eBGP adjacency, 
resulting in an aggregate packet count of 6 (messaging load). We can use this to observe how the messaging load increases as the topology 
size increases. This will also allow us to compare routing protocols on how the messaging load differs on a given topology.

{: .center}
![Sample Topology](/images/post18/fig_2.png "Sample Topology")

### Locality (Blast Radius)

Sibyl measures the blast radius of a failure or recovery event by applying the following steps:

- For each link of the network, the number of packets received by the interfaces of that link is computed. Only relevant PDUs which were triggered as part of the event are counted.
- Compute the topological distance of the links from the event. Basically, how far away the link is from the event. If an event is like a Node failure, all the links attached to the node have a topological distance of 0.
- Then you combine the above two in a Vector $L[i]$ where $i$ represents the topological distance = 0,1,2, .. n and $L[i]$ represents the number of packets received by the link at that topological distance.
- A scalar value representing a metric for blast radius can be computed, which is a sum of the product of L[i] * (i+1). This inherently gives more weight to values with higher topological distance. 
 
We can use this to measure the blast radius impact for a given topology and routing protocol and also compare how the size 
of the topology grows and how various routing protocol behaves. This helps us quantify the impact.

In our example, each link observes two withdraws. This gives us a Blast Radius score of 12.

Topo Distance     1  2  3
Packets Injected  2  2  2

Blast Radius score: 1x2 + 2x2 + 3x2 = 12 

### State Rounds

One problem with just counting aggregate packet counts is that it doesn’t provide insight into how much back and forth 
happens as part of the convergence event. Rounds try to capture these waves of packets transmitted as part of a convergence 
event. First, it builds a Node State timeline, a timeline of packets sent or received by each node during the failure 
event. An arrow represents the packets being sent from one node to another node.
 
Node-state timeline for our topology. The horizontal axis is the timeline, the vertical axis is the fabric nodes, and 
the arrows represent the packets being sent from one node to another.

{: .center}
![Node State Timeline](/images/post18/fig_3.png "Node State Timeline")

From the above Node-State timeline,  it builds a Node state graph G, in which the edge captures how the Nodes transition 
between states. We can see how Node 111(spine_1_1_1) sends the packet to tof_1_2_1, which then sends the withdraw back to 
spine_1_1_1. From this graph, we can count the maximum number of edges, which is 4, I.e., it takes four rounds for the 
convergence event to be complete. 
This is fascinating as graph depth gives us a metric for the number of waves it takes for a protocol in a given 
topology to converge. The number of vertices in the graph indicates the state changes induced by an event.

{: .center}
![Node State Graph](/images/post18/fig_3.png "Node State Graph")

This is super useful as we can measure flooding events in topology, the impact of any flooding improvements claimed by a 
protocol, compare various protocols and see how noisy they are, etc.

# Protocol Comparisons

So below are some comparisons for Fat-Tree topology sizes : (2,2,1), (2,2,2), (3,3,1),(3,3,3),(4,4,1) and (4,4,2) with 
FRR BGP, IS-IS, and Openfabric implementation. A single-leaf device is used for the failure test. We should expect 
OpenFabric to perform better than vanilla IS-IS due to the flooding optimization it contains.


## Messaging Load Comparison

The below plot shows the  Messaging load (Number of packets induced) due to single leaf device failure. The X-axis contains 
the fat-tree type and the number of nodes in that fat tree. For example, a 2_2_2_(10) is a fat-tree with 10 Nodes.
It is expected that messaging load will increase as the size of the fat tree grows, but you can see how that differs among 
various protocols.

{: .center}
![Messaging Load](/images/post18/msg_load.png "Messaging Load")

## Blast Radius

{: .center}
![Blast Radius](/images/post18/blast_radius.png "Blast Radius")

## Amount of State changes

The below plot shows the total number of state changes observed as part of a failure event. This is the total number of 
vertexes in the Node-State graph.

{: .center}
![Amount of State Changes](/images/post18/amnt_state_change.png "Amount of State Changes")

## State Rounds
This measures how many cycles of waves and backwashes happened before the network converged. BGP held pretty steady in 
this regard, and IS-IS/Openfabric was chatty.

{: .center}
![State Rounds](/images/post18/state_rounds.png "State Rounds")


# Conclusion

We looked at how Sibyl introduces metrics that introduce measures for comparing routing protocol implementation on Fat-Trees
and allow us to compare various routing protocol implementations. This post only looked at how FRR's BGP, IS-IS, and 
Openfabric behave for a few Fat-Tree topologies. But this can be generalized for comparing any vendor's implementation or 
expanded to not compare implementation behavior on composite topologies, which may be a collection of fat-trees.

I want to thank Tommaso Caiazzi, for helping me sort out some initial glitches with Sibyl, and many thanks to him and the 
team for creating Sibyl.

# References
- [Sibly](https://compunet.ing.uniroma3.it/assets/publications/Caiazzi-Scazzariello-Sibyl.pdf)
- [Distoptflood](https://datatracker.ietf.org/doc/draft-white-lsr-distoptflood/)
- [OpenFabric](https://datatracker.ietf.org/doc/draft-white-openfabric/)
