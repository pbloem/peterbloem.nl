---
title: Computing the eigendecomposition and the singular value decomposition
date: 30-12-2022
math: true
code: true
---
<!-- {% raw %} -->

<header>
<h1>Computing the eigendecomposition and the singular value decomposition</h1>
<div class="subh1">part 5 in a series on principal component analysis</div>
</header>

<ul class="links">
	<li>30 Dec 2022</li>
		<li><a href="https://github.com/mlvu/clearbox/tree/main/clearbox/linear">code</a></li>
		<li><a href="/blog/pca">part 1</a></li>
		<li><a href="/blog/pca-2">2</a></li>
		<li><a href="/blog/pca-3">3</a></li>		
		<li><a href="/blog/pca-4">4</a></li>
</ul>

We have looked at what PCA is, at how to understand it, and we have spent a full post on developing the tools necessary to prove the spectral theorem, the particular decomposition that makes it all possible.

What we haven't discussed yet, in any detail, is how to _build it_. And how to build it efficiently. We've looked at the singular value decomposition (SVD) in great detail, and with an algorithm for computing the SVD available, computing the PCA is trivial. But that's kicking the can down the road. How then, do we implement the SVD?

In practice, you'll rarely have to build much of PCA from scratch, and if you do, there are better resources than this one to tell you what to pay attention to. 

<aside>For instance, <em><a href="https://openlibrary.org/books/OL27306100M/Matrix_computations">Matrix Computations</a></em> by Golub and Van Loan.
</aside>

So why do we care about building a PCA implementation from scratch ourselves? Because building something is one of the best ways of understanding it. There are many things we don't yet understand, or understand well, about PCA, eigenvectors and singular vectors. By looking at some of the different ways you might implement PCA, we can learn a lot more about what it actually does.

So that will be our aim. We won't focus on the most popular algorithms, and we won't bother with all the tricks required to make the algorithms faster or more robust. We will simply set ourselves the challenge to implement PCA from scratch in a relatively efficient manner, but we will focus on those algorithms that illustrate most clearly what is happening when PCA is computed.

Remember that we've seen one algorithm already in [part 1](/blog/pca-1). There, we searched, using projected gradient descent, for the unit vector that gave us the best least-squares reconstruction of the data from a single number. This gave us the first principal component, and from that we could search for the second one, and so on.

<aside>We also briefly mentioned a version of this algorithm for the singular value decomposition in <a href="">part 4</a>.
</aside>

Our job in this part is to do a little better. We'll still require iterative algorithms with approximate solutions, but we'll try to get away from approximating the principal components one by one. Finally, we'll do our best to show that our algorithms are guaranteed to converge, and if possible, give an idea of how fast they converge.

# Computing eigenvectors

Our starting point will be the fact that we derived in [part 2](/blog/pca-2): the principal components are the eigenvalues of the sample covariance matrix $\bc{\S}$ of our data. All we need to do is to compute $\bc{\S}$, and then figure out what its eigenvectors are. Along the way, we'll try to develop a little more insight into what eigenvectors are, and what they tell us about a matrix.

We'll look at three algorithms for computing eigenvectors that each build on one another: **power iteration**, **orthogonal iteration** and **QR iteration**.

Then, we'll switch to the alternative perspective we developed in [part 4](/blog/part-4): that the principal components are the _singular vectors_ of the _data_ matrix $\X$, and we'll build on our algorithms for computing eigenvalues to develop three algorithms along the same lines for computing the SVD.

## Power iteration: computing one eigenvector

Before we get to the business of computing eigenvectors, allow me a little diversion. It will help us to build some more intuition for what eigenvectors are, and this intuition will become the foundation for all the algorithms that follow.

As ancient as it may make the rest of us feel, some people reading this will have become internet users only after Google was invented. If this is you, you will have no memory of how useless search engines were before Google came along. You won't have experienced the watershed that the introduction of Google was. You may not even believe that their almost-complete market dominance can be traced back to one simple idea.

The modern Google engine combines a vast array of methods and philosophies, but the original idea that set it so far apart from the competitors was singular, and simple.

Back then, the main problem facing search engines was the number of webpages trying to game the system. Authors would include fake keywords, large swathes of invisible text, everything they could think of to get as high in the results for as many different search terms as possible. This would inevitably lead to useless, nonsense-filled websites cluttering up search results.

What Google wanted to do was to develop a measurement of _reputation_: a single number that could capture to what extent a website was a respectable source of information playing by the rules, versus a cheap ad-laden swindle, trying to attract clicks. Their basic idea was a _social_ one: if somebody, somewhere on the web chooses to link to you, they must trust you, and this should serve as a signifier of your reputation. The more people link to you the better your reputation.

By itself, this notion of reputation is easy enough to game. Just set up a load of websites that all link to each other. But the idea can be applied _recursively_: the better the reputation of the sites that link to you, the more they add to your reputation. And _their_ reputation is in turn determined by the reputation of the sites that link to _them_ and so on.

Theoretically, we could keep going forever, always avoiding the question of how we define the reputation of a website, by simply deferring the question to the reputation of the websites that link to it. In practice, we'll need to stop somewhere, and define the base reputation, independent of who links to it. It turns out however, that if we defer the question for a large number of steps, it doesn't much matter what we do when the recursion stops. We can simply assign all websites we find at that point a reputation of 1, and the main thing that will determines the reputation of the site we started with will be the structure of the graph of links, not the constant reputation we assigned to the websites at which we stopped.

<figure class="narrow centering">
<img src="/images/pca-5/backward.svg" >
<figcaption>Computing the reputation for a site (the <span class="rc">red node</span> on the far left). We follow all incoming links to a certain depth. At that point we assign every node we find a reputation of 1. We can then use this to determine the reputation of the nodes to which they link. We do this by distributing the 1 unit of reputation equally over all outgoing links (including the ones, indicated by open discs, that don't unltimately lead to the site we want to compute the reputation for). This gives us the reputations of the green nodes, from which we can compute the reputations of the blue nodes, which finally gives us the reputation of the red node. 
</figcaption>
</figure>

This may seem like a slightly mind-bending idea at first, but that is mostly because we're working backwards. We can define the same idea forwards. Let's say that we start out by giving every website one unit of reputation for free. Then, at every step, every website takes all its current reputation, divides it up equally over all websites it links to and gives it all away. If the website receives no incoming links from others it is now out of reputation and stays at 0. If, however, it gets some incoming links as well as outgoing links, it also gets some new reputation. We then iterate this process: every step each website divvies up all reputation it has an gives it all away.

<figure class="narrow centering">
<img src="/images/pca-5/forward.svg" >
<figcaption>The forward computation of the reputation. We start with a reputation of 1 for every site, and have each site distribute all its reputation equally to all sites it links to. Note that after three steps, we have the same reputation for the <span class="rc">red site</span> (the leftmost node in each graph).
</figcaption>
</figure>

In this example, the reputations still fluctuate, and we get different values, depending on how long we continue the algorithm. However, as we will show later, for most graphs, this process eventually converges to a stable state. Each site ends up sending out as much reputation as it receives. This is the amount that we ultimately take as the reputation of the website.

Why is this hard to game? Imagine setting up a bunch of websites that all link to each other. Say you have the resources to host 10 sites. That means that at the start of the process, you get ten units of reputation. The best you can do to maintain this reputation is never to link out to legitimate websites, so no reputation flows out. But then, unless you get people to link to you, there's no reputation flowing in either.

<aside>The two open green nodes in the graph above are an example of this. They claim a bit of the reputation at the start, but they aren't linked to by the rest of the network, where there is much more reputation flowing around.
</aside>

Compare this to a site like Wikipedia, or BBC News. Each of their pages will be linked to by hundreds of sites, each of which will themselves have high reputation. You'd need to set up at least hundreds of thousands of websites to equal that amount of reputation.

What does any of this have to do with eigenvectors? The link becomes clear when we try to figure out what the stable state of this process is. Given a particular graph of websites and who links to whom, what's the ultimate amount of reputation each site ends up with?

First we need to translate the problem setting to linear algebra. Let's say we have a set of $n$ websites. We can represent the directed graph of which site links to which other site (the _web graph_) as a large $n \times n$ matrix $\bc{\A}$: the _adjacency matrix of the web graph_.

<figure class="narrow centering">
<img src="/images/pca-5/adjacency.svg" >
<figcaption>The adjacency matrix for our graph. Colored elements are valued 1, and white elements are valued 0. The colors only indicate the mapping to the graph, the matrix itself is just a square, binary matrix.
</figcaption>
</figure>

<aside>
We're simplifying the problem by ignoring the fact that there can be many links between two sites and that a website (i.e. a domain) can have many different pages. If you're building a search engine, you can use all this information to make your method more powerful and more complex, but we're only interested in the basic idea here.
</aside>

We can model the way website $i$ distributes its initial unit of reputation, by starting with a <em>one-hot vector</em> indicating that website. This is a vector of length $n$, for $n$ websites, with zeroes everywhere, except at the index $i$, corresponding to the website $i$, where it contains a $1$. This represents our starting point for website $i$, where it has one unit of reputation, and hasn't distributed anything yet.

If we multiply this vector by our adjacency matrix, we end up with a new vector that contains $1$'s for all the websites that $i$ linked to.

However, this doesn't keep the total amount of reputation fixed. To keep the sum total amount of reputation in the system constant, the website should break its one unit of reputation into $k$ equal parts, and give each to one of the $k$ sites it links to. As a simple solution, we _normalize_ the vector after the multiplication: we compute the sum of all the elements in the vector and then divide each by the sum.

<aside>We could also normalize the adjacency matrix $\bc{\A}$ over the rows, but separating the two steps will serve to illustrate an important point later.
</aside>

Now, we can just repeat the process. We multiply the vector by $\bc{\A}$, normalize it, multiply the result by $\bc{\A}$ again, and so on. Every time we iterate this algorithm, the reputation _diffuses_ across the graph a little more.

<figure class="narrow centering">
<img src="/images/pca-5/matrix-it.svg" >
<figcaption>Multiplying a one-hot vector by the adjacency matrix, and normalizing,   allows us to see how one node's unit of reputation diffuses across the network. After four iterations, most of its reputation has circled back, but some of it has spread to other nodes. Eventually this iteration will converge to a stable vector.
</figcaption>
</figure>

What ultimately happens to this sequence of vectors depends on the properties of the graph. However, for most graphs, especially the slightly messy ones like the web graph, the process will converge to a fixed state. For most almost all starting vectors, this multiplication will lead ultimately to a single vector, which when multiplied by the adjacency matrix, and normalized, **remains the same**. It doesn't matter what site we start at, we will always end up with the same distribution of reputation across the graph.

And that provides the link with eigenvectors. If we call the input input vector $\rc{\v}$ and the factor required to normalize the result of the matrix multiplication $\frac{1}{\bc{\lambda}}$, then we have reached a stable state when:

<p>$$\begin{align*}
\frac{1}{\bc{\lambda}}\bc{\A}\rc{\v} &= \rc{\v} \\
\bc{\A}\rc{\v} &= \bc{\lambda}\rc{\v} \p
\end{align*}$$</p>

This should look familiar. It's the definition of an _eigenvector_, which we first saw in [part 2](/blog/pca-2). If we reach a stable state, we have found a vector for which multiplying it by $\bc{\A}$ changes its length, but not its direction. In short, if we try this iterative approach, and it converges, _we have found an eigenvector of our matrix_. In fact, as we will see in a bit, we will have found the _principal_ eigenvector. The one with the largest eigenvalue.

<aside>For me, this is probably the key intuition for why eigenvectors are so important. If we iterate the operation of the matrix, the eigenvectors represent stable states (ignoring changes in magnitude). The key to eigenvectors is that when you want to characterize an operation, you start with its stable states.</aside>

In Google's use case, this tells us that after infinitely many redistributions of reputation, the distribution of reputation over the web stabilizes. This is the basic idea behind _pagerank_, Google's main algorithm (at least in the early days). The websites that ultimately end up with the most reputation, are likely to provide quality content and should end up higher in the ranking of the search results.

You may wonder why all the reputation doesn't flow into a single website. This <em>could</em> happen if a website is linked to, but doesn't link anywhere else. The real pagerank algorithm includes a few tricks to avoid such situations, but so long as a website has incoming and outgoing links, it will end up with some proportion of the reputation, but not all of it, the same way a bathtub with the tap running and the plug removed will never be fully empty.

We can extend this principle to a lot of other situations. In any process where some quantity&mdash;like reputation, money or people&mdash;is distributed between entities according to fixed proportions, the final, stable state of such a system is an _eigenvector_ of the matrix describing how the quantitiy is redistributed.

For instance, if you have a number of cities, and some statistics describing what proportion of people move from every city to every other city for each year, you can work out what populations the cities will stabilize to.

<aside><a href="https://setosa.io/ev/eigenvectors-and-eigenvalues/">This explainer of eigenvalues</a> by Victor Powell and Lewis Lehe provides a nice tool to visualize just this scenario.
</aside>

In these examples, the quantity being redistributed was reputation, or population. We can also take this quantity to be _probability_. Instead of counting the total number of people in each city, we can take the probability that a person moving around randomly ends up in a given city after some fixed, large number of steps $n$.

Or, in the Google example, imagine a user starting at a given website $i$, and clicking a random outgoing link. We don't observe which link they click, so the best we can say is that the user is on one of the sites being linked to by $i$, with each getting equal probability. That is, we get a uniform distribution over all websites linked to by $i$. This is exactly the vector that we get from one iteration of our algorithm: we multiply the one-hot vector for $i$ by $\bc{\A}$ and normalize.

If the user, wherever they've ended up, clicks another random link, our distribution representing their current position diffuses again. If we had a probability of $0.1$ for them being on website $j$, and $j$ links out to two other websites, each of these gets probability $0.05$. All we need to do is multiply the probability vector by $\bc{
\A}$ again, and normalize.

