---
layout: visual-primer
title: "A Visual Primer on Spectral Graph Theory"
primer: spectral
---

> "When we try to pick out anything by itself, we find it hitched to everything else in the Universe." - John Muir

## Provide Context
Todo: 

## 1. Start with the graph

<p class="chapter-tag">three friends each, two doors out</p>

### Eight routers, twelve links

We will use one small network to see how a group of routers can have very few connections to the rest. Its graph has eight nodes, numbered 1 to 8, and twelve edges. An edge joins a pair of nodes, and two nodes joined by an edge are *neighbours*. Think of a node as a router and an edge as a cable between two routers. “Graph” is just the mathematician's word for a wiring diagram.<sup class="fnref"><a href="#fn-1" id="fnref-1" data-fn="1" aria-expanded="false" aria-label="Footnote 1">[1]</a></sup>

{% include visual-primer/spectral/figure-03.html %}

A node's number identifies it. Its position on the page only helps us see the wiring. We could slide the circles around or bend the lines without changing a single connection.

The number of neighbours a node has is its *degree*. Every node here has degree three. A graph whose nodes all have the same degree is called *regular*, so this one is 3-regular.

### Three links each, two doors out

Now imagine using this graph as a network. Every router has three neighbours. Yet only two links connect nodes 1–4 to nodes 5–8. All the traffic between the two halves has to squeeze through one of those two links. Looking at the routers one at a time, you would never notice.

{% include visual-primer/spectral/figure-04.html %}

### Paint one side, then write it down

To study this division, give every node in one group the value +1 and every node in the other the value −1. We'll call this a *paint check*. These are temporary labels for testing the division. They don't change the wiring and they aren't traffic rates.

One value at every node is what we'll call a *pattern*. Collect the values in node-number order and you get a vector, <span class="math">x</span>. Its entry <span class="math">x₃</span> is the value at node 3, here +1. The entry has nothing to do with where node 3 sits on the page.

{% include visual-primer/spectral/figure-05.html %}

All our edges run both ways and count the same. There are no edges from a node to itself and no doubled edges between a pair. Next we build the matrices that compare the painted values along the links.

<a id="laplacian" class="chapter-anchor"></a>

## 2. Turn the wiring into A, D and L

<p class="chapter-tag">three machines at one node</p>

### Start with one node's comparison

To find where the two groups meet, we can compare each node's value with its neighbours' values. Start with node 3, which holds +1. Its neighbours 1 and 2 also hold +1, and its neighbour 5 holds −1. Subtract each neighbour's value from node 3's own value, then add the three results:

<div class="equation" role="math" aria-label="At node 3, one minus one, plus one minus one, plus one minus negative one, equals two.">(1 − 1) + (1 − 1) + (1 − (−1)) = 2</div>

The two neighbours in the same group contribute zero. The neighbour across the division contributes 2. Notice how the calculation is built: it uses node 3's own value three times, once per link, and subtracts the sum of the neighbours' values. We want to do the same at every node at once, and two matrices supply the two parts.

{% include visual-primer/spectral/figure-06.html %}

### A: collect the neighbours' values

Give every node a row and a column, in node-number order. Put a 1 wherever two nodes share an edge and a 0 wherever they don't. This table is the *adjacency matrix*, called <span class="math">A</span>. “Adjacent” means joined by an edge.

Multiplying A by the pattern x gives one result per node. Row 3 tells us how to calculate node 3’s result: its 1s select the values at neighbours 1, 2 and 5, and its zeros leave the other values out.

<div class="equation" role="math" aria-label="At node 3, A x equals x one plus x two plus x five, which is one plus one minus one, or one.">(Ax)₃ = x₁ + x₂ + x₅ = 1 + 1 + (−1) = 1</div>

The result is the sum of the neighbours’ values. To get their average we would divide by three; A performs the sum.

{% include visual-primer/spectral/figure-07.html %}

Every edge appears twice in A. The edge 3–5 puts a 1 in row 3, column 5, and another in row 5, column 3. So A is symmetric across its diagonal: the same connection is recorded from each end.

### D: copy the node's own value, once per link

Node 3 has three neighbours, so its own value appears three times in the comparison. We need that multiplier at every node. Put each node's degree on the diagonal of a new matrix, called <span class="math">D</span>, and zeros everywhere else. A diagonal entry multiplies the matching node's value, and the zeros keep every other node out. At node 3:

<div class="equation" role="math" aria-label="At node 3, D x equals three times x three, which equals three.">(Dx)₃ = 3x₃ = 3</div>

{% include visual-primer/spectral/figure-08.html %}

A node's degree is the number of 1s in its row of A. Every row here has three, so D is <span class="math">3I</span>: three times the identity matrix I, the matrix that returns its input unchanged.

### L = D − A: the difference

D supplies the copies of the node's own value. A supplies the neighbours' sum. Subtracting one output from the other gives exactly the comparison we started with. At node 3 it is 3 − 1 = 2. Call the matrix that does this subtraction <span class="math">L = D − A</span>. It is the graph's *Laplacian*.<sup class="fnref"><a href="#fn-2" id="fnref-2" data-fn="2" aria-expanded="false" aria-label="Footnote 2">[2]</a></sup>

{% include visual-primer/spectral/figure-09.html %}

The diagonal of L holds the degrees. A neighbour's column gets a −1 from subtracting A. Every other entry stays zero. In compact notation, the output at node i is:

<div class="equation" role="math" aria-label="Entry i of L x is the sum over the neighbours j of i of x i minus x j.">(Lx)ᵢ = ∑<sub>j neighbouring i</sub> (xᵢ − xⱼ)</div>

The result at a node is its degree times the difference between its own value and its neighbours’ average. A positive result means it is above that average; a negative result means it is below.

A zero result can also occur when positive and negative gaps cancel. For example, a node holding 5 between neighbours holding 3 and 7 gets (5 − 3) + (5 − 7) = 0. The neighbours do not both have to match the node.

{% include visual-primer/spectral/figure-10.html %}

Adding all the entries of Lx gives zero: each edge’s difference appears positively at one end and negatively at the other. So that sum cannot measure the graph’s total disagreement. Chapter 4 will use squared differences to build a useful total.

<a id="boundary" class="chapter-anchor"></a>

## 3. What does “connected” leave out?

<p class="chapter-tag">a path exists; so what</p>

Our graph is *connected*: you can walk from any node to any other along edges. But the two links between the halves show how little that promises. A path exists; the path is just very easy to cut.

To compare proposed divisions we need two numbers: how many edges leave a group, and how big the group is. Call the chosen group of nodes <span class="math">S</span>. Its *boundary*, written <span class="math">∂S</span>, is the set of edges with one end inside S and one end outside. Separating S from the rest is a *cut*. Vertical bars, as in <span class="math">|S|</span> or <span class="math">|∂S|</span>, mean “how many”.

A bare boundary count doesn't tell the story. Two outward edges mean one thing for a group of two routers and another for a group of two hundred. So we divide the crossing count by the number of nodes on the *smaller* side:

<div class="equation" role="math" aria-label="Cut score equals crossing edges divided by nodes on the smaller side."><span class="frac"><span>crossing edges</span><span>nodes on the smaller side</span></span></div>

Why the smaller side? Cutting one node away from our graph severs three edges: three doors for one stranded router, which is generous. Dividing by the seven nodes on the other side would make the same cut look dangerously weak. The smaller-side rule also gives the same answer whichever side you name first.

{% include visual-primer/spectral/figure-11.html %}

Our four-against-four cut scores <span class="math">2/4 = 0.5</span>. Is there a group with an even lower score? The lowest score anywhere in the graph is called its *edge expansion*. We write G for the graph and <span class="math">h(G)</span> for its edge expansion. A small h(G) means some group has few ways out for its size.

Scoring one proposed group was easy. Finding the lowest score over *every* group is the hard part. Checking all nonempty groups of up to half the nodes gives 162 candidate groups for eight nodes, representing 127 distinct cuts. For forty nodes, the number of candidate groups exceeds 600 billion.<sup class="fnref"><a href="#fn-3" id="fnref-3" data-fn="3" aria-expanded="false" aria-label="Footnote 3">[3]</a></sup>

{% include visual-primer/spectral/figure-12.html %}

The matrices give us a different way in. Our +1 and −1 paint already marks a proposed group. The next step is to combine the link-by-link comparisons into one measurement of its boundary.

<a id="energy" class="chapter-anchor"></a>

## 4. Use node values to test a division

<p class="chapter-tag">one number for all the edge disagreements</p>

Start with the painting from Chapter 1: +1 at nodes 1–4 and −1 at nodes 5–8. We want one number that adds up the disagreement across all the edges. Each edge should contribute according to how different its two endpoint values are.

### Let each edge contribute one amount

For one edge, subtract the value at one end from the value at the other, then square the difference.

- **Equal values:** the difference is zero, so the contribution is zero.
- **Values +1 and −1:** the difference is 2 or −2, depending on the reading direction. Either way, its square is 4.

Add these contributions over all the edges, counting each edge once. We call the total the pattern’s **energy**. Here, energy measures disagreement between node values.<sup class="fnref"><a href="#fn-4" id="fnref-4" data-fn="4" aria-expanded="false" aria-label="Footnote 4">[4]</a></sup>

