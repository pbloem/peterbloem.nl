---
title: A friendly introduction to Principal Component Analysis
date: 31-01-2020
math: true
code: true
---
<!-- {% raw %} -->

<header>
<h1>A friendly introduction to PCA</h1>
<div class="subh1">part 3: Power iteration and the singular value decomposition</div>
</header>

<ul class="links">
	<li>31 Jan 2020</li>
	<li><a href="https://github.com/pbloem/blog/blob/master/2020/pca.ipynb">notebook on github</a></li>
		<li><a href="/blog/pca">part 1</a></li>
		<li><a href="/blog/pca-2">part 2</a></li>
		<li><a href="/blog/pca-3">part 3</a></li>
</ul>

This is the last post in the series on PCA. We have looked at what PCA is, at how to understand it, and we have spent a full post on developing the tools necessary to prove the spectral theorem, the particular decomposition that makes it all possible.

What we haven't discussed yet, in any detail, is how to build it. And how to build it efficiently. In this post we'll look at the two most common implementation strategies. The amazingly simple force of nature that is **power iteration** and the one-man army of the **singular value decomposition**. The latter is so amazingly 

Along the way, we'll look at some other applications of PCA and eigenvalues. We'll start with some deep history.

## Power iteration

As horrible as it is to contemplate, a non-negligable proportion of people reading this will have become internet users after Google was invented. If this is you, you will have no memory of how useless search engines were before Google came along. You won't have experienced the watershed that the introduction of Google was. You may not even believe that their almost-perfect market dominance can be traced back to one simple idea. 

The modern google engine combines a vast array of methods and philosophies, but the original idea that set it so far apart from the competitors was singular, and simple. 

The main problem facing search engines was the number of webpages trying to game the system. Pages would include fake keywords, large swathes of invisible text, everything to get as high in the results for as many different search terms as possible.

The main thing Google wanted to do was to developed a measurement of reputation: a single number that could capture to what extent a website was a respectable source of information playing by the rules, versus a cheap ad-laden swindle, trying to attract clicks. The basic idea was a social one: if somebody somewhere on the web chooses to link to you, they must trust you, and this should serve as a signifier of your reputation. 

By itself, this is easy enough to game. Just set up a load of websites that all link to each other. But the idea can be applied recursively: the better the reputation of the people that link to you, the better your reputation. And their reputation is determined by the reputation of the people that link to them and so on. Theoretically we keep going forever, practically, we keep doing this for whatever number of steps is practical.

This may seem like a slightly mind-bending idea at first, but that is mostly because we're working backward. We can define the same idea forward. Let's say that every website at time $t=0$ is given one unit of reputation for free. At every step, it takes all its reputation, divides it up and gives it to other websites on the web (which it chooses by linking to them). If the website receives no incoming links from others it is out of reputation and stays at 0. If, however, it gets some incoming links as well, it gets some new reputation, which it then redistributes again.

What does any of this have to do with eigenvectors and PCA? The link becomes clear when we try to figure out what the ultimate state of this process is. First we need to translate the problme setting to linear algebra. Let's say we have a set of $n$ websites. We can represent the directed graph of which site links to which other site (the _web graph_) as a large $n \times n$ matrix.

- Revisit Mona Lisa example.


## The Singular Value Decomposition

### Principal Component Analysis by SVD

### Everything else

#### solving linear systems

#### ???
 
####

## Conclusion

##  Clean up

### Mean centering

** move to some appendi

### PCA by EM

### Non-linear PCA

### Other PCAs

### PCA in a Deep Learning World

## Acknowledgements

Thanks to <a href="https://emilevankrieken.com/">Emile van Krieken</a> for proof reading, and pointing out many mistakes and improvements.

 * PCA is a tradeoff between simplicity and power. This makes it much better for analysis than deep nonlinear methods.
 * PCA works on wide data.
-- conclusion
--- fast, hands-free and most importantly interpretable. Analysis (ref Antske?)

<!-- {% endraw %} -->