---
layout: visual-primer
title: "A Visual Primer on Spectral Graph Theory"
primer: spectral
---

> "When we try to pick out anything by itself, we find it hitched to everything else in the Universe." - John Muir

## Provide Context
Todo: 

## 1. Start with the graph

<p class="chapter-tag">three links per router, two links between groups</p>

### Eight routers, twelve links

Our example has eight routers and twelve links. Every router has three links, yet only two links connect the two halves of the network. We want to understand that weakness and learn how to find similar ones in larger networks.

We draw the network as a **graph**: a circle, called a **node**, represents a router, and a line, called an **edge**, represents a link. Two nodes joined by an edge are **neighbours**.<sup class="fnref"><a href="#fn-1" id="fnref-1" data-fn="1" aria-expanded="false" aria-label="Footnote 1">[1]</a></sup> The nodes are numbered 1 to 8.

{% include visual-primer/spectral/figure-03.html %}

A node's number identifies it. Its position on the page only helps us see the wiring. We could slide the circles around or bend the lines without changing a single connection.

The number of neighbours a node has is its **degree**. Node 3 has neighbours 1, 2 and 5, so its degree is three. Every other node also has degree three. When all nodes have the same degree, the graph is called **regular**; ours is 3-regular.

### Only two links connect the halves

Look at nodes 1–4 as one group and nodes 5–8 as another. Only edges 3–5 and 4–6 connect the groups. All traffic between the halves must cross one of those two links.

{% include visual-primer/spectral/figure-04.html %}

Knowing that each router has three links does not tell us how well a whole group is connected to the rest. In a larger network, a weak division like this may be hard to spot in a drawing. We need a way to study it through calculations.

### Label the two groups

Give nodes 1–4 the value +1 and nodes 5–8 the value −1. These are labels we choose to mark the groups. The wiring stays the same.

The labels let us recognize a crossing link by subtracting the values at its ends:

- **Same group:** the values match, so their difference is zero.
- **Different groups:** the difference is 2 or −2, depending on which value we subtract from which.

We can now identify links between the groups using arithmetic.

The values assigned to all the nodes form a **pattern**. List them in node-number order and we have a vector, <span class="math">x</span>. Its third entry, <span class="math">x₃</span>, is the value assigned to node 3: here, +1. The node number tells us which entry to read.

{% include visual-primer/spectral/figure-05.html %}

All our links work in both directions and count equally. No node links to itself, and no pair has more than one link. Next we will put the wiring into matrices that compare the assigned values at connected nodes.

<a id="laplacian" class="chapter-anchor"></a>

## 2. Turn the wiring into A, D and L

<p class="chapter-tag">one comparison, written for every node</p>

### Start with one node's comparison

Node 3 holds +1. Its neighbours 1 and 2 also hold +1, while its neighbour 5 holds −1. Subtract each neighbour's value from node 3's value, then add the three differences:

<div class="equation" role="math" aria-label="At node 3, one minus one, plus one minus one, plus one minus negative one, equals two.">(1 − 1) + (1 − 1) + (1 − (−1)) = 2</div>

The two neighbours in the same group contribute zero. The neighbour in the other group contributes 2.

To see how a matrix can do this, regroup the same calculation. Collect the three copies of node 3's value, then subtract the neighbours' values together:

<div class="equation" role="math" aria-label="One minus one, plus one minus one, plus one minus negative one, equals three times one minus the sum of one, one, and negative one. This equals three minus one, or two.">(1 − 1) + (1 − 1) + (1 − (−1))<br>= 3 × 1 − (1 + 1 + (−1))<br>= 3 − 1 = 2</div>

There are two parts: the node's own value counted once per neighbour, and the sum of its neighbours' values. We will build a matrix for each part so we can do the calculation at every node.

### A: add the neighbours' values

Start by recording the wiring. Give every node a row and a column, in node-number order. Eight nodes give us an 8 × 8 table. Put a 1 where the row's node and the column's node share an edge, and a 0 everywhere else. This is the **adjacency matrix**, <span class="math">A</span>. “Adjacent” means joined by an edge.

Multiplying A by x gives a new vector, **Ax**, with one result per node. The notation <span class="math">(Ax)₃</span> means its third entry: the result for node 3.

Row 3 has 1s in columns 1, 2 and 5, so it adds the values at those three neighbours. The zeros leave the other values out:

<div class="equation" role="math" aria-label="At node 3, A x equals x one plus x two plus x five, which is one plus one minus one, or one.">(Ax)₃ = x₁ + x₂ + x₅ = 1 + 1 + (−1) = 1</div>

So node 3's result in Ax is 1: the sum of its neighbours' values.

{% include visual-primer/spectral/figure-07.html %}

Every link works in both directions. Edge 3–5 therefore puts a 1 in row 3, column 5, and another in row 5, column 3. These matching entries make A symmetric across its main diagonal.

### D: count the node's own value once per neighbour

Now we need the other part: three copies of node 3's own value. Its degree tells us how many copies to count.

Put each node's degree on the main diagonal of a matrix called <span class="math">D</span>, the **degree matrix**, and put zeros elsewhere. Each row multiplies that node's value by its degree. For node 3:

<div class="equation" role="math" aria-label="At node 3, D x equals three times x three, which equals three.">(Dx)₃ = 3x₃ = 3</div>

{% include visual-primer/spectral/figure-08.html %}

Every node in our graph has degree three, so D multiplies every entry of x by three. We can write <span class="math">D = 3I</span>, where I is the identity matrix, which returns its input unchanged.

