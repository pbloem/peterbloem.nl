---
title: A friendly introduction to Principal Component Analysis
date: 31-01-2020
math: true
code: true
---
<!-- {% raw %} -->

<header>
<h1>A friendly introduction to PCA</h1>
<div class="subh1">part 2: Eigenvectors and eigenvalues</div>
</header>

<ul class="links">
	<li>31 Jan 2020</li>
	<li><a href="https://github.com/pbloem/blog/blob/master/2020/pca.ipynb">notebook on github</a></li>
		<li><a href="/blog/pca">part 1</a></li>
		<li><a href="/blog/pca-3">part 3</a></li>
</ul>

In <a href="/blog/pca">part 1</a> of this series, we took what I think is the most intuitive route to defining PCA. The solution method we used wasn't very efficient or stable, and some parts of the "why" question were left unresolved, but we answered the "how" question well enough to show the method in action and hopefully convince you that it's worth understanding a little deeper.

<p>We'll start tying up one of the loose ends from the last part. We defined PCA as a solution to the following problem: for a mean-centered set of instances $\x_\gc{i}$ find a sequence of $\rc{k}$  unit vectors $\rc{\w_1}, \ldots, \rc{\w_k}$ where each unit vector is defined by</p>

<p>$$
\;\;\;\;\;\;\;\; \rc{\w_r} = \begin{cases} 
	&\argmax{\rc{\w}} \sum_\x ||\x^T\rc{\w} \times \rc{\w} - \x||^2 *\\
	&\;\;\;\;\;\;\text{such that } \rc{\w}^T\rc{\w} = 1, & \bc{\text{(a)}}\\
	&\;\;\;\;\;\;\text{and } \rc{\w}\perp\rc{\w_i} \text{ for } \rc{i} \in [1 \ldots \rc{r}-1]& \bc{\text{(b)}}
\end{cases}
$$</p>

That is, each unit vector defines an approximation of $\x_\gc{i}$, and the objective is to keep the distance between the reconstruction and the original instance as small as possible, while ensure that <span class="bc">(a)</span> the vector is a unit vector, and <span class="bc">(b)</span> the vector is orthogonal to all preceding vectors.

<p>If you've read other explanations of PCA before, all this talk of reconstruction loss might sound confusing. Most descriptions frame the problem of PCA as <strong>maximizing the variance in the projected data</strong>. We can show that the two formulations are equivalent.
</p>

I started with the reconstruction error, since it requires fewer assumptions, and the assumption are more likely to feel intuitive to a machine learning audience, but the variance perspective will be important in digging deeper into the underlying principles. 

## Minimal reconstruction error is maximal variance

<p>As in the last part, we'll start with the one-dimensional case. We choose a single vector $\rc{\w}$ and project the data onto it orthogonally. That means that for every instance $\x_\gc{i}$, we get a single number $z_\gc{i}$.</p>
 
Our objective is to choose $\rc{\w}$ so that the variance among the set of $z_\gc{i}$ is maximized. That means that in this image

<figure class="narrow">
<img src="/images/pca/random-w.svg" />
</figure>

<p>we want to choose $\rc{\w}$ so that the red points are spread out as widely as possible.</p>

Why is this the same as minimizing the reconstruction loss? It's easy to see this if we draw a a diagram for a single instance.

<figure class="narrow">
<img src="/images/pca/recvar-diagram.svg" />
</figure>

<p>By Pythagoras, we have $\|\x_\gc{i}\|^2 = \|\bc{\r}\|^2 + z^2$. The vector $\x_\gc{i}$ remains constant, since that is given by the data. The only thing we change is the direction of the vector $\rc{\w}$. If we change that to make the reconstruction error $\|\bc{\r}\|$ smaller, the distance $z$ must get larger.</p>

<aside>
I first learned about the equivalence between variance maximization and reconstruction error minimization from <a href="http://alexhwilliams.info/itsneuronalblog/2016/03/27/pca/">this blog post</a> by <a href="">Alex Williams</a>, which uses a similar diagram.
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
&\argmax{\rc{\w}} \kc{\frac{1}{N}} \sum_\gc{i} (\bar z - z_\gc{i})^2
\end{align*}
$$
<p>The objective inside the argmax is simply the definition of variance. We can drop the constant multiplier $\kc{1/N}$, since it doesn't affect where the maximum is. We can show that $\bar z$, the mean of the projections is 0:</p>
$$
\bar z = \frac{1}{N}\sum_\gc{i} \rc{\w}^T\x_\gc{i} = \rc{\w}^T\left( \frac{1}{N} \sum_\gc{i} \x_\gc{i}\right) = \rc{\w}^T \mathbf{0} \p
$$
<aside>The last step follows from the assumption that the data is mean-centered.</aside>
<p>Thus our objective simplifies to </p>

$$
\begin{align*}
&\argmax{\rc{\w}} \sum_\gc{i} \rc{\w}^T\x_\gc{i}^2 \p
\end{align*}
$$

<p>From our diagram above, we know that $\|x_\gc{i}\|^2 = \|\bc{\r}\|^2 + z^2$, or, equivalently</p>

