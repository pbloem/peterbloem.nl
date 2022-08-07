---
title: Computing eigenvectors and singular vectors
date: 31-01-2020
math: true
code: true
---
<!-- {% raw %} -->

<header>
<h1>Computing eigenvectors and singular vectors</h1>
<div class="subh1">part 5 in a series on principal component analysis</div>
</header>

<ul class="links">
	<li>31 Jan 2020</li>
	<li><a href="https://github.com/pbloem/blog/blob/master/2020/pca.ipynb">notebook on github</a></li>
		<li><a href="/blog/pca">part 1</a></li>
		<li><a href="/blog/pca-2">2</a></li>
		<li><a href="/blog/pca-3">3</a></li>		
		<li><a href="/blog/pca-4">4</a></li>
		<li>5</li>

</ul>

We have looked at what PCA is, at how to understand it, and we have spent a full post on developing the tools necessary to prove the spectral theorem, the particular decomposition that makes it all possible.

What we haven't discussed yet, in any detail, is how to _build it_. And how to build it efficiently.

In practice, you'll rarely have to build much of PCA from scratch, and if you do, there are better resources than this to tell you what to pay attention to. So why do we care about building a PCA implementation from scratch ourselves? Bacuse building something os one of the best ways of understanding it. There are many things we don't yet understand, or uynderstand well about PCA. By looking at some of the ways you might implement it effciently, we can learn a lot more about what it actually does, and how it relates to other algorithms.

So that will be our aim. We won't focus on the most popular algorithms, and we won't bother with all the tricks required to make the algorithms faster or more robust. We will simply set ourselves the challenge to implement PCA from scratch in a relatively efficient manner, but we will focus on those algorithms that illustrate most clearly what is happening when PCA is computed.

Remember that we've seen one algorithm already in Part 1. There, we searched, using gradient descent, for the unit vector that gave us the best least-squares reconstruction of the data from a single number. This gave us the first principal component, andfrom that we could search for the second one, and so on.

Our job in this part and the next is to do a little better. We'll still require iterative algorithms with approximate solutions, but we'll tty to get away from approximating the principal components one-by-one.

The key in this part is the fact that we derived in part 2: the principal components are the eigenvalues of the sample covariance matrix $\bc{\S}$ of our data. All we need to do is to compute $\bc{\S}$, and then figure out what its eigenvectors are. Along the way, we'll try to develop a little more insight into what eigenvectors are, and what they tell us about a matrix.

We'll look at three algorithms, that each build on one another: power iteration, orthogonal iteration and QR iteration.

Then, we'll switch to the alternative perspective we developed in the previous part: that the principal components are the singular vectors of the data matrix $\X$, and we'll build on our algorithms for computing eigenvalues to develop algorithms along the same lines for computing the SVD.


## Power iteration: computing one eigenvector

Before we get to the business of computing eigenvectors, allow me a little diversion. It will help us to get some intuition for what eigenvectors are, and this intuition will become the foundation for all algorithms in this part and the next.

As worrying as it is to contemplate, some people reading this will have become internet users after Google was invented. If this is you, you will have no memory of how useless search engines were before Google came along. You won't have experienced the watershed that the introduction of Google was. You may not even believe that their almost-complete market dominance can be traced back to one simple idea.

The modern Google engine combines a vast array of methods and philosophies, but the original idea that set it so far apart from the competitors was singular, and simple.

Back then, the main problem facing search engines was the number of webpages trying to game the system. Authors would include fake keywords, large swathes of invisible text, everything they could think of to get as high in the results for as many different search terms as possible.

The main thing Google wanted to do was to develop a measurement of reputation: a single number that could capture to what extent a website was a respectable source of information playing by the rules, versus a cheap ad-laden swindle, trying to attract clicks. Their basic idea was a social one: if somebody somewhere on the web chooses to link to you, they must trust you, and this should serve as a signifier of your reputation.

By itself, this is easy enough to game. Just set up a load of websites that all link to each other. But the idea can be applied _recursively_: the better the reputation of the people that link to you, the better your reputation. And their reputation is determined by the reputation of the sites that link to them and so on.

Theoretically we keep going forever. Practically, we keep doing this for a certain number of steps, and then stop, and assing those sites you stop at a reputation of 1. It turns out that if you take enough steps, doesn't matter much how you assign this reputation when you stop. What decides the ultimate reputation that websites get is the structure of the graph of who links to whom.

This may seem like a slightly mind-bending idea at first, but that is mostly because we're working backwards. We can define the same idea forward. Let's say that we start out by giving every website one unit of reputation for free. Then, at every step, every website takes all its current reputation, divides it up equally over all websites it links to and gives it all away. If the website receives no incoming links from others it is now out of reputation and stays at 0. If, however, it gets some incoming links as well as outgoing links, it also gets some new reputation. We then iterate this process: every step each website divvies up all reputation it has an gives it all away.

-- image

After a couple of steps of this, as we will show later, this process reaches a stable state. Each site ends up sending out as much reputation as it receives. The higher this amount, the more trustworthy the website.