### L = D − A: combine the two parts

Dx counts each node's own value once per neighbour. Ax adds its neighbours' values. Subtracting the two outputs performs our original comparison at every node:

<div class="equation" role="math" aria-label="L x equals D x minus A x. At node three, L x is three minus one, or two.">Lx = Dx − Ax<small>At node 3: (Lx)₃ = 3 − 1 = 2</small></div>

The matrix <span class="math">L = D − A</span> is called the graph's **Laplacian**.<sup class="fnref"><a href="#fn-2" id="fnref-2" data-fn="2" aria-expanded="false" aria-label="Footnote 2">[2]</a></sup> Its diagonal entries are the degrees. Each neighbour's column gets −1, and every other entry is zero.

{% include visual-primer/spectral/figure-09.html %}

For any node i, row i adds the differences between that node's value and each neighbour's value. The summation sign below means “add one term for each neighbour j”:

<div class="equation" role="math" aria-label="Entry i of L x is the sum over the neighbours j of i of x i minus x j.">(Lx)ᵢ = ∑<sub>j neighbouring i</sub> (xᵢ − xⱼ)</div>

{% include visual-primer/spectral/figure-06.html %}

A, D and L depend only on the wiring. We can assign new values to the nodes by changing x, and the same matrices will compare those values. Each output entry still belongs to the same node.

The differences have signs, so they can cancel. Suppose we give node 3 the value 1 and its neighbours the values 0, 1 and 2. Its result is (1 − 0) + (1 − 1) + (1 − 2) = 0. Here, zero means the node's value equals its neighbours' average; the individual neighbours have different values.

We now have a matrix that compares values at connected nodes. Before combining those comparisons into one measurement, we need to decide how to judge whether a division of the network is weak.

<a id="boundary" class="chapter-anchor"></a>

## 3. Measure how weakly a group connects

<p class="chapter-tag">crossing links relative to group size</p>

Our graph is **connected**: you can follow edges from any node to any other. Yet removing just two links separates it into two groups of four nodes. We want to measure how weakly a group connects to the rest of the network.

### Count crossing links relative to group size

Two links connecting a group of four nodes to the rest give us <span class="math">2 ÷ 4 = 0.5</span> crossing links per node. The same two links would mean much less connectivity per node for a group of two hundred.

We call a division into two nonempty groups a **cut**. To compare cuts, divide the number of crossing links by the number of nodes on the smaller side:

<div class="equation" role="math" aria-label="Cut score equals crossing edges divided by nodes on the smaller side."><span class="frac"><span>crossing edges</span><span>nodes on the smaller side</span></span></div>

**A lower score means fewer links connect the smaller group to the rest, relative to its size.** The crossing edges are also called the group's **boundary**.

### Why use the smaller side?

Separate node 1 from the other seven nodes. Three links cross that division, so its score is <span class="math">3 ÷ 1 = 3</span>.

If we divided by the seven nodes on the other side, we would get <span class="math">3 ÷ 7 ≈ 0.43</span>. The same division would appear much weaker just because we chose the larger group as the denominator. Always using the smaller side gives one answer for the cut, whichever side we name first.

{% include visual-primer/spectral/figure-11.html %}

### Find the weakest division

Our four-against-four cut scores 0.5, the lowest of the three examples above. Another division might score even lower.

The lowest score across **all** cuts is the graph's **edge expansion**, written <span class="math">h(G)</span>, where G names the graph. A small h(G) means that some group has few links to the rest for its size. Finding a cut with score 0.5 gives us a candidate for that minimum.

Scoring one group is easy. Searching for the lowest score is harder because there are so many groups to try. Checking all nonempty groups of up to half the nodes means 162 candidates for eight nodes, but more than 600 billion for forty.<sup class="fnref"><a href="#fn-3" id="fnref-3" data-fn="3" aria-expanded="false" aria-label="Footnote 3">[3]</a></sup>

{% include visual-primer/spectral/figure-12.html %}

Our +1 and −1 labels already mark a proposed division. Next we will use those values to measure its crossing links. This will connect the cut calculation to the Laplacian and give us a way to search for useful divisions through node values.

<a id="energy" class="chapter-anchor"></a>

## 4. Use node values to test a division

<p class="chapter-tag">from crossing links to squared differences</p>

Chapter 3 judged a division by its crossing links relative to group size. Our labels from Chapter 1 already tell us which links cross: +1 marks nodes 1–4, and −1 marks nodes 5–8. A crossing link joins opposite signs.

### From crossing links to squared differences

For each edge, subtract the value at one end from the value at the other, then square the difference:

- **Equal values:** the difference is zero, so the contribution is zero.
- **Values +1 and −1:** the difference is 2 or −2, depending on the reading direction. Either way, its square is 4.

Squaring makes each contribution nonnegative and independent of which way we read the edge. Positive and negative differences cannot cancel.

Add the contributions, counting each edge once. We call this total the pattern's **energy**, written <span class="math">E(x)</span>. It measures how different the values are across the graph's edges.<sup class="fnref"><a href="#fn-4" id="fnref-4" data-fn="4" aria-expanded="false" aria-label="Footnote 4">[4]</a></sup>

<div class="equation" role="math" aria-label="Energy equals the sum of squared differences across edges, counting each edge once.">energy = sum of squared differences across edges</div>

With our +1 and −1 labels, **energy is four times the number of crossing links**. Every crossing link contributes 4; every other link contributes zero.

