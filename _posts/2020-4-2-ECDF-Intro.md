---
layout: post
title: What is an ECDF anyway
---

## Motivation
A few years back my colleague introduced me to ECDF's while doing some Time Series analysis. I quickly realized how elegant they are. This post is my attempt to pay it forward and would consider this post a success if at a bare minimum you are able to read an ECDF plot by the end of this post.

## Prerequisites
I am presuming that the reader has somewhat familiarity with probability theory and understand what is a Cumulative Distribution Function (CDF). If you don’t, then either you can skip the section ECDF introduction section or do some background reading.

## Problem Statement
We as Network engineers see Time series almost every day in our lives.Let's say we have two time series (Fig.1) which represents egress traffic of two router interface.Just by looking at it, various observations can be made. In this post, we will like to summarize things like:
 * Use ECDF to look at various percentiles like what is the 99th or 95th percentile of the traffic we observe.
 * How does an ECDF looks like when the traffic is bi-modal.
 * Use ECDF's to compare two separate time-series.
 
 ![Sample Time Series](/images/post1/fig_1.png "Sample Time Series")

