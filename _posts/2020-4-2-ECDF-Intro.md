---
layout: post
title: What is an ECDF anyway
---

## Motivation
A few years back my colleague introduced me to ECDF's while doing some Time Series analysis. I quickly realized how elegant they are. This post is my attempt to pay it forward and would consider this post a success if at a bare minimum you are able to read an ECDF plot by the end of this post.

## Prerequisites
I am presuming that the reader has somewhat familiarity with probability theory and understand what a Cumulative Distribution Function (CDF) is.If you don’t, then either you can skip the section ECDF introduction section or do some background reading.

## Problem Statement
We as Network engineers see Time series almost every day in our lives.Let's say we have two made up time series (Fig.1) which represents egress traffic of router interfaces.Just by looking at it, various observations can be made. In this post, we will like to summarize things like:
 * Use ECDF to look at various percentiles like what is the 99th or 95th percentile of the traffic we observe.
 * How does an ECDF looks like when the traffic is bi-modal.
 * Use ECDF's to compare two separate time-series.
 
 ![Sample Time Series](/images/post1/fig_1.png "Sample Time Series")

## What is an Empirical Distribution Function (ECDF)
An ECDF is basically a non-parametric estimator of the underlying CDF of a random variable. The difference between a CDF and ECDF is how probability measures are used. In case of an ECDF, the probability measure is defined by the frequency counts in an empirical sample. In other words, ECDF is the probability distribution which you would get if sampled from your set of observations.

Let's assume that we have `n` observations. An ECDF, assigns a probability of `1/n` to each observation, sort them from smallest to largest, and then sums the assigned probabilities up to and including each observation.

For instance, lets take a look at a simple example:

```python
import matplotlib.pyplot as plt
import numpy as np
# generate 100 observations from a normal distribution with loc = 100 and size =1.
obs = np.random.normal(100, 1, 100)
# sort the observations in increasing order
x = np.sort(obs)
# size of the observations
n = len(obs)
# divide each datum by 1/n 
y = np.arange(1, n+1)/n
# ECDF plot
fig, ax = plt.subplots(figsize=(12,4))
plt.plot(x,y)
ax.set_title("Sample ECDF", fontsize=14)
ax.xaxis.set_ticks_position('none')
ax.yaxis.set_ticks_position('none')
ax.spines["top"].set_alpha(0)
ax.tick_params(labelsize=6)
ax.set_ylabel("Frac. Of Observations", fontsize=12)
ax.set_xlabel("Observations", fontsize=12)
ax.tick_params(axis='both', which='major', labelsize=12)
ax.tick_params(axis='both', which='minor', labelsize=12)
plt.tight_layout(h_pad=1.5)
```
This gives us a sample ECDF
 ![Sample ECDF](/images/post1/fig_2.png "Sample ECDF")