Why is this hard to game? Imagine setting up a bunch of websites that all link to each other. Say you have the resources to host 10 sites. That means that at the start of the process, you get ten units of reputation. The best you can do to maintain this reputation is never to link out to legitimate websites, so no reputation flows out. But then, unless you get people to link to you, there's no reputation flowing in either.

What does any of this have to do with eigenvectors? The link becomes clear when we try to figure out what the stable state of this process is. First we need to translate the problem setting to linear algebra. Let's say we have a set of $n$ websites. We can represent the directed graph of which site links to which other site (the _web graph_) as a large $n \times n$ matrix $\bc{\A}$: the _adjacency matrix of the web graph_.

- img: graph, adjacency matrix

<aside>
We'll simplify the problem by ignoring the number of links and the number of different pages a website can have. If you're building a search engine, you can use all this information to make your method more powerful and more complex, but we're only interested in the basic idea here.
</aside>

We can model the way a website $i$ distributes its unit of reputation, by starting with a one-hot vector indicating that website. This is a vector of length $n$, for $n$ websites, with zeroes everywhere, except at the index $i$, corresponding to the website $i$, where it contains a $1$. This represents our starting point for website $i$, where it has one unit of reputation, and hasn't distributed anything yet.

If we multiply this vector by our adjacency matrix, we end up with a new vector that contains $1$'s for all the websites that $i$ linked to.

However, this doesn't keep the total amount of reputation fixed. We stated that the website breaks its one unit of reputation into $k$ equal parts, and gives each to one of the sites it links to. As a simple solution, we _normalize_ the vector after the multiplication: we compute the sum of all the elements in the vector and then divide each by the sum.

<aside>We could also row-normalize the matrix, but separating the two steps will serve to illustrate an important point later.
</aside>

Now, we can just repeat the process. We multiply the vector by $\bc{\A}$, normalize it, multiply the result by $\bc{\A}$ again, and so on. Every time we iterate this algorithm, the reputation diffuses across the graph a little more.

-- image

What ultimately happens to this sequence of vectors depends on the properties of the graph. However, for most graphs, especially the slightly messy ones like the web graph, the process will converge to a fixed state. For most starting vectors his multiplication will lead ultimately to a vector, which when multiplied by the adjacency matrix, and normalized, **remains the same**. It doesn't matter what site we start at, we will always end up with the same distribution of reputation across the graph.

And that provides the link with eigenvectors. If we call the input input vector $\rc{\v}$ and the factor required to normalize the result of the matrix multiplication $\frac{1}{\bc{\lambda}}$, then we have reach a stable state when:

<p>$$\begin{align*}
\frac{1}{\bc{\lambda}}\bc{\A}\rc{\v} &= \rc{\v} \\
\bc{\A}\rc{\v} &= \bc{\lambda}\rc{\v} \p
\end{align*}$$</p>

This should look familiar. It's the definition of an _eigenvector_, which we first saw in [part 2](/blog/pca-2). In short, if we try this iterative approach, and it converges to a stable vector, _we have found an eigenvector of our matrix_. In fact, as we will see in a bit, we will have found the _principal_ eigenvector. The one with the largest eigenvalue.

<!--
For me, this is the key intuition for why eigenvectors are so important. If we iterate the operation of the matrix, the eigenvectors represent stable states (ignoring changes in magnitude). It seems pretty intuitive to me thart when you want to characterize an operation, you can start with its stable states.
 -->

In Google's use case, this tells us that after infinitely many redistributions of reputation, the distribution of reputation over the web stabilizes. This is the basic idea behind _pagerank_, Google's main algorithm (at least in the early days). The websites that ultimately end up with the most reputation, are likely to provide quality content and should end up higher in the ranking of the search results.

<aside>You may wonder why all the reputation doesn't flow into a single website. This <em>could</em> happen if a website is linked to, but doesn't link anywhere else. The real pagerank algorithm includes a few tricks to avoid such situations, but so long as a website has incoming and outgoing links, it will end up with some proportion of the reputation, but not all of it, the same way a bathtub with the tap running and the plug removed will never be fully empty.
</aside>

We can extend this principle to a lot of other situations. In any process where some quantity&mdash;like reputation, money or people&mdash;is distributed between entities according to fixed proportions, the final, stable state of such a system is an _eigenvector_ of the matrix describing how the quantitiy is redistributed.

For instance, if you have a number of cities, and some statistics describing what proportion of people move from every city to every other city for each year, you can work out what populations the cities will stabilize to.

- city example, with transition matrix

<aside><a href="https://setosa.io/ev/eigenvectors-and-eigenvalues/">This explainer of eigenvalues</a> by Victor Powell and Lewis Lehe provides a nice tool to visualize just this scenario.
</aside>

In these examples, the quantity being redistributed was reputation, or population. We can also take this quantity to be _probability_. Instead of counting the total number of people in each city, we can take the probability that a person moving around randomly ends up in a given city after some fixed, large number of steps $n$.

Or, in the Google example, imagine a user starting at a given website $i$, and clicking a random outgoing link. We don't observe which link they click, so the best we can say is that the user is on one of the sites being linked to by $i$, with each getting equal probability. That is, we get a uniform distribution over all websites linked to by $i$. This is exactly the vector that we get from one iteration of our algorithm: we multiply the one-hot vector for $i$ by $\bc{\A}$ and normalize.

