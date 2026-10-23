---
layout: visual-primer
title: "Understanding Networks Through Spectral Graph Theory"
primer: spectral
---

> "When we try to pick out anything by itself, we find it hitched to everything else in the Universe." - John Muir

## Provide Context
Todo: 

## 1. Find a bottleneck in a small network

<p class="chapter-tag">eight routers, three links each, two links between groups</p>

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

## 2. Describe the graph with matrices

<p class="chapter-tag">what A, D and L do to node values</p>

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

## 3. Measure how well groups connect

<p class="chapter-tag">count crossing links relative to group size</p>

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

## 4. Measure differences across connected nodes

<p class="chapter-tag">energy: add the squared differences across edges</p>

Our +1 and −1 labels mark the two groups. We will now use differences between node values to measure the links crossing between them. Later, this same calculation will let us search for useful divisions by adjusting the values.

### Add the squared differences

For each edge, subtract the value at one end from the value at the other, then square the difference. Add these results, counting each edge once. This total is the pattern's **energy**, written <span class="math">E(x)</span>.<sup class="fnref"><a href="#fn-4" id="fnref-4" data-fn="4" aria-expanded="false" aria-label="Footnote 4">[4]</a></sup>

With our labels:

- **Within a group:** equal values give a difference of 0, contributing 0.
- **Between groups:** +1 and −1 give a difference of 2 or −2, contributing 4 either way.

Squaring prevents positive and negative differences from cancelling. For these labels, **energy is four times the number of crossing links**.

Our two halves have two crossing links, giving energy <span class="math">2 × 4 = 8</span>. Alternating the signs in node-number order gives six crossing links and energy <span class="math">6 × 4 = 24</span>:

{% include visual-primer/spectral/figure-13.html %}

Both divisions have four nodes on each side, so lower energy also means a lower cut score here. If group sizes differ, energy alone is not enough to compare the cuts.

### The Laplacian computes the same energy

Chapter 2 gave us Lx: at each node, it adds that node's differences from its neighbours. Adding all the Lx entries would give zero, because each edge contributes opposite differences at its two ends.

Instead, **multiply each node's value by its own Lx result, then add**. This is the dot product <span class="math">x · (Lx)</span>, also written <span class="math">xᵀLx</span>—the input–output calculation from the [linear algebra primer]({{ '/Linear-Algebra-Visual-Primer/' | relative_url }}#quadratic).

Follow edge 3–5, which joins +1 to −1. Its contribution to the dot product comes from both ends:

- **At node 3:** <span class="math">(+1) × (+2) = 2</span>.
- **At node 5:** <span class="math">(−1) × (−2) = 2</span>.

Together, <span class="math">2 + 2 = 4</span> recovers the edge's squared difference. Edge 4–6 contributes another 4; all other edges contribute zero. The total is again **8**.

{% include visual-primer/spectral/figure-15.html %}

This works for any node values:

<div class="equation" role="math" aria-label="E of x equals x transpose L x, which equals the sum over edges of x i minus x j squared.">E(x) = xᵀLx = ∑<sub>edges {i, j}</sub> (xᵢ − xⱼ)²</div>

The ∑ means “add over all edges, counting each once.” The dot product and the squared differences give the same energy, which is always nonnegative.<sup class="fnref"><a href="#fn-5" id="fnref-5" data-fn="5" aria-expanded="false" aria-label="Footnote 5">[5]</a></sup>


### Let the node values change

We can now allow values such as 0.3 or −0.6 and adjust a pattern gradually. Energy then measures differences within groups too, rather than just counting crossing links.

Squaring makes large gaps costly: one gap of 3 contributes 9, while three gaps of 1 contribute only 3 in total. This gives us a reason to look for patterns whose values change gently across edges.

But simply shrinking every value also lowers energy. Chapter 5 shows how to keep the comparison fair before we begin that search.

<a id="fair" class="chapter-anchor"></a>

## 5. Compare node patterns at the same scale

<p class="chapter-tag">subtract the average, then rescale the values</p>

Our +1 and −1 pattern has energy 8. Halve every value and the energy falls to 2: each gap halves, so each squared gap becomes one quarter as large. The same nodes still form the same two groups. We have only made their labels smaller.

