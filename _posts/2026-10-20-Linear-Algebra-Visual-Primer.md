---
layout: visual-primer
title: "A Primer on Linear Algebra"
primer: linear
---

> "It is by logic that we prove, but by intuition that we discover." - Henri Poincaré 

## Provide Context
Todo: 

## 1. Vectors and coordinates

### An arrow describes a movement

Suppose we walk three units right and one unit up. The vector <span class="math">x = (3, 1)</span> is a record of that trip. Start at the origin, and you can draw it as an arrow ending at the point (3, 1).

We can draw the same movement starting anywhere. As long as the arrow still goes three right and one up, it's still (3, 1). A vector's entries describe *changes* in coordinates, not a fixed starting point.<sup class="fnref"><a href="#fn-3" id="fnref-3" data-fn="3" aria-expanded="false" aria-label="Footnote 3">[3]</a></sup>

Order matters: (1, 3) means one right and three up, which is a different trip. In the ordinary coordinate pictures, the first entry is always the horizontal movement and the second is the vertical one.

### Make the arrow longer or shorter

Multiply both entries by two and we get <span class="math">2x = (6, 2)</span>: the same direction, twice as far. Multiply by ½ and it's half as long.

A negative multiplier also flips the arrow around: −x goes three units left and one unit down. A number we multiply a vector by is called a *scalar*,<sup class="fnref"><a href="#fn-4" id="fnref-4" data-fn="4" aria-expanded="false" aria-label="Footnote 4">[4]</a></sup> and we apply the same number to every entry.

{% include visual-primer/linear/figure-03.html %}

### Follow one arrow, then another

We can also reach (3, 1) in two steps: first move by (1, −1), then by (2, 2). Adding the vectors records the whole journey:

<div class="equation" role="math" aria-label="The vector 1 minus 1 plus the vector 2 2 equals the vector 3 1">(1, −1) + (2, 2) = (3, 1)</div>

{% include visual-primer/linear/figure-04.html %}

Keep this split in mind. The two pieces are perpendicular, and we’ll use them next. 

We can scale arrows before adding them, too. If a and b are two vectors, <span class="math">2a + b</span> means “two copies of a, then one copy of b.” That's a *linear combination*, and the numbers 2 and 1 are its *coefficients*: how much of each ingredient to use.

<a id="operator" class="chapter-anchor"></a>

## 2. A matrix as an operation

### Give the input two rules to follow

How do we turn one vector into another? We’ll use a simple rule throughout this primer: each output is twice its matching input entry, plus the other input entry.

Call the input entries x₁ and x₂. We record the rule as a matrix called M, with one row for each output:

<div class="equation" role="math" aria-label="The matrix M has first row 2 1 and second row 1 2">M = <span class="matrix" aria-hidden="true"><span>2</span><span>1</span><span>1</span><span>2</span></span></div>

The notation Mx means “the output you get by feeding x to M”:

<div class="equation" role="math" aria-label="M x equals the vector 2 x1 plus x2, x1 plus 2 x2">Mx = (2x₁ + x₂,  x₁ + 2x₂)</div>

{% include visual-primer/linear/figure-05.html %}

### Read the rows to find the output

For our input (3, 1), the first row gives <span class="math">2 × 3 + 1 × 1 = 7</span>. The second gives <span class="math">1 × 3 + 2 × 1 = 5</span>. So the output is <span class="math">Mx = (7, 5)</span>.

{% include visual-primer/linear/figure-06.html %}

### Keep the matrix fixed and change the input

Two habits of M make it predictable, and the next picture shows both. On the left, double the input from (3, 1) to (6, 2): the output becomes (14, 10), which is exactly (7, 5) doubled. On the right, split the input into two pieces and push each piece through on its own: the two outputs, placed tip to tail, land exactly on Mx.

{% include visual-primer/linear/figure-07.html %}

Together, these two properties make M *linear*. They let us chop an input into pieces, push each piece through separately, and glue the results back together. We'll do that constantly. They also mean zero in gives zero out: M never moves the origin.<sup class="fnref"><a href="#fn-5" id="fnref-5" data-fn="5" aria-expanded="false" aria-label="Footnote 5">[5]</a></sup>

### Read the columns to see where the unit steps go

What happens to a single horizontal step, <span class="math">e₁ = (1, 0)</span>? M sends it to (2, 1), which is the first column of the matrix. A single vertical step, <span class="math">e₂ = (0, 1)</span>, goes to (1, 2), the second column.

{% include visual-primer/linear/figure-08.html %}

Our input (3, 1) is three horizontal unit steps plus one vertical unit step. Since M is linear, its output is three copies of the first column plus one copy of the second:

<div class="equation" role="math" aria-label="M x equals 3 times the vector 2 1 plus the vector 1 2 equals 7 5">Mx = 3(2, 1) + (1, 2) = (7, 5)</div>

Rows are for computing the output one coordinate at a time. Columns show how the transformed unit steps build the output. Same answer, two ways of looking at it.

<a id="dot-product" class="chapter-anchor"></a>

## 3. The dot product

### A test for right angles

Take two vectors a and b, with entries (a₁, a₂) and (b₁, b₂). Multiply matching entries and add the products. The result is a single number called their *dot product*:

<div class="equation" role="math" aria-label="a dot b equals a1 times b1 plus a2 times b2">a · b = a₁b₁ + a₂b₂</div>

For the arrows <span class="math">a = (2, 1)</span> and <span class="math">b = (1, −2)</span>, the products are 2 and −2, and they cancel. The dot product is zero, and these arrows meet at a right angle.

### The sign tells you about the angle

For two nonzero vectors, a positive dot product means the angle between them is less than 90°. A negative one means it's more than 90°. Exactly zero means exactly 90°.

{% include visual-primer/linear/figure-09.html %}

**If two vectors are perpendicular, their dot product is zero.** We'll use this rule constantly, starting with finding a perpendicular remainder. Vectors with a zero dot product are called *orthogonal*, which is “perpendicular” wearing a lab coat.<sup class="fnref"><a href="#fn-6" id="fnref-6" data-fn="6" aria-expanded="false" aria-label="Footnote 6">[6]</a></sup>

{% include visual-primer/linear/figure-10.html %}

Our earlier pair passes the test: (1, −1) and (2, 2) give <span class="math">1 × 2 + (−1) × 2 = 0</span>. The arithmetic confirms the right angle without trusting anybody's drawing skills. With more entries, the rule is the same: multiply matching entries and add.

### The number also depends on length

Double either arrow and the dot product doubles, even though the angle stays the same. So the dot product depends on both the angle and the lengths of the arrows.

We can simplify things by making the reference arrow one unit long. The dot product then tells us how much of the other arrow lies along that direction. A positive value means that part points with the reference arrow; a negative value means it points against it. First, we’ll build this unit arrow, then see why the measurement works.

### The same calculation in matrix notation

So far we've written coordinates as pairs. In matrix notation, a vector's entries are usually stacked in a column. The transpose, written aᵀ, tips that column over into a row. Multiplying the row aᵀ by the column b does exactly the matching-entries calculation above, so <span class="math">aᵀb</span> and <span class="math">a · b</span> are the same dot product in different outfits.

<a id="norm" class="chapter-anchor"></a>

## 4. Length and unit vectors

### Length and squared length describe the same arrow

To make an arrow one unit long, we first need to know its length. Squared length is just the length multiplied by itself.

For example, take an arrow of length 3. Its squared length is <span class="math">3 × 3 = 9</span>. If we double every coordinate:

<div class="table-wrap" markdown="1">

| Measurement | Original arrow | Twice as long |
| --- | --- | --- |
| Length | 3 | 6 |
| Squared length | 3 × 3 = 9 | 6 × 6 = 36 |

</div>

The length doubles, but the squared length becomes four times as large. To get the length back, take the square root: <span class="math">√9 = 3</span>.

{% include visual-primer/linear/figure-11.html %}

### Find length from the coordinates

For our arrow (3, 1), the horizontal and vertical steps make a right triangle, so Pythagoras gives squared length <span class="math">3² + 1² = 10</span>. Its length is √10, about 3.16.<sup class="fnref"><a href="#fn-7" id="fnref-7" data-fn="7" aria-expanded="false" aria-label="Footnote 7">[7]</a></sup>