If the user, wherever they've ended up, clicks another random link, our distribution representing their current position diffuses again. If we had a probability of $0.1$ for them being on website $j$, and $j$ links out to two other websites, each of these gets probability $0.05$. All we need to do is multiply the probability vector by $\bc{
\A}$ again, and normalize.

This kind of description of a linear redistribution of quantities is called a _Markov process_ or a _Markov chain_. It's a very useful branch of mathematics, but we'll not dig into it any deeper. It's provided us with two things. First, another perspective on eigenvectors as the stable states to which the process of repeated matrix multiplication converges. Second, it suggests a way of computing at least one eigenvector.

So back to the business at hand. How do we compute eigenvectors?

<!--
As we saw in [part two](/blog/pca-2), the principal components of a mean-centered dataset are the eigenvectors of the covariance matrix. If we estimate this covariance matrix from the data, all we need to do is find its eigenvalues.

<aside>As shown in <a href="/blog/pca-2">part two</a>, the covariance matrix for mean-centered data $\X$ can be estimated with $\X^T\X$ divided by the number of instances $N$ (or $N-1$ for an unbiased estimate).</aside>
 -->

Let's follow the iteration approach and analyse it a bit more carefully. When we compute the eigenvectors of the covariance matrix, we have two advantages over Google. First, the matrix we will deal with is probably much smaller than the adjacency matrix of the web graph. We'll assume that we can easily store it in memory and multiply vectors by it. Second, since it's a covariance matrix, _we know that it's symmetric_. This will make several aspects of our analysis a lot simpler.

The algorithm suggested by the story of Google can be summarized by the following iteration:

$$
\x \leftarrow \frac{\bc{\A}\x}{\|\bc{\A}\x\|_1} \p
$$

That is, we multiply $\bc{\A}$ by $\x$ and then divide the entries of the resulting vector by its sum, which we've represented here by the l1-norm.

As it turns out, it doesn't matter much what norm we normalize by. We can just as easily use the Euclidean length, and normalize the vector to be a unit vector after each step. If we do this, it stops being a probability vector, but the algorithm still yields an eigenvector. Since it makes the analysis a little simpler, we'll switch to that approach, and use the iteration

$$
\x \leftarrow \frac{\bc{\A}\x}{\|\bc{\A}\x\|} \p
$$

<p>If we removed the normalization step, and made the iteration $\x \leftarrow \bc{\A}\x$, it would be very easy to see that after a number of iterations, say four, the resulting vector $\x_4$ would be $\bc{\A}\bc{\A}\bc{\A}\bc{\A}\x_0$, where $\x_0$ is the vector we started with. Put simply, we would have $\x_k = \bc{\A}^k \x_0$.</p>

<p>Luckily, the normalization step doesn't make things much more difficult than this. Note that the norm of a vector is a linear quantity: if we multiply all the elements of the vector by 2, the norm is also multiplied by 2. In short $\|\x\bc{c}\| = \|\x\|\bc{c}$.</p>

<!-- <aside>This is a standard property in geometry: if you scale a figure, and one line segment is scaled up by $s$, then all other line segments are also scaled by $s$. So, if the components of $\x$ are scaled by 2, the length of $\x$ itself is scaled by 2 as well.</aside> -->

Therefore, we can say that

<p>$$
\x_2 = \frac{\bc{\A}\x_1}{\|\bc{\A}\x_1\|}
= \frac{\bc{\A}   \frac{   \bc{\A}\x_0  }{   \|\bc{\A}\x_0\|}  }{   \|\bc{\A}\frac{   \bc{\A}\x_0  }{   \|\bc{\A}\x_0\|}\|}
= \frac{ ~\, \bc{\A}\bc{\A}\x_0   \;\;\frac{1}{ \|\bc{\A}\x_0\|}  }{   \| \bc{\A}\bc{\A}\x_0 \|\frac{1}{   \|\bc{\A}\x_0\|}} = \frac{\bc{\A}^2\x_0}{\|\bc{\A}^2\x_0\|} \p
$$</p>

Or, more generally, the $k$-th vector in our iteration is just the vector $\bc{\A}^k\x_0$, normalized. Let's see what we can say about this vector.

<p>First, we know from the spectral theorem that if $\bc{\A}$ is $n \times n$ and symmetric, it has $n$ real eigenvalues $\bc{\lambda}_i$&mdash;including multiplicities&mdash;and $n$ corresponding eigenvectors $\rc{\v}_i$. We'll assume that the eigenvalues are sorted by magnitude, so that $\bc{\lambda}_1$ is the dominant eigenvalue, and $\bc{\lambda}_2$ the second biggest.
</p>

<p>We also know, from previous parts, that the eigenvectors form a basis: any vector in $\mR^m$ can be written as a linear combination of the eigenvectors. That means that we can write $\x_0$ as $c_1\rc{\v}_1 + \ldots + c_n\rc{\v}_n$, for some values $c_1 \ldots c_n$. If we choose $\x_0$ randomly, the probability that any of these are exactly $0$ will be vanishingly small.
</p>