We could keep shrinking, or simply put zero everywhere and get zero energy. To learn something about the wiring, **we need to compare patterns at a fixed scale**. We prepare each pattern in two steps.

### Step 1: subtract the average

We care about differences between nodes. A level shared by all of them should not count toward the pattern's size.

Suppose four nodes hold 11 and four hold 9. Their average is 10. Subtract 10 from every value and we get four +1s and four −1s. Every gap stays the same, so the energy stays the same too.

This is called **centering**.<sup class="fnref"><a href="#fn-6" id="fnref-6" data-fn="6" aria-expanded="false" aria-label="Footnote 6">[6]</a></sup> The new average, or **mean**, is zero. The values add up to zero; this does not require equal numbers of positive and negative values.

### Step 2: make the squared values add up to 1

Once the average is zero, square each node value and add. We call this total the **squared spread**: it measures the total squared distance from the average.

Our eight values are +1 or −1, so their squares add to 8. Rearranging those values keeps that total unchanged, even when the energy changes:

{% include visual-primer/spectral/figure-16.html %}

We will give every pattern squared spread **1**. Any fixed positive total would work; 1 is convenient.<sup class="fnref"><a href="#fn-7" id="fnref-7" data-fn="7" aria-expanded="false" aria-label="Footnote 7">[7]</a></sup>

To make the total 1, divide every centered value by the square root of the squared spread. Here that means dividing by **√8**. Each square is then divided by 8:

<div class="equation" role="math" aria-label="Eight values, each with square one eighth, have a total squared spread of one.">8 × (1/√8)² = 8 × 1/8 = 1</div>

The values become about **+0.354 and −0.354**. The edge gaps are also divided by √8, so the energy is divided by 8: our two-halves pattern now has energy **1**, while the alternating pattern has energy **3**.

Now try the halved pattern. Its eight values are ±½, with squares adding to 2. Divide them by √2 and we get **exactly the same final values**, since <span class="math">(½)/√2 = 1/√8</span>. Its energy also becomes 1. Starting with smaller labels no longer improves the result.

### The two rules we will use from now on

<div class="equation" role="math" aria-label="The node values have mean zero, and their squares add up to one.">mean of the node values = 0<br>sum of their squared values = 1</div>

The second rule fixes the total; individual nodes can still have different values. An all-equal pattern becomes all zeros after centering, so it cannot meet that rule.

Every pattern with some differences can meet both rules. We can then look for the arrangement with the lowest energy.

<details markdown="1">
<summary>Optional: compare without rescaling every value</summary>

There is a shortcut: **divide energy by squared spread**. This gives the energy a pattern would have after centering and rescaling, as long as its squared spread is positive.

For the original pattern, that is 8/8 = 1. For the halved pattern, it is 2/2 = 1. The figure also shows why adding the same amount to every value leaves this ratio unchanged:

{% include visual-primer/spectral/figure-18.html %}

Using centered values x, the energy is <span class="math">xᵀLx</span> and the squared spread is <span class="math">xᵀx</span>. Their ratio is the **Rayleigh quotient**:

<div class="equation" role="math" aria-label="For our comparison, x has mean zero and is nonzero. R of x equals x transpose L x divided by x transpose x.">R(x) = <span class="frac"><span>xᵀLx</span><span>xᵀx</span></span><small>here, x contains the centered values and is nonzero</small></div>

The quotient is defined for any nonzero vector, but this comparison uses **centered** values. For the 9-and-11 pattern, subtract 10 before using xᵀx. That gives squared spread 8; squaring the original values would give 808 and include the shared level we wanted to remove.

</details>

Our starting candidate is the **hard split**: four values of about +0.354 and four of about −0.354, with energy 1. Chapter 6 will change those values while keeping the mean zero and squared spread 1.

<a id="adjust" class="chapter-anchor"></a>

## 6. Lower energy by adjusting node values

<p class="chapter-tag">balance differences within and between the groups</p>

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

## 7. Find the pattern with the lowest energy

<p class="chapter-tag">why the second eigenvector gives the minimum</p>

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

## 8. Use an eigenvector to divide the graph

