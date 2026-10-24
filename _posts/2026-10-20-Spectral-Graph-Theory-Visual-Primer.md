---
layout: visual-primer
title: "Understanding Networks Through Spectral Graph Theory"
primer: spectral
---

> "When we try to pick out anything by itself, we find it hitched to everything else in the Universe." - John Muir

In a small network, we can often spot a bottleneck by looking at a drawing. With thousands of routers and links, that becomes much harder. Spectral graph theory helps us study how well different parts of a network connect by relating its structure to the eigenvalues of a matrix. AWS’s [RNG paper](https://arxiv.org/html/2604.15261v3) is a good read and a practical example: it uses the spectral gap to assess how well its network connects groups of routers. The subject has other uses, including finding clusters in data, but network design is the motivation here.

My aim is to explain the ideas intuitively, using a small network, pictures, and calculations we can follow. We’ll build toward understanding bottlenecks, cuts, and what eigenvalues tell us about connections across a network. This builds on [A Primer on Linear Algebra]({{ '/Linear-Algebra-Visual-Primer/' | relative_url }}), so I’d suggest starting there if vectors, matrices, and eigenvalues are unfamiliar or you’d like a refresher.

## 1. Find a bottleneck in a small network

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

Chapter 5 left us with the **hard split**: about +0.354 at nodes 1–4 and −0.354 at nodes 5–8, with energy 1. We will change the node values to see whether we can lower that energy. The wiring stays fixed.

### Which node values will we change?

Only the two crossing links, 3–5 and 4–6, join different values. All the starting energy comes from those two gaps.

Call their endpoints—nodes **3, 4, 5 and 6**—the **boundary nodes**. The other four are the **interior nodes**.

Bringing the boundary values toward zero reduces the gaps between the groups. It also creates gaps between boundary and interior nodes inside each group. We want the adjustment that gives the **lowest total energy** across all edges.

### Try the slider

The slider uses **t** to set each boundary value as a fraction of its group's interior value:

- **t = 1:** the values are equal, giving our starting hard split.
- **t = ½:** the boundary value is half the interior value.
- **t = 0:** the boundary value is zero.

The slider automatically rescales all eight values so their squares still add to 1. The matching positive and negative values keep the average at zero. For example, at t = ½, interior values are about ±0.447 and boundary values about ±0.224. **t specifies their ratio; the displayed numbers are the actual node values.**

Try t = ½, then t = 0, then **“Best slider setting.”** Watch how the energy inside the groups and between them adds up to the total.

{% include visual-primer/spectral/figure-19.html %}

### Why moving too far increases energy

These settings show the two contributions:

<div class="table-wrap" markdown="1">

| Boundary ratio t | Energy inside groups | Energy between groups | Total energy |
| --- | --- | --- | --- |
| 1: hard split | 0 | 1 | 1 |
| ½ | 0.4 | 0.4 | 0.8 |
| 0: boundary at zero | 2 | 0 | 2 |
| ≈ 0.618: best here | ≈ 0.211 | ≈ 0.553 | **≈ 0.764** |

</div>

At t = ½, the saving between the groups outweighs the new energy inside them. At t = 0, the boundary nodes all hold zero, but the interior values are ±0.5. Eight internal edges now have a gap of 0.5, contributing <span class="math">8 × 0.5² = 2</span>. Removing the crossing gaps has made the total worse.

The best balance occurs at **t ≈ 0.618**: boundary values about 62% as large as interior values. This gives the slider's lowest energy, about **0.764**.

### What the experiment tells us

At the best setting, nodes 1–4 are still positive and nodes 5–8 are still negative. Dividing by sign gives the same two groups and the same **cut score of 0.5**. The lower energy describes a smoother pattern on the unchanged graph.

The slider explores only a limited family of patterns. Within each half, the two boundary nodes share a value, as do the two interior nodes. The other half uses opposite signs. Other patterns could give all eight nodes different values.

Could one of those patterns have energy below 0.764? Chapter 7 will answer that question using eigenvectors.

<details markdown="1">
<summary>Optional: how the slider calculates the values and energy</summary>

Before rescaling, write the values in node-number order as <span class="math">(1, 1, t, t, −t, −t, −1, −1)</span>. Their squares add to <span class="math">4 + 4t²</span>. Following Chapter 5, divide every value by <span class="math">√(4 + 4t²)</span> to make that total 1.

For t = ½, the total before rescaling is <span class="math">4 + 4 × ¼ = 5</span>. Dividing by √5 gives the interior values ±0.447 and boundary values ±0.224, rounded:

{% include visual-primer/spectral/figure-20.html %}

Before rescaling, eight internal edges have gap 1 − t, and two crossing edges have gap 2t. Their squared gaps add to <span class="math">8(1 − t)² + 8t²</span>. The remaining edges, 1–2 and 7–8, have zero gap.

Chapter 5's shortcut gives the energy after rescaling: divide by the squared spread.

<div class="equation" role="math" aria-label="E of t equals eight times the square of one minus t plus eight times t squared, all divided by four plus four times t squared.">E(t) = <span class="frac"><span>8(1 − t)² + 8t²</span><span>4 + 4t²</span></span></div>

This formula reaches its minimum at <span class="math">t = (√5 − 1)/2 ≈ 0.618</span>, with energy <span class="math">3 − √5 ≈ 0.764</span>.

</details>

<a id="second" class="chapter-anchor"></a>

## 7. Find the pattern with the lowest energy

The slider found energy about **0.764**, but explored only a limited set of patterns. Could we do better by letting all eight node values vary independently?

We still require **mean zero** and **squared values adding to 1**. Energy is still the sum of squared differences across the edges.<sup class="fnref"><a href="#fn-8" id="fnref-8" data-fn="8" aria-expanded="false" aria-label="Footnote 8">[8]</a></sup> Eigenvectors will let us compare every pattern that follows these rules.

### What makes an eigenvector useful here?

An **eigenvector** is a special pattern: applying L multiplies every entry by the same number, called its **eigenvalue**.<sup class="fnref"><a href="#fn-9" id="fnref-9" data-fn="9" aria-expanded="false" aria-label="Footnote 9">[9]</a></sup> This is the idea from the [linear algebra primer]({{ '/Linear-Algebra-Visual-Primer/' | relative_url }}#eigenvectors), now with eight entries—one value per node.

Because our edges are undirected, L is symmetric. The spectral theorem lets us choose eight mutually perpendicular eigenvectors that can build **any pattern**: scale them, then add their matching node values.<sup class="fnref"><a href="#fn-10" id="fnref-10" data-fn="10" aria-expanded="false" aria-label="Footnote 10">[10]</a></sup> Here, perpendicular means their dot product is zero. It describes the lists of node values, rather than angles in the network drawing.

We give each eigenvector **unit length**, so its squared entries add to 1. We name them <span class="math">u₁, u₂, …, u₈</span>, ordered by their eigenvalues <span class="math">λ₁, λ₂, …, λ₈</span> from smallest to largest. A subscript identifies a whole pattern in this list, not a node.

The picture shows u₂. Applying L multiplies every value by <span class="math">λ₂ ≈ 0.764</span>:

{% include visual-primer/spectral/figure-22.html %}

Chapter 4 calculated energy as the dot product of the input and its output. For an eigenvector u, the output is λu. Since its squared entries add to 1:

<div class="equation" role="math" aria-label="For a unit eigenvector u, energy equals u dot lambda u, which equals lambda times u dot u, or lambda times one.">E(u) = u · (λu)<br>= λ(u · u) = λ × 1 = λ</div>

**A unit eigenvector's energy equals its eigenvalue.** These eigenvalues were calculated from L using a computer and are listed from smallest to largest:

<div class="table-wrap" markdown="1">

| Unit eigenvector | Eigenvalue and energy |
| --- | --- |
| u₁: every node has the same value | λ₁ = 0 |
| **u₂** | **λ₂ ≈ 0.764** |
| u₃ | λ₃ = 2 |
| u₄ through u₇ | 4 each |
| u₈ | λ₈ ≈ 5.236 |

</div>

Different eigenvectors can share an eigenvalue, as u₄ through u₇ do here.<sup class="fnref"><a href="#fn-11" id="fnref-11" data-fn="11" aria-expanded="false" aria-label="Footnote 11">[11]</a></sup>

### Why do we skip the first eigenvector?

The first eigenvector, u₁, is a **flat pattern**: every node has the same value. No edge sees a difference, so its energy is zero.

But our rules require both **mean zero** and **squared values adding to 1**. For a flat pattern to have mean zero, every value would have to be zero. Then their squares add to 0, not 1. **A flat pattern cannot meet both rules.**

The other seven eigenvectors are perpendicular to the flat pattern, which means their positive and negative entries balance: they add up to zero. Scaling or combining these patterns keeps the mean at zero.

Adding any nonzero amount of u₁ would shift every node's value by the same amount, making the mean positive or negative. **So our allowed patterns use only u₂ through u₈.**

### Could mixing patterns lower the energy further?

No. A mixture's energy is a **weighted average** of the eigenvalues. However we choose the proportions, giving any weight to an eigenvalue above λ₂ raises the average above λ₂. **The minimum comes from putting all the weight on the smallest available eigenvalue.** For our graph, that means using only u₂.

Here is how that average appears in one mixture:

<div class="equation" role="math" aria-label="x equals 0.6 times u two plus 0.8 times u three.">x = 0.6u₂ + 0.8u₃</div>

The **coefficients** 0.6 and 0.8 multiply whole patterns. Because the patterns are perpendicular and have unit length, the mixture's squared spread is <span class="math">0.6² + 0.8² = 0.36 + 0.64 = 1</span>. Its mean is also zero, so it meets both rules.

Their energy contributions add too. L only rescales each eigenvector, and in the dot product <span class="math">x · Lx</span>, terms pairing u₂ with u₃ are zero because the two are perpendicular. Each remaining term is the eigenvalue times the square of its coefficient:

<div class="equation" role="math" aria-label="The energy of x is approximately 0.36 times 0.764 plus 0.64 times 2, which is approximately 1.555.">E(x) ≈ 0.36 × 0.764 + 0.64 × 2<br>≈ 1.555</div>

Here, the weights are 36% at energy about 0.764 and 64% at energy 2. Sharing the weight with the higher-energy pattern raises the result to about 1.555.

Every allowed mixture follows this rule: the **squared coefficients are the weights**. They cannot be negative and add to 1, so they describe proportions of the total.

### What does this tell us about the slider?

No allowed pattern can have energy below λ₂, and u₂ itself meets our rules and reaches it. We have found the minimum:

<div class="equation" role="math" aria-label="Lambda two equals three minus the square root of five, approximately 0.764.">λ₂ = 3 − √5 ≈ 0.764<small>the lowest energy of any mean-zero pattern with total squared spread 1</small></div>

The pattern **u₂** is the slider's winning pattern from Chapter 6, at t ≈ 0.618.<sup class="fnref"><a href="#fn-12" id="fnref-12" data-fn="12" aria-expanded="false" aria-label="Footnote 12">[12]</a></sup> The slider succeeded because its limited set of patterns included u₂. The eigenvector argument shows that letting all eight values vary independently cannot improve on it.

An eigenvector for λ₂ is called a **Fiedler vector**, and λ₂ is called the graph’s **algebraic connectivity**.<sup class="fnref"><a href="#fn-13" id="fnref-13" data-fn="13" aria-expanded="false" aria-label="Footnote 13">[13]</a></sup> Reversing every sign gives an equally good pattern, since squared differences do not change.

<details markdown="1">
<summary>Optional: what if the graph is disconnected?</summary>

On our connected graph, zero energy would require equal values at both ends of every edge. Following the links makes all eight values equal. Our rules exclude that flat pattern, so λ₂ is positive.

Now remove the two crossing links. Put +1/√8 on the four nodes in one half and −1/√8 on the other four. The mean is zero and the squares add to 1, but every remaining edge joins equal values. We have an allowed pattern with **zero energy**, so **λ₂ = 0**.<sup class="fnref"><a href="#fn-14" id="fnref-14" data-fn="14" aria-expanded="false" aria-label="Footnote 14">[14]</a></sup>

{% include visual-primer/spectral/figure-23.html %}

</details>

The entries of u₂ give the node values that minimize energy. Chapter 8 turns those values into candidate divisions and checks their cut scores. **Finding the lowest-energy pattern and finding the best cut are separate steps.**

<a id="cut" class="chapter-anchor"></a>

## 8. Use an eigenvector to divide the graph

Chapter 7 found that **λ₂ ≈ 0.764** is the minimum energy under our two comparison rules. The corresponding **unit eigenvector u₂** contains the node values that achieve that energy, one entry per node.

We will use those values to propose two groups: **put the nodes in order, try a dividing line in each gap, and compare the resulting cut scores**.

### Put the nodes in order

The Fiedler pattern minimizes energy, so it tends to keep connected nodes close in value. Sorting by these values gives us a useful place to look for a division:

<div class="table-wrap" markdown="1">

| Nodes, in increasing value order | Value at each node |
| --- | --- |
| 7 and 8 | −0.425 |
| 5 and 6 | −0.263 |
| 3 and 4 | +0.263 |
| 1 and 2 | +0.425 |

</div>

The values are rounded here. In this graph, the two nodes in each pair have exactly equal values.

Place a dividing line between two values. Its position is the **threshold**: nodes with smaller values go into one group, and the rest go into the other. On the number line below, the smaller values are to the left of the divider. Moving the line changes the groups while the wiring and node values stay fixed.

{% include visual-primer/spectral/figure-36.html %}

The exact number is unimportant: **any threshold in the same gap gives the same cut**. For example, −0.34 and −0.35 both lie between −0.425 and −0.263 and select the same nodes.

Four distinct values leave **three gaps**, so we have three candidate cuts. Nodes with equal values stay together. A line outside all the values would leave one group empty, which is not a valid cut.

Trying the gaps in order and comparing the cut scores is called a **sweep**.<sup class="fnref"><a href="#fn-15" id="fnref-15" data-fn="15" aria-expanded="false" aria-label="Footnote 15">[15]</a></sup>

### Try the three dividing lines

Start at **−0.34**. Only nodes 7 and 8 have values below it, so one group is **{7, 8}** and the other contains nodes 1–6.

Four edges leave {7, 8}: 5–7, 5–8, 6–7 and 6–8. The smaller group has two nodes, so:

<div class="equation" role="math" aria-label="The first cut has four crossing edges divided by two nodes on the smaller side, giving score two.">cut score = <span class="frac"><span>4</span><span>2</span></span> = 2</div>

Now move the line to **0**. Nodes 5 and 6 join the selected group, making it **{5, 6, 7, 8}**.

The four edges we just counted are now inside the group. Only edges 3–5 and 4–6 cross the cut. With two crossing edges and four nodes on each side, the score improves to **2/4 = 0.5**:

{% include visual-primer/spectral/figure-24.html %}

Finally, move the line to **+0.34**. The selected group becomes **{3, 4, 5, 6, 7, 8}**, leaving {1, 2} on the other side. Four edges cross. Although six nodes are selected, the **smaller group has two**, so the score is **4/2 = 2**.

<div class="table-wrap" markdown="1">

| Example threshold | Nodes below it | Cut score |
| --- | --- | --- |
| −0.34 | {7, 8} | 4 ÷ 2 = 2 |
| **0** | **{5, 6, 7, 8}** | **2 ÷ 4 = 0.5** |
| +0.34 | {3, 4, 5, 6, 7, 8} | 4 ÷ 2 = 2 |

</div>

### What did we find?

The middle gap gives the lowest score **among these three cuts: 0.5**.

That does not contradict Chapter 7's minimum energy of about 0.764. **Energy and cut score measure different things:** energy adds squared differences between connected node values; the cut score counts crossing edges and divides by the smaller group size.

We have checked only the cuts from this ordering, so we have not proved that no other cut could do better. Chapter 9 uses λ₂ to limit how much better an unseen cut could be.

<a id="cheeger" class="chapter-anchor"></a>

## 9. How close is our cut to the best possible?

Chapter 8 found a cut with score **0.5**, but we checked only three candidates. Could another cut score much lower? The eigenvalue λ₂ helps us answer that without checking every cut. Recall that **h(G)** means the lowest score among all cuts.

### Turn a cut into a pattern

Chapter 7 showed that **λ₂ is the lowest possible energy among patterns with mean zero and squared values adding to 1**. Every pattern meeting those two rules has energy at least λ₂.

For our particular graph, **λ₂ ≈ 0.764**.

To use this minimum to reason about cut scores, we first turn a proposed cut into a pattern that follows those two rules.

Start with the cut we found: **four nodes on each side, with two crossing edges**.

As in our earlier examples, give one side value **+1** and the other value **−1**. With four nodes on each side, the mean is already zero.

The eight squared values add to **4 × (+1)² + 4 × (−1)² = 8**. To make that total 1, divide every value by √8. The new values are **+1/√8 and −1/√8**. Each square is now 1/8, and eight copies add to 1.

Now calculate the energy. Recall that **Chapter 4 defined energy as the sum of squared differences across edges**. An edge inside a group joins equal values, so its difference is zero and it contributes zero energy.

A crossing edge joins +1/√8 to −1/√8, giving a **difference of 2/√8**. To calculate its **energy contribution, we square that difference**:

<div class="equation" role="math" aria-label="Energy per crossing edge equals the difference squared: the square of two divided by the square root of eight, which is four eighths, or one half.">energy per crossing edge<br>= (difference)²<br>= (2/√8)² = 4/8 = 1/2</div>

There are two crossing edges, each contributing 1/2. The total energy is **2 × 1/2 = 1**, matching Chapter 6's hard-split energy. The cut score is **2/4 = 0.5**.

For any cut, call the smaller group size **s**, the larger group size **t**, and the number of crossing edges **b**.

After centering and rescaling, the squared difference across **one crossing edge** is **1/s + 1/t**. This is its energy contribution. In our example, that gives **1/4 + 1/4 = 1/2 per crossing edge**, matching the calculation above.

All **b crossing edges** connect the same two group values, so each contributes that same amount. To get the **total energy**, multiply the energy per edge by b:

<div class="equation" role="math" aria-label="Total pattern energy equals b times the sum of one over s and one over t, which equals b over s plus b over t.">total pattern energy<br>= b(1/s + 1/t)<br>= <span class="frac"><span>b</span><span>s</span></span> + <span class="frac"><span>b</span><span>t</span></span></div>

**Each crossing edge is counted once.** The two fractions appear when we expand the multiplication; we are still adding the edges' energy contributions.

The first fraction, **b/s**, is the cut score because s is the smaller group size. The second divides the same edge count by t, which is at least as large, so **b/t ≤ b/s**. That is why **the pattern's energy is at most twice the cut score**. Equal-sized groups give exactly twice, as in our example.

### Rule out scores that are too low

Every cut can be turned into a pattern that follows our two rules: mean zero and squared values adding to 1. Its energy must then satisfy **both** of these limits:

- It is **at least λ₂**, the lowest possible energy.
- It is **at most twice the cut score**, as we just showed.

For our graph, **λ₂ ≈ 0.764**. Suppose a cut had a score of **0.1**. Its pattern would need an energy of at least λ₂, about **0.764**, but at most **2 × 0.1 = 0.2**. Both conditions cannot hold, so that cut cannot exist.

The same reasoning applies to every cut. **Twice its score must be at least λ₂.** Dividing by two gives:

<div class="equation" role="math" aria-label="Every cut score is at least lambda two divided by two.">every cut score ≥ <span class="frac"><span>λ₂</span><span>2</span></span></div>

For our graph, **λ₂/2 ≈ 0.382**. This is a **lower bound**: no cut can score below that limit, even one we have not examined.

### Narrow down the lowest cut score

We now know two things:

- **Every cut scores at least λ₂/2**, which is about 0.382 for our graph.
- **We found a cut scoring 0.5**, so the lowest score must be 0.5 or less.

Since **h(G) is the lowest score among all cuts**, these facts give:

<div class="equation" role="math" aria-label="The lowest cut score h of G is between lambda two divided by two and 0.5."><span class="frac"><span>λ₂</span><span>2</span></span> ≤ h(G) ≤ 0.5</div>

The lowest score therefore lies between **about 0.382 and 0.5**. Another cut might improve on 0.5, but it cannot go below λ₂/2. We have narrowed down the answer without checking every cut.

### Cheeger's inequality gives both limits

Eigenvalues also give an upper bound, even before we find a cut. For an undirected graph with exactly d links at every node, **Cheeger's inequality** gives:<sup class="fnref"><a href="#fn-16" id="fnref-16" data-fn="16" aria-expanded="false" aria-label="Footnote 16">[16]</a></sup>

<div class="equation" role="math" aria-label="Lambda two divided by two is at most h of G, which is at most the square root of two d lambda two."><span class="frac"><span>λ₂</span><span>2</span></span> ≤ h(G) ≤ √(2dλ₂)<small>λ₂ comes from L = D − A</small></div>

- **Left:** every cut scores at least λ₂/2.
- **Right:** at least one cut scores no more than √(2dλ₂).

Here d = 3, so the theorem's upper bound is about **2.141**. Our actual cut gives a much tighter upper bound of **0.5**. The theorem provides a guarantee; finding a cut can improve it.

### Check the exact answer for our small graph

The bounds still leave room for a score below 0.5. For our eight-node graph, a computer can check all **127 distinct cuts**. That check finds none below 0.5, establishing **h(G) = 0.5 exactly**.

{% include visual-primer/spectral/figure-27.html %}

A larger λ₂ raises the guaranteed minimum cut score, ruling out groups with too few links to the rest relative to their size. Chapter 10 uses this guarantee to compare network designs.

<a id="expansion" class="chapter-anchor"></a>

## 10. Keep networks well connected as they grow

So far, a low cut score has helped us find a network's bottleneck. When designing a network, we want to make that weakest connection stronger: **raise h(G), the lowest cut score**.

We will first improve our eight-router graph by changing the wiring, then ask how to keep larger networks well connected without adding more links at each router.

### Improve the wiring without adding links

Both designs below have **eight routers, three links per router and twelve links in total**. Only the connections change. In the original graph, two links connect the halves, giving h(G) = 2/4 = 0.5.

{% include visual-primer/spectral/figure-29.html %}

In the rewired graph, four links leave the highlighted group **{1, 2, 5, 6}**: 1–8, 2–3, 4–5 and 6–7. With four nodes on each side, this cut scores **4/4 = 1**.

Could another cut score lower? Computing the new graph's Laplacian eigenvalues gives **λ₂ = 2**. Chapter 9's rule then tells us:

<div class="equation" role="math" aria-label="Every cut score is at least lambda two divided by two, which equals one for the rewired graph.">every cut score ≥ λ₂/2 = 1</div>

We found a cut scoring 1, and no cut can score below 1. So **h(G) = 1**: the lowest cut score has doubled, using the same number of links.

This means **any group of k nodes, up to half the network, has at least k links to the rest**. For example, every group of four routers has at least four links out **in total**. Some routers in that group may have no outward link; others may have several.

### What happens as the network grows?

Improving one small graph does not tell us how larger designs will behave. As we add routers, we will keep the **number of links per router fixed**. The total number of links still grows with the network.

A ring shows what can go wrong. Each router has two neighbours. But take a consecutive half of the ring: **only two links connect it to the other half**, however large the ring becomes.

{% include visual-primer/spectral/figure-30.html %}

More routers must share the same two links out, so the cut score falls. A fixed number of neighbours per router is not enough to prevent a bottleneck.

### Keep the same guarantee at every size

We want larger groups to have proportionally more links out. For example, suppose **every group containing up to half the nodes has at least half as many outward links as nodes**:

- A group of 100 nodes has at least 50 links out.
- A group of 1,000 nodes has at least 500 links out.

That is the guarantee **h(G) ≥ 0.5**. It must hold for every such group, at every network size.

An **expander family** is a sequence of larger and larger graphs with a fixed number of links per node and one positive lower bound on h(G) that works for the whole sequence.<sup class="fnref"><a href="#fn-17" id="fnref-17" data-fn="17" aria-expanded="false" aria-label="Footnote 17">[17]</a></sup> The bound need not be 0.5. The actual h(G) can change from one graph to the next; what matters is that it never drops below the same positive minimum.

Eigenvalues give us a way to prove this. For example, if every graph has **λ₂ ≥ 1**, Chapter 9 guarantees **h(G) ≥ 0.5** for all of them.

### Examples with three links per router

**Random regular graphs** choose the wiring randomly while giving every router the same number of links. We could keep that number at three as the network grows. For large networks, a uniformly sampled graph is very likely to have h(G) above a fixed positive minimum that does not depend on network size. The probability approaches 1 as the networks grow; an individual sample can still fail that guarantee. [Friedman's result](https://arxiv.org/abs/cs/0405020)

**Ramanujan families** use a construction with a proven eigenvalue bound. There are families where we can keep doubling the number of routers, with three links per router throughout, while preserving that bound. It guarantees a positive minimum cut score that works at every step. [Marcus, Spielman and Srivastava](https://arxiv.org/abs/1304.4132)

Here are 12-router and 24-router examples of both approaches:

{% include visual-primer/spectral/figure-37.html %}

### What does this give a network?

If all links have the same capacity, more links out mean more total capacity connecting a group to the rest. Expansion guarantees a minimum amount relative to the group's size.

Routing and traffic still determine how well that capacity is used. Next, we will see how papers express the same eigenvalue information using the adjacency matrix.

<details markdown="1">
<summary>Optional: two ways to check that growing networks stay well connected</summary>

Earlier, we used λ₂ to guarantee a minimum cut score. Cheeger's inequality also works in reverse: a guaranteed minimum cut score puts a lower limit on λ₂.

For example, suppose every router has three links, even as we build larger networks:

- **From λ₂ to cut scores:** If every network has λ₂ ≥ 1, then every network has h(G) ≥ 0.5. Every group containing up to half the nodes therefore has at least half as many outward links as nodes.
- **From cut scores to λ₂:** If every network has h(G) ≥ 0.5, then Cheeger's inequality gives λ₂ ≥ 0.5²/(2 × 3) = 1/24.

These are lower limits, not the exact values. The limits differ, but neither shrinks as we add routers.

So, with the number of links per router fixed, we can use either λ₂ or h(G) to prove that the networks stay well connected as they grow. Keeping a value above one fixed positive minimum is what **bounded away from zero** means.

</details>

<a id="gap" class="chapter-anchor"></a>

## 11. Compare adjacency and Laplacian eigenvalues

Chapters 9 and 10 gave us a useful rule: **every cut scores at least λ₂/2**, where λ₂ is the second-smallest eigenvalue of the Laplacian L. A paper may instead report eigenvalues of the adjacency matrix A. How can we use those numbers to say something about bottlenecks?

### Turn an adjacency eigenvalue into a cut guarantee

For our original graph, the **second-largest adjacency eigenvalue is about 2.236**. Every router has three neighbours. Subtract the reported value from three to get λ₂:

<div class="equation" role="math" aria-label="Lambda two is approximately three minus 2.236, which is approximately 0.764.">λ₂ ≈ 3 − 2.236 ≈ 0.764</div>

Now apply the cut rule we already know:

<div class="equation" role="math" aria-label="Every cut score is at least lambda two divided by two, approximately 0.382.">every cut score ≥ λ₂/2 ≈ 0.382</div>

This recovers Chapter 9's guarantee from an adjacency eigenvalue. The conversion is what lets us use the paper's number in our cut calculation.

### Why does subtraction work?

Follow **node 1**, whose neighbours are **nodes 2, 3 and 4**. In Chapter 7, the value assigned to node 1 was about **0.425**. To make the arithmetic easier, divide every node's value by that original value. Node 1's value becomes **1**, because we divide it by itself. All the other values change in the same proportion; for example, node 3's value goes from about **0.263** to about **0.618**. The resulting vector is x below.

**Row 1 of each matrix computes the output for node 1.** In the figure, match each entry across the highlighted row with the entry in the same position down x, multiply the pair, then add the results. Columns 2, 3 and 4 pick out the neighbours' values: **1, about 0.618 and about 0.618**.

{% include visual-primer/spectral/figure-38.html %}

In both matrices, row 1 has zeros in columns 5–8: those nodes are not neighbours of node 1, so their values contribute nothing to this calculation.

The values L subtracts are exactly the ones A adds. That is why **L's output = three times the node's input − A's output**. Here, this is about **3 × 1 − 2.236 = 0.764**.

For the input vector x shown above, **A's output at every node is about 2.236 times that node's input value**. All eight entries change by the same multiplier, so A returns a resized copy of x. This is what it means for x to be an **eigenvector of A**, with an **eigenvalue of about 2.236**.

Every node has three neighbours, so L starts with **three times the node's input value** and subtracts A's output. It subtracts about **2.236 times that value** from **3 times that value**, leaving about **0.764 times that value**.

This multiplier also applies at every node, so L returns a resized copy of x too. That makes x an **eigenvector of L**, with an **eigenvalue of about 0.764**:

<div class="equation" role="math" aria-label="For this eigenvector x, A x is approximately 2.236 x, and L x equals 3 x minus A x, approximately 0.764 x.">Ax ≈ 2.236x<br>Lx = 3x − Ax ≈ 0.764x</div>

### Why does the second-largest become the second-smallest?

For our eight-node graph, **A's eight eigenvalues, from largest to smallest**, are listed below. The decimals are rounded:

**3, 2.236, 1, −1, −1, −1, −1, −2.236**

Every node has three neighbours, so we get the corresponding L eigenvalues by **subtracting each of these numbers from 3**:

- **3 − 3 = 0**
- **3 − 2.236 ≈ 0.764**
- **3 − 1 = 2**
- **3 − (−1) = 4**. There are four −1s in A's list, so this gives four 4s in L's list.
- **3 − (−2.236) ≈ 5.236**

Reading the results in the same order gives **L's eight eigenvalues, from smallest to largest**:

**0, 0.764, 2, 4, 4, 4, 4, 5.236**

A's list goes down while L's list goes up: subtracting a smaller number from 3 leaves a larger result. In particular, **A's second-largest value, about 2.236, gives L's second-smallest value, λ₂ ≈ 0.764**.

The distance between A's largest and second-largest eigenvalues is called the **spectral gap** here. We just found that this distance becomes L's second-smallest eigenvalue, λ₂. Since L's smallest eigenvalue is zero, the gap between L's first two eigenvalues is also λ₂:

{% include visual-primer/spectral/figure-31.html %}

This is the λ₂ we need for the cut guarantee: **every cut scores at least half this gap**.

### Compare the two network designs

Both designs have **eight routers and twelve links**, with **three links per router**. We changed which routers connect. We can now use their adjacency eigenvalues to compare the cut scores each design guarantees.

The figure shows both topologies and all eight eigenvalues of A and L for each one. The highlighted entries are **A's second-largest eigenvalue** and **L's second-smallest eigenvalue, λ₂**.

{% include visual-primer/spectral/figure-39.html %}

Read the highlighted value in each A list: about **2.236 for the original graph** and **1 for the rewired graph**. Starting with those numbers, follow the same two steps for each design:

<div class="table-wrap" markdown="1">

| Calculation | Original | Rewired |
| --- | --- | --- |
| Start with A's second-largest eigenvalue | ≈2.236 | 1 |
| Subtract from 3 to find λ₂ | 3 − 2.236 ≈ 0.764 | 3 − 1 = 2 |
| Divide λ₂ by 2 to get the cut-score lower bound | 0.764 ÷ 2 ≈ 0.382 | 2 ÷ 2 = 1 |

</div>

The original graph guarantees **every cut scores at least about 0.382**. The rewired graph gives a stronger guarantee: **every cut scores at least 1**.

Recall that a cut's score is its crossing links divided by the number of routers in the smaller group. A score of at least 1 therefore means **at least as many crossing links as routers in that group**. In the rewired graph, every group of four routers must have at least four links to the other four. Our original graph had a group of four with only two links out.

These bounds tell us a score that no cut can fall below. Our earlier checks found the actual minimum scores: **0.5 for the original graph** and **1 for the rewired graph**. The original bound of about 0.382 leaves some room below its actual minimum; the rewired bound reaches its minimum exactly.

The improvement comes from changing the connections while keeping the same number of links. With three neighbours per node in both designs, **lowering A's second-largest eigenvalue raises λ₂ and the guaranteed cut score**.

The number 3 in our subtraction came from the number of neighbours per node. For a graph with **d neighbours at every node**, replace 3 with d. Call A's second-largest eigenvalue **α₂**; this is the number that was about 2.236 or 1 in our examples. The same two steps become:

<div class="equation" role="math" aria-label="Lambda two equals d minus alpha two. Every cut score is at least d minus alpha two divided by two.">λ₂ = d − α₂<br>every cut score ≥ (d − α₂)/2</div>

Here A and L = D − A are the same adjacency and Laplacian matrices used throughout the primer.

We can now turn an adjacency eigenvalue into a cut guarantee. Chapter 12 brings the ideas together and explains what they tell us about a network's weakest connections.

<a id="rng" class="chapter-anchor"></a>
<a id="recap-title"></a>
<a id="conclusion"></a>

## 12. What we learned about network strength

We began with eight routers and twelve links. Every router had three neighbours, yet only two links connected the two halves. Counting links at individual routers missed the weakness between whole groups.

The primer gave us a way to describe that weakness, search for it, and put limits on how weak any division could be.

### How the ideas fit together

1. **The graph records the connections.** Nodes represent routers and edges represent links. A records which nodes are neighbours, D records their degrees, and L = D − A compares each node's assigned value with its neighbours' values.

2. **A cut measures how well a group connects to the rest.** Its score is the number of crossing links divided by the size of the smaller group. The lowest score over all cuts is h(G), the graph's edge expansion. It describes the weakest division relative to group size.

3. **Node values let us search beyond fixed groups.** We measure a pattern's energy by adding the squared differences across edges: E(x) = xᵀLx. We center the values and make their squares add to 1 so that shrinking the numbers cannot improve the comparison. For a centered, nonzero pattern, the Rayleigh quotient makes this same comparison by dividing its energy by the sum of its squared values.

4. **Eigenvectors identify useful patterns.** Each is a pattern that L only multiplies by a number, its eigenvalue. Because L is symmetric, we can split patterns into perpendicular eigenvector pieces. For our connected graph, the lowest energy among the centered, unit-length patterns is λ₂, reached by the Fiedler vector u₂. Its entries give one value per node. Sorting those values and trying dividing lines between them produces candidate cuts, which we score using the actual links.

5. **Eigenvalues give guarantees about cuts we have not checked.** Cheeger's inequality connects λ₂ to h(G); in particular, every cut scores at least λ₂/2. Any cut we find also gives an upper bound on h(G), because the minimum cannot exceed that cut's score. When every node has d neighbours, we can obtain λ₂ from A's second-largest eigenvalue α₂ using λ₂ = d − α₂.

### What a stronger network means

Here, strength means **every group of up to half the routers has enough links to the rest of the network relative to its size**. Raising h(G) improves the weakest division. A larger λ₂ gives a higher guaranteed minimum cut score.

Our two designs showed the difference:

<div class="table-wrap" markdown="1">

| Measurement | Original | Rewired |
| --- | --- | --- |
| λ₂ | ≈0.764 | 2 |
| Guaranteed lower bound, λ₂/2 | ≈0.382 | 1 |
| Actual minimum cut score, h(G) | 0.5 | 1 |

</div>

The original graph's weakest cut had two crossing links for a group of four routers. In the rewired graph, **every group of four has at least four links out**. We doubled the minimum cut score while keeping the same eight routers, twelve links and three links per router.

The table also separates a guarantee from an exact answer. For the original graph, the eigenvalue bound rules out scores below about 0.382; checking all cuts established the actual minimum of 0.5. For the rewired graph, the bound of 1 and a cut scoring 1 agree, establishing its minimum exactly.

### Keep groups well connected as the network grows

An expander family keeps the number of links per router fixed while maintaining one positive lower bound on h(G) across all its graphs. For any group of up to half the routers, the guaranteed number of outward links grows in proportion to its size. The connection between groups keeps pace with their size.

We can now use node values and eigenvalues to find bottlenecks, bound the scores of unseen cuts, and compare how well different graphs connect their groups.

## Sources and further reading

1. [Daniel Spielman, *Spectral and Algebraic Graph Theory*](https://www.cs.yale.edu/homes/spielman/sagt/sagt.pdf). A fuller development of Laplacians, the minimum argument, and graph partitioning.
2. [Hoory, Linial and Wigderson, *Expander Graphs and Their Applications*](https://www.math.ias.edu/~avi/BOOKS/expanderbookr1.pdf). Expansion, spectral bounds, and the equal-degree form of Cheeger's inequality used here.
3. [Joel Friedman, *A Proof of Alon's Second Eigenvalue Conjecture and Related Problems*](https://arxiv.org/abs/cs/0405020). The near-Ramanujan behaviour of random regular graphs.
4. <a href="{{ '/Linear-Algebra-Visual-Primer/' | relative_url }}">A Primer on Linear Algebra.</a> Dot products, projection, eigenvectors, and the Rayleigh quotient, using a running example with one vector and one 2 × 2 matrix.

<section class="footnotes" aria-labelledby="footnotes-title">
<h2 id="footnotes-title">Footnotes</h2>
<ol>
<li id="fn-1"><span class="fn-text">Nothing to do with charts. The word was borrowed in 1878 by J. J. Sylvester, who was drawing molecules as dots and lines and wanted a name for the drawings.</span> <a class="fn-back" href="#fnref-1" aria-label="Back to footnote 1 in the text">↩</a></li>
<li id="fn-2"><span class="fn-text">Named after Laplace because it is the wiring-diagram cousin of his operator from physics, which also measures how far a value sits from the average of its surroundings. Books that want to be precise call this one the <em>combinatorial</em> Laplacian.</span> <a class="fn-back" href="#fnref-2" aria-label="Back to footnote 2 in the text">↩</a></li>
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
</ol>
</section>

<footer class="credits">
<p>Illustrations inspired by <a href="https://xkcd.com/">xkcd</a>; fonts: <em>Humor Sans</em> by Michael Ciuffo and <em>Playpen Sans</em> by TypeTogether, licensed under the <a href="https://openfontlicense.org">SIL Open Font License 1.1</a>.</p>
</footer>

{% include visual-primer/spectral/graph-data.html %}