<div class="equation" role="math" aria-label="Energy equals the sum of squared differences across edges, counting each edge once.">energy = sum of squared differences across edges</div>

### Apply it to our graph

In the two-group painting, ten edges join equal values and contribute zero. Only edges 3–5 and 4–6 join opposite signs. Each contributes 4, so the energy is **8**.

Now place the same four +1 values and four −1 values in an alternating arrangement. Six edges join opposite signs, giving energy **24**.

{% include visual-primer/spectral/figure-13.html %}

The wiring and the collection of values are the same in both cases. Their placement changed. The lower energy tells us that the grouped arrangement creates less disagreement across the existing links.

### Why square the differences?

Squaring makes each edge’s contribution nonnegative. A difference of −2 contributes just as much as a difference of +2. Disagreements cannot disappear merely because we read some edges in opposite directions.

It also makes large gaps especially costly. A gap of 3 contributes 9, while three gaps of 1 contribute only 3 in total. That will matter when we allow values between +1 and −1: spreading a large jump over several smaller changes can reduce the energy.

### The Laplacian computes this same total

Chapter 2 gave us Lx: one signed comparison at each node. For our two-group painting, the interior nodes get zero, the two positive boundary nodes get +2, and the two negative boundary nodes get −2.

Multiply each node’s value by its own Lx result, then add:

<div class="table-wrap" markdown="1">

| Nodes | Value | Lx result | Product at each node |
| --- | --- | --- | --- |
| 1, 2, 7, 8 | +1 or −1 | 0 | 0 |
| 3, 4 | +1 | +2 | 2 |
| 5, 6 | −1 | −2 | 2 |

</div>

There are four nonzero products, each equal to 2. Their total is 8—the same energy we found by counting the edges.

Multiplying matching entries and adding is a **dot product**. The notation xᵀLx means exactly that calculation. In general:

<div class="equation" role="math" aria-label="E of x equals x transpose L x, which equals the sum over edges of x i minus x j squared.">E(x) = xᵀLx = ∑<sub>edges {i, j}</sub> (xᵢ − xⱼ)²</div>

We now have two ways to compute one quantity: add the squared edge gaps, or use the Laplacian and a dot product. The answer is always nonnegative.<sup class="fnref"><a href="#fn-5" id="fnref-5" data-fn="5" aria-expanded="false" aria-label="Footnote 5">[5]</a></sup>

### Next, let the values change

The energy calculation works for any real node values. We can use 0.3 or −0.6 as well as +1 and −1. That opens the possibility of improving a pattern gradually.

But smaller values also produce smaller squared gaps. Before searching for a better arrangement, we need to stop a pattern from winning merely by shrinking. Chapter 5 makes that comparison fair.

<details markdown="1">
<summary>Optional: three pictures explaining the squared differences</summary>

{% include visual-primer/spectral/figure-14.html %}

</details>

<details markdown="1">
<summary>Optional: why the dot product counts each edge correctly</summary>

Follow one edge joining nodes i and j. At node i, its contribution to xᵀLx is xᵢ(xᵢ − xⱼ). At node j, its contribution is xⱼ(xⱼ − xᵢ). Together:

<div class="equation" role="math" aria-label="x i times x i minus x j, plus x j times x j minus x i, equals x i minus x j squared.">xᵢ(xᵢ − xⱼ) + xⱼ(xⱼ − xᵢ) = (xᵢ − xⱼ)²</div>

So the two endpoint contributions combine into exactly one squared edge gap. This works for every edge and for any values at its ends.

{% include visual-primer/spectral/figure-15.html %}

There is a different calculation that is easy to confuse with energy: squaring the entries of Lx itself and adding them. That gives ‖Lx‖². For this example it is 16. Energy instead multiplies each Lx entry by the original node value, giving xᵀLx = 8.

</details>

<a id="fair" class="chapter-anchor"></a>

## 5. Make the comparison fair

<p class="chapter-tag">a better arrangement, or just smaller numbers?</p>

Chapter 4 gave us a way to measure disagreement: take the difference across each edge, square it, and add the results. We want to arrange the values so that this energy is small. Before we start searching, we need to make the comparison fair.

### Why not give every node the same value?

If every node holds zero, every edge joins equal values. The energy is zero—the lowest it can possibly be.

But this would work on *any* graph. It tells us nothing about the wiring. To learn something, the values must vary across the graph while staying as similar as possible across its edges.

That is the task we actually care about: **keep some overall spread in the values, and arrange that spread to create as little edge disagreement as possible.**

### Why saying “the values must differ” is not enough

Start with four values of +1 on the left and four values of −1 on the right. Only the two crossing edges disagree. Each has a gap of 2, whose square is 4, so the total energy is 8.

Now halve every value. The two groups still have different values, but each crossing gap is only 1. The energy drops to 2.

We could keep halving the values and make the energy as close to zero as we like. The arrangement would remain the same. The numbers would simply get smaller.

So allowing any nonconstant pattern does not solve the problem. **We need every candidate to have the same amount of overall spread.**

### Spread and energy measure different things

**Spread** asks how far the node values lie from their average. This guide calls that quantity **variation**: subtract the average from each value, square each result, and add them.

**Energy** asks how different the values are at the ends of the edges that actually exist.

The distinction matters. Rearrange the same four +1 values and four −1 values among the nodes. Their overall spread stays the same. But the energy can change, because different edges now join different values.

{% include visual-primer/spectral/figure-16.html %}

Both patterns above have variation 8. The grouped pattern has energy 8; the alternating pattern has energy 24. This is a meaningful comparison: the same amount of spread creates less disagreement in the grouped arrangement.

### First, remove the level shared by all the nodes

Suppose we add 10 to every value. The two levels +1 and −1 become 11 and 9. Their difference is still 2. Every edge sees exactly the same gap as before, so the energy is unchanged.

We do not need to treat these as separate candidates. Subtract the average from every value. In this example the average is 10, so we get +1 and −1 again. In general, the result always has **mean zero**, while every difference between nodes stays the same.<sup class="fnref"><a href="#fn-6" id="fnref-6" data-fn="6" aria-expanded="false" aria-label="Footnote 6">[6]</a></sup>

Mean zero means that the positive and negative values add up to zero. It does not require equal numbers of positive and negative nodes.

### Then, give every candidate the same total spread

Once the average is zero, variation is especially easy to compute: square each node value and add the squares.

For four +1 values and four −1 values, there are eight squares equal to 1. The variation is therefore 8. To bring it to 1, divide every value by √8. Each value becomes approximately +0.354 or −0.354.

Dividing the values by √8 divides every squared gap by 8 too. The grouped pattern’s energy goes from 8 to **1**. The alternating pattern’s energy goes from 24 to **3**. Their relative quality has not changed; they are now on our agreed scale.

We choose total spread **1** for convenience.<sup class="fnref"><a href="#fn-7" id="fnref-7" data-fn="7" aria-expanded="false" aria-label="Footnote 7">[7]</a></sup> Any fixed positive amount would work. It is the *sum of the squares* that must equal 1. The individual values can still differ and change.

### The search now has two simple rules

<div class="equation" role="math" aria-label="The node values have mean zero, and their squares add up to one.">mean of the node values = 0<br>sum of their squared values = 1</div>

The rules work together. An all-equal pattern becomes all zeros when we subtract its mean. Its total spread is then zero, so it cannot satisfy the second rule. A nonconstant pattern can be centered and rescaled to satisfy both.

**Among patterns obeying these rules, which has the least energy?** Every candidate has the same overall spread. We can now concentrate on how that spread is arranged across the graph.

Our starting candidate is the hard split: four values of about +0.354 and four of about −0.354, with energy 1. Chapter 6 will change those values and see whether a smoother arrangement can do better.

<details markdown="1">
<summary>Optional: see shifting and shrinking side by side</summary>

{% include visual-primer/spectral/figure-17.html %}

</details>

<details markdown="1">
<summary>Optional: the formulas and a shortcut</summary>

Let x̄ be the average of the node values. The total squared spread is:

<div class="equation" role="math" aria-label="Variation equals the sum over nodes of the squared difference between the node value and the mean.">variation = ∑ᵢ (xᵢ − x̄)²</div>

Subtracting the mean leaves all edge differences unchanged. If the resulting variation is V > 0, dividing every value by √V makes the variation 1. The energy is divided by V too.

So we can score a nonconstant pattern without carrying out the rescaling: divide its original energy by its variation. This gives the energy it would have after centering and rescaling. For a pattern that already has mean zero, this ratio is called the *Rayleigh quotient*:

<div class="equation" role="math" aria-label="For a nonzero mean-zero pattern, R of x equals x transpose L x divided by x transpose x.">R(x) = <span class="frac"><span>xᵀLx</span><span>xᵀx</span></span><small>for a nonzero pattern whose mean is zero</small></div>

The hard split scores 8/8 = 1. Halving all its values gives 2/2 = 1. Adding 10 to all its values leaves both energy and variation unchanged, giving 8/8 = 1 again.

{% include visual-primer/spectral/figure-18.html %}

</details>

<details markdown="1">
<summary>Optional: can an allowed pattern ever have zero energy?</summary>

On our connected graph, zero energy requires every pair of neighbours to agree. That agreement travels through the whole graph, forcing a flat pattern. Our two rules exclude it.