<p class="chapter-tag">try thresholds and compare the resulting cuts</p>

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

## 9. Connect eigenvalues to cut scores

<p class="chapter-tag">how Cheeger's inequality bounds the best possible cut score</p>

Chapter 8 found a cut with two crossing edges and four nodes on each side, giving a score of **2/4 = 0.5**. Recall that **h(G)** is the lowest score among all cuts. We want to know how much lower an unseen cut could score.

Chapter 7 found the lowest **pattern energy**, λ₂ ≈ 0.764. Energy adds squared differences across edges; a cut score counts crossing edges and divides by the smaller group size. To connect the two measurements, we will turn a cut into a pattern.

### A cut can be turned into a pattern

Imagine someone hands us a proposed cut. Give every node on one side the same value, and every node on the other side a different value.

Every edge within a group joins equal values, so it contributes zero energy. **Only edges crossing between the groups contribute energy.**

We must still follow Chapter 7’s rules. Subtract the mean, then rescale the values so their squares add up to 1. The result is an allowed pattern, so its energy cannot be below λ₂.

After centering and rescaling, the pattern's energy can be written as two terms:

<div class="equation" role="math" aria-label="Rescaled pattern energy equals crossing edges divided by the number of nodes in the smaller group, plus crossing edges divided by the number of nodes in the larger group.">rescaled pattern energy<br>= <span class="frac"><span>crossing edges</span><span>nodes in smaller group</span></span><br>+ <span class="frac"><span>crossing edges</span><span>nodes in larger group</span></span></div>

The first term is the cut score. The second counts the same crossing edges but divides by the larger group size, so it cannot be greater than the first. **Adding the two terms gives at most twice the cut score.** The optional calculation below derives this energy formula.

For our two halves, the terms are equal: **2/4 + 2/4 = 1**. This is Chapter 6's hard-split energy. Its cut score is 0.5, and its energy is exactly twice that. With unequal group sizes, the second term is smaller, so the energy is less than twice the score.

Every cut therefore gives us an allowed pattern satisfying:

<div class="equation" role="math" aria-label="The energy of the allowed pattern made from a cut is at most twice that cut's score.">energy of the pattern made from a cut<br>≤ 2 × that cut’s score</div>

### Try an impossibly good cut

Suppose someone claims to have found a cut scoring **0.1**. Our construction would turn it into an allowed pattern with energy at most **0.2**.

But Chapter 7 proved that every allowed pattern has energy at least about **0.764**. The proposed cut would produce a pattern below that proven minimum. Therefore, that cut cannot exist.

The same argument applies to every cut. Since the pattern’s energy is at least λ₂ and at most twice the cut score, we get:

<div class="equation" role="math" aria-label="Every cut score is at least lambda two divided by two.">every cut score ≥ <span class="frac"><span>λ₂</span><span>2</span></span><small>for our graph, this lower limit is approximately 0.382</small></div>

This is the **lower bound**. It applies even to cuts we never examine. A sufficiently low-scoring cut would contradict the minimum energy we already know.

### How close is our cut to the best possible score?

Every cut scores at least about 0.382. We also have an actual cut scoring 0.5, so the best score cannot be above 0.5. Together, these facts give:

<div class="equation" role="math" aria-label="The best cut score is between lambda two divided by two and 0.5."><span class="frac"><span>λ₂</span><span>2</span></span> ≤ h(G) ≤ 0.5<small>the lower limit is about 0.382; the upper limit comes from our cut</small></div>

This answers our opening question: **no unseen cut can improve on 0.5 by more than about 0.118**. We obtained that guarantee without checking every cut.

### Does low energy also guarantee a low-scoring cut?

So far, we have gone from a cut to a pattern. The other direction asks: if λ₂ is small, must a low-scoring cut exist?

The answer is yes. The pattern's values may change gradually across the graph, so we use a threshold sweep to look for a cut, as in Chapter 8.

An edge crosses the cut only when the threshold lies between its two endpoint values. Low energy keeps the sum of squared gaps small, and a small gap leaves only a narrow interval of thresholds that separate that edge's endpoints.

That is the intuition. A full proof must also account for group sizes. It establishes that **at least one threshold cut has a score no greater than √(2dλ₂)**, where d is the number of links at each node. A smaller λ₂ makes this guarantee stronger.

