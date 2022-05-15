---
layout: post
title:  IS-IS Flooding
---
## Introduction
In recent years, IGPs has become interesting again and lot of work has been done to scale IGPs for dense topologies, 
making IGPs an interesting area again. In this blog post, we will look at IS-IS Flooding and how we can measure the 
flooding rate. 


### Topology Setup
For our experiment, we will use a stripped-down topology connecting Four locations. The devices are emulated using 
Arista cEOS, and all devices are part of a single level2 flooding domain. Topology creation was done with the help of 
[netsim-tools](https://netsim-tools.readthedocs.io/en/latest/index.html) and [containerlabs](https://containerlab.dev/). 
So my regards go to everyone involved with the tool, as it took care of the monotonous 
work like IP-Addressing, wiring, and base configs. 

![Flooding Topology](/images/post11/topo1.png "Flooding Topology")

In the above diagram, Labelled nodes will be the primary focus of our deep dive. Label consists of the last 
prefix of the node name and the IP of the loopback which derives the ISIS LSP IDs. For example:

```text
pdx1-b2-t1-r1 with LSP ID of 0000.0000.0013 is highlighted as t1-r1(13) under pdx1-b2 block.
pdx1-b2-t2-r1 with LSP ID of 0000.0000.0009 is highlighted as t2-r1(09) under pdx1-b2 block.
```

![Flooding Topology Block](/images/post11/topo2.png "Flooding Topology Block")

## IS-IS Refresher

Let's do a brief IS-IS refresher. We know that IS-IS Packets are of following types:

1) IS-IS Hello (IIHs)
    - LAN Level1 IIH
    - LAN Level2 IIH
    - P2P IIH
2) Link state Protocol Data Unit  (LSPs)
3) Sequence Number Protocol Data Unit (SNPs)
    - Partial Sequence Number Protocol Data Unit (PSNP)
    - Complete Sequence Number Protocol Data Unit (CSNP)

IS-IS hello packets are for IS-IS adjacency management, and we will skip them here.Our focus will be on P2P 
adjacencies and respective behavior of SNPs PDUs.

### Link State PDU (LSPs)

LSPs are the smallest unit of LSDB which encodes the topology information. Each LSP is identified by its LSP ID, and 
Sequence number identifies the most recent version of the LSP.Sequence numbers are Unsigned 32-bit integer starting at 
0x00000001 through 0xFFFFFFFF (136 years to reach maximum if originated every second). 

The format of LSP-ID is `<System-ID> + <PseudoNode-ID>+ <Fragment-ID>` and displayed as:

```text
xxxx.xxxx.xxxx.yy-zz
```

x stands for the System-ID digits, y stands for the pseudonode-ID, and z represents the fragment number.

I have seen some confusion around the Fragment-ID. Unlike OSPF, IS-IS runs directly on top of the 
OSI-RM layer two rather than IP, so it doesn't have a built-in fragmentation function for larger MTU-sized packets. which
means IS-IS needs to build the fragmentation support itself.

So, If an IS-IS router with LSP-ID `0000.0000.0013` has to originate a 4000 byte LSP and its IS-IS MTU is 1492 bytes. It 
will need to transmit three fragments. The LSP-IDs of each fragment will be `0000.0000.0013.00`, `0000.0000.0013.01`, 
and `0000.0000.0013.02`. These LSP fragments are treated independently, except there are specific rules around fragment 
zero that an IS-IS speaker has to obey. For example, IS-IS does not care if any non-zero fragment is lost but if a 
Fragment Zero is not present, then the entire set of fragments will be declared invalid. There are some other considerations 
one needs to be aware of how an IS-IS implementation packs the updates across multiple fragments and whether a topology 
change will cause an unnecessary churn due to how updates get packed across fragments.

Below is an output of how the LSDB looks like:
```
pdx1-b2-t1-r1#show isis database

IS-IS Instance: Gandalf VRF: default
  IS-IS Level 2 Link State Database
    LSPID                   Seq Num  Cksum  Life Length IS Flags
    pdx1_b1_t2_r1.00-00           4  13589  1105    201 L2 <>
    pdx1_b1_t2_r2.00-00           3   6754  1105    201 L2 <>
    pdx1_b1_t2_r3.00-00           3  49643  1105    201 L2 <>
    pdx1_b1_t2_r4.00-00           3  52236  1105    201 L2 <>
    pdx1_b1_t1_r1.00-00           4   6817  1106    201 L2 <>
    pdx1_b1_t1_r2.00-00           5  56751  1106    201 L2 <>
    pdx1_b1_t1_r3.00-00           4   8512  1108    201 L2 <>
    pdx1_b1_t1_r4.00-00           4  42127  1107    201 L2 <>
    pdx1_b2_t2_r1.00-00           6  24013  1105    201 L2 <>
```

For example, below is an LSP with LSP-ID: sea1_b1_t1_r1.00-00 and a Sequence number of 5.If we look at the details of the 
LSP, we can see how router "sea1_b1_t1_r1" is connected with other neighbors, metric, reachability info etc. 
An LSP is a general envelope to tell all sorts of info, for example, If we would have enabled RSVP-TE in the network, 
then it would have contained necessary bandwidth related details which is required to build the TED.