If the graph has disconnected pieces, each piece can hold its own constant value. The pieces can have different levels without any edge disagreement. We can then have mean zero, positive spread, and zero energy. This will help explain the meaning of a zero second eigenvalue in Chapter 7.

</details>

<a id="adjust" class="chapter-anchor"></a>

## 6. Improve the first pattern

<p class="chapter-tag">can a gentler boundary lower the total?</p>

Our first pattern has energy 1. To lower it, we will try bringing the values closer together at the boundary between the two groups. We will keep the mean at zero and the total squared spread at 1, so the comparison stays fair. The wiring stays fixed; we change only the numbers assigned to the nodes.

### Start by finding where the disagreement is

In the hard split, nodes 1–4 all have value about +0.354, and nodes 5–8 all have value about −0.354. The mean is zero and the total squared spread is 1, as Chapter 5 requires.

All ten edges within the groups join equal values, so they contribute no energy. The two edges between the groups carry all the disagreement. Each contributes 0.5, giving total energy **1**.

That suggests where to start: can we reduce the two large gaps at the boundary?

### Bring the boundary values closer to zero

The crossing edges join nodes 3 to 5 and nodes 4 to 6. Call these four nodes the **boundary nodes**. The other four—1, 2, 7 and 8—are the **interior nodes**.

Move the positive boundary values down toward zero and the negative boundary values up toward zero. The ends of each crossing edge become closer in value, so those edges contribute less energy.

But now the boundary nodes differ from the interior nodes in their own group. Eight internal edges that previously contributed zero begin to contribute energy.

This is the trade-off: **we reduce disagreement between the groups by creating some disagreement inside them.** Because energy squares the gaps, reducing a large gap can outweigh the cost of introducing several smaller ones. We have to add the contributions to find out.

### Keep the comparison fair while the values change

Moving only the boundary values toward zero would also reduce the overall spread. Chapter 5 tells us not to count that shrinking as an improvement.

So each trial has two steps: choose how small the boundary values should be relative to the interior values, then rescale *all eight values* so their squares still add up to 1. The positive and negative halves remain matched, so the mean stays zero.

The slider uses one number, **t**, for that relative size:

- **t = 1:** boundary and interior values have equal size. This is the hard split.
- **t = ½:** each boundary value is half its group’s interior value.
- **t = 0:** every boundary value is zero.

Rescaling changes every value by the same factor, so it preserves this ratio. It also explains why the interior values move as you use the slider: they must adjust too, to keep the total spread fixed.

### Try the experiment

Start at the hard split. Try t = ½, then “Best in this family,” then t = 0. Watch the **total energy**. The orange edges show disagreement between the groups; the teal edges show disagreement inside them. Every displayed pattern has already been centered and rescaled.

{% include visual-primer/spectral/figure-19.html %}

### Why moving partway helps

At **t = ½**, the energy on the crossing edges falls from 1 to 0.4. We have saved 0.6. The new disagreement inside the groups costs 0.4, so the total is **0.8**.

The saving is larger than the new cost. And because the overall spread is still 1, this is a real improvement in the arrangement.

The best setting in this experiment is **t ≈ 0.618**: boundary values about 62% as large as interior values. Its total energy is approximately **0.764**. That number comes from finding the lowest total as the ratio changes.

### Why moving all the way to zero is worse

At **t = 0**, the two crossing edges join zeros, so their energy is zero. But the total energy has risen to **2**.

Where does the energy come from? To keep the spread at 1, the four interior values are now +0.5, +0.5, −0.5 and −0.5. Eight edges join one of these values to a boundary value of zero. Each has a squared gap of 0.25, and eight contributions of 0.25 add up to 2.

Eliminating all disagreement between the groups creates too much disagreement inside them. Every edge contributes to the same total.

<div class="table-wrap" markdown="1">

| Boundary ratio t | Inside | Between | Total |
| --- | --- | --- | --- |
| 1: hard split | 0 | 1 | 1 |
| ½ | 0.4 | 0.4 | 0.8 |
| ≈ 0.618: best here | ≈ 0.211 | ≈ 0.553 | **≈ 0.764** |
| 0: boundary at zero | 2 | 0 | 2 |

</div>

### What have we established so far?

Allowing different values within each group improved on the hard split. The best pattern in this experiment has energy about 0.764, compared with our starting energy of 1.

But the slider explored only one family. It kept certain pairs of nodes equal and made the two halves mirror each other. Other patterns could give all eight nodes different values.

**Could a pattern outside this family have energy below 0.764?** The experiment alone cannot answer that. Chapter 7 will show why no allowed pattern can do better.

<details markdown="1">
<summary>Optional: see the rescaling at t = ½</summary>

Before rescaling, use the values (1, 1, ½, ½, −½, −½, −1, −1). Their mean is zero, but their squared values add up to 5. Divide every value by √5. The interior values become about ±0.447, and the boundary values become about ±0.224. The ratio is still ½, and the total squared spread is now 1.

{% include visual-primer/spectral/figure-20.html %}

</details>

<details markdown="1">
<summary>Optional: compare the four settings visually</summary>

{% include visual-primer/spectral/figure-21.html %}

</details>

<details markdown="1">
<summary>Optional: the formula behind the experiment</summary>

Before rescaling, write the pattern as (1, 1, t, t, −t, −t, −1, −1). Its total squared spread is 4 + 4t².

Eight internal edges have gap 1 − t, so their combined energy is 8(1 − t)². Two crossing edges have gap 2t, giving combined energy 8t². The other two edges, 1–2 and 7–8, join equal values and contribute zero.

Divide the energy by the spread to get the energy after rescaling:

<div class="equation" role="math" aria-label="E of t equals eight times the square of one minus t plus eight times t squared, all divided by four plus four times t squared.">E(t) = <span class="frac"><span>8(1 − t)² + 8t²</span><span>4 + 4t²</span></span></div>

The numerator adds the two sources of disagreement. The denominator keeps the comparison at total spread 1. The minimum over the slider’s settings occurs at t = (√5 − 1)/2 ≈ 0.618, with energy 3 − √5 ≈ 0.764.

</details>

<a id="second" class="chapter-anchor"></a>

## 7. Can any pattern do better?

<p class="chapter-tag">why the second eigenvector wins</p>

The slider found a pattern with energy about 0.764 by trying one particular way of arranging the eight node values. It kept pairs of nodes equal and kept the two halves as mirror images. We could also try patterns that break those rules. Perhaps giving every node its own value would lower the energy further.

This chapter explains why it cannot. We will stay with the same eight-node graph and build up to one idea: **every allowed pattern has an energy that is a weighted average of certain basic energies. The smallest available one is about 0.764.**

### First, remember what we are comparing

A **pattern** is one number at each node. Its **energy** measures the disagreement across the edges: for each edge, take the difference between its two endpoint values, square it, and add all those squares.<sup class="fnref"><a href="#fn-8" id="fnref-8" data-fn="8" aria-expanded="false" aria-label="Footnote 8">[8]</a></sup>

We want small differences across edges, while keeping some spread across the whole graph. Chapter 5 made the comparison fair with two rules:

- **The values average to zero.** This removes the level shared by all the nodes.
- **The squared values add up to 1.** This fixes the total spread, so a pattern cannot win just by shrinking.

Every candidate we compare obeys both rules. The hard split has energy 1. The smoother pattern found by the slider has energy about 0.764. We want to know the lowest energy among *all* candidates.

### Eight building blocks can describe every pattern

There are infinitely many ways to choose eight node values. How could we reason about all of them at once?

The useful fact is that the Laplacian L gives us a set of eight special **building-block patterns**. Every possible assignment of values can be made by adding suitable amounts of these eight patterns together. Each building block is itself a whole list of eight node values.

These special patterns are called **eigenvectors**. Apply L to one, and its shape stays the same: every entry is multiplied by the same number. That multiplier is its **eigenvalue**.<sup class="fnref"><a href="#fn-9" id="fnref-9" data-fn="9" aria-expanded="false" aria-label="Footnote 9">[9]</a></sup>

Why can we use them as a complete set of building blocks? Our edges are undirected, so L is symmetric. A result from linear algebra guarantees that we can choose eight eigenvectors that are perpendicular to one another and together describe every pattern.<sup class="fnref"><a href="#fn-10" id="fnref-10" data-fn="10" aria-expanded="false" aria-label="Footnote 10">[10]</a></sup> The optional algebra below explains why that perpendicularity matters.

We scale each building block so that its squared entries add up to 1. At that size, **its eigenvalue is also its energy**. We can therefore put the building blocks in order, from the lowest energy to the highest:

<div class="table-wrap" markdown="1">

| Building block | Energy at this fixed size |
| --- | --- |
| First, u₁: every node has the same value | 0 |
| **Second, u₂** | **about 0.764** |
| Third, u₃ | 2 |
| Fourth through seventh, u₄ to u₇ | 4 each |
| Eighth, u₈ | about 5.236 |

</div>

These energies are calculated from this graph’s wiring. We have not chosen them to make the example work. Four different building blocks can have the same energy, as happens here with 4.<sup class="fnref"><a href="#fn-11" id="fnref-11" data-fn="11" aria-expanded="false" aria-label="Footnote 11">[11]</a></sup>

### Why the zero-energy pattern is set aside