### Cheeger’s inequality puts both directions together

For our kind of graph—undirected, with every node having the same degree d—the two guarantees can be written as:

<div class="equation" role="math" aria-label="Lambda two divided by two is at most h of G, which is at most the square root of two d lambda two."><span class="frac"><span>λ₂</span><span>2</span></span> ≤ h(G) ≤ √(2dλ₂)<small>h(G) is the lowest cut score; λ₂ comes from L = D − A</small></div>

This is a form of **Cheeger’s inequality**.<sup class="fnref"><a href="#fn-16" id="fnref-16" data-fn="16" aria-expanded="false" aria-label="Footnote 16">[16]</a></sup> Read its two sides separately:

- **The left side limits every cut.** No cut scores below λ₂/2.
- **The right side guarantees that a cut exists.** At least one cut scores no more than √(2dλ₂). Other cuts can score much higher.

Here d = 3. Using λ₂ ≈ 0.764, the theorem alone gives a range from about **0.382 to 2.141**. Our actual cut provides the tighter upper bound of **0.5**. The theorem's upper bound is a general guarantee; a cut we find can do much better.

### What establishes the exact answer?

Our range leaves open whether some cut scores between about 0.382 and 0.5. For this small graph, we can check all 127 distinct cuts. That check finds none below 0.5, establishing **h(G) = 0.5 exactly**.

{% include visual-primer/spectral/figure-27.html %}

<details markdown="1">
<summary>Optional: see how cuts and node values connect</summary>

The first panel starts with our cut into two halves. The +1 and −1 values already have mean zero; the panel shows how rescaling changes their energy from 8 to 1. The second panel starts with Fiedler values and shows which edges a threshold separates.

{% include visual-primer/spectral/figure-28.html %}

</details>

<details markdown="1">
<summary>Optional: derive the cut-pattern energy</summary>

Let the graph have n nodes. Suppose the smaller group contains s nodes, the other group contains n − s nodes, and b edges cross between them. The cut score is b/s.

Start with value 1 on the smaller group and 0 on the other group. The mean is s/n. Subtracting it gives value 1 − s/n on the smaller group and −s/n on the other. The mean is now zero, and every crossing edge still has a gap of 1.

The energy is therefore b. The total squared spread is the sum of s copies of (1 − s/n)² and n − s copies of (s/n)². This simplifies to s(n − s)/n. To find the energy after rescaling that spread to 1, divide energy by squared spread:

<div class="equation" role="math" aria-label="The rescaled pattern energy equals b n divided by s times n minus s, which equals b over s plus b over n minus s.">rescaled pattern energy<br>= <span class="frac"><span>bn</span><span>s(n − s)</span></span> = <span class="frac"><span>b</span><span>s</span></span> + <span class="frac"><span>b</span><span>n − s</span></span></div>

This is the two-term formula used above. Since s ≤ n − s, the second term is no greater than b/s, the cut score. Combining this with Chapter 7's minimum gives λ₂ ≤ rescaled pattern energy ≤ 2 × cut score.

</details>

A larger λ₂ raises the lower bound on every cut score. That makes it useful for network design: it can certify that no group has a very sparse connection to the rest. Chapter 10 explores how changing the wiring can improve that guarantee.

<a id="expansion" class="chapter-anchor"></a>

## 10. Keep networks well connected as they grow

<p class="chapter-tag">rewiring and expanders with a fixed number of links per router</p>

So far, we have searched a fixed graph for low-scoring cuts to find its bottlenecks. When designing a network, we want **even its lowest cut score to be high**. Every group containing up to half the nodes should have substantial connections to the rest, relative to its size.

The same change in perspective applies to λ₂. Within one graph, it is the lowest allowed pattern energy. When we change the wiring, a larger λ₂ raises the guaranteed lower bound on every cut score. We will compare two designs with the same number of links per router.

### Keep the hardware budget fixed

Our original graph has eight routers, three links per router, and twelve links in total. Its weakest cut has two crossing links for four nodes, giving h(G) = 0.5.

Connecting every router to every other would provide more ways out, but it would also require more ports and cables. A fair comparison keeps the number of routers and links fixed, and changes which routers are connected.

