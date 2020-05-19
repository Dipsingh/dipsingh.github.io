---
layout: post
title: Colorization of RFC 2992:Analysis of an ECMP Algorithm
---
## Motivation
I recently observed a conversation around ECMP/Hash buckets which made me realize on how the end to end concept is not 
well understood. So this provided me enough motivation to write about this topic which will be covered in various 
upcoming blog posts. But while thinking about the subject, I ran into an interesting RFC [RFC2992](https://tools.ietf.org/html/rfc2992).
This RFC goes through a simple mathematical proof which I found impressive due to the fact that someone wrote that in 
ASCII in 2000, but I think the beauty got lost somewhere behind those black and white ASCII diagrams. So my intent in this
blog post is to provide colorization.

## Introduction
In this RFC, the focus is on Hash-threshold implementation for mapping hash values to the next-hop. To re-iterate for the
completeness sake, we all know that a router computes a hash key based on certain fields, like SRC IP, DST IP, SRC Port, 
DST Port by performing a hash (CRC16, CRC32, XOR16, XOR32 etc.).  This hash gets mapped to a region and the next-hop allocated
to that region, is where the flow get's assigned.

For example,assume that we have 5-next hops to choose from and we have a key space which is 40 bits wide. We divide the 
available region equally and allocate 8 bits of the region to each of our 5 next hops.

![ECMP Hashing](/images/post2/ecmp_analysis_fig1.png "ECMP Hashing")

In order to choose the next-hop, we need to map the key to a region. Since the regions are equally divided, this becomes
a very simple task.

```
Region_size = Keyspace Size/No.of Nexthops. 
Region =  (key/region_size)
```

We can apply this to our example and see the regions based on various bit numbers.

```python
import math
region_size = 40/5 # KeySpace Size/No. Of Next-hops
key = [0,7,8,15,16,23,24,31,32,39] #Bits location
for k in key:
    print(f"Region: {math.ceil((k+1)/region_size)}")

Region: 1
Region: 1
Region: 2
Region: 2
Region: 3
Region: 3
Region: 4
Region: 4
Region: 5
Region: 5
```

## Disruption
In this section, we will look at how much flow disruption is caused by the addition or deletion of a next-hop. Since the
method requires to have an equal size allocation for next-hops, whenever a next-hop is taken out or added, the regions have
to be re-sized. This will result into disruption for the flows if the key they were pointing to is allocated to a different
next-hop. We are going to assume the amount of bits gets reassigned is proportional to the amount of flow disruption. The
bigger the reassignment, bigger the flow disruption.

For instance, in the below figure, we have 5 Next-Hops. Assume that Next-Hop 3 get's deleted. This results in the remaining
regions to grow equally and internal regions to shift to compensate for the additional space created by the deletion.

![Flow Disruption1](/images/post2/ecmp_analysis_fig2.png "Flow Disruption Region3")

In this case, we will have 8 bits free which means each of the remaining regions will get 2 bits each. This can be generalized by saying:

* Anytime a next hop is deleted, `1/N` bits gets free where `N` is the number of next-hops $$ \frac{1}{5} * 40 = 8 bits $$.
* Free bits get distributed equally by remaining N-1 next hops. Which gives you $$ \frac{1}{N * (N-1)} $$.  Ex: $$ \frac{1}{5*4} * 40 = 2 bits $$.

Another thing to observe is that as the corner regions (1 and 5 in our example), expand inwards, this will cause the internal
regions to shift in addition to expand. For example, Region #2 which was starting from 8 now starts from 10 (to free space for #1)
and lies between `10` to `19`. This brings a net change of `4` bits for region #2. Total bit change in our example is `12 (2 + 4 + 4 + 2)`. 

If we pick lets say region #4 this time for removal,then we are moving around `14 bits = (2+4+6+2)`. 

![Flow Disruption2](/images/post2/ecmp_analysis_fig3.png "Flow Disruption Region4")

If we pick region #5 for removal,then we are moving around `20 bits = (2+4+6+8)`.

![Flow Disruption3](/images/post2/ecmp_analysis_fig4.png "Flow Disruption Region5")

Based on the above examples, we can make an observation that the least disruption is caused when the region getting removed is in the middle.

We can generalize the process of calculating the number of bits change and indirectly the amount of flows getting disrupted by

```
Assuming the Kth region is removed
Total Disruption = Total change of bits on the left of Kth region + Total change of bits on the right of Kth region
````

`Total Change of bits on the left of Kth region` can be expressed as

$$
\begin{align*}
\sum_{i=1}^{K-1} \frac{i}{N * (N-1)}
\end{align*}
$$

`Total Change of bits on the right of Kth region` can be expressed as

$$
\begin{align*}
\sum_{i=K+1}^{N} \frac{i-K}{N * (N-1)}
\end{align*}
$$

This gives the total disruption as. If the $$ K^{th} $$ region happens to be the right most region, then you skip adding
the right part of the $$ K^{th} $$.

$$
\begin{align*}
Total Disruption = \sum_{i=1}^{K-1} \frac{i}{N * (N-1)} + \sum_{i=K+1}^{N} \frac{i-K}{N * (N-1)}
\end{align*}
$$


## Proof for minimal disruption
Following up from the above equation, you can take $$ \frac{1}{N * (N-1))} $$ outside of the summation

$$
\begin{align*}
=  \frac{1}{N * (N-1))}\sum_{i=1}^{K-1} i + \sum_{i=K+1}^{N} (i-K)
\end{align*}
$$

### Algebraic Series
You may be already familiar with the generic algebraic series where a sum of `N` numbers can be expressed as below
$$
\begin{align*}
1 + 2 + 3 + .. N  = \frac{N * (N+1))}{2}
\end{align*}
$$

Applying the above in our case, we are adding `K-1` terms in the first part $$ \frac{1}{N * (N-1))}\sum_{i=1}^{K-1} i $$. This can be summed
as $$ \frac{(K-1) * (K))}{2} $$. In the second part, 