The first building block is flat: every node holds the same value. Every edge then joins equal values, so its energy is zero.

But our candidates must average to zero. Subtract the mean from a flat pattern and all its values become zero. That leaves no spread, so it cannot satisfy the second rule.

The mean-zero rule also removes the flat part of *every mixture*. Imagine adding 10 to all eight values of a pattern. You have added a shared level; subtracting the mean removes it again. The differences between nodes stay the same.

So every allowed candidate is built entirely from **u₂ through u₈**. The cheapest building block still available is u₂, with energy about 0.764.

### Could mixing the others produce something cheaper?

This is the crucial question. Knowing the cheapest building block is not enough by itself. We still need to know what happens when building blocks are combined.

For these eigenvectors, the answer is particularly useful: **the energy of an allowed mixture is a weighted average of their energies.**

The weights describe how much of the total squared spread each building block contributes. They are never negative, and they add up to 1. A 20% share means 20% of the spread; it does not mean 20% of the nodes.

For example, suppose 80% of the spread comes from u₂ and 20% comes from u₃. The energy is approximately:

<div class="equation" role="math" aria-label="Energy is approximately 0.8 times 0.764 plus 0.2 times 2, which is 1.011.">E ≈ 0.8 × 0.764 + 0.2 × 2 ≈ 1.011<small>80% at the lower energy, 20% at the higher energy</small></div>

The energy has gone up. Some of the spread now contributes at the higher rate of 2. Mixing in a building block with energy 4 or 5.236 would also raise it.

**An average cannot be smaller than the smallest number being averaged.** Here that smallest energy is about 0.764. This reasoning covers every allowed pattern, because every one is a mixture of these building blocks.

There are two parts to the conclusion. No allowed pattern can go lower than the energy of u₂. And u₂ itself is allowed and reaches that energy. Together, these facts establish the minimum.

### The pattern and the number have different jobs

We label the eigenvalues in increasing order: λ₁, λ₂, and so on. The flat pattern has λ₁ = 0. The next value, λ₂, is the minimum energy we have been looking for:

<div class="equation" role="math" aria-label="Lambda two equals three minus the square root of five, approximately 0.764.">λ₂ = 3 − √5 ≈ 0.764<small>the lowest energy of any mean-zero pattern with total squared spread 1</small></div>

What does u₂ look like? It is the slider’s winning pattern from Chapter 6, at t ≈ 0.618.<sup class="fnref"><a href="#fn-12" id="fnref-12" data-fn="12" aria-expanded="false" aria-label="Footnote 12">[12]</a></sup> Its values, rounded to three decimal places, are:

<div class="table-wrap" markdown="1">

| Nodes | Value at each node |
| --- | --- |
| 1 and 2: left interior | +0.425 |
| 3 and 4: left boundary | +0.263 |
| 5 and 6: right boundary | −0.263 |
| 7 and 8: right interior | −0.425 |

</div>

The boundary values sit closer to zero than the interior values. That is the compromise we saw in Chapter 6: it reduces disagreement between the groups while allowing some disagreement inside them.

**u₂ is the pattern: one value per node. λ₂ is the number: the energy that pattern achieves.** The subscript 2 means second in the ordered list of eigenvectors or eigenvalues. It does not mean node 2.

An eigenvector for λ₂ is called a **Fiedler vector**, and λ₂ is called the graph’s **algebraic connectivity**.<sup class="fnref"><a href="#fn-13" id="fnref-13" data-fn="13" aria-expanded="false" aria-label="Footnote 13">[13]</a></sup> Reversing every sign gives an equally good pattern, since squared differences do not change.

The slider found the best pattern because this particular family included u₂. A different restricted family might miss it. The eigenvector argument is what lets us rule out a better answer anywhere else.

<details markdown="1">
<summary>Optional: why the weighted-average rule works</summary>

Write an allowed pattern as a mixture of the seven available building blocks:

<div class="equation" role="math" aria-label="x equals c two u two plus all the remaining terms through c eight u eight.">x = c₂u₂ + ⋯ + c₈u₈</div>

The amounts c₂ through c₈ can be positive or negative. Each amount multiplies a whole pattern. Because our building blocks are perpendicular and each has squared length 1, the mixture’s squared length is c₂² + ⋯ + c₈². Our fixed-spread rule therefore says:

<div class="equation" role="math" aria-label="c two squared plus all the remaining squared amounts through c eight squared equals one.">c₂² + ⋯ + c₈² = 1</div>

Chapter 4 wrote energy as x · Lx. L multiplies each eigenvector uᵢ by its own eigenvalue λᵢ. When we expand the dot product, terms involving two different eigenvectors vanish because those vectors are perpendicular. What remains is:

<div class="equation" role="math" aria-label="Energy equals lambda two times c two squared plus all the remaining terms through lambda eight times c eight squared.">E(x) = λ₂c₂² + ⋯ + λ₈c₈²</div>

The weights are the squared amounts. They are nonnegative and add up to 1, so this is a weighted average. Every λᵢ here is at least λ₂, which gives E(x) ≥ λ₂. Choosing x = u₂ gives equality. For a single unit eigenvector, the same calculation reads u · Lu = u · (λu) = λ.

{% include visual-primer/spectral/figure-22.html %}

</details>

<details markdown="1">
<summary>Optional: what if the graph has more nodes, or is disconnected?</summary>

The same reasoning works for an undirected graph of any size. With 100,000 nodes, there are 100,000 building blocks. Removing the shared level leaves 99,999. The weighted-average argument still gives the minimum immediately once the eigenvalues are ordered; it does not require trying every possible pattern.

On a connected graph, zero energy forces every pair of neighbours to agree. That agreement travels through the graph until all nodes have the same value. So the flat direction is the only zero-energy direction, and λ₂ is positive.

If the graph has two disconnected pieces, each piece can hold its own constant value. One can sit above zero and the other below, chosen so the overall mean is zero. No edge connects the pieces, so no edge sees a difference. After rescaling, this is an allowed pattern with energy zero. A second zero eigenvalue appears, and λ₂ becomes zero.<sup class="fnref"><a href="#fn-14" id="fnref-14" data-fn="14" aria-expanded="false" aria-label="Footnote 14">[14]</a></sup>

{% include visual-primer/spectral/figure-23.html %}

</details>

We now have the node values that minimize energy. Chapter 8 asks how to use those values to propose a division into two groups. Finding the best real-valued pattern and finding the best cut are separate steps.

<a id="cut" class="chapter-anchor"></a>

## 8. Turn the answer back into a cut

<p class="chapter-tag">use the values to propose two groups</p>

The minimum-energy pattern is a list of numbers. To make a cut, we still have to decide which nodes belong on each side. We will use the numbers to propose cuts, then count the original graph’s crossing edges to judge them.

### Put the nodes in order by their values

The Fiedler pattern tends to keep connected nodes close in value. That makes its ordering a useful place to look for a division.

Sort the nodes from the most negative value to the most positive:

<div class="table-wrap" markdown="1">

| Nodes, in increasing value order | Value at each node |
| --- | --- |
| 7 and 8 | −0.425 |
| 5 and 6 | −0.263 |
| 3 and 4 | +0.263 |
| 1 and 2 | +0.425 |

</div>

The values are rounded here. In this graph, the two nodes in each pair have exactly equal values.

Now place a **threshold** between two different values. Nodes below it form one group; nodes above it form the other. Moving the threshold changes the proposed groups. The wiring and the node values stay fixed.

### Try one threshold completely

Put the threshold after the first pair. The chosen group is **{7, 8}**, and the other group contains nodes 1–6.

Look back at the original graph. Four edges leave {7, 8}: 5–7, 5–8, 6–7 and 6–8. The smaller group has two nodes, so the cut score is:

<div class="equation" role="math" aria-label="The first cut has four crossing edges divided by two nodes on the smaller side, giving score two.">cut score = <span class="frac"><span>4 crossing edges</span><span>2 nodes on the smaller side</span></span> = 2</div>

That is one complete candidate: the threshold proposes the groups, and the original edges determine the score.

### Move it once and see what changes

Move the threshold after the next pair. Nodes 5 and 6 join the chosen group, which is now **{5, 6, 7, 8}**.

The four edges we just counted no longer cross the cut. Both ends of each now lie inside the chosen group. Only edges 3–5 and 4–6 leave it.

We now have two crossing edges and four nodes on each side. The score is **2/4 = 0.5**, an improvement over 2.

{% include visual-primer/spectral/figure-24.html %}

Adding nodes to a group can reduce its number of crossing edges. The score depends on the actual wiring, not just on how many nodes the threshold has passed.

### Check the remaining gap

Move the threshold after the third pair. The chosen group becomes **{3, 4, 5, 6, 7, 8}**, leaving {1, 2} on the other side.

Four edges cross this division. Although the chosen group has six nodes, the *smaller* group has two. The score is therefore **4/2 = 2**.

<div class="table-wrap" markdown="1">

| Chosen group | Crossing edges | Smaller group | Score |
| --- | --- | --- | --- |
| {7, 8} | 4 | 2 | 2 |
| **{5, 6, 7, 8}** | **2** | **4** | **0.5** |
| {3, 4, 5, 6, 7, 8} | 4 | 2 | 2 |

</div>

Try the three positions below. Follow which nodes change sides and which original edges become crossing edges.