{% include visual-primer/spectral/figure-29.html %}

In the rewired graph, the highlighted group is **{1, 2, 5, 6}**. Four links leave it: 1–8, 2–3, 4–5 and 6–7. There are four nodes on each side, giving a cut score of **4/4 = 1**.

This cut shows that the rewired graph's minimum score is no greater than 1. We still need to rule out a weaker boundary elsewhere.

### How do we know another group is not hiding a weak boundary?

Improving one visible cut is not enough. We need a guarantee about every group. This is where Chapter 9’s lower bound becomes useful.

The rewired graph has **λ₂ = 2**. Therefore:

<div class="equation" role="math" aria-label="Every cut score is at least lambda two divided by two, which equals one for the rewired graph.">every cut score ≥ λ₂/2 = 1</div>

We have a cut scoring 1, and the eigenvalue proves that no cut scores below 1. Together, these establish **h(G) = 1**. The weakest cut score has doubled from 0.5 to 1, with twelve links in each design.

What does that guarantee mean for a group of routers? Take any group containing k nodes, up to half the network. Its crossing-edge count divided by k is at least 1, so **at least k links leave that group**.

For example, every group of four nodes has at least four outward links in total. Those links can be distributed unevenly among the group's nodes.

### Now ask whether the advantage survives as the network grows

A good eight-router design is useful, but real networks grow. We now keep the **number of links per router** fixed while increasing the number of routers. The total number of links grows with the network.

Could a large group's outward connections fail to keep up with its size?

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

We want every group containing up to half the nodes to retain a number of outward links proportional to its size, even as the network grows.

For example, suppose we guarantee at least half as many outward links as nodes in each such group. A group of 100 nodes would have at least 50 links out; a group of 1,000 would have at least 500. The same guarantee would hold for every graph in the growing sequence. In symbols, **h(G) ≥ 0.5** throughout.

An **expander family** is a sequence of increasingly large graphs with the same fixed degree and this kind of guarantee: h(G) stays above one fixed positive number.<sup class="fnref"><a href="#fn-17" id="fnref-17" data-fn="17" aria-expanded="false" aria-label="Footnote 17">[17]</a></sup> The number need not be 0.5. What matters is that it does not shrink toward zero as the graphs grow.

Chapter 9 gives us a way to establish that guarantee. If λ₂ stays above a fixed positive number, then h(G) ≥ λ₂/2 gives a fixed positive lower bound on every cut score. The optional section below explains the connection in both directions.

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

## 11. Compare adjacency and Laplacian eigenvalues

<p class="chapter-tag">translate between the two matrices and their gaps on a regular graph</p>

For our original graph, the second Laplacian eigenvalue is about 0.764. A paper using the adjacency matrix would instead report a second eigenvalue of about 2.236. Both numbers describe the same graph. We need to know which matrix a number belongs to before using it.

Because every node here has three neighbours, one subtraction translates between the two descriptions.

### Recall what the two matrices do

A adds up the neighbours' values. L takes three times the node's own value and subtracts that sum.

Every node here has degree three, so:

<div class="equation" role="math" aria-label="For every pattern x, L x equals three x minus A x.">Lx = 3x − Ax</div>

Both matrices receive the same input pattern x. Once we know one output, this equation gives the other.

### Try the flat pattern first

Give every node the value 1. A adds three neighbouring ones at every node, returning 3 everywhere. It multiplies the whole flat pattern by **3**.

L subtracts those neighbour sums from three times each node's own value: 3 − 3 = 0 everywhere. Its multiplier for the flat pattern is **0**.

Rescaling this flat pattern to the unit vector u₁ leaves its multipliers unchanged: 3 under A and 0 under L.

### Now try the winning pattern from Chapter 7

Chapter 7 found that L multiplies every entry of u₂ by about 0.764. Rearrange our rule to find what A does:

<div class="equation" role="math" aria-label="A applied to u two equals three u two minus L applied to u two, approximately three minus 0.764 times u two, or 2.236 times u two.">Au₂ = 3u₂ − Lu₂<br>≈ (3 − 0.764)u₂ = 2.236u₂</div>

