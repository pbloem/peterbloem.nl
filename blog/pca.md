---
title: A friendly introduction to Principal Component Analysis
date: 31-01-2020
math: true
code: true
---
<!-- {% raw %} -->

<header>
<h1>A friendly introduction to Principal Component Analysis</h1>
<div class="subh1">part 1: minimizing reconstruction error</div>
</header>

<ul class="links">
	<li>27 Sep 2020</li>
	<li><a href="https://github.com/pbloem/blog/blob/master/2020/pca/pca-1.ipynb">notebook</a></li>
		<li><a href="/blog/pca-2">part 2</a></li>
		<li><a href="/blog/pca-3">3</a></li>
		<li><a href="/blog/pca-4">4</a></li>
		<li>5</li>
</ul>

<aside>
Principal component analysis (PCA) is probably the most magical linear method in data science. Unfortunately, while it's always good to have a sense of wonder about mathematics, if a method seems too magical it usually means that there is something left to understand. After years of almost, but not quite fully understanding PCA, here is my attempt to explain it fully, hopefully leaving some of the magic intact.
</aside>

We will work from the outside in: we will view PCA first as a way of finding a smaller representation of a dataset. This is a typical machine learning problem: find a compressed representation of the data such that the reconstructions are as close to the original as possible. This is a simple view of PCA, an we'll be able to compute it with nothing more than gradient descent with a few extra tricks for satisfying constraints.

Most of the technical stuff only becomes necessary when we want to understand why PCA works so well: this is where the **spectral theorem** and the **eigenvalues and -vectors**, come in to the story, they give us a deeper understanding of what we're doing. We'll look at these subjects in <a href="/blog/pca-2">part two</a>.

The spectral theorem is the heart of the method, so it pays to discuss it in some detail. We'll state it and explain what it means in part 2, and leave the proof to part 3. 

Finally, in part 4 we'll look at the the **singular value decomposition**. This matrix decomposition is not only the most popular method for computing the solutions to PCA, it is also the go-to method for computing many related problems, like least squares fits, and matrix ranks.

<aside>I'll assume some basic linear algebra knowledge, but  I'll try to explain the preliminaries where possible, even if they are fundamental to linear algebra. There is a small list of identities and properties in <a href="#helpful-linear-algebra-properties">the appendix</a>, which you may want to consult to refresh your memory. </aside>

## The basics

Let's begin by setting up some basic notation. We are faced with some high-dimensional dataset of <em>instances</em> (examples of whatever we're studying) described with real-valued features. That is, we have \\(\gc{n}\\) _instances_ \\(\x_\gc{i}\\) and each instance is described by a vector of \\(\bc{m}\\) real values. We describe the dataset as a whole as an \\(\gc{n} \times \bc{d}\\) matrix \\(\X\\); that is, we arrange the examples as rows, and the features as columns.

<figure class="centering">
<img src="/images/pca/data-diagram.svg" class="tile2"/>
</figure>

For a simple example, imagine that we have a dataset of <span class="gc">100 people</span> with <span class="bc">2 features</span> measured per person: their monthly salary and their income over the course of a quarter (i.e. three months). The second is just the first times 3, so this data is <em>redundant</em>. One value can be computed from the other, so we really only need to store one number per person. Here's what that looks like in a scatterplot.

<figure class="narrow">
<img src="/images/pca/income1.svg" />
</figure>

Our intuition that we really only need one number to represent the data is reflected in the fact that _the data form a line_. So long as we know what that line is, we only need to store how far along the line each instance is. 

<aside>There might be more complex relations between two features, like a parabola or an exponential curve. <em>In PCA we simplify things by only exploiting linear relations.</em> We'll look into some nonlinear variations in part 4.</aside>

Of course, data in the wild is never this clean. Let's introduce some small variations between the monthly salary and the income after three months. Some people may have changed jobs, some people may get bonuses or vacation allowances, some people may have extra sources of income. Here's a more realistic version of the data.

<figure class="narrow">
<img src="/images/pca/income2.svg" />
</figure>

The data is no longer perfectly linear, but it still seems _pretty_ linear. If we imagine the same line we imagined on the last plot, and represent each person as a dot along that line, we lose a little information, but we still get a pretty good _reconstruction_ of the data.

If you know how to do linear regression, you can probably work out how to draw such a line through the data, predicting the income from the salary or the other way around (and PCA is very similar to linear regression in many ways). However we'll need something that translates to higher dimensions, where we don't have a single target feature to predict. To do so, we'll develop a method purely from these first principles:
1. We want to represent the data using a small set of numbers per instance.
1. We will limit ourselves to linear transformations of the data to derive this small set.
3. We want to minimize the error in our reconstruction of the data. That is, when we map the data back to the original representation, as best we can, we want it to be as close as possible to the original.

## One-dimensional PCA

<p>We'll develop a one-dimensional version of PCA first. That is, we will represent each instance $\x_\gc{i}$ (row $\gc{i}$ in our data matrix $\X$), by a single number $z_\gc{i}$ as best we can. We will call $z_\gc{i}$ the <em>latent representation</em> of $\x_\gc{i}$.</p>

<aside>The phrase &ldquo;latent&rdquo; comes from the Latin for <em>being hidden</em>. This will make more sense when we see some of the other perspectives on PCA.
</aside>

To start with, we will assume that the data are **mean-centered**. That is, we have subtracted the mean of the data so that the mean of the new dataset is $0$ for all features.