{% include visual-primer/spectral/figure-25.html %}

### Why are there only three candidates?

There are four distinct values, leaving three gaps between them. Moving a threshold within one gap does not change any membership, so it proposes the same cut.

A threshold also cannot separate two nodes with exactly equal values. They stay together. Moving beyond all the values would put every node on one side, which is not a valid cut.

Trying the gaps in order and comparing their scores is called a **sweep**. With n nodes, there are at most n − 1 such cuts. Our four distinct values give three, compared with 127 distinct cuts of the eight-node graph.<sup class="fnref"><a href="#fn-15" id="fnref-15" data-fn="15" aria-expanded="false" aria-label="Footnote 15">[15]</a></sup>

### What did the sweep establish?

The second threshold gives the best cut **among these three candidates**, with score 0.5.

Chapter 7 proved a global minimum for *pattern energy*: λ₂ ≈ 0.764. The sweep has solved a different task, choosing a *cut* from the candidates supplied by one ordering. It has not compared all 127 divisions.

We therefore have a good candidate and a new question: **could a cut outside this list score much lower?** Chapter 9 uses λ₂ to limit how much better an unseen cut could be.

<details markdown="1">
<summary>Optional: see all three candidate cuts side by side</summary>

{% include visual-primer/spectral/figure-26.html %}

</details>

<details markdown="1">
<summary>Optional: why not simply split at zero?</summary>

The winning threshold happens to sit between the negative and positive values in our symmetric example. On a different graph, the best sweep cut may come from another gap. That is why we compare the gaps instead of automatically choosing zero.

Reversing every sign reverses the ordering and swaps the sides of the sweep cuts. Their scores do not change. Multiplying all values by a positive number stretches the value axis while leaving the ordering and the candidate groups unchanged.

Mean zero does not require equal numbers of positive and negative entries. A few large positive values can balance many small negative ones. The balanced winning cut here comes from this graph’s symmetry.

</details>

<details markdown="1">
<summary>Optional: does a sweep need to recount every edge for every cut?</summary>

No. When a node moves into the chosen group, only its incident edges can change crossing status. An edge to a node already inside stops crossing; an edge to a node still outside starts crossing. The sweep can update its crossing count as it moves.

Nodes with equal values move as a group, and we score the cut after the whole group has moved. This avoids treating a tie as an extra threshold. The sweep examines a restricted set of candidates; it does not enumerate all possible divisions.

</details>

<a id="cheeger" class="chapter-anchor"></a>

## 9. What the eigenvalue says about unseen cuts

<p class="chapter-tag">could another cut be much better?</p>

Chapter 8 found a cut scoring 0.5. To know how good it is, we need a limit on how much lower any other cut could score. Chapter 7’s minimum energy gives us such a limit.

### What does the score 0.5 mean?

A cut divides the nodes into two nonempty groups. Its score is the number of edges crossing between the groups, divided by the number of nodes in the smaller group:

<div class="equation" role="math" aria-label="Cut score equals crossing edges divided by nodes in the smaller group.">cut score = <span class="frac"><span>crossing edges</span><span>nodes in the smaller group</span></span></div>

A low score reveals a bottleneck: relatively few links connect the smaller group to the rest of the network.

Our cut puts four nodes on each side, with two edges connecting the sides. Its score is 2/4 = **0.5**. Call the lowest score among *all* cuts **h(G)**. We have found a candidate for that minimum; we have not yet established the exact minimum.

Keep the two measurements in view. Chapter 7 found the lowest **pattern energy**, λ₂ ≈ 0.764. Chapter 8 found a **cut score** of 0.5. Pattern energy adds squared differences across edges. A cut score counts crossing edges and accounts for group size. This chapter connects those measurements.

### A cut can be turned into a pattern

Imagine someone hands us a proposed cut. Give every node on one side the same value, and every node on the other side a different value.

Every edge within a group now joins equal values, so it contributes zero energy. **Only edges crossing between the groups contribute energy.** This is the useful connection: a cut with few crossing edges can give us a low-energy pattern.

We must still follow Chapter 7’s rules. Subtract the mean, then rescale the values so their squares add up to 1. The result is an allowed pattern, so its energy cannot be below λ₂.

We have already done this for the division into two halves. Its rescaled pattern is Chapter 6’s hard split, with energy 1. The cut score is 0.5, and the pattern energy is twice that score.

The same construction works for unequal groups too. The arithmetic gives this useful rule:

<div class="equation" role="math" aria-label="The energy of the allowed pattern made from a cut is at most twice that cut's score.">energy of the pattern made from a cut<br>≤ 2 × that cut’s score</div>

For equal-sized groups it is exactly twice the score. For unequal groups it is less. The optional calculation below shows why.

### Try an impossibly good cut

Suppose someone claims to have found a cut scoring **0.1**. Our construction would turn it into an allowed pattern with energy at most **0.2**.

But Chapter 7 proved that every allowed pattern has energy at least about **0.764**. The proposed cut would produce a pattern below that proven minimum. Therefore, that cut cannot exist.

The same argument applies to every cut. Since the pattern’s energy is at least λ₂ and at most twice the cut score, we get:

<div class="equation" role="math" aria-label="Every cut score is at least lambda two divided by two.">every cut score ≥ <span class="frac"><span>λ₂</span><span>2</span></span><small>for our graph, this lower limit is approximately 0.382</small></div>

This is the **lower bound**. It applies even to cuts we never examine. A sufficiently low-scoring cut would contradict the minimum energy we already know.

### Does low energy also guarantee a low-scoring cut?

So far, we have gone from a cut to a pattern. The other direction asks: if λ₂ is small, must a low-scoring cut exist?

The answer is yes, although proving it takes more work. A low-energy pattern tends to assign similar values to connected nodes. Those values might change gradually across the graph, so we cannot simply assume that they form two obvious groups.

Instead, sort the nodes by value and move a threshold through them, as in Chapter 8. An edge crosses the resulting cut only when the threshold lies between its two endpoint values. Close endpoint values leave only a narrow interval of thresholds that separate them.

That explains why low energy is useful. The theorem also accounts for the sizes of the groups and proves that **at least one threshold gives a cut with a bounded score**. It does not require every threshold to work well.

### Cheeger’s inequality puts both directions together

For our kind of graph—undirected, with every node having the same degree d—the two guarantees can be written as:

<div class="equation" role="math" aria-label="Lambda two divided by two is at most h of G, which is at most the square root of two d lambda two."><span class="frac"><span>λ₂</span><span>2</span></span> ≤ h(G) ≤ √(2dλ₂)<small>h(G) is the lowest cut score; λ₂ comes from L = D − A</small></div>

This is a form of **Cheeger’s inequality**.<sup class="fnref"><a href="#fn-16" id="fnref-16" data-fn="16" aria-expanded="false" aria-label="Footnote 16">[16]</a></sup> Read its two sides separately:

- **The left side limits every cut.** No cut scores below λ₂/2.
- **The right side guarantees that a cut exists.** At least one cut scores no more than √(2dλ₂). Other cuts can score much higher.

Here each node has three links, so d = 3. Using λ₂ ≈ 0.764, the theorem places the best cut score between approximately **0.382 and 2.141**.

### What does that tell us about the cut we found?

We already have a cut scoring 0.5. That gives a much tighter upper bound than 2.141: the best cut cannot score more than a cut we actually hold.

Combining the eigenvalue’s lower bound with our actual cut gives:

<div class="equation" role="math" aria-label="The best cut score is between lambda two divided by two and 0.5."><span class="frac"><span>λ₂</span><span>2</span></span> ≤ h(G) ≤ 0.5<small>the lower limit is about 0.382; the upper limit comes from our cut</small></div>

These bounds tell us how much improvement could remain: no other cut can improve on 0.5 by more than about 0.118. We obtained that guarantee without searching through all the cuts.

To establish the exact best score, we need further evidence. For this small graph, checking all 127 distinct cuts is affordable. That check finds no cut below 0.5, so **h(G) = 0.5 exactly**.

{% include visual-primer/spectral/figure-27.html %}

The three statements come from different evidence. The eigenvalue limits every cut. The sweep supplies one actual cut. The exhaustive check confirms the exact answer in this small example.

<details markdown="1">
<summary>Optional: see how cuts and node values connect</summary>

The left picture starts with our cut into two halves. Its values are shown before centering and rescaling; the mean is already zero. The right picture starts with the Fiedler values and shows how a threshold turns them into a cut.

{% include visual-primer/spectral/figure-28.html %}

</details>

<details markdown="1">
<summary>Optional: why the factor of two appears</summary>

Let the graph have n nodes. Suppose the smaller group contains s nodes, the other group contains n − s nodes, and b edges cross between them. The cut score is b/s.

Start with value 1 on the smaller group and 0 on the other group. The mean is s/n. Subtracting it gives value 1 − s/n on the smaller group and −s/n on the other. The mean is now zero, and every crossing edge still has a gap of 1.

The energy is therefore b. The total squared spread is s(n − s)/n. To find the energy after rescaling that spread to 1, divide energy by spread:

<div class="equation" role="math" aria-label="The rescaled pattern energy equals b over s plus b over n minus s.">rescaled pattern energy = <span class="frac"><span>b</span><span>s</span></span> + <span class="frac"><span>b</span><span>n − s</span></span></div>