This kind of description of a linear redistribution of quantities is called a _Markov process_ or a _Markov chain_. It's a very useful branch of mathematics, but we'll not dig into it any deeper. It has provided us with two things. First, another perspective on eigenvectors as the stable states to which the process of repeated matrix multiplication converges. Second, _a way of computing at least one eigenvector_.


This bring us back to the business at hand. How do we compute eigenvectors?

<!--
As we saw in [part two](/blog/pca-2), the principal components of a mean-centered dataset are the eigenvectors of the covariance matrix. If we estimate this covariance matrix from the data, all we need to do is find its eigenvalues.

<aside>As shown in <a href="/blog/pca-2">part two</a>, the covariance matrix for mean-centered data $\X$ can be estimated with $\X^T\X$ divided by the number of instances $N$ (or $N-1$ for an unbiased estimate).</aside>
 -->

Let's follow the iteration approach and analyse it a bit more carefully. When we compute the eigenvectors of the covariance matrix $\bc{\S}$, we have two advantages over Google. First, the matrix we will deal with is probably much smaller than the adjacency matrix of the web graph. We'll assume that we can easily store it in memory and multiply vectors by it. Second, since it's a covariance matrix, _we know that it's symmetric_. This will make several aspects of our analysis a lot simpler.

The algorithm suggested by the story of Google can be summarized by the following iteration:

$$
\x \leftarrow \frac{\bc{\A}\x}{\|\bc{\A}\x\|_1} \p
$$

<p>That is, we multiply $\bc{\A}$ by $\x$ and then divide the entries of the resulting vector by its sum, which we've denoted here by the L1-norm $\|\cdot\|_1$.</p>

As it turns out, it doesn't matter much what norm we normalize by. We can just as easily use the Euclidean norm, and normalize the vector to be a unit vector after each step. If we do this, it stops being a probability vector, but the algorithm still yields an eigenvector. Since it makes the analysis a little simpler, we'll switch to that approach, and use the iteration

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

Or, more generally, the $k$-th vector in our iteration is just the vector $\bc{\A}^k\x_0$, normalized. We can normalize every iteration, every other iteration or every $k$ iterations. The end result will be the same. 

<aside>That is, unless the values get so big they can no longer be stored accurately in floating point representation. That's why in practice, it pays to normalize every iteration.
</aside>

Let's see what we can say about this vector $\bc{\A}^k\x_0$.

<p>First, we know from the spectral theorem that if $\bc{\A}$ is $n \times n$ and symmetric, it has $n$ real eigenvalues $\bc{\lambda}_i$&mdash;including multiplicities&mdash;and $n$ corresponding eigenvectors $\rc{\v}_i$. We'll assume that the eigenvalues are sorted by magnitude, so that $\bc{\lambda}_1$ is the biggest eigenvalue, and $\bc{\lambda}_2$ the second biggest, and so on.
</p>

<p>We also know, from previous parts, that the eigenvectors form a basis: any vector in $\mR^m$ can be written as a linear combination of the eigenvectors. That means that we can write $\x_0$ as $c_1\rc{\v}_1 + \;\ldots\; + c_n\rc{\v}_n$, for some values $c_1 \;\ldots\;  c_n$. If we choose $\x_0$ randomly, the probability that any of these are exactly $0$ will be vanishingly small.
</p>

<!--
<aside>In mathematical parlance, we say this is "almost certain", or that it has probability 1. In practice, this isn't quite true once we start implementing the algorithm on an actual computer, but the probability is small enough.
</aside>
 -->

<p>Now, let's see what we get if we start with $\x_0$ written like this, and compute $\x_k$. First, let's look at the unnormalized vector $\bc{\A}^k\x_0$</p>

<p>$$
\begin{align*}
\bc{\A}^k\x_0 &= \bc{\A}^k(c_1\rc{\v}_1 + c_2\rc{\v}_2 + \;\ldots\; + c_n\rc{\v}_n) \\
&=c_1\bc{\A}^k\rc{\v}_1 + c_2\bc{\A}^k\rc{\v}_2 + \;\ldots\; + c_n\bc{\A}^k\rc{\v}_n \\
&=c_1{\bc{\lambda}_1}^k\rc{\v}_1 +  c_2{\bc{\lambda}_2}^k\rc{\v}_2 + \;\ldots\; + c_n{\bc{\lambda}_n}^k\rc{\v_n} \\
&=c_1{\bc{\lambda}_1}^k \left(\rc{\v}_1 +  \frac{c_2}{c_1}\frac{{\bc{\lambda}_2}^k}{{\bc{\lambda}_1}^k}\rc{\v}_2 + \;\ldots\; + \frac{c_n}{c_1}\frac{{\bc{\lambda}_n}^k}{{\bc{\lambda}_1}^k}\rc{\v}_n \right ) \p \\
\end{align*}
$$</p>

<p>In the last line, we take the factor $c_1{\bc{\lambda}_1}^k$ out of the brackets. This leaves the term $\rc{\v}_1$ by itself, and divides the rest of the terms by this factor. Note the factors ${\bc{\lambda}_i}^k/{\bc{\lambda}_1}^k$ in all terms except the first. We know that $\bc{\lambda}_1$ is the eigenvalue with the greatest magnitude, so $\bc{\lambda}_i/\bc{\lambda}_1$ is always in the interval $[-1, 1]$. This means that its $k$-th power goes to zero with $k$. For large enough $k$, all that remains is</p>

<p>$$
\bc{\A}^k\x_0 \to c_1{\bc{\lambda}_1}^k \rc{\v}_1 \p
$$</p>

That is, we converge to the first eigenvector. We can now add the normalization back in, but that doesn't affect the direction of the vector we end up with, only its magnitude. 

<aside>This analysis also tells us the rate of convergence. Every iteration, the second biggest term in our sum decays with a factor of $|\bc{\lambda}_2/\bc{\lambda}_1|$. This tells us that we are converging geometrically, and that the speed of convergence is determined by the difference in magnitude between the biggest and the second biggest eigenvalue.
</aside>

This is the method of <strong>power iteration</strong>. A very simple way of computing eigenvectors and a very powerful one. All you need is a way to compute matrix/vector products and a way to normalize your vectors. Even on something as large as the web adjacency matrix, this is a feasible computation, (if you store the matrix in the right way).

## Orthogonal iteration: adding another eigenvector

So, that's a simple way to compute the dominant eigenvector. What do we do if we need more eigenvectors? The simplest trick is to use the fact that **eigenvectors are always orthogonal to one another**.

Let's try a simple approach: we perform the power iteration to make our vector $\x$ converge to the dominant eigenvector, but at the same time, we also perform the power iteration on a second vector $\y$ orthogonal to $\x$. After each iteration, $\x$ and $\y$ won't necessarily be orthogonal anymore, so we change $\y$ to be orthogonal to $\x$ after every iteration.

<p>How do we force one vector $\y$ to be orthogonal to another $\x$?  The simplest way to achieve this, is to first project $\y$ onto $\x$, call the result $\bc{\y_\x}$, and then to assume that $\y$ consists of two components: the part $\bc{\y_\x}$, that points in the same direction as ${\x}$ and the remainder $\rc{{\y}_r}$. This tells us that ${\y} = \bc{{\y}_x} + \rc{{\y}_r}$, and thus that $\rc{\y_r} = {\y} - \bc{{\y}_x}$.</p>

<figure class="narrow centering">
<img src="/images/pca-5/rejection.svg" class="half" >
</figure>

<p>The vector $\rc{\y_r}$, ${\y}$ minus <span class="bc">$\y$ projected onto ${\x}$</span> is called the <em>rejection</em> of ${\y}$ from ${\x}$. We'll use this to build our new power iteration. Here is the new algorithm:
</p>

<p>$$\begin{align*}
&\textbf{loop:} \\
&\tab {\x}, {\y} \leftarrow \bc{\A}{\x}, \bc{\A}{\y} & \\
&\tab {\y} \leftarrow {\y} - \bc{\y_\x} & \text{make ${\y}$ orthogonal to ${\x}$} \\
&\tab {\x}, {\y} \leftarrow {\x}/\|{\x}\|,\; {\y}/\|{\y}\| & \text{normalize both}
\end{align*}$$</p>