Dotting x with itself adds up those same squared coordinates. We write the length of x as ‖x‖, with double bars. It's also called the Euclidean norm:

<div class="equation" role="math" aria-label="The squared length of x equals x dot x equals x1 squared plus x2 squared">‖x‖² = x · x = x₁² + x₂²</div>

### Make a one-unit measuring step

To measure along a direction, we want a standard step. An arrow of length exactly one does the job. It's called a unit vector.

Our x has length √10, so dividing every coordinate by √10 makes its length one. Both entries shrink by the same factor, so the direction doesn't change. Call the new arrow <span class="math">x̂</span>, read “x-hat”:

<div class="equation" role="math" aria-label="x hat equals x divided by its length, which equals the vector 3 1 divided by square root 10">x̂ = x/‖x‖ = (3, 1)/√10</div>

{% include visual-primer/linear/figure-12.html %}

As a check, x̂ has squared length <span class="math">9/10 + 1/10 = 1</span>. Dividing a nonzero vector by its length is called normalization.<sup class="fnref"><a href="#fn-8" id="fnref-8" data-fn="8" aria-expanded="false" aria-label="Footnote 8">[8]</a></sup> Keep that word in mind. In Chapter 8 we'll normalize something else, and the difference will matter.

<details markdown="1">
<summary>How the dot product includes both length and angle</summary>

Let θ be the angle between two nonzero arrows a and b. Then a · b = ‖a‖ ‖b‖ cos θ. The lengths explain why scaling either arrow changes the dot product. The cosine explains the sign: at 90°, it is zero. If b has length one, only a's length and its alignment with b remain in the measurement.

</details>

<a id="projection" class="chapter-anchor"></a>

## 5. Projection

### Split one arrow into two useful pieces

Start with <span class="math">x = (3, 1)</span>. We want the part along the diagonal through <span class="math">d = (1, 1)</span>.

Imagine dropping a perpendicular from the tip of x onto that diagonal. The arrow from the origin to the landing point is the **projection**, or shadow, of x on the line. Call it p. The remaining step from p's tip to x's tip is r.

{% include visual-primer/linear/figure-13.html %}

For our example, the two pieces are:

<div class="equation" role="math" aria-label="x equals its projection, 2 comma 2, plus the remainder, 1 comma minus 1">x = p + r = (2, 2) + (1, −1)</div>

{% include visual-primer/linear/figure-14.html %}

The piece <span class="math">p = (2, 2)</span> follows the diagonal. The remainder <span class="math">r = (1, −1)</span> is perpendicular to it: its dot product with <span class="math">d = (1, 1)</span> is <span class="math">1 − 1 = 0</span>. These are the two checks that make this the projection split.

<details markdown="1">
<summary>Optional: how do we find (2, 2)?</summary>

A point on the diagonal has equal coordinates, so write the unknown projection as $p=(a,a)$. The arrow from $p$ to our original point $x=(3,1)$ is:

$$
r=x-p=(3-a,\;1-a)
$$

The diagonal points in the direction $(1,1)$. We want $r$ to be perpendicular to that direction, so their dot product must be zero. Multiply matching coordinates and add:

$$
r\cdot(1,1)=(3-a)\times1+(1-a)\times1=0
$$

Since both multiplications are by 1, this simplifies to:

$$
(3-a)+(1-a)=0
$$

Combining terms gives $4-2a=0$, so $a=2$. Our projection is therefore $p=(2,2)$.

The remaining arrow is $r=(1,-1)$, which is perpendicular to the diagonal. This perpendicular connection is the shortest path from $x$ to the line.

</details>

### A unit arrow gives us a shortcut

Let u be an arrow of length one along the chosen line. Think of u as a one-unit step in that direction.

The dot product <span class="math">x · u</span> gives us a number. If that number is 3, it means x has 3 units along u. Its projection is therefore <span class="math">3u</span>: an arrow three units long in the direction of u. If the number is −3, the projection points three units in the opposite direction.

To get the projection arrow, multiply that number by u:

<div class="equation" role="math" aria-label="The projection p equals the dot product of x and unit vector u, multiplied by u">p = (x · u)u</div>

The number <span class="math">x · u</span> is called the **coefficient**. The resulting arrow p is the **component of x along the line**.

<details markdown="1">
<summary>Optional: the same component with two measuring steps</summary>

The diagonal arrow <span class="math">d = (1, 1)</span> has length √2. Divide each entry by √2 to make a one-unit arrow:

<span class="math">u = (1, 1)/√2</span>

The dot product tells us how many u steps to take:

<span class="math">x · u = (3 + 1)/√2 = 2√2</span>

So we can reach the projection using either 2 steps of d or 2√2 steps of u:

<div class="equation" role="math" aria-label="p equals 2 times d, or 2 square root 2 times u; both give 2 comma 2">p = 2d = 2√2 u = (2, 2)</div>

{% include visual-primer/linear/figure-15.html %}

The unit arrow u is shorter than d, so we need more steps to reach the same point. The number of steps changes, but the projection stays at (2, 2).

</details>

### The squared lengths add

Because p and r meet at a right angle, Pythagoras applies. Their squared lengths add to x's squared length:

<div class="equation" role="math" aria-label="The squared length of x is 8 plus 2, which equals 10">‖x‖² = ‖p‖² + ‖r‖² = 8 + 2 = 10</div>

This will help us measure how much of an input lies in each of two perpendicular directions.<sup class="fnref"><a href="#fn-9" id="fnref-9" data-fn="9" aria-expanded="false" aria-label="Footnote 9">[9]</a></sup>

<a id="eigenvectors" class="chapter-anchor"></a>

## 6. Eigenvectors and eigenvalues

### Watch three arrows go through the same matrix

We are still using the matrix with these two rules: double the first entry and add the second; then add the first entry to twice the second.

<div class="equation" role="math" aria-label="M has first row 2 1 and second row 1 2">M = <span class="matrix" aria-hidden="true"><span>2</span><span>1</span><span>1</span><span>2</span></span></div>

Compare our input <span class="math">x = (3, 1)</span> with two diagonal arrows, <span class="math">q₁ = (1, −1)</span> and <span class="math">q₂ = (1, 1)</span>. Press **Play transformation** or drag from Before to After. This shows one application of M. The frames in between are animation steps, not repeated matrix multiplications.

{% include visual-primer/linear/figure-16.html %}

<div class="table-wrap" markdown="1">

| Input | Output | What happened? |
| --- | --- | --- |
| x = (3, 1) | Mx = (7, 5) | It grew and turned. |
| q₁ = (1, −1) | Mq₁ = (1, −1) | It stayed exactly the same: multiply by 1. |
| q₂ = (1, 1) | Mq₂ = (3, 3) | It stayed on its line and grew: multiply by 3. |

</div>

### Name the arrow and the number

A nonzero arrow that the matrix multiplies by one number is an **eigenvector**.<sup class="fnref"><a href="#fn-11" id="fnref-11" data-fn="11" aria-expanded="false" aria-label="Footnote 11">[11]</a></sup> That number is its **eigenvalue**. In symbols:

<div class="equation" role="math" aria-label="M times the eigenvector v equals its eigenvalue lambda times v">Mv = λv</div>

Read this as: “applying M to v has the same effect as multiplying v by λ.” The eigenvector tells us the direction; the eigenvalue tells us the multiplier. For M, <span class="math">λ₁ = 1</span> and <span class="math">λ₂ = 3</span>.

{% include visual-primer/linear/figure-17.html %}

### The direction matters more than the length

Any nonzero multiple of q₁ is still an eigenvector with eigenvalue 1. Any nonzero multiple of q₂ still has eigenvalue 3. Making an arrow longer does not change which eigenvector line it lies on.

For other matrices, a negative eigenvalue reverses the arrow along the same line.<sup class="fnref"><a href="#fn-13" id="fnref-13" data-fn="13" aria-expanded="false" aria-label="Footnote 13">[13]</a></sup> A zero eigenvalue sends a nonzero arrow to the origin. The zero arrow itself is excluded: multiplying it by any number gives zero, so it cannot identify a particular multiplier.

<details markdown="1">
<summary>Optional: check every direction, and apply M more than once</summary>

The chart shows how much M turns an arrow for each starting direction. The two eigenvector lines are the only lines it leaves unturned.