$$
\begin{align*}
\|\x_\gc{i}\|^2 &= \|\bc{\x_\gc{i} - \x'_\gc{i}}\|^2 + z^2 \\
z^2 &= \|\x_\gc{i}\|^2 - \|\bc{\x_\gc{i} - \x'_{\gc{i}}}\|^2 \p
\end{align*}
$$

<p>Filling this in, we get </p>

$$
\begin{align*}
&\argmax{\rc{\w}} \sum_\gc{i} \kc{||\x_i||^2} \oc{-} ||\x_\gc{i} - \x_\gc{i}'||^2 \p
\end{align*}
$$

<p>where $\kc{||\x_i||^2}$ is an additive constant we can remove without affecting the maximum and removing <span class="oc">the minus</span> turns the maximum into a minimum. Thus, we end up with </p>

$$
\begin{align*}
&\argmin{\rc{\w}} \sum_\gc{i} ||\x_\gc{i} - \x'_\gc{i}||^2
\end{align*}
$$

<p>which is the objective for minimizing the reconstruction loss. <span class="qed"/></p>

</div>

<p>The rest of the procedure is the same as before. Once we've chosen $\rc{\w_1}$ to maximize the variance, we choose $\rc{\w_2}$ to maximize the variance and to be orthogonal to $\rc{\w_1}$, we choose $\rc{\w_3}$ to maximize the variance and to be orthogonal to  $\rc{\w_1}$ and to  $\rc{\w_2}$ and so on.</p>

In the previous part, we also defined a <strong>combined problem</strong>, which combined all the vectors together in one optimization objective. We can work out an equivalent for the variance perspective (the proof is in the appendix). 

<p><div class="theorem"><strong class="gc">Equivalence of combined optimization</strong>The combined problem for reconstruction error minimization<br />
$$\begin{align*}
&\argmin{\rc{\W}} \sum_\gc{i} \|\x_\gc{i} - \x'_\gc{i}\|\\
&\;\;\;\text{such that } \rc{\W}^T\rc{\W} = \I\\
\end{align*}$$
is equivalent to the following variance maximization problem
$$\begin{align*}
&\argmax{\rc{\W}} \sum_{\gc{i}, \rc{r}} {z_\gc{i}}^2 \;\;\;\;\;\text{with } z_\gc{i} = \rc{\w_r}^T\x_\gc{i}\\
&\;\;\;\text{such that } \rc{\W}^T\rc{\W} = \I \p\\
\end{align*}$$
</div></p>


If we want to optimize a matrix $\rc{\W}$ with mutually orthogonal unit vectors for columns in one go, then maximizing the sum of the variances in all <span class="rc">latent directions</span> is equivalent to minimizing the reconstruction loss defined in the combined approach  

One consequence is that as in the first part, if we set $\rc{k} = \gc{n}$, $\rc{\W} = \I$ is a solution to the combined problem. This shows, again, that the combined approach has a larger solution space than the iterative approach. 

But it also tells us something else. The sum of all the squared variances along all axes in the data space is maximal. No orthonormal projection $\rc{\W}$ can make the sum-total variance larger. The best we can do is to find a $\rc{\W}$ that maintains the total variance of the dataset. The set of $\rc{\W}$'s with this property is the set of solutions to the combined problem. Each of them defines the total variance as a sum, where each term in the sum is the variance of the data projected in the direction of one of the columns $\rc{\w_r}$ of $\rc{\W}$.

Here's what that looks like for the Olivetti faces. 

<figure class="narrow">
<img src="/images/pca/sum-variance.svg" />
</figure>

We plot the sum total of the squared variances of the data as a <span clas="gc">green vertical line</span> and the sum total of the PCA solution for increasing $\rc{k}$ as a red line.

<aside>
In this case, we have data that is wider than it is tall, so we reach the ceiling before $\rc{k} = \bc{m}$, when $\rc{k}=\gc{n}$. This is to do with the <em>rank</em> of the matrix $\X$. We'll shed some light on this in the next part.
</aside>

This shows that we can think of the total variance in all directions in the data space as an additive quantity in the data, which we can call its information content for want of a better phrase. Note, however that there are many different formalizations of information around. I'm not implying a direct relation to any of those. It's just a convenient term that fits well within the constraints of PCA.

If we keep all the dimensions, we retain all the information. If we start with the first principal component and add components one by one, we add to the total of squared variances in a sum that eventually sums up to the sum total of squared variances in the data (much like the reconstruction loss eventually goes to zero). Both perspectives&mdash;retaining variance and minimizing reconstruction loss&mdash;are formalizations of the same principle; that <em>we want to minimize the amount of information lost in the projection</em>.

## Eigenvectors

Let's return to this image.

<figure class="narrow">
<img src="/images/pca/venn.svg" />
</figure>

These solutions are the same for both perspectives: variance maximization and reconstruction error minimization. We have two unresolved questions about this image:
First, how is it that the solution to the iterative approach reaches the same optimum as the solutions to the combined approach? Note how strange this is: solving the iterative problem is a greedy search: once we have chosen $\rc{\w_1}$ it can't ever go back. The process for the combined approach solves all the vectors in sync. How is it that this ability to tune the vectors in concert doesn't give us any advantage in the minimum we find?

The second question, and the question we will answer first, is what is the meaning of PCA solution among the combined solutions? Can we _characterize_ it, perhaps by adding an additional constraint to the combined problem?

The answer to the second question can be summarized in one phrase:
<blockquote>
The principal components are <em>eigenvectors</em>.
</blockquote>

Depending on your background, this will raise one of two questions. "The eigenvectors _of what_?" and, more simple "What are eigenvectors?". Let's start there, and work our way back to the other questions.

### What are eigenvectors?

The most common, and probably the most intuitive way to think about matrices is _as transformations of points in space_. 

* Square matrices
* domain coloring, Mona Lisa
* Eigendecomposition
* Spectral theorem

### Eigenvectors of which matrix?

Back to the PCA setting. Where do we find eigenvectors in this picture? We have a matrix, the data matrix $\X$, but it isn't square, and it's never used as a transformation. In fact, we tend to think of it as containing the points in the plane that we've interested in.

All our talk of variances earlier...

* Covariance matrix
* Data normalization
* Basis transformations
* Quadratic forms
* 


## Appendix



<!-- {% endraw %} -->