Note that the operations we apply to $\x$ are exactly the same as before. All we've done is to add another vector to the iteration. Our earlier proof that $\x$ converges to the dominant eigenvector $\rc{\v}_1$ still applies to this algorithm. The question is, what does $\y$ converge to?

Intuitively, it seems like a good bet that $\y$ will convergence to the second most dominant eigenvector. To help us analyze this question, and to build a foundation for later algorithms, we'll first take this algorithm and rewrite it in matrix operations.

The first line is easy: if we create a new $n \times 2$ matrix $[\;\x\;\y\;]$ with vectors $\x$ and $\y$ as columns, then the matrix multiplication $\bc{\A}[\;\x\;\y\;]$ gives us a new $n \times 2$ matrix whose columns are the new ${\x}$ and ${\y}$. 

The second and third line, rejection and normalization, we can actually represent in a single matrix operation called a _QR decomposition_. A QR decomposition takes a rectangular matrix $\Z$ and represents it as the product of a rectangular matrix $\rc{\Q}$ whose columns are all mutually orthogonal unit vectors, and a square matrix $\R$ which is upper triangular (all values below the diagonal are $0$).

To apply this to our algorithm, let $\Z \leftarrow \bc{\A}[\;\x\;\y\;]$, the $n \times 2$ matrix we create in the first line. If we apply a QR decomposition $\Z = \rc{\Q}\R$, then $\rc{\Q}$ must be an $n \times 2$ matrix with 2 orthogonal unit vectors for columns, and $\R$ must be a $2 \times 2$ matrix with the bottom-left element $0$.

If we draw a picture, it becomes clear that what lines 2 and 3 of our algorithm are doing is computing a QR decomposition of $\Z$.

<figure class="narrow centering">
<img src="/images/pca-5/two-column-qr.svg" class="half">
<figcaption>The QR decomposition of a matrix with two columns.
</figcaption>
</figure>

Because $\R$ is upper triangular, the first column of $\Z = \rc{\Q}\R$ is just the first column of $\rc{\Q}$ multiplied by some scalar. Because we require the first column of $\rc{\Q}$ to be a unit vector, this must be the scalar that normalizes the first column of $\Z$.

The second column of $\Z$ is a linear combination of the two columns of $\rc{\Q}$. Here the requirement we get from the definition of the QR decomposition is that the second column of $\rc{\Q}$ is also a unit vector, _and_ that it is orthogonal to the first column. As we worked out above, this requires us to subtract the projection of $\y$ onto ${\x}$ from the original ${\y}$ before we normalize.

With this perspective, we can rewrite our algorithm as

<p>$$\begin{align*}
&\rc{\Q} \leftarrow \left[\;\x \; \y\;\right] \\
&\textbf{loop:} \\
&\tab \Z \leftarrow \bc{\A}\rc{\Q} & \\
&\tab \rc{\Q}, \R \leftarrow \text{qr}(\Z) \\
\end{align*}$$</p>

<p>Let's see what happens to the second vector ${\y}$ under our iteration. As before, the key is to note that $\bc{\A}$ has eigenvectors $\rc{\v}_1, \ldots, \rc{\v}_n$ which form a basis for $\mR^n$. That means that for our starting vector $\x_0$, there are scalars $c_1, \ldots, c_n$ so that
$$\x_0 = c_1\rc{\v}_1 + \ldots + c_n\rc{\v}_n$$
and similarly, for our starting vector $\y_0$ there are scalars $d_1, \ldots, d_n$ so that:
$$\y_0 = d_1\rc{\v}_1 + \ldots + d_n\rc{\v}_n \p$$
</p>

<p>Imagine that we set $\x_0 = \rc{\v}_1$, and then run the algorithm. In that case the projection and rejection of $\y$ onto and from $\x$ will look very simple. We get</p>

<p>$$\begin{align*}
\bc{\y_\x} &= d_1 \rc{\v}_1 && + 0 && +\;\;\ldots && + 0\\
\rc{\y_r} &= 0 && + d_2\rc{\v}_2 && + \;\;\ldots && + d_n\rc{\v}_n \p
\end{align*}$$</p>

<aside>This is simplest to see if you think of the eigenvectors as axes in which we express our vector. If we have a vector $(x, y, z)$ , then its projection onto the $x$-axis is simply $(x, 0, 0)$, and the corresponding rejection is $(0, y, z)$. The eigenvectors are a set of mutually orthogonal unit vectors, so we can think of them as just a different coordinate system. In this system, $\y$ has coordinates $(d_1, \ldots, d_n)$, so its projection onto the first eigenvector $\rc{\v}_1$ is $(d_1, 0, \ldots, 0)$ and the corresponding rejection is $(0, d_2, \ldots, d_n)$.</aside>

<p>Once we've rejected $\rc{\v}_1$, we can see that multiplication by $\bc{\A}$ will never result in a vector with a non-zero component in the $\rc{\v}_1$ direction:</p>

<p>$$\bc{\A}\left(0\rc{\v}_1 + d_2\rc{\v}_2 + \ldots + d_n\rc{\v}_n\right) = \kc{0{\lambda_1}{\v}_1} + d_2\bc{\lambda}_2\rc{\v}_2 + \;\ldots\;+ d_n\bc{\lambda}_n\rc{\v}_n\p$$</p>

<p>Thus, if we start with $\x_0 = \rc{\v}_1$, and $\y_0$ orthogonal to it, we have shown that under the matrix multiplication, $\y$ <em>stays</em> orthogonal to $\x$ and we can ignore the rejection step. This means we can use the same derivation as before, except that $d_1 = 0$.</p>

<p>$$
\begin{align*}
\bc{\A}^k\y_0 &= \bc{\A}^k(d_1\rc{\v}_1 + d_2\rc{\v}_2 + c_3\rc{\v}_3 + \ldots + c_n\rc{\v_n}) \\
&= \kc{0} + d_2\bc{\A}^k\rc{\v}_2 + d_2\bc{\A}^k\rc{\v}_2 + \ldots + d_n\bc{\A}^k\rc{\v_n} \\
&= d_2{\bc{\lambda}_2}^k\rc{\v}_2 + d_3{\bc{\lambda}_3}^k\rc{\v}_3 + \ldots + d_n{\bc{\lambda}_n}^k\rc{\v_n} \\
&=d_2{\bc{\lambda}_2}^k \left(\rc{\v}_2 +  \frac{d_3}{d_2}\frac{{\bc{\lambda}_3}^k}{{\bc{\lambda}_2}^k}\rc{\v}_3 + \ldots + \frac{d_n}{d_2}\frac{{\bc{\lambda}_n}^k}{{\bc{\lambda}_2}^k}\rc{\v_n} \right ) \\
\end{align*}.
$$</p>

Again, if the eigenvalues are all different, the factors ${\bc{\lambda}_i}^k/{\bc{\lambda}_2}^k$ for $i>2$ all go to zero and we are left with the convergence

$$
\y \to d_2\bc{\lambda}_2\rc{\v}_2 \p
$$

Essentially, we are performing the same algorithm as before, but by projecting away from $\rc{\v}_1$, we are ensuring that $\rc{\v}_1$ can't dominate. The next most dominant eigenvector, $\rc{\v}_2$ automatically pops out.

<p>In practice, we don't need to set $\x = \rc{\v}_1$. The iteration on $\x$ is entirely the same as what we saw in the power iteration, so we know that $\x$ will converge to $\rc{\v}_1$. The closer it gets, the more the $\rc{\v}_1$ component of $\y$ will die out, and the closer the algorithm will behave to what we've described above.</p>

This isn't quite a proof, but it hopefully gives you a sense of how the algorithm behaves when it works as it should. A more rigorous proof will be easier to give when we've extended the algorithm a bit more.

## Adding even more eigenvectors

At this point, you can probably guess how to extend this idea to an arbitrary number of eigenvectors. For a third eigenvector, we add another vector $\z$. We multiply it by $\bc{\A}$ as we did with $\x$ and $\y$, and then, we project it to be orthogonal to _both_ $\x$ and $\y$. It turns out this rejection can be computed simply by subtracting from $\z$ the projections onto $\x$ and onto $\y$:

<p>$$\rc{\z_r} \leftarrow \z - \z_\x - \z_y \p$$</p>

The rest of the algorithm remains as before: we normalize all vectors, and iterate the process.

What we are essentially doing here is computing something called _the Gram-Schmidt process_. For a sequence of vectors, we project the second to be orthogonal to the first. Then we project the third to be orthogonal to both the first and the projected second, and so on until we are out of vectors, normalizing each vector after computing the projections. Extending the logic of the 2 vector case, we see that the Gram-Schmidt process essentially computes a QR decomposition:

<figure class="narrow centering">
<img src="/images/pca-5/three-column-qr.svg" class="three-quarters">
<figcaption>The QR decomposition of a matrix with three columns.
</figcaption>
</figure>

The resulting $k$ mutually orthogonal vectors are the columns of $\rc{\Q}$, and the $k \times k$ matrix $\R$ is the matrix such that $\rc{\Q}\R$ results in our original matrix.

In practice, the Gram-Schmidt process isn't the most stable way to compute a QR decomposition. Most modern algorithms use a series of reflections or rotations in place of the projections that the GS process uses.

What we can show, however, is that under the right circumstances, the QR decomposition is _unique_. The proof is a little technical, so we've moved it to the appendix. For now, all we need to know is that if the columns of $\Z$ are linearly independent, it has exactly one QR decomposition for which all the diagonal values of $\R$ are positive (which is what the Gram-Schmidt process provides). 

That means it doesn't matter how you compute it, you can analyse it as though you've computed it by the Gram-Schmidt process, which is what we'll do here.

So, to compute the first $k$ eigenvectors, we can use the following algorithm:

<p>$$\begin{align*}
&\rc{\Q} \leftarrow \left[\,\x_1 \;\ldots\; \x_k \,\right] \\
&\textbf{loop:} \\
&\tab \Z \leftarrow \bc{\A}\rc{\Q} & \\
&\tab \rc{\Q}, \R \leftarrow \text{qr}(\Z) \\
\end{align*}$$</p>

If we use this algorithm to compute the principal components, $\bc{\A}$ will be our sample covariance, so we know that we have $n$ real eigenvalues, and we can safely set $n = k$. In this setting, it becomes straightforward to show that when the algorithm converges, the columns of $\rc{\Q}$ converge to the eigenvalues.

<aside>The proof we used earlier would also work, but it pays to view things from different perspectives.
</aside>

To do so, we'll need to introduce a concept called **matrix similarity**. Let $\bc{\A}$ be any $n \times n$ matrix. $\bc{\A}$ represents a map on $\mR^n$. Now imagine that we have another basis on $\mR^n$, represented by the invertible matrix $\rc{\P}$: that is, we are representing the same space in a different coordinate system. In this coordinate system, our map can also be represented, but we would need a different matrix. Call this matrix $\bc{\B}$.

What is the relation between $\bc{\A}$ and $\bc{\B}$? We know that the map $\bc{\A}$ should be equivalent to mapping to the basis $\rc{\P}$, applying the map $\bc{\B}$ and mapping back to the standard basis. Composing these operations gives us

$$\bc{\A} = \rc{\P}\bc{\B}\rc{\P}^{-1}\p$$