{% include visual-primer/linear/figure-18.html %}

Other arrows turn toward the q₂ line, by at most 30° in one application. Repeated applications move them closer to that line unless they started exactly on q₁.<sup class="fnref"><a href="#fn-12" id="fnref-12" data-fn="12" aria-expanded="false" aria-label="Footnote 12">[12]</a></sup>

Along q₂, each application multiplies by 3. Two applications multiply by <span class="math">3 × 3 = 9</span>. An eigenvector direction is sometimes called a mode, and the list of eigenvalues, including repeats, is called the spectrum.<sup class="fnref"><a href="#fn-14" id="fnref-14" data-fn="14" aria-expanded="false" aria-label="Footnote 14">[14]</a></sup>

The moving-grid approach is inspired by [3Blue1Brown's lesson on eigenvectors and eigenvalues](https://www.3blue1brown.com/lessons/eigenvalues/).

</details>

<a id="basis" class="chapter-anchor"></a>

## 7. A different set of coordinates

### Describe the same arrow using different steps

In ordinary coordinates, <span class="math">x = (3, 1)</span> means three horizontal steps and one vertical step. We can reach exactly the same point using the eigenvector steps <span class="math">q₁ = (1, −1)</span> and <span class="math">q₂ = (1, 1)</span>:

<div class="equation" role="math" aria-label="x is one q1 step plus two q2 steps, giving 3 comma 1">x = q₁ + 2q₂ = (1, −1) + (2, 2) = (3, 1)</div>

So x has coordinates <span class="math">(1, 2)</span> in this new system: one q₁ step and two q₂ steps. **Changing coordinates changes the description of x. It does not move x.**

{% include visual-primer/linear/figure-19.html %}

### Now let M act on the pieces

M keeps the q₁ part the same and multiplies the q₂ part by 3. So 1q₁ + 2q₂ becomes 1q₁ + 6q₂. Add these two arrows to get the result in ordinary coordinates:

<div class="equation" role="math" aria-label="M x is one q1 step plus six q2 steps, giving 7 comma 5">Mx = q₁ + 6q₂ = (1, −1) + (6, 6) = (7, 5)</div>

<div class="table-wrap" markdown="1">

| Reference steps | Input coordinates | Output coordinates |
| --- | --- | --- |
| Horizontal and vertical | (3, 1) | (7, 5) |
| q₁ and q₂ | (1, 2) | (1, 6) |

</div>

{% include visual-primer/linear/figure-20.html %}

This works because M is linear: we can transform the pieces separately and then add the results. Eigenvector coordinates make each separate transformation a simple multiplication.

### What makes a valid coordinate system?

A set of reference arrows is called a **basis** when it can describe every vector, and each vector has exactly one description.

In the plane, any two nonparallel arrows form a basis. Our q₁ and q₂ qualify. Two arrows pointing along the same line do not: they cannot reach points away from that line.

<details markdown="1">
<summary>Optional: “span” and “linearly independent”</summary>

{% include visual-primer/linear/figure-21.html %}

Reference arrows **span** the plane if their combinations reach every point. They are **linearly independent** if none is a combination of the others. Together, these properties give enough directions and a unique recipe.

The arrows e₁ and 2e₁ fail both tests. They only reach the horizontal line, and even there a point can have different recipes: <span class="math">(2, 0)</span> is two copies of e₁ or one copy of 2e₁.

</details>

We can now understand every input from the matrix's responses along its eigenvector lines.<sup class="fnref"><a href="#fn-15" id="fnref-15" data-fn="15" aria-expanded="false" aria-label="Footnote 15">[15]</a></sup> Next, we will see why perpendicular reference directions are especially useful.

<a id="symmetry" class="chapter-anchor"></a>

## 8. Why perpendicular unit directions help

### Perpendicular pieces have squared lengths that add

Our split is <span class="math">x = (1, −1) + (2, 2)</span>. The pieces are perpendicular, so each one is the projection of x onto its line. Their squared lengths are 2 and 8, giving x a squared length of 10.

This lets us say exactly how x's squared length is shared: **20% along the first eigenvector line and 80% along the second.** These percentages describe squared length, not ordinary length.

### Use reference arrows of length one

Our original reference arrows q₁ and q₂ each have length √2. Divide each by √2 and call the resulting unit arrows u₁ and u₂. Each u arrow points in the same direction as its matching q arrow:

<div class="equation" role="math" aria-label="u1 equals q1 divided by square root 2, or 1 comma minus 1 divided by square root 2; u2 equals q2 divided by square root 2, or 1 comma 1 divided by square root 2">u₁ = q₁/√2 = (1, −1)/√2<br>u₂ = q₂/√2 = (1, 1)/√2</div>

This changes the size of a reference step. It does not change x or its pieces. The same pieces now need √2 steps along u₁ and 2√2 steps along u₂.

The figure compares **before: q₁ and q₂** with **after: u₁ and u₂**. From here on, we’ll use u₁ and u₂ for the unit reference arrows.

{% include visual-primer/linear/figure-22.html %}

Each reference arrow is one unit long, so the coefficient tells us the length of its piece. The sign only tells us the direction: 3 means a length of 3 along the reference arrow, while −3 means the same length in the opposite direction.

Squaring the coefficient gives the piece’s squared length. Since u₁ and u₂ are perpendicular unit arrows, we find each coefficient by taking a dot product:

<div class="table-wrap" markdown="1">

| Reference arrow | Coefficient | Squared length of the piece |
| --- | --- | --- |
| u₁ | c₁ = x · u₁ = √2 | (√2)² = 2 |
| u₂ | c₂ = x · u₂ = 2√2 | (2√2)² = 8 |

</div>

Together, u₁ and u₂ form an **orthonormal basis**. This simply means the reference arrows are perpendicular to each other and each has length one.

### Why does our matrix allow this?

M has matching entries across its main diagonal: the upper-right and lower-left entries are both 1. A matrix with this mirror property is called **symmetric**. Swapping its rows and columns leaves it unchanged, written <span class="math">Mᵀ = M</span>.

{% include visual-primer/linear/figure-23.html %}

The **spectral theorem** says that every real symmetric matrix has an orthonormal basis of eigenvectors, with real eigenvalues. We can choose enough perpendicular unit eigenvectors to describe every input.

For our two-dimensional example, this means we can write any input as:

<div class="equation" role="math" aria-label="x equals c1 times u1 plus c2 times u2">x = c₁u₁ + c₂u₂</div>

The **coefficients c₁ and c₂ are numbers**: they tell us how many steps to take along each unit arrow. The **components c₁u₁ and c₂u₂ are the actual arrows** that add up to x. Because u₁ and u₂ are perpendicular unit arrows, dot products give us the coefficients:

<div class="equation" role="math" aria-label="c1 equals x dot u1; c2 equals x dot u2">c₁ = x · u₁<br>c₂ = x · u₂</div>

Let’s work through two inputs using the same unit arrows, <span class="math">u₁ = (1, −1)/√2</span> and <span class="math">u₂ = (1, 1)/√2</span>.

**Example 1: x = (3, 1)**

First, find the coefficients. The dot product with u₁ subtracts the second coordinate from the first and divides by √2. The dot product with u₂ adds the coordinates and divides by √2:

<div class="equation" role="math" aria-label="c1 equals x dot u1, which is 3 minus 1 divided by square root 2, giving square root 2; c2 equals x dot u2, which is 3 plus 1 divided by square root 2, giving 2 square root 2">c₁ = x · u₁ = (3 − 1)/√2 = √2<br>c₂ = x · u₂ = (3 + 1)/√2 = 2√2</div>

Now multiply each coefficient by its unit arrow to get the two pieces. The √2 factors cancel:

<div class="equation" role="math" aria-label="c1 u1 equals square root 2 times 1 comma minus 1 divided by square root 2, giving 1 comma minus 1; c2 u2 equals 2 square root 2 times 1 comma 1 divided by square root 2, giving 2 comma 2">c₁u₁ = √2 × (1, −1)/√2 = (1, −1)<br>c₂u₂ = 2√2 × (1, 1)/√2 = (2, 2)</div>

Adding the pieces gives our input back: <span class="math">x = (1, −1) + (2, 2) = (3, 1)</span>.

Now apply M. Its **eigenvalues are 1 along u₁ and 3 along u₂**, so it leaves the first piece unchanged and triples the second:

<div class="equation" role="math" aria-label="M x equals 1 times the component c1 u1 plus 3 times the component c2 u2; this is 1 times 1 comma minus 1 plus 3 times 2 comma 2, giving 7 comma 5">Mx = 1 × (c₁u₁) + 3 × (c₂u₂)<br>= 1 × (1, −1) + 3 × (2, 2)<br>= (1, −1) + (6, 6) = (7, 5)</div>

The figure shows this example. On the left, M acts on unit arrows. On the right, it applies the same eigenvalues to the complete pieces of <span class="math">x = (3, 1)</span>.

{% include visual-primer/linear/figure-24.html %}

**Example 2: x = (4, 2)**

Use the same dot products with the new input:

<div class="equation" role="math" aria-label="c1 equals x dot u1, which is 4 minus 2 divided by square root 2, giving square root 2; c2 equals x dot u2, which is 4 plus 2 divided by square root 2, giving 3 square root 2">c₁ = x · u₁ = (4 − 2)/√2 = √2<br>c₂ = x · u₂ = (4 + 2)/√2 = 3√2</div>

Turn those numbers into the two component arrows:

<div class="equation" role="math" aria-label="c1 u1 equals square root 2 times 1 comma minus 1 divided by square root 2, giving 1 comma minus 1; c2 u2 equals 3 square root 2 times 1 comma 1 divided by square root 2, giving 3 comma 3">c₁u₁ = √2 × (1, −1)/√2 = (1, −1)<br>c₂u₂ = 3√2 × (1, 1)/√2 = (3, 3)</div>

They add up to the new input: <span class="math">x = (1, −1) + (3, 3) = (4, 2)</span>.

M still uses eigenvalues 1 and 3. Apply them to these new pieces:

<div class="equation" role="math" aria-label="M x equals 1 times 1 comma minus 1 plus 3 times 3 comma 3, which is 1 comma minus 1 plus 9 comma 9, giving 10 comma 8">Mx = 1 × (1, −1) + 3 × (3, 3)<br>= (1, −1) + (9, 9) = (10, 8)</div>

In both examples, c₁ is √2. But c₂ changes from 2√2 to 3√2, so the second component changes from (2, 2) to (3, 3). **The coefficients describe the input; the eigenvalues describe how M scales its pieces.** The eigenvalues stay the same because we are using the same M.

Each eigenvector piece stays on its own line. The complete input can still turn. For a different symmetric matrix, a multiplier can also be negative, reversing a piece, or zero, removing it.

We’ll return to our original input <span class="math">x = (3, 1)</span> for the rest of the primer.

<details markdown="1">
<summary>Optional: what can go wrong without symmetry?</summary>

Consider A with rows <span class="math">(1, 1)</span> and <span class="math">(0, 2)</span>. Its eigenvector lines, through <span class="math">(1, 0)</span> and <span class="math">(1, 1)</span>, meet at 45° rather than 90°.

{% include visual-primer/linear/figure-25.html %}

**Perpendicular directions let us measure one piece at a time.** When we project x onto the u₁ line, the u₂ piece contributes zero along that direction. So the projection gives us exactly the u₁ piece. The same works the other way around.

For A, the two complete pieces are (2, 0) and (1, 1). Add their coordinates to get the input: <span class="math">x = (2 + 1, 0 + 1) = (3, 1)</span>.

Projecting onto the horizontal line keeps only the horizontal part of each piece:

- The first piece, (2, 0), is already horizontal, so it stays (2, 0).
- The second piece, (1, 1), loses its upward movement but keeps its one unit to the right, becoming (1, 0).

Add these projections: <span class="math">(2, 0) + (1, 0) = (3, 0)</span>. The result includes a horizontal part from the second piece too. If the second piece were perpendicular to the horizontal line, its projection would be zero, leaving only the first piece, (2, 0).

{% include visual-primer/linear/figure-26.html %}

**Perpendicular pieces also have squared lengths that add.** This is Pythagoras' rule: for M's pieces, <span class="math">2 + 8 = 10</span>, the squared length of x. It is the squared lengths that add this way, rather than the ordinary distances.

For A's pieces, the squared lengths are 4 and 2. Adding them gives 6, while x still has squared length 10. We need an extra term: twice the dot product of the pieces. Their dot product is <span class="math">(2, 0) · (1, 1) = 2</span>, so the full calculation is <span class="math">4 + 2 + 2 × 2 = 10</span>. When pieces are perpendicular, their dot product is zero and that extra term disappears.

We can still use nonperpendicular eigenvectors to split an input and scale its pieces. We lose the two shortcuts: finding each piece directly by projection, and adding squared lengths without an extra term. Some matrices, such as a 90° rotation, do not even have real eigenvectors.

</details>

<details markdown="1">
<summary>Optional: why different eigenvalues give perpendicular eigenvectors</summary>

Let v and w be eigenvectors of a real symmetric matrix M, with eigenvalues α and β. Symmetry lets us move M from one side of the dot product to the other: vᵀMw = (Mv)ᵀw. Substituting Mw = βw and Mv = αv gives β(v · w) = α(v · w). If α and β are different, this can hold only when v · w = 0. So the vectors are perpendicular. The full spectral theorem also guarantees enough eigenvectors to form a basis, including when eigenvalues repeat; within a repeated eigenvalue's space we simply choose perpendicular ones.

</details>

<details markdown="1">
<summary>Optional: two different things can be normalized</summary>

**Normalize the references:** replace q₁ and q₂ with their unit versions u₁ and u₂. The input stays fixed, and its coefficients change.

**Normalize the input:** resize x itself to length one. The reference steps stay fixed, and all of x's pieces resize together.

{% include visual-primer/linear/figure-27.html %}

For x, normalizing the input gives <span class="math">x̂ = (3, 1)/√10</span>. Its two squared-length shares are still 20% and 80%.

</details>

<a id="quadratic" class="chapter-anchor"></a>

## 9. Measuring the output along the input

Chapter 8 showed how to find the whole output arrow. Now we want to compare directions: **which input direction gives the most output along its own line, and which gives the least?** This will give us another way to understand the largest and smallest eigenvalues.

To make that comparison fair, start with inputs of length one. Otherwise, a longer input could give more output simply because it was larger to begin with.

### Use the dot product to measure along the input

We already know how to measure an arrow along a chosen direction: dot it with a unit arrow in that direction. Here, the arrow we measure is the output, and the unit reference is the input itself. Any sideways part contributes zero.

Our running input is <span class="math">x = (3, 1)</span>, with length √10. Divide it by √10 to get the unit input x̂. Its output shrinks by the same factor:

<div class="equation" role="math" aria-label="The unit input x hat is 3 comma 1 divided by square root 10. Its output is 7 comma 5 divided by square root 10.">x̂ = (3, 1)/√10<br>Mx̂ = (7, 5)/√10</div>

Now dot the unit input with its output:

<div class="equation" role="math" aria-label="x hat dotted with M x hat equals 3 times 7 plus 1 times 5, all divided by 10, which equals 2.6">x̂ · Mx̂ = <span class="frac"><span>3 × 7 + 1 × 5</span><span>10</span></span> = 2.6</div>

**The output goes 2.6 units along the input's direction.** Its projection is the arrow <span class="math">2.6x̂</span>. The full output also has a sideways part, so 2.6 is not its full length.<sup class="fnref"><a href="#fn-17" id="fnref-17" data-fn="17" aria-expanded="false" aria-label="Footnote 17">[17]</a></sup> The measurement is signed: a negative result would mean the projection points opposite to the input.

{% include visual-primer/linear/figure-28.html %}

For u₁, the amount along the input is 1. For u₂, it is 3. An eigenvector's output stays entirely on its input line, so this measurement gives exactly its eigenvalue.

### Why does our direction give 2.6?

We can also calculate this from the two eigenvector pieces. Along a unit eigenvector with eigenvalue λ, an input coefficient c becomes an output coefficient λc. Their contribution to the dot product is:

<div class="equation" role="math" aria-label="Input coefficient times output coefficient equals c times lambda c, which equals lambda c squared">c × (λc) = λc²</div>

That is why **each eigenvalue multiplies a squared coefficient**. The two eigenvector lines are perpendicular, and M keeps each piece on its own line, so we can add the two contributions without any extra terms.

In Chapter 8, the original x had coefficients √2 and 2√2. We have now divided x by √10, so both coefficients are divided by √10 too. The reference arrows u₁ and u₂ stay the same:

<div class="table-wrap" markdown="1">

| Reference | Coefficient in the unit input x̂ | Squared coefficient |
| --- | --- | --- |
| u₁ | √2/√10 = 1/√5 | 1/5 = 20% |
| u₂ | 2√2/√10 = 2/√5 | 4/5 = 80% |

</div>

Because x̂ has length one, these squared coefficients add to one. They are its shares of squared length. Multiply each share by its eigenvalue and add:

<div class="equation" role="math" aria-label="x hat dotted with M x hat is 1 times 20 percent plus 3 times 80 percent, which equals 2.6">x̂ · Mx̂ = 1 × 20% + 3 × 80% = 2.6</div>

This is a **weighted average of the eigenvalues**: 20% of the weight goes to 1, and 80% goes to 3.

{% include visual-primer/linear/figure-29.html %}

More share along u₁ moves the result toward 1; more along u₂ moves it toward 3. The shares cannot be negative and add to 100%, so the result always stays between 1 and 3. **The eigenvector directions give the smallest and largest amounts along the input.** We can find these limits without trying every possible direction.

### Give the calculation a name

The same input-output dot product can be calculated for an input of any length:

<div class="equation" role="math" aria-label="Q of x equals x dotted with M x, also written x transpose M x">Q(x) = x · Mx = xᵀMx</div>

This is called a **quadratic form**. Q is just its label. We will call its value the **raw score**, because it includes the effect of input size. Double the input and the output doubles too, so their dot product becomes four times as large.

For the original <span class="math">x = (3, 1)</span>, the raw score is:

<div class="equation" role="math" aria-label="Q of x equals 3 times 7 plus 1 times 5, which equals 26">Q(x) = 3 × 7 + 1 × 5 = 26</div>

For its unit version, <span class="math">Q(x̂) = 2.6</span>. Only when the input has length one does the raw score directly give the signed length of the output's projection. Chapter 11 will show how to get that same fair comparison from an input of any size.

<details markdown="1">
<summary>Optional: check the calculation at both sizes</summary>

For the unit input x̂, the two contributions are <span class="math">1 × 0.2 = 0.2</span> and <span class="math">3 × 0.8 = 2.4</span>. Together they give 2.6:

{% include visual-primer/linear/figure-30.html %}

For the original x, the squared coefficients are 2 and 8, adding to 10. Its raw score is <span class="math">1 × 2 + 3 × 8 = 26</span>:

{% include visual-primer/linear/figure-31.html %}

The output arrow, the raw score, and the output's squared length are three different things:<sup class="fnref"><a href="#fn-19" id="fnref-19" data-fn="19" aria-expanded="false" aria-label="Footnote 19">[19]</a></sup>

<div class="table-wrap" markdown="1">

| Calculation | Answer | What it measures |
| --- | --- | --- |
| Mx | (7, 5) | The output arrow. |
| Q(x) = x · Mx | 26 | The dot product of input and output. |
| ‖Mx‖² | 74 | The output's squared length. |

</div>

Written in ordinary coordinates, the quadratic form is <span class="math">Q(x) = 2x₁² + 2x₁x₂ + 2x₂²</span>. Each term multiplies two input entries, which explains the word “quadratic.”

</details>

We have seen that our matrix gives a positive result for every unit input. Could another matrix give zero, even when the input is not zero?

<a id="nonnegative" class="chapter-anchor"></a>

## 10. When a matrix sends an arrow to zero

For our matrix M, every unit input gives a measurement between 1 and 3. It can never give zero. A different matrix can give zero by removing an entire direction.

### Keep the horizontal part, remove the vertical part

Let N keep the horizontal coordinate of an arrow and remove its vertical coordinate. This is projection onto the horizontal line:

<div class="equation" role="math" aria-label="N sends a comma b to a comma zero">N(a, b) = (a, 0)</div>

Compare two inputs, both of length one:

<div class="table-wrap" markdown="1">

| Input | Output after N | Input · output |
| --- | --- | --- |
| Horizontal: <span class="math">(1, 0)</span> | (1, 0) | 1 |
| Vertical: <span class="math">(0, 1)</span> | (0, 0) | 0 |

</div>

N leaves the horizontal input unchanged. It sends the vertical input <span class="math">v = (0, 1)</span> to zero, even though v has length one. **The zero result tells us that N removes vertical movement.** That direction has eigenvalue zero.

{% include visual-primer/linear/figure-36.html %}

### What does N's measurement count?

For any input <span class="math">(a, b)</span>, the output is <span class="math">(a, 0)</span>. Their dot product is:

<div class="equation" role="math" aria-label="The input a comma b dotted with the output a comma zero equals a times a plus b times zero, which equals a squared">(a, b) · (a, 0)<br>= a × a + b × 0 = a²</div>

The raw score depends only on the horizontal coordinate a. Changing the vertical coordinate b makes no difference.

An entirely vertical arrow has <span class="math">a = 0</span>, so it gives zero. Any arrow with a horizontal part gives a positive result. The result can never be negative, because it is a square.

{% include visual-primer/linear/figure-37.html %}

### Two names for these behaviors

For real symmetric matrices, these properties have standard names:

<div class="table-wrap" markdown="1">

| Name | Input · output |
| --- | --- |
| **Positive definite** | Every nonzero input gives a positive result. |
| **Positive semidefinite** | Every input gives a result that is zero or positive. |

</div>

M is positive definite. N is positive semidefinite: its results are never negative, and vertical inputs give zero. Every positive definite matrix also counts as positive semidefinite, since a positive result is never negative.<sup class="fnref"><a href="#fn-20" id="fnref-20" data-fn="20" aria-expanded="false" aria-label="Footnote 20">[20]</a></sup>

The eigenvalues give a quick test. All positive means positive definite; all zero or positive means positive semidefinite. M has eigenvalues 1 and 3. N has eigenvalue 1 along the horizontal line and 0 along the vertical line.

### Why zero matters in a search

If we look for N's smallest measurement among unit inputs, a vertical input gives zero. We have found a direction N removes.

To study what N keeps, **remove the vertical component first**. Then compare the remaining nonzero horizontal arrows at length one. They all give 1, because N leaves them unchanged. We will use this idea again in Chapter 13: remove a component the matrix ignores, then compare the remaining patterns.<sup class="fnref"><a href="#fn-21" id="fnref-21" data-fn="21" aria-expanded="false" aria-label="Footnote 21">[21]</a></sup>

<details markdown="1">
<summary>Optional: does a zero score always mean zero output?</summary>

For a positive semidefinite matrix, yes. Each eigenvector piece contributes its eigenvalue times its squared coefficient. All contributions are zero or positive, so a total of zero means every contribution is zero. Every nonzero piece must lie along an eigenvector with eigenvalue zero, and the matrix sends all those pieces to zero.

For a symmetric matrix with both positive and negative eigenvalues, contributions can cancel, giving a zero score even when the output is nonzero.<sup class="fnref"><a href="#fn-22" id="fnref-22" data-fn="22" aria-expanded="false" aria-label="Footnote 22">[22]</a></sup> In that case, the output is perpendicular to the input, so their dot product is zero.

</details>

<a id="rayleigh" class="chapter-anchor"></a>

## 11. Compare directions without resizing

In Chapter 9, we resized each input to length one before comparing directions. We can get the same measurement directly from the original input, using one division.

### One direction, two lengths

Our input <span class="math">x = (3, 1)</span> has raw score 26. Half of x is <span class="math">x/2 = (1.5, 0.5)</span>, with raw score 6.5. The shorter arrow points in exactly the same direction, but its raw score is smaller.

Now divide each raw score by the input's squared length:

<div class="table-wrap" markdown="1">

| Input | Raw score | Squared length | After dividing |
| --- | --- | --- | --- |
| x | 26 | 10 | 2.6 |
| x/2 | 6.5 | 2.5 | 2.6 |

</div>

Both give 2.6. Dividing by squared length removes the effect of input size, so the two arrows get the same result.

{% include visual-primer/linear/figure-40.html %}

### Why divide by squared length?

Normalizing an input divides it by its length. Its output is divided by the same amount. The dot product multiplies entries from both arrows, so the result is divided by length twice—once for the input and once for the output. Together, those two factors give <span class="math">‖x‖ × ‖x‖ = ‖x‖²</span>.

We can therefore calculate the measurement for a unit input without actually resizing the arrow:

<div class="equation" role="math" aria-label="R of x equals the raw score Q of x divided by the squared length of x">R(x) = <span class="frac"><span>Q(x)</span><span>‖x‖²</span></span></div>

Dividing the raw score by the input's squared length gives the **Rayleigh quotient**.<sup class="fnref"><a href="#fn-23" id="fnref-23" data-fn="23" aria-expanded="false" aria-label="Footnote 23">[23]</a></sup> For our example, <span class="math">R(x) = 26/10 = 2.6</span>.

**R(x) is the measurement that the same direction would have at length one.** This is the same result we found in Chapter 9 for x̂. The input must be nonzero, because we cannot divide by a squared length of zero.

### Turn the input and watch R change

Call the unit input in the next picture v. Since its squared length is 1, <span class="math">R(v) = Q(v)</span>. It starts at <span class="math">v = x̂</span>, our running direction.

Click **“Along u₁”**, then **“Along u₂.”** The quotient changes from 1 to 3. Now choose **“Along x̂”**: it gives 2.6. Use the slider to explore other directions.

{% include visual-primer/linear/figure-41.html %}

The blue arrow, <span class="math">R(v)v</span>, is the output's projection onto the input line. For any nonzero input x, the same rule gives the projection <span class="math">R(x)x</span>. The full output can also have a sideways part, so R(x) is generally different from the ratio of the full output length to the input length.<sup class="fnref"><a href="#fn-24" id="fnref-24" data-fn="24" aria-expanded="false" aria-label="Footnote 24">[24]</a></sup> At an eigenvector, the sideways part disappears.

### What changes when you turn?

Chapter 9 showed that the measurement is a weighted average of the eigenvalues. Our original x and its unit version x̂ both have 20% of their squared length along u₁ and 80% along u₂:

<div class="equation" role="math" aria-label="R of x is 0.2 times 1 plus 0.8 times 3, which equals 2.6">R(x) = 0.2 × 1 + 0.8 × 3 = 2.6</div>

Resizing an arrow scales both pieces together, keeping those shares unchanged. Turning it can change the shares. **Resizing leaves the quotient unchanged; turning can change it.**

The experiment suggests where the smallest and largest quotients occur. Next, we will use the weighted-average rule to prove that the eigenvector directions reach both limits.

<a id="minimum" class="chapter-anchor"></a>

## 12. Finding the smallest and largest quotients

Chapter 11 gave us a number for each direction. Now we want to find the smallest and largest possible values. For an input of length one, these tell us the least and most output along the input's own direction.

Our running direction gives 2.6. That is one possible value; it does not tell us where the limits are.

### Why every quotient stays between 1 and 3

For our symmetric matrix M, the quotient is a weighted average of the eigenvalues 1 and 3. The weight on each eigenvalue is the share of the input's squared length along its eigenvector. These shares cannot be negative and add to 100%.

Putting all the weight on 1 gives an average of 1. Moving any of that weight to 3 raises the average. Even when all the weight is on 3, the result is only 3. So **every nonzero input has a quotient between 1 and 3, including the two ends**.

### The eigenvectors reach both limits

We can put all the weight on 1 by choosing u₁ as the input. It has no u₂ piece. Likewise, choosing u₂ puts all the weight on 3.

Compare these two unit inputs with our running unit input x̂. The shares below are percentages of squared length:

<div class="table-wrap" markdown="1">

| Unit input | u₁ share | u₂ share | Quotient |
| --- | --- | --- | --- |
| u₁ | 100% | 0% | 1 |
| x̂ | 20% | 80% | 2.6 |
| u₂ | 0% | 100% | 3 |

</div>

This proves both limits: **no direction gives less than 1, and u₁ gives exactly 1; no direction gives more than 3, and u₂ gives exactly 3**. Finding a minimum takes both parts: show that nothing can go lower, then find an input that reaches that value.

{% include visual-primer/linear/figure-44.html %}

Resizing or reversing an arrow leaves its quotient unchanged. Every nonzero arrow on the u₁ line therefore gives the minimum, and every nonzero arrow on the u₂ line gives the maximum. In the chart, 135° points along −u₁, which is on the same line as u₁.

### The same rule works in more dimensions

For any **real symmetric matrix**, every nonzero input's quotient is a weighted average of its eigenvalues. The same argument works however many entries the input has:

- The **smallest eigenvalue** is the minimum quotient. An eigenvector with that eigenvalue reaches it.
- The **largest eigenvalue** is the maximum quotient. An eigenvector with that eigenvalue reaches it.<sup class="fnref"><a href="#fn-25" id="fnref-25" data-fn="25" aria-expanded="false" aria-label="Footnote 25">[25]</a></sup>

This gives us a way to find the minimum without checking every direction: find the smallest eigenvalue and an eigenvector that goes with it. The eigenvalue tells us the minimum value; the eigenvector tells us an input direction that achieves it. [Spielman, Chapter 2](https://www.cs.yale.edu/homes/spielman/sagt/sagt.pdf#page=47).

<details markdown="1">
<summary>Optional: why the symmetry condition matters</summary>

Symmetry lets us split the input into perpendicular eigenvector pieces. That is what makes the squared-length shares work as weights in an average.

For comparison, the nonsymmetric matrix A from Chapter 8 has rows <span class="math">(1, 1)</span> and <span class="math">(0, 2)</span>. Its eigenvalues are 1 and 2. Its quotient can go below 1 and above 2, as the chart shows:

{% include visual-primer/linear/figure-45.html %}

Each eigenvector of A still gives its eigenvalue as the quotient. Other directions give values as low as about 0.79 and as high as about 2.21. So A's eigenvectors do not give the minimum and maximum. Its eigenvector pieces are not perpendicular, and the weighted-average rule we used for M does not apply.

</details>

Next, we will use this idea to find the smoothest pattern in a list.

<a id="mean-plane" class="chapter-anchor"></a>

## 13. Remove the average to reveal the pattern

### Measure how bumpy a list is

Now let's use a quadratic form to compare patterns in a list. We will measure **bumpiness**: square the difference between each neighboring pair and add. Smaller values mean neighboring entries are closer.

Take the three-entry list <span class="math">z = (3, 1, 2)</span>. Its bumpiness is:

<div class="equation" role="math" aria-label="The bumpiness is 3 minus 1 squared plus 1 minus 2 squared, which equals 5">(3 − 1)² + (1 − 2)² = 4 + 1 = 5</div>

A step up and a step down of the same size contribute equally. Larger steps contribute more. Because we add squares, the result can never be negative.

This measurement is a quadratic form, written <span class="math">zᵀBz</span>, for a new symmetric matrix B.<sup class="fnref"><a href="#fn-18" id="fnref-18" data-fn="18" aria-expanded="false" aria-label="Footnote 18">[18]</a></sup> B acts on three-entry lists, so it is different from our earlier two-by-two M. We can use its eigenvector directions to find the smoothest pattern.

<details markdown="1">
<summary>Optional: compare bumpiness for a few lists</summary>

{% include visual-primer/linear/figure-35.html %}

</details>

A flat list scores zero, even if its entries are nonzero. As in Chapter 10, the lowest score identifies a direction the matrix ignores. To study the variation within a list, we first remove its shared level. Then we can compare the remaining patterns at the same size.

### Separate the shared level from the pattern

Our list <span class="math">z = (3, 1, 2)</span> has average 2. Subtract 2 from every entry:

<div class="equation" role="math" aria-label="The list 3 comma 1 comma 2 is its shared average 2 comma 2 comma 2 plus the centered pattern 1 comma minus 1 comma zero">(3, 1, 2) = (2, 2, 2) + (1, −1, 0)</div>

The first part is the shared level. The second tells us how far each entry is above or below the average. Subtracting the average is called **centering**. The centered entries always add to zero.

{% include visual-primer/linear/figure-46.html %}

Centering preserves the differences between neighboring entries. The raw bumpiness is therefore still 5:

<div class="equation" role="math" aria-label="The centered list has bumpiness 4 plus 1, which equals 5">(1 − (−1))² + ((−1) − 0)² = 4 + 1 = 5</div>

{% include visual-primer/linear/figure-47.html %}

**This preserves raw bumpiness, not necessarily the quotient.** Subtracting an average changes the input's squared length. We center first because we want that length to measure only the variation around the mean.

### Centering and normalizing do different jobs

<div class="table-wrap" markdown="1">

| Step | What we do | Why we do it |
| --- | --- | --- |
| Center | Subtract the average from every entry. | Remove the shared level. |
| Normalize | Divide the centered list by its length. | Give each remaining pattern the same size. |

</div>

Our centered list is <span class="math">r = (1, −1, 0)</span>, with squared length 2. We could normalize it to <span class="math">r/√2</span>. Or use Chapter 11's shortcut and divide its raw score by its squared length:

<div class="equation" role="math" aria-label="The centered pattern has fair bumpiness 5 divided by 2, which equals 2.5">Fair bumpiness = 5/2 = 2.5</div>

A flat list leaves the zero vector after centering. There is then no remaining pattern to normalize, and its quotient is undefined. Our search considers **nonzero, centered patterns**.

<details markdown="1">
<summary>Optional: why subtracting the average is a projection</summary>

The all-equal direction is <span class="math">h = (1, 1, 1)</span>. The shared part <span class="math">p = (2, 2, 2)</span> lies along it. Our remainder r is perpendicular to h because <span class="math">r · h = 1 − 1 + 0 = 0</span>. This is the same projection split as in Chapter 5.

To find the shared part directly, write it as <span class="math">(a, a, a)</span>. Requiring the remainder to be perpendicular to h gives <span class="math">(3 − a) + (1 − a) + (2 − a) = 0</span>, so <span class="math">a = 2</span>. For any list, this calculation gives its average.

Three-entry centered lists satisfy <span class="math">r₁ + r₂ + r₃ = 0</span>. The first two entries can vary freely; the third is then fixed. They form a plane perpendicular to h. Requiring length one selects a circle inside that plane.

{% include visual-primer/linear/figure-48.html %}

We now have another circle of candidate directions, just as in Chapter 11, but every point on this circle already has average zero.

</details>

### Which centered pattern is smoothest?

For our bumpiness matrix B, the raw score is the sum of squared neighboring differences. Its fair score divides that sum by the centered input's squared length.

The ramp <span class="math">(1, 0, −1)</span> has raw bumpiness 2 and squared length 2, so it scores 1. The zigzag <span class="math">(1, −2, 1)</span> has raw bumpiness 18 and squared length 6, so it scores 3.

{% include visual-primer/linear/figure-49.html %}

The ramp and zigzag are perpendicular eigenvectors of B, with eigenvalues 1 and 3.<sup class="fnref"><a href="#fn-26" id="fnref-26" data-fn="26" aria-expanded="false" aria-label="Footnote 26">[26]</a></sup> Together they describe every centered three-entry pattern. Each such pattern's quotient is a weighted average of 1 and 3.

Therefore **the lowest quotient among centered patterns is 1, achieved by the ramp direction**. Its reverse is equally smooth. Our centered list has 25% of its squared length along the ramp and 75% along the zigzag, giving <span class="math">0.25 × 1 + 0.75 × 3 = 2.5</span>.

### Why the second-smallest eigenvalue appears

B has eigenvalues 0, 1, and 3. The flat direction has eigenvalue 0. Centering removes that entire component from every candidate, leaving the directions with eigenvalues 1 and 3.

The smallest remaining eigenvalue is 1, which was the **second-smallest eigenvalue** of B. We often call it λ₂. Its eigenvector gives the smoothest centered pattern for this score.

This explains the step used in the next primer: remove a known flat component, then find the smoothest remaining pattern. On a network, such patterns help reveal groups of strongly connected points. [Spielman, Chapters 1–2](https://www.cs.yale.edu/homes/spielman/sagt/sagt.pdf#page=40).

Keep the two example matrices separate. For this bumpiness matrix B, the flat direction has the smallest eigenvalue, 0. For our earlier matrix M, the all-equal direction has the largest eigenvalue, 3. Centering always removes the average; which eigenvalue it removes depends on the matrix.

{% include visual-primer/linear/figure-50.html %}

<aside class="recap" aria-labelledby="recap-title" markdown="1">

<a id="recap-title"></a>

## The whole primer on one sticky note

1. A vector is a movement. A matrix is a linear arrow machine: rows compute the output, columns show where the unit steps land.
2. A zero dot product means orthogonal (for nonzero arrows, perpendicular). Dotting with a unit arrow measures the signed component along it.
3. Projection finds the closest point on a line. The remainder is perpendicular, so squared lengths add.
4. An eigenvector is a nonzero arrow that M only scales: <span class="math">Mv = λv</span>. Here, q₁ has λ₁ = 1 and q₂ has λ₂ = 3.
5. A real symmetric matrix only stretches, along perpendicular eigenlines: that's the spectral theorem. In coordinates built from its unit eigenvectors, M multiplies each coordinate by its eigenvalue, and the pieces don't overlap: shadows find them and their squared lengths add.
6. For a unit input v, the dot product v · Mv measures the signed amount of output along the input. For our symmetric matrix, it is a weighted average of the eigenvalues, using the input's shares of squared length. The same calculation for any input is the quadratic form Q(v) = v · Mv; its raw value also depends on input size. Bumpiness is another example of a quadratic form.
7. When no score is negative, zero means “nothing this score counts”: the input lies entirely in directions the matrix sends to zero.
8. The Rayleigh quotient, raw score divided by squared length, is the unit-input score for an arrow of any length. For our M it's a wave between 1 and 3, and the eigenvectors hit the two ends. The smallest eigenvalue is the lowest score; its eigenvector is the direction that gets it.
9. A shared shift moves a list along the all-equal direction. Centering (subtracting the average) removes that direction, and normalizing fixes the size. What's left is the pattern, and the search runs inside the plane of centered lists with the same tools: for the bumpiness score, the smoothest non-flat pattern is the ramp, with the second-smallest eigenvalue, 1.

</aside>

<aside class="source-note" aria-label="References" markdown="1">

**Further reading**

1. [3Blue1Brown, *Eigenvectors and eigenvalues*.](https://www.3blue1brown.com/lessons/eigenvalues/) The moving-grid picture, done properly, with animation budgets.
2. [Gilbert Strang, MIT 18.06, Lecture 25: Symmetric matrices and positive definiteness.](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-25-symmetric-matrices-and-positive-definiteness/) For the spectral theorem and orthogonal eigenvectors.
3. [Daniel Spielman, *Spectral and Algebraic Graph Theory*, Chapter 2.](https://www.cs.yale.edu/homes/spielman/sagt/sagt.pdf) For the variational characterization of eigenvalues and the Courant–Fischer theorem.

</aside>

<section class="footnotes" aria-labelledby="footnotes-title"><h2 id="footnotes-title">Footnotes</h2><ol><li id="fn-1"><span class="fn-text">The search term is <em>spectral clustering</em>. The same idea ranks web pages, finds communities in social networks, and segments images. All of it starts with the question in this paragraph.</span> <a class="fn-back" href="#fnref-1" aria-label="Back to footnote 1 in the text">↩</a></li><li id="fn-2"><span class="fn-text">Hi. Footnotes hold the jokes that didn't fit in the main text, plus the occasional “technically…” that keeps everything honest.</span> <a class="fn-back" href="#fnref-2" aria-label="Back to footnote 2 in the text">↩</a></li><li id="fn-3"><span class="fn-text">Unlike most directions you get from relatives, these work no matter where you start.</span> <a class="fn-back" href="#fnref-3" aria-label="Back to footnote 3 in the text">↩</a></li><li id="fn-4"><span class="fn-text">William Rowan Hamilton gave “scalar” and “vector” their mathematical meanings in the mid-1840s, while developing his quaternions. Real numbers, he explained, sit on a single scale running from negative to positive infinity. “Vector” comes from the Latin for “carrier.”</span> <a class="fn-back" href="#fnref-4" aria-label="Back to footnote 4 in the text">↩</a></li><li id="fn-5"><span class="fn-text">This is why the rule “add 1 to every entry” isn't linear in this sense, even though in one dimension f(x) = x + 1 draws a perfectly straight line. It moves the origin. That kind of rule is called <em>affine</em>, and someone will point this out if you get it wrong.</span> <a class="fn-back" href="#fnref-5" aria-label="Back to footnote 5 in the text">↩</a></li><li id="fn-6"><span class="fn-text">For two nonzero arrows in the plane, “orthogonal” and “perpendicular” mean the same thing. “Orthogonal” also works in more dimensions, and for things like functions, where “perpendicular” starts to sound odd. Technically the zero vector is orthogonal to everything, which is about as meaningful as it sounds.</span> <a class="fn-back" href="#fnref-6" aria-label="Back to footnote 6 in the text">↩</a></li><li id="fn-7"><span class="fn-text">√10 ≈ 3.162 is close enough to π that Zhang Heng in 2nd-century China and Brahmagupta in 7th-century India both used it as a value for π. We are not doing that here.</span> <a class="fn-back" href="#fnref-7" aria-label="Back to footnote 7 in the text">↩</a></li><li id="fn-8"><span class="fn-text">The zero vector can't be normalized: its length is zero, and dividing by zero remains, as ever, not allowed.</span> <a class="fn-back" href="#fnref-8" aria-label="Back to footnote 8 in the text">↩</a></li><li id="fn-9"><span class="fn-text">Without the right angle there would be an extra cross term: ‖p + r‖² = ‖p‖² + 2 p · r + ‖r‖². Here p · r = 0, so it vanishes.</span> <a class="fn-back" href="#fnref-9" aria-label="Back to footnote 9 in the text">↩</a></li><li id="fn-10"><span class="fn-text">The wobble in the hand-drawn grid is drawn on the plane itself, so M transforms the wobbles along with everything else. That's what a linear map does to any drawing you make on the plane. (The arrow tips sit exactly where the math says, though.)</span> <a class="fn-back" href="#fnref-10" aria-label="Back to footnote 10 in the text">↩</a></li><li id="fn-11"><span class="fn-text">“Eigen” is German for “own,” as in “the matrix's own vectors.” English borrowed half the word and never gave it back.</span> <a class="fn-back" href="#fnref-11" aria-label="Back to footnote 11 in the text">↩</a></li><li id="fn-12"><span class="fn-text">Keep applying M and almost every arrow swings closer and closer to the q₂ line, because each application triples the q₂ component and leaves the q₁ component alone. Repeating a matrix to find its dominant eigenvector is called the <em>power method</em>; Google's original PageRank was computed this way. (The “almost”: arrows exactly on the q₁ line have no q₂ component to triple, so they stay put.)</span> <a class="fn-back" href="#fnref-12" aria-label="Back to footnote 12 in the text">↩</a></li><li id="fn-13"><span class="fn-text">Flipping still counts as staying on the line. The arrow is on the same line through the origin, just facing the other way down the hallway.</span> <a class="fn-back" href="#fnref-13" aria-label="Back to footnote 13 in the text">↩</a></li><li id="fn-14"><span class="fn-text">David Hilbert made “spectrum” the standard word in the early 1900s (Wilhelm Wirtinger had borrowed it from optics a few years before). A couple of decades later, quantum mechanics showed that the lines in atomic spectra really are computed from eigenvalues. Hilbert reportedly said he'd used the name with no idea it would apply to the actual spectra of physics. The word went from optics to math and straight back again.</span> <a class="fn-back" href="#fnref-14" aria-label="Back to footnote 14 in the text">↩</a></li><li id="fn-15"><span class="fn-text">Of which there are a lot. Uncountably many, in fact.</span> <a class="fn-back" href="#fnref-15" aria-label="Back to footnote 15 in the text">↩</a></li><li id="fn-16"><span class="fn-text">Rotation by 180° is sneakier: it flips every arrow, which counts as staying on the line, so every nonzero arrow is an eigenvector with eigenvalue −1.</span> <a class="fn-back" href="#fnref-16" aria-label="Back to footnote 16 in the text">↩</a></li><li id="fn-17"><span class="fn-text">Remember the job interview in Chapter 6? x started explaining that it turns a little, and M said “Next!” The chart there says how little: about 17°. That turn is the sideways part in the picture.</span> <a class="fn-back" href="#fnref-17" aria-label="Back to footnote 17 in the text">↩</a></li><li id="fn-18"><span class="fn-text">For a three-entry list z, B has rows (1, −1, 0), (−1, 2, −1) and (0, −1, 1). Multiplying gives zᵀBz = z₁² + 2z₂² + z₃² − 2z₁z₂ − 2z₂z₃ = (z₁ − z₂)² + (z₂ − z₃)². The next primer builds this kind of matrix from a network.</span> <a class="fn-back" href="#fnref-18" aria-label="Back to footnote 18 in the text">↩</a></li><li id="fn-19"><span class="fn-text">One input, three different answers. Linear algebra is like this sometimes.</span> <a class="fn-back" href="#fnref-19" aria-label="Back to footnote 19 in the text">↩</a></li><li id="fn-20"><span class="fn-text">Positive semidefinite is the matrix version of “no complaints.” Not necessarily any compliments. Just no complaints.</span> <a class="fn-back" href="#fnref-20" aria-label="Back to footnote 20 in the text">↩</a></li><li id="fn-21"><span class="fn-text">An almost-vertical unit input can have a score as close to zero as we like. Removing the vertical component restricts the comparison to the perpendicular, horizontal direction.</span> <a class="fn-back" href="#fnref-21" aria-label="Back to footnote 21 in the text">↩</a></li><li id="fn-22"><span class="fn-text">Without nonnegativity, a zero can be a coincidence. The matrix with rows (1, 0) and (0, −1) gives (1, 1) a score of 1 − 1 = 0, yet sends it to (1, −1), not to zero.</span> <a class="fn-back" href="#fnref-22" aria-label="Back to footnote 22 in the text">↩</a></li><li id="fn-23"><span class="fn-text">Named after Lord Rayleigh, who also explained why the sky is blue and shared in the discovery of argon, which won him the 1904 Nobel Prize in Physics. He was having a good few decades.</span> <a class="fn-back" href="#fnref-23" aria-label="Back to footnote 23 in the text">↩</a></li><li id="fn-24"><span class="fn-text">For our x, ‖Mx‖/‖x‖ = √74/√10 ≈ 2.72, which is bigger than R(x) = 2.6. The sideways remainder adds length without adding anything along x.</span> <a class="fn-back" href="#fnref-24" aria-label="Back to footnote 24 in the text">↩</a></li><li id="fn-25"><span class="fn-text">Mathematicians call this the <em>variational characterization</em> of eigenvalues: “variational” because it comes from varying the direction and looking for the lowest and highest values. Physics is full of these. A soap film settles into a shape that (locally) minimizes its area, and light follows a path whose travel time is stationary, which is usually a minimum.</span> <a class="fn-back" href="#fnref-25" aria-label="Back to footnote 25 in the text">↩</a></li><li id="fn-26"><span class="fn-text">Using the matrix B defined in this chapter: B(1, 0, −1) = (1, 0, −1): eigenvalue 1. B(1, −2, 1) = (3, −6, 3): eigenvalue 3. The flat list is the third eigenvector, B(1, 1, 1) = (0, 0, 0): eigenvalue 0. And (1, 0, −1) · (1, −2, 1) = 1 + 0 − 1 = 0, so the two in the plane are perpendicular, as the spectral theorem promised.</span> <a class="fn-back" href="#fnref-26" aria-label="Back to footnote 26 in the text">↩</a></li></ol></section>

<footer class="credits">
<p>The stick figures, comics and charts are original drawings, made in the general style of <a href="https://xkcd.com/">xkcd</a> as a tribute. This page is not affiliated with or endorsed by xkcd or Randall Munroe. Every figure from the original primer has been redrawn with the same coordinates, and the figures new to this edition use the same running example; the wobble moves the middle of each line, never its endpoints.</p>
<p>Lettering: <em>Humor Sans</em> by Michael Ciuffo and <em>Playpen Sans</em> by TypeTogether, both under the <a href="https://openfontlicense.org">SIL Open Font License 1.1</a>.</p>
</footer>
