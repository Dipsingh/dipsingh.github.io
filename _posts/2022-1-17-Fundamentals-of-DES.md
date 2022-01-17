---
layout: post
title:  Fundamentals of Discrete Event Simulation(DES)
---
## Introduction
In the last blog, we looked at SIS/SIR epidemic modeling using Discrete event simulation. This post will cover some 
more fundamental concepts of Discrete Event Simulation. To get started, let's look at an elementary example.

Assume that we want to estimate the probability of observing the head in an experiment of tossing a coin. We know that
if the coin is not biased, then the likelihood of getting a head is `1/2`. We also know that if I toss the coin two 
or three times, we may not get exactly `1/2`. We expect that if we keep tossing the coin for a very long
time, the average probability of getting heads will converge to `1/2`.

#### Experiment
So let's run the experiment `1000` times of tossing the coin, and we get `0.49` as the probability of getting head,
which is very close to our expectation of `1/2`.

```python
import random
import numpy as np
n = 1000
observed = []

for i in range(n):
    outcome = random.choice(['Head', 'Tail'])
    if outcome == 'Head':
        observed.append(1)
    else:
        observed.append(0)

print("Prob = ", round(np.mean(observed), 2))

Prob =  0.49 #Output
```
 
Let's take a deeper look and see how the running mean was converging as the number of tosses increased.

```python
n = 1000
observed = []

for i in range(n):
    outcome = random.choice(['Head', 'Tail'])
    if outcome == 'Head':
        observed.append(1)
    else:
        observed.append(0)

cum_observed = np.cumsum(observed)
moving_avg = []
for i in range(n):
    moving_avg.append(cum_observed[i] / (i+1))
    
x = np.arange(0, len(moving_avg), 1)

plt.plot(x, moving_avg)
plt.axhline(0.5, linewidth=2, color='black')
plt.title("Running Mean", fontsize=16)
plt.xlabel("Number of Tosses", fontsize=14)
plt.ylabel("Probabilty of Heads", fontsize=14)
```
![Rnning Mean](/images/post9/running_mean.png "Running Mean of Tosses")

First, we can observe how the mean fluctuated widely around `0.5` but converged as the number of iterations increased. 

So what we have done so far is that we ran a single experiment of tossing coin 1000 times and observed that it converges 
around 0.5. Now let's repeat the experiment 1000 times with 10000 tosses in each experiment.

```python
for i in range(1000):
    n = 10000
    observed = []

    for i in range(n):
        outcome = random.choice(['Head', 'Tail'])
        if outcome == 'Head':
            observed.append(1)
        else:
            observed.append(0)

    cum_observed = np.cumsum(observed)
    moving_avg = []
    for i in range(n):
        moving_avg.append(cum_observed[i] / (i+1))

    x = np.arange(0, len(moving_avg), 1)

    plt.plot(x, moving_avg)
    plt.axhline(0.5, linewidth=2, color='black')
    plt.title("Running Mean", fontsize=16)
    plt.xlabel("Number of Tosses", fontsize=14)
    plt.ylabel("Probabilty of Heads", fontsize=14)
```
![10K Running Mean](/images/post9/10k_running_mean.png "10K Running Mean of Tosses")

We can observe how each experiment in the initial start fluctuated and then later converged, similar to what we observed
during a single experiment.

### Law of Large Numbers

What we observed is an illustration of the Law of Large numbers. The Law of Large Numbers says that the average of the results
obtained from a large number of trials should be close to the Expected Value and tends to become closer to the expected
value as more trials are performed.


### Transient and Steady Phase

Based on the above results, we can observe that each experiment goes through two phases, i.e., transient
and steady. In the transient state, output varied wildly, and later, it converged in the steady phase. So while running
simulation, it's essential to run the experiments long enough to capture the Steady phase and not end it
soon while it's in the transient phase. Transient phase is also sometimes referred as the warm up period.

![Transient_Steady Phase](/images/post9/transient_steady.png "Transient and Steady Phases")