Any two square matrices $\bc{\A}$ and $\bc{\B}$ for which this relation holds&mdash;for some $\rc{\P}$&mdash;are said to be _similar_. That is, they represent the same map, just in two different bases.

Similar matrices are a useful concept, because they often share many properties. Most relevant for our case, _similar matrices have the same eigenvalues_. This shouldn't be a big surprise: an eigenvalue is the extent to which an eigenvector is stretched by a map. If we change our coordinate system, the eigenvector may change, but the amount by which it stretches stays the same.

<aside>This does require that the origin is in the same place in both coordinate systems (as it is with a change of basis). For instance, losing 10 percent of your weight is the same in pounds or kilograms, but cooling down by 10 percent is a very different proposition in degrees Celsius than it is in kelvin.
</aside>

This view of similarity also provides a new perspective on diagonalization. Remember that the spectral theorem tells us that a symmetric matrix $\bc{\A}$ can be decomposed as

$$
\bc{\A} = \rc{\P}\bc{\D}\rc{\P}^T
$$

with $\bc{\D}$ diagonal, and $\rc{\P}$ orthogonal (implying $\rc{\P}^T = \rc{\P}^{-1}$). In terms of matrix similarity this simply states that every symmetric matrix is similar to some diagonal matrix. And since we can simply read the eigenvalues off the diagonal in a diagonal matrix, this is useful to know.

We can use the idea of matrix similarity to show that if we set $k=n$ and the orthogonal iteration algorithm converges, it converges to a point where the columns of $\rc{\Q}$ are the eigenvectors.

<!-- 
<aside>We've shown this already for each vector indidually, but it usually pays to show things in multiple ways. This deepens our understanding, and reduces the probability we are making mistakes or misunderstanding something.
</aside>
 -->

<p>First, number the sequence of $\rc{\Q}$-matrices produced by the algorithm $\rc{\Q}_1$, $\rc{\Q}_2$, &hellip; At point $i$ in the iteration, we know that: $\bc{\A}\rc{\Q}_{i-1} = \rc{\Q}_i\R_i$, since that's the QR decomposition we perform at step $i$. Because each $\rc{\Q}$ is orthogonal, we can multiply both sides by its transpose, to get</p>

$$
\bc{\A} = \rc{\Q}_i\R_i{\rc{\Q}_{i-1}}^T \p
$$

Now, if we assume that the sequence of $\rc{\Q}_i$'s and $\R_i$'s converges to some $\rc{\Q}$ and $\R$, in the limit the left and right $\rc{\Q}$ will be the same, giving us

$$
\bc{\A} = \rc{\Q}\R\rc{\Q}^T\p
$$

This tells us that $\bc{\A}$ is similar to some triangular matrix $\R$. Triangular matrices, like diagonal ones, have their eigenvalues along the diagonal, so we can read the eigenvalues of $\bc{\A}$ off the diagonal of $\R$.

<p>To show that $\rc{\Q}$ contains the eigen<em>vectors</em> of $\bc{\A}$ we need another assumption: that $\bc{\A}$ is symmetric: $\bc{\A} = \bc{\A}^T$. If we know that, then we have $\R = \rc{\Q}^T\bc{\A}\rc{\Q}$ from rewriting the similarity relationship, and $\rc{\Q}^T\bc{\A}^T\rc{\Q} = \R^T$ from transposing both sides. Putting these together, we get:</p>

<p>$$
\R = \rc{\Q}^T\bc{\A}\rc{\Q} = \rc{\Q}^T\bc{\A}^T\rc{\Q} = \R^T\p
$$</p>

Which tells us that if $\bc{\A}$ is symmetric, $\R$ is symmetric too, so it must be diagonal.

<!-- 
<aside>More technically, we can say that the orthogonal iteration converges to the Schur decomposition we saw in <a href="/blog/pca3">part 3</a>. As we noted there, if the original matrix is symmetric, the Schur decomposition becomes a diagonalization.
</aside>
 -->

Why does this prove that $\rc{\Q}$ contains the eigenvectors? Rewrite the similarity to $\bc{\A}\rc{\Q} = \rc{\Q}\R$. This shows that multiplying $\bc{\A}$ by the i-th column of $\rc{\Q}$, is equivalent to multiplying it by the $i$-th diagonal element of $\R$. This is the $i$-th eigenvalue, so the corresponding column of $\rc{\Q}$ must be the corresponding eigenvector.

<figure class="narrow centering">
<img src="/images/pca-5/aqqr.svg" class="three-quarters">
</figure>

## QR iteration

Our final eigenvector algorithm is _QR iteration_. It looks very similar to orthogonal iteration, but works slightly differently. We'll look at the algorithm first and then dig into how it works, and how it relates to the orthogonal iteration.

Here is the algorithm:

<p>$$\begin{align*}
&\Z \leftarrow \bc{\A} \\
&\textbf{loop:}\\
&\tab\rc{\Q}, \R \leftarrow \text{qr}(\Z) \\
&\tab\Z  \leftarrow \R\rc{\Q} \\
\end{align*}$$</p>

<p>Note the difference in how $\bc{\A}$ is used. In the orthogonal iteration, we used $\bc{\A}$ in every iteration to multiply by. Here, it is only used at the very start. We compute its QR decomposition, multiply $\rc{\Q}$ and $\R$ in <em>reverse order</em>, and iterate.</p>

<aside>This only works if both $\rc{\Q}$ and $\R$ are $n \times n$. With the orthogonal iteration, we could choose how many eigenvectors we wanted to compute. With the QR iteration, we are always computing the full set.
</aside>

<p>The key idea of this algorithm is that each new matrix $\Z$ is <em>similar</em> to the previous one. We can easily show this if we number the sequence $\Z_0$, $\Z_1$, &hellip; and similarly for the $\rc{\Q}$'s and $\R$'s. We then have</p>

<p>$$\begin{align*}
\Z_{i} &= \R_i\rc{\Q}_i &\text{line 4 in iteration $i$}\\
&= {\rc{\Q}_{i}}^T\rc{\Q}_{i}\R_i\rc{\Q}_i  &\text{because } {\rc{\Q}_i}^T\rc{\Q}_i = \I\\
&= {\rc{\Q}_{i}}^T\Z_{i-1}\rc{\Q}_i & \text{line 3 in iteration $i-1$}\p
\end{align*}$$</p>

Note the key principle: for every $\rc{\Q}$ and $\R$ in the sequence, $\rc{\Q}\R$ is the previous $\Z$ and $\R\rc{\Q}$ is the next $\Z$.

This tells us that the sequence of $\Z$'s we generate are all similar to one another, including to the first, which is equal to $\bc{\A}$. If one of them happens to be triangular or diagonal, we can simply read the eigenvalues of $\bc{\A}$ off the diagonal.

To show that we eventually get such a matrix, we can show that the sequences computed by the QR iteration and the orthogonal iteration are related in a very precise way.

<p>First, let $\rc{\Q}\sp_1$, $\rc{\Q}\sp_2$, &hellip; and $\R\sp_1$, $\R\sp_2$, &hellip; be the sequences computed by the <em>orthogonal</em> algorithm.</p>

<aside>Note the prime to indicate that these come from the orthogonal algorithm, not the QR algorithm.</aside>

We know that under the right conditions, the orthogonal algorithm converges to the diagonalization $\bc{\A} = \rc{\Q}\sp\bc{\D}{\rc{\Q}\sp}^T$, or equivalently $\bc{\D} = {\rc{\Q}\sp}^T\bc{\A}\rc{\Q}\sp$.

