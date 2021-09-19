---
layout: post
title: DES: Epidemic Modeling
---
## Introduction
One of the things I have been trying to play recently with is Discrete Event Simulation(DES). I think it is a powerful 
tool for validating ideas. In this post, we will look at a toy epidemic model to simulate SIS/SIR models.   

In Epidemic modeling, there are two classic models - SIS and SIR models. The models divide the population into different
categories corresponding to different stages of the epidemic.

1. Susceptible(S): Susceptible individuals can contract the disease.
2. Infected(I): Infected individuals have already been contracted the disease.
3. Recovered(R): Recovered individuals are recovered from the disease and can not be infected again.


### SIS Model
In case of SIS, the main assumption is that an infected person can get infected again after recovering. The state 
transition diagram looks like:

![SIS State Transition](/images/post8/sis_model.png "SIS Model")

- $\beta$ is the probability of transitioning from `Susceptible(S)` to `Infected(I)`
- $\mu$ is the probability of transitioning from `Infected(I)` to `Susceptible(S)`


### SIR Model
In case of SIR, the main assumption is that an infected person can not get infected again. The state transition diagram
looks like:

![SIR State Transition](/images/post8/sir_model.png "SIR Model")

- $\beta$ is the probability of transitioning from `Susceptible(S)` to `Infected(I)`
- $\mu$ is the probability of transitioning from `Infected(I)` to `Recovered(R)`


## SIS Simulation