A also leaves the pattern's proportions unchanged, multiplying every entry by about **2.236**. So u₂ is an eigenvector of both matrices, with a different eigenvalue for each.

Here are the first three patterns from Chapter 7 and their multipliers:

<div class="table-wrap" markdown="1">

| Input pattern | A multiplies it by | L multiplies it by |
| --- | --- | --- |
| Flat pattern u₁ | 3 | 0 |
| Winning pattern u₂ | ≈ 2.236 | ≈ 0.764 |
| Next pattern u₃ | 1 | 2 |

</div>

In every row, the two multipliers add up to three. The figure connects the paired values for these same three patterns:

{% include visual-primer/spectral/figure-31.html %}

### Which number is the spectral gap?

The adjacency value 2.236 is a multiplier. To get the **spectral gap** used here, subtract it from the largest adjacency eigenvalue, 3:

<div class="equation" role="math" aria-label="The adjacency spectral gap is approximately three minus 2.236, or 0.764. Its exact value is lambda two, equal to three minus the square root of five.">3 − 2.236 ≈ 0.764<small>the exact gap is λ₂ = 3 − √5</small></div>

For A, the gap runs from its largest eigenvalue down to its second largest. For L, it runs from zero up to λ₂. **Both gaps are about 0.764.**

### The same rule works at any fixed degree

If every node has degree d, then L = dI − A. Here I is the identity matrix, which returns its input unchanged. A pattern with adjacency multiplier α has Laplacian multiplier d − α.

We use **α** for an adjacency eigenvalue and **λ** for a Laplacian eigenvalue. List the adjacency values from largest to smallest. The largest is α₁ = d; the second largest is α₂. Subtracting each from d reverses that order, giving the Laplacian values from smallest to largest.

<div class="equation" role="math" aria-label="For a d-regular graph, d minus the second-largest adjacency eigenvalue equals the second-smallest Laplacian eigenvalue.">d − α₂ = λ₂<small>α₂: second-largest adjacency eigenvalue<br>λ₂: second-smallest Laplacian eigenvalue</small></div>

For the rewired graph in Chapter 10, d = 3 and λ₂ = 2. Its second adjacency eigenvalue is therefore **α₂ = 3 − 2 = 1**. At the same degree, a smaller α₂ gives a larger λ₂ and a stronger lower bound on every cut score.

When a paper reports an eigenvalue, identify the matrix and its scale first. For an adjacency eigenvalue on a regular graph, subtract from d before applying Chapter 9's Laplacian bounds. The optional sections cover other conventions you may encounter.

<details markdown="1">
<summary>Optional: why some papers divide the gap by the degree</summary>

L adds a node's differences from its d neighbours. Dividing by d turns that sum into an average. For a regular graph, the matrix L/d is called the **normalized Laplacian**. Here we are rescaling the matrix; the node pattern stays the same.

Dividing a matrix by d divides each eigenvalue by d. If we call the second normalized eigenvalue μ₂, then:

<div class="equation" role="math" aria-label="Mu two equals lambda two divided by d, which for this graph is approximately 0.764 divided by three, or 0.255.">μ₂ = λ₂/d ≈ 0.764/3 ≈ 0.255</div>

So 0.764 and 0.255 can both describe this graph's gap, on different scales. Check whether a reported gap has been divided by the degree before comparing numbers.

</details>

<details markdown="1">
<summary>Optional: conductance measures the fraction of connections leading out</summary>

Our group of four nodes has two links leading out. Its cut score is 2/4 = 0.5 outward links per node.

We can instead measure the fraction of the group's connections that lead outside. Count each end of a link attached to a node in the group. Four nodes with three connections each give **4 × 3 = 12 connection ends**.

Five links are internal, using two ends each: ten ends in total. The two crossing links use one end each inside the group. Only those two ends lead outside.

{% include visual-primer/spectral/figure-32.html %}

The outward fraction is **2/12 = 1/6**. For each cut, use the group with fewer connection ends. The lowest fraction across all cuts is the graph's **conductance**, written φ(G).

When every node has degree d, counting connection ends multiplies each group’s node count by d. So φ(G) = h(G)/d. In our graph, φ(G) = 0.5/3 = 1/6.

