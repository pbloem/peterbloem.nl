---
title: A friendly introduction to Principal Component Analysis
date: 31-01-2020
math: true
code: true
---
<!-- {% raw %} -->

<header>
<h1>A friendly introduction to PCA</h1>
<div class="subh1">part 3:The Spectral theorem</div>
</header>

<ul class="links">
	<li>Oct 2020</li>
	<li><a href="https://github.com/pbloem/blog/blob/master/2020/pca.ipynb">notebook</a></li>
		<li><a href="/blog/pca">part 1</a></li>
		<li><a href="/blog/pca-2">part 2</a></li>
		<li>part 4</li>
</ul>

TODO:

<aside>Eigenvalues need not be unique: two different eigenvectors of the same matrix can have the same eigenvalue, even if they point in different directions. We call these <strong>multiplicities</strong>. This is important, because we often charactarize matrix by how many eigenvalues it has, so it's important to note whether we are counting multiplicies.</aside>

---

When I started this series of blogposts, it was not meant to be a four-parter. I was going for an explanation  of PCA that was simple and straight-to-the-point, but that also didn't skip any steps, and derived anything from first principles. I was a little frustrated with other explanations that left things out, or required the reader to take things at face value.

This part illustrates why that is so. In this part we will prove the spectral theorem, which we introduced last time. This is very much the dark heart of PCA, the one result from which everything else follows, so it pays to understand it properly. The drawback is that the proof of the spectral theorem adds a boatload of preliminaries to the story.

Suddenly, just to understand this one result, we need to understand **determinants**, the **characteristic polynomial** and **complex numbers and vectors**. All interesting of course, and worth knowing about, but it's a lot of baggage if you just want to know how PCA works. So I decided to move it all into one self-contained part of the series. If this is too much for you, you can take the spectral theorem at face value, and move to the final part, which is about the singular value decomposition.

## Restating the spectral theorem

An orthogonal matrix is a square $n \times n$ matrix  whose columns are mutually orthogonal and form a basis for ${\mathbb R}^n$. Equivalently, an orthogonal matrix is a matrix $\bc{\A}$ for which $\bc{\A}^{-1} = \bc{\A}^T$.

A matrix $\bc{\A}$ is _orthogonally diagonalizable_ if there exist an orthogonal matrix $\rc{\P}$ and a diagonal matrix $\bc{\D}$ such that $\bc{\A} = \rc{\P}\bc{\D}\rc{\P}^T$.

A matrix $\bc{\A}$ is symmetric if $\bc{\A} = \bc{\A}^T$.

<p><div class="theorem"><strong class="gc">The spectral theorem</strong> A matrix is orthogonally diagonalizable if and only if it is symmetric.
</div></p>

In the rest of this blog post we'll build a toolkit step by step, with which to analyze this problem. At the end, we'll return to the theorem and apply our tools to prove it.

<aside> We'll call this "the" spectral theorem in the context of this series, but there are many spectral theorems about which operators can be diagonalized under which conditions. 
</aside>

## Determinants

## The characteristic polynomial

## Complex numbers

Complex numbers spring from the idea that there exists a number $i$ for fr which $i^2$ is $-1$. For many people this is the point where mathematics becomes to abstract and they tune out. The idea that squares can be negative clashes too much with our intuition for what squares are. The idea that we just pretend that they can be negative and investigate the consequences, seems almost perverse.

And yet, this approach is one that humanity has followed again and again in the study of numbers. If you step back a bit, you start to see that it is actually one of the most logical and uncontroversial things to do. 

The study of numbers started somewhere before recorded history, in or before the late stone age, when early humans began counting things in earnest, and they learned to add. I have five apples, I steal three apples from you, now I have eight apples. That sort of thing.

At some point, these early humans will have solidified their concept of "numbers". It is a set of concepts (whose meaning we understand intuitively) which starts $1, 2, 3, \ldots$ and continues. If you add one number to another, you always get another number.  If the number is big, they may not have had a name for it, but a patient Paleolithic human with enough time could certainly have carved the required number of tally marks into a cave wall.

The operation of addition can also be reversed. If $5 + 3$ gives $8$, then taking $5$ away from $8$ gives three. If I steal $3$ apples from your collection of $8$, you still have $5$ left. Thus, subtraction was born. But subtraction, the _inverse_ of addition, required some care. Where adding two numbers always yielded a new number, subtracting two numbers doesn't always yield a new number. You can't have $5 - 8$ apples, because if you have $5$ apples I can't steal more than $5$ of them.

As society grew, financial systems developed and debt became an integral part of society, the following tought experiment was considered. What if $5-8$ is a number? We'll just give it a name and see if it makes sense to compute with it. No doubt many people were outraged by such a suggestion, protesting that it was unnatural, and insult to whatever God they believed had designed the numbers. But simple investigation showed that if these numbers were assumed to exist, they followed simple rules and, it made sense to think of them as a kind of mirror image of the natural numbers, extending to infinity in the opposite direction. $5 - 8$ was the mirror image of $3$, so it made sense to call it $-3$.

The skeptics might argue that this made no sense, because there is no such thing as having $-3$ apples, but the mathematicians will have countered that in other areas, such as finance, there were concepts that could be expressed very beautifully by the negative numbers. If I owe you 3 apples, because of my earlier theft, and you steal 8 apples from me, I now owe you -5 apples, or rather you owe me 5.

The same principle can be applied to multiplication. If your tribe has $8$ families, and every family is entitled to $5$ apples, you need to find $8 \times 5$ apples. Again, an operator, and any two numbers you care to multiply will give you a new number (even if you believe in negative numbers).