### Compare two divisions

In our two-halves pattern, only edges 3–5 and 4–6 join opposite signs. The energy is <span class="math">2 × 4 = 8</span>.

Now alternate the signs in node-number order: +1, −1, +1, −1, and so on. We still have four nodes of each sign, but six edges cross between the groups. The energy is <span class="math">6 × 4 = 24</span>.

{% include visual-primer/spectral/figure-13.html %}

Here is how energy connects to Chapter 3's cut score:

<div class="table-wrap" markdown="1">

| Arrangement | Crossing links | Cut score | Energy |
| --- | --- | --- | --- |
| Two halves | 2 | 2 ÷ 4 = 0.5 | 2 × 4 = 8 |
| Alternating signs | 6 | 6 ÷ 4 = 1.5 | 6 × 4 = 24 |

</div>

Both divisions have four nodes on each side, so fewer crossing links means both a lower cut score and lower energy. For divisions with different group sizes, we must also account for size; energy alone does not do that.

Squared differences also work when node values are not limited to +1 and −1. They make large gaps especially costly: a gap of 3 contributes 9, while three gaps of 1 contribute only 3 in total. Later we will use this calculation to look for patterns that change more gently across the links.

<details markdown="1">
<summary>Optional: three pictures explaining the squared differences</summary>

{% include visual-primer/spectral/figure-14.html %}

</details>

### The Laplacian computes the same energy

Chapter 2 gave us Lx: one result per node, found by adding its differences from its neighbours. Simply adding all the Lx entries gives zero. Each edge appears at both ends with opposite differences, so those contributions cancel.

Instead, multiply each node's value by its own Lx result, then add. Multiplying matching entries and adding is a **dot product**. Here it is <span class="math">x · (Lx)</span>, also written <span class="math">xᵀLx</span>. This is the input–output dot product from the [linear algebra primer]({{ '/Linear-Algebra-Visual-Primer/' | relative_url }}#quadratic), with L as the matrix.

To see why this recovers the energy, follow just edge 3–5. It joins +1 to −1, so its squared gap is 4. In the dot product, this edge contributes at both ends:

- **At node 3:** its value +1 multiplies the difference +2, giving <span class="math">(+1) × (+2) = 2</span>.
- **At node 5:** its value −1 multiplies the difference −2, giving <span class="math">(−1) × (−2) = 2</span>.

Together, these give <span class="math">2 + 2 = 4</span>, exactly one squared gap for this edge. Edge 4–6 contributes another 4. Every other edge joins equal values and contributes zero.

{% include visual-primer/spectral/figure-15.html %}

The full calculation, using one product per node, is:

<div class="table-wrap" markdown="1">

| Nodes | Value | Lx result | Product at each node |
| --- | --- | --- | --- |
| 1, 2, 7, 8 | +1 or −1 | 0 | 0 |
| 3, 4 | +1 | +2 | 2 |
| 5, 6 | −1 | −2 | 2 |

</div>

The four nonzero products add to 8, the same energy we found from the edges. This equality works for any node values:

<div class="equation" role="math" aria-label="E of x equals x transpose L x, which equals the sum over edges of x i minus x j squared.">E(x) = xᵀLx = ∑<sub>edges {i, j}</sub> (xᵢ − xⱼ)²</div>

The summation means to add one squared difference per edge. We can calculate energy directly from those gaps or through the Laplacian; both methods give the same nonnegative total.<sup class="fnref"><a href="#fn-5" id="fnref-5" data-fn="5" aria-expanded="false" aria-label="Footnote 5">[5]</a></sup>

<details markdown="1">
<summary>Optional: the same edge calculation with any two values</summary>

For an edge joining nodes i and j, use their values xᵢ and xⱼ in place of +1 and −1. Its two contributions to the dot product are:

<div class="equation" role="math" aria-label="x i times x i minus x j, plus x j times x j minus x i, equals x i minus x j squared.">xᵢ(xᵢ − xⱼ) + xⱼ(xⱼ − xᵢ) = (xᵢ − xⱼ)²</div>

The two endpoint contributions add to exactly one squared gap. Summing over all edges gives <span class="math">xᵀLx = E(x)</span>.

</details>

### Next, let the values change

The labels +1 and −1 force each node into one of two groups. Allowing values between them, such as 0.3 or −0.6, lets us adjust a pattern gradually. We will look for a pattern with low energy, then use its values to suggest a division of the graph.

But shrinking every value also lowers the energy, even when the arrangement stays the same. Before searching, we need a way to compare patterns fairly. Chapter 5 sets that up.

<a id="fair" class="chapter-anchor"></a>

## 5. Make the comparison fair

<p class="chapter-tag">a better arrangement, or just smaller numbers?</p>

Chapter 4 gave us energy: the total squared disagreement across the edges. We want to find node values that keep this total small. But first we need to distinguish a better arrangement from simply using smaller numbers.

### Low energy alone is not enough

Give every node zero and the energy is zero. That works on any graph, so it tells us nothing about where the network might divide into groups.

Requiring different values does not solve the problem either. Our four +1 values and four −1 values give energy 8. Halve every value and the energy falls to 2: the gaps halve, so their squares become one quarter as large. We could keep shrinking the numbers without changing their arrangement.

**We need to hold the overall spread fixed, then look for the arrangement with the least disagreement across edges.**

### Measure spread separately from energy

We will measure **squared spread** by subtracting the average from each node value, squaring each result, and adding them. This primer also calls that quantity **variation**. It measures how far the values lie from their average, regardless of which nodes are connected.

