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

Here's the slightly sneaky part: we can draw the same movement starting anywhere. As long as the arrow still goes three right and one up, it's still (3, 1). A vector's entries describe *changes* in coordinates, not a fixed starting point.<sup class="fnref"><a href="#fn-3" id="fnref-3" data-fn="3" aria-expanded="false" aria-label="Footnote 3">[3]</a></sup>

Order matters: (1, 3) means one right and three up, which is a different trip. In the ordinary coordinate pictures, the first entry is always the horizontal movement and the second is the vertical one.

### Make the arrow longer or shorter

Multiply both entries by two and we get <span class="math">2x = (6, 2)</span>: the same direction, twice as far. Multiply by ½ and it's half as long.

A negative multiplier also flips the arrow around: −x goes three units left and one unit down. A number we multiply a vector by is called a *scalar*,<sup class="fnref"><a href="#fn-4" id="fnref-4" data-fn="4" aria-expanded="false" aria-label="Footnote 4">[4]</a></sup> and we apply the same number to every entry.

{% include visual-primer/linear/figure-03.html %}

### Follow one arrow, then another

We can also reach (3, 1) in two steps: first move by (1, −1), then by (2, 2). Adding the vectors records the whole journey:

<div class="equation" role="math" aria-label="The vector 1 minus 1 plus the vector 2 2 equals the vector 3 1">(1, −1) + (2, 2) = (3, 1)</div>

{% include visual-primer/linear/figure-04.html %}

Keep this split in mind. The two pieces are perpendicular, and we’ll use them next. We can scale arrows before adding them, too. If a and b are two vectors, <span class="math">2a + b</span> means “two copies of a, then one copy of b.” That's a *linear combination*, and the numbers 2 and 1 are its *coefficients*: how much of each ingredient to use.

<a id="operator" class="chapter-anchor"></a>

## 2. A matrix as an operation

### Give the input two rules to follow

How do we turn one vector into another? Here's the rule we'll use for the entire primer. Double the first input entry and add the second: that's the first output. Add the first input entry to twice the second: that's the second output.

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

Double either arrow and the dot product doubles too, even though the angle hasn't changed. So the dot product mixes alignment and length together. It isn't a pure angle meter.

We can at least remove one of the two lengths. Measure against a *reference* arrow of length one. Then the dot product measures the other arrow along that direction, with a sign that says which way it points. That arrow's own length still counts, as it should. First we'll build a unit arrow; then we'll see why the measurement works.

### The same calculation in matrix notation

So far we've written coordinates as pairs. In matrix notation, a vector's entries are usually stacked in a column. The *transpose*, written aᵀ, tips that column over into a row. Multiplying the row aᵀ by the column b does exactly the matching-entries calculation above, so <span class="math">aᵀb</span> and <span class="math">a · b</span> are the same dot product in different outfits.

<a id="norm" class="chapter-anchor"></a>

## 4. Length and unit vectors

### Length and squared length describe the same arrow

Before we can build a one-unit arrow, we need to know how long our arrow is right now. Length is how long it is. Squared length is that number multiplied by itself.