```text
pdx1-b2-t1-r1#show isis database detail sea1_b1_t1_r1.00-00

IS-IS Instance: Gandalf VRF: default
  IS-IS Level 2 Link State Database
    LSPID                   Seq Num  Cksum  Life Length IS Flags
    sea1_b1_t1_r1.00-00           5  32200   631    201 L2 <>
      Remaining lifetime received: 1199 s Modified to: 1200 s
      NLPID: 0xCC(IPv4)
      Hostname: sea1_b1_t1_r1
      Area address: 49.0001
      Interface address: 10.1.1.69
      Interface address: 10.1.1.89
      Interface address: 10.1.1.49
      Interface address: 10.1.1.9
      Interface address: 10.1.1.29
      Interface address: 10.0.0.33
      IS Neighbor          : sfo1_b2_t1_r1.00    Metric: 10
      IS Neighbor          : sea1_b1_t2_r1.00    Metric: 10
      IS Neighbor          : sea1_b1_t2_r3.00    Metric: 10
      IS Neighbor          : sea1_b1_t2_r2.00    Metric: 10
      IS Neighbor          : sea1_b1_t2_r4.00    Metric: 10
      Reachability         : 10.1.1.68/30 Metric: 10 Type: 1 Up
      Reachability         : 10.1.1.88/30 Metric: 10 Type: 1 Up
      Reachability         : 10.1.1.48/30 Metric: 10 Type: 1 Up
      Reachability         : 10.1.1.8/30 Metric: 10 Type: 1 Up
      Reachability         : 10.1.1.28/30 Metric: 10 Type: 1 Up
      Reachability         : 10.0.0.33/32 Metric: 10 Type: 1 Up
      Router Capabilities: Router Id: 10.0.0.33 Flags: []
        Area leader priority: 250 algorithm: 0
```
here is the mandatory pcap 

![ISIS PCAP](/images/post11/pcap.png "ISIS LSP Pcap")

### PSNP and CSNP
We saw that LSP PDUs are the building blocks of LSDB. Now the goal of the PSNP and CSNP is to keep the LSDB in sync.
The goal of the CSNP is to publish all the headers of the link-state database to the neighbor. After receiving a CSNP,
the neighboring router may decide to request an Updated LSP if it has an older LSP version. Asking for a recent version 
of LSP is done by sending PSNP.

Another use of PSNP is to acknowledge that the neighbor has received an LSP. Think like a TCP Ack. On P2P links, when 
an LSP Update is sent, an internal SRM(Send Routing Message) flag is set, which means now the router is waiting for an 
acknowledgment which the neighbor will do by sending PSNP message. If the router receives the acknowledgment, SRM flag 
is cleared and removed from the retransmission list. If the router doesn't receive an acknowledgment, the router will 
retransmit the LSP. That's the IS-IS mechanism for providing reliable delivery.

When a router is trying to acknowledge an LSP by sending PSNP, it will have an internal SSN (Send Sequence Numbers) flag
set indicating that LSP should be included in the next PSNP PDU. From an implementation perspective, most implementations
will try to be efficient by waiting for a certain time to acknowledge multiple LSPs by sending a single LSP.

Below is an example of a PSNP acknowledging for two LSPs.

![ISIS PSNP](/images/post11/psnp.png "ISIS PSNP")


### IS-IS Flooding
Some example of events that cause flooding of new information in IS-IS are:
- Adjacency State.
- Metric Cost change.
- RSVP Bandwidth change above certain threshold.

When a Router originates an LSP, it will send out on all the interfaces with an adjacency in the Up State. A receiving 
router will verify if the received LSP is newer (with a higher sequence number) than the one installed in the local 
database. If the sequence number is less than or equal to the LSP in the database, the router discards the LSP and sends 
a PSNP to acknowledge the received LSP. If the LSP has a higher sequence number, it will update the LSDB and further 
send it on all the interfaces except the one from which it received the LSP. 

Every LSP also has a lifetime, so they require periodic refresh regardless of any topology change to help protect 
against stale entries in the LSDB.

In our topology, If I go and disable the link between `sea1_b1_t1_r1 <--> sfo1_b2_t1_r1`, then that will be a topology 
change from both routers `sea1_b1_t1_r1`,  and `sfo1_b2_t1_r1` perspective. Both will send an Updated LSP with a higher 
sequence number telling the rest of the network about the change. Each router receiving the Updated LSP will update the 
local LSDB and flood the LSP further. 


## Microscopic view of an IS-IS Flood event 
Now that we have covered a bit of background, we will trigger an LSP flooding event by disabling the link between 
`sea1_b1_t1_r1 <--> sfo1_b2_t1_r1` and then enabling it again. A single link disable event will trigger to LSP updates,
one from `sea1_b1_t1_r1`,  and other from `sfo1_b2_t1_r1`. Once we enable the link again, both routers will send another
LSP update about the link comping up.

We will capture the events by taking a tcpdump capture on all the interfaces, merging the captures, and then using 
t-shark to convert them into CSV for analysis. The captures are taken on the routers highlighted in blue.

![Topo Capture](/images/post11/pdx1_topo.png "Topo Capture")


<iframe src="/images/post11/lsp_update.html"
    sandbox="allow-same-origin allow-scripts"
    width="100%"
    height="500"
    scrolling="yes"
    seamless="seamless"
    frameborder="0">
</iframe>




## Conclusion
In this post, we went through few algorithms that can help us find how much more bandwidth we can carry between locations 
on top of existing traffic. We looked at Dinitiz's algorithm for the Maximum Flow cost without worrying about the minimum 
cost constraint. Then we looked at the application of the Network Simplex algorithm, which tries to satisfy all the demands 
with the Minimum Cost as a constraint. Then we used the results and applied them to a simulation model of an RSVP routed 
network to validate.

I would love to hear from anyone who has some other ways to solve problems of this nature and what methods they used.

## References
- [15.082J Network Optimization, The network simplex algorithm](https://ocw.mit.edu/courses/sloan-school-of-management/15-082j-network-optimization-fall-2010/lecture-notes/MIT15_082JF10_lec16.pdf)
- [Dinitz Algorithm](https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.flow.dinitz.html#networkx.algorithms.flow.dinitz)
- [Network Simplex](https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.flow.network_simplex.html#networkx.algorithms.flow.network_simplex)