<!--
<aside>In mathematical parlance, we say this is "almost certain", or that it has probability 1. In practice, this isn't quite true once we start implementing the algorithm on an actual computer, but the probability is small enough.
</aside>
 -->

<p>Now, let's see what we get if we start with $\x_0$ written like this, and compute $\x_k$. First, let's look at the unnormalized vector $\bc{\A}^k\x_0$</p>

<p>$$
\begin{align*}
\bc{\A}^k\x_0 &= \bc{\A}^k(c_1\rc{\v}_1 + c_2\rc{\v}_2 + \ldots + c_n\rc{\v_n}) \\
&=c_1\bc{\A}^k\rc{\v}_1 + c_2\bc{\A}^k\rc{\v}_2 + \ldots + c_n\bc{\A}^k\rc{\v_n} \\
&=c_1{\bc{\lambda}_1}^k\rc{\v}_1 +  c_2{\bc{\lambda}_2}^k\rc{\v}_2 + \ldots + c_n{\bc{\lambda}_n}^k\rc{\v_n} \\
&=c_1{\bc{\lambda}_1}^k \left(\rc{\v}_1 +  \frac{c_2}{c_1}\frac{{\bc{\lambda}_2}^k}{{\bc{\lambda}_1}^k}\rc{\v}_2 + \ldots + \frac{c_n}{c_1}\frac{{\bc{\lambda}_n}^k}{{\bc{\lambda}_1}^k}\rc{\v_n} \right ) \\
\end{align*}.
$$</p>

<p>In the last line, we take the factor $c_1{\bc{\lambda}_1}^k$ out of the brackets. This leaves the term $\rc{\v}_1$ by itself, and divides the rest of the terms by this factor. Note the factors ${\bc{\lambda}_i}^k/{\bc{\lambda}_1}^k$ in all terms except the first. We know that $\bc{\lambda}_1$ is the eigenvalue with the greatest magnitude, so $\bc{\lambda}_i/\bc{\lambda}_1$ is always in the interval $[-1, 1]$. This means that its $k$-th power in these terms goes to zero with $k$. For large enough $k$, all that remains is</p>

<p>$$
\bc{\A}^k\x_0 \to c_1{\bc{\lambda}_1}^k \rc{\v}_1 \p
$$</p>

That is, we converge to the first eigenvector. The normalization is just a simple way to keep the factor ${\bc{\lambda}_1}^k$ from blowing up or decaying exponentially with $k$.

<aside>This also tells us the rate of convergence. Every iteration, the second biggest term in our sum decays with a factor of $|\bc{\lambda}_2/\bc{\lambda}_1|$. This tells us that we are converging geometrically, and that the speed of convergence is determined by the difference in magnitude between the biggest and the second biggest eigenvalue.
</aside>

This is the method of power iteration. A very simple way of computing eigenvectors and a very powerful one. All you need is a way to compute matrix/vector products and a way to normalize your vectors. Even on something as large as the web adjacency matrix, this is a feasible computation (if you store it as a sparse matrix).

## Orthogonal iteration: adding another eigenvector

So, that's a simple way to compute one eigenvector (and its eigenvalue). How do we add more? The simplest trick is to us the fact that **eigenvectors are always orthogonal to one another**.

Let's try a simple approach: we perform the power iteration to make our vector $\x$ converge to the dominant eigenvector, but at the same time, we also perform the power iteration on a vector $\y$, which at each step, we force to be orthogonal to $\x$.

<p>How do we force one vector to be orthogonal to another? Let's say we have two vectors ${\x}$ and ${\y}$ and we want to change $\y$, as little as possible, so that it is orthogonal to ${\x}$. The simplest way to achieve this, is to first project $\y$ onto ${\y}$, call the result $\y_x$, and then to assume that $\y$ consists of two components: the part $\y_x$, that points in the same direction as ${\x}$ and the remainder ${\y}_r$. This tells us that ${\y} = {\y}_v + {\y}_r$, and thus that ${\y}_r = {\y} - {\y}_x$.</p>

-- image

<p>The vector ${\y}_r$, ${\y}$ minus ${y}$ projected onto ${\x}$ is called the <em>rejection</em> of ${\y}$ from ${\x}$. We'll use this to build our new power iteration. Here is the new algorithm:
</p>

<p>$$\begin{align*}
&\textbf{loop:} \\
&\tab {\x}, {\y} \leftarrow \bc{\A}{\x}, \bc{\A}{\y} & \\
&\tab {\y} \leftarrow {\y} - \text{proj}_{\x}(\y) & \text{make ${\y}$ orthogonal to ${\x}$} \\
&\tab {\x}, {\y} \leftarrow {\x}/\|{\x}\|, {\y}/\|{\y}\| & \text{normalize both}
\end{align*}$$</p>

Note that the operations we apply to $\x$ are exactly the same as before. All we've done it to add another vector to the iteration. Our earlier proof that $\x$ converges to the dominant eigenvector $\rc{\v}_1$ still applies to this algorithm.

Intuitively, it seems like we have a good chance that ${\y}$ will convergence to the second most dominant eigenvector. To help us analyze this question, and to build a foundation for later algorithms, we'll first take this algorithm and rewrite it in matrix operations.