**Energy** uses the wiring: it adds the squared differences between values at the ends of each edge.

Rearranging the same values leaves their squared spread unchanged, but can change their energy. Chapter 4's two patterns show the difference:

{% include visual-primer/spectral/figure-16.html %}

To compare any patterns fairly, we will prepare each one in two steps. **Subtracting the average removes a level shared by all nodes. Rescaling fixes the squared spread, so shrinking cannot count as an improvement.**

### First, subtract the average

Suppose we add 10 to every value. The levels +1 and −1 become 11 and 9. Their gap is still 2, so the energy is unchanged. Their distances from the new average, 10, are also unchanged.

Subtract the average, 10, and we get +1 and −1 again. This is called **centering**. It gives every pattern mean zero while preserving every edge difference and the squared spread.<sup class="fnref"><a href="#fn-6" id="fnref-6" data-fn="6" aria-expanded="false" aria-label="Footnote 6">[6]</a></sup>

Mean zero means the values add up to zero. The numbers of positive and negative values need not be equal.

### Then, make the squared spread equal to 1

After centering, the average is zero. Subtracting it leaves each value unchanged, so the squared spread is just the sum of the squared values.

Our eight values each have square 1, so their squares add to 8. Divide every value by √8. Each square becomes 1/8, and the eight squares now add to <span class="math">8 × (1/8) = 1</span>. The node values become approximately +0.354 and −0.354.

Every edge gap is divided by √8 too, so every squared gap is divided by 8. The grouped pattern's energy changes from 8 to **1**; the alternating pattern's changes from 24 to **3**. Both are now compared at squared spread 1.

We choose 1 for convenience; any fixed positive amount would work.<sup class="fnref"><a href="#fn-7" id="fnref-7" data-fn="7" aria-expanded="false" aria-label="Footnote 7">[7]</a></sup> It is the **sum of the squares** that equals 1. Each node can still have its own value.

### The search now has two simple rules

<div class="equation" role="math" aria-label="The node values have mean zero, and their squares add up to one.">mean of the node values = 0<br>sum of their squared values = 1</div>

An all-equal pattern becomes all zeros when centered. Its squared spread is zero, so it cannot satisfy the second rule. Any pattern with some differences can be centered and rescaled to satisfy both.

We can now search for the lowest energy while holding the squared spread fixed. A lower energy must come from how the differences are arranged across the graph.

<details markdown="1">
<summary>Optional: see shifting and shrinking side by side</summary>

{% include visual-primer/spectral/figure-17.html %}

</details>

<details markdown="1">
<summary>Optional: the formulas and a shortcut</summary>

Let x̄ be the average of the node values, and V their squared spread:

<div class="equation" role="math" aria-label="V equals the sum over nodes of the squared difference between the node value and the mean.">V = ∑ᵢ (xᵢ − x̄)²</div>

Subtracting the mean preserves V and every edge difference. If V > 0, dividing the centered values by √V makes their squared spread 1 and divides their energy by V.

So **energy divided by squared spread** gives the energy a pattern would have after centering and rescaling. The hard split gives 8/8 = 1. Halving its values gives 2/2 = 1. Shifting them from ±1 to 9 and 11 gives 8/8 = 1, because their squared distances from the average are still the same.

{% include visual-primer/spectral/figure-18.html %}

When x already has mean zero, its squared spread is <span class="math">xᵀx</span>. We can then write the comparison as:

<div class="equation" role="math" aria-label="For our comparison, x has mean zero and is nonzero. R of x equals x transpose L x divided by x transpose x.">R(x) = <span class="frac"><span>xᵀLx</span><span>xᵀx</span></span><small>here, x contains the centered values and is nonzero</small></div>

This expression is the **Rayleigh quotient**. It is defined for any nonzero vector, but our comparison uses centered values. For the shifted pattern, the raw sum of squares is 808, while the squared spread around its average is 8. We must subtract the average before using <span class="math">xᵀx</span> as our denominator.

</details>

<details markdown="1">
<summary>Optional: can an allowed pattern ever have zero energy?</summary>

On our connected graph, zero energy requires every pair of neighbours to agree. That agreement travels through the whole graph, forcing a flat pattern. Our two rules exclude it.

If the graph has disconnected pieces, each piece can hold its own constant value. The pieces can have different levels without any edge disagreement. We can then have mean zero, squared spread 1, and zero energy. This will help explain the meaning of a zero second eigenvalue in Chapter 7.

</details>

Our starting candidate is the **hard split**: four values of about +0.354 and four of about −0.354, with energy 1. Chapter 6 will change those values while keeping the mean zero and squared spread 1.

<a id="adjust" class="chapter-anchor"></a>

## 6. Improve the first pattern

<p class="chapter-tag">can a gentler boundary lower the total?</p>

Our first pattern has energy 1. We will try to lower it by bringing the values closer together where the two groups meet. The wiring stays fixed. Every pattern we compare will have mean zero and squared spread 1.

### Start by finding where the disagreement is

In the hard split, nodes 1–4 all have value about +0.354, and nodes 5–8 all have value about −0.354.

All ten edges within the groups join equal values, so they contribute no energy. The two edges between the groups carry all the disagreement. Each contributes 0.5, giving total energy **1**.

We will start by reducing those two gaps.

### Bring the boundary values closer to zero

The crossing edges join nodes 3 to 5 and nodes 4 to 6. Call these four nodes the **boundary nodes**. The other four—1, 2, 7 and 8—are the **interior nodes**.

