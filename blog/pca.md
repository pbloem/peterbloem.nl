---
title: A friendly introduction to Principal Component Analysis
date: 31-01-2020
math: true
code: true
---
<!-- {% raw %} -->

<header>
<h1>A friendly introduction to PCA</h1>
<div class="subh1">With explanations of eigenvectors, eigenvalues, and the singular value decomposition</div>
</header>

<ul class="links">
	<li>31 Jan 2020</li>
	<li><a href="https://github.com/pbloem/blog/blob/master/2020/pca.ipynb">notebook on github</a></li>
</ul>

<aside>
Principal component analysis (PCA) is probably the most magical linear method in data science. Unfortunately, while it's always good to have a sense of wonder about mathematics, if a method seems too magical it usually means that there is something left to understand. After years of almost, but not quite fully understanding these methods, here is my attempt to explain it fully, hopefully leaving some of the magic intact.
</aside>

We will work from the outside in: we will view PCA first as a way of finding a smaller representation of a dataset. This is a typical machine learning problem: minimize the reconstruction loss from the compressed representations, and all we need to work it out is basic gradient descent with a few tricks for satisfying constraints.

Most of the technical stuff only becomes necessary when we want to compute  PCA _efficiently_: this is where the **spectral theorem**, the **eigenvalues and -vectors**, and the **singular value decomposition** come in to the story, they make PCA feasible, and give us a deeper understanding of what we're doing.

## Part 1: The basics

Let's begin by setting up some basic notation. We are faced with some high-dimensional dataset of examples described with real-valued features. That is, we have \\(n\\) _examples_ \\(\x_i\\) and each example is described by a vector of \\(d\\) real values. We describe the dataset as a whole as an \\(\gc{n} \times \bc{d}\\) matrix \\(\X\\); that is, we arrange the examples as rows, and the features as columns.

<figure class="centering">
<img src="/images/pca/data-diagram.svg" class="tile2"/>
</figure>
As a running example, we'll use a dataset of grayscale images of faces. Specifically, we will use the Olivetti dataset [1]. Here is a small sample:

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

This is a data scientist's worst nightmare: data with many more features than instances. With so many features, the space of possible instances is vast, and we only have a tiny number to learn from. Our saving grace is that the features in this dataset are highly _dependent_: knowing the value of one pixel allows us to say a lot about the value of other pixels. 

For instance, pixels that are close together more often than not have similar values. The images are often roughly symmetric. All faces will have mostly uniform patches of skin in roughly the same place, and so on. 

In short, while our dataset is expressed in \\(\bc{4096}\\) dimensions, we can probably express the same information in many fewer numbers, especially if we are willing to trade off a little accuracy for better compression.

For a simple example, imagine that we have a dataset of <span class="gc">100 people</span> with <span class="bc">2 features</span> measured per person: their monthly salary and their yearly income. The second is just the first times 12, so this data is <em>redundant</em>. One value can be computed from the other, so we only need to store one number per person. Here's what that looks like in a scatterplot.

<figure class="narrow">
<img src="/images/pca/income1.svg" />
</figure>

Our intuition that we really only need one number to represent the data show up here in the fact that _the data form a line__. So long as we know what that line is, we only need to store how far along the line each number falls. 

<aside>Of course, there might be more complex relations between two features, like a parabola or an exponential curve. **In PCA we simplify things by only exploiting linear relations.** We'll look into some nonlinear variations at the end.</aside>

Of course, data in the wild is never this clean. Let's introduce some small variations between the monthly salary and the income at the end of the year. Some people may have changed jobs, some people may get bonuses or vacation allowances, some people may have extra sources of income. Here's a more realistic version of the data.

<figure class="narrow">
<img src="/images/pca/income2.svg" />
</figure>

The data is no longer perfectly linear, but it still seems _pretty_ linear. If we imagine the same line we imagined on the last plot, and represent each person as a dot along that line, we lose a little information, but we still get a pretty good reconstruction of the data.

If you know how to do linear regression, you can probably work out how to draw such a line through the data (and PCA is very similar to linear regression in many ways), but we'll need something that translates to higher dimensions, where we don't have a particular target feature to predict. To do so, we'll develop the method purely from these first principles:
1. We want to represent the data using a small set of numbers per instance.
1. We will limit ourselves to linear transformations of the data to derive this small set.
3. We want to minimize the error in our reconstruction of the data. That is, when we map the data back to the original representation, as best we can, we want it to be as close as possible to the original.