The first line is easy: if we create a new $n \times 2$ matrix $[{x}\;{\y}]$ with vectors $\rc{v}$ and $\rc{\w}$ as columns, then the matrix multiplication $\bc{\A}[{\x} {\y}]$ gives us a new $n \times 2$ matrix whose columns are the new ${\x}$ and ${\y}$.

The second and third line, rejection and normalization, we can actually represent in a single matrix operation called a _QR Decomposition_. A QR decompoosition takes a rectangular matrix $\Z$ and represents it as the product of a rectangular matrix $\Q$ whose columns are all mutually orthogonal unit vectors, and a square matrix $\R$ which is upper triangular (all values below the diagonal are 0).

To apply this to our example, let $\Z = \bc{\A}[{\x} {\y}]$, the $n \times 2$ matrix we get from the first line of our algorithm. If we apply a QR decomposition $\Z = \Q\R$, then $\Q$ must be an $n \times 2$ matrix with 2 orthogonal unit vectors for columns, and $\R$ must be a $2 \times 2$ matrix with the bottom-left element 0.

If we draw a picture, it becomes clear that what lines 2 and 3 of our algorithm are doing is computing a QR decomposition or $\Z$.

-- image

Because $\R$ is upper triangular, the first column of $\Z = \Q\R$ is just the first column of $\Q$ multiplied by some scalar. Because we require the first column of $\Q$ to be a unit vector, this must be the scalar that normalizes the first column of $\Z$.

The second column of $\Z$ is a linear combination of the second column of $\Q$ and the first column of $\Q$. Here the requirement we get from the definition of the QR decomposition is that the second column of $\Q$ is also a unit vector, _and_ that it is orthogonal to the first column. As we worked out above, this requires us to subtract the projection of $\y$ onto ${\x}$ from the original ${\y}$ before we normalize.

With this perspective, we can rewrite our algorithm as

<p>$$\begin{align*}
&\rc{\Q} \leftarrow [\rc{\x} \; \rc{\y}] \\
&\textbf{loop:} \\
&\tab \Z \leftarrow \bc{\A}\rc{\Q} & \\
&\tab \rc{\Q}, \R \leftarrow \text{qr}(\Z) \\
\end{align*}$$</p>

<p>Let's see what happens to this second vector ${\y}$ under our iteration. As before, the key is to note that $\bc{\A}$ has eigenvectors $\rc{v}_1, \ldots, \rc{\v}_n$ which form a basis for $\mR^n$. That means that for our starting vector $\x_0$, there are scalars $c_1, \ldots, c_n$ so that
$$\x_0 = c_1\rc{\v}_1 + \ldots + \c_n\rc{\v}_n$$
and similarly, for our starting vector $\y_0$ there are scalars $d_1, \ldots, d_n$ so that:
$$\y_0 = d_1\rc{\v}_1 + \ldots + \d_n\rc{\v}_n$$.
</p>

Imagine that we set $\x = \rc{\v}_1$, and then run the algorithm. In that case the projection and rejection of $\y$ onto and from $\x$ will look very simple. We get

<p>$$\begin{align*}
\text{proj}_\x(\y) &= d_1 \rc{\v}_1 && + 0 && +\;\;\ldots && + 0\\
\text{rej}_\x(\y) &= 0 && + d_2\rc{\v_2} && + \;\;\ldots && + d_n\rc{\v_n} \p
\end{align*}$$</p>

This is simplest to see if you think of the eigenvectors as axes in which we express our vector. If we have a vector $(x, y, z)$ , then its projection onto the $x$-axis is simply $(x, 0, 0)$, and the corresponding rejection is $(0, y, z)$. The eigenvectors are a set of mutually orthogonal unit vectors, so we can think of them as just a different coordinate system. In this system, $\y$ has coordinates $(d_1, \ldots, d_n)$, so its projection onto the first eigenvector is $(d_1, 0, \ldots, 0)$ and the corresponding rejection is $(0, d_2, \ldots, d_n)$.

Once we've rejected $\rc{\v}_1$, we can see that multiplication by $\bc{\A}$ will never result in a vector with a non-zero component in the $\rc{\v}_1$ direction:

<p>$$\bc{A}(0\rc{\v}_1 + d_2\rc{\v}_2 + \ldots + d_n\rc{\v}_n) = \kc{0{\lambda_1}{\v}_1} + d_2\bc{\lambda}_2\rc{\v}_2 + \ldots + d_n\bc{\lambda}_n\rc{\v}_n)\p$$</p>

Thus, if we start with $\x_0 = \v_1$, and $\y_0$ orthogonal to it, we have shown that under the matrix multiplication, $\y$ stays orthogonal to $\x$ and we can ignore the rejection step. This means we can use the same derivation as before, except that $d_1 = 0$.