For a small example, take any arrow of length 3. (We'll get to the length of (3, 1) in a moment.) Its squared length is <span class="math">3 × 3 = 9</span>. Now double every coordinate, which makes it twice as long:

<div class="table-wrap" markdown="1">

| Measurement | Original arrow | Twice as long |
| --- | --- | --- |
| Length | 3 | 6 |
| Squared length | 3 × 3 = 9 | 6 × 6 = 36 |

</div>

The length doubles, but the squared length quadruples, because both factors in the multiplication doubled. To get back from squared length to length, take the square root: a squared length of 9 means a length of √9 = 3.

{% include visual-primer/linear/figure-11.html %}

### Find length from the coordinates

For our arrow (3, 1), the horizontal and vertical steps make a right triangle, so Pythagoras gives squared length <span class="math">3² + 1² = 10</span>. Its length is √10, about 3.16.<sup class="fnref"><a href="#fn-7" id="fnref-7" data-fn="7" aria-expanded="false" aria-label="Footnote 7">[7]</a></sup>

Dotting x with itself adds up those same squared coordinates. We write the length of x as ‖x‖, with double bars. It's also called the *Euclidean norm*:

<div class="equation" role="math" aria-label="The squared length of x equals x dot x equals x1 squared plus x2 squared">‖x‖² = x · x = x₁² + x₂²</div>

### Make a one-unit measuring step

To measure along a direction, we want a standard step. An arrow of length exactly one does the job. It's called a *unit vector*.

Our x has length √10, so dividing every coordinate by √10 makes its length one. Both entries shrink by the same factor, so the direction doesn't change. Call the new arrow <span class="math">x̂</span>, read “x-hat”:

<div class="equation" role="math" aria-label="x hat equals x divided by its length, which equals the vector 3 1 divided by square root 10">x̂ = x/‖x‖ = (3, 1)/√10</div>

{% include visual-primer/linear/figure-12.html %}

As a check, x̂ has squared length <span class="math">9/10 + 1/10 = 1</span>. Dividing a nonzero vector by its length is called *normalization*.<sup class="fnref"><a href="#fn-8" id="fnref-8" data-fn="8" aria-expanded="false" aria-label="Footnote 8">[8]</a></sup> Keep that word in mind. In Chapter 8 we'll normalize something else, and the difference will matter.

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

A point on this diagonal has equal coordinates, so write the unknown projection as <span class="math">p = (a, a)</span>. The remaining step is then <span class="math">r = (3 − a, 1 − a)</span>.

Choose a so that r has dot product zero with the diagonal direction:

<div class="equation" role="math" aria-label="3 minus a plus 1 minus a equals zero">(3 − a) + (1 − a) = 0</div>

This gives <span class="math">4 − 2a = 0</span>, so <span class="math">a = 2</span>. A perpendicular connection is also the shortest connection from x's tip to the line.

</details>

### A unit arrow gives us a shortcut

Let u be a length-one arrow along the chosen line. The dot product <span class="math">x · u</span> tells us the signed amount of x along that line. Multiplying that number by u turns it into the projection arrow:

<div class="equation" role="math" aria-label="The projection p equals the dot product of x and unit vector u, multiplied by u">p = (x · u)u</div>

The number <span class="math">x · u</span> is a **coefficient**: it tells us how many u steps to take. The whole arrow p is the **component**. A negative coefficient means taking those steps in the opposite direction.

<details markdown="1">
<summary>Optional: the same component with two measuring steps</summary>

Our diagonal arrow d has length √2. Make it unit length by dividing by √2: <span class="math">u = (1, 1)/√2</span>. Now <span class="math">x · u = (3 + 1)/√2 = 2√2</span>.

<div class="equation" role="math" aria-label="p equals 2 times d, or 2 square root 2 times u; both give 2 comma 2">p = 2d = 2√2 u = (2, 2)</div>

{% include visual-primer/linear/figure-15.html %}

The coefficient changes because the measuring step changes. The component itself stays the same.

</details>

### The squared lengths add

Because p and r meet at a right angle, Pythagoras applies. Their *squared* lengths add to x's squared length:

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

Along q₂, each application multiplies by 3. Two applications multiply by <span class="math">3 × 3 = 9</span>. An eigenvector direction is sometimes called a *mode*, and the list of eigenvalues, including repeats, is called the *spectrum*.<sup class="fnref"><a href="#fn-14" id="fnref-14" data-fn="14" aria-expanded="false" aria-label="Footnote 14">[14]</a></sup>

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

M leaves the q₁ piece alone and triples the q₂ piece. The new coordinates therefore change from <span class="math">(1, 2)</span> to <span class="math">(1, 6)</span>. Add the output pieces to return to ordinary coordinates:

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

Our original reference arrows q₁ and q₂ each have length √2. Divide each by √2 to get unit reference arrows:

<div class="equation" role="math" aria-label="u1 is 1 comma minus 1 divided by square root 2; u2 is 1 comma 1 divided by square root 2">u₁ = (1, −1)/√2    u₂ = (1, 1)/√2</div>

This changes the size of a reference step. It does not change x or its pieces. The same pieces now need √2 steps along u₁ and 2√2 steps along u₂.

{% include visual-primer/linear/figure-22.html %}

Because the references are unit length, a coefficient's absolute value is the length of its piece. Squaring the coefficient gives that piece's squared length. Projection finds the coefficients with a dot product:

<div class="table-wrap" markdown="1">

| Reference | Coefficient | Squared length of the piece |
| --- | --- | --- |
| u₁ | c₁ = x · u₁ = √2 | c₁² = 2 |
| u₂ | c₂ = x · u₂ = 2√2 | c₂² = 8 |

</div>

A basis with perpendicular, length-one arrows is called **orthonormal**. The word packages the two properties we just used.

### Why does our matrix allow this?

M has matching entries across its main diagonal: the upper-right and lower-left entries are both 1. A matrix with this mirror property is called **symmetric**. Swapping its rows and columns leaves it unchanged, written <span class="math">Mᵀ = M</span>.

{% include visual-primer/linear/figure-23.html %}

The **spectral theorem** says that every real symmetric matrix has an orthonormal basis of eigenvectors, with real eigenvalues. We can choose enough perpendicular unit eigenvectors to describe every input.

For M, the recipe is now simple: project the input onto the two eigenvector lines, multiply each piece by its eigenvalue, then add the results.

{% include visual-primer/linear/figure-24.html %}

Each eigenvector piece stays on its own line. The complete input can still turn. For a different symmetric matrix, a multiplier can also be negative, reversing a piece, or zero, removing it.

<details markdown="1">
<summary>Optional: what can go wrong without symmetry?</summary>

Consider A with rows <span class="math">(1, 1)</span> and <span class="math">(0, 2)</span>. Its eigenvector lines, through <span class="math">(1, 0)</span> and <span class="math">(1, 1)</span>, meet at 45° rather than 90°.

{% include visual-primer/linear/figure-25.html %}

We can still use these two directions as coordinates: <span class="math">x = 2(1, 0) + (1, 1)</span>. But projecting x onto either line does not recover the corresponding piece, because the other piece also has a component along that line.

{% include visual-primer/linear/figure-26.html %}

The squared lengths of the pieces are 4 and 2. They add to 6, not 10. The full formula has an extra term: <span class="math">‖a + b‖² = ‖a‖² + 2a · b + ‖b‖²</span>. Here that extra term is 4. Perpendicular pieces make it zero.

So eigenvector coordinates alone do not give all our shortcuts. We need perpendicular eigenvectors. Some matrices, such as a 90° rotation, do not even have real eigenvectors.

</details>

<details markdown="1">
<summary>Optional: why different eigenvalues give perpendicular eigenvectors</summary>

Let v and w be eigenvectors of a real symmetric matrix M, with eigenvalues α and β. Symmetry lets us move M from one side of the dot product to the other: vᵀMw = (Mv)ᵀw. Substituting Mw = βw and Mv = αv gives β(v · w) = α(v · w). If α and β are different, this can hold only when v · w = 0. So the vectors are perpendicular. The full spectral theorem also guarantees enough eigenvectors to form a basis, including when eigenvalues repeat; within a repeated eigenvalue's space we simply choose perpendicular ones.

</details>

<details markdown="1">
<summary>Optional: two different things can be normalized</summary>

**Normalize the references:** make the measuring steps unit length. The input stays fixed, and its coefficients change.

**Normalize the input:** resize x itself to length one. The reference steps stay fixed, and all of x's pieces resize together.

{% include visual-primer/linear/figure-27.html %}

For x, normalizing the input gives <span class="math">x̂ = (3, 1)/√10</span>. Its two squared-length shares are still 20% and 80%.

</details>

<a id="quadratic" class="chapter-anchor"></a>

## 9. A score from the input and output

### First calculate the score at the original size

Our input is <span class="math">x = (3, 1)</span>, and its output is <span class="math">Mx = (7, 5)</span>. Dot the two together:

<div class="equation" role="math" aria-label="The raw score Q of x is the input dotted with the output: 3 times 7 plus 1 times 5, which equals 26">Q(x) = x · Mx = 3 × 7 + 1 × 5 = 26</div>

The letter Q names the score. Another way to write the same dot product is <span class="math">xᵀMx</span>. Do not confuse this score with the output arrow or its squared length:<sup class="fnref"><a href="#fn-19" id="fnref-19" data-fn="19" aria-expanded="false" aria-label="Footnote 19">[19]</a></sup>

<div class="table-wrap" markdown="1">

| Calculation | Answer | What it measures |
| --- | --- | --- |
| Mx | (7, 5) | The output arrow. |
| Q(x) = x · Mx | 26 | The dot product of input and output. |
| ‖Mx‖² | 74 | The output's squared length. |

</div>

### The raw score changes when the input changes size

Double x and Mx also doubles. Both arrows in the dot product are now twice as large, so the score becomes four times as large. This “size squared” behavior is why Q is called a **quadratic form**.

To compare directions fairly, first give every input length one. Our x has length √10, so its unit version is <span class="math">x̂ = (3, 1)/√10</span>. Dividing the input by √10 also divides the output by √10. Their dot product is therefore divided by 10:

<div class="equation" role="math" aria-label="The score of unit input x hat is 26 divided by 10, which equals 2.6">Q(x̂) = 26/10 = 2.6</div>

**For a unit input, the score is the signed amount of the output along the input's direction.** It measures the output's projection onto that line. Any sideways part contributes zero to the dot product.<sup class="fnref"><a href="#fn-17" id="fnref-17" data-fn="17" aria-expanded="false" aria-label="Footnote 17">[17]</a></sup>

{% include visual-primer/linear/figure-28.html %}

For x̂, that amount is 2.6. For the unit eigenvectors u₁ and u₂, it is 1 and 3. Along an eigenvector, the whole output stays on the input's line, so the unit-input score is exactly the eigenvalue.

### Why does our direction score 2.6?

Chapter 8 split x's squared length into 20% along u₁ and 80% along u₂. Resizing x to length one keeps these same shares. M multiplies the first piece by 1 and the second by 3, so:

<div class="equation" role="math" aria-label="The unit-input score is 20 percent times 1 plus 80 percent times 3, which equals 2.6">Q(x̂) = 20% × 1 + 80% × 3 = 2.6</div>

The score is a **weighted average of the eigenvalues**. The weights are shares of *squared length*. They cannot be negative, and they add to 100%.

{% include visual-primer/linear/figure-29.html %}

More share along u₁ moves the score toward 1. More share along u₂ moves it toward 3. Every unit input's score stays between those two values.

<details markdown="1">
<summary>Optional: why each piece contributes its eigenvalue times its squared amount</summary>

Let c be the input's signed coefficient along one unit eigenvector. Its output coefficient is λc. That piece's contribution to the dot product is therefore <span class="math">c × λc = λc²</span>.

{% include visual-primer/linear/figure-30.html %}

For a unit input, the squared coefficients add to one, so they are already shares. For the original x, they add to 10. Its score is <span class="math">1 × 2 + 3 × 8 = 26</span>.

{% include visual-primer/linear/figure-31.html %}

Written in ordinary coordinates, this same score is <span class="math">Q(x) = 2x₁² + 2x₁x₂ + 2x₂²</span>.

</details>

<details markdown="1">
<summary>Optional: why we cannot score just any pieces and add</summary>

The shortcut works for **perpendicular eigenvector pieces**. Here is why both conditions matter. Split the original input along the ordinary axes: <span class="math">a = (3, 0)</span> and <span class="math">b = (0, 1)</span>. Their scores are 18 and 2, adding to 20. But the whole input scores 26. Where are the other 6?

{% include visual-primer/linear/figure-32.html %}

The full score pairs each input piece with each output piece. There are four dot products:

<div class="equation" role="math" aria-label="The score of a plus b is the two separate scores plus the two cross terms">Q(a + b) = Q(a) + Q(b) + a · Mb + b · Ma</div>

The last two are called **cross terms**. Here each equals 3, so the full total is <span class="math">18 + 2 + 3 + 3 = 26</span>.

{% include visual-primer/linear/figure-33.html %}

Why does the eigenvector split avoid this? Each output piece stays on its own eigenvector line. Those lines are perpendicular, so an input piece dotted with the other piece's output gives zero.

{% include visual-primer/linear/figure-34.html %}

Perpendicular inputs alone are not enough: M can turn their outputs. Eigenvector inputs alone are not enough either: their lines also need to be perpendicular.

</details>

### A practical example: how bumpy is a list?

Take the list <span class="math">(3, 1, 2)</span>. To measure its bumpiness, subtract neighboring entries, square each difference, and add:

<div class="equation" role="math" aria-label="The bumpiness is 3 minus 1 squared plus 1 minus 2 squared, which equals 5">(3 − 1)² + (1 − 2)² = 4 + 1 = 5</div>

A step up and a step down of the same size cost the same. Larger steps cost more. A flat list costs zero because every neighboring difference is zero.

{% include visual-primer/linear/figure-35.html %}

This is another quadratic form. It can be written <span class="math">zᵀBz</span>, using a three-entry input z and a new symmetric matrix B.<sup class="fnref"><a href="#fn-18" id="fnref-18" data-fn="18" aria-expanded="false" aria-label="Footnote 18">[18]</a></sup> B is different from our two-by-two M, but the same reasoning applies: perpendicular eigenvector pieces explain its score.

Chapter 11 will show how to remove the effect of input size without first drawing a unit arrow. Chapter 13 will use that fair comparison to find a smooth pattern in the three-entry list.

<a id="nonnegative" class="chapter-anchor"></a>

## 10. Can a nonzero input have score zero?

### Our matrix M always gives a positive score

M's eigenvalues are 1 and 3. Each eigenvector piece contributes a positive multiplier times its squared length. A nonzero input has at least one nonzero piece, so its total score is positive.

A real symmetric matrix whose score is positive for every nonzero input is called **positive definite**.

### A different matrix can ignore a direction

Consider N, which keeps the horizontal coordinate and removes the vertical one:

<div class="equation" role="math" aria-label="N sends a comma b to a comma zero">N(a, b) = (a, 0)</div>

The unit vertical input <span class="math">(0, 1)</span> goes to <span class="math">(0, 0)</span>. Its score is zero, even though the input has length one. It is an eigenvector of N with eigenvalue zero.

{% include visual-primer/linear/figure-36.html %}

For any input <span class="math">(a, b)</span>, N's raw score is <span class="math">(a, b) · (a, 0) = a²</span>. It can be positive or zero, but never negative.

{% include visual-primer/linear/figure-37.html %}

A real symmetric matrix whose scores are never negative is called **positive semidefinite**. It allows zero scores for nonzero inputs, but does not require them. Positive definite matrices are included in this broader group.<sup class="fnref"><a href="#fn-20" id="fnref-20" data-fn="20" aria-expanded="false" aria-label="Footnote 20">[20]</a></sup>

### Why zero matters in a search

If we search for N's lowest-scoring unit input, a vertical arrow wins with zero. That tells us which direction N ignores. To study its other directions, we would need to exclude that direction from the search.<sup class="fnref"><a href="#fn-21" id="fnref-21" data-fn="21" aria-expanded="false" aria-label="Footnote 21">[21]</a></sup>

The bumpiness score has a similar issue: a nonzero flat list scores zero because none of its entries differ. Chapter 13 removes that shared, flat component before comparing the remaining patterns.

<details markdown="1">
<summary>Optional: compare all directions for M and N</summary>

{% include visual-primer/linear/figure-38.html %}

M's unit-input scores stay between 1 and 3. N's stay between 0 and 1: its score is simply the share of squared length along the horizontal direction.

</details>

<details markdown="1">
<summary>Optional: what eigenvalues and sums of squares tell us</summary>

For a real symmetric matrix, all positive eigenvalues mean the matrix is positive definite. Eigenvalues that are all zero or positive mean it is positive semidefinite. A negative eigenvalue gives a negative score along its eigenvector.

For a positive semidefinite matrix, a zero score means the input lies entirely in directions that the matrix sends to zero. This conclusion needs the nonnegative eigenvalues. Otherwise, positive and negative contributions can cancel even when the output is not zero.<sup class="fnref"><a href="#fn-22" id="fnref-22" data-fn="22" aria-expanded="false" aria-label="Footnote 22">[22]</a></sup>

Sometimes a sum of squares proves the sign directly. For M:

<div class="equation" role="math" aria-label="Q of x equals x1 squared plus x2 squared plus x1 plus x2 squared">Q(x) = x₁² + x₂² + (x₁ + x₂)²</div>

If x is nonzero, at least one of the first two squares is positive. So the sum is positive. Bumpiness is also a sum of squares, which explains why it can never be negative.

</details>

<a id="rayleigh" class="chapter-anchor"></a>

## 11. Compare directions at the same size

### Why the raw score needs a size correction

Our input x scores 26. Half of x scores only 6.5. It points in exactly the same direction, so the smaller score has not found a better direction. It has only made the input smaller.

{% include visual-primer/linear/figure-39.html %}

When an input's length doubles, both its raw score and its squared length multiply by four. Their ratio stays the same. This ratio is called the **Rayleigh quotient**, written R(x).<sup class="fnref"><a href="#fn-23" id="fnref-23" data-fn="23" aria-expanded="false" aria-label="Footnote 23">[23]</a></sup> “Quotient” simply means the result of a division.

<div class="equation" role="math" aria-label="R of x equals Q of x divided by squared length, which equals x transpose M x divided by x transpose x">R(x) = <span class="frac"><span>Q(x)</span><span>‖x‖²</span></span> = <span class="frac"><span>xᵀMx</span><span>xᵀx</span></span></div>

For x, it is <span class="math">26/10 = 2.6</span>. For half of x, it is <span class="math">6.5/2.5 = 2.6</span>. **The quotient is the score the same direction would get at length one.** The input must be nonzero, so the denominator is not zero.

<div class="table-wrap" markdown="1">

| Input | Squared length | Raw score | Quotient |
| --- | --- | --- | --- |
| x̂ = (3, 1)/√10 | 1 | 2.6 | 2.6 |
| x/2 = (1.5, 0.5) | 2.5 | 6.5 | 2.6 |
| x = (3, 1) | 10 | 26 | 2.6 |
| 2x = (6, 2) | 40 | 104 | 2.6 |

</div>

<details markdown="1">
<summary>Optional: see why dividing by squared length works</summary>

A unit version of x is <span class="math">x/‖x‖</span>. Its output is <span class="math">Mx/‖x‖</span>. Dotting them divides the original score by <span class="math">‖x‖ × ‖x‖ = ‖x‖²</span>. That is exactly the Rayleigh quotient.

{% include visual-primer/linear/figure-40.html %}

</details>

### Turn the input and watch the score change

Every input in the next experiment has length one. Drag to turn it, or use the buttons to select our running direction and the two eigenvector directions.

{% include visual-primer/linear/figure-41.html %}

Along u₁, the quotient is 1. Along u₂, it is 3. Along x̂, it is 2.6. At an eigenvector, the dashed sideways remainder disappears because the whole output stays on the input's line.

<details class="resize-experiment" markdown="1">
<summary>What if we resize a copy of the input?</summary>

Keep the circle experiment at length one. Here we resize a separate copy of its current input. The copy and all its pieces change length together; the unit reference arrows stay fixed.

<div class="interactive-controls">
<div class="control-row"><label for="input-length">Length of the input copy</label><output id="length-output" for="input-length">1</output><input id="input-length" type="range" min="0.25" max="2" step="0.05" value="1" aria-describedby="resize-instruction"></div>
<div class="readouts" aria-live="polite" aria-atomic="true"><div class="readout"><span>Copy's squared length</span><strong id="norm-output">1</strong></div><div class="readout"><span>Copy's raw score</span><strong id="score-output">2.6</strong></div><div class="readout"><span>Copy's quotient</span><strong id="ratio-output">2.6</strong></div></div>
<p id="resize-instruction">Changing the copy's length changes its raw score and its squared length by the same factor, so their ratio doesn't budge. The circle picture above keeps showing the unit input.</p>
</div>

For the original x, halving its length lowers the score from 26 to 6.5 and the squared length from 10 to 2.5. Both ratios are still 2.6. The shrink ray strikes out.

</details>

### Read the quotient from the shares

For our symmetric M, the quotient is a weighted average of the eigenvalues. Find the fraction of squared length in each eigenvector direction, multiply each fraction by its eigenvalue, and add.

Our x has squared-length shares <span class="math">2/10 = 0.2</span> and <span class="math">8/10 = 0.8</span>:

<div class="equation" role="math" aria-label="R of x is 0.2 times 1 plus 0.8 times 3, which equals 2.6">R(x) = 0.2 × 1 + 0.8 × 3 = 2.6</div>

The shares are never negative and always add to one. **Turning the input changes the shares. Resizing it leaves them unchanged.** This explains why the quotient compares directions fairly.

<details markdown="1">
<summary>Optional: why the graph has a wave shape</summary>

As the unit input turns, its projections on the eigenvector lines change smoothly. Squaring their lengths gives the changing shares. If s is the share along u₂, the other share is <span class="math">1 − s</span>, so the score is <span class="math">1 × (1 − s) + 3 × s = 1 + 2s</span>.

{% include visual-primer/linear/figure-42.html %}

If θ is the input's angle from the horizontal axis, its u₂ share is <span class="math">cos²(θ − 45°)</span>. The score is therefore <span class="math">2 + sin(2θ)</span>. You do not need this trigonometry to use the weighted-average rule.

</details>

<details markdown="1">
<summary>Optional: what the quotient measures in the output picture</summary>

The output's projection onto the input line is <span class="math">R(x)x</span>. For our example this is <span class="math">2.6x = (7.8, 2.6)</span>. The remaining step to <span class="math">Mx = (7, 5)</span> is <span class="math">(−0.8, 2.4)</span>, perpendicular to x.

To check the formula, call the projection multiplier k. Its remainder <span class="math">Mx − kx</span> must have dot product zero with x. Thus <span class="math">x · Mx = k(x · x)</span>, giving <span class="math">k = R(x)</span>.

The quotient measures the output along the input's line. It is generally different from the ratio of the full output length to the input length, because the full output can also have a sideways part.<sup class="fnref"><a href="#fn-24" id="fnref-24" data-fn="24" aria-expanded="false" aria-label="Footnote 24">[24]</a></sup>

</details>

<details markdown="1">
<summary>Optional: the same weighted average in more dimensions</summary>

For a real symmetric matrix, choose perpendicular unit eigenvectors uᵢ. Let cᵢ be the input's coefficient along uᵢ, and λᵢ its eigenvalue. The index i identifies a direction; Σ means to add over all directions.

The squared length is <span class="math">Σᵢ cᵢ²</span>, and the raw score is <span class="math">Σᵢ λᵢcᵢ²</span>. Each share is <span class="math">wᵢ = cᵢ² / Σⱼ cⱼ²</span>. Therefore <span class="math">R(x) = Σᵢ wᵢλᵢ</span>: the same weighted-average rule.

</details>

The experiment suggests where the smallest and largest scores occur. Next, the weighted-average rule will prove it for every direction.

<a id="minimum" class="chapter-anchor"></a>

## 12. Finding the minimum and maximum

### Every score stays between 1 and 3

Chapter 11 showed that each quotient for M is a weighted average of its eigenvalues, 1 and 3. The weights are nonnegative and add to one. Such an average cannot fall below 1 or rise above 3.

{% include visual-primer/linear/figure-43.html %}

So 1 is a floor for every possible direction. We do not need to test directions one at a time to know this.

### The eigenvectors reach both limits

Choose <span class="math">q₁ = (1, −1)</span>. All its squared length lies along the eigenvector with eigenvalue 1, so <span class="math">R(q₁) = 1</span>. That proves the minimum is exactly 1: no direction goes lower, and this direction reaches it.

Choose <span class="math">q₂ = (1, 1)</span> for the other end. Its quotient is 3, so the maximum is exactly 3.

{% include visual-primer/linear/figure-44.html %}

<div class="table-wrap" markdown="1">

| Question | Direction that achieves it | Score |
| --- | --- | --- |
| Lowest quotient for M | q₁ = (1, −1) | 1 |
| Highest quotient for M | q₂ = (1, 1) | 3 |

</div>

The arrows can be resized or reversed without changing their quotients. We are finding directions, not one particular arrow length.

### Why one trial is not a proof of the minimum

Our trial x gives 2.6. That tells us the minimum is *at most* 2.6: a direction with that score exists. It does not tell us that every other direction scores more.

To prove a minimum, we need both parts of the argument: a floor that applies to every candidate, and a candidate that reaches the floor.

### The same rule works in more dimensions

For any **real symmetric matrix**, the smallest eigenvalue is the smallest Rayleigh quotient, and an eigenvector with that eigenvalue achieves it. The largest eigenvalue gives the maximum in the same way.<sup class="fnref"><a href="#fn-25" id="fnref-25" data-fn="25" aria-expanded="false" aria-label="Footnote 25">[25]</a></sup>

This gives the extreme eigenvalues two meanings: they are multipliers along special directions, and they are the best and worst values of this fair score. If an extreme eigenvalue repeats, more than one independent direction can achieve the same extreme score.

We can therefore search for a minimum by finding the smallest eigenvalue and a corresponding eigenvector. The weighted-average argument still works when there are too many dimensions to draw. [Spielman, Chapter 2](https://www.cs.yale.edu/homes/spielman/sagt/sagt.pdf#page=47).

<details markdown="1">
<summary>Optional: why the symmetry condition matters</summary>

The nonsymmetric matrix A from Chapter 8 has rows <span class="math">(1, 1)</span> and <span class="math">(0, 2)</span>. Its eigenvalues are 1 and 2, but its quotients range from about 0.79 to 2.21.

{% include visual-primer/linear/figure-45.html %}

Its eigenvectors still score their eigenvalues. They simply do not achieve the extremes. Because the eigenvector lines are not perpendicular, the squared-length shares do not give the weighted-average formula we used for M. The spectral theorem supplies that formula for real symmetric matrices.

</details>

<a id="mean-plane" class="chapter-anchor"></a>

## 13. Remove the average to reveal the pattern

### Separate the shared level from the pattern

Return to the three-entry list <span class="math">z = (3, 1, 2)</span>. Its average is 2. Subtract 2 from every entry:

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

We are using the three-entry bumpiness matrix B introduced in Chapter 9. Its raw score is the sum of squared neighboring differences. Its fair score divides that sum by the centered input's squared length.

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
6. The score Q(v) = v · Mv is how much of the output points back along the input. For a unit input it's a blend of the eigenvalues, weighted by the input's shares of squared length. The cross terms vanish because eigenvector pieces stay on perpendicular lines. Any score made of squares and products, like the bumpiness of a list, is a score of this kind.
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

<section class="footnotes" aria-labelledby="footnotes-title"><h2 id="footnotes-title">Footnotes</h2><ol><li id="fn-1"><span class="fn-text">The search term is <em>spectral clustering</em>. The same idea ranks web pages, finds communities in social networks, and segments images. All of it starts with the question in this paragraph.</span> <a class="fn-back" href="#fnref-1" aria-label="Back to footnote 1 in the text">↩</a></li><li id="fn-2"><span class="fn-text">Hi. Footnotes hold the jokes that didn't fit in the main text, plus the occasional “technically…” that keeps everything honest.</span> <a class="fn-back" href="#fnref-2" aria-label="Back to footnote 2 in the text">↩</a></li><li id="fn-3"><span class="fn-text">Unlike most directions you get from relatives, these work no matter where you start.</span> <a class="fn-back" href="#fnref-3" aria-label="Back to footnote 3 in the text">↩</a></li><li id="fn-4"><span class="fn-text">William Rowan Hamilton gave “scalar” and “vector” their mathematical meanings in the mid-1840s, while developing his quaternions. Real numbers, he explained, sit on a single scale running from negative to positive infinity. “Vector” comes from the Latin for “carrier.”</span> <a class="fn-back" href="#fnref-4" aria-label="Back to footnote 4 in the text">↩</a></li><li id="fn-5"><span class="fn-text">This is why the rule “add 1 to every entry” isn't linear in this sense, even though in one dimension f(x) = x + 1 draws a perfectly straight line. It moves the origin. That kind of rule is called <em>affine</em>, and someone will point this out if you get it wrong.</span> <a class="fn-back" href="#fnref-5" aria-label="Back to footnote 5 in the text">↩</a></li><li id="fn-6"><span class="fn-text">For two nonzero arrows in the plane, “orthogonal” and “perpendicular” mean the same thing. “Orthogonal” also works in more dimensions, and for things like functions, where “perpendicular” starts to sound odd. Technically the zero vector is orthogonal to everything, which is about as meaningful as it sounds.</span> <a class="fn-back" href="#fnref-6" aria-label="Back to footnote 6 in the text">↩</a></li><li id="fn-7"><span class="fn-text">√10 ≈ 3.162 is close enough to π that Zhang Heng in 2nd-century China and Brahmagupta in 7th-century India both used it as a value for π. We are not doing that here.</span> <a class="fn-back" href="#fnref-7" aria-label="Back to footnote 7 in the text">↩</a></li><li id="fn-8"><span class="fn-text">The zero vector can't be normalized: its length is zero, and dividing by zero remains, as ever, not allowed.</span> <a class="fn-back" href="#fnref-8" aria-label="Back to footnote 8 in the text">↩</a></li><li id="fn-9"><span class="fn-text">Without the right angle there would be an extra cross term: ‖p + r‖² = ‖p‖² + 2 p · r + ‖r‖². Here p · r = 0, so it vanishes. Cross terms will be back in Chapter 9, looking suspicious.</span> <a class="fn-back" href="#fnref-9" aria-label="Back to footnote 9 in the text">↩</a></li><li id="fn-10"><span class="fn-text">The wobble in the hand-drawn grid is drawn on the plane itself, so M transforms the wobbles along with everything else. That's what a linear map does to any drawing you make on the plane. (The arrow tips sit exactly where the math says, though.)</span> <a class="fn-back" href="#fnref-10" aria-label="Back to footnote 10 in the text">↩</a></li><li id="fn-11"><span class="fn-text">“Eigen” is German for “own,” as in “the matrix's own vectors.” English borrowed half the word and never gave it back.</span> <a class="fn-back" href="#fnref-11" aria-label="Back to footnote 11 in the text">↩</a></li><li id="fn-12"><span class="fn-text">Keep applying M and almost every arrow swings closer and closer to the q₂ line, because each application triples the q₂ component and leaves the q₁ component alone. Repeating a matrix to find its dominant eigenvector is called the <em>power method</em>; Google's original PageRank was computed this way. (The “almost”: arrows exactly on the q₁ line have no q₂ component to triple, so they stay put.)</span> <a class="fn-back" href="#fnref-12" aria-label="Back to footnote 12 in the text">↩</a></li><li id="fn-13"><span class="fn-text">Flipping still counts as staying on the line. The arrow is on the same line through the origin, just facing the other way down the hallway.</span> <a class="fn-back" href="#fnref-13" aria-label="Back to footnote 13 in the text">↩</a></li><li id="fn-14"><span class="fn-text">David Hilbert made “spectrum” the standard word in the early 1900s (Wilhelm Wirtinger had borrowed it from optics a few years before). A couple of decades later, quantum mechanics showed that the lines in atomic spectra really are computed from eigenvalues. Hilbert reportedly said he'd used the name with no idea it would apply to the actual spectra of physics. The word went from optics to math and straight back again.</span> <a class="fn-back" href="#fnref-14" aria-label="Back to footnote 14 in the text">↩</a></li><li id="fn-15"><span class="fn-text">Of which there are a lot. Uncountably many, in fact.</span> <a class="fn-back" href="#fnref-15" aria-label="Back to footnote 15 in the text">↩</a></li><li id="fn-16"><span class="fn-text">Rotation by 180° is sneakier: it flips every arrow, which counts as staying on the line, so every nonzero arrow is an eigenvector with eigenvalue −1.</span> <a class="fn-back" href="#fnref-16" aria-label="Back to footnote 16 in the text">↩</a></li><li id="fn-17"><span class="fn-text">Remember the job interview in Chapter 6? x started explaining that it turns a little, and M said “Next!” The chart there says how little: about 17°. That turn is the sideways part in the picture.</span> <a class="fn-back" href="#fnref-17" aria-label="Back to footnote 17 in the text">↩</a></li><li id="fn-18"><span class="fn-text">For a three-entry list z, B has rows (1, −1, 0), (−1, 2, −1) and (0, −1, 1). Multiplying gives zᵀBz = z₁² + 2z₂² + z₃² − 2z₁z₂ − 2z₂z₃ = (z₁ − z₂)² + (z₂ − z₃)². The next primer builds this kind of matrix from a network.</span> <a class="fn-back" href="#fnref-18" aria-label="Back to footnote 18 in the text">↩</a></li><li id="fn-19"><span class="fn-text">One input, three different answers. Linear algebra is like this sometimes.</span> <a class="fn-back" href="#fnref-19" aria-label="Back to footnote 19 in the text">↩</a></li><li id="fn-20"><span class="fn-text">Positive semidefinite is the matrix version of “no complaints.” Not necessarily any compliments. Just no complaints.</span> <a class="fn-back" href="#fnref-20" aria-label="Back to footnote 20 in the text">↩</a></li><li id="fn-21"><span class="fn-text">Hold that thought. Chapter 13 removes one direction from a search for exactly this reason.</span> <a class="fn-back" href="#fnref-21" aria-label="Back to footnote 21 in the text">↩</a></li><li id="fn-22"><span class="fn-text">Without nonnegativity, a zero can be a coincidence. The matrix with rows (1, 0) and (0, −1) gives (1, 1) a score of 1 − 1 = 0, yet sends it to (1, −1), not to zero.</span> <a class="fn-back" href="#fnref-22" aria-label="Back to footnote 22 in the text">↩</a></li><li id="fn-23"><span class="fn-text">Named after Lord Rayleigh, who also explained why the sky is blue and shared in the discovery of argon, which won him the 1904 Nobel Prize in Physics. He was having a good few decades.</span> <a class="fn-back" href="#fnref-23" aria-label="Back to footnote 23 in the text">↩</a></li><li id="fn-24"><span class="fn-text">For our x, ‖Mx‖/‖x‖ = √74/√10 ≈ 2.72, which is bigger than R(x) = 2.6. The sideways remainder adds length without adding anything along x.</span> <a class="fn-back" href="#fnref-24" aria-label="Back to footnote 24 in the text">↩</a></li><li id="fn-25"><span class="fn-text">Mathematicians call this the <em>variational characterization</em> of eigenvalues: “variational” because it comes from varying the direction and looking for the lowest and highest values. Physics is full of these. A soap film settles into a shape that (locally) minimizes its area, and light follows a path whose travel time is stationary, which is usually a minimum.</span> <a class="fn-back" href="#fnref-25" aria-label="Back to footnote 25 in the text">↩</a></li><li id="fn-26"><span class="fn-text">Check with the matrix B from Chapter 9's footnote. B(1, 0, −1) = (1, 0, −1): eigenvalue 1. B(1, −2, 1) = (3, −6, 3): eigenvalue 3. The flat list is the third eigenvector, B(1, 1, 1) = (0, 0, 0): eigenvalue 0. And (1, 0, −1) · (1, −2, 1) = 1 + 0 − 1 = 0, so the two in the plane are perpendicular, as the spectral theorem promised.</span> <a class="fn-back" href="#fnref-26" aria-label="Back to footnote 26 in the text">↩</a></li></ol></section>

<footer class="credits">
<p>The stick figures, comics and charts are original drawings, made in the general style of <a href="https://xkcd.com/">xkcd</a> as a tribute. This page is not affiliated with or endorsed by xkcd or Randall Munroe. Every figure from the original primer has been redrawn with the same coordinates, and the figures new to this edition use the same running example; the wobble moves the middle of each line, never its endpoints.</p>
<p>Lettering: <em>Humor Sans</em> by Michael Ciuffo and <em>Playpen Sans</em> by TypeTogether, both under the <a href="https://openfontlicense.org">SIL Open Font License 1.1</a>.</p>
</footer>
