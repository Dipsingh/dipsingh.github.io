---
layout: post
title:  Quick Intro to Markov Process
---

A Markov chain or Markov process is a stochastic model describing a sequence of possible events in which the probability of each event depends only on the state attained in the previous event. It is named after the Russian mathematician Andrey Markov.

Markov chains help model many real-word processes, such as queues of customers arriving at the airport, queues of packets arriving at a Router, population dynamics. Please refer to this [link](https://setosa.io/ev/markov-chains/) for a quick intro to Markov chains.

{: .center}
![markov meme](/images/post17/img.png "Markov Process")


## Problem

Let's use a simple example to illustrate the use of Markov Chains. Assume that you own a barber shop, and You notice that Customers don't wait if there is no room in the waiting room and will take their business elsewhere. You want to invest to avoid this, and you have the following info in hand:

- You have two barber chairs and two barbers.
- You have a waiting room for four people.
- You usually observe 10 Customers arriving per hour.
- Each barber takes about 15mins to serve a single customer. So each barber can serve four customers per hour.

You have finite space in the shop, so add two more chairs in the waiting room or add another barber. Now we want to understand which one makes the most sense. 

## Background

A markov chain is a model of a sequence of random events i.e. defined by a collection of states and rules that define how to move between the states. In our example, we can use a single number to describe the state of our shop. If the number is One, then we have a single customer currently having their hair cut. if the number is 5, then 2 customers are cutting hair cut and three are waiting. The maximum number our shop can have is 6, in that case we will have 4 customers waiting and 2 customers getting their hair cut.

We can denote the states as: $S = \{0,1,2,3,4,5,6\}$

As people arrive, the state increase. This happens at 10 per unit of time. The state decreases as people get their hair cut which happens at the rate of 4 per unit of time. Below diagram represents the state space and the transition rates between the states.

Markov Chain assumes the transition rates to be exponential distribution. We can represent these states using a transition matrix $Q$ where $Q_{ij}$ represents the rate of going from state $i$ to state $j$. 

$$
 Q = \begin{pmatrix}
-10 & 10 & 0 & 0 & 0  & 0 & 0 \\
4 & -14 & 10 & 0 & 0  & 0 & 0  \\
0 & 8 & -18 & 10 & 0  & 0 & 0  \\
0 & 0 & 8 & -18 & 10  & 0 & 0  \\
0 & 0 & 0 & 8 & -18  & 10 & 0  \\
0 & 0 & 0 & 0 & 8  & -18 & 10  \\
0 & 0 & 0 & 0 & 0  & 8 & -8 
\end{pmatrix}
$$

You will see that diagonal elements $Q_{ii}$ are negative and that is to ensure the rows of $Q$ sum to 0. The matrix $Q$ can be generally expressed as 

$$
Q= \begin{pmatrix}
-\lambda & \lambda & 0 & 0 \\
\mu & -(\lambda+\mu) & \lambda  &  0\\
0 & \mu & -(\lambda+\mu) & \mu \\
0 & 0 & 0 & -\mu 
\end{pmatrix}
$$

The rate at which the system goes from 1 to 2 is $\lambda$ and the rate of which it goes from 2 to 1 is $\mu$. In the barber example, our $\lambda = 10$ and $\mu = 8$.

The matrix $Q$ can be used to understand the probability of being in a given state after t time units. This can be represented using a matrix $P_{t}$ where $(P_{t})_{ij}$ is the probability of being in state $j$ after time t units having started in state i. 

We can use matrix exponential to calculate the matrix $P_{t}$ numerically

$
P_{t} = e^{Qt}
$

There are some good videos on this topic if you want to make sense of matrix exponents: [Matrix Exponents by 3blue1brown](https://www.3blue1brown.com/lessons/matrix-exponents) and [MIT Gilbert strang course on Differential equations](https://www.youtube.com/watch?v=LwSk9M5lJx4).

Solving the above is useful to answer questions such as understanding the long run behavior, for example: "What state is the system most likely to be in on average ?". These long run probabilities can be represented as $\pi$ where $\pi_{i}$ represents the probability of being in state $i$.


The relation between $\pi$ and $Q$ can be given by the following differential equation:

$
\frac{d \pi}{dt} = \pi Q
$

What specifically is of interest is the steady state of a continuous Markov chain, in other words a state for which the derivative is 0:

$
\frac{d \pi}{dt} = \pi Q = 0
$

One constraint we have on the $\pi$ is that the sum of all $\pi_{i}$ should add up to 1.

## Python SetupCode

```python
import numpy as np
import scipy.linalg
from itertools import product
def get_transition_rate(in_state, out_state, waiting_room=4, num_barbers=2):
    """
    returns a transition rate between two states.
    """
    arrival_rate = 10 # Number of customers arriving in an hour.
    service_rate = 4  # Barber serving the customers in an hour.
    capacity = waiting_room + num_barbers # Total Capacity = 4 waiting room + 2 barbers serving the customers.
    delta = out_state - in_state 
    if delta == 1: # if moving in a higher state
        return arrival_rate
    if delta == -1:# if moving to a lower state
        return min(in_state, num_barbers) * service_rate
    return 0

def get_transition_rate_matrix(waiting_room=4, num_barbers=2):
    """
    Returns a Transition rate matrix
    """
    capacity = waiting_room  + num_barbers # Total capacity of the shop.
    state_pairs = product(range(capacity+1), repeat = 2) # Generate permutations
    ## Returns a flat list of all the transition rates.
    flat_transition_rate = [get_transition_rate(in_state, out_state, waiting_room, 
                                                 num_barbers) for in_state, out_state in state_pairs]
    ## Convert flat list to a numpy array of (7,7)
    transition_rates = np.reshape(flat_transition_rate, (capacity+1, capacity+1))
    ## Fill the diagonals with -ve sum
    np.fill_diagonal(transition_rates, -transition_rates.sum(axis=1))
    return transition_rates

Q = get_transition_rate_matrix()
Q
array([[-10,  10,   0,   0,   0,   0,   0],
       [  4, -14,  10,   0,   0,   0,   0],
       [  0,   8, -18,  10,   0,   0,   0],
       [  0,   0,   8, -18,  10,   0,   0],
       [  0,   0,   0,   8, -18,  10,   0],
       [  0,   0,   0,   0,   8, -18,  10],
       [  0,   0,   0,   0,   0,   8,  -8]])
```

We can check if its steady state or not using the below function

```python
def is_steady_state(state, Q):
    """
    Returns a boolean as to whether a given state is a steady  
    state of the Markov chain corresponding to the matrix Q.
    """
    return np.allclose((state @ Q), 0)
```

### Matrix Exponential Approach
We can solve this problem by using Matrix Exponential.

```python
## Solving 
def obtain_steady_state_with_matrix_exponential(Q, max_t=100):
    """
    Solve the defining differential equation until it converges.
    
    - Q: the transition matrix
    - max_t: the maximum time for which the differential equation is solved at each attempt.
    """
    dimension = Q.shape[0]
    state = np.ones(dimension) / dimension
    
    while not is_steady_state(state=state, Q=Q):
        state = state @ scipy.linalg.expm(Q * max_t)
    
    return state
state = obtain_steady_state_with_matrix_exponential(Q=Q)
print("Steady State Probability:", state)
Steady State Probability: [0.03430888 0.0857722  0.10721525 0.13401906 0.16752383 0.20940479
 0.26175598]
```

The above shows that in the current scenario, shop is expected to be empty ~3.4% of the time.

### Algebaric Approach
The above steady state was obtained by doing multiple iterations, and we can do that better using the algebaric approach. we already know the below conditions for steady state:

$$
\pi Q = 0  \\
\sum_{i=1}\pi_{i} = 1
$$

We augment the matrix $Q$ with $\tilde{Q}$ to include the extra equation:

$$
M = \begin{pmatrix}
\tilde{Q}^T \\
1,1,1,1,1,1,1
\end{pmatrix}
$$

and define $b$ by:

$$
b = \begin{pmatrix}
0 \\
0\\
0 \\
0 \\
0 \\
1 \\
\end{pmatrix}
$$

$\tilde{Q}$ is the matrix $Q$ with a column removed. This is because to solve our linear system we need $M$ to be a square matrix. In practice below we remove the last column.

Thus, the steady state vector $\pi$ is a solution to:

$
M\pi = b
$

```python
def augment_Q(Q):
    """
    Q: the transition matrix
    """
    dimension = Q.shape[0]
    M = np.vstack((Q.transpose()[:-1], np.ones(dimension)))
    b = np.vstack((np.zeros((dimension - 1, 1)), [1]))
    return M, b

def obtain_steady_state_linear_algebraically(Q):
    """
    Obtain the steady state vector as the solution of a linear algebraic system.
    
    Q: the transition matrix
    """
    M, b = augment_Q(Q)
    return np.linalg.solve(M, b).transpose()[0]

obtain_steady_state_linear_algebraically(Q)
array([0.03430888, 0.0857722 , 0.10721525, 0.13401906, 0.16752383,
       0.20940479, 0.26175598])
```

### Using least squares

```python
def obtain_steady_state_using_least_squares(Q):
    """
    Obtain the steady state vector as the vector that 
    gives the minimum of a least squares optimisation problem.
    Q: the transition matrix
    """
    M, b = augment_Q(Q)
    pi, _, _, _ = np.linalg.lstsq(M, b, rcond=None)
    return pi.transpose()[0]
obtain_steady_state_using_least_squares(Q)
array([0.03430888, 0.0857722 , 0.10721525, 0.13401906, 0.16752383,
       0.20940479, 0.26175598])
```

We see that we get the same answer by all the three techniques: 
- Matrix exponential
- Solving linear algebraic system
- Approximately solving linear algebraic system (least Square)

## Increase the Waiting from Four to Six
Now lets try to get steady state probability of adding two more space for the waiting room.

```python
# Increase the waiting room from 4 to 6
Q = get_transition_rate_matrix(waiting_room=6, num_barbers=2)
print(Q)
obtain_steady_state_using_least_squares(Q)

[[-10  10   0   0   0   0   0   0   0]
 [  4 -14  10   0   0   0   0   0   0]
 [  0   8 -18  10   0   0   0   0   0]
 [  0   0   8 -18  10   0   0   0   0]
 [  0   0   0   8 -18  10   0   0   0]
 [  0   0   0   0   8 -18  10   0   0]
 [  0   0   0   0   0   8 -18  10   0]
 [  0   0   0   0   0   0   8 -18  10]
 [  0   0   0   0   0   0   0   8  -8]]
array([0.01976103, 0.04940258, 0.06175322, 0.07719153, 0.09648941,
       0.12061177, 0.15076471, 0.18845589, 0.23556986])
```

Increasing the waiting room from 4 to 6, shop is expected to be empty ~1.9% of the time.

## Increase the barbers from two to three

```python
Q = get_transition_rate_matrix(waiting_room=4, num_barbers=3)
print(Q)
obtain_steady_state_using_least_squares(Q)

[[-10  10   0   0   0   0   0   0]
 [  4 -14  10   0   0   0   0   0]
 [  0   8 -18  10   0   0   0   0]
 [  0   0  12 -22  10   0   0   0]
 [  0   0   0  12 -22  10   0   0]
 [  0   0   0   0  12 -22  10   0]
 [  0   0   0   0   0  12 -22  10]
 [  0   0   0   0   0   0  12 -12]]
array([0.06261481, 0.15653702, 0.19567128, 0.1630594 , 0.13588283,
       0.11323569, 0.09436308, 0.0786359 ])
```

Increasing the barbers form two to three, shop is expected to be empty ~6.2% of the time. It appears that the lowest probability of shop being empty is when the number of waiting room increases from 4 to 6.

## References
- [https://setosa.io/ev/markov-chains/](https://setosa.io/ev/markov-chains/)
- [https://www.3blue1brown.com/lessons/matrix-exponents](https://www.3blue1brown.com/lessons/matrix-exponents)
- [MIT Gilbert strang course on Differential equations](https://www.youtube.com/watch?v=LwSk9M5lJx4)
- [Going steady (state) with Markov processes](https://bloomingtontutors.com/blog/going-steady-state-with-markov-processes)