The change is in the denominator: h(G) counts outward links per node; φ(G) counts the fraction of connection ends leading out. Write μ₂ = λ₂/d for the normalized eigenvalue. Dividing Chapter 9's bounds by d gives:

<div class="equation" role="math" aria-label="Mu two divided by two is at most conductance, which is at most the square root of twice mu two.">μ₂/2 ≤ φ(G) ≤ √(2μ₂)</div>

We have changed both measurements to a scale relative to degree. The relationship between cuts and eigenvalues remains.

</details>

<details markdown="1">
<summary>Optional: what changes when nodes have different degrees?</summary>

L = D − A and the energy formula still hold. But there is no single degree d to subtract from every adjacency eigenvalue, so our simple translation no longer works.

For conductance, count a group’s connection ends by adding its node degrees. This sum is called its **volume**. A cut’s conductance is its crossing-edge count divided by the smaller of the two group volumes.

The matching pattern calculation gives each node weight equal to its degree. A node with six links counts twice as much as one with three. With dᵢ denoting node i's degree, the two constraints become:

<div class="equation" role="math" aria-label="The degree-weighted sum of node values is zero, and the degree-weighted sum of squared values is one.">∑ᵢ dᵢxᵢ = 0<br>∑ᵢ dᵢxᵢ² = 1</div>

The first removes the degree-weighted mean. The second fixes the degree-weighted squared spread. This calculation can be expressed using the **symmetric normalized Laplacian**:

<div class="equation" role="math" aria-label="The symmetric normalized Laplacian is D to the minus one half, times L, times D to the minus one half.">D<sup>−1/2</sup> L D<sup>−1/2</sup></div>