Move the positive boundary values down toward zero and the negative boundary values up toward zero. The ends of each crossing edge become closer in value, so those edges contribute less energy.

But now the boundary nodes differ from the interior nodes in their own group. Eight internal edges that previously contributed zero begin to contribute energy.

This is the trade-off: **we reduce disagreement between the groups by creating some disagreement inside them.** Because energy squares the gaps, reducing a large gap can outweigh the cost of introducing several smaller ones. We have to add the contributions to find out.

### Keep the comparison fair while the values change

Moving only the boundary values toward zero would also reduce the squared spread. To keep it at 1, we must rescale all eight values.

For a first trial, make each boundary value half as large as the interior value in its group. Before rescaling, we can write this as <span class="math">(1, 1, ½, ½, −½, −½, −1, −1)</span>. The mean is zero, and the squares add to <span class="math">4 × 1 + 4 × ¼ = 5</span>.

Divide every value by √5 to make the squares add to 1. Here are the resulting values compared with our starting pattern:

<div class="table-wrap" markdown="1">

| Pattern | Interior values | Boundary values | Energy |
| --- | --- | --- | --- |
| Hard split | ±0.354 | ±0.354 | 1 |
| Boundary values half as large | ±0.447 | ±0.224 | 0.8 |

</div>

The values shown are rounded. Positive values stay in the first group and negative values stay in the second. The boundary values move toward zero, while the interior values move farther from zero to keep the squared spread at 1. We are changing how the spread is distributed across the graph.

### Use t to choose the relative size

The slider calls this boundary-to-interior ratio **t**:

- **t = 1:** boundary and interior values have equal size. This is the hard split.
- **t = ½:** each boundary value is half its group’s interior value.
- **t = 0:** every boundary value is zero.

At t = ½, the rescaled boundary values are about ±0.224, not ±½. **t describes a ratio, not a node's value.** Each slider setting rescales all eight values together, preserving that ratio and keeping the squared spread at 1. The matched positive and negative values keep the mean at zero.

### Try the experiment

Start at the hard split, then try t = ½ and t = 0. Watch the **total energy**. Orange edges show disagreement between the groups; teal edges show disagreement inside them. The displayed values have already been rescaled.

{% include visual-primer/spectral/figure-19.html %}

### Why moving partway helps

At **t = ½**, the energy on the crossing edges falls from 1 to 0.4. We have saved 0.6. The new disagreement inside the groups costs 0.4, so the total is **0.8**.

The saving is larger than the new cost. Because the squared spread is still 1, the lower energy comes from redistributing the values across the graph.

### Why moving all the way to zero is worse

At **t = 0**, the two crossing edges join zeros, so their energy is zero. But the total energy has risen to **2**.

To keep the squared spread at 1, the four interior values are now +0.5, +0.5, −0.5 and −0.5. Eight edges join one of these values to a boundary value of zero. Each has a squared gap of 0.25, and eight contributions of 0.25 add up to 2.

Eliminating all disagreement between the groups creates too much disagreement inside them. Every edge contributes to the same total.

### Find the best balance

Moving partway helped; moving all the way to zero went too far. Now try **“Best in this family.”** The lowest total in this experiment occurs at **t ≈ 0.618**: boundary values about 62% as large as interior values. The energy is approximately **0.764**.

The columns below separate the two sources of energy:

<div class="table-wrap" markdown="1">

| Boundary ratio t | Inside groups | Between groups | Total energy |
| --- | --- | --- | --- |
| 1: hard split | 0 | 1 | 1 |
| ½ | 0.4 | 0.4 | 0.8 |
| 0: boundary at zero | 2 | 0 | 2 |
| ≈ 0.618: best here | ≈ 0.211 | ≈ 0.553 | **≈ 0.764** |

</div>

### What improved, and what stayed the same?

The **pattern's energy** fell from 1 to about 0.764. Its positive nodes are still 1–4 and its negative nodes are still 5–8. Dividing by sign therefore gives the same cut: two crossing links for four nodes, with **cut score 0.5**.

We have found a smoother pattern on the same graph. Once the node values can differ within each group, energy accounts for those differences too; it no longer just counts crossing links. Later we will use the pattern's values to suggest cuts.

The slider also explored only one family. It kept certain pairs of nodes equal and made the two halves mirror each other. Other patterns could give all eight nodes different values.

**Could a pattern outside this family have energy below 0.764?** The experiment alone cannot answer that. Chapter 7 will show why no allowed pattern can do better.

<details markdown="1">
<summary>Optional: see the rescaling at t = ½</summary>

{% include visual-primer/spectral/figure-20.html %}

</details>

<details markdown="1">
<summary>Optional: compare the four settings visually</summary>

{% include visual-primer/spectral/figure-21.html %}

</details>

<details markdown="1">
<summary>Optional: the formula behind the experiment</summary>

Before rescaling, write the pattern as (1, 1, t, t, −t, −t, −1, −1). Its squared spread is 4 + 4t².

Eight internal edges have gap 1 − t, so their combined energy is 8(1 − t)². Two crossing edges have gap 2t, giving combined energy 8t². The other two edges, 1–2 and 7–8, join equal values and contribute zero.

Divide the energy by the squared spread to get the energy after rescaling:

<div class="equation" role="math" aria-label="E of t equals eight times the square of one minus t plus eight times t squared, all divided by four plus four times t squared.">E(t) = <span class="frac"><span>8(1 − t)² + 8t²</span><span>4 + 4t²</span></span></div>