The first term is the cut score. Because the other group is at least as large as the smaller group, the second term is no greater than the first. Their sum is therefore at most twice the cut score. For equal-sized groups the two terms are equal, giving exactly twice the score.

For our cut, b = 2 and both groups have 4 nodes. The pattern energy is 2/4 + 2/4 = 1, while the cut score is 2/4 = 0.5. This is why the two numbers differ.

Finally, Chapter 7’s minimum is no larger than this candidate’s energy: λ₂ ≤ rescaled pattern energy ≤ 2 × cut score. Dividing by 2 gives the lower bound for every cut.

</details>

A larger λ₂ raises the lower bound on every cut score. That makes it useful for network design: it can certify that no group has a very sparse connection to the rest. Chapter 10 explores how changing the wiring can improve that guarantee.

<a id="expansion" class="chapter-anchor"></a>

## 10. Rewire the graph to improve expansion

<p class="chapter-tag">stronger boundaries with the same link budget</p>

So far, we have used the graph to detect weak boundaries. Now we can use the same ideas to compare designs. The goal is to strengthen the weakest boundaries while keeping the number of links at each router fixed.

### Keep the hardware budget fixed

Our original graph has eight routers, three links per router, and twelve links in total. Its weakest cut has two crossing links for four nodes, giving h(G) = 0.5.

Connecting every router to every other would provide more ways out, but it would also require more ports and cables. A fair comparison keeps the number of routers and links fixed, and changes which routers are connected.

{% include visual-primer/spectral/figure-29.html %}

Both graphs above have the same link budget. In the rewired graph, the weakest cut has four crossing links for four nodes, so **h(G) rises from 0.5 to 1**. The wiring makes better use of the available links.

### How do we know another group is not hiding a weak boundary?

Improving one visible cut is not enough. We need a guarantee about every group. This is where Chapter 9’s lower bound becomes useful.

The rewired graph has **λ₂ = 2**. Therefore:

<div class="equation" role="math" aria-label="Every cut score is at least lambda two divided by two, which equals one for the rewired graph.">every cut score ≥ λ₂/2 = 1</div>

Take any group containing k nodes, with k no larger than half the graph. Since its crossing-edge count divided by k must be at least 1, **at least k edges leave that group**.

For example, every group of four nodes has at least four outward links. This is a statement about the group’s total boundary, not about how many outward links each individual node has.

A cut scoring exactly 1 exists in this graph, so the lower bound is attained: h(G) = 1. The eigenvalue rules out every worse bottleneck at once.

### Now ask whether the advantage survives as the network grows

A good eight-router example is useful, but real networks grow. Could the boundary of a large group become relatively thinner even though each router keeps the same number of links?

A ring shows how that can happen. Each router has two neighbours, whatever the ring’s size. Choose a consecutive half of an even-sized ring. Only two links leave that half:

<div class="table-wrap" markdown="1">

| Routers in the ring | Nodes in the chosen half | Crossing links | Cut score |
| --- | --- | --- | --- |
| 8 | 4 | 2 | 0.5 |
| 16 | 8 | 2 | 0.25 |
| 32 | 16 | 2 | 0.125 |

</div>

The group gets larger while its outward connections stay at two. Its cut score keeps falling. Having the same number of neighbours at each router does not, by itself, protect against this problem.

### An expander family keeps the boundary guarantee as it grows

An **expander family** is a sequence of increasingly large graphs with a fixed degree and an expansion score that stays above some fixed positive number.<sup class="fnref"><a href="#fn-17" id="fnref-17" data-fn="17" aria-expanded="false" aria-label="Footnote 17">[17]</a></sup>

For example, a guarantee h(G) ≥ 0.5 would mean that every group of k nodes, up to half the network, has at least 0.5k edges leaving it—no matter how large the network becomes. The number 0.5 is just an illustration; what matters is that the guaranteed ratio does not shrink toward zero.

For graphs with the same fixed degree, Cheeger’s inequality lets us express this through λ₂. If λ₂ stays above a fixed positive level as the graphs grow, then its lower bound on every cut stays positive too. The other side of Cheeger’s inequality gives the converse.

### What does this provide for a network?

With equal-capacity links, a lower bound on every group’s number of outward links also gives a lower bound on its total outward link capacity. The guarantee covers all groups, including ones that were not obvious in a drawing.

Routing still has to use those links effectively. Traffic patterns, shared paths, and forwarding choices affect the throughput that is actually achieved. Expansion tells us something about the connections the topology makes available.

Next we will see how the same spectral information appears when a paper uses adjacency eigenvalues instead of Laplacian eigenvalues.

<details markdown="1">
<summary>Optional: see the group-size and ring examples</summary>

{% include visual-primer/spectral/figure-30.html %}

For an even ring with n nodes, a consecutive half contains n/2 nodes and has two crossing links. Its score is 2/(n/2) = 4/n, which tends toward zero as n grows.

</details>

<details markdown="1">
<summary>Optional: why both sides of Cheeger matter for growing graphs</summary>

If λ₂ ≥ a for some fixed a > 0, then h(G) ≥ a/2. Conversely, if h(G) ≥ c for some fixed c > 0, the inequality h(G) ≤ √(2dλ₂) implies λ₂ ≥ c²/(2d). When d is fixed, both statements give a positive bound independent of the number of nodes.

This is what “bounded away from zero” means: there is one positive lower limit that works for the whole family, even as its graphs get larger.

</details>

<a id="gap" class="chapter-anchor"></a>

## 11. Recognize the gap in another matrix

<p class="chapter-tag">follow the same pattern through A and L</p>

We have described the graph using eigenvalues of the Laplacian L. Some papers use eigenvalues of the adjacency matrix A instead. For our regular graph, these two descriptions translate directly into one another. Following the same node patterns through both matrices shows where the different numbers come from.

### Recall what the two matrices do

A adds up the neighbours’ values. L compares a node with its neighbours: it takes degree times the node’s own value and subtracts that neighbours’ sum.

Every node here has degree three, so:

<div class="equation" role="math" aria-label="For every pattern x, L x equals three x minus A x.">Lx = 3x − Ax</div>

This is a relation between two outputs for the same input pattern. Once we know one output, we can find the other.

### Try the flat pattern first

Give every node the same value. Each has three neighbours holding that value, so A returns three copies of the original pattern. Its adjacency eigenvalue is **3**.

L then takes three copies of the pattern and subtracts those same three copies. It returns zero, so its Laplacian eigenvalue is **0**.

One pattern has two different multipliers because A and L perform different operations on it.

### Now try the winning pattern from Chapter 7

For u₂, we already know that L returns approximately 0.764 copies of the pattern.

But L’s output is three copies minus A’s output. For that subtraction to leave 0.764 copies, A must return approximately **3 − 0.764 = 2.236 copies**.

So the same u₂ is an eigenvector of A as well:

<div class="table-wrap" markdown="1">

| Input pattern | A multiplies it by | L multiplies it by |
| --- | --- | --- |
| Flat pattern u₁ | 3 | 0 |
| Winning pattern u₂ | ≈ 2.236 | ≈ 0.764 |

</div>

For each row, the two multipliers add up to three. The graph and the node pattern have not changed.

### The “gap” is the difference between the first two adjacency eigenvalues

The largest adjacency eigenvalue is 3, belonging to the flat pattern. The second largest is approximately 2.236. The gap between them is:

<div class="equation" role="math" aria-label="The adjacency spectral gap is approximately three minus 2.236, or 0.764. Its exact value is lambda two, equal to three minus the square root of five.">3 − 2.236 ≈ 0.764<small>the exact gap is λ₂ = 3 − √5</small></div>

The adjacency description measures down from 3; the Laplacian description measures up from zero. Both give the same gap.

### The dictionary for a regular graph

If every node has degree d, then L = dI − A. Here I is the identity matrix, which returns its input unchanged. A pattern with adjacency multiplier α has Laplacian multiplier d − α.

We write α for an adjacency eigenvalue and λ for a Laplacian eigenvalue. Order the adjacency values from largest to smallest, α₁, α₂, and so on. Their Laplacian partners run from smallest to largest, because subtracting from d reverses the order.

<div class="equation" role="math" aria-label="For a d-regular graph, d minus the second-largest adjacency eigenvalue equals the second-smallest Laplacian eigenvalue.">d − α₂ = λ₂<small>α₂: second-largest adjacency eigenvalue<br>λ₂: second-smallest Laplacian eigenvalue</small></div>

At the same degree d, a smaller α₂ means a larger λ₂, and therefore a stronger lower bound on every cut score. This translation lets us use Chapter 9’s reasoning even when a paper reports adjacency eigenvalues.

The simple subtraction rule depends on every node having the same degree. The optional sections below explain degree normalization and what changes when degrees differ.

<details markdown="1">
<summary>Optional: see the translation for all eight patterns</summary>

Each line in the figure connects two multipliers for one pattern. Moving downward through A’s eigenvalues moves upward through L’s eigenvalues. Each paired set adds up to three.

{% include visual-primer/spectral/figure-31.html %}

</details>

<details markdown="1">
<summary>Optional: why some papers divide the gap by the degree</summary>

L adds the local differences at a node. Dividing L by d gives their average instead. For a regular graph, L/d is the **normalized Laplacian**.