Assuming no isolated nodes, D<sup>−1/2</sup> is a diagonal matrix with entry 1/√dᵢ at node i. Multiplying on both sides scales the corresponding rows and columns. When all degrees equal d, the result is just L/d. [Spielman's text, §10.5](https://www.cs.yale.edu/homes/spielman/sagt/sagt.pdf#page=121) explains the change of coordinates behind this formula.

</details>

<details markdown="1">
<summary>Optional: what the name Ramanujan adds</summary>

The gap above uses only the second-largest adjacency eigenvalue. **Ramanujan** is a stronger spectral condition: for a connected d-regular graph, every nontrivial adjacency eigenvalue must have absolute value at most **2√(d − 1)**.<sup class="fnref"><a href="#fn-18" id="fnref-18" data-fn="18" aria-expanded="false" aria-label="Footnote 18">[18]</a></sup> Absolute value means ignoring the sign, so negative eigenvalues count too. Exclude the flat pattern's eigenvalue d; if the graph is bipartite, also exclude −d.

For degree three, the limit is **2√2 ≈ 2.828**. Our original graph's nontrivial adjacency values are √5, 1, four copies of −1, and −√5. Their absolute values all lie below that limit, so this small graph meets the condition. Its expansion is still h(G) = 0.5: the label does not mean that every cut has a high score at every size.

The limit is an important benchmark for large graphs at fixed degree. [Friedman's result](https://arxiv.org/abs/cs/0405020) allows an arbitrarily small positive amount above it, with probability tending to one as a random regular graph grows. That does not establish the exact Ramanujan condition for every sampled graph.

Chapter 12 returns to the practical goal: using well-connected graphs in a network.

</details>

<a id="rng" class="chapter-anchor"></a>

## 12. Apply graph theory to RNG's network design

<p class="chapter-tag">connect cut guarantees to capacity, cabling and routing</p>

**RNG** is a flat data-center network design that mixes planned and randomized router connections. Its use of expander graphs connects to Chapter 10's goal: keep groups well connected with limited links per router. [RNG §§1–2](https://arxiv.org/html/2604.15261v3#S1)

### What does a cut mean for traffic?

Our node values were a mathematical tool for finding weak cuts. To interpret a cut as capacity, give each link a transmission rate.

Suppose the two links between our example's halves each carry 100 Gb/s in each direction. Traffic leaving either half has at most **2 × 100 = 200 Gb/s** of boundary capacity available. Every route to the other half must cross that boundary.

Expansion measures how much boundary a group has relative to its size. A lower bound on h(G) therefore guarantees outward link capacity for every group of up to half the nodes, when links have equal capacity. The spectral gap helps establish that guarantee across the graph.

Boundary capacity sets a limit on outgoing traffic. The throughput actually achieved also depends on the routes used and the traffic sharing them.

### Random-like wiring has to fit real cabling

The graph records which routers connect. A physical installation must also get the fibres between those routers.

RNG calls its wiring *quasi-random*. Its **ShuffleBoxes** map fibre pairs through passive hardware. They connect fibres without forwarding packets, so a router-to-router connection through them remains one logical link. [RNG §6](https://arxiv.org/html/2604.15261v3#S6)

{% include visual-primer/spectral/figure-33.html %}

The authors report that their construction retains the spectral gap of unconstrained random graphs in their analysis. [RNG §6](https://arxiv.org/html/2604.15261v3#S6) The relevant test is whether a graph built under cabling constraints still has a strong spectral gap.

### A good graph still needs a routing method

The drawing below has two routes from a to b: through p or through q. If forwarding always chooses p, the links through q carry none of that traffic. Their presence in the graph alone does not make them useful.

{% include visual-primer/spectral/figure-34.html %}

RNG's routing scheme, **Spraypoint**, makes all source neighbours eligible first hops. Later forwarding rules guide traffic through selected intermediate routers called **waypoints** toward the destination. This spreads traffic across departures from the source and approaches to the destination. [RNG §5](https://arxiv.org/html/2604.15261v3#S5)

In that section of the paper, h counts eligible next hops after the first step; this primer's h(G) means edge expansion.

### What can we conclude from each result?

The spectral calculation answers a question about the wiring. To assess the complete network, we also need evidence about how traffic uses that wiring:

- **Spectral gap:** gives bounds on the graph's cut scores.
- **Routing analysis:** estimates what the routing method achieves under its graph and traffic assumptions.
- **Measurements:** show performance for the configurations and traffic that were tested.

RNG develops routing models and evaluates fabrics built under practical port and forwarding-memory limits. [RNG §7](https://arxiv.org/html/2604.15261v3#S7), [§9](https://arxiv.org/html/2604.15261v3#S9) Those results address questions beyond the cut guarantee.

{% include visual-primer/spectral/figure-35.html %}

We began with two links joining two groups of routers. Node values let us measure that weakness, eigenvectors found the lowest-energy pattern, and Cheeger's inequality connected its energy to cut scores. These tools help us assess the wiring. Cabling and routing turn that wiring into a working network.

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
9. Expansion bounds the links leaving every group of up to half the nodes, relative to its size. Our rewiring raised h(G) from 0.5 to 1 and λ₂ from about 0.764 to 2, with twelve links in each design. For a regular graph, an adjacency eigenvalue α corresponds to a Laplacian eigenvalue λ = d − α. The topology supplies possible routes; forwarding rules determine which carry traffic.

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
<li id="fn-17"><span class="fn-text">Early work by Leonid Bassalygo and Mark Pinsker connected expanders to sparse communication networks. In 1973, Pinsker used a probabilistic argument to show their existence, and Grigory Margulis gave the first explicit construction. See the survey by Hoory, Linial and Wigderson in Sources and further reading.</span> <a class="fn-back" href="#fnref-17" aria-label="Back to footnote 17 in the text">↩</a></li>
<li id="fn-18"><span class="fn-text">The name is a joke that stuck: the first explicit constructions, by Lubotzky, Phillips and Sarnak and independently by Margulis in 1988, relied on a conjecture of Ramanujan's about number theory. The graphs themselves have nothing to do with him.</span> <a class="fn-back" href="#fnref-18" aria-label="Back to footnote 18 in the text">↩</a></li>
</ol>
</section>

<footer class="credits">
<p>Illustrations inspired by <a href="https://xkcd.com/">xkcd</a>; fonts: <em>Humor Sans</em> by Michael Ciuffo and <em>Playpen Sans</em> by TypeTogether, licensed under the <a href="https://openfontlicense.org">SIL Open Font License 1.1</a>.</p>
</footer>

{% include visual-primer/spectral/graph-data.html %}