<p>$$
\begin{align*}
\bc{\A}^k\y_0 &= \bc{\A}^k(d_1\rc{v_1} + d_2\rc{\v}_2 + c_3\rc{\v}_3 + \ldots + c_n\rc{\v_n}) \\
&= \kc{0} + d_2\bc{\A}^k\rc{\v}_2 + d_2\bc{\A}^k\rc{\v}_2 + \ldots + d_n\bc{\A}^k\rc{\v_n} \\
&= d_2{\bc{\lambda}_2}^k\rc{\v}_2 + c_3{\bc{\lambda}_3}^k\rc{\v}_3 + \ldots + d_n{\bc{\lambda}_n}^k\rc{\v_n} \\
&=c_2{\bc{\lambda}_2}^k \left(\rc{\v}_2 +  \frac{c_3}{c_2}\frac{{\bc{\lambda}_3}^k}{{\bc{\lambda}_2}^k}\rc{\v}_3 + \ldots + \frac{c_n}{c_2}\frac{{\bc{\lambda}_n}^k}{{\bc{\lambda}_2}^k}\rc{\v_n} \right ) \\
\end{align*}.
$$</p>

Again, if the eigenvalues are all different, the factors ${\bc{\lambda}_i}^k/{\bc{\lambda}_2}^k$ for $i>2$ all go to zero and we are left with the convergence

$$
\y \to \d_2\lambda_2\rc{\v}_2 \p
$$

Essentially, we are performing the same algorithm as before, but by projecting away from $\rc{\v}_1$, we are ensuring that $\rc{\v}_1$ can't dominate. The next most dominant eigenvector, $\rc{\v}_2$ automatically pops out.

In practice, we don't need to set $\x = \rc{\v}_1$. The iteration on $\x$ is entirely the same as what we saw in the power iteration, so we know that $\x$ will converge to $\rc{\v}_1$. The closer it gets, the more the $\rc{v}_1$ component of $\y$ will die out, and the closer the algorithm will behave to what we've described above.

This isn't quite a proof, but it hopefully gives you a sense of how the algorithm behaves when it works as it should. A more rigorous proof will be easier to give when we've extended the algorithm a bit more.

### Adding even more eigenvectors

You can probably guess how to extend this idea to an arbitrary number of eigenvectors. For a third eigenvector, we add another vector $\z$. We multiply it by $\bc{A}$ as we did with $\x$ and $\y$, and then, we project it to be orthogonal to _both_ $\x$ and $\y$. It turns out this rejection can be computed simply by subtracting from $\z$ the projections onto $\x$ and onto $\y$:

$\z \leftarrow \z - \text{proj}_\x(\z) - \text{proj}_\y(\z) \p$

The rest of the algorithm remains as before: we normalize all vectors, and iterate the process.

What we are essentially doing here is computing something called _the Gram-Schmidt process_. We take a sequence of vectors, and project each vector to be orthogonal from all vectors before it. Extending the logic of the 2 vector case, we see that the Gram-Schmidt process essentially computes a QR decomposition:

The resulting $k$ mutually orthogonal vectors are the columns of $\rc{\Q}$, and the $k \times k$ matrix $\R$ is the matrix such that $\rc{\Q}\R$ results in our original matrix.

<aside>In practice, the Gram-Schmidt process isn't the most stable way to compute a QR decomposition. Most modern algorithms use a series of reflections or rotations in place of the projections that the GS process uses. We won't dig into that here, since in practice, you'll rarely need to implement a QR decomposition yourself.
</aside>

So, to compute the $k$ dominant eigenvectors, we can use the following algorithm:

<p>$$\begin{align*}
&\rc{\Q} \leftarrow [\rc{\x}_1 \;\ldots\; \rc{\x_k}] \\
&\textbf{loop:} \\
&\tab \Z \leftarrow \bc{\A}\rc{\Q} & \\
&\tab \rc{\Q}, \R \leftarrow \text{qr}(\Z) \\
\end{align*}$$</p>

If we use this algorithm to compute the principal components, $\bc{A}$ will be our sample covariance, so we know that we have $n$ real eigenvalues, and we can safely set $n = k$. In this setting, it becomes easy to see that when the algorithm converges, the columns of $\rc{\Q}$ converge to the eigenvalues.

To do so, we'll need to introduce a concept called **matrix similarity**. Let $\bc{\A}$ be any $n \times n$ matrix. $\bc{\A}$ represents a map on $\mR^n$. Now imagine that we have another basis on $\mR^n$, represented by the invertible matrix $\rc{\P}$: that is, we are representing the same space in a different coordinate system. In this coordinate system, our map can also be represented, but we would need a different matrix. Call this matrix $\bc{\B}$.

What is the relation between $\bc{\A}$ and $\bc{\B}$? We know that the map $\bc{\A}$ should be equivalent to mapping to the basis $\rc{P}$, applying the map $\bc{\B}$ and mapping back to the standard basis. Composing these operations gives us

$$\bc{A} = \rc{\P}\bc{\B}\rc{\P}^{-1}\p$$

-- TODO check in which direction P rebases

Any two square matrices $\bc{\A}$ and $\bc{\B}$ for which this relation holds, for some $\rc{\P}$ are said to be _similar_. That is, they represent the same map, just in two different bases.

Similar matrices are useful, because they often share many properties. Most relevant for our case, similar matrices have the same eigenvalues. This shouldn't be a big surprise: an eigenvalue is the extent to which an eigenvector is stretched by a map. If we change the basis, the eigenvector may change, but the amount by which it stretches stays the same.

