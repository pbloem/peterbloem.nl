---
title: Stable softmax for sparse matrices
date: 07-07-2019
math: true
parent: blog

---

<!-- {% raw %} -->

<header>
<h1>Stable softmax for sparse matrices</h1>
</header>

<ul class="links">
	<li>7 July 2019</li>
	<li><a class="code" href="https://github.com/pbloem/blog/tree/master/2019/week27">code on github</a></li>
</ul>

<aside>I this post, I'll introduce a trick for computing the row-wise softmax over sparse matrices. I expect this could be useful in building self-attention models with sparse attention, like a sparse transformer, or a graph attention network.</aside>

**Sparsity** is an important topic in machine learning. When we build a model, the simplest approach is usually to make no assumptions about its internal structure, and to connect every possible input to every possible output, perhaps with some intermediate representations. This is, for instance, how we ended up with the fully connected network (or multilayer perceptron) as one of the first neural network architectures.

<figure class="narrow">
<img src="/files/stable-softmax/densevsparse.svg">
</figure>

When that fails to work, a good way to add some domain knowledge to the network is to remove some of these connections. For instance, in image analysis, we know that when we build up low-level representations, we can just look at local information in the input, so instead of connecting everything with everything, we take a local _neighborhood_ of pixels, and connect it to one hidden unit in the next layer. 

In a phrase, we add sparsity to strengthen the _inductive bias_.

Now, more than 20 years since the first convnet, we are in the age _self-attention_: we represent units (words, pixels, graph nodes) with a vector instead of a single value, and we let some function \\(\text{att}(\bf{a}, \bf{b})\\) determine how much attention \\(\bf{a}\\) should pay to \\(\bf{b}\\) when building up its new representation vector for the next layer. Again, potentially everything connected with everything, although the weights are now derived through attention rather than learned.

