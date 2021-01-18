---
layout: post
title: Five Number Summary for Network Topologies
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
3. Assortativity
4. Average Path Length
5. Clustering Coefficient

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
$$ d << 1 $$ (*symbol $$ << $$ means much less than*).

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
Assortatvitiy is a property of the network where nodes with similar features are connected together. We see this property in 
social networks all the time where people with similar interests are friends a.k.a connected to each other. This is also 
captured by the popular saying that "birds of a feather flock together" and technically it's called as **Homophily**.

We know that a degree is a property of a Node. Assortativity based on degree is called degree assortativity. In this high degree
nodes are connected to high degree nodes and low degree nodes tends to connect low degree nodes. This type of network is called 
Assortative. If the high degree nodes tend to connect to low degree nodes and vice versa then that network is called dissasortatvie.

There are two ways to measure degree assortatvity of a network, both based on measuring the correlation between degrees of neighbor
nodes.

One way to measure network assortativity is by assortativity coefficient, defined as the pearson correleation between
the degrees of pairs of linked nodes. If the coefficient is positive, then the network is assortative and disassortative if it's negative.

If we look at the below degree-degree scatter plot of our Cogent Topology, we can observe that most low degree nodes are connected
to other low degree nodes but also connected to few high degree nodes. The shades indicate the density, it's not very conclusive but there
are darker shades between low degree nodes.

![Degree-Degree Scatter Plot](/images/post6/deg_deg_plot.png "Degree-Degree Scatter Plot")

It seems like our network may be slightly assortative—the degree assortativity coefficient= 0.019, which is a positive value indicates that our 
topology is slightly assortative but not much due to the value closer to zero.

```python
nx.degree_assortativity_coefficient(G) //0.019
```

The second method is based on measuring the average degree of the neighbors of node i

$$
k_{nn}(i) = \frac{1}{k_{i}}\sum_{j}^{}a_{ij}k_{j}
$$

where $$ a_{ij} = 1 $$, if i and j are neighbors and 0 otherwise. We then define K-nearest neighbors function $$ K_{nn}(k) $$ for 
nodes of a given degree $$ K $$ as the avg. degree of k_nn(i) across all nodes with degree k. if $$ K_{nn}(k) $$ is an increasing
function of k then high degree nodes tend to be connected to high degree nodes; there the netowork is assortative, if $$ K_{nn}(k) $$
decreases with k, the network is disassortative.

### Average Path Length
It's possible to define an aggregate distance measure for the entire network by using the shortest path lenght as a measure of
distance between nodes. The Average Shortest Path Length is obtained by averaging the shortest path lentgh across all pair of nodes.

Formally the Average Shortest Path Length for an undirected graph is given by

$$
L_{avg} = \frac{\sum_{i}^{j}l_{ij}} {\left(\begin{array}{c}N\\ 2\end{array}\right)} = \frac{2\sum_{i}^{j}l_{ij}}{N(N-1)}
$$

where $$l_{ij}  $$ is the shortest path length between nodes $$ i $$ and $$ j $$ and $$ N $$ is the number of the nodes.

The diameter of the network is the max shortest path length across all pairs.

The Average shortest path length for our example topology is 10.5 hops.
```python
nx.average_shortest_path_length(G) // 10.5
nx.diameter(G) // 28
```

### Clustering Coefficient
