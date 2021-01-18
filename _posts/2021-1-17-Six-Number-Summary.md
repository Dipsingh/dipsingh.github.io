---
layout: post
title: Six Number Summary for Network Topologies
---
## Introduction
You may or may not have already heard about the [Five Number summary](https://en.wikipedia.org/wiki/Five-number_summary) for a dataset. 
It's basically a set of descriptive statistics for a given dataset, which provides an idea about the dataset. Those are:

1. Minimum
2. First quartile
3. Median
4. Third quartile
5. Maximum
	
Similarly, there are specific statistics about topology, which gives an idea about any network topology. The ones which I
think the most essential are:

1. Density and Sparsity
2. Average Degree
3. Average Path Length
4. Attribute/Degree Assortative Coefficient
5. Pearson Coefficient

## Sample Topology
We will be using Cogent topology, which is publicly available [here](http://www.topology-zoo.org/dataset.html) to follow
along with our examples. The map represents the nodes in US + Mexico, and European countries.Each node color represents
a specific country.
![Cogent Public Topo](/images/post6/Cogentco.jpg "Cogent Public Topo")

Graphml version
![Cogent Topology](/images/post6/cogent.png "Cogent")

You can notice that graph represents a city as a Node. Further, any city can have many routers, making the topology a lot
bigger and more attractive. For our purposes, the current topology abstraction provides the right balance where it's not 
huge to overwhelm the reader but big enough to keep things interesting.

## Five Number Summary

### Density and Sparsity
A Graph consists of nodes and links connecting those nodes. An obvious thing to say is that the maximum links a graph can
have are bounded by its nodes. This means the maximum number of links a network can have can be given by the number
of nodes. A **Complete Network** is the one which has all possible pair of nodes connected by links.

A maximum number of links in an Undirected network with $$ N $$ nodes, can be given by:

$$
L_{max} = \left(\begin{array}{c}N\\ 2\end{array}\right) = \frac{N(N-1)}{2}
$$

We know what the max links a graph can have, but the actual links can be that or less. The links which actually exists 
in the network is known as the density of the network. A Complete network will have maximal density. If the network's 
density is much smaller than maximal links, we called this sparsity. Most of the networks we see in real life are sparse.

Density of the Network is given by:

$$
d = \frac{L}{L_{max}}
$$

We can substitute $$ L_{max} $$ in the equation and get

$$
d = \frac{2L}{N(N-1)}
$$

In a complete network, $$ L = L_{max}$$ which means density d = 1. In a sparse network, $$ L << L_{max}$$ and therefore
$$ d << 1 $$ (*symbol $<<$ means much less than*).

As a network grows, nodes will increase, which will increase the number of Links. Hence we can say that the number of
links is a function of the number of nodes. If the number of links grows proportionally to the number of nodes $(L \sim N)$ or slower,
then we can say that the network is **sparse**. If the number of links grows faster e.g. quadratic or cubic growth $$(L \sim N^2 or N^3)$$,
then we say that the network is **dense**.

Let's look at our sample cogent topology.
```python
import networkx as nx
G = nx.read_graphml(filename)
NODES = len(G.nodes())        // 197
LINKS = len(G.edges())        //245
MAX_LINKS = (197* (197-1))/2  //19306
Density = 245/19306           //0.0126
```
We have Nodes = 197, Links = 245 and the density = 0.0126. This indicates that our topology is sparse in nature. 

### Degree
A degree of a node is the number of links or neighbors. We will use $$ k_{i} $$ to denote the degree
of node $$ i $$. A node with no neighbors will have degree = 0 and is called **Singleton**. The average degree of a network
is defined as the sum of degree of all nodes divided by the number of nodes N.

$$
K_{avg} = \frac{\sum_{i}^{}k_{i}}{N}
$$

Let's look at the average degree of nodes in our Cogent topology.
```python
sum([d for (n, d) in nx.degree(G)]) / G.number_of_nodes() // 2.48
```
The average node degree for our cogent topology is around 2.48. This means on an average most nodes are connected to 2-3 neighbors.
Let's plot the degree distribution of our graph and see how it looks like:

![Degree Distribution](/images/post6/cgnt_nd_deg_dist.png "Cogent Degree Distribution").

You can observe that the maximum nodes have degree = 2 (peak), and it has a thin tail on the right with very few nodes with a
high degree of 6,7,8 and 9.

#### Average Weighted Degree
In our simple case, all links between nodes were equal. We didn't provide importance to any given link over another. But
some links may be more important than others, and we may provide the weights to them (e.g., IGP Cost/Link Capacity). 
The weighted degree of a node is like a degree but ponderated by the weight of each edge. For instance, a node with 4 edges
with weight 1 each(1+1+1+1) is equal to a node with 2 edges with weight 2 (2+2).

### Assortativity