So when the self-attention models fail to work, or fail to scale, we ask the same question. Can we add some sparsity to the model, based on what we know of the domain, to strengthen the inductive bias. Some recent examples are the [sparse transformer](https://openai.com/blog/sparse-transformer/) by Child et al. from OpenAI labs, and the [graph attention network](https://openreview.net/forum?id=rJXMpikCZ), by Veličković et al. In both models, self-attention is used, but only particular units are allowed to attend to one another. Under graph attention, the input graph controls the allowed connections, and in the sparse transformer, a domain-specific connectivity pattern is introduced.

## The problem

To build a sparse self attention, and to do so efficiently, we want to store the attention weights in a sparse matrix \\(\bf A\\). It's no use building a sparse model if we have to store a dense \\(n\times m\\) matrix full of zeros to store all the attention weights from \\(n\\) inputs to \\(m\\) outputs.

The trouble with storing this matrix sparsely is that we need to compute a row-wise softmax. The weights in each row need to sum to one, so that the new representation for a particular unit becomes a weighted mean of all previous representations.

All this brings us to the topic of this post: **How do we compute a row-wise softmax on a sparse matrix efficiently and stably**. _Efficient_, in this context, means using the basic primitives available for sparse matrices, so that we can rely on existing optimizations for sparse matrix multiplication. _Stable_ means that we can compute the softmax accurately for a wide range of values, without rounding errors exploding into infinity, zero or NaN.

Currently, the standard approach in GATs is to rely on dense matrices, which makes the memory requirements quadratic in the number of nodes in the input. The sparse transformer uses custom CUDA kernels, that seem to rely on the attention matrix being _block_-sparse rather than fully sparse.

We'll look at three approaches towards implementing a fully sparse softmax using only basic matrix primitives which we'll call the _naive_, the _\\(p\\\)-norm_ and the _iterative_ approach. As far as I know the latter two are original methods, but I'm happy to be corrected if somebody's already though of this in some other context. 

#### notation and terminology

A **sparse matrix** is a matrix for which most elements have the same value (usually \\(0\\)), so that it becomes more efficient to store only the elements that deviate from this value. We will call these the _explicit elements_, and the rest the _implicit elements_.

A sparse matrix witk \\(k\\) explicit elements \\(\bf A\\) is defined by three components: a \\(k \times 2\\) integer matrix \\(\bf D\\) containing the indices of the explicit elements. A length \\(k\\) real valued vector \\(\bf v\\) containing the values of the explicit elements, and an integer pair determining the size of the matrix. We will omit the size, to clarify our notation.

We'll use \\({\bf A} = M({\bf v}, {\bf D})\\) to refer to a sparse matrix as a function of its component parts.


### 1. The naive approach

<p>
The row-wise softmax \(\bf \overline{A}\) for matrix \(\bf A \) is defined as
$$
\overline{A}_{\kc{i}\rc{j}} = \frac{ \text{exp}\;A_{\kc{i}\rc{j}} }{ \sum_\gc{k} \text{exp}\;A_{\kc{i}\gc{k}} }
$$
where the sum is over all elements in row \(\kc{i}\) of \(\bf A\).
</p>


That is, we exp all the values in the matrix, perform a row-wise sum, and then divide \\(\text{exp}\;\bf A\\) element-wise by the resulting vector (broadcasting along the rows).

<figure class="narrow">
<img src="/files/stable-softmax/naive.svg" />
</figure>

<aside>Note that we want the <em>result</em> of this operation, \(\overline{ {\bf A}}\), to be sparse with implicit zero elements. To achieve this, the input should not have implicit zero elements, but implicit \(- \infty \) elements. </aside>

A row-wise sum is easy enough to implement using matrix multiplication, all you need is:

$$
{\bf M} \cdot {\bf 1}^m
$$
where \\(\bf{1}^m\\) is a length \\(m\\) vector filled with ones. This gives us the following straightforward algorithm:
$$
\begin{aligned}
& {\bf E} \leftarrow \text{exp}({\bf A}) \\\\
& {\bf s} \leftarrow {\bf E} \cdot \bf{1}^m \\\\
& \bar {\bf A} \leftarrow \frac{{\bf E}}{{\bf s} \cdot {{\bf 1}^n} ^T}\\\\
\end{aligned}
$$
Where the division in the last line is element-wise. 

To see how this algorithm fares, we generate random sparse matrices of size \\(1000 \times 1000\\), with 6000 explicit elements drawn from a normal distribution \\(N(0, \gc{\sigma})\\) for increasing \\(\gc{\sigma}\\). We softmax the matrix by the algorithm above and plot the proportion, out of 40 repeats, of results containing at least one NaN.

<figure class="wide">
<img src="/files/stable-softmax/plot-naive.svg" class="wide"/>
</figure>

If you've ever implemented softmax, this result should come as no surprise. The problem comes from the exponentiation: after this, the values in the matrix have such wildly different scales that, unless they fit a very narrow range, it's likely that either some will overflow to positive infinity (ultimately leading to NaN) or, if they're all negative, the whole sum will underflow to zero (leading to NaN again in the division).

There is a [standard solution](https://timvieira.github.io/blog/post/2014/02/11/exp-normalize-trick/), closely related to the famous [logsumexp trick](https://en.wikipedia.org/wiki/LogSumExp). We simply subtract a large value \\(b_\kc{i}\\) from all elements in row \\(\kc{i}\\) of  \\( \bf A\\). 

<p>
Working \(-b_\kc{i}\) out of the exp, we see that we get a multiplier \(\text{exp} -b_\kc{i}\) on both sides of the divisor, so the formulation is equivalent:</p>
<div class="wide">
$$\overline{A}_{\kc{i}\rc{j}} = \frac{\text{exp}\;A_{\kc{i}\rc{j}}}{\sum_\gc{k} \text{exp}\; A_{\kc{i}\gc{k}}} = \frac{\text{exp}(-b_\kc{i}) \text{exp}\; (A_{\kc{i}\rc{j}})}{\text{exp}(-b_\kc{i})\sum_\gc{k} \text{exp}\;(A_{\kc{i}\gc{k}})} = \frac{\text{exp} (A_{\kc{i}\rc{j}} - b_\kc{i})}{\sum_\gc{k} \text{exp}(A_{\kc{i}\gc{k}}-b_\kc{i})}  \text{.}$$
</div>


<p>The trick is to choose \(b_\kc{i}\) large enough that any values that would normally overflow, can now be computed. Any values that are much smaller than this will underflow to zero, but they would not have contributed to the sum anyway. The only danger is that we choose \(b_\kc{i}\) so big that _all_ values underflow, and we end up dividing by zero. The foolproof solution is take the maximum of the values over which we're softmaxing:
$$
b_{\kc{i}} = \text{max}_\gc{k} A_{\kc{i}\gc{k}} \text{.}
$$ That way, at least one value in the sum will end up \(\text{exp}\;0 = 1\) and anything much smaller will just underflow to zero.</p>

But that's also where the problem arises for our use case. For this to work, we need to compute the row-wise maximum of \\(\bf A\\). This is a tricky operation. To work out the row-wise maxima of \\(\bf A\\), we need to group \\(v\\) by their rows, and then compute the maxima over each group. Since each group will have a different size, this is tough to parallelize. Can we simplify this using the basic primitives available for sparse matrices?

**How do we efficiently compute the row-wise maximum of a sparse matrix, when all we can do is matrix multiply, and element-wise operations?**

### 2. The \\(p\\)-norm approach

<p>We will start by using the following identity:
$$
\begin{equation}
\text{lim}_{\rc{p} \to \infty} \left(\sum_\lbc{i} {x_\lbc{i}}^\rc{p} \right)^{\frac{1}{\rc{p}}} = \text{max} ({\bf x}) \label{eq:limit}
\end{equation}
$$</p>

That is, the \\(\rc{p}\\)-norm of \\(\bf x\\) approaches the maximum element of \\({\bf x}\\), as \\(\rc{p}\\) goes to infinity. To see why, consider what happens to the values of \\(\bf x\\) under application of a convex function:

<figure class="narrow">
<img src="/files/stable-softmax/convex.svg"/>
</figure>


The \\(\lbc{\text{largest element}}\\) is increased, proportionally, by more than \\(\lgc{\text{the others}}\\). In the limit, the contribution of any element other than the maximum disappears from the sum, and all we are doing is exponentiating \\(\text{max} ({\bf x})\\) by \\(p\\) and then reversing that exponentiation.

Of course, we can't exponentiate by infinity to compute the max, but maybe a large value is already enough to give us a reasonable \\(b_\kc{i}\\). After all, we don't need the exact maximum, we just need a close enough value to prevent overflows. 

This gives us the following algorithm (with \\(\rc{p}\\) larger than 1 but not too large):
$$
\begin{aligned}
&{\bf b} \leftarrow \text{pow}({\bf A}, \rc{p}) \cdot {\bf 1}^m \\\\
&{\bf b} \leftarrow \text{pow}({\bf b}, 1/\rc{p}) \\\\
& {\bf \bc{E}} \leftarrow \text{exp}({\bf A} - {\bf b}) \\\\
& {\bf \gc{s}} \leftarrow {\bf \bc{E}} \cdot \bf{1}^m \\\\
& \bar {\bf A} \leftarrow \frac{{\bf \bc{E}}}{{\bf \gc{s}} \cdot {{\bf 1}^n} ^T} \\\\
\end{aligned}
$$

Let's see how this method does. 

<figure class="wide">
<img src="/files/stable-softmax/plot-pnorm.svg" />
</figure>

<aside>
Error bars in line plots indicate standard deviation over 40 repeats. The second plot shows the deviation from summing to 1 (maximum over all rows in the matrix).
</aside>

As we can see, we have avoided the problem of the NaNs. Even for matrices with pretty large random values, we get no NaNs. Unfortunately, the second row in the plot shows that the method fails a second basic test: the rows in the result should sum to one (this is the whole point of the softmax operation). When we compute the row sums of the result, and check how far they deviate from 1, we see that the \\(p\\)-norm method begins to fail much earlier than the naive approach. Changing the value of the exponent \\(\rc{p}\\) has little effect.

The problem is that the \\(p\\)-norm approximation tends to _overestimate_ the max. In the limit, the non-max terms don't contribute to the sum anymore, but before we reach the limit, they still contribute, giving us only an upper bound for the max. And if we use a value larger than the max for our \\(b_\kc{i}\\), we end up pushing all values towards zero. The problem is not severe enough to cause NaNs, but the rounding errors ultimately make the result less useful than the naive approach. 

### 3. The iterative approach

In short, it turns out we _do_ need quite a precise approximation for the maximum if we want to compute the row-wise softmax with a greater degree of accuracy and stability. 

<p>Let \(\bf x\) be a vector containing only nonnegative values. Consider the following iteration:
$$
{x_\lbc{i}} \leftarrow \frac{{x_\lbc{i}}^2}{\sum_\lgc{k} {x_\lgc{k}}^2} \text{.}
$$
That is, we square the elements of \(\bf x\) and then normalize the result to sum to 1.
</p>

<p>Under this iteration, \(\bf x\) is always a probability vector (its elements sum to one). This ensures that so long as the iteration itself is stable, the vector itself should never blow up. Moreover, it turns out that <strong>this iteration converges to the one-hot vector for the the maximum element of the original \(\bf x\)</strong>. To see why, consider what happens after two iterations:</p>

<div class="wide">
$$
{x_\lbc{i}}^{(2)} = \frac{ {{x_\lbc{i}}^{(1)}}^2}{\sum_\lgc{k} {{x_\lgc{k}}^{(1)}}^2} = \frac{
\left (\frac{ {{x_\lbc{i}}}^2}{\sum_\kc{l} {{x_\kc{l}}}^2} \right)^2
}{
\sum_\lgc{k} \left (\frac{ {{x_\lgc{k}}}^2}{\sum_\kc{l} {{x_\kc{l}}}^2} \right)^2
} =
\frac{
\kc{\left ( \frac{1}{ \sum_l {x_l}^2 } \right)^2} \left( {x_\lbc{i}}^2\right)^2
}{
\kc{\left ( \frac{1}{ \sum_l {x_l}^2 } \right)^2} \sum_\gc{k}\left( {x_\gc{k}}^2\right)^2
} = \frac{ {x_\lbc{i}}^4}{\sum_\lgc{k} {x_\lgc{k}}^4}
\text{.}
$$
</div>

<p>That is, after \(n\) iterations, we have computed \( \frac{{x_\lbc{i}}^\rc{p}}{\sum_\lgc{k} {x_\lgc{k}}^\rc{p}} \) with \(\rc{p}=2^n\).</p>

As \\(\rc{p}\\) goes to infinity, this converges to a one-hot vector for the maximum of the initial \\(\bf x\\) (scroll down for [a proof](#appendix)).

<aside>
This approach works with any exponent \(\rc{p} \gt 1\). The bigger the value, the fewer iterations we need to converge, but the more likely we are to overflow in a single iteration.
</aside>

If we compute this one-hot vector, multiply it by the original values of \\(\bf x\\) and sum, we get the maximum of \\(\bf x\\).

To use this method for a row-wise softmax, we need to make all values positive first. We have two options. 

* Take the softplus() over all all values.
* Subtract the minimum of the whole matrix from all values.

Both of these options are standard dense-matrix operations that we can apply directly to the elements of \\(\bf v\\). The first option seems to work best in our experiments.

This brings us to the following algorithm to compute a row-wise max for a sparse matrix.

<p>$$
\begin{aligned}
& \textbf{function}\;\text{max}({\bf v}, {\bf D}, \rc{p}, k): \\
& \hspace{1cm} \text{given: a sparse matrix $\bf A$ with values $\bf v$ at indices $\bf D$,}\\
& \hspace{1cm} \text{an exponent $p$, and a number of iterations $k$} \\
& \hspace{1cm}{\bf h} \leftarrow \text{softplus}({\bf v}) \\
& \hspace{1cm}\textbf{for } i \in [0..k]: \\
& \hspace{2cm} {\bf h} \leftarrow \text{pow}(h, \rc{p}) \\
& \hspace{2cm} {\bf s} \leftarrow {\bf M}({\bf h}, {\bf D}) \cdot {\bf 1}^m \\
& \hspace{2cm} {\bf h} \leftarrow {\bf h} / \text{select}({\bf s}, {\bf D}[0, :]) \\
& \hspace{1cm}\textbf{return } {\bf v} \otimes {\bf h} \\
\end{aligned}
$$</p>

<aside>
The function \(\text{select}({\bf x}, {\bf d})\) works in the same way as pytorch's <a href="https://pytorch.org/docs/stable/tensors.html#torch.Tensor.index_select"><code>index_select()</code></a>. It selects the elements of vector \(\bf s\) by the indices in integer vector \(\bf d\), resulting in a vector with the same length as \(\bf d\), containing elements of \(\bf s\), possibly multiple times.
</aside>

After computing the maxima, the softmax can be computed in the same manner as in the \\(p\\)-norm approach.
 
<aside>Note that the matrix must be <em>coalesced</em> for this method to work. It is common to allow indices to be present multiple times, adding up the corresponding values. In this case, the maximum of a row may be split among multiple values in the value vector, which causes the method to fail.
</aside>

We can now show all approaches together. We'll add 2 additional metrics: 
* The RMSE of the non-zero values compared to computation of the softmax on a dense version of the matrix.
* The mean absolute error of just the estimated row-wise max (only for the \\(p\\)-norm and iterative approaches).

We run the iterative approach for 20 iterations, with exponents 2 and 1.1.

<figure class="wide">
<img src="/files/stable-softmax/plot-all.svg" />
</figure>

The iterative approach seems to do the trick. It avoids NaNs, and the rows sum to one for greater variances than either the naive or the \\(p\\)-norm approaches. We can expect reasonable stability up to a variance of 40. Even better stability may be possible by reducing \\(\rc{p}\\) further, and increasing the number of iterations, but if \\(\rc{p}\\) gets too close to 1, stability will suffer again.

## Conclusion

Is this useful? Iterative approaches are expensive in deep learning systems (every iteration is stored in the computation graph), and there are other approaches that may work, depending on the situation: for shallow models, careful initialization may be enough for the naive approach to work, and batch normalization in between layers can probably ameliorate the problem as well.

There may even be a way to compute the row-wise max more directly (perhaps with a custom CUDA kernel). Nevertheless, this approach uses only existing API calls, which means it can be implemented in a decoupled way (for instance, the implementation is the same for GPU and CPU computation).

Whether this allows us to build deeper GATs and sparse transformers, and whether these allow for better performance than was previously possible is left to be seen. I may investigate in a future blog post.

Finally, we should note that most of these issues arise from the default use of the softmax function to parametrize a categorical distribution. Other approaches exist that may be just as practical and much more stable. Simply taking the absolute values of the inputs and normalizing may work just as well. The softmax approach seems to be inspired by [statistical mechanics](https://en.wikipedia.org/wiki/Boltzmann_distribution) with little requirement for numerical precision. This is very similar to the sigmoid activation, which was ultimately replaced by the more linear ReLU, at least for internal activations. Perhaps a similar approach is called for when it comes to the softmax activation.


<h2 id="appendix">Appendix: proof of convergence</h2>

<p><strong>Lemma.</strong> Let \(\bf x \in  {\mathbb{R}_+}^n\). Assume that \(\bf x\) has \(n'\) maximal elements; that is, there are \(n'\) elements \(x_\lbc{j}\) such that \(x_\lbc{j} = \text{max}({\bf x})\). Then 
$$
\text{lim}_{\rc{p} \to \infty} \frac{ {x_\lrc{i}}^\rc{p} }{ \sum_\gc{k} {x_\gc{k}}^\rc{p} } = \begin{cases} \frac{1}{n'} &\text{ if } x_\lrc{i} = \text{max}({\bf x})\\ 0 & \text{otherwise.}\end{cases}
$$
</p>

<p><em>Proof.</em> Let \(x_\lrc{i} \lt \text{max}({\bf x})\). Then
$$
0 \leq \frac{ {x_\rc{i}}^\rc{p} }{ \sum_\gc{k} {x_\gc{k}}^\rc{p} } \leq \frac{ {x_\rc{i}}^\rc{p} }{ \text{max}({\bf x})^ \rc{p} } \leq  \left ( \frac{ {x_\rc{i}} }{ \text{max}({\bf x}) } \right ) ^\rc{p} \text{.}
$$
Since the right hand side goes to zero as \(\rc{p}\) goes to infinity, the limit goes to zero.</p>
<p>Let \(x_\lbc{j} = \text{max}({\bf x})\). Then
$$\frac{1}{n} = \frac{\text{max}({\bf x})^\rc{p}}{n \cdot \text{max}({\bf x}) ^ \rc{p}} \leq  \frac{{x_\lbc{j}}^\rc{p}}{\sum_\gc{k} {x_\gc{k}} ^ \rc{p}} \leq \frac{\text{max}({\bf x})^\rc{p}}{n' \cdot \text{max}({\bf x}) ^ \rc{p}} \leq \frac{1}{n'} \;\;\;\;\text{.}
$$
In other words, \({x_\lbc{j}}^\rc{p}/\sum {x_\gc{k}}^\rc{p} \in \left [\frac{1}{n}, \frac{1}{n'} \right] \) for all \(\rc{p}\). Since the sum over all elements of \(\bf x\) must equal one and the limit goes to zero for the non-maximal elements $x_\lrc{i}$ the limit for the maximal elements $x_\lbc{j}$ must go to \(\frac{1}{n'}\). <span class="qed" />
</p>
<!-- {% endraw %} -->