Dividing a matrix by d divides each eigenvalue by d. If we call the second normalized eigenvalue μ₂, then:

<div class="equation" role="math" aria-label="Mu two equals lambda two divided by d, which for this graph is approximately 0.764 divided by three, or 0.255.">μ₂ = λ₂/d ≈ 0.764/3 ≈ 0.255</div>

The graph is the same. The reported number uses a different scale. When reading a spectral gap, first check which matrix is being used and whether the value has been divided by the degree.

</details>

<details markdown="1">
<summary>Optional: conductance measures the fraction of connections leading out</summary>

Our group of four nodes has two links leading out. Its cut score is 2/4 = 0.5 outward links per node.

Now ask a related question: what fraction of the group’s available connections lead outside? Each node has three connection ends, giving 4 × 3 = 12 ends in total. Five internal links use ten of those ends, two per internal link. Only two ends lead out.

{% include visual-primer/spectral/figure-32.html %}

The outward fraction is therefore 2/12 = **1/6**. The minimum such fraction over all cuts is the graph’s **conductance**, written φ(G). We use the side with the smaller total number of connection ends.

When every node has degree d, counting connection ends multiplies each group’s node count by d. So φ(G) = h(G)/d. In our graph, φ(G) = 0.5/3 = 1/6.

Conductance pairs naturally with the normalized eigenvalue μ₂ = λ₂/d. Dividing Chapter 9’s bounds by d gives:

<div class="equation" role="math" aria-label="Mu two divided by two is at most conductance, which is at most the square root of twice mu two.">μ₂/2 ≤ φ(G) ≤ √(2μ₂)</div>

We have changed both measurements to a scale relative to degree. The relationship between cuts and eigenvalues remains.

</details>

<details markdown="1">
<summary>Optional: what changes when nodes have different degrees?</summary>

The original identity L = D − A still holds. So does the energy formula xᵀLx = ∑(xᵢ − xⱼ)², and a constant pattern still has zero energy. But D is no longer one number times I, so we cannot translate eigenvalues by subtracting them all from one common degree.

For conductance, count a group’s connection ends by adding its node degrees. This sum is called its **volume**. A cut’s conductance is its crossing-edge count divided by the smaller of the two group volumes.

The matching pattern calculation also weights nodes by degree. Assuming no isolated nodes, use weighted mean zero, ∑ᵢ dᵢxᵢ = 0, and weighted squared spread ∑ᵢ dᵢxᵢ² = 1. A higher-degree node contributes more to these totals.

To express the calculation using an ordinary symmetric matrix, set yᵢ = √dᵢ xᵢ. The weighted squared spread of x becomes the ordinary squared length of y, and the matrix is the symmetric normalized Laplacian:

<div class="equation" role="math" aria-label="The symmetric normalized Laplacian is D to the minus one half, times L, times D to the minus one half.">D<sup>−1/2</sup> L D<sup>−1/2</sup></div>