And again, you can do the opposite: if you have 48 apples, you can work out that every member in your tribe gets $6$ of them. But again, you have to be careful about which numbers you apply the inverse to. Sometimes you get a known number, and sometimes you don't. If you have 50 apples, suddenly there is no known number that is the result of $50/8$.

But what if there was? What if we just gave $50/8$ a name and started investigating? We'd find out pretty quickly that it would make sense to think of these numbers as lying _in between_ the integers. Whoever it was that invented the rationals must have run into less resistance than the inventor of the negative numbers; it's much easier to imagine half an apple than to imagine $-3$ of them.

One more, to drive the point home, and to bring us far enough into recorded history so we can actually see how people dealt with these revelations. If adding is repeated incrementing, and multiplication is repeated adding, then raising to a power is the next step in the hierarchy. 

The story should be familiar at this point. Any two natural numbers $a$ and $b$ can be "exponentiated" together as $a^b$ and the result is another natural number.

The inverse operation is an b-th root, but we can stick with square roots to illustrate our point. In fact the square root of 2, the length of the diagonal of a square, is all we need. There is nothing abstract about this quantity: it's the distance from one corner to the opposite in a square room (as a multiple of the sides). And yet, it caused great upset.

[]

The man who gave his name to the theorem we would use to work this out, Pythagoras, was the head of a cult. A cult dedicated to mathematics. They lived ascetically, much like monks would, centuries later, and dedicated themselves to the study of nature in terms of mathematics. When asked what the purpose of man was, Pythagoras answered "to observe the heavens". One fervent belief of the Pythagoreans was that number and geometry were inseperable: all geometric quantities could be expressed by (known) numbers.

The story of the Pythagoreans is a mathematical tragedy. It was one of their own (commonly identified as Hippasus of Metapontum), who showed that no rational number (one integer divided by another) corresponded exactly to $\sqrt{2}$. Some aspects of geometry were outside the reach of the known numbers. According to legend, he was out at see when he discovered this, and was promptly thrown overboard by the other Pythagoreans.

Of course, with the benefit of hindsight, we know how to manage such upsetting discoveries. We simply give the number $\sqrt{2}$ a name and see if there's some place on the line of known number where it makes sense to put it. In this case, somewhere between $141/100$ and $142/100$, in a space we can make infinitely small by choosing better and better rational approximations.

With this historical pattern clearly highlighted, the discovery of the complex numbers should be almost obvious. In fact, we don't even need a new operation to invert, we are still looking at square roots, but instead of applying the square root to positive integers, we apply it to _negative integers_. To take the simples example, what if $\sqrt{-1}$ were a number? What would happen if we gave it a name and studied its hypothetical properties?

As the previous paragraphs should illustrate, this kind of investigation is usually born out of necessity. Like a fussy child given a new food, humans are reluctant to accept new types of numbers. In this case, what pushed us over the edge was the study of polyn  omials, functions of the form: $ax^3 + bx^2 + x + c = 0$ (where the highest exponent in the sum indicated the _order_ of the polynomial).

The problem of finding the _roots_ of a polynomial, the values of $x$ for which the sum is equal to $0$ crops up in all sorts of practical problems. In some cases, this leads to squares of negative numbers, as we see when we try to solve $x^2 + 1 = 0$. This didn't worry anybody, of course since this function lies exactly over the horizontal axes, so it's only natural that solving for the roots leads to a contradiction. 

However, when people started to work out general methods for solving cubic equations, like $x^3 - x = 0$, which did have roots, it was found that the methods worked if one temporarily accepted $\sqrt{-1}$ as an intermediate value, which later canceled out. This is where the phrase _imaginary_ originated. People (Descartes, to be precies) were not ready to accept these ar numbers, but no one could deny their utility.

Eventually, people followed the pattern that they had followed centuries before for the integers, the rationals and all their successors. We give the new number a name, $i = \sqrt{-1}$, and we see if there's any way to relate it, geometrically, to the numbers we know.

Let's start with addition. What happens if we add $i$ to some real number, say $3$. The simple answer is that nothing much happens. The most we can say about the new number is that it is $3 + i$. 

Multiplication then. Again $3i$ doesn't simplify in any meaningful way.


[What do we need later on. Explain that and leave the rest.]







## The spectral Theorem

### The Schur decomposition

### Proof of the spectral theorem


<div class="proof"><p>
<em>Proof.</em> <strong>(1) If a matrix $\bc{\A}$ is orth. diagonalizable, it must be symmetric.</strong> Note that in an orthogonal diagonalization we have $\rc{\P} = \rc{\P}^{T^T}$ and $\bc{\D} = \bc{\D}^T$. Thus, if $\bc{A}$ is orthogonally diagonalizable, we know that </p>

<p>$$
\bc{\A} = \rc{\P}\bc{\D}\rc{\P}^T = \rc{\P}^{T^T}\bc{\D}^T\rc{\P}^T =  (\rc{\P}\bc{\D}\rc{\P}^T)^T = \bc{\A}^T 
$$<br/>
which implies that $\bc{\A}$ is symmetric.
</p>

<p>
<strong>(2) If a matrix $\bc{\A}$ symmetric, it must be orth. diagonalizable.</strong> In this direction, things get a bit more involved. Let $\bc{\A}$ be symmetric.
</p>

<p></p>

<span class="qed" /></p></div>

<!-- {% endraw %} -->