The numerator adds the two sources of disagreement. The denominator keeps the comparison at squared spread 1. The minimum over the slider's settings occurs at t = (√5 − 1)/2 ≈ 0.618, with energy 3 − √5 ≈ 0.764.

</details>

<a id="second" class="chapter-anchor"></a>

## 7. Can any pattern do better?

<p class="chapter-tag">why the second eigenvector wins</p>

The slider found energy about 0.764 while keeping pairs of nodes equal and the two halves as mirror images. Could a pattern outside that family do better? We need an argument that covers every possible assignment of node values.

The key is to describe every pattern using the Laplacian's eigenvectors. We will see why **every allowed pattern's energy is an average of their energies**, and why that average cannot fall below about 0.764.

### First, remember what we are comparing

A **pattern** assigns one value to each node. Its **energy** adds the squared differences across the edges.<sup class="fnref"><a href="#fn-8" id="fnref-8" data-fn="8" aria-expanded="false" aria-label="Footnote 8">[8]</a></sup> We compare patterns that follow Chapter 5's two rules:

- **Mean zero:** remove the level shared by all nodes.
- **Squared values adding to 1:** fix the squared spread, so shrinking cannot count as an improvement.

The hard split has energy 1. The slider reached about 0.764. We want the minimum among all patterns obeying these rules.

### Eigenvectors give us eight building blocks

