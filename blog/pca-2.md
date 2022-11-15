---
title: Eigenvalues and eigenvectors
date: 31-01-2020
math: true
code: true
---
<!-- {% raw %} -->

<header>
<h1>Eigenvalues and eigenvectors</h1>
<div class="subh1">part 2 in a series on principal component analysis </div>
</header>

<ul class="links">
	<li>27 Sep 2020</li>
	<li><a href="https://github.com/pbloem/blog/blob/master/2020/pca/pca-2.ipynb">notebook</a></li>
		<li><a href="/blog/pca">part 1</a></li>
		<li><a href="/blog/pca-3">3</a></li>
		<li><a href="/blog/pca-4">4</a></li>
		<li>5</li>
</ul>

In <a href="/blog/pca">part 1</a> of this series, we took what I think is the most intuitive route to defining PCA: framing the method in terms of reconstruction error. The solution method we used wasn't very efficient or stable, and some parts of the "why" question were left unresolved, but we answered the "how" question well enough to show the method in action and hopefully convince you that it's worth digging a little deeper.

We'll start by tying up one of the loose ends from the last part. We defined PCA in terms of reconstruction error, but most other explanations instead  define it in terms of **variance maximization**. 

I started with the reconstruction error, since it requires fewer assumptions, and the required assumptions feel more intuitive. However, to explain the details of what happens under the hood, the variance perspective is more helpful, so we'll start by adding that to our toolbelt.

## Minimal reconstruction error is maximal variance

<p>In the previous part, we defined PCA as a solution to the following problem: for a mean-centered set of instances $\x_\gc{i}$ find a sequence of $\rc{k}$  unit vectors $\rc{\w_1}, \ldots, \rc{\w_k}$ where each unit vector is defined by</p>

<p>$$
\;\;\;\;\;\;\;\; \rc{\w_r} = \begin{cases} 
	&\argmax{\rc{\w}} \sum_\gc{i} \|\x_\gc{i}^T\rc{\w}\rc{\w} - \x_\gc{i}\|^2 \\
	&\;\;\;\;\;\;\text{such that } \rc{\w}^T\rc{\w} = 1, & \bc{\text{(a)}}\\
	&\;\;\;\;\;\;\text{and } \rc{\w}\perp\rc{\w_j} \text{ for } \rc{j} \in [1 \ldots \rc{r}-1]& \bc{\text{(b)}}
\end{cases}
$$</p>

That is, each unit vector defines an approximation of $\x_\gc{i}$, and the objective is to keep the distance between the reconstruction and the original instance as small as possible, while ensuring that <span class="bc">(a)</span> the vector is a unit vector, and <span class="bc">(b)</span> the vector is orthogonal to all preceding vectors.

<p>The variance maximization objective takes the same general form, but instead of minimizing the reconstruction error, it aims to choose $\rc{\w}$ to <em>maximize</em> the variance of the data projected onto $\rc{\w}$. </p>

<p>As in the previous part, we'll start with the one-dimensional case. We choose a single unit vector $\rc{\w}$ and project the data onto it orthogonally. That means that for every instance $\x_\gc{i}$, we get a single number $z_\gc{i}$ which is defined by $\x_\gc{i}^T\rc{\w}$.</p>
 
This time, our objective is to choose $\rc{\w}$ so that the variance among the set of $z_\gc{i}$ is maximized. That means that in this image

<figure class="narrow">
<img src="/images/pca/random-w.svg" />
</figure>

<p>we want to choose $\rc{\w}$ so that the red points are spread out as widely as possible.</p>

Why is this the same as minimizing the reconstruction error? It's easy to see this if we draw a a diagram for a single instance.

<figure class="narrow">
<img src="/images/pca/recvar-diagram.svg" />
</figure>

<p>Note that $\rc{\w}$ is a unit vector, so for the length of the bottom edge of the triangle we have  $\|\x'_\gc{i}\| = \|\rc{\w}z_\gc{i}\| = z_\gc{i}$.</p>


<p>By Pythagoras, we have $\|\x_\gc{i}\|^2 = \|\bc{\r}\|^2 + {z_\gc{i}}^2$. The vector $\x_\gc{i}$ remains constant, since that is given by the data. The only thing we change is the direction of the vector $\rc{\w}$. If we change that to make the reconstruction error $\|\bc{\r}\|$ smaller, the distance $z_\gc{i}$ must get larger. The sum of the squares of all $\z_\gc{i}$'s is the variance of the data.</p>

<aside>
I first learned about the equivalence between variance maximization and reconstruction error minimization from <a href="http://alexhwilliams.info/itsneuronalblog/2016/03/27/pca/">this blog post</a> by <a href="http://alexhwilliams.info/">Alex Williams</a>, which uses a similar diagram.
</aside>

Thus, the first principal component is the vector $\rc{\w}$ for which the data has maximum variance when projected onto $\rc{\w}$. For the sake of completeness let's work this into a proper proof. There's some technical stuff coming up, so we had better get into a more formal mind set.

<div class="theorem">
<p><strong class="gc">Equivalence of error and variance optimization.</strong>
The vector $\rc{\w}$ that minimizes the reconstruction error among the reconstructed instances $\x'_\gc{i}$, maximizes the variance among the projections $z_\gc{i}$.</p>
</div>
<div class="proof">
<p><em>Proof.</em> The maximal variance objective can be stated as</p>
$$
\begin{align*}
&\argmax{\rc{\w}}\; \kc{\frac{1}{n}} \sum_\gc{i} (\bar z - z_\gc{i})^2
\end{align*}
$$
<p>The objective inside the argmax is simply the definition of variance. We can drop the constant multiplier $\kc{1/n}$, since it doesn't affect where the maximum is. We can show that $\bar z$, the mean of the projections is 0:</p>
$$
\bar z = \kc{\frac{1}{n}}\sum_\gc{i} \rc{\w}^T\x_\gc{i} = \rc{\w}^T\left( \kc{\frac{1}{n}} \sum_\gc{i} \x_\gc{i}\right) = \rc{\w}^T \mathbf{0} \p
$$
<aside>The last step follows from the assumption that the data is mean-centered.</aside>
<p>Thus our objective simplifies to </p>

$$
\begin{align*}
&\argmax{\rc{\w}} \sum_\gc{i} {\z_\gc{i}}^2 \p
\end{align*}
$$

<p>From our diagram above, we know that $\|\x_\gc{i}\|^2 = \|\bc{\r}\|^2 + z_\gc{i}^2$, or, equivalently</p>