This view of similarity also provides a new perspective on diagonalization. Remember, that the spectral threorem tells us that a symmetric matrix $\bc{\A}$ can be decomposed as

$$
\bc{\A} = \rc{\P}\bc{\D}\rc{\P}^T
$$

with $\bc{\D}$ diagonal, and $\rc{\P}$ orthonormal (implying $\rc{\P}^T = \rc{\P}^{-1}$). In terms of matrix similarity this simply states that every symmetric matrix is similar to some diagonal matrix. And since we can simply read the eigenvalues off the diagonal in a diagonal matrix, this is useful to know.

We can use the idea of matrix similarity to show that if we set $k=n$ and the orthogonal iteration algorithm converges, it converges to a point where the columns of $\rc{\Q}$ are the eigenvectors.

<aside>We've shown this already for each vector indidually, but it usually pays to show things in multiple ways. This deepens our understanding, and reduces the probability we are making mistakes or misunderstanding something.
</aside>

<p>First, number the sequence of $\rc{\Q}$-matrices produced byt he algorithm $\rc{\Q}_1$, $\rc{\Q}_2$, &hellip; At point $i$ in the iteration, we know that: $\bc{\A}\rc{\Q}_{i-1} = \rc{\Q}_i\R_i$, since that's the QR decomposition we performed at step $i$. Because each $\rc{\Q}$ is orthonormal, we can multiply both sides by its transpose, to get</p>

$$
\bc{\A} = \rc{\Q}_i\R_i\rc{\Q}_{i-1} \p
$$

Now, if we assume that the sequence of $\rc{\Q}_i$'s and $\R_i$'s converges to some $\rc{Q}$ and $\R$, in the limit, the left and right $\rc{\Q}$ will be the same, giving us

$$
\bc{\A} = \rc{\Q}\R\rc{\Q}\p
$$

This tells us that $\A$ is similar to some triangular matrix $\R$. Triangular matrices, like diagonal ones, have their eigenvalues along the diagonal, so we can read the eigenvalues of $\A$ off the diagonal of $\R$.

<p>To show that $\rc{\Q}$ contains the eigenvectors of $\bc{\A}$ we need another assumption: that $\bc{\A}$ is symmetric: $\bc{\A} = \bc{\A}^T$. If we know that, then we have $\R = \rc{\Q}^T\bc{\A}\rc{\Q}$ from rewriting the similarity relationship, and $\rc{\Q}^T\bc{\A}^T\rc{\Q} = \R^T$ from transposing both sides. Putting these together, we get:</p>

<p>$$
\R = \rc{\Q}^T\bc{\A}\rc{\Q} = \rc{\Q}^T\bc{\A}^T\rc{\Q} = \R^T\p
$$</p>

Which tells us that if $\bc{\A}$ is symmetric, $\R$ is symmetric too, so it must be diagonal.

<aside>More technically, we can say that the orthogonal iteration converges to the Schur decomposition we saw in <a href="/blog/pca3">part 3</a>. As we noted there, if the original matrix is symmetric, the Schur decomposition becomes a diagonalization.
</aside>

Why does this prove that $\rc{\Q}$ contains the eigenvalues? Rewrite the similarity to $\bc{\A}\rc{\Q}\R$. This shows that multiplying $\bc{\A}$ by the i-th column of $\rc{\Q}$, is equivalent to multiplying it by the $i$-th diagonal element of $\R$. This is the $i$-th eigenvalue, so the corresponding column of $\rc{\Q}$ must be the corresponding eigenvector.

-- image: AQ = QR

## QR iteration

QR iteration is another algorithm which looks very similar to orthogonal iteration, but works slightly differently. We'll look at the algorithm first and then dig into the similarities.

Here is the basic approach:

$$\begin{align*}
\rc{\Z} \leftarrow \bc{\A} \\
\textbf{loop:}\\
\tab\rc{\Q}, \R \leftarrow \text{qr}(\Z) \\
\tab\Z  \leftarrow \R\rc{\Q} \\
\end{align*}$$

Note the difference in how $\bc{\A}$ is used. In the orthogonal iteration, we used $\bc{\A}$ in every iteration to multiply by. Here, it is only used at the very start. We compute its QR decomposition, multiply $\rc{Q}$ and $\R$ in _reverse order_, and iterate.

The key idea of this algorithm is that each new matrix $\Z$ is similar to the previous one. We can easily show this if we number the sequence $\Z_0$, $\Z_1$, &hellip; and similarly for the $\rc{\Q}$'s and $\R$'s  We then have

<p>$$\Z_{i} = \R_i\rc{\Q}_i = \rc{\Q}_{i}^T\rc{\Q}_{i}\R_i\rc{\Q}_i = \rc{\Q}_{i}^T\rc{\Q}_{i}\R_i\rc{\Q}_i = \rc{\Q}_{i}^T\Z\rc{\Q}_i
$$</p>

Note the key principle: for every $\rc{\Q}$ and $\R$ in the sequence, $\rc{\Q}\R$ is the previous $\Z$ and $\R\rc{\Q}$ is the next $\Z$.