Now, for every step in the sequence of the orthogonal algorithm, we will define a new matrix called the matrix $\bc{\D}_i$. Its definition is $$\bc{\D}_i = {\rc{\Q}'_i}^T\bc{\A}\rc{\Q}'_i$$. 

<p>Note that this is a different sequence from the intermediate values $\R\sp_i$ computed by the orthogonal algorithm. There, we had $\bc{\A} = \rc{\Q}\sp_i\R\sp_i{\rc{\Q}\sp_{i-1}}^T$ or equivalently</p>

<p>$$
\R\sp_i = {\rc{\Q}\sp_i}^T\bc{\A}\rc{\Q}\sp_{i-1} \p
$$</p>

<p>$\R\sp_i$ are the values that the orthogonal algorithm computes. The sequence of $\bc{\D}_i$'s is simply a sequence of new matrices we now define. We know that the sequences converge to the same point, as the difference between $\rc{\Q}\sp_{i-1}$ and $\rc{\Q}\sp_i$ vanishes, but early on, $\R\sp_i$ may be very different from $\bc{\D}_i$.</p>

<aside>$\bc{\D}_i$ <em>converges</em> to a diagonal matrix (if $\bc{\A}$ is symmetric), but the intermediate values won't necessarily be diagonal.</aside>

Let's look at the sequence $\bc{\D}_i$ at time $i$. For the step prior to that, $i - 1$, we know that

$$\begin{align*}
\bc{\D}_{i-1} &= {\rc{\Q}\sp_{i-1}}^T\bc{\A}\rc{\Q}\sp_{i-1}   &\text{by the definition of $\bc{\D}_{i-1}$} \\
&= \rc{\Q}\sp_{i-1}\rc{\Q}\sp_i\R\sp_i& \text{since $\bc{\A}\rc{\Q}\sp_{i-1}$ is QR'ed in step $i$.}
\end{align*}$$

<p>Then, at step $i$, after the QR decomposition, $\R\sp_i = {\rc{\Q}\sp_i}^T\bc{\A}\rc{\Q}\sp_{i-1}$. We can use this to write:</p>

$$\begin{align*}
\bc{\D}_{i} &= {\rc{\Q}\sp_{i}}^T\bc{\A}\rc{\Q}\sp_{i}   & \\
&= {\rc{\Q}\sp_{i}}^T\bc{\A}{\rc{\Q}\sp_{i-1}}^T\rc{\Q}\sp_{i-1}\rc{\Q}_{i}  & \text{because ${\rc{\Q}\sp_{i-1}}^T{\rc{\Q}\sp_{i-1}} = \I$} \\
&= \R\sp_i {\rc{\Q}\sp_{i-1}}\rc{\Q}\sp_{i} & \text{see above} \\
\end{align*}$$

So, putting these together, we get

<p>$$\begin{align*}
\bc{\D}_{i-1} &= \gc{\Q\sp_{i-1}\Q\sp_i}\R_i \\
\bc{\D}_{i} &= \R_i\gc{\Q\sp_{i-1}\Q\sp_i}\p
\end{align*}$$</p>

Note that the factor in <span class="gc">green</span> is the product of two orthogonal matrices, so itself an orthogonal matrix. This means that the first line represents a QR decomposition, with $\rc{\Q} = \gc{\Q'_{i-1}\Q'_i}$.

In short, if we are given $\bc{\D}_{i-1}$, we can compute $\bc{\D}_i$ simply by applying a QR decomposition, and multiplying $\rc{\Q}$ and $\R$ in reverse order. This is precisely what the QR algorithm does.

<aside>In practice, the QR decomposition can be expensive to compute. There are modern versions of this algorithm that only perform the QR step implicitly, to speed up the computation.
</aside>

So, in the limit, we know that $\Z$ converges to a matrix, which has the eigenvalues along the diagonal, and 0 everywhere else. What about the eigenvectors? You'd be forgiven for guessing that once the algorithm has converged $\rc{\Q}$ contains these. That isn't the case, however. For one thing, at converge, $\Z$ is diagonal, so its QR decomposition is just the identity matrix times itself.

Note what we showed earlier: that the sequence of $\Z$'s computed by the algorithm are all similar to one another. Making this explicit, we get, at iteration $i$

<p>$$\begin{align*}
\bc{\D}_i = \Z_i &= {\rc{\Q}_i}^T\Z_{i-1}\rc{\Q}_i = {\rc{\Q}_i}^T{\rc{\Q}_{i-1}}^T\Z_{i-2}\rc{\Q}_{i-1}\rc{\Q}_{i} = \ldots \\
 &= {\rc{\Q}^\Pi_i}^T\bc{\A}\rc{\Q}^\Pi_i
\end{align*}$$</p>

where ${\rc{\Q}^\Pi_i}$ is the product of all $\rc{\Q}$ matrices computed so far. (Note that these are the $\rc{\Q}$s from the QR algorithm not from the orthogonal iteration).

If the algorithm has converged to our satisfaction, $\bc{\D}_i$ is diagonal and we get the required diagonalization

<p>$$
{\rc{\Q}^\Pi_i}\bc{\D}_i{\rc{\Q}^\Pi_i}T = \bc{\A} \p
$$</p>

The takeaway is that for this algorithm, if all you're interested in is the eigenvalues, you can run the stripped down version we presented above. If you also want the eigenvectors, you'll need to keep a running product of all the $\rc{\Q}$s you've encountered.

That concludes our three methods for computing eigenvectors of a symmetric matrix. The power iteration is a simple, and highly scalable method to find the dominant eigenvector. The orthogonal iteration is an extension we can use to add additional eigenvectors. Finally, the QR algorithm is a superficially different algorithm, that turns out to compute very a similar sequence of orthonormal bases to the orthogonal iteration.

# Computing the SVD

In the [previous blog post](/blog/pca-4) of this series, we did a deep dive into the singular value decomposition (SVD). The main takeaway was that this is a great way to compute the PCA, but more than that, a very versatile operation for dealing with matrices that represent any kind of data.

So, a fitting end to the series would be one or more algorithms for computing the singular value decomposition. Pleasingly, each of the three algorithms we saw above can be adapted to provide us with the singular vectors instead of the eigenvectors. Let's start with the simplest.

## Power iteration for the SVD

When we compute the eigenvectors to compute a PCA, we apply the eigenvector algorithm to the matrix $\bc{\S}$. Normally, we estimate $\bc{\S}$ by computing $\X^T\X$ and dividing by the number of instances in our dataset. This division affects the eigenvalues, but not the eigenvectors, so we'll ignore that for now. Instead, we'll ask what it means to compute the eigenvectors of the matrix $\X^T\X$.

As we saw in the previous part, the eigenvectors of $\X^T\X$ are the _singular_ vectors of $\X$. This immediately gives us an algorithm for computing singular vectors: take any rectangular matrix $\gc{\M}$, compute $\gc{\M}^T\gc{\M}$ and apply the eigenvector algorithms we developed above. 

We can fill in this $\gc{\M}^T\gc{\M}$ and see what it tells us about the algorithm. Let's start with the power iteration. When we apply this to $\gc{\M}^T\gc{\M}$, we get

<p>$$\begin{align*}
&\x \leftarrow \x_0 \\
&\textbf{loop}\hspace{-.2em}:\\
&\tab\x \leftarrow \gc{\M}^T\gc{\M}\x \\
&\tab\x \leftarrow \x / \|\x\| \p
\end{align*}$$</p>

If we now separate the two matrix multiplications, by $\gc{\M}$ and then by $\gc{\M}^T$ in two steps, we get 

<p>$$\begin{align*}
&\x \leftarrow \x_0 \\
&\textbf{loop}\hspace{-.2em}:\\
&\tab\y \leftarrow \gc{\M}\x \\
&\tab\x \leftarrow \gc{\M}^T\y \\
&\tab\x \leftarrow \x / \|\x\| \p
\end{align*}$$</p>

This is the same algorithm as before, just with the matrix multiplication separated in two steps. Next, we will add another normalization step. This changes the algorithm, but we will show that the effect is negligable.

<p>$$\begin{align*}
&\x \leftarrow \x_0 \\
&\textbf{loop}\hspace{-.2em}:\\
&\tab\y \leftarrow \gc{\M}\x \\
&\tab\y \leftarrow \y / \|\y\| \\
&\tab\x \leftarrow \gc{\M}^T\y \\
&\tab\x \leftarrow \x / \|\x\| \p
\end{align*}$$</p>

This is our power iteration algorithm for the singular vectors of $\gc{\M}$. Compare it to the power iteration for the eigenvectors. There, $\bc{\A}$ was a _map_ (a square matrix): the input and output space of its transformation were the same. We simply apply the transformation, normalize and repeat. With $\gc{\M}$, the input and output are different: as a result, we map a vector $\x$ in the input space to a vector $\y$ in the output space, normalize, and then map back again by $\gc{\M}^T$.

The only real change we've made from the power iteration on $\gc{\M}^T\gc{\M}$ is the extra normalization on $\y$. As we did before, we can look at the result $\x_2$ after two normalizations, and separate the normalizations and matrix multiplications.

<p>$$\begin{align*}
\x_1 &= \frac{\gc{\M}^T\y}{\|\gc{\M}^T\y\|} = \frac{\gc{\M}^T\frac{\gc{\M}\x_0}{\|\gc{\M}\x_0\|}}{\|\gc{\M}^T\frac{\gc{\M}\x_0}{\|\gc{\M}\x_0\|}\|} \\
& = \frac{\gc{\M}^T\gc{\M}\x_0}{\|\gc{\M}^T\gc{\M}\x_0\|} \frac{\frac{1}{\|\gc{\M}\x_0\|}}{\frac{1}{\|\gc{\M}\x_0\|}} = \frac{\gc{\M}^T\gc{\M}\x_0}{\|\gc{\M}^T\gc{\M}\x_0\|} \\
\end{align*}$$</p>

Put simply, the extra normalization step doesn't change what the algorithm does: we are still computing the normalized result of $\gc{\M}^T\gc{\M}\x$. All our previous proofs about the algorithm still hold. We are computing the first eigenvector of $\gc{\M}^T\gc{\M}$, and therefore the first (right) singular vector of $\gc{\M}$.

<p>Where exactly are the singular vectors and values in this algorithm? Recall the definition: if $\rc{\v}$ is a right singular vector of $\gc{\M}$ and $\rc{\u}$ its corresponding left singular vector, with $\gc{\sigma}$ the corresponding singular value, then</p>

$$\gc{\M}\rc{\v} = \gc{\sigma}\rc{\u} \p
$$

<p>So, if $\x$ has converged to a right singular vector of $\gc{\M}$, then $\gc{\M}\x$, after normalization, is the corresponding left singular vector. This shows that the algorithm actually gives us both singular vectors. The corresponding singular <em>value</em> is $\|\gc{\M}\x\|$.</p>

### Orthogonal iteration for the SVD

The extension to orthogonal iteration follows very straighforwardly. As before, our intuition is that we simply take a second vector $\x'$ along for the iteration, and that for the second vector&mdash;in addition to normalizing it every iteration&mdash;we make it orthogonal to $\x$.

<aside>We're slightly shuffling our variables here. $\x'$ is the vector we previously called $\y$ when we extended the power iteration to multiple eigenvectors. $\y$ is now the intermediate variable we've introduced that results from multiplication by $\gc{\M}$.
</aside>

To follow the spirit of the power iteration algorithm for the SVD, we do this twice: we multiply $\x$ and $\x'$ by $\gc{\M}$, resulting in $\y$ and $\y'$. We project $\y'$ away from $\y$, so that they are orthogonal to each other, and normalize both. Then, we multiply both by $\gc{\M}^T$, and again project and normalize.

The main conclusion we came to before was that we were in effect computing a QR decomposition  of the matrix $\bc{\A} \left \[\;\x \;\x'\;\right \]$. 

<!-- 
We can show that what we are doing here is computing first a QR decomposition, and then an _LQ_ decomposition. The LQ decomposition is defined in the same way as the QR decomposition, except that $L$ is a _lower_ triangular matrix. 
 -->

For $\gc{\M}\left[\;\x\;\x'\;\right]$, our logic holds the same as before: we get two orthogonal unit vectors, which can serve as the columns of $\rc{\Q}$. To transform these by a matrix $\R \in\mR^{2\times 2}$ so that  $\gc{\M}\left[\,\x\;\x'\,\right] = \rc{\Q}\R$, the first column of $\R$ only needs to stretch $\x$ uniformly (it only needs a value on the diagonal). The second should express $\gc{\M}\x'$ as two components. One component in the direction of $\gc{\M}\x$, which gives us a scalar on the first row, and one component orthogonal to $\gc{\M}\x$ which gives us a scalar on the second row. Therefore, $\R$ is upper triangular.

When we apply the second step of the iteration, we start with two orthogonal unit vectors $\y, \y'$ and we compute $\gc{\M}^T\left [\,\y \; \y' \,\right]$, project and normalize. By the same logic as before, we can interpret this as another QR decomposition. For this one, we'll call the orthogonal matrix $\rc{\P}$ and the upper triangular one $\B$

<!-- 
<p>$$
\rc{\P}, \L = \text{qr}\left (\gc{\M}^T \left[\y \; \y' \right] \right)
$$</p>
 -->

$$
\gc{\M}^T \left[\,\y \; \y'\, \right] = \rc{\P}\B
$$

<!-- 
 After this step, the resulting vectors $\x$ and $\x'$ are orthogonal unit vectors, so we can make them the _rows_ of a $2 \times n$ matrix $\rc{\Q}$. If we then add a $2 \times 2$ matrix $\L$, requiring that $\gc{\M}^T\left [\y \; \y'\right ]= \L\rc{\Q}$, we find that the first requires only a scalar on the diagonal, and the second requires two components, one at $\rc{Q}_{21}$ in the direction of $\gc{\M}\y$ and one on the diagonal.
 -->
 
<figure class="narrow centering">
<img src="/images/pca-5/orthogonal-svd.svg" class="full">
<figcaption>The two-column orthogonal algrithm for the SVD in four steps.
</figcaption>
</figure>

We can now, as before, add a third vector $\x''$, a fourth, a fifth, and so on. If we make each orthogonal to all prior vectors, we end up with a matrix $\rc{\Q}$ with orthogonal columns (or rows). The triangular structure of the matrix $\R$ (which reverses the orthogonalization and normalization) is explained by the fact that the $i$-th vector has $i$ components: $i-1$ to describe the projections onto the previous vectors, and one to scale the remainder to a unit vector. 

Putting all of this together, we get the following algorithm to compute the first $k$ singular vectors:

<p>$$\begin{align*}
&\rc{\P} =\left [\,\x^1_0\;\ldots\;\x_0^k\,\right] \\
&\textbf{loop}\hspace{-.2em}: \\
&\tab \Y \leftarrow \gc{\M}\rc{\P} \\
&\tab \rc{\Q}, \R \leftarrow \text{qr}(\Y) \\
&\tab \X \leftarrow \gc{\M}^T\rc{\Q} \\
&\tab \rc{\P}, \B \leftarrow \text{qr}(\X) \\
\end{align*}$$</p>

<aside>We can also think of the second QR decomposition as an LQ decomposition of $\rc{\Q}^T\gc{\M}$. This follows directly from transposing both sides (The LQ decomposition gives us a lower triangular matrix and and orthogonal one). Seeing it as a QR decomposition makes more sense in the way we've explained it, but if you see this algorithm explained elsewhere, it may be with alternating LQ and QR decompositions.</aside>

We know that for the first vector of $\rc{\P}$, this algorithm behaves the same as the orthogonal algorithm for eigenvectors. It will converge to the first eigenvector of $\gc{\M}^T\gc{\M}$, and therefore to the first right singular vector of $\gc{\M}$.

What we haven't shown yet, is that this also holds true for the other vectors on $\rc{\P}$, or for that matter, where we can find the singular values, and the left singular vectors.

In our analysis of the orthogonal algorithm for the eigenvectors, we used a simple trick: _express the vectors we're iterating within the eigenbasis of the matrix_. This allowed us to see very neatly what happens as the iteration of the algorithm converges.

<p>In the case of the SVD, we get <em>two</em> bases for an $n \times m$ matrix $\gc{\M}$. One $m \times m$ matrix $\rc{\V}$ with columns $\rc{\v}_1, \ldots, \rc{\v}_m$ that spans the input space of $\gc{\M}$ and one $n \times n$ matrix $\rc{\U}$ with columns $\rc{\u}_1, \ldots, \rc{\u}_n$ which spans the output space of $\gc{\M}$ We'll call these the right and left <em>singular bases</em> of $\gc{\M}$ respectively.
</p>

<p>By definition, for each of these there is a singular value $\gc{\sigma}_i$ so that $\gc{\M}\rc{\v}_i = \rc{\u}_i\gc{\sigma}_i$. </p>

<p>The key insight here, is that when we have the singular bases, we can express the operation of $\gc{\M}$ <em>as a mapping between them</em>. Each right singular basis vector is mapped onto the corresponding left singular basis vector, independent of the others.</p>

<p>To put this more precisely: if we express the input vector $\x$ in the right singular basis $\rc{\V}$, we get some an expression like </p>

<p>$$\x = c_1\rc{\v_1} + \;\ldots\; + c_m\rc{\v_k}\p$$</p>

<p>For every right singular vector $i$, we get come component $c_i$ expressing how much of $\x$ projects onto $\rc{\v}_i$. If we then multiply $\y = \gc{\M}\x$, we can express $\y$ in the left singular basis as:</p>

<p>$$\y = d_1\rc{\u_1} + \;\ldots\; + d_n\rc{\u_k} \p$$</p> 

<p>The key property of these two bases is that the vector $c_i\rc{\v}_i$ is mapped to the vector $d_i\rc{\u}_i$, <em>independently of the other components</em>. We don't need to know the other values $c_j$, the $i$-th component $d_i$ is completely determined only by $c_i$.</p>

<p>You may note that these sums don't have the same number of terms. What happens, for instance, if $n > m$? In that case the components $d_i$ for $i > m$ will be zero. Effectively, both expressions will have only $m$ terms.</p>

<aside>If $m > n$, it's possible that the first vector into the algorithm requires all $n$ terms, but after one iteration, both $\x$ and $\y$ can be represented as a linear combination of the first $\text{rank }(\gc{\M})$ right and left singular vectors respectively.
</aside>

<!-- 
<aside>We've assumed here that $n>m$, so that for a full SVD, $\rc{\V} \in \mR^{n \times n}$ has some basis vectors that always have zero components (like $\kc{\v_n}$ above). If $\gc{\M}$ is wider than it is tall, this happens in $\rc{\U}$ instead.
</aside>
 -->

<p>For what's coming up, we will need to reverse this picture as well. Note first that $\gc{\M}^T = \rc{\V}\gc{\Sig}\rc{\U}^T$ (by simply transposing both sides of the SVD decomposition). This is <em>also</em> an SVD, but of $\gc{\M}^T$ and with right singular vectors $\rc{\U}^T$ and left singular vectors $\rc{\V}^T$. By definition of the SVD, we see that this implies that $\gc{\M}^T\rc{\u}_i = \rc{\v}_i\gc{\sigma}_i$. That is, when we transform back from $\y$ to $\x$, the singular vectors are also mapped onto one another.
</p>

<p>Now, let's look at the algorithm. At any point in the iteration, we can express the first vector of $\rc{\P}$ in the right singular basis of $\gc{\M}$. For some values $c_1, \ldots, c_m$, we have, for $k=\text{rank}(\gc{\M})$:
$$
\rc{\bp}_1 = c_1\rc{\v}_1 + \;\ldots\; + c_m\rc{\v}_k \p 
$$</p>

<p>We know that $\rc{\bp}_1$ converges to $\rc{\v}_1$. That means we will get arbitrarily close to the situation where 
$$
\rc{\bp}_1 = \rc{\v}_1 \kc{ \;+\;0\v_2 + \;\ldots\; + 0\v_k} \p 
$$
At that point, when we compute $\Y = \gc{\M}\rc{\P}$, in the first line of our iteration, we will get, for the first column $\y_1$ of $\Y$
$$
\y_1 = \gc{\M}\rc{\v}_1 = \rc{\u}_1\gc{\sigma}_1 \p
$$
In other words, since the input vector is one of the right singular vectors, the output vector is the corresponding left singular vector times the corresponding singular value.
</p>

<p>Since this is the first column, the QR decomposition that we then apply in the second line, only serves to normalize $\rc{\u}_1\gc{\sigma}_1$. Since $\rc{\u}_1$ is a unit vector by definition, the first column of $\rc{\Q}$ becomes $\rc{\u}_1$, and the element $R_{11}$ (by which we multiply it to recover $\y_1$) becomes $\gc{\sigma}_1$.</p>

<p>Next comes the multiplication $\X = \gc{\M}^T\rc{\Q}$. Focusing only on the first column for now, this is $\x_1 = \gc{\M}^T\rc{\u}_1$. From the SVD of the transpose above we see that $\gc{\M}^T\rc{\u}_1 = \rc{\v}_1\gc{\sigma}_1$. As before, $\rc{\u}_1$ is a right singular vector of $\gc{\M}^T$, so the result is the corresponding left singular vector $\rc{\v}_1$, times a scalar, which is removed in the QR decomposition that follows.</p>

<p>This tells us what we already knew: that $\rc{\v}_1$ as the first column of $\rc{\P}$ provides a fixed point for our algorithm. Whatever the other columns, this column stays the same under the iteration. We can now look at what happens to the second column of $\rc{\P}$ when the first converges to $\rc{\v}_1$. First, we express it in the right singular basis of $\gc{\M}$:</p>

<p>$$
\rc{\bp}_2 = c_1\rc{\v}_1 + c_2\rc{\v}_2 + \;\ldots\; + c_m\rc{\v}_k \p
$$</p>

In the first line of the iteration, we multiply $\gc{\M}$ by $\rc{\P}$. This gives us:

$$\begin{align*}
\y_2 = \gc{\M}\rc{\bp}_2 &= c_1\gc{\M}\rc{\v}_1 + c_2\gc{\M}\rc{\v}_2 + \ldots + c_k\gc{\M}\rc{\v}_k \\
&= c_1\gc{\sigma}_1\rc{\u}_1 + c_2\gc{\sigma}_2\rc{\u}_2 + \ldots + c_k\gc{\sigma}_k\rc{\u}_k \p
\end{align*}$$

Next, the QR decomposition projects this vector away from the first vector (which we assume is $\rc{\v}_1$). This means that the remainder is 

<p>$$
0 + c_2\gc{\sigma}_2\rc{\u}_2 + \ldots + c_m\gc{\sigma}_n\rc{\u}_n
$$</p>

which we then normalize to get 

<p>$$
\rc{\q}_2R_{22} = 0 + c_2\gc{\sigma}_2\rc{\u}_2 + \ldots + c_m\gc{\sigma}_n\rc{\u}_n \p
$$</p>

<p>The value $R_{22}$ is a normalization factor. The value $R_{12}$ tells us how much of the vector $\x_2$ lies in the direction of $\rc{\v}_1$. That is, $R_{12} = d_1$.</p>

<aside>If the algorithm were to converge to the point where all the second vectors are orthogonal to $\rc{\v}_1$, then $R_{12}$ would be $0$. This suggests that the matrix $\R$ slowly becomes diagonal as we converge to the singular vectors.</aside>

<p>Taking $R_{22}$ to the other side, and collecting all scalar multipliers into new multipliers $e_i$, we get</p>

$$\rc{\q}_2 = 0 + e_2\rc{\u}_2 + \ldots + e_k\rc{\u}_k \p$$

In the third line of the algorithm, this vector is multiplied by $\gc{\M}^T$. This gives us

<p>$$\begin{align}
\gc{\M}^T\rc{\q}_2 &= 0 + e_2\gc{\M}^T\rc{\u}_2 + \ldots + e_k\gc{\M}^T\rc{\u}_k \\
&= 0 + e_2\gc{\sigma}_2\rc{\v}_2 + \ldots + e_k\gc{\sigma}_k\rc{\u}_k \p
\end{align}$$</p>

<p>Note that the first term remains zero, wether we are in the left or right singular basis of $\gc{\M}$. This tells us that when the first vector of $\rc{\P}$ has converged to $\rc{\v}_1$, the rest of the vectors become entirely confined to the subspace orthogonal to $\rc{\v}_1$. In the left singular basis, we get $\rc{\q}_1 = \rc{\u}_1$ with the remaining columns of $\rc{\Q}$ entirely confined to the subspace orthogonal to $\rc{\u}_1$.</p>

<p>We can now build an inductive argument to see what happens to the other vectors if we assume that $\rc{\bp}_1 = \rc{\v}_1$. Let $\rc{\P}' = \left [ \,\rc{\bp}_2 \;\ldots\; \rc{\bp}_m\,\right ]$. Assume furthermore that all vectors in $\rc{\P}'$ are orthogonal to $\rc{\v}_1$ (we have shown above that this is the case after one iteration of the algorithm with $\rc{\bp}_1 = \rc{\v}_1$).
</p> 

We will go through the algorithm line by line and show that the resulting matrices $\rc{\Q}'$, $\R'$ and $\rc{\B}'$ are submatrices of the matrices $\rc{\Q}$, $\R$ and $\B$ computed by the iteration on the complete $\rc{\P}$. From this, we can then conclude that whatever we know about the algorithm applied to $\rc{\P}$, applies to $\rc{\P}'$ as well.

<p>In the first line of the algorithm, we multiply $\Y' \leftarrow \gc{\M}\rc{\P}'$. From the basic definition of matrix multiplication, we can conclude that $\Y'$ consists of the rightmost vectors of $\Y$, without the first one. We can also conclude that all columns of $\Y'$ are orthogonal to $\rc{\u}_1$.</p>

<aside>Each column of $\rc{\P}'$ is orthogonal to $\rc{\v}_1$, so when we express such a column as a sum of the right eigenvectors, the first term is 0, which means that when we multiply by $\gc{\M}$, the multiplier for the first left eigenvector $\rc{\u}_i$ is zero as well.
</aside>

<p>Second, we perform the QR decomposition $\rc{\Q}', \R' \leftarrow \text{qr}(\X')$. We know that $\text{span } \X'$ is a subspace orthogonal to $\rc{\u}_1$, so $\rc{\Q}'$ will be an orthogonal basis for that subspace. That is $\rc{\Q} = \left [\,\rc{\v}_1\;\rc{\q}'_1\; \ldots\;\rc{\q}'_m\,\right]$. 
</p>

<p>How are $\R$ and $\R'$ related? $R_{11}$ is a scaling factor for $\rc{\v}_1$, and the remaining $R_{1i}$ show how much of each of the other vectors of $\X$ projects onto $\rc{\v}_1$. Under our assumptions, these are all orthogonal to $\rc{\v}_1$, so the top row of $R$ is zero everywhere except the diagonal. This suggests that if we strip the top row and leftmost column from $\R$, we get $\R'$</p>

<figure class="narrow centering">
<img src="/images/pca-5/subqr.svg" class="half">
<figcaption>The QR decomposition of the whole matrix $\Y$ contains the QR decomposition of the submatrix $\Y'$ (if its first column is a scalar multiple of $\rc{\u}_1$).
</figcaption>
</figure>

<p>In the third line of the algorithm, we compute $\Y' \leftarrow \gc{\M}^T\rc{\Q}'$. Since $\rc{\Q}'$ spans a subspace orthogonal to $\rc{\u}_1$, by the same logic we used for line 1, $\Y'$ spans a subspace orthogonal to $\rc{\v}_1$. 
</p>

<p>Finally, we repeat the logic of line 2 to conclude that after the fourth line $\rc{\P} = \left [\,\rc{\v}_1\;\rc{\bp}'_1 \;\ldots\; \rc{\bp}'_m\,\right]$. And that $\B'$ is the bottom right submatrix of $\B$.
</p>

<p>To summarize, for a matrix $\rc{\P}'$ with columns orthogonal to $\rc{\v}_1$ and a matrix $\rc{\P} = \left[\,\rc{\v}_1\;\rc{\bp}'_1 \;\ldots\; \rc{\bp}'_m\,\right]$, we have just shown that an iteration on $\rc{\P}'$ produces matrices $\rc{\Q}'$, $\R'$, $\rc{\P'}$ and $\B'$, which are submatrices of the corresponding matrices we would get if we ran the iteration on $\rc{\P}$.
</p>

<p>This tells us directly that if $\rc{\bp}_2 = \rc{\v}_2$ before the iteration, by the argument we have already made above, this is a fixed point, and it will remain so after the iteration.</p>

<p>However, what if it isn't? It seems likely that the iteration with an arbitrary starting value for $\rc{\bp}_2$ will converge to $\rc{\v}_2$ eventually. What we've shown above is, assuming $\rc{\v}_1 = \rc{\bp}_1$, that after the first iteration, where $\rc{\bp}_2$ is projected away from $\rc{\v}_1$, it will remain orthogonal to $\rc{\v}_1$ forever.</p>

<p>Since $\rc{\bp}_2$ is guaranteed to be orthogonal to $\rc{\bp}_1$ already, all that happens in the QR decomposition is that it is scaled to a unit vector. We can see this in the matrix $\R$, where $R_{12}$ is zero, and $R_{22}$ (or $R'_{11}$) gives us the required scaling factor.
</p>

<p>Under these assumptions, for $\rc{\bp}_2$ one iteration of the algorithm performs in order, a matrix multipliation, a scaling, a matrix multiplication and another scaling. Or, symbolically:</p>

<p>$$
\rc{\bp}_2 \leftarrow L_{22}\gc{\M}^TR_{22}\gc{\M}\rc{\bp}_2 = L_{22}R_{22}\gc{\M}^T\gc{\M}\rc{\bp}_2  \p
$$</p>

After $k$ iterations, we get 

<p>$$
\rc{\bp}^k_2 = L_{22}\gc{\M}^TR_{22}\gc{\M}\rc{\bp}_2 = (L_{22}R_{22})^k(\gc{\M}^T\gc{\M})^k\rc{\bp}^0_2  \p
$$</p>

This should look familiar. It shows that all we are doing is iteratively multiplying by $\gc{\M}^T\gc{\M}$, and occasionally normalizing. Normally, such an iteration would converge to the _first_ eigenvector of $\gc{\M}^T\gc{\M}$, and the first right singular vector of $\gc{\M}$. However, by careful choice of the initial vector, we are constrained to be (and stay) orthogonal to that first eigenvector. As we've already seen in the orthogonal iteration for eigenvectors, this means that we will converge to the second eigenvector. 

Finally, we can repeat the same argument for the other vectors. If we set the first <em>two</em> columns of $\rc{\P}$ equal to $\rc{\v}_1$ and $\rc{\v}_2$ respectively, the same argument tells us that the algorithm will behave as though we are just iterating over the remaining columns, and will converge to the dominant singular vector in the remaining subspace. We can continue this process until all columns are exhausted.

<p>In practice, of course, the second column doesn't need to wait until the first has converged. The closer $\rc{\bp}_1$ gets to $\rc{\v}_1$, the better constrained the iteration on $\rc{\bp}_2$ will be to the correct subspace. By the time $\rc{\bp}_1$ has converged we are likely to see that $\rc{\bp}_2$ has also found its correct value. However, if it hasn't, we have just shown that it is guaranteed to once $\rc{\bp}_1 = \rc{\v}_1$.
</p>

### The QR algorithm for the SVD

If only for the sake of symmetry, it would be nice if there were an SVD version of the QR iteration algorithm. Happily, it turns out there, is, although we need to be careful to translate the logic of the QR iteration in the correct way. 

As before, we'll show the algorithm first, and then work out how it relates to the orthogonal iteration.

<p>$$\begin{align}
&\X, \Y \leftarrow \gc{\M}, \gc{\M}^T \\
&\textbf{loop:} \\
&\tab \rc{\Q}, \R \leftarrow \text{qr}(\X) \\
&\tab \rc{\P}, \B \leftarrow \text{qr}(\Y) \\
&\tab \X \leftarrow \R\rc{\P}\\
&\tab \Y \leftarrow \B\rc{\Q}
\end{align}$$</p>

Compared to the QR iteration for eigenvectors, things have become a little more complex. There, we just took a QR decomposition and multiplied it back in reverse order. Here, we take two QR decompositions, and we don't just multiply them back in reverse order, we also mix up the matrices, multiplying $\R$ with $\rc{\P}$ and $\B$ with $\rc{\Q}$.

As before, this algorithm only works if we compute the full QR decomposition. Here's what that looks like for a rectangular matrix.

<figure class="narrow centering">
<img src="/images/pca-5/rectangular-qr.svg" >
</figure>

The key requirement is that $\rc{\Q}$ is square. This means that if the matrix is tall, as it is on the left, we compute as many orthogonal vectors as the matrix has columns, and then extend this to a full basis by choosing arbitrary orthogonal vectors until $\rc{\Q}$ is square. To make the multiplication work, we then extend $\R$ with rows filled with zeros.

If the matrix is wide, the QR algorithm should provide us with a full basis. We now just need to extend $\R$ far enough to make the multiplication of $\rc{\Q}$ and $\R$ reconstruct all columns of the matrix. Since we have a full basis with at least the dimensionality of the matrix, we know that the remaining columns are linear combinations of the columns of $\rc{\Q}$. We express each remaining column of the matrix as a linear combination of the columns of $\rc{\Q}$, giving us an additional column of $\R$ until $\R$ is as wide as $\gc{\M}$.

Now, to work out why this is the algorithm that gives us the result we want, we'll need to carefully take the logic from the eigenvector version, and apply it here step-by-step. In the eigenvector version, two ideas were key:

1. <div>We noted that the sequence of $\R\sp$ matrices computed by the orthogonal algorithm was defined by $\R\sp_i = \rc{\Q}\sp_i\bc{\A}\rc{\Q}\sp_{i-1}$.</div>
2. <div>We defined a sequence of new matrices $\bc{\D}_i = {\rc{\Q}\sp_{i}}^T\bc{\A}\rc{\Q}\sp_i$, inspired by the equation that holds when the algorithm has converged.</div>

We then showed that the sequence of $\bc{\D}_i$'s can be computed by taking the QR decomposition of the previous element, and multiplying it in reverse order, to produce the next.

Translating idea <span class="gc">1.</span> to the SVD version of the orthogonal iteration tells us that 

<p>$$\begin{align}
\rc{\Q}\sp_i\R\sp_i &= \gc{\M}\rc{\P}\sp_{i-1} &  \R\sp_i &= {\rc{\Q}\sp_i}^T\gc{\M}\rc{\P}\sp_{i-1} \\
\rc{\P}\sp_i\B\sp_i &= \gc{\M}^T\rc{\Q}\sp_{i} &  \B\sp_i &= {\rc{\P}\sp_i}^T\gc{\M}^T\rc{\Q}\sp_{i}\p \\
\end{align}$$</p>

<aside>On the left are simply the two QR decompositions computed in one iteration of the orthogonal algorithm. On the right, we've rewritten them to isolate $\R\sp_i$ and $\B\sp_i$</aside>

To translate idea <span class="gc">2.</span> we note that at convergence, we can increment the index of the rightmost factor by one. That is, in the limit of $i \to \infty$, the following equations hold:

<p>$$\begin{align}
\R\sp_i &= {\rc{\Q}\sp_i}^T\gc{\M}\rc{\P}\sp_{i} \\
\B\sp_i &= {\rc{\P}\sp_i}^T\gc{\M}^T\rc{\Q}\sp_{i+1}\p \\
\end{align}$$</p>

<p>We now take these equations, and define new matrices $\X_i$ and $\Y_i$ according to them. This is exactly the logic we used to define $\bc{\D}_i$. In the limit they are equal to $\R\sp_i$ and $\B\sp_i$, but for small $i$ there may be a large difference.
</p>

<p>$$\begin{align}
\X_i &= {\rc{\Q}\sp_i}^T\gc{\M}\rc{\P}\sp_{i} \\
\Y_i &= {\rc{\P}\sp_i}^T\gc{\M}\rc{\Q}\sp_{i+1}\p \\
\end{align}$$</p>

<p>The final step is to show that in these sequences of $\X_i$ and $\Y_i$ we can always compute the element at $i$ by QR decomposing the elements at $i-1$ and multiplying back in reverse order <em>and mixing up the matrices</em>.</p>

<p>We'll start with elements $\X_{i-1}$ and $\Y_{i-1}$. We'll need to express both of them as QR decompositions.</p>

<p>$$\begin{align*}
\X_{i-1} &= {\rc{\Q}\sp_{i-1}}^T \gc{\M} \rc{\P}\sp_{i-1} & \Y_{i-1} &= {\rc{\P}\sp_{i-1}}^T  \gc{\M}^T \rc{\Q}\sp_{i} & \text{by definition} \\
\X_{i-1} &= {\rc{\Q}\sp_{i-1}}^T \rc{\Q}\sp_i \R\sp_i & \Y_{i-1} &= {\rc{\P}\sp_{i-1}}^T \rc{\P}\sp_i\B\sp_i & \text{QR's in the orth. alg.} \\
\X_{i-1} &= \gc{{{\Q}\sp_{i-1}}^T {\Q}\sp_i} \R_i & \Y_{i-1} &= \gc{{{\P}\sp_{i-1}}^T  {\P}\sp_i} \B\sp_i & \gc{\text{highlight}} \p \\
\end{align*}$$</p>

<p>In the last line, we haven't changed anything. We've only highlighted that we've ended up expressing both $\X_{i-1}$ and $\Y_{i-1}$ as a QR decomposition. The <span class="gc">two factors highlighted in green</span> are both orthogonal matrices, so their product is an orthogonal matrix as well, and the remainders $\R_i$ and $\B_i$ are upper triangular.</p>

Now, we need to show that the next matrices in the sequence, $\X_i$ and $\Y_i$, can be expressed in terms of the factors of these two QR decompositions. Starting with the definitions, we get

<p>$$\begin{align}
\X_i &= {\rc{\Q}\sp_i}^T\gc{\M}\rc{\P}\sp_i &  \B_i &= {\rc{\P}\sp_i}^T\gc{\M}^T\rc{\Q}\sp_{i+1} & \text{by definition} \\
&= {\rc{\Q}\sp_i}^T\gc{\M}{\rc{\P}\sp_{i-1}}^T\rc{\P}\sp_{i-1}\rc{\P}\sp_i & &= {\rc{\P}\sp_i}^T\gc{\M}^T{\rc{\Q}\sp_{i}}^T\rc{\Q}\sp_{i}\rc{\Q}\sp_{i+1} & \text{insert $\I$} \\
&= \kc{{{\Q}\sp_i}^T{\Q}\sp_i}\R\sp_i\rc{\P}\sp_{i-1}\rc{\P}\sp_i & &= \kc{{{\P}\sp_i}^T{\P}\sp_i}\B\sp_i\rc{\Q}\sp_{i}\rc{\Q}\sp_{i+1} & \text{from orth. alg.} \\
&= \R\sp_i\gc{{\P}\sp_{i-1}{\P}\sp_i} & &= \B_i\gc{{\Q}\sp_{i}{\Q}\sp_{i+1}} & \\
\end{align}$$</p>

<p>And there we have the proof of our algorithm. If we QR decompose $\X_{i-1}$ and $\Y_{i-1}$ and multiply the results back together, mixed up and in reverse order, we get the values $\X_i$ and $\Y_i$. Since we know that these converge to the same values as the sequences $\R\sp_i$ and $\B\sp_i$, we see that we must be computing the singular value decomposition of $\gc{\M}$.
</p>

<aside>As before, the stripped down version we've given here only gives you the singular values (on the diagonal of $\X$). If you want the singular vectors as well, you'll need to keep a running product of $\rc{\Q}$ and $\rc{\P}$. See the link at the top for implementations these algorithms, which contain these details.</aside>

## Conclusion

This is where we will end our journey through the magical world of principal component analysis and all its relations. There is much we could still investigate. There are probabilistic and weighted versions of PCA. Regularized and sparse versions. There is a sidepath about non-linear PCA that could lead us into autoencoders, and from there into variational approaches in deep learning. Or, we could take a different track, and look into kernel-based nonlinear versions of PCA.

This is how it is, usually. You more you learn and discover, the more the boundary of the unknown expands with it. It can be disheartening, especially if you're in the habit of focusing on all the things you don't yet know.

So let's allow ourselves a look back instead of forward, to see what we've accomplished. We may not know about all the ways in which PCA may be extended, and given more power by non-linear additions, but constrained to the purely linear domain, I think we can say we've covered the ground pretty thoroughly. 

We've seen the basic mechanism in operation, we've uncovered its connection to eigenvalues, we've proved the spectral theorem that the whole thing hinges on, and we've looked at the singular value decomposition, which provides a complementary perspective. Finally, in this last part, we've looked at a triad of algorithms for computing the eigendecomposition, and then adapted each in turn to provide us with the singular value decomposition instead.

Looking back, the aim of properly explaining PCA, down to its foundations has set us on a far more formidable journey than that initial challenge implied (and, I must admit, than I originally anticipated). Taken together, these five parts touch on almost all the topics that you might find in a standard linear algebra text book. From bases to (psuedo)inverses, to ranks and determinants. We may have entered the forest at a different point, and with a different goal, but our walk has covered much of the same ground. 

And that may be the best reason for an exercise like this. Let's be honest: you don't need to know all this to use PCA effectively. The first part of this series alone is more than enough to know what you are doing when you call the standard implementation in some data science library. However, true understanding of a concept comes from seeing it from different angles. So it is with the many building blocks of linear algebra. 

The explanations you find in a textbook will provide you, usually, with just one perspective. Enough for a basic grasp of the material, if you're lucky enough to remember what you learned. This kind of exercise, picking one method, and digging in to it all the way down to the foundations, invariably requires you to revisit all those concepts you learned from the textbook, but with a new perspective, and a more concrete motivation.

If you're still reading at this point, that is hopefully what we've accomplished. To show how the whole cathedral of linear algebra works together to produce this magical operation that can take a messy, high-dimensional flood of data, and extract clean, low dimensional data, that more often than not, corresponds to the concepts we associate with its domain.

<figure class="narrow centering">
<img src="/images/pca-5/faces.png" class="half"/>
</figure>

## Appendix

### Uniqueness of the QR decomposition

In our discussion, we occasionaly make the leap from showing that we can derive _a_ QR decomposition to taking that to be _the_ QR decomposition. Under the right conditions, this is justified: if $\gc{\M}$ is full rank, a QR decomposition with only positive elements on the diagonal of $\R$ is unique.

That is, for any QR decomposition, we can always create another valid QR decomposition by flipping the sign on one of the columns of $\rc{\Q}$ and changing the sign of the corresponding row of $\R$. But up to the variations we can create by these sign changes, the decomposition is unique.

This trick can also be used to show that such a QR decomposition always exists. Just take any QR decomposition, and flip the sign for any row of $\R$ where the diagonal element is negative. We'll call this a _positive QR decomposition_.

<div class="theorem"><p>
For an $n \times m$ matrix $\gc{\M}$ with linearly independent columns, the positive QR decomposition $\rc{\Q}\R = \gc{\M}$ is unique.
</p></div>
<div class="proof"><p><em>Proof.</em> Let $\rc{\Q}$, $\R$ and $\rc{\P}$, $\B$ be two positive QR decompositions of $\gc{\M}$.

This suggests that $\rc{\Q}\R = \rc{\P}\B$ and thus $\rc{\P}^T\rc{\Q} = \B\R^{-1}$. </p>
<aside>
Note that $\R$ is invertible because $\gc{\M}$'s columns are linearly independent. A triangular matrix is invertible if and only if its diagonal is nonzero everywhere (the determinant is the diagonal product), and a diagonal element in $\R$ is zero if we can express one column of $\gc{\M}$ as a linear combination of the other vectors.
</aside>
<aside>Note also that while $\rc{\P}$ isn't square, so not invertible, the fact that its columns are mutually orthogonal unit vectors still gives us $\rc{\P}^T\rc{\P} = \I$, allowing us to move $\rc{\P}$ to the left side of the equation.
</aside>
<p>Now, we can conclude the following:</p>
<ol>
<li>The inverse of $\R$ must be upper triangular as well. By definition $\R\R^{-1} = \I$, and having a non-zero element below the diagonal on $\R^{-1}$ would create a non-zero element below the diagonal in $\R\R^{-1}$ (note that all elements of $\R$ must be non-zero).</li>
<li>The product of two upper triangular matrices is itself upper triangular. This follows from the fact that element $i, j$ of the multiplication $\A\B$ is the dot product of the $i$-th row of $\A$ and the $j$-th column of $\B$. If both are upper triangular, then all elements up to $i$ are zero in this row of $\A$ and all elements after $j$ are zero in the column of $\B$. If we are below the diagonal, them $i>j$, so every term in the dot product is zero.</li>
<li>Since $\R$ has a positive diagonal, so does its inverse. We can see from a matrix multiplication diagram that the elements that create the diagonal in the product are only the diagonal elements of $\R^{-1}$, the rest are multiplied by zeroes. Since the resulting diagonal elements need to be zero, the diagonal elements of $\R^{-1}$ must be the inverses of those of $\R$. So if the diagonal elements of $\R$ are positive, so are those of $\R^{-1}$. By similar logic, we can see that $\B\R^{-1}$ has a positive diagonal.
</li>
<li>$\rc{\P}^T\rc{\Q}$ is an orthogonal matrix. Note that $\text{col } \P = \text{col }\rc{\Q}$, so we can express the columns of $\rc{\Q}$ as linear combinations of those of $\rc{\P}$, or, for some $\rc{\S}$ we have $\rc{\P}\rc{\S} = \rc{\Q}$. Multiplying a vector by a matrix with orthonormal columns preserves lengths and dot products, so the columns of $\rc{\S}$ must be orthonormal too. Since $\rc{\S}$ is square, it's orthogonal. Finally $\rc{\P}\rc{\S} = \rc{\Q}$ implies $\rc{\S} = \rc{\P}^T\rc{\Q}$.
</li>
</ol>
<p>In conclusion, $\rc{\P}^T\rc{\Q} = \B\R^{-1}$ tells us two things. From the left hand side, that this is an orthogonal matrix, and from the right hand side, that it is upper triangular with a positive diagonal.</p>
<p>What does an orthogonal upper triangular matrix with a positive diagonal look like? We know that its first column must be a unit vector, with zeros everywhere except the first element. It's second vector must be orthogonal to the first, so its first element must be zero, as must everything below the diagonal to keep our matrix triangular. The only remaining nonzero element is on the diagonal, so it must be 1 to make the column a unit vector.</p>
<p>If we keep going like this, we see that all columns must be zero above the diagonal to keep them orthogonal to the previous columns, zero below the diagonal to keep the matrix triangular, and 1 on the diagonal to keep the column a unit vector.
</p>
<aside>Note that we can't make the diagonal -1 because we've concluded that the diagonal is positive everywhere.
</aside>
<p>In short, we have shown that $\rc{\P}^T\rc{\Q} = \B\R^{-1} = \I$. That means that $\rc{\P}^T$ is the inverse of $\rc{\Q}$ and $\R^{-1}$ is the inverse of $\B$. Since the inverse is unique, $\rc{\P} = \rc{\Q}$ and $\R = \B$.<span class="qed"></span></p>
</div>

<!-- {% endraw %} -->