In the [linear algebra primer]({{ '/Linear-Algebra-Visual-Primer/' | relative_url }}#eigenvectors), our vectors had two entries. Here a vector has eight entries, one value per node. The eigenvector idea is the same: **apply L, and every entry is multiplied by the same number**. The pattern is an eigenvector; that multiplier is its eigenvalue.<sup class="fnref"><a href="#fn-9" id="fnref-9" data-fn="9" aria-expanded="false" aria-label="Footnote 9">[9]</a></sup>

Our edges are undirected, so L is symmetric. The spectral theorem from linear algebra tells us that we can choose eight mutually perpendicular eigenvectors and use them to describe every pattern.<sup class="fnref"><a href="#fn-10" id="fnref-10" data-fn="10" aria-expanded="false" aria-label="Footnote 10">[10]</a></sup> Each eigenvector is a whole eight-node pattern. Multiplying these patterns by coefficients and adding their matching entries lets us build any assignment of values.

We scale each eigenvector to **unit length**, meaning its squared entries add to 1. We name them <span class="math">u₁, u₂, …, u₈</span>, ordered by their eigenvalues <span class="math">λ₁, λ₂, …, λ₈</span> from smallest to largest. The subscript identifies a pattern in this list, not a node.

For example, u₂ is the pattern we found with the slider. Applying L multiplies all its values by <span class="math">λ₂ ≈ 0.764</span>:

{% include visual-primer/spectral/figure-22.html %}

### Why a unit eigenvector's energy equals its eigenvalue

Chapter 4 wrote energy as the dot product of a pattern and its output. For an eigenvector u, that output is λu. Its energy is therefore λ times the sum of its squared entries. We chose that sum to be 1:

<div class="equation" role="math" aria-label="For a unit eigenvector u, energy equals u dot lambda u, which equals lambda times u dot u, or lambda times one.">E(u) = u · (λu)<br>= λ(u · u) = λ × 1 = λ</div>

**u₂ is a pattern with eight entries. λ₂ is one number: its multiplier under L and, at unit length, its energy.** Here are all eight eigenvalues for our graph:

<div class="table-wrap" markdown="1">

| Unit eigenvector | Eigenvalue and energy |
| --- | --- |
| u₁: every node has the same value | λ₁ = 0 |
| **u₂** | **λ₂ ≈ 0.764** |
| u₃ | λ₃ = 2 |
| u₄ through u₇ | 4 each |
| u₈ | λ₈ ≈ 5.236 |

</div>

These numbers come from L, which records the graph's wiring. Different eigenvectors can have the same eigenvalue, as the four entries with energy 4 show.<sup class="fnref"><a href="#fn-11" id="fnref-11" data-fn="11" aria-expanded="false" aria-label="Footnote 11">[11]</a></sup>

### Why the zero-energy pattern is set aside

The first eigenvector, u₁, is flat: every node holds the same value. Every edge joins equal values, giving energy zero.

Center it and every value becomes zero. Its squared spread is then zero, so it cannot satisfy our two rules.

The other seven eigenvectors are perpendicular to u₁. Since u₁ has the same entry everywhere, a dot product with u₁ is just a constant times the sum of the other pattern's entries. Perpendicularity makes that dot product zero, so **each of the other eigenvectors has entries that add to zero**.

Adding any amount of u₁ would add a shared level. The mean-zero rule requires its coefficient to be zero, leaving **u₂ through u₈** as the building blocks for allowed patterns. The lowest energy among them is about 0.764.

### What happens when we mix the remaining patterns?

We still need to check whether combining these patterns could lower the energy further. Take this example:

<div class="equation" role="math" aria-label="x equals 0.6 times u two plus 0.8 times u three.">x = 0.6u₂ + 0.8u₃</div>

The numbers 0.6 and 0.8 are **coefficients**. Each multiplies a whole eight-node pattern. Since these unit eigenvectors are perpendicular, their contributions to squared spread add:

<div class="table-wrap" markdown="1">

| Pattern | Coefficient | Share of squared spread |
| --- | --- | --- |
| u₂ | 0.6 | 0.6² = 0.36, or 36% |
| u₃ | 0.8 | 0.8² = 0.64, or 64% |

</div>

The shares add to 1, so the mixture has squared spread 1. It also has mean zero because both building blocks do.

L only rescales each eigenvector, so the pieces remain perpendicular after applying L. Their contributions to the energy dot product add too: each squared coefficient multiplies that eigenvector's energy.

<div class="equation" role="math" aria-label="The energy of x is approximately 0.36 times 0.764 plus 0.64 times 2, which is approximately 1.555.">E(x) ≈ 0.36 × 0.764 + 0.64 × 2<br>≈ 1.555</div>

**The coefficients are 0.6 and 0.8; the energy weights are their squares, 0.36 and 0.64.** These percentages describe shares of squared spread. Each building block still assigns a value to every node.

This is a **weighted average**: 36% at energy about 0.764 and 64% at energy 2. Mixing in the higher-energy pattern has raised the total above 0.764.

The same rule applies to any allowed mixture of u₂ through u₈. Its coefficients can be positive or negative, but their squares are nonnegative and add to 1. The energy is the weighted average of the corresponding eigenvalues.

**An average cannot be smaller than the smallest number being averaged.** Here that smallest energy is about 0.764. This reasoning covers every allowed pattern, because every one is a mixture of these building blocks.

There are two parts to the conclusion. No allowed pattern can go lower than the energy of u₂. And u₂ itself is allowed and reaches that energy. Together, these facts establish the minimum.

### The minimum is λ₂

The smallest eigenvalue left after removing the flat pattern is λ₂. It gives the minimum energy under our two rules:

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

An eigenvector for λ₂ is called a **Fiedler vector**, and λ₂ is called the graph’s **algebraic connectivity**.<sup class="fnref"><a href="#fn-13" id="fnref-13" data-fn="13" aria-expanded="false" aria-label="Footnote 13">[13]</a></sup> Reversing every sign gives an equally good pattern, since squared differences do not change.

The slider found the best pattern because this particular family included u₂. A different restricted family might miss it. The eigenvector argument is what lets us rule out a better answer anywhere else.

<details markdown="1">
<summary>Optional: the weighted-average formula for all seven patterns</summary>

Write an allowed pattern as a mixture of the seven available building blocks:

<div class="equation" role="math" aria-label="x equals c two u two plus all the remaining terms through c eight u eight.">x = c₂u₂ + ⋯ + c₈u₈</div>

The coefficients c₂ through c₈ multiply whole patterns. Perpendicularity makes their squared-length contributions add. Every pattern here has mean zero, so squared length is also squared spread. Our fixed-spread rule says:

<div class="equation" role="math" aria-label="c two squared plus all the remaining squared amounts through c eight squared equals one.">c₂² + ⋯ + c₈² = 1</div>

Chapter 4 wrote energy as x · Lx. L multiplies each eigenvector uᵢ by its own eigenvalue λᵢ. When we expand the dot product, terms involving two different eigenvectors vanish because those vectors are perpendicular. What remains is:

<div class="equation" role="math" aria-label="Energy equals lambda two times c two squared plus all the remaining terms through lambda eight times c eight squared.">E(x) = λ₂c₂² + ⋯ + λ₈c₈²</div>

The weights cᵢ² are nonnegative and add to 1. Every λᵢ here is at least λ₂, giving <span class="math">E(x) ≥ λ₂</span>. Choosing <span class="math">x = u₂</span> gives equality.

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

An edge with a large gap between its endpoint values contributes a lot of energy. The Fiedler pattern minimizes total energy, so it tends to keep connected nodes close in value. Sorting the nodes by these values gives us a useful place to look for a division.

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

Choose a number between two different node values. This number is the **threshold**: put every node whose value is below it into one group, and the remaining nodes into the other. Moving the threshold changes group membership while the wiring and node values stay fixed.

Zero is one possible threshold. The best cut may come from another gap, so we will try each gap and compare the cut scores.

### Try one threshold completely

Choose **−0.34**, which lies between −0.425 and −0.263. Nodes 7 and 8 have value −0.425, below the threshold. Every other node has a higher value. The chosen group is therefore **{7, 8}**, with nodes 1–6 on the other side.

Look back at the original graph. Four edges leave {7, 8}: 5–7, 5–8, 6–7 and 6–8. The smaller group has two nodes, so the cut score is:

<div class="equation" role="math" aria-label="The first cut has four crossing edges divided by two nodes on the smaller side, giving score two.">cut score = <span class="frac"><span>4 crossing edges</span><span>2 nodes on the smaller side</span></span> = 2</div>

That is one complete candidate: the threshold proposes the groups, and the original edges determine the score.

### Move it once and see what changes

Move the threshold to **0**, between −0.263 and +0.263. Nodes 5 and 6 now fall below it and join the chosen group: **{5, 6, 7, 8}**.

The four edges we just counted no longer cross the cut. Both ends of each now lie inside the chosen group. Only edges 3–5 and 4–6 leave it.

We now have two crossing edges and four nodes on each side. The score is **2/4 = 0.5**, an improvement over 2.

{% include visual-primer/spectral/figure-24.html %}

Adding nodes has reduced the number of crossing edges. We find the score by checking the wiring for each proposed group.

### Check the remaining gap

Choose **+0.34**, between +0.263 and +0.425. Nodes 3 and 4 join the chosen group, giving **{3, 4, 5, 6, 7, 8}**, with {1, 2} on the other side.

Four edges cross this division. Although the chosen group has six nodes, the *smaller* group has two. The score is therefore **4/2 = 2**.

<div class="table-wrap" markdown="1">

| Example threshold | Nodes below it | Cut score |
| --- | --- | --- |
| −0.34 | {7, 8} | 4 ÷ 2 = 2 |
| **0** | **{5, 6, 7, 8}** | **2 ÷ 4 = 0.5** |
| +0.34 | {3, 4, 5, 6, 7, 8} | 4 ÷ 2 = 2 |

</div>

Try the three positions below. Follow which nodes change sides and which original edges become crossing edges.

{% include visual-primer/spectral/figure-25.html %}

### Why are there only three candidates?

There are four distinct values, leaving three gaps between them. Any threshold within the same gap selects the same nodes. For example, −0.34 and −0.35 both select {7, 8}.

A threshold also cannot separate two nodes with exactly equal values. They stay together. Moving beyond all the values would put every node on one side, which is not a valid cut.

Trying the gaps in order and comparing their scores is called a **sweep**. With n nodes, there are at most n − 1 threshold cuts. Here we check three, out of the graph's 127 possible cuts.<sup class="fnref"><a href="#fn-15" id="fnref-15" data-fn="15" aria-expanded="false" aria-label="Footnote 15">[15]</a></sup>

### What did the sweep establish?

The second threshold gives the best cut **among these three candidates**, with score 0.5.

Chapter 7 proved the lowest possible **pattern energy**, about 0.764. The sweep found a **cut score** of 0.5 by checking only the cuts from this ordering. That does not establish the best score across all cuts.

We therefore have a good candidate and a new question: **could a cut outside this list score much lower?** Chapter 9 uses λ₂ to limit how much better an unseen cut could be.

<details markdown="1">
<summary>Optional: see all three candidate cuts side by side</summary>

{% include visual-primer/spectral/figure-26.html %}

</details>

<details markdown="1">
<summary>Optional: signs, scale, and group sizes</summary>

Reversing every sign reverses the ordering and swaps the sides of the sweep cuts. Their scores do not change. Multiplying all values by a positive number stretches the value axis while leaving the ordering and the candidate groups unchanged.

Mean zero does not require equal numbers of positive and negative entries. A few large positive values can balance many small negative ones. The balanced winning cut here comes from this graph’s symmetry.

</details>

<details markdown="1">
<summary>Optional: does a sweep need to recount every edge for every cut?</summary>

No. When a node moves into the chosen group, only its incident edges can change crossing status. An edge to a node already inside stops crossing; an edge to a node still outside starts crossing. The sweep can update its crossing count as it moves.

Nodes with equal values move together, and we score the cut after the whole group has moved.

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
3. The energy <span class="math">E(x) = ∑(xᵢ − xⱼ)² = xᵀLx</span> counts squared disagreement across links. With +1 and −1 group labels, it is 4 times the crossing edges. It is never negative.
4. Two conditions make the comparison fair: mean zero removes a shared level, and squared spread 1 prevents shrinking from counting as an improvement. Squared spread is the sum of squared distances from the mean. For a centered, nonzero pattern, dividing energy by squared spread gives the Rayleigh quotient <span class="math">xᵀLx / xᵀx</span>.
5. Letting values bend helps. One number, t, moves the four boundary nodes toward zero, with a rescaling after every move. The energy falls from 1 to 0.764 at t = 0.618 and climbs to 2 at t = 0, because the interior edges start to disagree.
6. The reference patterns are the eigenvectors of L, the patterns L only rescales, and a length-1 eigenvector's energy is its eigenvalue. Every pattern with mean zero and squared spread 1 is a mixture of u₂ to u₈ whose shares add to 1, so its energy is a weighted average of their eigenvalues and cannot fall below the smallest, λ₂. u₂, the Fiedler vector, reaches it. Here λ₂ = 3 − √5 ≈ 0.764.
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
<li id="fn-4"><span class="fn-text">The name comes from physics: an ideal spring stores energy proportional to the square of its stretch. Here, energy is a mathematical measure of the differences between values at connected nodes.</span> <a class="fn-back" href="#fnref-4" aria-label="Back to footnote 4 in the text">↩</a></li>
<li id="fn-5"><span class="fn-text">A symmetric matrix whose energy is never negative is called <em>positive semidefinite</em>. L is symmetric because every edge runs both ways. Both facts matter in Chapter 7, where the eigenvectors take over.</span> <a class="fn-back" href="#fnref-5" aria-label="Back to footnote 5 in the text">↩</a></li>
<li id="fn-6"><span class="fn-text"><em>Centering</em> removes the component along the all-equal direction. Subtracting the mean does this one value at a time.</span> <a class="fn-back" href="#fnref-6" aria-label="Back to footnote 6 in the text">↩</a></li>
<li id="fn-7"><span class="fn-text">A centered pattern rescaled so its squared values add to 1 is called <em>normalized</em>. We will mostly say “rescaled”.</span> <a class="fn-back" href="#fnref-7" aria-label="Back to footnote 7 in the text">↩</a></li>
<li id="fn-8"><span class="fn-text">Here, each undirected edge is counted once: E(x) = ∑{i,j} (xᵢ − xⱼ)² = xᵀLx. With mean zero, the squared spread is ∑ᵢ xᵢ². These are the same energy and squared spread used in Chapters 4–6.</span> <a class="fn-back" href="#fnref-8" aria-label="Back to footnote 8 in the text">↩</a></li>
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