This tells us that the sequence of $\Z$'s we generate are all similar to one another, including to the first, which is equal to $\bc{A}$. If one of them happens to be triangular or diagonal, we can simply read off the eigenvalues.

As it happens, we can show that the sequences computed by the QR iteration and the orthogonal iteration are related in a very precise way.

First, let $\rc{Q}_1$, $\rc{Q}_2$, &hellip; and $\R_1$, $\R_2$, &hellip; be the sequences computed by the orthogonal algorithm. We know that under the right conditions, the algorithm converges to the diagonalization $\bc{\A} = \rc{\Q}^T\bc{\D}\rc{\Q}$, or equivalently $\bc{\D} = \rc{\Q}^T\bc{\A}\rc{\Q}$. Now, we compute a such a matrix $\bc{\D}_i$ at every step in the sequence:
$$\bc{\D}_i = {\rc{\Q}_i}^T\bc{\A}\rc{\Q}$$

Note that $\bc{\D}_i$ converges to a diagonal matrix (if $\bc{\A}$ is symmetric), but the intermediate values won't necessarily be diagonal.

Let's look at the sequence at time $i$. For the previous step, we know that

$$\begin{align*}
\bc{\D}_{i-1} &= {\rc{\Q}_{i-1}}^T\bc{\A}\rc{\Q}_{i-1}   &\text{by the definition of $\bc{\D}_{i-1}$} \\
&= \bc{\Q}_{i-1}\rc{\Q}_{i-1}\rc{\Q}_i\R_i& \text{since $\bc{\A}\rc{\Q}_{i-1}$ is QR'ed in step $i$.}
\end{align*}$$

Then, at step $i$, after the QR decomposition, we have $\rc{\Q}_i\R_i = \bc{\A}\rc{\Q}_{i-1}$, or equivalently, $\R_i = {\rc{\Q}_i}^T\bc{\A}\rc{\Q}_{i-1}$. We can use this to write:

$$\begin{align*}
\bc{\D}_{i} &= {\rc{\Q}_{i}}^T\bc{\A}\rc{\Q}_{i}   &} \\
&= {\rc{\Q}_{i}}^T\bc{\A}\rc{\Q}_{i} {\rc{\Q}_{i-1}}^T\rc{\Q}_{i-1} & \text{note that $\rc{\Q}_{i-1}$ is orthogonal.} \\
&= \R_i {\rc{\Q}_{i-1}}^T\rc{\Q}_{i-1} & \text{see above.} \\
\end{align*}$$

So, putting these together, we get

$$\begin{align*}
\bc{\D}_{i-1} &= \gc{\Q_{i-1}\Q_i}\R_i \\
\bc{\D}_{i} &= \R_i\gc{\Q_{i-1}\Q_i}\p
\end{align*}$$

Note that the factor in <span class="gc">green</span> is the product of two orthogonal matrices, so itself an orthogonal matrix. This means that the first line represents a QR decomposition, with $\rc{\Q} = \gc{\Q_{i-1}\Q_i}$. In short, if we are given $\bc{\D}_{i-1}$, we can compute $\bc{\D}_i$ simply by applying a QR decomposition, and multiplying $\rc{\Q}$ and $\R$ in reverse order. This is precisely what the QR algorithm does.

<aside>In practice the QR decomposition can be expensive to compute. There are modern versions of this algorithm that only perform the QR step implicitly, to speed up the computation.
</aside>

## Computing the SVD


### Power iteration for the SVD

-- Start with power iteration on $\X^T\X$ and expand into two step. Add the normalization to both steps.
-- Add orthogonal vectors. Show that this corresponds to QR and LQ Decomposition.
-- translate to QR/LQ algorithm.

## Conclusion
<!--
We've looked at some basic ways of computing eigenvectors and eigenvalues. If you would want to compute a simple PCA algorithm from scratch, this would be a good starting point. Compute the sample covariance matrix of your data, and apply one of these algorithms to find the eigenvectors. These will be your principal components.

The **power iteration** will give you the dominant eigenvector, which will coincide with the first principal component. If you want more principal components, you can extend the power method to the **orthogonal iteration**. All you need to do is add an orthogonalization step to keep your vectors orthogonal to one another. We've shown that this corresponds to a basic QR decomposition of your set of vectors.

Finally, if you want all $n$ principal components, you can simply extend the orthogonal iteration to $n$ vectors. We showed that the behavior of this algorithm coincides with another algorithm called the **QR iteration** which simply repeatedly computes the QR decomposition, and multiplies $\rc{\Q}$ and $\R$ back together in reverse order.

In practice, computing the diagonalization of your sample covariance directly is not the most popular way of computing principal components. We've gone through these algorithms here, because they provide a little more insight into what eigenvectors are. But if you actually want to compute a PCA, the better option is to use a singular value decomposition (SVD). This works directly on the data matrix $\X$, without requiring you to compute the sample covariance first. Moreover, it has some very nice properties that allow you great control over the inevitable noise your data will have.

The downside is that the SVD is sort of a whole topic in itself. We'll dig into this in the next and final part of this series. -->


<!-- {% endraw %} -->