This will bring the question, how do we know how long is the transient phase, so we can discard the results observed
in that state and only capture the steady state results. There are several method's to detect that which you can refer in
the paper [EVALUATION OF METHODS USED TO DETECT WARM-UP
PERIOD IN STEADY STATE SIMULATION](https://informs-sim.org/wsc04papers/080.pdf). The simplest and yet an effective method
is the Welch's method.

#### Welch's Method

In plain English, Welch's method says the following:
- Do Several Runs of the Experiment.
- Calculate the average of each observation across the runs.
- To smooth it further, calculate the moving average.
- Look at the graph visually and estimate the steady point from the graph.

![Welch's Method](/images/post9/welch_method.png "Welch Method")


```python
n = 1000
Y = np.zeros(shape = (5, n))

def return_observations():
    observed = []

    for i in range(n):
        outcome = random.choice(['Head', 'Tail'])
        if outcome == 'Head':
            observed.append(1)
        else:
            observed.append(0)

    cum_observed = np.cumsum(observed)
    moving_avg = []
    for i in range(n):
        moving_avg.append(cum_observed[i] / (i+1))


    return moving_avg

for i in range(5):
    Y[i] =  return_observations()

Z = []
for i in range(n):
    Z.append(np.sum(Y[:, i])/ 5)

x = np.arange(0, n, 1)
plt.plot(x, Y[0], 'k--', linewidth=0.5, label="Y0")
plt.plot(x, Y[1], 'k--', linewidth=0.5, label="Y1")
plt.plot(x, Y[2], 'k--',  linewidth=0.5,label="Y2")
plt.plot(x, Y[3],  'k--', linewidth=0.5,label="Y3")
plt.plot(x, Y[4],  'k--', linewidth=0.5,label="Y4")

plt.plot(x, Z, linewidth=2,color='tab:red', label="Z")
plt.title("Running Mean", fontsize=16)
plt.xlabel("Number of Tosses", fontsize=14)
plt.ylabel("Probabilty of Heads", fontsize=14)
plt.legend()
```
![Welch's Plot](/images/post9/welch_plot.png "Welch Plot")

In the above plot, Red line is the average of the five runs at each iteration, and we can see that it's steady somewhere between
300-400 iterations.

### Stochastic Process

Stochastic is a fancy word for Randomness. We observe Randomness every day in our life. The question is, are they random? 
Or is it because we lack a complete understanding of that process?. Without getting philosophical, to keep math simple, 
we attribute anything that we don't understand to Randomness. Randomness can be known as different terms in TimeSeries 
analysis; we called that noise.

Coming back to the topic, A stochastic process is a collection of random variables whose observations are discrete
points in time. At every instant of time, the state of the process is random. Since time is fixed, we can think of
the state of the process as a random variable at that specific instant. At the time $t_{i}$, the state of the process
is determined by performing a random experiment whose results are from the set of $\omega$. At the time $t_{j}$, the same
experiment is performed to determine the next state of the process. This is the essence of the stochastic process.


![Stochastic Process](/images/post9/stochastic_process.png "Stochastic Process")

In the above diagram, the Sample space on the left is the set of outcomes that are mapped to a time function. The time
functions are mixed to get sample reality.

If the above seems mouthful, hopefully, the following example will help. The Marvels Multiverse universe is the best 
analogy that always comes to mind while thinking of the Stochastic Process. Remember this scene from Infinity Wars, 
where Doctor Strange looked at 14 million different realities, and in only one reality, the outcome of Avengers winning
was one.   

![Infinity Wars](/images/post9/infinity_scene.png "Infinity Wars")

So tying this back to Stochastic Process, In this case, The set of outcomes were two, Avengers Winning and 
Thanos Winning. This is a sample space of outcomes. Each outcome is related to some set of actions performed. Those actions
are mixed to form a sample reality.

Another key concept is that a Stochastic process can have two means, Vertical mean, also known as Ensemble mean.
Ensemble mean is calculated vertically over all realities. A horizontal mean is the mean of a single sample reality.
As you can notice, getting an Ensemble mean requires running all possibilities that may or may not be feasible. But
the good thing is that a horizontal mean can be used to approximate vertical mean.

A dynamic system can be viewed as a Stochastic Process. When system is simulated, each simulation run represents an
evolution of the system along the path in the state space. The data generated and collected along the trajectory
in the state space is used to estimate the measurements of interest. 

A Dynamic system is called Ergodic system if the Horizontal mean converges to the Vertical mean.

## Conclusion
In this blog, we looked at few simple toy models simulating SIS/SIR epidemic models. The main idea was to showcase the
power of Discrete Event Simulation(DES) for validating ideas. In future, we will use this for modeling certain network
related problems.

## References
- [A First Course in Network Science](https://www.amazon.com/First-Course-Network-Science/dp/1108471137)
- [Compartmental models in epidemiology](https://en.wikipedia.org/wiki/Compartmental_models_in_epidemiology)