<figure class="narrow">
<img src="/images/pca/mean-centered.svg" />
</figure>

<aside>
For now, think of this as a bit of necessary data pre-processing. We will see where this step comes from in the next part.
</aside>

<p>Our task is to find a linear transformation from \(\x_\gc{i}\) to \(z_\gc{i}\), and another linear transformation back again.
</p>

<p>A linear transformation from a vector $\x_\gc{i}$ to a single number is just the dot product with a vector of weights. We'll call this vector $\rc{\v}$. A linear transformation from a single number $z_\gc{i}$ to a vector is just the multiplication of $z_\gc{i}$ by another vector of weights. We'll call this vector $\rc{\w}$. This gives us </p>

<p>$$
\begin{align*}
z_\gc{i} &= \rc{\v}^T \x_\gc{i} \\
\x'_\gc{i} &= z_\gc{i} \rc{\w}
\end{align*}
$$</p>

<p>where $\x'_\gc{i}$ is the reconstruction for instance $\gc{i}$.</p>

Look closely at that second line. It expresses exactly the intuition we stated earlier: we will choose one <span class="rc">line</span>, represented by the vector \\(\rc{\w}\\), and then we just represent each data point by how far along the line it falls, or in other words, we represent \\(\x'_\gc{i}\\) as a multiple of \\(\rc{\w}\\).

<figure class="narrow">
<img src="/images/pca/projection.svg" />
</figure>

<p>All allowed values of \(\x'_\gc{i}\) are on the <span class="rc">dotted red line</span>, which is defined by our choice of \(\rc{\w}\). Where each individual ends up is defined by the multiplier \(z_\gc{i}\), wich is determined by the weights \(\rc{\v}\). Our objective is to choose \(\rc{\v}\) and \(\rc{\w}\) so that the reconstruction error, the distance between \(\x_\gc{i}\) and \(\x'_\gc{i}\) is minimized (over all \(\gc{i}\)).</p>

<figure class="narrow">
<img src="/images/pca/reconstruction.svg" />
</figure>

We can simplify this picture in two ways. 

<p>First, note that many different vectors $\rc{\w}$ define the same <span class="rc">dotted line</span> in the image above. So long as the vector points in the same direction, any length of vector defines the same line, and if we rescale \(z_\gc{i}\) properly, the reconstructed points \(\x'_\gc{i}\) will also be the same. To make our solution unique, we will <em>constrain</em> \(\rc{\w}\) to be a unit vector. That is, a vector with length one: \(\rc{\w}^T\rc{\w} = 1\).</p>

<aside>
To be more precise, this doesn't leave a unique solution, but two solutions, assuming that a single direction is optimal, since the unit vector can point top right, or bottom left. In other words, if $\rc{\w}$ is a solution, then so is $-\rc{\w}$.
</aside>

The second simplification is that we can get rid of \\(\rc{\v}\\). Imagine that we have  some fixed \\(\rc{\w}\\) (that is, the <span>dotted line</span> is fixed). Can we work out which choice of \\(\x_\gc{i}\\) on the line will minimize the <span class="bc">reconstruction error</span>? We will go into a bit of detail here, since it helps to set up some intuitions that will be important in the later sections.

<p>If you remember your linear algebra, you'll know that this happens when the line of the <span class="bc">reconstruction error</span> is orthogonal to the <span class="rc">dotted line</span>. In more fancy language, the optimal \(\x_\gc{i}\) is the <em>orthogonal projection</em> of \(\x_\gc{i}\) onto the dotted line. If you look at the image it's not too difficult to convince yourself that this it true. You can imagine the reconstruction error as a kind of rubber band pulling on $\x_\gc{i}$, and the point where it's orthogonal is where it comes to rest.</p>

In higher dimensions, however, such physical intuitions will not always save us. Since the relation between orthogonality and least squares is key to understanding PCA, we will take some time to prove this properly.

<div class="theorem">
<p><strong class="gc">Best approximation theorem (1D) </strong> Let $\rc{\w}, \x \in \mathbb{R}^n$,  let $\rc{W}$ be the line of all multiples of \(\rc{\w}\), and let $\rc{\hat \w}$ be the orthogonal projection of $\x$ onto $\rc{W}$. Then, for any other $\rc{\bar \w}$ in $\rc{W}$, we have 
$$
\text{dist}(\x, \rc{\hat \w}) < \text{dist}(\x, \rc{\bar \w})
$$
where $\text{dist}(\a, \b)$ denotes the Euclidean distance $\|\a - \b\|$
</p>
</div>

<div class="proof"><p><em>Proof (Adapted from [2, Ch. 7 Thm. 9]).</em> Note that $\a - \b$ is the vector that points from the tip of $\a$ to the bottom of $\b$. We can draw three vectors $\gc{\bar \w - \x}$, $\bc{\hat\w -\x}$ and $\rc{\bar \w - \hat \w}$ as follows:</p>

<figure class="narrow centering">
<img src="/images/pca/pythagoras.svg" class="three-quarters"/>
</figure>

<p>By basic vector addition, we know that </p>

$$
\gc{\bar \w - \x} = \bc{\hat\w -\x} + \rc{\bar \w - \hat \w} \text{,}
$$

<p><strong>so the three vectors form a triangle</strong> (when we arrange them as shown in the picture).</p>

<p>We also know, by construction, that $\bc{\hat\w -\x}$ is orthogonal to $\rc{\bar \w - \hat \w}$, so <strong>the triangle is right-angled</strong>.</p>

<p>Since we have a right angled triangle, the Pythagorean theorem tells us that the lengths of the sides of the triangles are related by</p>

$$
\gc{\text{dist}(\x, \bar \w)}^2 = \bc{\text{dist}(\hat \w, \x)}^2+ \rc{\text{dist}(\bar \w, \hat \w)}^2 \p
$$

<p>Since $\rc{\text{dist}(\bar \w, \hat \w)} > 0$ (because they are not the same point), we know that $\gc{\text{dist}(\x, \bar \w)}$ must be strictly larger than $\bc{\text{dist}(\hat \w, \x)}$.
<span class="qed" /></p>
</div>

<aside>
This result generalizes easily to any linear subspace $\rc{W}$ spanned by a set of vectors. See the appendix for a more general proof. This principle, the orthogonal projection as the best approximation, is at the heart of all linear least-squares approximations. For our current purposes, however, the one-dimensional result is all we need.
</aside>

<p>So, the best reconstruction $\x'_\gc{i}$ of the point $\x_\gc{i}$ on the line defined by $z \cdot \rc{\w}$ (however we choose $\rc{\w}$) is the orthogonal projection of $\x_\gc{i}$ onto $\rc{\w}$. So how do we compute an orthogonal projection? Let's look at what we have:</p>

<figure class="narrow centering">
<img src="/images/pca/projection2.svg" class="three-quarters"/>
</figure>

<p>
We've projected $\x_\gc{i}$ down onto $\rc{\w}$ and we've given the vector from the projection to the original the name $\bc{\r}$. By vector addition we know that $z\rc{\w} + \bc{\r} = \x_\gc{i}$, so $\bc{\r} = \x_\gc{i} - z\rc{\w}$.
</p>

<p>Two vectors are orthogonal if their dot product is zero, so we're looking for a $z$ such that $z\rc{\w}^T\bc{\r} = 0$, or equivalently, $\rc{\w}^T\bc{\r} = 0$. We rewrite</p>

$$
0 = \rc{\w}^T\bc{\r} = \rc{\w}^T\left(\x_\gc{i} - z\rc{\w}\right) = \rc{\w}^T\x_\gc{i} - z\rc{\w}^T\rc{\w} \p
$$

<p>This gives us $z = \rc{\w}^T\x_\gc{i} / \rc{\w}^T\rc{\w}$. And, since we'd already defined $\rc{\w}$ to be a unit vector (so $\rc{\w}^T\rc{\w} = 1$), we get $z = \rc{\w}^T\x_\gc{i}$.</p>

<p>Let's retrace our steps. We had two weight vectors: $\rc{\v}$ to encode $\x_\gc{i}$ into the single number $z_\gc{i}$, and $\rc{\w}$ to decode $\x_\gc{i}$ as $z_\gc{i}\rc{\w}$. We've now seen that for any given $\rc{\w}$, the best choice of $z_\gc{i}$ is $\rc{\w}^T\x_\gc{i}$. In other words, <strong>we can set $\rc{\v}$ equal to $\rc{\w}$ and use it to encode and to decode.</strong>
</p>

<aside>
Note that an important requirement for this result (and its generalizations coming up) is  that $\rc{\w}$ is a unit vector.
</aside>

<p>So, after all that, we can finally state precisely what we're looking for. Given $\rc{\w}$ our reconstruction is $\x'_\gc{i} = z_\gc{i} \cdot \rc{\w} = \oc{\w^T\x_i \cdot \w}$ . This means we can state our goal as the following constrained optimization problem:</p>

$$
\begin{align*}
&\argmin{\rc{\w}} \sum_\gc{i}|| \oc{\w^T\x_i \cdot \w}  - \x_\gc{i} || \\
&\;\;\;\;\text{such that } \rc{\w}^T\rc{\w} = 1 \p
\end{align*}
$$

How do we solve this? This is a simple problem and there are fast ways to solve it exactly. But we've done a lot of math already, and it's time to show you some results, so we'll just solve this by gradient descent for now. Basic gradient descent doesn't include constraints, but in simple cases like these, we  can use _projected_ gradient descent: after each gradient upate, we project the parameters back to the subset of parameter space that satisfies the constraint (in this case simply by dividing $\rc{\w}$ by its length).

<aside>If you don't know <a href="https://youtu.be/1lqaD0AsMfY">how gradient descent works</a>, you can just imagine a procedure that starts with a random $\rc{\w}$ and takes small steps in the direction that the function above decreases the most.
</aside>

We start by initializing $\rc{\w}$ to some arbitrary direction. Here's what the projections of the income data onto that $\rc{\w}$ look like.

<figure class="narrow">
<img src="/images/pca/random-w.svg" />
</figure>

The sum of the lengths of the <span class="bc">blue lines</span> is what we want to minimize. Clearly, there are better options than this choice of $\rc{\w}$. After a few iterations of gradient descent, this is what we end up with.

<figure class="narrow">
<img src="/images/pca/sol-w.svg" />
</figure>

You can think of the blue lines of the reconstruction error as pulling on the line of $\rc{\w}$ and the line of $\rc{\w}$ as pivoting on the origin.

For any dataset (of however many dimensions), the optimal line $\rc{\w}$ is uniquely determined. It's called the <strong>first principal component</strong>.

<aside>
If you've read other descriptions of PCA, you may be wondering at this point why I'm not talking about variance maximization. This is an alternative way to define PCA. We'll discuss it in <a href="/blog/pca-2">the next part</a>.
</aside>

What can we say about the meaning of the elements of $\rc{\w}$? Remember that it does two things: it encodes from $\x$ to $z$ and it decodes from $z$ to $\x'$. The encoding is a dot product: a weighted sum over the elements of $\x$.

In the first example of the income data, before we added the noise, the second feature was always exactly three times the first feature. In that case, we could just remember the first feature, and forget the second. That would be equivalent to encoding with the vector $\rc{(1, 0)}$. The compressed representation $z$ would be equivalent to the first feature and we could decode with $z \times\rc{(1, 3)}$. Or, we could encode with $\rc{(0, 1)}$ and decode with $\rc{(\tfrac{1}{3}, 1)}$.

Why are the encoding and decoding vectors different in these cases? Because when we proved that they were the same, we assumed that they were unit vectors. Our encoding vector is a unit vector, but the corresponding decoding vector isn't. PCA provides solution for which the encoder and the decoder are the same. It takes a mixture of both features, in different proportions (in our case $1/\sqrt{10}$ and $3/\sqrt{10}$) . There are a a lot of perspectives on exactly what this mixture means. We'll illustrate the first by looking at a higher dimensional dataset.

We'll use a dataset of grayscale images of faces called the Olivetti dataset [1]. Here is a small sample:

<figure class="narrow">
<img src="/images/pca/faces.png" />
</figure>

We will describe each pixel as a feature with a value between 0 (black) and 1 (white). The images are \\(64 \times 64\\) pixels, so each image can be described as a single vector of \\(\bc{4096\text{ real values}}\\) .

<aside>Note that by flattening the images into vectors we are entirely ignoring the grid structure of the features: we are not telling our algorithm whether two pixels are right next to each other, or at opposite ends of the image.
</aside>

The Olivetti data contains \\(\gc{400 \text{ images}}\\), so we end up with a data matrix \\(\X\\) of 
\\(\gc{400} \times \bc{4096}\\). 

<figure class="narrow">
<img src="/images/pca/images-diagram.svg" />
</figure>

This is a data scientist's worst nightmare: data with many more features than instances. With so many features, the space of possible instances is vast, and we only have a tiny number to learn from. Our saving grace is that, like the income/salary example, the features in this dataset are highly _dependent_: knowing the value of one pixel allows us to say a lot about the value of other pixels. 

For instance, pixels that are close together more often than not have similar values. The images are often roughly symmetric. All faces will have mostly uniform patches of skin in roughly the same place, and so on. 

In short, while our dataset is expressed in \\(\bc{4096}\\) dimensions, we can probably express the same information in many fewer numbers, especially if we are willing to trade off a little accuracy for better compression.

The procedure we will use to find the first principal component for this data is exactly the same as before&mdash;search for a unit vector that minimizes the reconstruction loss&mdash;except now the instances have <span class="bc">4096 features</span>, so $\rc{\w}$ has 4096 dimensions. First, let's look at the reconstructions.

<figure class="wide-margin">
<img src="/images/pca/face-reconstructions.png"/>
</figure>

You're disappointed, I can tell. Well, to be fair, we've compressed each image into a single number, we shouldn't be surprised that there isn't much left after we reconstruct it. But that doesn't mean that 1D PCA doesn't offer us anything useful. 

What we can do is look at the first principal component in data space: $\rc{\w}$ is a vector with one element per pixel, so we can re-arrange it into an image and see what each element in the vector tells us about the original pixels of the data. We'll color the positive elements of $\rc{\w}$ red and the negative values blue.

It looks like this:

<figure class="narrow centering tight">
<img src="/images/pca/firstpc.svg" class="three-quarters"/>
</figure>

If we think of this as the <em>encoding</em> vector, we can see a heatmap of which parts of the image the encoding looks at: the darker the red, the more the value of that pixel is added to $z$. The darker the blue, the more it is subtracted. 

If we think of this as the <em>decoding</em> vector, we can see that the larger $z$ is, the more of the red areas gets added to the decoded image, but the more of the blue areas get _subtracted_. That is, two red pixels are positively correlated, and a red and a blue pixel are negatively correlated. A bright red pixel and a light red pixel have the same relation as our monthly salary and quarterly income: one is (approximately) a multiple of the other.

<aside>
If you rerun the code yourself, you may get the same images with blues and reds reversed. Remember that there are two solutions, one the negative of the other.
</aside>

Another interpretation of the principal component is that it places the images in the dataset on a single line, which mean it orders the images along a single direction.

To see if there's any interpretable meaning to this ordering, we try moving along the line and decoding the points we find. We can start at the origin (the vector $\mathbf 0$). If we decode that, we get the mean of our dataset (the so called mean face). By adding or subtracting a little bit of the principal component, we can see what happens to the face.

<figure class="wide-margin">
<img src="/images/pca/int-mean-face.svg"/>
</figure>

A few things are happening at once: the skin is becoming less clear, the lines in the face become more pronounced, the glasses becomes more pronounced and the mouth curves upward. Most of these are consistent with moving from a young subject to an old one. 

We can test this on the faces in our dataset as well; our principal component is a direction in the data space, so we can start with an image from our data, and take small steps in the direction of the principal component, or in the opposite direction.

<aside>
You can think of this as manipulating the latent representation $z$ by adding some small amount $\epsilon$. If we decode such a point, we get $(z+\epsilon)\rc{\w} = z\rc{\w} + \epsilon\rc{\w} = \x' + \epsilon\rc{\w}$. We then just replace the reconstruction $\x'$ by the actual point $\x$. Note that we depend on the linearity of our transformation. For nonlinear variants of PCA, this trick won't work anymore.
</aside>

Here's what we get.

<figure class="wide-margin">
<img src="/images/pca/int-data-faces.svg"/>
</figure>

Note the manipulation of the mouth, in particular in face 41. As the corners of the mouth go up, the bottom lip goes from curving outward, with a shadow under the lip to curving inwards, folding under the teeth, with the shadow turning into a highlight.

Here we see the real power of PCA. While the reconstructions may not be much to write home about, the principal component itself allows us, using nothing but a linear transformation consisting of a single vector, to perform realistic manipulation of facial data, based on a dataset of just 400 examples.

## n-Dimensional PCA

Enough playing around in a one dimensional latent space. What if we want to improve our latent representations by giving them a little more capacity? How do we do that in a way that gives us better reconstructions, but keeps the meaningful directions in the latent space? 

Let's start by updating our notation. $\x_\gc{i}$ is still the same vector, row $\gc{i}$ in our data matrix $\X$, containing $\bc{m}$ elements, as many as we have features. $\z_\gc{i}$ is now also a vector (note the boldface). $\z_\gc{i}$ has $\rc{k}$ elements, where $\rc{k}$ is the number of latent features, a parameter we set. In the example above, $\rc{k}=1$. We'll drop the $\gc{i}$ subscript to clarify the notation.

<p>Let's say we set $\rc{k}=2$. If we stick to the rules we've followed so far&mdash;linear transformations by unit vectors&mdash;we end up with the following task: find two unit vectors $\rc{\w}_\rc{1}$ and $\rc{\w}_\rc{2}$ and define $\z = (z_\rc{1}, z_\rc{2})$ by $z_\rc{1} = \x ^T\rc{\w}_\rc{1}$ and $z_\rc{2} = \x^T \rc{\w}_\rc{2}$. Each latent vector gives us a reconstruction of $\x$. We sum these together to get our complete reconstruction.</p>

We can combine the two vectors $\rc{\w_1}$ and $\rc{\w_2}$ in a single matrix $\rc{\W}$ (as its columns) and write

$$
\begin{align*}
\z &= \rc{\W}^T\x \\
\x' &= \rc{\W}\z
\end{align*}
$$

Or, in diagram form:

<figure class="narrow centering">
<img src="/images/pca/multiplication-nd.svg" class="half"/>
</figure>

This would already work fine as a dimensionality reduction method. You can think of this as an autoencoder, if you're familiar with those. However, we can add one more rule to improve our reduced representation. **We will require that $\rc{\w_2}$ is orthogonal to $\rc{\w_1}$.**

<aside>
This decision is important, and has many useful consequences. We'll save those for later. For now, we'll just take it at face value.
</aside>

<p>In general, each component $\rc{\w}_r$ we add should be orthogonal to all components before it: for $\rc{k} = 3$ we add another unit vector $\rc{\w_3}$, which should be orthogonal to both $\rc{\w_1}$ and $\rc{\w_3}$. </p>

We can summarize these constraints neatly in one matrix equation: the matrix $\rc{\W}$, whose columns are our $\rc{\w}$ vectors, should satisfy:

$$
\rc{\W}^T\rc{\W} = \I
$$

where $\I$ is the $\rc{k} \times \rc{k}$ identity matrix. This equation combines both of our constraints: unit vectors, and mutually orthogonal vectors. On the diagonal of $\rc{\W}^T\rc{\W}$, we get the dot product of every column of $\rc{\W}$ with itself (which should be $1$ so that it is a unit vector) and off the diagonal we get the dot product of every column of $\rc{\W}$ with every other column (which should be $0$, so that they are orthogonal).

How do we find our $\rc{\W}$? The objective function remains the same: the sum of squared distances between the instances $\x$ and their reconstructions $\x'$. To satisfy the constraints, we can proceed in two different ways. We'll call these the _combined_ problem and the _iterative_ problem.

The **combined** problem is simply to add the matrix constraint above and stick it into our optimization function. This gives us 

$$
\begin{align*}
&\argmin{\rc{\W}} \sum_\x ||\rc{\W}\rc{\W}^T\x - \x||^2 \\
&\;\;\text{such that } \rc{\W}^T\rc{\W} = I
\end{align*}
$$

The **iterative** problem defines optima for the vectors $\rc{\w_r}$ in sequence. We use the same one-dimensional approach as before, and we find the principal components one after the other. Each step we add the constraint that the next principal component should be orthogonal to all the ones we've already found.

To put it more formally, we choose each $\rc{\w_1}, \ldots, \rc{\w_k}$ in sequence by optimizing

$$
\;\;\;\;\;\;\;\; \rc{\w_r} = \begin{cases} 
	&\argmin{\rc{\w}} \sum_\x ||\x^T\rc{\w} \times \rc{\w} - \x||^2 \\
	&\;\;\;\;\;\;\text{such that } \rc{\w}^T\rc{\w} = 1, \\
	&\;\;\;\;\;\;\text{and } \rc{\w}\perp\rc{\w_i} \text{ for } \rc{i} \in [1 \ldots \rc{r}-1]
\end{cases}
$$

These approaches are very similar. In fact, they're sometimes confused as equivalent in the literature. Let's look how they relate in detail.

The vector $\rc{\w_1}$ defined in the iterative problem, is the same vector we found in the one dimensional setting above: the first principal component. If the two problems are equivalent (i.e. they have the same set of solutions), this vector should always be one of the columns of $\rc{\W}$ in the combined problem.

To show that this isn't guaranteed, we can look at the case where $\rc{k} = \bc{m}$. That is, we use as many <span class="rc">latent features</span> as we have <span class="bc">features in our data</span>. In this case, the first vector $\rc{\w}$ returned by the iterative approach is still the first principal component, as we've defined it above. However, for the combined approach, we can set $\rc{\W} = \I$ for a perfect solution: clearly the columns of $\I$ are orthogonal unit vectors, and $\rc{\W}\rc{\W}^T\x - \x = \x^T\I\I^T - \x = \x -\x = \mathbf{0}$, so the solution is optimal.

In short, a solution to the combined problem may not be a solution to the iterated approach. What about the other way around, does solving the iterated problem always give us a solution to the combined problem? Certainly the vectors returned are always mutually orthogonal unit vectors, so the constraint is satisfied. Do we also reach a minimum? It turns out that we do.

<p><div class="theorem"><strong class="gc">Optimality of the iterative approach.</strong>
A solution to the iterative problem is also a solution to the combined problem. 
</div></p>

We will prove this in the second part. For now, you'll have to take my word for it. The combined problem has a large set of solutions, and the iterative approach provides a kind of unique point of reference within that space. 

<figure class="narrow centering">
<img src="/images/pca/venn.svg"/>
</figure>

We can say more about this later, but for now we will equate the iterative solution with PCA: the $\rc{\W}$ which not only minimizes the reconstruction error as a whole, but also each column of $\rc{\W}$ minimizes the reconstruction error in isolation, constrained to the subspace orthogonal to the preceding columns. The combined problem does not give us the principal components.

Using the iterative approach, and solving it by projective gradient descent, we can have a look at what the other principal components look like. Let's start with our income data, and derive the second principal component.

<figure class="narrow centering">
<img src="/images/pca/sol-w2.svg"/>
</figure>

This is a bit of an open door: in two dimensions, there is only one direction orthogonal to the first principal component. Still, plotting both components like this gives some indication of what the second component is doing. The first component captures the main difference between the people in our dataset: their monthly salary. The second component captures whatever is left; all the noise we introduced like end of year bonuses and alternative sources of income.

<p>Note how PCA reconstructs the original data points. Given the components $\rc{\w_1}, \ldots, \rc{\w_k}$, we represent each $\x$ as a weighted sum over these vectors where the latent features $z_\rc{1}, \ldots, z_\rc{k}$ are the weights:

$$
\x' = z_\rc{1}\rc{\w_1} + \ldots + z_\rc{k}\rc{\w_k}
$$
</p>

<figure class="narrow centering">
<img src="/images/pca/wsum.svg"/>
</figure>

That's it for the income dataset. We've reached $\rc{k} = \bc{m}$, so we can go no further.

Let's turn to the dataset of faces, where there are many more principal components to explore.

If we compute the first 30 principal components, we get the following reconstructions.

<figure class="wide">
<img src="/images/pca/face-reconstructions-k5.png"/>
</figure>

You can still tell the originals from the reconstructions, but many of the salient features now surivive the compression process: the direction of the gaze, the main proportions of the face, the basic lighting, and so on. By looking at the first five principal components, we can see how this is done.

<figure class="narrow centering">
<img src="/images/pca/five-pcs.svg"/>
</figure>

The first one we've seen already. It's flipped around, this time, with the blues and reds reversed, but it defines the same line in space. Note that the magnitude of the higher PCs is much lower: the first principal component does most of the work of putting the image in the right region of space, and the more PCs we add, the more they fine-tune the details. 

The second PC captures mostly lighting information. Adding it to a picture adds to the left side of the image, and subtracts from the right side. We can see this by applying it to some faces from the data.

<figure class="wide-margin">
<img src="/images/pca/int-data-faces-pc1.svg"/>
</figure>

The third PC does the same thing, but for top-to-bottom lighting changes. The fourth is a bit more subtle. It's quite challenging to tell from the plot above what the effect is. Here's what we see when we apply it to some faces.

<figure class="wide-margin">
<img src="/images/pca/int-data-faces-pc3.svg"/>
</figure>

The PC seems to capture a lot of the facial features we associate with gender. The faces on the left look decidedly more "female", and the faces on the right more male. It's a far cry from the face manipulation methods that are currently popular, but considering that we have only 400 examples, we are only allowed a linear transformation, and that the method originated in 1901 [4], it's not bad.

Before we finish up, let's look at two examples of PCA, as it's used in research.
 
Let's start with a problem which crops up often in the study of fossils and other bones. A trained anatomist can look at, say, a shoulder bone fossil, and tell instantly whether it belongs to a chimpanzee (which is not very rare) or an early ancestor of humans (which is extremely rare). Unfortunately such judgements are usually based on a kind of unconscious instinct, shaped by years of experience, which makes it hard to back it up scientifically. "This is is Hominid fossil, because it looks like one to me," isn't a very rigorous argument. 

PCA is often used to turn such a snap judgement into a more rigorous analysis. We take a bunch of bones that are entirely indistinguishable to the layperson, and we measure a bunch of <span class="gc">features</span>, like the distances between various parts on the bone. We then apply PCA and scatterplot the first two principal components.

Here is what such a scatterplot looks like for a collection of scapulae (shoulder bones) of various great apes and hominids.

<figure class="narrow">
<img src="/images/pca/bones.svg"/>
<figcaption>Reproduced from [4].</figcaption>
</figure>

The figure is from [4], which is <a href="https://www.pnas.org/content/112/38/11829">available online</a>, but the literature is full of pictures like these. Here, the authors took scans of about 350 scapulae. We can clearly see different species forming separate clusters. If we find a new scapula, we can simply measure it, project it to the first two principal components, and show that it ends up among the Homo Ergaster to prove that our find is special. What's more, not only can we tell the Hominin fossils apart, we see that they seem to lie on a straight line from chimpanzees to modern humans, giving a clue as to how human evolution progressed.

<aside>
This analysis is based on full 3D scans of the bones, but it also works if you measure a number of features by hand.
</aside>

One final example, to really hammer home the magic of PCA. In [5] (also <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2735096/">available</a>), the authors applied PCA to a database of 1387 European DNA sequences. For each instance, they measured about half a million sites on the DNA sequences to use as features. This is similar to the face example: many more features than instances.

The authors applied PCA, and plotted the first two principal components. They colored the instances by the person's ancestral country of origin (the country of origin of the grandparents if available, otherwise the person's own country of origin). Here is what they saw.

<figure class="narrow">
<img src="/images/pca/europe.svg"/>
<figcaption>Reproduced from [5].</figcaption>
</figure>

The first principal component corresponds roughly to how far north the person lives (or their ancestors did) and the second principal component to how far east they live. This means that a scatterplot shows up as a fuzzy map of Europe. If we sent a thousand DNA samples off to aliens on the other side of the galaxy, they could work out a rough image of the geography of our planet.

## Conclusion

Wrapping up, what have we learned so far? We've defined PCA as an iterative optimization problem designed to compress high dimensional data into fewer dimensions, and to minimize the resulting reconstruction loss. We've shown one simple way to find this solution, a laborious and inaccurate way, but enough to get the basic idea across. We then looked at various practical uses of PCA: analyzing human faces, human fossils, and human DNA. We showed that in many cases, PCA magically teases out quite high-level semantic features hidden in the data: the species of the fossil, the location of the subject in Europe, or the subject's age.

What we haven't discussed fully, is where this magical property comes from. We've shown that it isn't _just_ the compression objective, since optimizing just that in one single optimization doesn't lead to the PCA solution. Among the set of all solutions that minimize the reconstruction error, the PCA solution takes a special place. Why that's the case, and why it this should emerge form optimizing the principal components one by one, greedily if you will, instead of all together, we will discuss in the <a href="/blog/pca-2">next part</a>. To do so, we'll need to dig into the subject of _eigenvectors_, the underlying force behind almost everything that is magical about linear algebra.


<strong>Acknowledgements.</strong> Many thanks to <a href="https://emilevankrieken.com/">Emile van Krieken</a> for corrections and suggestions.

## References

[1] Olivetti Faces data. (<a href="https://scikit-learn.org/stable/datasets/index.html#olivetti-faces-dataset">sklearn</a>) Produced by <a href="https://www.cl.cam.ac.uk/research/dtg/www/">AT&amp;T Laboratories Cambridge</a>, between 1992 and 1994. <br/>
[2] Linear Algebra and its applications. David C. Lay, 1994. Addison Wesley.<br/>
[3] <a href="https://zenodo.org/record/1430636#.X1yfx9axXOQ">On Lines and Planes of Closest Fit to Systems of Points in Space.</a> K. Pearson. 1901   doi:10.1080/14786440109462720.<br/>
[4] <a href="https://www.pnas.org/content/112/38/11829">Fossil hominin shoulders support an African ape-like last common ancestor of humans and chimpanzees</a>, Young et al. 2015 PNAS<br/>
[5] <a href="https://www.nature.com/articles/nature07331">Genes mirror geography within Europe</a>, Novembre et al. 2008 Nature.

## Appendix

### Helpful linear algebra properties 

The following properties may be good to reference when following the proofs and more technical parts in this series. Anything that holds for matrix multiplication holds fort vector/matrix multiplication and for vector/vector multiplication as a special case.

If you want an exercise to test yourself, see which of the following properties you need to show that: for a dataset $\x_1, \ldots, \x_\gc{n}$ the dot product of the mean of the data  with a vector $\rc{\w}$ is the same as the mean of the dot products of each individual instance with $\rc{\w}$.

* Matrix multiplication does not commute: $\A\B \neq \B\A$ in general. Matrix multiplication _does_ distribute $\A\B\C = \A(\B\C) = (\A\B)\C$.
* Any scalar in a matrix multiplication can be moved around freely: $s\A\B\C =\A s\B\C = \A\B s\C = \A\B\C s = \sqrt{s}\A\B\C\sqrt{s}$ (matrix multiplication is homogeneous).
* Matrix multiplication is additive $\A(\B + \C) = \A\B + \A\C$.
* To take a transposition operator inside a multiplication, flip the order of the multiplication and transpose each element individually: $(\A\B\C)^T = \C^T\B^T\A^T$. The same holds for matrix inversion, if all matrices ar invertible.
* An invertible matrix $\A$ is a square matrix for which a matrix $\A^{-1}$ exists (the inverse) such that $\A\A^{-1} = \I$.
* To move a matrix multiplication "to the other side," multiply (on the same side as the original multiplication) by the inverse: $$\A\B = \C \kc{\Rightarrow \A^{-1}\A\B = \A^{-1}\C \Rightarrow \I\B = \A^{-1}\C } \Rightarrow \B = \A^{-1}\C$$. This requires an invertible matrix.
* Invertable matrices are fine when used in derivations, but in practice, the operation can be numerically unstable, so it's usually avoided by rewriting to a more stable form.
* The **dot product** of two vectors $\x$ and $\y$ is $\x^T\y = \sum_i x_iy_i$. $\x$ and $\y$ are **orthogonal** if $\x ^T\y = 0$. This implies that the angle between them (in their shared plane) is 90&deg;.
* When we multiply two matrices, $\C = \A\B$ we are essentially computing all dot products of a _row_ of $\A$ and a _column_ of $\B$, and arranging the result in a matrix. $C_{ij}$ is the dot product of row $i$ of $\A$ and column $j$ of $\B$. 
* The length of a vector is the square root of its dot product with itself.
* A **unit vector** is a vector of length 1. Since $\sqrt{1} = 1$, we can characterize unit vectors by $\x^T\x = 1$.
* All vectors are column vectors unless otherwise noted. To save whitespace, we may write these inline as $\x = (0, 1, 0)$, but they should still be considered column vectors. The transpose of a column vector is a row vector.

### General best approximation theorem

We proved earlier that the orthogonal projection of a point $\x$ onto a line $\rc{W}$ is the closest point in $\rc{W}$ to $\x$. To generalize that result, we'll take at _a set of vectors_  $\rc{\w_1}, \ldots, \rc{\w_k}$ and look at the _subspace_ of points defined by all sums of all multiples of one or more of the vectors. This subspace is called the <em>space spanned by the vectors</em>, which we write as $\text{Span } \\{ \rc{\w_1}, \ldots, \rc{\w_k} \\}$. Any point that we can define by summing one or more multiples of vectors in $\\{ \rc{\w_1}, \ldots, \rc{\w_k} \\}$ is in the set $\text{Span } \\{ \rc{\w_1}, \ldots, \rc{\w_k} \\}$.

<aside>
For a simple example, think of two vectors $\rc{a}$ and $\rc{b}$ pointing in different directions. Together they define a plane, and any point on that plane can be defined as $\alpha \rc{\a} + \beta \rc{b}$ for some scalars $\alpha$ and $\beta$.
</aside>

We call a vector $\x$ <strong>orthogonal to a set $\rc{\W}$</strong> if it is orthogonal to every vector in $\rc{\W}$

<p><div class="theorem">
<p><strong class="gc">Best approximation theorem (n-dimensional)</strong> Let $\rc{\w_1}, \ldots, \rc{\w_k}, \x \in \mathbb{R}^n$,  let $\rc{W} = \text{Span } \{\rc{\w_1}, \ldots, \rc{\w_k} \}$, and let $\rc{\hat \w}$ be an orthogonal projection of $\x$ onto $\rc{W}$. Then, for any other $\rc{\bar \w}$ in $\rc{W}$, we have </p>
$$
\text{dist}(\x, \rc{\hat \w}) < \text{dist}(\x, \rc{\bar \w}) \p
$$
</div>
<div class="proof"> <p><em>Proof.</em> The proof has the same structure as that of the 1-dimensional case. As before,  draw three vectors $\gc{\bar \w - \x}$, $\bc{\hat\w -\x}$ and $\rc{\bar \w - \hat \w}$.</p>

[Image]

<p>By vector addition, these three vectors can be arranged in a triangle. </p>

<p>$\rc{\bar \w}$ and  $\rc{\hat \w}$ are both in $\rc{W}$ so $\rc{\bar \w - \hat \w}$ is too.</p>

<aside>
Why? Because $\rc{W}$ is spanned by $\{\rc{\w_1}, \ldots, \rc{\w_k} \}$, we can write $\rc{\hat \w} = \hat\omega_1\rc{\w_1} + \ldots + \hat\omega_k\rc{\w_k}$ and $\rc{\bar \w} = \bar\omega_1\rc{\w_1} + \ldots + \bar\omega_k\rc{\w_k}$. If we subtract one from the other, we get 

$$\begin{align*}
\rc{\bar \w} - \rc{\hat \w} &= \bar\omega_1\rc{\w_1} + \ldots + \bar\omega_k\rc{\w_k} - \hat\omega_1\rc{\w_1} - \ldots - \hat\omega_k\rc{\w_k} \\
&= (\hat\omega_1 -\bar\omega_1) \rc{\w_1} + \ldots + (\hat\omega_k - \bar\omega_k) \rc{\w_k}
\end{align*}
$$ 

Thus, $\rc{\bar \w} - \rc{\hat \w} \in \rc{W}$.
</aside>

<p>Since $\rc{\bar \w - \hat \w} \in \rc{W}$, $\bc{\hat\w -\x}$  is orthogonal to  $\rc{\bar \w - \hat \w}$ by definition. This makes our triangle a right-angled one again, and as before, we have </p>

$$
\gc{\text{dist}(\x, \bar \w)}^2 = \bc{\text{dist}(\hat \w, \x)}^2+ \rc{\text{dist}(\bar \w, \hat \w)}^2 \p
$$

<p>from which the theorem follows.<span class="qed" /></p>
</div></p>


<!-- {% endraw %} -->