A constant x becomes a y whose entries are proportional to √dᵢ. That is why this matrix’s zero eigenvector is not flat when the degrees differ. The change comes from the new coordinates. [Spielman’s text](https://www.cs.yale.edu/homes/spielman/sagt/sagt.pdf) develops these versions in detail.

</details>

<details markdown="1">
<summary>Optional: what the name Ramanujan adds</summary>

A connected d-regular graph is called **Ramanujan** when all its nontrivial adjacency eigenvalues have absolute value at most 2√(d − 1). The flat pattern’s eigenvalue d is excluded; for a bipartite graph, −d is excluded too.<sup class="fnref"><a href="#fn-18" id="fnref-18" data-fn="18" aria-expanded="false" aria-label="Footnote 18">[18]</a></sup>

This condition checks the whole nontrivial adjacency spectrum, including negative eigenvalues. It is more specific than checking only the gap d − α₂.

The threshold is a benchmark for growing graphs at fixed degree. Ramanujan graphs stay within it. Random regular graphs approach this bound with high probability as their size grows, but that does not make every random graph Ramanujan. [Friedman’s result](https://arxiv.org/abs/cs/0405020) gives the probabilistic statement.

RNG uses the expansion properties of random-like graphs. Its paper does not claim an exact Ramanujan construction. Strong expansion can be useful without that particular certificate.

</details>

<a id="rng" class="chapter-anchor"></a>

## 12. Bring the ideas back to RNG

<p class="chapter-tag">a good graph still needs a map</p>

A data-center fabric carries traffic between many different groups of endpoints. A strong connection across one convenient division is therefore not enough. We want every group to have enough links to the rest, while staying within the routers’ port limits. That is the expansion goal from Chapter 10, and it motivates RNG’s use of random-like wiring. [RNG §2](https://arxiv.org/html/2604.15261v3#S2)

Traffic leaving a group must cross its boundary. The combined capacity of those boundary links limits how much can leave, regardless of the routing scheme. With equal-capacity links, counting the outward links tells us their total capacity. The spectral argument helps us reason about these boundaries across the whole topology.

### Random-like wiring has to fit real cabling

RNG connects routers using a mixture of planned and randomized choices. The paper calls the resulting topology *quasi-random*. Splitting fabric-facing ports into lanes lets one physical port provide separate links to different neighbours. Those logical connections must also be practical to cable.

The paper’s ShuffleBox design maps fibre pairs through passive optical connections. It changes where fibres connect, without forwarding packets. A router-to-router connection passing through this passive hardware is still one logical link in our graph.

{% include visual-primer/spectral/figure-33.html %}

The authors report that their cabling-constrained construction retains the spectral gap of unconstrained random graphs in their analysis. This connects the physical design back to the expansion goal. The result is about their construction; it is not a guarantee for every possible cabling layout. [RNG §6](https://arxiv.org/html/2604.15261v3#S6)

### A good graph still needs a routing method

The topology makes paths available. Routing decides which paths traffic actually takes. If two routes exist but the forwarding rules always choose the same one, the other route contributes no useful traffic carrying capacity for that traffic.

{% include visual-primer/spectral/figure-34.html %}

RNG’s routing scheme, **Spraypoint**, spreads traffic across source neighbours and then uses forwarding rules organized around destinations and waypoints. This is how the design tries to turn available paths into useful path diversity. The paper analyzes its performance together with the topology and a traffic model. [RNG §5](https://arxiv.org/html/2604.15261v3#S5)

<p class="note" markdown="1">One notation clash to watch for in the paper: its routing parameter h counts eligible next hops in Spraypoint. It is not this primer's h(G), the edge expansion.</p>

The final design must fit port counts, oversubscription targets, and forwarding-memory limits. RNG also uses separate server and edge meshes, with connecting ports distributed across their routers. The spectral argument helps assess the topology; these additional engineering choices determine how the system is built and operated. [RNG §7.4](https://arxiv.org/html/2604.15261v3#S7.SS4), [§8](https://arxiv.org/html/2604.15261v3#S8)

When reading the results, ask which question each piece of evidence answers. **The spectral gap** gives bounds on cuts. **The routing analysis** studies what Spraypoint achieves under its assumptions. **The measurements** show how the deployed system performs in the tested conditions.

{% include visual-primer/spectral/figure-35.html %}

We started by asking how to find a weak boundary. The question led to three local operations: collect the neighbours, repeat the node's own value, take the difference. We used them to test a division, to let its values bend, and to find the least-energy pattern, whose energy is λ₂. Cheeger then connected that number back to the boundaries we cared about, and expansion turned the detector into a design goal. The graph is the map. Routing still has to drive.

<a id="recap-title"></a>

## Review

1. A graph is nodes and edges; a pattern is one value per node. A collects the neighbours' values, D repeats a node's own value once per link, and <span class="math">L = D − A</span> asks how far a node stands above its neighbourhood.
2. A cut's score is crossing edges divided by the smaller side. The lowest score over all groups is the edge expansion h(G), and checking every group is hopeless.
3. The energy <span class="math">E(x) = ∑(xᵢ − xⱼ)² = xᵀLx</span> counts squared disagreement across links. For a paint check it is 4 times the crossing edges. It is never negative.
4. Two conditions make the comparison fair: mean zero, because the edges can't see a common level, and variation 1, because shrinking isn't an improvement. Variation is the sum of squared distances from the mean. Dividing energy by variation, the Rayleigh quotient <span class="math">xᵀLx / xᵀx</span>, ranks patterns the same way.
5. Letting values bend helps. One number, t, moves the four boundary nodes toward zero, with a rescaling after every move. The energy falls from 1 to 0.764 at t = 0.618 and climbs to 2 at t = 0, because the interior edges start to disagree.
6. The reference patterns are the eigenvectors of L, the patterns L only rescales, and a length-1 eigenvector's energy is its eigenvalue. Every pattern with mean zero and variation 1 is a mixture of u₂ to u₈ whose shares add to 1, so its energy is a weighted average of their eigenvalues and cannot fall below the smallest, λ₂. u₂, the Fiedler vector, reaches it. Here λ₂ = 3 − √5 ≈ 0.764.
7. Sort the nodes by Fiedler value, sweep a threshold through the gaps, score each cut by crossing edges over the smaller side. Four distinct values give three gaps; the second one gives 0.5. A sweep tests the prefixes of one ordering, not every group.
8. Cheeger: <span class="math">λ₂/2 ≤ h(G) ≤ √(2dλ₂)</span>. A cheap cut gives a cheap pattern, and a cheap pattern gives a cheap cut. Here 0.382 ≤ h(G) ≤ 0.5, and checking all 127 cuts gives exactly 0.5.
9. Expansion means every group has links out in proportion to its size. Rewiring the same twelve links raised h from 0.5 to 1 and λ₂ from 0.764 to 2. Adjacency eigenvalues tell the same story in another dialect, α = d − λ. A good graph is a map; routing still has to drive.

## Sources and further reading

1. [Bernardi et al., *RNG: Flat Datacenter Networks at Scale*](https://arxiv.org/abs/2604.15261v3), version 3, 21 May 2026. The network discussion above follows this version.
2. [Daniel Spielman, *Spectral and Algebraic Graph Theory*](https://www.cs.yale.edu/homes/spielman/sagt/sagt.pdf). A fuller development of Laplacians, the minimum argument, and graph partitioning.
3. [Hoory, Linial and Wigderson, *Expander Graphs and Their Applications*](https://www.math.ias.edu/~avi/BOOKS/expanderbookr1.pdf). Expansion, spectral bounds, and the equal-degree form of Cheeger's inequality used here.
4. [Joel Friedman, *A Proof of Alon's Second Eigenvalue Conjecture and Related Problems*](https://arxiv.org/abs/cs/0405020). The near-Ramanujan behaviour of random regular graphs.
5. <a href="{{ '/Linear-Algebra-Visual-Primer/' | relative_url }}">A Primer on Linear Algebra.</a> Dot products, projection, eigenvectors, and the Rayleigh quotient, using a running example with one vector and one 2 × 2 matrix.

<section class="footnotes" aria-labelledby="footnotes-title">
<h2 id="footnotes-title">Footnotes</h2>
<ol>
<li id="fn-1"><span class="fn-text">Nothing to do with charts. The word was borrowed in 1878 by J. J. Sylvester, who was drawing molecules as dots and lines and wanted a name for the drawings.</span> <a class="fn-back" href="#fnref-1" aria-label="Back to footnote 1 in the text">↩</a></li>
<li id="fn-2"><span class="fn-text">Named after Laplace because it is the wiring-diagram cousin of his operator from physics, which also measures how far a value sits from the average of its surroundings. Books that want to be precise call this one the <em>combinatorial</em> Laplacian; Chapter 11 meets a cousin that divides by degree.</span> <a class="fn-back" href="#fnref-2" aria-label="Back to footnote 2 in the text">↩</a></li>
<li id="fn-3"><span class="fn-text">For eight nodes, the nonempty groups of size at most four number 8 + 28 + 56 + 70 = 162. A four-versus-four cut appears twice in that list, once for each side, so these groups describe 127 distinct cuts. In general, n nodes have 2^(n − 1) − 1 nontrivial cuts when swapping the sides is counted as the same cut. For forty nodes, there are 618,679,078,297 groups of size at most twenty, representing 549,755,813,887 distinct cuts.</span> <a class="fn-back" href="#fnref-3" aria-label="Back to footnote 3 in the text">↩</a></li>
<li id="fn-4"><span class="fn-text">The word is borrowed from physics, where a spring stores energy proportional to the square of its stretch. Picture every link as a spring between the two values at its ends. Our springs are never allowed to relax.</span> <a class="fn-back" href="#fnref-4" aria-label="Back to footnote 4 in the text">↩</a></li>
<li id="fn-5"><span class="fn-text">A symmetric matrix whose energy is never negative is called <em>positive semidefinite</em>. L is symmetric because every edge runs both ways. Both facts matter in Chapter 7, where the eigenvectors take over.</span> <a class="fn-back" href="#fnref-5" aria-label="Back to footnote 5 in the text">↩</a></li>
<li id="fn-6"><span class="fn-text"><em>Centering</em> removes the component along the all-equal direction. Subtracting the mean does this one value at a time.</span> <a class="fn-back" href="#fnref-6" aria-label="Back to footnote 6 in the text">↩</a></li>
<li id="fn-7"><span class="fn-text">A pattern rescaled to variation 1 is called <em>normalized</em>. We will mostly say “rescaled”.</span> <a class="fn-back" href="#fnref-7" aria-label="Back to footnote 7 in the text">↩</a></li>
<li id="fn-8"><span class="fn-text">Here, each undirected edge is counted once: E(x) = ∑{i,j} (xᵢ − xⱼ)² = xᵀLx. With mean zero, the variation is ∑ᵢ xᵢ². These are the same energy and variation used in Chapters 4–6.</span> <a class="fn-back" href="#fnref-8" aria-label="Back to footnote 8 in the text">↩</a></li>
<li id="fn-9"><span class="fn-text">“Eigen” is German for “own”: a pattern the matrix treats as its own. Primer 1 drew eigenvectors as arrows that a matrix only stretched. Here each arrow has eight entries, so we read those entries as values on eight nodes.</span> <a class="fn-back" href="#fnref-9" aria-label="Back to footnote 9 in the text">↩</a></li>
<li id="fn-10"><span class="fn-text">This is the spectral theorem, drawn in Primer 1's Chapter 8 for a 2 × 2 matrix. For eight nodes the picture has eight perpendicular directions instead of two, and nothing else changes.</span> <a class="fn-back" href="#fnref-10" aria-label="Back to footnote 10 in the text">↩</a></li>
<li id="fn-11"><span class="fn-text">When an eigenvalue repeats, any nonzero mixture of eigenvectors belonging to it is another eigenvector with that eigenvalue. We choose perpendicular, length-1 building blocks within that space. If λ₂ repeats, several independent directions achieve the same minimum.</span> <a class="fn-back" href="#fnref-11" aria-label="Back to footnote 11 in the text">↩</a></li>
<li id="fn-12"><span class="fn-text">The slider's pattern is an eigenvector exactly when t² + t − 1 = 0, which gives t = (√5 − 1)/2 ≈ 0.618, one over the golden ratio. The eigenvalue that comes with it is 2 − 2t = 3 − √5.</span> <a class="fn-back" href="#fnref-12" aria-label="Back to footnote 12 in the text">↩</a></li>
<li id="fn-13"><span class="fn-text">After Miroslav Fiedler, who studied λ₂ in a 1973 paper and showed that it is zero exactly when the graph is disconnected, and that bigger values go with graphs that are harder to split.</span> <a class="fn-back" href="#fnref-13" aria-label="Back to footnote 13 in the text">↩</a></li>
<li id="fn-14"><span class="fn-text">More generally, the number of zero Laplacian eigenvalues is the number of connected components. Each component can hold its own constant value without any edge disagreement. Centering removes one shared-level direction; if the graph is disconnected, other zero-energy directions remain.</span> <a class="fn-back" href="#fnref-14" aria-label="Back to footnote 14 in the text">↩</a></li>
<li id="fn-15"><span class="fn-text">A threshold can be placed between consecutive distinct values. With k distinct values, there are k − 1 nontrivial threshold cuts, and k is at most the number of nodes n. These are only the cuts obtained from one ordering. Equal values stay together; reversing the ordering gives the same divisions with their sides swapped.</span> <a class="fn-back" href="#fnref-15" aria-label="Back to footnote 15 in the text">↩</a></li>
<li id="fn-16"><span class="fn-text">Jeff Cheeger proved the original version in 1970 for curved surfaces, where it bounds the smallest vibration frequency by how thin the surface's narrowest neck is. Jozef Dodziuk, and Noga Alon with Vitali Milman, carried it over to graphs in the mid-1980s. The form used here is the one in the survey by Hoory, Linial and Wigderson, linked below.</span> <a class="fn-back" href="#fnref-16" aria-label="Back to footnote 16 in the text">↩</a></li>
<li id="fn-17"><span class="fn-text">Mark Pinsker named expanders in 1973, in a paper about building telephone switching networks with few connections; Leonid Bassalygo had studied the same objects just before. Random regular graphs turned out to be expanders almost always, and explicit constructions took another decade.</span> <a class="fn-back" href="#fnref-17" aria-label="Back to footnote 17 in the text">↩</a></li>
<li id="fn-18"><span class="fn-text">The name is a joke that stuck: the first explicit constructions, by Lubotzky, Phillips and Sarnak and independently by Margulis in 1988, relied on a conjecture of Ramanujan's about number theory. The graphs themselves have nothing to do with him.</span> <a class="fn-back" href="#fnref-18" aria-label="Back to footnote 18 in the text">↩</a></li>
</ol>
</section>

<footer class="credits">
<p>The stick figures, comics and charts are original drawings, made in the general style of <a href="https://xkcd.com/">xkcd</a> as a tribute. This page is not affiliated with or endorsed by xkcd or Randall Munroe. Every figure from the original primer has been redrawn with the same coordinates and data, and the figures new to this edition use the same eight-node graph, with every number computed from it and checked in code; the wobble moves the middle of each line, never its endpoints. The two eight-node graphs and the three-node path are teaching examples, not sampled RNG topologies.</p>
<p>Lettering: <em>Humor Sans</em> by Michael Ciuffo and <em>Playpen Sans</em> by TypeTogether, both under the <a href="https://openfontlicense.org">SIL Open Font License 1.1</a>.</p>
</footer>

{% include visual-primer/spectral/graph-data.html %}