$$
\begin{align*}
\|\x_\gc{i}\|^2 &= \|\bc{\x_\gc{i} - \x'_\gc{i}}\|^2 + z_\gc{i}^2 \\
z_\gc{i}^2 &= \|\x_\gc{i}\|^2 - \|\bc{\x_\gc{i} - \x'_{\gc{i}}}\|^2 \p
\end{align*}
$$

<p>Filling this in to the optimization objective, we get </p>

$$
\begin{align*}
&\argmax{\rc{\w}} \sum_\gc{i} \kc{||\x_i||^2} \oc{-} ||\x_\gc{i} - \x_\gc{i}'||^2 \p
\end{align*}
$$

<p>where $\kc{||\x_i||^2}$ is a constant we can remove without affecting the maximum and removing <span class="oc">the minus</span> turns the maximum into a minimum. Thus, we end up with </p>

$$
\begin{align*}
&\argmin{\rc{\w}} \sum_\gc{i} ||\x_\gc{i} - \x'_\gc{i}||^2
\end{align*}
$$

<p>which is the objective for minimizing the reconstruction loss. <span class="qed"/></p>

</div>

<p>The rest of the procedure is the same as before. Once we've chosen $\rc{\w_1}$ to maximize the variance, we choose $\rc{\w_2}$ to maximize the variance and to be orthogonal to $\rc{\w_1}$, we choose $\rc{\w_3}$ to maximize the variance and to be orthogonal to  $\rc{\w_1}$ and to  $\rc{\w_2}$ and so on.</p>

In the previous part, we also defined a <strong>combined problem</strong>, which combined all the vectors together in one optimization objective. We can work out an equivalent for the variance perspective (the proof is in the appendix). 

<p><div class="theorem"><strong class="gc">Equivalence of combined optimization.</strong> The combined problem for reconstruction error minimization<br />
$$\begin{align*}
&\argmin{\rc{\W}} \sum_\gc{i} \|\x_\gc{i} - \x'_\gc{i}\|\\
&\;\;\;\text{such that } \rc{\W}^T\rc{\W} = \I\\
\end{align*}$$
is equivalent to the following variance maximization problem
$$\begin{align*}
&\argmax{\rc{\W}} \sum_{\gc{i}, \rc{r}} {z_{\gc{i}\rc{r}}}^2 \;\;\;\;\;\text{with } z_{\gc{i}\rc{r}} = \rc{\w_r}^T\x_\gc{i}\\
&\;\;\;\text{such that } \rc{\W}^T\rc{\W} = \I \p\\
\end{align*}$$
</div></p>


If we want to optimize a matrix $\rc{\W}$ with mutually orthogonal unit vectors for columns in one go, then maximizing the sum of the variances in all <span class="rc">latent directions</span> is equivalent to minimizing the reconstruction loss defined in the combined approach  

One consequence is that since $\rc{\W} = \I$ was a solution of the error minimization problem (with $\rc{k} = \bc{m}$) it must be a solution for the variance maximization problem as well. 

<p>This tells us something interesting. If we set $\rc{\W} = \I$, then $\sum_{\gc{i}, \rc{r}} {z_{\gc{i}\rc{r}}}^2$ is just the sum of all the variances of all the features in our data. For all solutions at $\rc{k} = \bc{m}$, this must be the total variance among the latent features. For solutions to the problem at some $\rc{k} < \bc{m}$ the variance is less than or equal to this value. Each principal component adds a little variance ot the total sum of variance, and when we have enough principal components to reconstruct the data perfectly, the sum of the variances along the principal components equals the sum total variance in the data.</p>

Here's what that looks like for the Olivetti faces data. 

<figure class="narrow">
<img src="/images/pca/sum-variance.svg" />
</figure>

We plot the sum total of the variances of the data as a <span clas="gc">green vertical line</span> and the sum total of the PCA solution for increasing $\rc{k}$ as a red line.

<aside>
In this case, we have data that is wider than it is tall, so we reach the ceiling before $\rc{k} = \bc{m}$, when $\rc{k}=\gc{n}$. This is to do with the <em>rank</em> of the matrix $\X$. We'll shed some light on this in the last part of the series.
</aside>

This shows that we can think of the total variance in all directions in the data space as an additive quantity in the data, which we can call its _information content_. The data contains a certain amount of information and the more latent dimensions we allow, the more of that information we retain. 

<aside>Don't read too much into the word information here. It's just a convenient phrase to use. We could relate it to formal notions of information content, like Shannon's, but not without some serious extra work.
</aside>

If we keep all the dimensions, we retain all the information. If we start with the first principal component and add components one by one, we add to the total of squared variances in a sum that eventually sums up to the total of squared variances in the data (much like the reconstruction loss eventually goes to zero). Both perspectives&mdash;retaining variance and minimizing reconstruction loss&mdash;are formalizations of the same principle; that <em>we want to minimize the amount of information lost in the projection</em>.

## Eigenvectors

Let's return to this image.

<figure class="narrow">
<img src="/images/pca/venn.svg" />
</figure>

These solutions are the same for both perspectives: variance maximization and reconstruction error minimization. We have two unresolved questions about this image:
First, how is it that the solution to the iterative problem (the PCA solution) reaches the same optimum as the solutions to the combined approach? Take a second to consider how strange this is. Solving the iterative problem is a greedy search: once we have chosen $\rc{\w_1}$ we can't ever go back. The process for the combined approach solves all the vectors in sync. How is it that this ability to tune the vectors in concert doesn't give us any advantage in the optimum we find?

The second question, and the question we will answer first, is what is the meaning of the PCA solution among the combined solutions? How can we _characterize_ this solution?

The answer to the second question can be summarized in one phrase:
<blockquote>
The principal components are <em>eigenvectors</em>.
</blockquote>

Depending on your background, this will raise one of two questions. <em>The eigenvectors of what?</em> or, more simply <em>What are eigenvectors?</em>. Let's start there, and work our way back to the other questions.

### What are eigenvectors?

The most common, and probably the most intuitive way to think about matrices is _as transformations of points in space_. If we have some vector $\x$ in space and we multiply it by a matrix $\bc{\A}$, we get a new point $\y = \bc{\A}\x$. If $\bc{\A}$ is square, then $\x$ and $\y$ are in the same space. 

A good way to visualize this in the plane is by _domain coloring_. We take a large number of points, arranged in a grid, and we color them by some image. This could be a simple color gradient, but we can also choose a photograph or some other image. Following [Wikipedia's example](https://en.wikipedia.org/wiki/Eigenvalues_and_eigenvectors#Overview), we'll use a picture of the Mona Lisa.

<figure class="narrow">
<img src="/images/pca/domain-coloring.svg" />
<figcaption>An increasingly fine-grained domain coloring using the Mona Lisa.</figcaption>
</figure>

If we apply the transformation $\bc{\A}$ to each of these points, we can tell what effect the matrix has on this space. 

<figure class="narrow">
<img src="/images/pca/basic-transform.svg" />
</figure>

All the points are mapped to a new position by $\bc{\A}$ and poor Lisa ends up squished and stretched in various directions. Transformations expressible in a matrix are linear transformations. These are the transformations for which a line in the original image is still a line in the transformed image. This means that we can rotate, stretch, squish and flip the image in any direction we like, but we can't warp, bend or tear it.

In this language of transformation, we can very naturally define what eigenvectors are. The <strong>eigenvectors of a square matrix $\bc{\A}$</strong> are defined as those vectors (i.e. points in the image) for which the <em>direction</em> doesn't change under transformation  by $\bc{\A}$.

It's simplest to see what this looks like for a _diagonal matrix_. For instance in the transformation

$$
\y = \bc{\begin{pmatrix}2 & 0 \\ 0 & \tfrac{1}{2}\\\end{pmatrix}}\x
$$

the matrix acts independently on the first and second dimensions, squishing one, and stretching the other.

<figure class="narrow">
<img src="/images/pca/diagonal.svg" />
</figure>

In this image we've also drawn two vectors: one <span class="gc">to the middle of Mona Lisa's left eye</span>, and one <span class="rc">to middle of the right</span>. Since Leonardo put the right eye dead center in the painting (not by accident, I imagine), the red vector shrinks, but doesn't change direction. The green vector is affected by both the squashing and the stretching so its direction and magnitude both change. Hence, the red vector is an eigenvector, and the green vector isn't.

In a diagonal matrix, the eigenvectors are always the vectors that point in the same directions as the axes, so they're easy to identify. In general square matrices, finding the eigenvectors is more tricky. 

<aside> See if you can find an eigenvector for the first transformation, shown above. One trick is to start with a random vector, and if it changes direction, transplant it back to the untransformed image and iterate until the vector doesn't change anymore.
</aside> 

Formally, a vector $\rc{\v}$ is an eigenvector of $\bc{\A}$ if the following holds for some scalar $\bc{\lambda}$:

$$
\bc{\A}\rc{\v} = \bc{\lambda}\rc{\v} \p
$$

This is just a symbolic version of what we said in words above: if $\rc{\v}$ is an eigenvector of $\bc{\A}$, then transforming it changes its magnitude but not its direction, which is the same as saying we can multiply it by a scalar instead of by a matrix. The scalar corresponding to the eigenvector, in this case $\bc{\lambda}$ is called an **eigenvalue** of the matrix.

<aside>It's not at all clear from the definition why these vectors should be meaningful or special. For now, just trust me that eigenvectors are worth knowing about.
</aside>

To build your intuition, consider for a second the question of whether a pure rotation matrix has eigenvectors (the zero vector doesn't count). It shouldn't take long to convince yourself that a rotation in two dimensions doesn't. At least, not usually. There are two exceptions: rotating by 360 degrees (which is just $\I$) and rotating by 180 degrees. In both cases, every vector is an eigenvector. In the first with eigenvalue $\bc{1}$, and  in the second with eigenvalue $\bc{-1}$. 

In three dimensions, rotation is a different story: try pointing straight up in the air and spinning around. The direction of your arm doesn't change as you rotate, so your arm is an eigenvector. Your nose does change direction, so your nose is not an eigenvector.

We saw that when a matrix is diagonal, its eigenvectors are _aligned with the axes_, so they're easy to find. For other matrices, we need to do some more work. One trick is to simply transform the matrix so that the eigenvectors are aligned with the axes, and then to transform it back again.

This is easiest to understand if we work backwards: given some eigenvectors, find a transformation. Imagine that we are given the following eigenvectors, and we are asked to work out a transformation that corresponds to them.

<figure class="narrow centering">
<img src="/images/pca/mona-eigen.svg" class="own-size"/>
</figure>

In this case, we have made things a little easier by making the eigenvectors orthogonal. This means we can rotate the image to put the eigenvectors on the axes. We can then do any stretching and squishing we like along the axes, and rotate the image back. 

<figure class="narrow">
<img src="/images/pca/mona-steps.svg"/>
</figure>

Note that from the first image to the last, the red and blue vector change their shape, but not their direction.

Since any change we make to the direction of the vectors in the <span class="rc">first step</span> is reversed exactly in the <span class="rc">last step</span>, the only permanent change to any <em>directions</em> is made in the <span>middle step</span>. Those vectors which don't change direction in the middle step either, never change direction at all, and must therefore be eigenvectors. These are the vectors that align with the axes in the middle figure, since the middle transformation is along the axes. Therefore, the vectors which are mapped to align with the axes by the first step are the eigenvectors of the complete transformation consisting of all three steps.

All three of these steps can be expressed as matrix transformations. We will call the matrix for the <span class="rc">last step</span> $\rc{\P}$. The <span class="rc">first step</span> is then $\rc{\P}^{-1}$, since it needs to undo $\rc{\P}$ exactly. This means that we must require that $\rc{\P}$ is invertible. 

<aside>
We could also call the first step $\rc{\P}$ of course, but this way around, things work out more neatly. In the example, $\rc{\P}$ is a rotation matrix, but the principle generalizes to all invertable matrices. 
</aside>

We have seen the approach for the middle step already: it is expressed by a diagonal matrix, which we'll call $\bc{\D}$. The composition of these three steps is the transformation matrix $\bc{\A}$ of interest. We compose transformations by multiplying their matrices, so we have:

<p>$$\begin{equation}
\bc{\A} = \rc{\P}\bc{\D}\rc{\P}^{-1} \tag{1}\label{eq:eigen}
\end{equation}$$</p>

This is called a <strong>diagonalization</strong> of $\bc{\A}$, or an <strong>eigendecomposition</strong>. 

Note that for a transformation $\bc{\A}\x = \rc{\P}\bc{\D}\rc{\P}^{-1}\x$, the rightmost matrix is applied first, so the direction of the matrices is reversed from the steps in  image above.

Now we can work backwards: For any given matrix $\bc{\A}$, _if_ we can decompose it in this way, as the product of some <span class="rc">invertible matrix</span>, some <span class="bc">diagonal matrix</span> and the <span class="rc">inverse of the invertable matrix</span>, then we know three things:

 * The eigenvectors of $\bc{\A}$ are the vectors that are mapped by $\rc{\P}^{-1}$ to align to the axes. Any change of direction introduced by $\rc{\P}^{-1}$ is undone by $\rc{\P}$, so the only vectors whose direction is unchanged are those mapped to the eigenvectors of ${\bc{\D}}$ (i.e. to the axes).
 * The eigenvectors are also those vectors which to which axis-aligned vectors are transformed by $\rc{\P}$.
 * The eigen<em>values</em> of $\bc{\A}$ are the elements along the diagonal of $\bc{\D}$. Any change of magnitude introduced by $\rc{\P}^{-1}$ is undone by $\rc{\P}$, so only the changes made by $\bc{\D}$ remain. An eigenvector mapped to axis $i$ by $\rc{\P}$ is scaled by $\bc{D}_{ii}$, which is therefore the corresponding eigenvalue.
 
So, given a diagonalization like $\eqref{eq:eigen}$, which are the eigenvectors? We use the first bullet point above: we will find the vectors which result from transforming axis-aligned vectors by $\rc{\P}^{-1}$. We have one eigenvalue per axis, so we'll look for one eigenvector for each. For the vectors to transform, we can just take axis-aligned unit vectors (also known as one-hot vectors). Each should transform to an eigenvector. We can do the transformation for all vectors in one go by concatenating the vectors as the columns of one matrix. For the unit vectors this simply results in the identity matrix, and for the eigenvectors, this results in a matrix we will call $\oc{\E}$. So we are looking the matrix $\oc{\E}$ for which 

$$
\rc{\P}\I = \oc{\E} \p
$$

Removing $\I$ tells us that the eigenvectors we are looking for are simply the columns of $\rc{\P}$.

### The spectral theorem

Note that we were careful above to say _if_ $\bc{\A}$ can be diagonalized. Not all square matrices can be diagonalized. A theorem showing that a particular class of square matrices can be diagonalized is called a _spectral theorem_.

<aside>
The set of eigenvalues of a matrix is sometimes called its spectrum, so methods and results using these principles often use the adjective <em>spectral</em>. For instance, we have <a href="https://en.wikipedia.org/wiki/Spectral_clustering">spectral clustering</a>, <a href="https://en.wikipedia.org/wiki/Spectral_graph_theory">spectral graph theory</a> and <a href="https://en.wikipedia.org/wiki/Spectral_method">spectral ODE solvers</a>.
</aside>

<p>There are many spectral theorems, but we'll only need the simplest. The spectral theorem for <em>symmetric matrices</em>. A symmetric matrix is a square matrix $\bc{\A}$ which is symmetric across the diagonal. That is, it has $\bc{A}_{ij} = \bc{A}_{ji}$, or equivalently $\bc{\A}^T = \bc{\A}$. We'll call this <em>the</em> spectral theorem in the context of this series.</p>

To state the theorem, we first need to define **orthogonal matrices**. These are square matrices in which all columns are mutually orthogonal unit vectors. 

This should sound familiar, it's the constraint we placed on our principal components. In the combined problem, the constraint $\rc{\W}^T\rc{\W} = \I$ is simply a requirement that the matrix $\rc{\W}$ be orthogonal.

Why? Remember that matrix multiplication is just a collection of all dot products of rows on the left with columns on the right, so in this case all columns of $\rc{\W}$ with all other columns of $\rc{\W}$. On the diagonal of $\rc{\W}^T\rc{\W}$, we find all dot products of columns of $\rc{\W}$ with themselves, which are all $1$, because they are all unit vectors. Off the diagonal we find all dot products of all columns with other columns. These are all zero, because they are all mutually orthogonal.

<aside>Geometrically, orthogonal matrices represent those transformations that do not change the magnitude of any vector: that is, rotations and reflections.
</aside>

A very useful property of orthogonal matrices is that their inverse is equal to their transpose: $\rc{\W}^{-1} = \rc{\W}^T$. This follows directly from the fact that $\rc{\W}^T\rc{\W} = \I$, because the inverse of $\rc{\W}$ is defined as a matrix $\rc{\W}^{-1}$ such that $\rc{\W}^{-1}\rc{\W} = \I$.

This property makes orthogonal matrices especially nice to work with, since we can take the inverse (usually a costly and numerically unstable operation) by flipping the indices around (constant time, with zero numerical instability). 

We can now state the spectral theorem.

<div class="theorem proof-omitted"><p><strong class="gc">The spectral theorem.</strong> Call a matrix $\bc{\A}$ <em>orthogonally diagonalizable</em> if it is diagonalizable  with the additional constraint that $\rc{\P}$ is orthogonal: $\bc{\A} = \rc{\P}\bc{\D}\rc{\P}^T$.</p>

<p>A matrix $\bc{\A}$ is orthogonally diagonalizable if and only if $\bc{\A}$ is symmetric.
</p></div>

Proving this now would require us to discuss too many extra concepts that aren't relevant for this part of the story. On the other hand, this theorem is very much the heart of PCA: everything it is and can do follows from this result. We'll take it at face value for now, and answer the rest of our questions. Part 3 of this series will be entirely dedicated to proving the spectral theorem.

For now, just remember that if we have a square, symmetric matrix, we can diagonalize it with an orthogonal matrix $\rc{\P}$ and a diagonal matrix $\bc{\D}$. The diagonal elements of $\bc{\D}$ will be the eigenvalues and the columns of $\rc{\P}$ will be the corresponding eigenvectors. 

Note that the spectral theorem implies that there are $\gc{n}$ eigenvalues (since $\bc{\D}$ has $\gc{n}$ diagonal values). Some of them might be zero, but we need not worry about that at the moment. In the last part of the series, we'll develop some concepts that help us characterize what it means for eigenvalues to be zero.

Finally, notice that for any such diagonalization, we can shuffle the eigenvalues around and get another diagonalization (we just have to shuffle the columns of $\rc{\P}$ in the same way). Since the ordering of the eigenvalues in $\bc{\D}$ is arbitrary, we usually sort the from largest to smallest, calling the largest the **first eigenvector** and the smallest the **last eigenvector**. As you may expect, we'll see later that these match the ordering of the principal components. We'll call the decomposition with the eigenvectors ordered like this, the _canonical_ orthogonal diagonalization.

### Eigenvectors of which matrix?

Back to the PCA setting. Where do we find eigenvectors in this picture? We have a matrix, the data matrix $\X$, but it isn't square, and it's never used as a transformation. 

In fact, the eigenvectors that will end up as the principal components are the eigenvectors of the _covariance matrix_ of our data $\X$.

<blockquote>
The principal components are the eigenvectors <span class="bc">of the covariance matrix</span>.
</blockquote>

Let's start by reviewing what a covariance matrix is. When we talk about one-dimensional data, we often discuss the variance: a measure for how spread out the numbers are. We can think of this as a measure of _predictability_. The more spread out the points are the more difficult it is to predict where a randomly sampled point might be. If the variance is very small, we know any point is very likely to be near 0. If it's very large, we are less sure.

The covariance matrix is the analogue for $\bc{m}$-dimensional data, like our data $\X$. It tells us not just how spread out the points are along the axes (the variance of each feature) but also how spread out the points of one feature are, given the value of another feature. Consider the following 2D dataset:

<figure class="narrow centering">
<img src="/images/pca/covariance.svg" class="three-quarters"/>
</figure>

The variance for both features is 1, so the data is pretty spread out. It has high variance, and is therefore relatively unpredictable. However, if I know the value of feature 1, suddenly the likely values of feature 2 become much narrower. 

This is because the data has high <em>co</em>variance between the two features: knowing the value of one, tells us a lot about the value of another. Another way of saying this is that the two features are highly _correlated_. Here's the different ways data can be (linearly) correlated in 2D.

<figure class="narrow">
<img src="/images/pca/covs-3.svg" />
<figcaption>Three ways data can be correlated. The bottom row shows the covariance matrices of each dataset (explained below).
</figcaption>
</figure>

Pay particular attention to the middle example: perfectly _decorrelated_ data. In such data, the features are independent: knowing the value of one tells us nothing about the value of the other. This is an important property of good _latent features_. For instance, in the Olivetti data from the last part, many of the observed features (the pixel values) were highly correlated, but the latent features we extracted by PCA (the gender, the age, the lighting) were largely decorrelated. If the data is not biased, knowing the age of a subject doesn't tell you anything about the way they were lit or how feminine they appear.

The formula for the variance of feature $\bc{j}$, as we've seen before, is 

<p>$$
\text{Var}_\X(\bc{j}) = \kc{\frac{1}{n}} \sum_\gc{i} (\bar x_\bc{j} - X_{\gc{i}\bc{j}})^2
$$</p>

Where $\bar x_\bc{j}$ is the mean of feature $\bc{j}$, which is 0 if the data is mean centered. The covariance between features $\bc{j}$ and $\bc{k}$ is defined as

<p>$$
\text{Cov}_\X(\bc{j}, \bc{k}) = \kc{\frac{1}{n}} \sum_\gc{i} (\bar x_\bc{j} - X_{\gc{i}\bc{j}})(\bar x_\bc{k} - X_{\gc{i}\bc{k}})
$$</p>

<aside>All of these are usually considered <em>estimates</em>. The distribution from which the data was sampled has some invisible (co)variance, which we estimate by these formulas.  For a maximum likelihood estimate, we divide by $\kc{n}$, for an unbiased estimate by $\kc{n-1}$. For large data, the difference is negligable, so I'll use the first to keep the formulas simple.
</aside>

For mean-centered data, these simplify to

<p>$$
\begin{align*}
\text{Var}_\X(\bc{j}) &= \kc{\frac{1}{n}} \sum_\gc{i} X_{\gc{i}\bc{j}} X_{\gc{i}\bc{j}}\\
\text{Cov}_\X(\bc{j}, \bc{k}) &= \kc{\frac{1}{n}} \sum_\gc{i} X_{\gc{i}\bc{j}} X_{\gc{i}\bc{k}} \p
\end{align*}
$$</p>

Note two things about these equations:
<ul>
<li>The variance is just the covariance of a feature <em>with itself</em>: $\text{Var}_\X(\bc{j}) = \text{Cov}_\X(\bc{j}, \bc{j})$.</li>
<li>If we ignore the multiplier $\kc{\tfrac{1}{n}}$, the covariance is the dot product of one column of $\X$ with another.</li>
</ul>

This means that if we make a <span class="bc">big matrix</span> with all covariances between features $\bc{j}$ and $\bc{k}$, we can compute that matrix by a simple matrix multiplication:

$$
Cov(\X) = \kc{\frac{1}{n}}\X^T\X
$$

<figure class="narrow">
<img src="/images/pca/covmult.svg" class="three-quarters"/>
</figure>

This matrix is symmetric, since $\text{Cov}(\bc{j}, \bc{k}) = \text{Cov}(\bc{k}, \bc{j})$, and it has the variances of the various features along the diagonal. 

<aside>
For any matrix, $\X$ of any size, $\bc{\M} = \X^T\X$ is square and symmetric: $\bc{M}_{ij} = \bc{M}_{ij}$ because they are both the dot product of columns $i$ and $j$ in the data.
</aside>

<p>We'll denote the covariance matrix of our dataset $\X$ by $\bc{\S}$ . This is the matrix that we're interested in: the eigenvectors of $\bc{\S}$ coincide with the principal components of $\X$.</p>

I expect that that doesn't immediately make a lot of intuitive sense. We've developed eigenvectors in terms of matrices that transform points in space. We don't usually think of $\bc{\S}$ as transforming space. It's not common to see a vector multiplied by $\bc{\S}$. Yet, we can easily diagonalize $\bc{\S}$. In fact, since it's symmetric, <strong class="gc">the spectral theorem</strong> tells us that we can diagonalize it with an orthogonal matrix, and we can be sure that it has $\gc{n}$ eigenvalues.

To develop some intuition for what these eigenvalues _mean_ we can have a look at the common practice of **data normalization**.

## Data normalization and basis transformations

Data normalization is a very common data pre-processing step in many data science processes. For many applications we don't much care about the natural scale of the data, and we instead want the data to lie in a predictable range. For one-dimensional data, one way to do this is to rescale the data so that its mean equals $0$, and its variance equals 1. We achieve this easily by first shifting the data so that the mean is at $0$, and then scaling uniformly until the variance is $1$.

To work out how to make this transformation, we can imagine that our data _originally_ had mean $0$, and variance $1$, and was then transformed by scaling and then adding some constant value. That is, every point $x$ we observed was derived from an unseen point $z$ by two parameters $\bc{s}$ and $\oc{t}$ as 

$$
x = \bc{s}z + \oc{t}
$$

with the $z$'s having mean $0$ and variance $1$. We will call $z$ the **hidden** or **latent** variable behind the **observed variable** $x$.

After scaling by $\bc{s}$, the mean of the "original" data is still $0$, so we should set $\oc{t} = \bar x$ to end up with the correct mean for our observed data. To work out $\bc{s}$, we move this term to the other side:

$$
x - \oc{\bar x} = \bc{s}z \p
$$

The left-hand side is the mean-centered data, and the right hand side is a scaled version of the original data. Since variance isn't affected by the additive term, we get

<p>$$
\text{Var}(\{x\}) = \kc{\frac{1}{n}}\sum_{z}(\bc{s}z)^2 = \bc{s}^2\kc{\frac{1}{n}}\sum_z z^2 = \bc{s}^2 \times \text{Var}(\{z\}) = \bc{s}^2 
$$</p>

So to end up with the correct variance for $x$, we should set the _square_ of $\bc{s}$ equal to the data variance, or equivalently, we should set $\bc{s}$ equal to the data standard deviation $\bc{\sigma}$ (the square root of the variance). So, the correct normalization is:

$$
x' = \frac{x - \oc{\bar x}}{\bc{\sigma}} \p
$$

<aside>
This may seem like an overly elaborate way to derive a pretty intuitive normalization, but we will generalize this approach to higher dimensions later, so it pays to understand the steps. 
</aside>

Instead of thinking of this operation as moving the data around, we can also think about it as keeping the data where it is, but just expressing it on a different <em>axis</em>. We move the origin to coincide with the data mean, and then scale <em>the unit</em>  (the length of the arrow from $0$ to $1$) so that its tip lies at the point $\oc{\bar x} + \bc{\sigma}$. On this new axis, the data is normalized.

<figure class="narrow">
<img src="/images/pca/onedbasis.svg"/>
<figcaption>We can see the operation of normalizing our one-dimensional data as simply expressing the same points on a <span class="rc">different axis</span>. We change the location of the origin and the length of the unit (the arrow that points from $0$ to $1$), and our data is normalized.
</figcaption>
</figure>

<p>In higher dimensions, the <em>units</em> we use to express points in space are often called a <em>basis</em>. We take a bunch of vectors $\rc{\b}_1, \ldots, \rc{\b}_k$, called the <em>basis vectors</em> and express points as a sum of the basis vectors, each multiplied by a particular scalar, where the scalars are unique to the point we are expressing. </p>

<aside>Strictly speaking, for the set $\rc{\b}_1, \ldots, \rc{\b}_k$ to be a basis, the vectors should also be linearly independent. For our current purposes, we don't need to define this so precisely.
</aside>

<p>This is how our standard coordinate system works as well: in three dimensions, the basis vectors are $\oc{\e}_1 = (1, 0, 0)$, $\oc{\e}_2 = (0, 1, 0)$ and $\oc{\e}_3 = (0, 0, 1)$. When we refer to a point $\bp$ with the coordinates (7, 3, 5), we are implicitly saying that </p>

$$
\bp = 
7 \times \oc{\begin{pmatrix}1\\0\\0\end{pmatrix}} + 
3 \times \oc{\begin{pmatrix}0\\1\\0\end{pmatrix}} + 
5 \times \oc{\begin{pmatrix}0\\0\\1\end{pmatrix}}
$$

<p>This is called the <strong>standard basis</strong>. It's a little elaborate for something so familiar, but it shows a principle we can apply for other sets of basis vectors. With any set of vectors $\rc{B} = \{\rc{\b}_1, \ldots, \rc{\b}_k\}$, we can describe a point by writing down a vector $\bp^\rc{B}$, and computing</p>

$$
\bp = p^\rc{B}_1 \rc{\b}_1 + \ldots + p^\rc{B}_k \rc{\b}_k 
$$

Here, $\bp$ are the coordinates of the point in the <span class="oc">standard basis</span>, and $\bp^\rc{B}$ are the coordinates in the basis $\rc{B}$.

<figure class="narrow">
<img src="/images/pca/bases.svg"/>
<figcaption>The point $\oc{(3, 2)}$ as expressed in our <span class="oc">standard basis</span> becomes the point $\rc{(2, 1.7)}$ when expressed in the basis defined by vectors $\rc{\b}_1 = (0.9, 0.4)$ and $\rc{\b}_2 = (0.7, 0.7)$.
</figcaption>
</figure>

If we concatenate the basis vectors into the columns of a matrix $\rc{\B}$, we can express this transformation as a simple matrix multiplication:

$$
\bp = \rc{\B} \bp^\rc{B}
$$

This also suggest how to transform in the other direction: from a point in the standard basis to a point in the basis $\rc{B}$: we require that $\rc{\B}$ is invertible and use

$$
\bp^\rc{B} = \rc{\B}^{-1} \bp \p
$$

The set of points you can express in a particular basis is called its **span**. In the image above, the span is the same as that of the standard basis, but if you define two basis vectors in a three-dimensional standard basis, their span would usually be some plane crossing the origin.

<!-- 
<aside>The strict definition of a basis states that a set $B$ of vectors is only a basis for its span if $B$ contains no "superfluous" vectors, i.e. vector which we can remove wihout changing the span. Another way of saying this is that no vector in $B$ can be expressed as a linear combination of one or more of the others.
</aside>
 -->

If you want to actually compute the transformation into the basis, the computation of a matrix inverse is finicky and very likely to be numerically unstable. It's nice if you can ensure that $\rc{\B}^{-1} = \rc{\B}^{T}$. We've seen matrices with this property before: they're called **orthogonal matrices**. To refresh your memory, orthogonal matrices are square matrices with columns that are all unit vectors and all mutually orthogonal. 

<aside>A basis expressed by an orthogonal matrix is called an orthonormal basis. It's a rotated or flipped version of the standard basis, but the basis vectors are still all orthogonal and they are still all unit vectors.
</aside>

We can now say that our data normalization was nothing more than a simple basis transformation in ${\mathbb R}^1$. We mean-center the data, and replace the standard basis vector by one that matches the variance of our data.

More importantly, we can translate the idea of data normalization to higher dimensions. In  ${\mathbb R}^1$, we were after a basis in which the variance was 1. In ${\mathbb R}^n$ we will look for a basis in which the _covariance_ is $\I$. This requirement has two consequences: 
* In our new coordinates, the variance is $1$ along all axes.
* In our new coordinates all covariances are $0$. That is, the data is perfectly _decorrelated_.

<aside>This kind of normalization is called <em>whitening</em> (because standard normally distributed noise is sometimes called white noise). It's not usually necessary in data science, but it can be a very powerful preprocessing method if you can spare the required resources. We're primarily discussing it as a way of making intuitive what is happening under the hood of PCA.
</aside>

We'll proceed the same way we did before: we will imagine that our data was originally of this form, and has been transformed by an affine transformation. We'll call  the matrix for this imagined  "original" data $\Z$. This means $\X$ was produced by:

$$
\X^T = \bc{\A}\Z^T + \oc{\t} \p
$$

As before, we will first figure out which $\bc{\A}$ and which $\oc{\t}$ will lead to our data, and then we will invert this transformation to find the transformation that normalizes our data.

The logic for $\oc{\t}$ is the same as it was before: since $\Z$ has zero mean, it still has zero mean after being transformed by $\bc{\A}$. If we set $\oc{\t} = \bar\x$, we transport this to the mean of the observed data.

We move it this term to the left-hand side

$$
\X^T - \oc{\bar\x} = \bc{\A}\Z^T
$$

and observe that the mean-centered data on the left is equal to our $\bc{\A}$-transformed latent data.

Now, we need to set $\bc{\A}$ to achieve the right covariance. The covariance is unaffected by the additive term $- \oc{\bar \x}$, so we can ignore that. The covariance of the transformed data is:

$$
\text{Cov}(\X) = \kc{\frac{1}{n}} \bc{\A}\Z^T(\bc{\A}\Z^T)^T = \kc{\frac{1}{n}} \bc{\A}\Z^T\Z\bc{\A}^T = \bc{\A}\kc{\text{Cov}(\Z)}\bc{\A}^T = \bc{\A}\bc{\A}^T \p
$$

Where previously we needed to choose our scalar $\bc{s}$ so that its square was equal to the data variance $\bc{\sigma}^2$, we now need to choose our transformation matrix $\bc{\A}$ so that its "square" $\bc{\A}\bc{\A}^T$ is equal to the data covariance $\bc{\S}$.

If we find such an $\bc{\A}$, we know that its _transformation_ is what maps the decorrelated data to the data we've observed. So even though we never transform any points by the covariance matrix, we see that internally, it does contain a very natural transformation matrix.

There are a few ways to find $\bc{\A}$ for a given $\bc{\S}$. The Cholesky decomposition is the most natural analogue to the square root we used in the 1D case. This road leads to a technique known as _Cholesky whitening_.

But this is not a blog post about whitening, it's a blog post about PCA. We're trying build some intuition for what PCA is doing. So instead, we'll solve $\bc{\S} = \bc{\A}\bc{\A}^T$ using the orthogonal diagonalization we developed earlier, which will lead us to a method called _PCA whitening_ (a kind of byproduct of the PCA analysis).

We know that $\bc{\S}$ is square and symmetric, so we know it can be orthogonally diagonalized:

$$
\bc{\S} = \rc{\P}\bc{\D}\rc{\P}^T \p
$$

To turn this into a solution to $\bc{\S} = \bc{\A}\bc{\A}^T$ we need two factors, with the second the transpose of the first. We can do this easily by noting two things about the diagonal matrix in the middle. First, the square of a diagonal matrix is just another diagonal matrix with the squares of the original elements along the diagonal, so that $\bc{\D} = \bc{\D^\frac{1}{2}}\bc{\D^\frac{1}{2}}$. Second, the transpose of a diagonal matrix is the same matrix, so that $\bc{\D} = \bc{\D^\frac{1}{2}}{\bc{\D^\frac{1}{2}}}^T$. Thus

<p>$$\begin{align*}
\bc{\S} &= \rc{\P}\bc{\D^\frac{1}{2}}{\bc{\D^\frac{1}{2}}}^T\rc{\P}^T \\
&= \bc{\A}\bc{\A}^T \;\;\;\text{with } \bc{\A} = \rc{\P}\bc{\D^\frac{1}{2}}
\end{align*}$$</p>

Finally, to whiten our data, we reverse the transformation from $\Z$ to $\X$ and get 

$$
\Z = \bc{\A}^{-1}(\X - \oc{\t}) = \bc{\D}^{-\frac{1}{2}}\rc{\P}^T (\X - \oc{\t}) \p
$$

So, to map our data to a zero-mean, unit-variance, decorrelated form, we map to the basis formed by the eigenvectors of $\bc{\S}$ and then divide along each axis  by the square root of the eigenvalues. We can see here that the eigenvalues of the covariance matrix are the variances of the data, _along the eigenvectors_ (remember that we divided by the square of the variance before).

Taking the alternative perspective we took above, we can also keep the data where it is and change our basis. We scale the standard basis along the axes by   $\bc{\D}^{\frac{1}{2}}$ rotate by $\rc{\P}$ and translate by $\oc{\bar \x}$. In the resulting axes, our data has mean $\mathbf 0$, and covariance $\I$.

<figure class="narrow">
<img src="/images/pca/covariance-2.svg" />
</figure>

## Quadratic forms

Have we fully married our first intuition about eigenvectors in transformation matrices with the role eigenvectors play in PCA, as the eigenvectors of $\bc{\S}$? Not quite. We've shown that $\bc{\S}$ is in some sense composed of a very important transformation $\bc{\A}$, which transforms decorrelated data with unit variance to have covariance $\bc{\S}$, but the eigenvectors we're using are not the eigenvectors of $\bc{\A}$. Rather,  $\bc{\A}$ is _made up_ of our eigenvectors and may itself have different eigenvectors, or no (real) eigenvectors at all.

To develop an intuition for how $\bc{\S}$ operates on space, it's more helpful not to look at the linear form

$$\bc{\S}\x$$

but at the _quadratic_ form 

$$\x^T\bc{\S}\x \p$$

This may look mysterious, but it's just a concise way of writing second-order polynomials in $n$ variables (just like $\M\x$ is a concise way of writing a linear function from $n$ to $m$ variables). For instance,

<p>$$
\x^T\begin{pmatrix}\rc{2}& \bc{3}\\ \gc{4}& \oc{5} \end{pmatrix}\x = \rc{2}{x_1}^2 + \bc{3}x_2 x_1  + \gc{4} x_1x_2 + \oc{5}{x_2}^2
$$</p>

The simplest quadratic is $\x^T\I\x$, or just $\x^T\x$. If we set this equal to 1, the points that satisfy the resulting equation are the unit vectors. In 2 dimensions, these form a circle called the bi-unit circle. In higher dimensions, the resulting set is called the bi-unit (hyper)sphere. 

There are two ways to use quadratic forms to study the eigenvectors of $\bc{\S}$. The first is to look at $\x^T\bc{\S}\x$ and to study what this function looks like when constrained to the bi-unit sphere. Looking only at the points for which $\x^T\x = 1$ what happens to the parabola $\x^T\bc{\S}\x$?

<figure class="narrow">
<img src="/images/pca/surface.svg"/>
<figcaption>The <span class="rc">bi-unit circle</span> is deformed by the parabola $\x^T\begin{pmatrix}\rc{2}& \bc{3}\\ \gc{4}& \oc{5} \end{pmatrix}\x$. 
</figcaption>
</figure>

If we diagonalize $\bc{\S} = \rc{\P}\bc{\D}\rc{\P}^T$, the quadratic becomes $\x^T\rc{\P}\bc{\D}\rc{\P}^T\x$. The first and last two factors are just a change of basis so we can also write $\z^T\bc{\D}\z$ with $\z = \rc{\P}^T\x$. Since $\rc{\P}$ is orthogonal, the change of basis doesn't change the length of the vectors and the constraint that $\x$ should be unit vectors is equivalent to requiring that $\z$ be unit vectors.

The quadratic form $\z\bc{\D}\z$ is particularly simple, because $\bc{\D}$ is diagonal. We simply get 

<p>$$
\z\bc{\D}\z = z_1z_1\bc{D}_{11} + z_2z_2\bc{D}_{22} + \ldots + z_\bc{m}z_\bc{m}\bc{D}_\bc{mm} \p
$$</p>

<p>This sum is very important. Note that all the factors $z_\rc{r}z_\rc{r}$ are not only positive (because they're squares), but they also sum to one, since $\|
\z\|^2  = {z_1}^2 + \ldots + {\z_\bc{m}}^2$ is the squared length of vector $\z$, which we constrained to 1.</p>

We'll call this a <strong>weighted sum</strong>: a sum over some set of numbers where each term is multiplied by a positive weight, so that the weights sum to 1.

<!--
 We can explain why S is acting on space as a quadratic transform and why maximizing the quadritic form maximizes the variance. Double check and add this.
 -->

In the next section, we will use this sum it to prove just about every open question we have left. For now, just notice what happens when $\x$ is an eigenvector. In that case, $\z$ is a one-hot vector, because $\rc{\P}\z = \x$, and only one of the terms in the sum is non-zero.

This is one way to think of the quadratic form of $\bc{\S}$: it defines $\bc{m}$ <span class="rc">orthogonal directions in space</span> (the eigenvectors), at which the quadratic takes some <span class="bc">arbitary value</span> (the eigenvalues). For all other directions $\x$, the quadratic is a weighted mixture  between the eigenvalues, with the weights determined by how much of $\x$ projects onto the corresponding eigenvectors.

<aside>Looking at the sum above, you should be able to figure out what the minimum and maximum values are of the quadratic form $\x^T\bc{\S}\x$ under the constraint that $\x^T\x = 1$. Note the similarity of this optimization problem to the PCA problem. If you don't see it yet, don't worry. We'll dig deeper into this in the next section.
</aside>

For another geometric interpretation of the  eigenvectors of $\bc{\S}$, think back to the one-dimensional example of normalizing data. In the normalized version of the data, the variance is equal to 1. This means that, for most distributions, we can be sure that the majority of the data lies in the interval $(-1, 1)$. This is called the bi-unit interval, since it is made up of two units around the origin. If our data is normally distributed, this interval captures about 68% of it. The transformation by $\oc{t}$ and $\bc{s}$ maps this interval to an interval that capture the same proportion of the unnormalized data.

In higher dimensions, the analogue of the bi-unit interval is the bi-unit sphere, the set of all point that are at most 1 away from the origin. To follow the analogy, we can transform the bi-unit sphere, which captures the majority of $\Z$ by some $\bc{A}^{-1}$ so that we capture the majority of the observed data.

<figure class="narrow">
<img src="/images/pca/covariance-ellipses.svg" />
<figcaption>The <span class="oc">bi-unit circle</span> captures the majority of the normalized data. The <span class="rc">ellipse</span> we create by transforming the circle by $\bc{\A}^{-1}$ (and translating to the mean) captures the same majority of the <span class="gc">unnormalized data</span>.
</figcaption>
</figure>

In two dimensions, the transformation by $\bc{\A}$ and $\oc{\t}$ that we derived above is the transformation that maps the bi-unit circle to an ellipse which captures the majority of the data. In more than two dimensions, we're mapping a hypersphere to an _ellipsoid_.

Note that the standard basis vectors are mapped to the eigenvectors of $\bc{\S}$. We call this new basis, in which the data is normalized, the <strong>eigenbasis of $\bc{\S}$.

<p>To work out the shape of the ellipsoid in quadratic form, we just start with the set of all unit vectors $C = \left \{ \x :\x^T\x = 1 \right\}$ and transform each by $\bc{\A}$ individually (much like we transformed the Mona Lisa earlier).</p>

<p>$$\begin{align*}
\bc{\A}C &= \left \{\bc{\A}\x : \x^T\I\x = 1 \right\} & \\
& = \left \{\y : \x^T\x = 1 \;\;\&\;\; \y = \bc{\A}\x \right\} & \\
& = \left \{\y :  \left ( \bc{\A}^{-1} \y \right ) ^T \bc{A}^{-1}\y = 1\right \} & \\
& = \left \{\y :  \y^T \bc{\S}^{-1} \y  = 1 \right\} &
\end{align*}$$</p>

That is, to transform the bi-unit circle to an ellipsoid that covers the same proportion of $\X$ as the circle did of $\Z$, we turn the equation $\x^T\x = 1$ into the equation $\x\bc{\S}^{-1}\x = 1$. 

<p>Why the inversion from $\bc{\S}$ to $\bc{\S}^{-1}$? Follow the transformation along the first eigenvector of $\bc{\S}$. In this direction, we are multiplying the input unit vector by the square of the first eigenvalue (remember $\bc{\A} = \rc{\P}\bc{\D}^\frac{1}{2}$). To keep the vector a unit vector, we should therefore <em>divide</em> by the square of the first eigenvector. In other words, if we want to define a quadratic form for which the arguments transformed by $\bc{\A}$ stay unit vectors, then the more the value of $\x^T\bc{\S}\x$ grows, the more our quadratic form should shrink and vice versa.
</p>

<aside>Note that the inverse of a symmetric matrix has a particularly simple expression in terms of its orthogonal diagonalization: $\bc{\S}^{-1} = \left(\rc{\P}\bc{\D}\rc{\P}^T\right)^{-1} = \rc{\P}\bc{\D}^{-1}\rc{\P}^T$. That is, the eigenvectors stay the same, and we just take the reciprocals of the eigenvalues.
</aside>

## Why is PCA optimal?

With the quadratic form added to our toolbox, we can finally start answering some of the deeper questions. Both visually, using transformations of ellipses, and formally, using the language of eigenvectors.

Let's start simply, why does the first principal component coincide with an eigenvector. And, while we're at it, which eigenvector does it coincide with?

Visually, this is easy to show. In the image above, we plotted the bi-unit circle, and its transformation into an ellipse that covers the same part of the observed data. The <span class="oc">standard basis vectors</span> are mapped to the eigenvectors. Note that these become the axes of <span class="rc">the ellipse</span>. One of the standard basis vectors is mapped to the ellipse's _major axis_, the direction in which it bulges the most.The direction in which the data bulges the most is also the direction of greatest variance, and therefore the first principal component.

The proof of this fact is not very complex.

<div class="theorem"><p><strong class="gc">First eigenvector.</strong> The first principal component is the eigenvector of the covariance matrix $\bc{\S}$ with the largest eigenvalue.
</p></div>
<div class="proof"><p><em>Proof.</em> The first principal component $\rc{\w}_1$ is defined as </p>

<p>$$
\argmax{\rc{\w}} \sum_\gc{i} \left(\rc{\w}^T\x_\gc{i}\right)^2 \\
\;\;\text{such that } \rc{\w}^T\rc{\w} = 1
$$</p>

<p>
that is, the direction in which the variance of the projected data is maximized. Rewriting the objective function, we get
</p>

<p>$$\begin{align*}
 \sum_\gc{i} \left(\rc{\w}^T\x_\gc{i}\right)^2 &= \sum_\gc{i} \rc{\w}^T\x_\gc{i} \x_\gc{i}^T\rc{\w} \\
 &= \sum_\gc{i} \rc{\w}^T\x_\gc{i}\x_\gc{i}^T\rc{\w} \\
 &= \rc{\w}^T\left(\sum_\gc{i} \x_\gc{i}\x_\gc{i}^T\right)\rc{\w} \\
 &= \rc{\w}^T \X^T\X \rc{\w} \\
 &= \kc{N} \rc{\w}^T \bc{\S} \rc{\w}.\\
\end{align*}$$</p>

<p>This means that the direction in which the sum of variances is maximized, is the direction, represented by a unit vector $\rc{\w}$, for which the quadratic form $\rc{\w}^T\bc{\S}\rc{\w}$ is maximal.</p>

<p>If we orthogonally diagonalize $\bc{\S}$, with the eigenvalues canonically arranged, we get</p>

<p>$$\begin{align*}
\rc{\w}^T \bc{\S} \rc{\w} &= \rc{\w} ^T\rc{\P}\bc{\D}\rc{\P}^T \rc{\w} \\
&= \z\bc{\D}\z \;\;\text{with } \z = \rc{\P}^T\rc{\w} \p
\end{align*}$$</p>

<p>In the last step, we've simplified to a diagonal quadratic form in the eigenbasis of $\bc{\S}$. This quadratic form simplifies to </p>

<p>$$
\z^T\bc{\D}\z = {z_1}^2 \bc{D}_{11} + \ldots + {z_\bc{m}}^2\bc{D}_\bc{mm}
$$</p>

<p>where the constraint that $\z$ is a unit vector means that ${z_1}^2 + \ldots + {\z_\bc{m}}^2 = 1$. In other words, this is a weighted sum over the diagonal elements of $\bc{\D}$. To maximize a weighted sum, we assign weight 1 to the largest element and weight 0 to the rest. Since we took $\bc{D}_{11}$ to be the largest eigenvalue, the vector $\hat\z = (1, 0, \ldots, 0)$ maximizes the quadratic form.</p>

<p>Mapping back to the standard basis, we get $\rc{\w}_1 = \rc{\P}\hat\z$. That is, the first column of $\rc{\P}$, which is the first eigenvector of $\bc{\S}$.<span class="qed"/></p>
</div>

We can extend this proof to show that all the other PCs are eigenvectors as well.

<div class="theorem"><p><strong class="gc">PCs as eigenvectors.</strong> The $\rc{k}$-th principal component of $\X$ is the $\rc{k}$-th eigenvector of $\bc{\S} = \kc{\frac{1}{N}}\X^T\X$</p></div>

<div class="proof"><p><em>Proof.</em> For the first principal component $\rc{\w}_1$, the previous theorem provides a proof. For $\rc{\w}_2$, follow the previous proof until the  weighted sum</p>

<p>$$
\z^T\bc{\D}\z = {z_1}^2 \bc{D}_{11} + \ldots + {z_\bc{m}}^2\bc{D}_\bc{mm} \p
$$</p>

<p>First, note that any vector $\rc{\w}'$ that is orthogonal to $\rc{\w}_1$ must also be orthogonal after transformation by $\rc{\P}\rc{\P}^T$: </p>

<p>$$
0 = \rc{\w}_1^T\rc{\w}' = {\rc{\w}_1}^T\rc{\P}\rc{\P}^T\rc{\w}' = {\z_1}^T\z' \p
$$</p> 

<p>Thus, the second eigenvector is orthogonal to the first (as required) if and only if their projections by $\rc{\P}^T$ are orthogonal as well (and similarly for higher eigenvectors).</p>

<p>Recall that the first principal component has $\z$ vector $(1, 0, \ldots, 0)$, so to be orthogonal, the $\z$ vector corresponding to the second principal component must have $0$ at its first element. Since the $\bc{D}_{jj}$ are arranged in decreasing order, we maximize the sum under this constraint with the one-hot vector $\hat \z = (0, 1, 0, \ldots, 0)$. $\rc{\P}^T \hat\z$ selects the second column in $\rc{\P}$, so the second principal component coincides with the second eigenvector.</p>

<p>The same logic holds for the other principal components. For each component $\rc{r}$, we must set all weights ${z_i}^2$ with $i < \rc{r}$ to zero in order for the $\z$ vector to be orthogonal to all principal components already chosen. In the remainder of the sum, we maximize the weight with the one-hot vector for $\rc{r}$, which selects the $\rc{r}$-th eigenvector.<span class="qed" />
</p></div>

We have finally shown that the eigenvectors are the vectors that maximize the variance. 

There is one question left to answer. Why is the set of the first $\rc{k}$ principal components a solution to the combined problem at $\rc{k}$?

<div class="theorem"><p><strong class="gc">Optimality of PCA.</strong> For any $\rc{k}$, a solution to the iterative problem is a solution to the combined problem.
</p></div>
<div class="proof"><p><em>Proof.</em> Let $\rc{\W}$ be a solution to the combined problem at $\rc{k}$. Let $\z_1, \ldots, \z_\rc{k}$ be the columns of $\rc{\P}^T\rc{\W}$, that is, the solution vectors expressed in the eigenbasis of $\bc{\S}$. The total variance captured by all these $\z$ is</p>

<p>$$\sum_\rc{r} \z_\rc{r}^T\bc{\S}\z_\rc{r} = \sum_{\rc{r}, \bc{j}}  {z_{\rc{r}\bc{j}} }^2\bc{D}_\bc{jj} \p
$$</p>

Where $z_{\rc{r}\bc{j}}$ is the $\bc{j}$-th element of vector $\z_\rc{r}$. These are $\rc{r}$ weighted sums, summed together. We can group the weights that each $\z_\rc{r}$ contributes to each eigenvalue $\bc{D_{jj}}$ in to a single sum:

<p>$$
\sum_{\rc{r}, \bc{j}} {\z_\rc{r}}^2\bc{D}_\bc{jj} =  \sum_\bc{j} \bc{D_{jj}} \sum_\rc{r}{z_{\rc{r}\bc{j}} }^2 \p
$$</p>

<p>Now, since the different $\z_\rc{r}$'s are orthogonal, and each of unit length, their sum contribution to each $\bc{D_{jj}}$ must be no more than $1$, and the sum of each of their weights is 1.</p>

<p>Why? Imagine the matrix $\Z$ with the $\z_\rc{r}$for its columns. What we're saying is that its squared elements of $\Z$ should sum to 1 over the columns and not exceed 1 when summed over the rows. If we take $\Z^T\Z$, the squared and summed columns end up along the diagonal. We know $\Z^T\Z = \I$, so these are all $1$.</p>

<p>If we take $\Z\Z^T$, the squared and summed <em>rows</em> end up along the diagonal. Extend $\Z$ with orthogonal unit vectors until it is square and orthogonal. Then $\Z\Z^T = \I$. Each $1$ on the diagonal of $\I$ is the result of a sum of squared values. Some come from the original $\Z$, some from the columns we added, but all are squares, so it's a sum of nonnegative terms. Therefore, the terms contributed by the original vectors cannot sum to more than 1.</p>

<figure class="narrow">
<img src="/images/pca/zbounds.svg" class="three-quarters" />
</figure>

<p>So, we have a "weighted" sum where the total weight allowed is $\rc{k}$, and the maximum weight per element is $1$. The optimal solution is to give a maximum weight of $1$ to each of the largest $\rc{k}$ elements, that is the first $\rc{k}$ eigenvalues, and zero weight to everything else.</p>

<p>One way to achieve this is by setting $\{\z_\rc{r}\}$ to be the first $\rc{k}$ one-hot vectors, which yield the first $\rc{k}$ eigenvectors when we transform back to the standard basis.<span class="qed"/></p></div>

<p>Note that when we say "one way" in the last paragraph, we do not mean the <em>only</em> way. For instance, if we set $\rc{k} = 2$, we get an optimum with $\z_1 = (1, 0, 0, \ldots), \z_2 = (0, 1, 0, \ldots)$ (the PCA solution), but rotating the vectors by 45 degrees in their shared plane gives us $\z_1 = (\sqrt{\small 1/2}, \sqrt{\small 1/2}, 0, \ldots), \z_2 = (\sqrt{\small 1/2}, -\sqrt{\small 1/2}, 0, \ldots)$. Filling these values into the sum, we see that they also result in a weight of $1$ for $\bc{D_{11}}$ and a weight of $1$ for $\bc{D_{22}}$, which means that this is also a solution to the combined problem at $\rc{k}=2$.</p>

More broadly, given the PCA solution, any other $\rc{\W}$ whose columns span the same space as the span of the PCA solution is also a solution to the combined problem.

We have finally proved our Venn diagram correct, and we have illustrated what the rest of the light blue circle is made of.

<figure class="narrow">
<img src="/images/pca/venn.svg" />
</figure>

### Characterizing the PCA solution

Since the eigenvectors are the solution to the PCA problem, you may be forgiven for thinking of the eigenvectors  themselves in terms error minimization or variance maximization. In that case, we should guard against a misconception.

Look back at the ellipse we drew above. The first eigenvector was the major axis of the ellipse, the direction in which the data bulged out the most. However, the other eigenvector is the _minor_ axis of the ellipse. The direction in which the data bulges <em>the least</em>, this makes it the direction in which the variance is _minimized_.

To study this a bit more formally, we take the first two proofs of the previous section and turn them around. If we start with the _last_ eigenvector and work backward, we are choosing the directions that minimize the variance (and hence maximize the reconstruction error).

<div class="theorem"><p><strong class="gc">Last eigenvector.</strong> The direction in which the variance is minimized, is the eigenvector with the smallest eigenvalue
</p></div>
<div class="proof"><p><em>Proof.</em> Follow the proof of the <strong class="gc">first eigenvector</strong> theorem until the sum</p>
<p>$$
\z^T\bc{\D}\z = {z_1}^2 \bc{d}_{11} + \ldots + {z_\bc{m}}^2\bc{d}_\bc{mm} \p
$$</p>
<p>A weighted sum is minimized when all the weight is given to the smallest term. Following the same logic as before, this leads to a one-hot vector $\hat \z = (0, \ldots, 0, 1)$ that selects the last column of $\rc{\P}$, which is the last eigenvector.<span class="qed"/>
</p></div>

Did we make a mistake somewhere? We defined the principal components as directions for which variance is maximized. Then we showed that all principal components are eigenvectors. Now we learn that at least one eigenvector actually _minimizes_ the variance. What gives?

<p>The solution lies in the fact that the sum of all variances is fixed to the sum of the variances of the data, $z_\text{total}$. Imagine solving the combined problem for $\rc{k} = \bc{m} - 1$. The resulting variances along the columns of the solution $\rc{\W}$ should be as high as possible. However since all these columns are orthogonal, there is only one direction $\rc{\v}$ left which is orthogonal to all of them. The variance along this direction, $z_\rc{\v}$, is whatever variance we haven't captured in our solution:</p>

<p>$$
z_\rc{1} + \ldots + z_{\bc{m} - 1} + z_\rc{\v} = z_\text{total}
$$</p>

Since $z_\text{total}$ is fixed, maximizing the first $\bc{m} - 1$ terms is equivalent to minimizing the last. 

We can define a kind of _reverse iterative problem_ where we define the last principal component as the direction that minimizes the variance, the last-but-one principal component as the direction orthogonal to the last principal component, the last-but-two principal component as the direction orthogonal to the last two that minimizes the variance and so on. 

We can show that optimizing for this problem gives us exactly the same vectors as optimizing for the original iterative problem which maximized the variance.

<div class="theorem"><p><strong class="gc">Reverse iteration.</strong> Under the reverse iterative problem, the last-but-$\rc{r}$ principal component chosen coincides with the $\rc{k}$-th eigenvector, with $\rc{k} = \bc{m} - \rc{r}$, and therefore with the $\rc{k}$-th principal component.
</p></div>

The proof is the same as that of the <strong class="gc">PCs as eigenvectors</strong> theorem, except starting with the smallest eigenvector instead of the largest and choosing $\hat \z$ to _minimize_ at every step.

This shows us that it's not quite right to think of the eigenvectors as maximizing or minimizing some quantity like variance or reconstruction error (even though we've defined the principal components that way). The eigenvectors of $\bc{\S}$ simply form a very natural orthonormal basis for the data, from which we can derive natural solutions to optimization objectives in both directions.

There is one question that we haven't answered yet. How do we refine the combined problem so that it coincides with the iterative problem? The one property that we use in our derivations above that is not stated in the combined problem, is that in the new basis, the data are _decorrelated_. If we add this requirement to the optimization objective, we get:

$$\begin{align*}
\argmax{\rc{\W}} & \sum_\gc{i} \left( \x_\gc{i}^T\rc{\W} \right )^ 2 \\
\text{such that } & \rc{W}^T\rc{W} = \I \\
\text{and } & \kc{\frac{1}{N}}\rc{W}^T\X^T\X\rc{W} \text{ is diagonal.}
\end{align*}$$

For this problem, there is only one solution (up to negations of the principal components): the PCA solution. With this, we can finally let go of our iterative view of PCA, and embrace methods that compute all principal components in a single operation.

## Conclusion 

We have come home from a long walk. Let's settle by the fireplace and talk about all the things we've seen. 

We started with a broad idea of PCA as a method that iteratively minimizes the reconstruction error, while projecting into a lower dimensional space. For some reason, we saw last time, this works amazingly well and exposes many meaningful latent dimensions in our data. In this part, we showed first that minimizing reconstruction error is equivalent to maximizing variance.

We then looked at eigenvectors, and we show that the eigenvectors of the data covariance $\bc{\S}$ arise naturally when we imagine that our data was originally decorrelated with unit variance in all directions. To me, this provides some intuition for why PCA works so well when it does. We can imagine that our data was constructed by sampling independent latent variables $\z$ and then mixing them up linearly. In our income dataset, in the first part, there was one important latent variable: each person's salary. From this, we derived the monthly salary, and the majority of their quarterly income. The other latent variable captured random noise: whether people had some extra income, bonuses, etc.

<figure class="narrow">
<img src="/images/pca/sol-w2.svg" />
</figure>

We can imagine the same approach with the Olivetti faces. We get $\bc{4096 \text{ features}}$, but under water, most of the work is done by a few _latent_ dimensions which are largely independent of each other: the subject's age, the direction of the light source, their apparent gender and so on. All of these can be chosen independently from each other, and are likely mostly decorrelated in the data. That is, if we don't light all women from the left, or only chose old men and young women.

<aside>If these assumptions are violated, it may point to undesirable biases in our data. A very relevant topic at the moment. This shows that bias can be defined in terms of the assumed latent variables. Unfortunately, once the data is biased, it reduces our ability to extract the latent features, which makes it more difficult to counteract the bias.
</aside>

Since the assumptions behind our transformation from decorrelated data to the observed data are mostly correct, finding this transformation, and inverting it retrieves the latent dimensions. The greater the variance along a latent dimension, the more variance that particular "choice" added to the the data. The choice of the subject's age adds more variance than the lighting, and the lighting adds more variance than the gender.

The heart of the method is the spectral theorem. Without the decomposition $\bc{\S} = \rc{\P}\bc{\D}\rc{\P}^T$, none of this would work. Proving that such a decomposition always exists for a symmetric matrix, and that every matrix for which the decomposition exists is symmetric, is not very difficult, but it takes a lot more background than we had room for here: this includes matrix determinants, the characteristic polynomial and complex numbers. In the next part, we will go over all these subjects carefully, building our intuition for them, and finish by thoroughly proving the spectral theorem.

Finally, you may wonder if any of these new insights help us in computing the principal component analysis. The answer is yes, the eigendecomposition $\bc{\S} = \rc{\P}\bc{\D}\rc{\P}^T$ can be computed efficiently, and any linear algebra package allows you to do so. This gives you the principal components $\rc{\P}$, and the rest is just matrix multiplication.

The eigendecomposition is certainly faster and more reliable than the projected gradient descent we've used so far, but it can still be a little numerically unstable. In practice, PCA is almost always computed by **singular value decomposition** (SVD). The SVD is such a massively useful method that it's worth looking at in more detail. It's inspired very much by everything we've set out above, but its practical applications reach far beyond just the computation of principal components. We'll develop the SVD in the last part of the series, finishing up with a complete view of PCA, down to the theorem at its heart and the standard way of implementing it.

<strong>Acknowledgements.</strong> Many thanks to <a href="https://emilevankrieken.com/">Emile van Krieken</a> for corrections and suggestions.

## Appendix

Here is the proof that the combined problem for variance maximization is equivalent to the combined problem for reconstruction error.

<div class="theorem"><p><strong class="gc">Equivalence of combined optimization</strong> The combined problem for reconstruction error minimization<br />
$$\begin{align*}
&\argmin{\rc{\W}} \sum_\gc{i} \|\x_\gc{i} - \x'_\gc{i}\|\\
&\;\;\;\text{such that } \rc{\W}^T\rc{\W} = \I\\
\end{align*}$$
is equivalent to the following variance maximization problem
$$\begin{align*}
&\argmax{\rc{\W}} \sum_{\gc{i}, \rc{r}} {z_{\gc{i}\rc{r}}}^2 \;\;\;\;\;\text{with } z_{\gc{i}\rc{r}} = \rc{\w_r}^T\x_\gc{i}\\
&\;\;\;\text{such that } \rc{\W}^T\rc{\W} = \I \p\\
\end{align*}$$
</p></div>
<div class="proof"><p><em>Proof.</em> Define the vector $\z_\gc{i}$ as the combination of all the individual $z_{\gc{i}\rc{r}}$'s:</p>

<p>$$
\z_\gc{i} = \left ( \x_\gc{i}^T\rc{\w}_1, \ldots, \x_\gc{i}^T\rc{\w}_\rc{k} \right) \p
$$</p>

<p>Note that $\x_\gc{i}' = \rc{\W}\z_\gc{i}$. That is, $\z_\gc{i}$ is the latent vector from which we reconstruct $\x'_\gc{i}$. The length of $\z$ is given by:
</p>

<p>$$
\|\z_\gc{i}\|^2 = {z_{\gc{i}1}}^2 + \ldots + {z_{\gc{i}\rc{k}}}^2
$$</p>

<p>so that our objective simplifies to 
</p>

<p>$$
\argmax{\rc{\W}} \sum_\gc{i} \|\z_\gc{i}\|^2 \kc{\;\;\;\text{such that } \W^T\W = \I} \p
$$</p>

<p>The (squared) length of $\z_\gc{i}$ is the same as that of $\x_\gc{i}'$, because 
</p>

<p>$$
\|\x_\gc{i}'\|^2 = \x_\gc{i}'^T\x_\gc{i}' = \left(\rc{\W}\z_\gc{i}\right)^T\rc{\W}\z_\gc{i} = \z_\gc{i}^T\rc{\W}^T\rc{\W}\z_\gc{i} = \z_\gc{i}^T\z_\gc{i} = \|\z_\gc{i}\|^2
$$</p>

<p>so that our objective rewrites to 
</p>

<p>$$
\argmax{\rc{\W}} \sum_\gc{i} \|\x'_\gc{i}\|^2 \kc{\;\;\;\text{such that } \W^T\W = \I} \p
$$</p>

<p>At this point, we can draw another triangle: from the origin, to $\x_\rc{i}$ to $\x_\gc{i}'$ and back to the origin. If $\x_\gc{i}'$ is the closest point to $\x_\gc{i}$ in the subspace spanned by the columns of $\W$, then the angle at $\x_\gc{i}'$ must be orthogonal (see the proof in the appendix of the previous part). Therefore</p>

<p>$$
\|\x_\gc{i}\|^2 = \|x_\gc{i}'\|^2 + \|\bc{\x_i' - \x_i}\|^2
$$</p>

<p>From which we can derive the <span class="bc">reconstruction error</span> minimization objective in the same way we did for the iterative problem. <span class="qed" /></p>
</div>


<!-- {% endraw %} -->
