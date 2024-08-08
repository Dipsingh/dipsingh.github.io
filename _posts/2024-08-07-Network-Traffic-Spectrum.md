---
layout: post
title: Network Traffic Modeling Approaches from Basics to Self-Similar Patterns
---

> The greatest value of a picture is when it forces us to notice what we never expected to see. - John Tukey

When a city contemplates constructing a new highway or major roadway, it doesn't simply break ground and start paving. Instead, 
an extensive feasibility study is conducted to evaluate various aspects including environmental impacts, traffic patterns, 
and potential congestion relief or creation (e.g., [US 277 Sonora Safety Route Study](https://ftp.txdot.gov/pub/txdot/get-involved/sjt/sonora-safety-study/111620-feasibility-study-report.pdf), [I-5 JBLM Corridor Study](https://wsdot.wa.gov/publications/fulltext/projects/i5_jblm/corridorplanfeasibilitystudy.pdf)). 
These studies examine traffic patterns specific to the project area, identify existing bottlenecks, and analyze how the new 
infrastructure will impact the overall transportation network.

Similarly, understanding traffic patterns is crucial when designing and operating networks. This knowledge is essential for 
everything from macro-level topology design to micro-level buffer tuning. 

In this post, we will generate synthetic time series to explore various traffic characteristics at a high level. In a subsequent 
post, we’ll explore a practical example demonstrating how these traffic patterns can affect an Active Queue Management (AQM) 
technique such as Random Early Detection (RED).

Our goal here is to guide you up the hills, from where you can view the mountains in the distance. This approach offers a 
broad perspective, allowing one to grasp the landscape without diving into intricate details.

# Statistical Distribution Properties

Statistical Distribution Properties are fundamental in characterizing network traffic behavior. They describe the underlying 
probability distributions of various traffic attributes, such as packet inter-arrival times, packet sizes, flow durations, and traffic volumes. 

## Heavy-tailed distributions

These are probability distributions whose tails are not exponentially bounded. In network traffic, heavy-tailed distributions are often observed in phenomena like flow durations, and inter-arrival times. 
- Examples include Pareto, Weibull (with shape parameter < 1), and log-normal distributions.
- They exhibit the property $P(X \gt x) \sim x^{-\alpha}$ as $x \to \infty$  where $0 \lt α \lt 2$.
- Heavy-tailed distributions can lead to high variability and extreme events in network traffic.

An example of a heavy-tailed distribution is below where we can see an extreme event shown by spike, and its statistical characteristics. 

{: .center}
![Heavy Tail Distribution](/images/post29/fig1.png "Heavy Tail Distribution")

We can see the occasional large spike in the time-series plot and it statistical properties in the other graphs. 

## Service Time Distribution

This refers to the statistical distribution of packet sizes or the time required to process/transmit packets. Common Models are 
Exponential, deterministic, and more general phase-type distributions. The choice of service time distribution significantly affects 
queuing behavior and network performance. Service times often exhibit multi-modal distributions due to different packet size classes (e.g., ACKs, MTU-sized packets).

The service time distribution impacts the queueing behavior i.e. how packets accumulate in network queues. 

Below plot shows an example of Exponential distribution.  In the time series plot we can see there are many small values with occasional 
large spikes. The histogram shows peal near zero and a long, gradually decreasing tail to the right.  

{: .center}
![Service Distribution](/images/post29/fig2.png "Service Distribution")

## Arrival Process

The arrival process describes the statistical nature of how packets or flows arrive at a network element. The arrival process 
can significantly impact on things like buffer occupation and packet loss.

### Poisson Process

The classical model is to use Poisson process. It's a stochastic process where events (packet arrivals) occur continuously 
and independently at a constant average rate. The Inter-arrival times are exponentially distributed.

**Properties**:
• **Memoryless Property**: The probability of an arrival occurring in the next time interval is independent of previous arrivals.
• **Constant Rate**: The arrival rate (λ) is constant over time.
• **Applications**: Used in simple network models, such as the M/M/1 queue, where both arrivals and service times are exponentially distributed.
• **Limitations**: The Poisson process cannot capture burstiness or correlation in real network traffic.

Many earlier research used Poisson arrival process as an assumption for packet arrival but it's a very simplistic view and 
the real traffic patterns are more complicated. Some other process which captures complex patterns are

### Batch Markovian Arrival Process (BMAP)

An extension of the Poisson process that allows for batch arrivals and captures correlations and burstiness in traffic. BMAP 
support batch arrivals i.e. multiple packets can arrive simultaneously and is governed by an underlying Markov chain.  This 
is suitable for modeling traffic with correlated arrivals such as bursts of packets or flows.

### Self-similar Arrival Processes

Arrival processes that exhibit self-similarity, meaning their statistical properties remain consistent across different time 
scales. Some key properties are Long-Range Dependence i.e. significant correlations between arrivals separated by long time 
intervals. It exhibits a Fractal behavior i.e.  the arrival process looks similar at various time scales. We can see the fractal 
behavior below for self-similar traffic where as we zoom in from hours to seconds, the behavior is same unlike the poisson traffic.

{: .center}
![Self-Similar vs Poisson](/images/post29/fig3.png "Self-Similar vs Poisson")

Ref: Deploying IP and MPLS QoS for Multiservice Networks: Theory and Practice

We can measure self-similarity by hurst-parameter with  $0.5 \lt H \lt 1$ indicates long-range dependance.

### Markov Modulated Poisson Process (MMPP)

A Poisson process where the arrival rate is governed by a Markov chain, allowing the rate to change based on different states. 
This allows us to model state dependent arrival rates, where we can have different arrival rates for different states of the 
underlying markov chain. This is suitable to model traffic with different modes such as high and low traffic periods.


Here is a plot to show various arrival processes and how they look different. Anytime if you are modeling things like scheduling, 
buffer occupancy etc. the type of arrival process matters. This makes it extremely important on what assumptions one is making 
for the traffic pattern.

{: .center}
![Comparison](/images/post29/fig4.png "Poisson BMAP")

## Temporal Patterns

### Seasonality and Trend

Seasonality refers to regular and predictable patterns or fluctuations that occur at specific intervals. examples of seasonality 
can be traffic peaking during business hours and drop during night. Understanding seasonality helps in traffic forecasting and capacity planning.

Trend is a long-term increase or decrease over time. Trend indicates the general direction in which traffic patterns are moving, 
irrespective of short-term fluctuations or seasonal effects. 

A Time series data can have both seasonality and Trend present. One can use Seasonal Decomposition of Time Series (STL) to decompose 
into seasonal, trend and residual components. SARIMA is another classical model coming from econometrics to capture seasonality with ARIMA.

To extract trend from a time series data, one can apply techniques like linear regression, moving average, exponential smoothing or 
locally weighted polynomial regression (LOESS).

Here is a timeseries which has both seasonality and trend.

{: .center}
![Seasonality with Trend](/images/post29/fig5.png "Seasonality with Trend")

Above timeseries is decomposed into Seasonal, Trend and everything left in the residual using STL.

{: .center}
![STL](/images/post29/fig6.png "STL")

### ON/OFF Behavior in Network Traffic

This refers to traffic patterns characterized by alternating periods of high activity (ON) and low or no activity (OFF). During 
the ON periods, there is a burst of traffic, whereas during the OFF periods, the traffic is minimal or nonexistent. Example 
of this would be traffic patterns between GPUs.

In order to characterize this behavior we need to under the duration of ON and OFF periods for burstiness analysis. This can 
be simulated using Markov Modulated processes and decomposed using Wavelet analysis. 

Here is a synthetic traffic with On/Off traffic pattern.

{: .center}
![ON/OFF](/images/post29/fig7.png "ON/OFF")

## Scale-Related Properties

Scale related properties focuses on how traffic patterns behave and maintain consistency across different time scales.

### Self-similarity and Long-Range Dependence

We already looked at this in the self-similar process section and as mentioned earlier, it's a property where traffic patterns look 
similar across different time scales. This means that zooming in or out on the traffic data reveals similar structures and patterns, 
regardless of the time scale used.

It can be measured by Hurst Parameter which is a measure of self-similarity. Values of H ranges between 0.5 and 1.

- H = 0.5: indicates no long-term memory.
- $0.5 \lt H \lt 1$: indicates self-similarity.
- H = 1: indicates perfect self-similarity.

Long-range dependence (LRD) refers to significant correlations between values over long periods. We can measure this by looking 
at the ACF plots to see the correlation. 

Here we are looking at a synthetic traffic with ACF plots which shows the values decay very slowly for the lags indicating 
strong correlation over long periods confirming long-range dependence. 

{: .center}
![Self-Similar](/images/post29/fig8.png "Self-Similar")

### Multifractal Scaling

This is a  property where traffic exhibits different scaling behaviors at different moments. This implies that the statistical 
properties of the traffic can vary widely, depending on the time scale and the location in the time series.

We can use Multifractal Detrended Fluctuation Analysis (MFDFA) to measure the multifractal properties of time series data.


## Variability and Burstiness

### Burstiness

This refers to high variability in traffic over short periods. It is characterized by sudden spikes or bursts in traffic volume.

{: .center}
![Burstiness](/images/post29/fig9.png "Burstiness")

### Peak to Mean

This is the difference between the peak and the average traffic rate over a period. This ratio is an important metric for understanding the extremes in traffic behavior.

Below is the histogram of the above highlight the peak and average rate of traffic observed.

{: .center}
![Peak to Mean](/images/post29/fig10.png "Peak to Mean")

### Variability (Coefficient of Variation)

The Coefficient of Variation (CV) is a measure of relative variability. It is defined as the ratio of the standard deviation to the mean of the traffic volume.


## Correlation and Dependency

### Autocorrelation and Partial Autocorrelation

Autocorrelation is the correlation of a signal with a delayed copy of itself as a function of delay. In other words, it 
measures how similar the observations are between time series points separated by a given time lag. The autocorrelation 
function (ACF) gives us the correlation between any two values of the same variable at times $t_{i}$ and $t_{j}$. We can also 
use PACF to measure the correlation between an observation $Y_{t}$ and $Y_{t-k}$ after removing the effects of all the intermediate observations $Y_{t-1}, Y_{t-2}, ..., Y_{t-k+1}$.

Below we have an auto-correlated series and the ACF plot shows that values start at 1 for lag 0 and remain significantly 
positive for many lags indicating strong autocorrelation. The slow decay of the ACF values indicates that the traffic has a 
strong autocorrelation structure, meaning that traffic volumes at one time point are highly influenced by previous lags.

The sharp decline in the PACF values after the first few lags indicates that the traffic is primarily influenced by the 
most recent past values. This suggests that while there is strong autocorrelation in the short term, the direct influence 
of traffic volumes diminishes quickly with increasing lag.

{: .center}
![ACF](/images/post29/fig11.png "ACF")

## Random Walk

A random walk is a stochastic process that describes a path consisting of a succession of random steps. It is a fundamental 
concept in probability and is used to model various phenomena in fields such as physics, finance, and network theory.

Some main properties are:
- The path is formed by a series of steps, where each step is determined by a random process.
- Each step is independent of the previous steps.
- The statistical properties of the steps do not change over time (Stationarity).

Examples:

**Simple Random Walk**: 
A process where each step is equally likely to move up or down by a fixed amount. This can be given by $X_{t} = X_{t-1} + \epsilon_{t}$. where $\epsilon_{t}$ is a random variable.

**Brownian Motion**:
A continuous-time random walk where the steps follow a normal distribution. This can be given by $X(t) = X(0) + \int_{0}^{t}\sigma dW(s)$ where $W(s)$ is a wiener process and $\sigma$ is the volatility.    


Here is a synthetic simple random walk and brownian motion example:

{: .center}
![Random Walk](/images/post29/fig12.png "Random Walk")

## Stationarity and Time-Invariance

### Stationarity

A time series is said to be stationary if its statistical properties, such as mean, variance, and autocorrelation, do not change over time. This implies that the process generating the data remains constant over time.

Types of Stationarity:
 
1. **Strict Stationarity**: The joint distribution of any set of observations is invariant under time shifts. This is a very strong condition and is rarely met in practice.

2. **Weak Stationarity (Second-Order Stationarity)**: Only the first two moments (mean and variance) and the autocorrelation structure are invariant under time shifts. This is more commonly used in practical applications.

A time series is said to be non-stationary if its statistical properties change over time. This includes changes in mean, variance, autocorrelation, and the presence of trends or seasonal patterns.

This is an example of stationary time series, which we can see the mean and variance seems to be stable over time.

{: .center}
![Stationarity](/images/post29/fig13.png "Stationarity")

This is an example of Non-Stationary time series as it has trend which means the mean is not constant over time. 

{: .center}
![Non-Stationarity](/images/post29/fig14.png "Non-Stationarity")

# Conclusion

We’ve covered several crucial traffic properties that are essential to understand. These include temporal patterns like 
seasonality and trends, scale-related behaviors such as self-similarity and long-range dependence, and statistical distribution 
characteristics. Each property uniquely influences network performance. For example, buffer sizing and packet drops will 
vary depending on the traffic’s burstiness and arrival patterns.

In the next post, we will simulate a Random Early Detection (RED) process and explore how different parameters impact network 
performance based on various traffic characteristics.













Now let's look at a slightly more complex example:

- Objective function: $f(x,y) = 2 - x^2-2y^2$
- Constraint: $g(x,y) = x^2-y^2-1=0$

To solve this we can express $y$ in terms of $x$ from the constraint $x^2-y^2=1$:

$$
\hspace{5cm} y = \pm \sqrt{1-x^2}
$$

Then substitute $y$ back into $f$:

$$
\hspace{5cm} f(x,\sqrt{1-x^2}) = 2 - x^2-2(1-x^2) = 2-x^2-2+2x^2 = x^2
$$

$$
\hspace{5cm} f(x,-\sqrt{1-x^2}) = 2 - x^2-2(1-x^2) = 2-x^2-2+2x^2 = x^2
$$

The maximum value occurs at $x=\pm1$ and $y=0$. We can see in the below plot that the surface of the function $f(x)$ and 
the constraint $g(x)$ shown by the red circle on the surface which bounds the maximum value the function $f(x)$ can have. Feel free
to play with the figure and observe the function from various points of view to get some intuitive understanding on why the max value
occurs at $x=\pm1$ and $y=0$.


{% include interactive_plot.html %}

## Lagrange Multipliers

### Intuition

If you recall the gradient of a function points in the direction of steepest ascent. The gradient of the objective function $f$ needs 
to be perpendicular to the gradient of the constraint function $g$ at the constrained maximum point $x^*$.

1. The gradient $$\nabla f(x^{*})$$ points in the direction of steepest ascent of $f$ at $x^{*}$. If we could move in that direction, we would increase $f$.
2. The gradient $$\nabla g(x^{*})$$ is perpendicular to the constraint surface $g(x)=0$ at constrained maximum $x^*$. Any movement along the constraint surface 
(i.e., in a direction tangent to the surface) won't change the value of g.
3. if $$\nabla f(x^{*})$$ was not perpendicular to $$\nabla g(x^{*})$$, then it would have a component tangent to a constraint surface. We could 
move in that allowed direction and increase $f$, contradicting the assumption that $x^*$ is a constrained maximum.
4. Therefore, for $x^*$ to be a constrained maximum $$\nabla f(x^{*})$$ must be perpendicular to the constraint surface. Equivalently $$\nabla f(x^{*})$$ must 
be parallel to $$\nabla g(x^{*})$$, i.e. a scalar multiple of it: $$\nabla f(x^*) = \lambda \nabla g(x^{*})$$ for some scalar $\lambda$. This is precisely the 
condition encoded by the Lagrangian.

Here is another function $f(x)$ and a constraint function $g(x)$ shown in red line. You can see that the function $f(x)$ has two 
maxima's and minima's. The gradients of $f(x)$ will point in the direction of those maxima's. The cosntraint function is a circle, 
and it's gradient will point outwards as that is where the constraint function will be maximum.

{% include interactive_3d_plot.html %}

If we look at the interactive contour plot of the above function $f(x)$ and $g(x)$, where the red arrow is the gradient of 
$f(x)$, blue arrow is gradient of $g(x)$ and black arrow is vector with the gradients from both functions as components.

As you rotate the blue dot around the circle, you will see where the gradients for both functions become parallel.

{% include gradient.html %}
ref:[Visualizing the Lagrange Multiplier Method](https://www.geogebra.org/m/gCWD3M4G)

### Lagrangian with single constraint

Now going to back our example from substitution method $f(x,y) = 2 - x^2-2y^2$, we will add the constraint using Lagrangian multiplier $$\nabla f(x^*) - \lambda \nabla g(x^{*})$$. We will find the gradients of the functions and solving for the critical points gives us potential maxima or minima within the constraint.

$$
\hspace{5cm} \mathscr{L}(x,y,\lambda) = f(x,y)-\lambda(x,y)
$$

$$
\hspace{5cm} \mathscr{L}(x,y,\lambda) = 2-x^2-2y^2-\lambda(x^2+y^2-1)
$$

Taking the partial derivatives and setting them to zero:

$$
\hspace{5cm} \frac{\partial \mathscr{L} }{\partial x} = -2x - 2\lambda x = 0
$$
This gives us $x=0$ and $\lambda = -1$.

$$
\hspace{5cm} \frac{\partial \mathscr{L} }{\partial y} = -4y - 2\lambda y = 0
$$
This gives us $y=0$ or $\lambda = -2$.

$$
\hspace{5cm} \frac{\partial \mathscr{L} }{\partial \lambda} = x^2+y^2 - 1 = 0
$$

Case 1:
If $x = 0$, then $0^2+y^2=1$. This gives $y=\pm1$. So the points are $(0,1)$ and $(0-1)$.

- for $(0,1)$, $\lambda=-2$ and $f(0,1)=0$
- for $(0,-1)$,$\lambda=-2$ and $f(0,-1)=0$

Case 2: 
if $y=0$, then from the constraints, $x^2+0^2=1$. This gives $x=\pm1$.So the points are $(1,0)$ and $(-1,0)$.

- for $(1,0)$, $\lambda=-1$ and $f(1,0)=1$
- for $(-1,0)$, $\lambda=-1$ and $f(-1,0)=1$

We can see the maxima for $f(x,y)$ is $1$ at the points $(1,0)$ and $(-1,0)$.

{: .center}
![Constrained Maxima](/images/post28/fig4.png "Maxima")

### Lagrangian with Multiple constraints

When optimizing a function  $f(x_1, x_2, \ldots, x_n)$  subject to multiple constraints  $g_1(x_1, x_2, \ldots, x_n) = 0,g_2(x_1, x_2, \ldots, x_n) = 0 , …,  g_m(x_1, x_2, \ldots, x_n) = 0$, the Lagrangian function becomes:

$$
\hspace{5cm} \mathscr{L}(x_1, x_2, \ldots, x_n, \lambda_1, \lambda_2, \ldots, \lambda_m) = f(x_1, x_2, \ldots, x_n) - \sum_{i=1}^{m} \lambda_i g_i(x_1, x_2, \ldots, x_n) 
$$

Each  $\lambda_i$  is a Lagrange multiplier associated with the constraint  $g_i$ .To find the extrema, we take the partial derivatives of the Lagrangian with respect to each variable and each multiplier, then set them to zero:

$$
\hspace{5cm} \frac{\partial \mathscr{L}}{\partial x_j} = 0 \quad \text{for each } j = 1, 2, \ldots, n 
$$

$$
\hspace{5cm} \frac{\partial \mathscr{L}}{\partial \lambda_i} = 0 \quad \text{for each } i = 1, 2, \ldots, m 
$$

This gives us a system of  $n + m$  equations.

# Lagrangian Encoding

Consider a constrained optimization problem where we want to maximize or minimize an objective function  $f(x)$  subject to one or more constraints  $g_i(x) = 0$ . The Lagrangian function $\mathscr{L}(x, \lambda)$  is defined as:

$$
\hspace{5cm} \mathscr{L}(x, \lambda) = f(x) - \sum_{i} \lambda_i g_i(x) 
$$

Here:
- $f(x)$  is the objective function we want to optimize.
- $g_i(x)$  are the constraint functions.
- $\lambda_i$  are the Lagrange multipliers associated with each constraint.

The Lagrangian function encapsulates both the objective function and the constraints into a single expression. This allows us to transform the constrained optimization problem into an unconstrained one by finding the saddle points of the Lagrangian.

Think of the Lagrangian as a way to blend the objective function and the constraints. By introducing the multipliers $\lambda_i$ , we penalize deviations from the constraints while still focusing on optimizing  $f(x)$.

The multipliers $\lambda_i$  act like balancing weights. They adjust the influence of each constraint on the optimization process. If a constraint is more stringent, the corresponding  $\lambda_i$ will be higher, indicating a stronger penalty for violating that constraint. The optimization process using the Lagrangian involves two main steps:

1. **Fix the Multipliers**: For a given set of ( $\lambda_i$ ), find the values of ( $x$ ) that maximize (or minimize) ( $\mathscr{L}(x, \lambda)$ ).
2. **Adjust the Multipliers**: Adjust the values of ( $\lambda_i$ ) to ensure the constraints ( $g_i(x) = 0$ ) are satisfied.

The Lagrangian helps to formalize the process of finding points where the gradients of the objective function and the constraints are aligned, ensuring the constraints are met while optimizing the objective function.

## Duality

Instead of directly solving the original constrained problem (primal problem), we can solve its dual problem. The dual problem focuses on minimizing the Lagrangian with respect to the multipliers, given the values of the primal variables.

For the primal problem:
$$
\hspace{5cm} \text{maximize } f(x) \text{ subject to } g_i(x) = 0,
$$

the dual problem involves:

$$
\hspace{5cm} \text{minimizing } \mathscr{L}(x, \lambda) \text{ with respect to } \lambda \text{ subject to the dual constraints}.
$$

This transformation often simplifies the problem, especially when the dual problem is easier to solve.

## Kuhn-Tucker Theorem

Kuhn-Tucker theorem provides necessary conditions for a solution in nonlinear programming to be optimal, extending the Lagrange multiplier method to handle inequality constraints.

For a problem with both equality and inequality constraints, the Lagrangian is defined as:

$$
\hspace{5cm} \mathscr{L}(x, \lambda, \mu) = f(x) - \sum_{i} \lambda_i g_i(x) - \sum_{j} \mu_j h_j(x) 
$$

Here:
- $f(x)$  is the objective function.
- $g_i(x) = 0$  are the equality constraints.
- $h_j(x) \leq 0$  are the inequality constraints.
- $\lambda_i$  and  $\mu_j$  are the Lagrange multipliers for the equality and inequality constraints, respectively.

### Conditions for Optimality

The essential idea behind the KKT conditions is to convert a constrained optimization problem into a system of equations 
that can be solved to find the optimal solution. The KKT conditions provide necessary conditions for a point to be optimal, meaning 
that if a point satisfies these conditions, it is a candidate for the optimal solution.


The Kuhn-Tucker conditions are a set of first-order necessary conditions for a solution to be optimal:

Given a nonlinear programming problem:

$$
\hspace{5cm} \text{minimize } f(x) 
$$

$$
\hspace{5cm} \text{subject to } g_i(x) = 0, \; i = 1, \ldots, m 
$$

$$
\hspace{5cm} \text{and } h_j(x) \leq 0, \; j = 1, \ldots, p 
$$

The Kuhn-Tucker conditions are:

- Stationarity:

$$
\hspace{5cm} \nabla f(x^*) + \sum_{i=1}^m \lambda_i \nabla g_i(x^*) + \sum_{j=1}^p \mu_j \nabla h_j(x^*) = 0
$$

The stationarity condition involves setting the gradient of the Lagrangian to zero. This balances the gradient of the 
objective function $f(x)$  against the weighted gradients of the constraints. The weights are the Lagrange multipliers  $\lambda_i$  and  $\mu_j$ .

- Primal Feasibility:

$$
\hspace{5cm} g_i(x^*) = 0, \; i = 1, \ldots, m 
$$

$$
\hspace{5cm} h_j(x^*) \leq 0, \; j = 1, \ldots, p 
$$

This condition ensures that the solution  $$x^{*}$$  satisfies the original equality and inequality constraints. This means  $$x^{*}$$  
lies within the feasible region defined by these constraints.

- Dual Feasibility:

$$
\hspace{5cm} \mu_j \geq 0, \; j = 1, \ldots, p
$$

Dual feasibility requires the Lagrange multipliers associated with the inequality constraints to be non-negative. This is necessary 
because the multipliers  $\mu_j$  represent the shadow prices of the constraints, which must be non-negative to reflect that 
relaxing a constraint (making it less stringent) would not decrease the objective function.

- Complementary Slackness:

$$
\hspace{5cm} \mu_j h_j(x^*) = 0, \; j = 1, \ldots, p
$$

Complementary slackness ensures that for each inequality constraint, either the constraint is active (exactly met) or the 
corresponding multiplier is zero. If a constraint is not binding (i.e.,  $$h_j(x^{*}) < 0$$ ), its multiplier $\mu_j$  must be 
zero because the constraint does not affect the solution. Conversely, if the constraint is binding (i.e.,  $$h_j(x^{*}) = 0$$ ), the 
multiplier  $\mu_j$  can be positive, reflecting the cost of tightening the constraint.

### Convex Hulls and Optimization

Before we move on to the application aspects, it's important to mention about the geometrical aspects of the Convex Hulls and it's relation to the optimization.

**Convex Hull**

The convex hull of a set of points  $S$  in a Euclidean space is the smallest convex set that contains  $S$ . It can be visualized 
as the shape formed by stretching a rubber band around the points. The convex hull of a set  $S$ , denoted as  $\text{conv}(S)$ , is 
the set of all convex combinations of points in  $S$ :

$$
\hspace{5cm} \text{conv}(S) = \left\{ \sum_{i=1}^n \lambda_i x_i \mid x_i \in S, \lambda_i \geq 0, \sum_{i=1}^n \lambda_i = 1 \right\}
$$

**Convex Hulls and Optimization**

When solving optimization problems over a set of points, it is often beneficial to consider the convex hull of these points. If the 
objective function is linear and the feasible region is defined by the convex hull of a set of points, the optimal solution will 
lie on the boundary of the convex hull.

{: .center}
![Convex Hull](/images/post28/fig6.png "Convex Hull")

The convex hull contains all feasible solutions to the optimization problem within the smallest convex boundary. The extreme 
points of the convex hull are the potential candidates for the optimal solution in linear programming problems. The optimal solution 
for a linear objective function over a convex hull will always be at one of the vertices of the convex hull. By visualizing the 
direction of the objective function, you can determine which vertex is optimal.

The above  plot demonstrates why optimization algorithms like the Simplex Method are effective in linear programming: they 
move along the edges of the feasible region (convex hull) from vertex to vertex, searching for the optimal solution.

# Application of Lagrangian

So we have already seen some introduction of Lagrangian here [Balancing MMLU With The Shortest Path Cost Constraints](https://dipsingh.github.io/Balancing-MMLU-PathCostConstraints/) without 
explicitly calling it as Lagrangian. But lets look at a simple example this time.

Here is a simple graph where we the edges have a cost to traverse and the time it takes. Finding a shortest path from Node 
$1$ to $6$ is easy and we have looked at those LP formulation. In this case now assume that we have an additional constraint 
that the total time to traverse from Node $1$ to $6$ should not exceed time $T$.

{: .center}
![graph](/images/post28/fig7.png "Graph")

## Lagrangian Relaxation Approach

To tackle the complexity introduced by the transit time constraint, the Lagrangian relaxation method is employed:

Step 1: Penalize Constraint Violation:
	•	Introduce a Lagrangian multiplier ( $\lambda$ ) to penalize violations of the transit time constraint.
	•	Modify the objective function to include this penalty:

$$
\hspace{5cm} \mathscr{L}(\lambda) = \min \sum_{(i,j) \in A} (c_{ij} + \lambda t_{ij}) x_{ij} - \lambda T 
$$

Here,$x_{ij}$ is a binary variable indicating whether arc ( $(i,j)$ ) is included in the path.
	
Step 2: Relax the Problem:
	•	Remove the complicating constraint ( $\sum_{(i,j) \in A} t_{ij} x_{ij} \leq T$ ) and as we included it in the objective function as a penalty.
	•	The resulting problem is easier to solve since it is now a standard shortest path problem but with modified arc costs.

**Effect of Varying ( $\lambda$ )**

Case 1: ( $\lambda = 0$ ):
- The problem reduces to finding the shortest path without considering transit time.
- The solution is simply the path with the minimum cost.

Case 2: ( $\lambda > 0$ ):
- As ( $\lambda$ ) increases, the cost of paths with higher transit times increases.
- The solution path changes, favoring those with lower transit times to avoid high penalties.
- By adjusting ($\lambda$ ), the algorithm finds paths that balance cost and transit time, providing a trade-off.

Optimization and Bounds
- The goal is to find the optimal ($\lambda$ ) that maximizes the lower bound on the original problem’s objective value.
- The optimal value  $\mathscr{L}^*$  is found by solving:

$$
\hspace{5cm} \mathscr{L}^* = \max \{ \mathscr{L}(\lambda) : \lambda \geq 0 \}
$$

Bounding Principle:
- The obtained lower bound  $\mathscr{L}(\lambda)$  is used to gauge the quality of the solution.
- If  $\mathscr{L}(\lambda)$  is close to the actual minimum cost, the solution is considered good.

here is a parametric analysis of the problem. We can see the red line representing cost is minimum with $\lambda=0$, and starts increasing but start plateauing after a while as we increase $\lambda$. 
The Transit Time line shown the inverse, which also make sense as we increase $\lambda$, we start optimizing for the transit time.

Based on the graph, it appears that we want either $\lambda=3\text{ or }4$, where we meet the latency constraint of 10.

{: .center}
![parametric analysis](/images/post28/fig8.png "Parametric Analysis")

## Restricted Lagrangian Approach

The restricted Lagrangian approach involves iteratively solving a restricted version of the Lagrangian relaxation by only considering a subset of feasible solutions. The key steps are:

1. Initialize the Set  S : Start with a small subset of feasible paths, such as the shortest path without considering the transit time constraint.
2. Solve the Restricted Lagrangian Problem: Obtain the current lower bound and Lagrange multipliers.
3. Solve the Lagrangian Subproblem: Find the shortest path considering the modified costs and identify new paths.
4. Iterate: Expand the set  S  with new paths until the optimal solution is found.

Assume that now we want to find the optimal solution with maximum Transit time T = 14. The optimal solution is 1->3->2->5->6 based 
on the restricted Lagrangian approach where $\lambda=4$.

```
Optimal path: [(1, 3),(3, 2),(2, 5), (5, 6)]
Optimal Lagrange multiplier: 4.0
```

Here is the code snippet for the relaxed Lagrangian approach.

```text
# Define the graph with given costs and transit times
nodes = [1, 2, 3, 4, 5, 6]
arcs = {
    (1, 2): {'cost': 1, 'time': 10},
    (1, 3): {'cost': 10, 'time': 3},
    (2, 4): {'cost': 1, 'time': 1},
    (2, 5): {'cost': 2, 'time': 3},
    (3, 2): {'cost': 1, 'time': 2},
    (3, 5): {'cost': 12, 'time': 3},
    (3, 4): {'cost': 5, 'time': 7},
    (4, 6): {'cost': 1, 'time': 7},
    (4, 5): {'cost': 10, 'time': 1},
    (5, 6): {'cost': 2, 'time': 2},
}

# Define the maximum allowed transit time
T = 14

# Function to solve the Lagrangian subproblem for a given set of paths and Lagrange multipliers
def lagrangian_subproblem(mu):
    prob = pulp.LpProblem("Lagrangian_Subproblem", pulp.LpMinimize)
    
    # Define decision variables
    x = pulp.LpVariable.dicts("x", arcs, cat='Binary')
    
    # Define the objective function
    prob += pulp.lpSum((arcs[i, j]['cost'] + mu * arcs[i, j]['time']) * x[i, j] for (i, j) in arcs) - mu * T
    
    # Define constraints for flow conservation
    for node in nodes:
        if node == 1:
            prob += pulp.lpSum(x[1, j] for j in nodes if (1, j) in arcs) == 1
        elif node == 6:
            prob += pulp.lpSum(x[i, 6] for i in nodes if (i, 6) in arcs) == 1
        else:
            prob += (pulp.lpSum(x[i, node] for i in nodes if (i, node) in arcs) == 
                     pulp.lpSum(x[node, j] for j in nodes if (node, j) in arcs))
    
    # Solve the problem
    prob.solve()
    
    # Extract the path and transit time
    new_path = [(i, j) for (i, j) in arcs if x[i, j].varValue == 1]
    transit_time = sum(arcs[i, j]['time'] * x[i, j].varValue for (i, j) in arcs)
    
    return new_path, transit_time

# Function to solve the restricted Lagrangian problem
def solve_restricted_lagrangian(S):
    prob = pulp.LpProblem("Restricted_Lagrangian", pulp.LpMaximize)
    
    # Define decision variable
    w = pulp.LpVariable("w")
    mu = {k: pulp.LpVariable(f"mu_{k[0]}_{k[1]}", lowBound=0) for k in arcs}
    
    # Add constraints for each path in S
    for path in S:
        cost_sum = sum(arcs[i, j]['cost'] for (i, j) in path)
        time_sum = sum(arcs[i, j]['time'] for (i, j) in path)
        prob += w <= cost_sum + pulp.lpSum(mu[(i, j)] * arcs[i, j]['time'] for (i, j) in path) - sum(mu[(i, j)] * T for (i, j) in path)
    
    # Define the objective function
    prob += w
    
    # Solve the problem
    prob.solve()
    
    # Extract the Lagrange multipliers and initialize to zero if not set
    mu_values = {k: pulp.value(mu[k]) if pulp.value(mu[k]) is not None else 0 for k in mu}
    return pulp.value(w), mu_values

# Function to solve the constraint generation problem
def constraint_generation():
    # Initialize the set S with the shortest path without considering the transit time constraint
    initial_path = find_path_with_lambda(0)
    S = [initial_path]
    mu = 0
    
    while True:
        # Solve the restricted Lagrangian problem
        lower_bound, mu_values = solve_restricted_lagrangian(S)
        
        # Solve the Lagrangian subproblem with the current mu values
        new_path, transit_time = lagrangian_subproblem(mu)
        
        # Check if the new path violates the transit time constraint
        if transit_time > T:
            # Add the new path to the set S
            if new_path not in S:
                S.append(new_path)
            
            # Update the Lagrange multiplier using subgradient optimization
            subgradient = transit_time - T
            step_size = 1 / (len(S) ** 0.5)
            mu += step_size * subgradient
        else:
            # The current solution is optimal
            optimal_path = new_path
            break
    
    return optimal_path, mu

# Function to find the shortest path for a given lambda value
def find_path_with_lambda(lambda_value):
    prob = pulp.LpProblem("Shortest_Path", pulp.LpMinimize)
    
    # Define decision variables
    x = pulp.LpVariable.dicts("x", arcs, cat='Binary')
    
    # Define the objective function
    prob += pulp.lpSum((arcs[i, j]['cost'] + lambda_value * arcs[i, j]['time']) * x[i, j] for (i, j) in arcs)
    
    # Define constraints for flow conservation
    for node in nodes:
        if node == 1:
            prob += pulp.lpSum(x[1, j] for j in nodes if (1, j) in arcs) == 1
        elif node == 6:
            prob += pulp.lpSum(x[i, 6] for i in nodes if (i, 6) in arcs) == 1
        else:
            prob += (pulp.lpSum(x[i, node] for i in nodes if (i, node) in arcs) == 
                     pulp.lpSum(x[node, j] for j in nodes if (node, j) in arcs))
    
    # Solve the problem
    prob.solve()
    
    # Extract the path
    path = [(i, j) for (i, j) in arcs if x[i, j].varValue == 1]
    return path

# Solve the constraint generation problem
optimal_path, optimal_mu = constraint_generation()

print(f"Optimal path: {optimal_path}")
print(f"Optimal Lagrange multiplier: {optimal_mu}")
```

# References

- [MIT OCW 15.082J - Network Optimization](https://ocw.mit.edu/courses/15-082j-network-optimization-fall-2010/)
- [Lagrange Multipliers without Permanent Scarring](https://people.eecs.berkeley.edu/~klein/papers/lagrange-multipliers.pdf)
- [Balancing MMLU With The Shortest Path Cost Constraints](https://dipsingh.github.io/Balancing-MMLU-PathCostConstraints/)