### One-dimensional PCA

We'll develop a one-dimensional version of PCA first. That is, we will represent each instance as a single number as best we can.

To start with, we will assume that the data are **mean-centered**. That is, we have subtracted the mean of the data so that the mean of the new dataset is 0 for all features.

<aside>
For now, think of this as a bit of necessary data pre-processing. We will show later that we can add a uniform translation to the PCA transformation (like a bias in a neural network), and derive the mean centering transformation as the optimal translation.
</aside>

<p>We will call a single instance of our data \(\x_\gc{i}\) (row \(\gc{i}\) in our data matrix \(\X\). We will map \(\x_\gc{i}\) to a single number, which we will call \(z_\gc{i}\). Our task is to find a linear transformation from \(\x_\gc{i}\) to \(z_\gc{i}\), and another linear transformation back again.
</p>

<p>A linear transformation from a vector \(\x_\gc{i}\) to a single number is just the dot product with a vector of weights. We'll call this vector \\(\rc{\v}\\). A linear transformation from a single number \\(z_\gc{i}\\) to a vector is just the multiplication of \\(z\\) by another vector of weights. We'll call this vector \\(\rc{\w}\\). This gives us </p>

<p>$$
\begin{align*}
z_\gc{i} &= \rc{\v}^T \x_\gc{i} \\
\x'_\gc{i} &= z_\gc{i} \cdot \rc{\w}
\end{align*}
$$</p>
where \\(\x'_\gc{i}\\) is the reconstruction for instance \\(\gc{i}\\).

Let's look at that second line in more detail. It expresses exactly the intuition we stated earlier: we will choose one <span class="rc">line</span>, represented by the vector \\(\rc{\w}\\), and then we just represent each data point by how far along the ling it fall, or in other words, we represent \\(\x'_\gc{i}\\) as a multiple of \\(\rc{w}\\).

<figure class="narrow">
<img src="/images/pca/projection.svg" />
</figure>

<p>All allowed values of \(\x'_\gc{i}\) are on the <span class="rc">dotted red line</span>, which is defined by our choice of \(\rc{\w}\). Where each individual ends up is defined by the multiplier \(z_\gc{i}\), wich is determined by the weights \(\rc{\v}\). Our objective is to choose \(\rc{\v}\) and \(\rc{\w}\) so that the reconstruction error, the distance between \(\x_\gc{i}\) and \(\x'_\gc{i}\) is minimized (over all \(\gc{i}\)).</p>

<figure class="narrow">
<img src="/images/pca/reconstruction.svg" />
</figure>

We can simplify this picture in two ways. 

<p>First, note that the <span class="rc">dotted line</span> in the image above can be defined by many choices of \(\rc{\w}\): so long as the vector points in the same direction, any length of vector defines the same line, and if we scale \(z_\gc{i}\) properly, the reconstructed points \(\x'_\gc{i}\) will also be the same. To make our solution unique, we will <em>constrain</em> \(\rc{\w}\) to be a unit vector. That is, a vector with length one: \(\rc{\w}^T\rc{\w} = 1\).</p>

<aside>
To be more precise, this doesn't leave a unique solution, but two solutions, assuming that a single direction is optimal, since the unit vector can point top right, or bottom left. 
</aside>

The second simplification is that we can get rid of \\(\rc{\v}\\). We will imagine that we have  some fixed \\(\rc{\w}\\) (that is, the <span>dotted line</span> is fixed). And work out which choice of \\(\x_\gc{i}\\) on the line will minimize the <span class="bc">reconstruction error</span>? We will go into a bit of detail here, since it helps to set up some intuitions that will be important in the later sections.

</p>If you remember your linear algebra, you'll know that this happens when the line of the reconstruction error is orthogonal to the dotted line. In more fancy language, the optimal \(x_\gc{i}\) is the _orthogonal projection_ of \(x_\gc{i}\) onto the dotted line. If you look at the image it's not too difficult to convince yourself that this it true. You can imagine the reconstruction error as a kind of rubber band pulling on $\x_\gc{i}$, and the point where it's orthogonal is where it comes to rest.<p>

In higher dimensions, however, such physical intuitions will not always save us. Since the relation between orthogonality and least squares is key to understanding PCA, we will take some time to prove this properly.

<p><strong>Best approximation theorem (1D) </strong> Let $\rc{\w}, \x \in \mathbb{R}^n$,  let $\rc{W}$ be the line of all multiples of \(\rc{\w}\), and let $\rc{\hat \w}$ be the orthogonal projection of $\x$ onto $\rc{W}$. Then, for any other $\rc{\bar \w}$ in $\rc{W}$, we have 
$$
\text{dist}(\x, \rc{\hat \w}) < \text{dist}(\x, \rc{\bar \w})
$$
where $\text{dist}(\a, \b)$ denotes the Euclidean distance $||\a - \b||$
</p>

<p><em>Proof (Adapted from [2, Ch. 7 Thm. 9]).</em> Note that $\a - \b$ is the vector that points from the tip of $\a$ to the bottom of $\b$. We can draw three vectors $\gc{\bar \w - \x}$, $\bc{\hat\w -\x}$ and $\rc{\bar \w - \hat \w}$ as follows:</p>

<figure class="narrow centering">
<img src="/images/pca/pythagoras.svg" class="three-quarters"/>
</figure>

By basic vector addition, we know that 

$$
\gc{\bar \w - \x} = \bc{\hat\w -\x} + \rc{\bar \w - \hat \w} \text{,}
$$

<p><strong>so the three vectors form a triangle</strong> (when we arrange them as shown in the picture).</p>

<p>We also know, by construction, that $\bc{\hat\w -\x}$ is orthogonal to $\rc{\bar \w - \hat \w}$, so <strong>the triangle is right-angled</strong>.</p>

<p>Since we have a right angled triangle, the Pythagorean theorem tells us that the lengths of the sides of the triangles are related by</p>

$$
\gc{\text{dist}(\x, \bar \w)}^2 = \bc{\text{dist}(\hat \w, \x)}^2+ \rc{\text{dist}(\bar \w, \hat \w)}^2 \p
$$

<p>Since $\rc{\text{dist}(\bar \w, \hat \w)} > 0$ (since they are not the same point), we know that $\gc{\text{dist}(\x, \bar \w)}$ must be strictly larger than $\bc{\text{dist}(\hat \w, \x)}$.
<span class="qed" /></p>








---

To minimize the reconstruction error, we can just state that we're looking for the \\(\rc{\w)\\) and \\(\rc{\v}\\) for which the distance between \\(\x_\gc{i}\\) \\(\x'_\gc{i}\\), summed over all instance \\(\gc{i}\\), is minimal.

<p>$$
\begin{align*}
  &\argmin{\rc{\w}, \rc{\v}} \sum_\gc{i} \text{distance}(\x'_\gc{i}, \x_\gc{i}) \\
= \;\;&\argmin{\rc{\w}, \rc{\v}} \sum_\gc{i}|| \x'_\gc{i} - \x_\gc{i} || 
\end{align*}
$$</p>

If we fill in the definition of \\( \x'_\gc{i} \\), we get

$$
\argmin{\rc{\w}, \rc{\v}} \sum_\gc{i}||\;  \rc{\v} \cdot z_\gc{i} - \x_\gc{i} || 
$$

and if we fill in the definition of \\(z_\gc{i}\\) we get

$$
\argmin{\rc{\w}, \rc{\v}} \sum_\gc{i} ||\; \rc{\v} \cdot \left ({\x_\gc{i} }^T \rc{\w}\right)  - \x_\gc{i} || \p
$$

The euclidean norm is a square root of a sum. We can get rid of the square-root without changing the maximum




#### alternative perspective 1: variance maximization

- New representation (by linear transformation) which minimizes reconstruction loss.

#### alternative perspective 2: basis transformation

#### Minimizing reconstruction loss is maximizing variance.

- Minimizing error is maximizing variance
- Setting the unit to the data variance achieves this
- ...
- Expressing the normal distribution as a linear transformation


## Part 2: The normal distribution


## Part 3: The eigenvalues and the eigenvectors


## Part 4: The Singular Value Decomposition

## Part 5: Cleaning up

### Mean centering

### Non-linear PCA

### Other PCAs

## PCA in a Deep Learning World

-- conclusion
--- fast, hands-free and most importantly interpretable. Analysis (ref Antske?)

## Acknowledgements
## References

[1] Olivetti data
[2] Linear Algebra and it's applications. David C. Lay


<!-- {% endraw %} -->