We will have a generic [Simulation](https://gist.github.com/Dipsingh/50bcfbacba365c23a5111ec89144c335) class to help model both models, which takes state transition functions as an argument 
and handles various state transitions as the simulation run.

### Generate the Initial Graph

Here is a random graph of 30 Nodes and 60 edges.

```python
import matplotlib.pyplot as plt
import networkx as nx
import random
import simulation as sm

G = nx.gnm_random_graph(30, 60)
pos=nx.layout.spring_layout(G)
nx.draw(G, pos=pos)
```

![Initial_Graph](/images/post8/initial_graph.png "Initial Graph")


### Initial State and State Transition Functions

Initial state function creates a dictionary of nodes with initial state set to `S` for all nodes and one random node is
set to state `I`. The function returns a dictionary which will be passed to Simulation class to set that as an attribute
to all the nodes.

```python
def initial_state(G):
    state = {}
    for node in G.nodes:
        state[node] = 'S'
    
    patient_zero = random.choice(list(G.nodes))
    state[patient_zero] = 'I'
    return state
```

State Transition function assumes probability of 10% for both $\beta$ and $\mu$.

```python
MU = 0.1
BETA = 0.1

def state_transition(G, current_state):
    next_state = {}
    for node in G.nodes:
        if current_state[node] == 'I':
            if random.random() < MU:
                next_state[node] = 'S'
        else: # current_state[node] == 'S'
            for neighbor in G.neighbors(node):
                if current_state[neighbor] == 'I':
                    if random.random() < BETA:
                        next_state[node] = 'I'

    return next_state
```

Then we pass both functions and initialize our simulation

```python
sim = sm.Simulation(G, initial_state, state_transition, name='SIS model')
```

### Initial state

Let's draw the initial state before we kick of the simulation. We can see one node is infected and everyone else is in 
`S` state.

```python
sim.draw()
```

![Initial_State](/images/post8/initial_state.png "Initial State")


### Simulation Run and Plot

Now let's run the simulation for 30 steps and see what's the final state looks like after that.

```python
sim.run(30)
sim.draw()
```
![SIS_30_State](/images/post8/sis_30_steps.png "SIS: 30 steps")

We can see we have lot more nodes infected but not every node is infected. If we plot the states, we can see how both 
states transitioned. It seems like after 16 steps, system is running into a somewhat steady state.

```python
sim.plot()
```

![SIS_30_plot](/images/post8/sis_30_steps_plots.png "SIS: 30 steps plot")


### What if we change the infection probability to be a bit higher.

Let's increase the $\beta$ probability to be 40% this time. So more people should be infected more and less people will 
be coming into a `S` state. 

```python
MU = 0.1
BETA = 0.40

sim = sm.Simulation(G, initial_state, state_transition, name='SIS model')
sim.draw()

```
![SIS_initial state high](/images/post8/initial_state_sis_high.png "SIS: High Probability")


After 30 steps, we have lot more nodes infected.
```python
sim.run(30)
sim.draw()
```
![SIS_30_State High](/images/post8/sis_30_steps_high.png "SIS: 30 steps High")

We can see that proportions of Infected nodes rise quickly and the system is staying that way as people are getting
more infected than the rate of recovery.
```python
sim.plot()
```
![SIS_30_plot high](/images/post8/sis_30_steps_plots_high.png "SIS: 30 steps plot High")


## SIR Simulation

The initial parts of graph initialization etc. will remain the same. So we will skip those steps.

### Initial State and State Transition Functions

The initial state function will remain the same. The main difference will be in the state transition function. If a node
is Infected, then it will transition to Recovered Sate with probability $\mu$ rather than transitioning back to Susceptible(S)
state.

```python
def state_transition(G, current_state):
    MU = 0.1
    BETA = 0.1
    next_state = {}
    for node in G.nodes:
        if current_state[node] == 'I':
            if random.random() < MU:
                next_state[node] = 'R'
        elif current_state[node] == 'S':
            for neighbor in G.neighbors(node):
                if current_state[neighbor] == 'I':
                    if random.random() < BETA:
                        next_state[node] = 'I'

    return next_state
```

Initializing the simulation.

```python
sim = sm.Simulation(G, initial_state, state_transition, name='SIR model')
```

### Initial state

Let's draw the initial state before we kick of the simulation. We can see one node is infected and everyone else is in 
`S` state.

```python
sim.draw()
```

![SIR Initial_State](/images/post8/sir_initial_state.png "SIR: Initial State")


### Simulation Run and Plot

Now let's run the simulation for 30 steps and see what's the final state looks like after that.

```python
sim.run(30)
sim.draw()
```
![SIR_30_State](/images/post8/sir_30_steps.png "SIR: 30 steps")

We can see as the recovered state goes high, infections are coming low as that proportion of population is not getting 
infected anymore.

```python
sim.plot()
```

![SIR_30_plot](/images/post8/sir_30_steps_plots.png "SIR: 30 steps plot")



## Conclusion
In this blog, we looked at few simple toy models simulating SIS/SIR epidemic models. The main idea was to showcase the
power of Discrete Event Simulation(DES) for validating ideas. In future, we will use this for modeling certain network
related problems.

## References
- (A First Course in Network Science)[https://www.amazon.com/First-Course-Network-Science/dp/1108471137]
- (Compartmental models in epidemiology)[https://en.wikipedia.org/wiki/Compartmental_models_in_epidemiology]









![Degree Distribution](/images/post7/degree_distribution.png "Degree Distribution")



### Closeness
Another way to measure the centrality of a node is by determining how close it is to other nodes. This can be computed by summing the 
distances from the node to all others. If the distances are short on average, their sum is a smaller number, and we can say that
the node has high centrality.

Closeness centrality is defined by 

$$
g_{i} = \frac{1}{\sum_{j\neq i}l_{ij}}
$$

where $l_{ij}$ is the distance from i to j and the sum runs over all the nodes.

If we look at the Closeness centrality of our sample topology, seems like DFW1, DFW2 and DEN2 are the top three. Below is a 
histogram of that.


![Closeness Centrality](/images/post7/closeness_centrality.png "Closeness Centrality")


### Betweenness
The general idea here is that a node is more central, the more often its involved. The simplest way to calculate is to calculate 
the shortest path from each node to every other node. The centrality is computed by counting how many times a node shows up in
those shortest paths. The higher the count of node, the more traffic it controls.

$$
b_{i} = \sum_{h\neq j \neq i}\frac{\sigma_{hj}(i)}{\sigma_{hj}}
$$

```python
bc = nx.betweenness_centrality(G)
fig, ax = plt.subplots(figsize=(18,8))
plt.title('Betweenness Centrality', fontsize=16)
plt.xlabel('Nodes', fontsize=16)
plt.ylabel('Betweenness Centrality', fontsize=16)
plt.bar(range(len(bc)), list(bc.values()),align='center')
_ = plt.xticks(range(len(bc)), list(bc.keys()))
```

In case of betweenness centrality, dfw1 and dfw2 stand out the most.

![Betweenness Centrality](/images/post7/betweenness_centrality.png "Betweenness Centrality")

## Robustness
The standard way to check the robustness is by seeing how connected the graph is when we start removing the nodes. Removal of nodes
can be either random or systematic. To estimate the disruption following a node removal, we compute the relative
size of the giant component i.e. ratio of the number of nodes in the giant component to the number of nodes initially present in the network.

Assuming a connected graph, when we start initially, the whole graph is one giant component. If removing a subset of nodes does
not break the graph into two disconnected graphs, then the proportion of the nodes in the giant component gets reduced by the number of removed nodes. 
If, however, the node removal breaks the network into two or more connected graphs, the size of the giant
component may drop substantially. 

Testing the robustness of the sample topology by removing 2 nodes with highest degree.


```python
N = G.number_of_nodes()   # No. of nodes are 18
number_of_steps = 8       # How many iterations we want to perform.
M = N // number_of_steps  # M = 2 here. This means we will take two nodes at a time.

num_nodes_removed = range(0, N, M) # Number of nodes to be removed. 
C = G.copy()                       # Make a copy of the graph
targeted_attack_core_proportions = [] #list to capture the results
for nodes_removed in num_nodes_removed: #Let's iterate over the nodes
    # Measure the relative size of the network core
    core = next(nx.connected_components(C)) #Compute the connected component
    core_proportion = len(core) / N         #Core_proportion 
    targeted_attack_core_proportions.append(core_proportion)
    
    # If there are more than M nodes, select top M nodes and remove them
    if C.number_of_nodes() > M:          #if the number of nodes left is greater than 2
        nodes_sorted_by_degree = sorted(C.nodes, key=C.degree, reverse=True) #Get the highest degree nodes
        nodes_to_remove = nodes_sorted_by_degree[:M] # Get two nodes
        C.remove_nodes_from(nodes_to_remove)         # Remove the nodes

fig, ax = plt.subplots(figsize=(15,6))
plt.title('Targeted attack', fontsize=16)
plt.xlabel('Number of nodes removed',fontsize=16)
plt.ylabel('Proportion of nodes in core',fontsize=16)
plt.plot(num_nodes_removed, targeted_attack_core_proportions, marker='o')
```

What we observe is that once we removed two nodes in the first iteration, the proportion of the nodes left in the giant are around 72%

![Targeted_attack](/images/post7/targeted_attack.png "Targeted Attack")


After removing `sea2` and `lax1` we see that the left side of the graph is isolated.

![Removed_Nodes](/images/post7/removed_nodes.png "Removed Nodes")


### Summary 
We looked at various centrality measures and then looked at application of degree centrality to check the robustness of the graph.

In large networks, it is necessary to use statistical tools to analyze the global features of the network. These tools can also help
in comparing various topologies. I hope you get something useful out of this post.
