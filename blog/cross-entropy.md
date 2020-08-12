---
Title: Loss functions for image VAEs
Date: 30-03-2020
Math: true
Code: false
---

<header>
<h1>Loss functions for image VAEs</h1>
<div class="subh1">Cross entropy and logit-normal loss</div>

</header>
<ul class="links">
	<li>29 March 2020</li>
	<li><a class="code" href="https://github.com/pbloem/former">code on github</a></li>
</ul>

<aside>
Training VAEs for images works best with binary cross-entropy loss, but this breaks the derivation of a VAE as optimizing maximum likelihood. With a little creative rewriting, however, we can cast the binary cross-entropy as the logarithm of an unnormalized probability density. This gives us a technically sound reconstruction loss that looks a lot like the binary cross-entropy. We'll also look at a little-known, but very effective alternative distribution on the unit interval: the logit-normal distribution.
</aside>

The _variational autoencoder_ is a very neat way of learning latent representations of high dimensional data like images. Here is a 2-dimensional latent space representation of MNIST, purely learned by VAE.

[latent space]

One of the nicest aspects of the VAE is that it is entirely derived from a _maximum likelihood_ objective. The VAE, through a few shortcuts and approximations, learns a model that more or less directly optimizes the likelihood of your data. 

A problem that is often encountered when applying the VAE to image data is that the reconstruction loss (one of the two terms of the VAE loss function) needs to have the form \\(\\log p(\\x\mid \\bf z)\\) where \\(\\x\\) is our instance (an image) and \\(\\bf z\\) is its latent vector.

Here  \\(p(\\x\mid \\bf z)\\) is a distribution parametrized by the outputs of the decoder network. A simple choice is to let the network output a mean and a variance, and to let \\(p\\) be a Normal distribution. In that case, the negative log-probability density reduces to more or less the sum of squared errors. 

The problem is that this loss doesn't seem to work at all. If you tune your network architecture very carefully and get the hyperparameters just right, you might get some results after a few hundred epochs, but that's in stark contact to using the binary cross-entropy loss, which will converge quickly for most reasonable architectures and hyperparameters. The drawback of the binary cross-entropy is that it doesn't correspond to the negative log probability of a distribution on the unit interval. 
<aside>
It does work for binary data, i.e. data with values 0 <em>or</em> 1. However, for data between 0 and 1, using the cross-entropy breaks the derivation of the VAE.
</aside>

In this blog post, we'll look at two ways of solving the problem.
 1. We can transform the **binary cross-entropy** to the negative logarithm of a probability density. We'll see that this requires us to add a normalizing function, which acts as a regularizer. As far as I can tell, the resulting distribution has not occurred anywhere else before.
 2. Usually, the output of the network is transformed to the \\([0,1]\\) interval by a sigmoid function. Instead of placing the normal distribution on the output of this function, we can place it on the input. This leads to something called a **logit-Normal** distribution. While it has been used before in image VAEs, it seems to be relatively obscure.
 
We'll do some proof-of-concept experiments on MNIST to show that both distributions yield good convergence, even with a 2D latent space. A benefit of the logit-Normal distribution is that it comes with a natural uncertainty parameter (the variance) which allows the network to express which pixels it's most sure about. It's unlikely that a VAE will learn well-calibrated uncertainties without additional tricks, but tricks like Bayesian dropout might help here.

## A birds-eye view of VAEs

This post is not a VAE tutorial, so I'll just give a very brief overview of the basics, to set up the notation. If you want to fill in the gaps, [this lecture](https://youtu.be/0zTkHTk_-6s) gives a step-by-step explanation of the way the VAE is derived.

Let's say we have a dataset \\(X\\) of images. Each image  \\(\\x\\) has \\(\\bc{c}\\) channels, a height of \\(\\rc{h}\\) pixels and a width of \\(\\gc{w}\\) pixels. That is, \\(\\x \\in \\mathbb{R}^{\bc{c}\times \rc{h} \times \gc{w}}\\). We will assume all images in \\(X\\) have the same dimensions.

Our task is to train a **generator network**, a neural network that takes as input a random vector \\(z\\), sampled from a multivariate standard normal distribution, and outputs a distribution on \\(\\mathbb{R}^{\bc{c}\times \rc{h} \times \gc{w}}\\). 

A distribution on such a high dimensional space may sound complicated, but it's usually just a single distribution per dimension. For instance, we can make the network produce a a univariate normal distribution for every channel of every pixel. This distribution should then tell us which values are most likely for that channel of that pixel of the output image. To parametrize such an output distribution, we need two values (a mean \\(\mu\\) and a variance \\(\sigma\\) for each channel of each pixel). In total, this means that our network should produce two tensors \\(\bf \mu\\) and \\(\bf \sigma\\), each with dimensions \\(\bc{c}\times \rc{h} \times \gc{w}\\). 

<aside>
You can also think of \(\bf \mu\) and \(\bf \sigma\) as defining a single multivariate normal distribution on \( \mathbb{R}^{\bc{c}\times \rc{h} \times \gc{w}}\) whose covariance matrix is <em>diagonal</em>.
</aside>

[generator network]

To sample from the network, we first sample a vector \\(\\bf z\\) from a standard  multivariate normal distribution, pass it to the network to compute the mean tensor \\(\bf \mu\\) and the variance tensor \\(\bf \sigma\\), and sample from \\(N(\mu, \sigma)\\) to get an image with dimensions \\(\bc{c}\times \rc{h} \times \gc{w}\\)

<p>The task is to set the weights of the network so that the samples look like those in our dataset. For example, if we have images of human faces, we want to sample images of new human faces from our network. For the VAE we start with the maximum likelihood objective. Call the distribution on \( \mathbb{R}^{\bc{c}\times \rc{h} \times \gc{w}}\), as defined by our network \(p_\theta\) where \(\theta\) represents the network weights. Then we want too choose those weights that maximize the (log) probability the data:
$$\sum_{\x \in X}\ln p_\theta(\x)$$
</p>

<p>The problem is that our network doesn't compute \(p_\theta(\x)\), it computes \(p_\theta(\x\mid {\bf z})\). This is the only probability density function that we can compute efficiently. In order to approximate \(p_\theta(\x)\), we need to know which \(z\) are most likely to be responsible for \(x\); which inputs to our network are most likely to lead to a particular output. The true value \(p_\theta({\bf z} \mid \x)\) is not tractable, so we introduce a second network \(\rc{q}_\phi\), which we train to approximate it.
</p>

<p>Whatever function we choose for \(\rc{q}_\phi\), we can show that the following holds
$$ \ln \gc{p}_\theta(x) = L(\gc{p}, \rc{q}) + KL(\rc{q}({\bf z}\mid \x), \gc{p}({\bf z}\mid \x)) \text{.}$$
The second term, the KL divergence between \(\gc{p}({\bf z}\mid \x))\) and its approximation \(\rc{p}({\bf z}\mid \x))\), indicates the quality of our approximation (the lower the KL divergence the better). The first term \(L(p, q)\) captures whatever is left over. It is called the <em>evidence lower bound</em> or ELBO. The KL term is difficult to compute, but since the KL divergence is always non-negative, we can just optimize the weights to make the ELBO as large as possible. Since it's a lower bound to the the likelihood, we will be maximizing the likelihood indirectly, when we maximize the ELBO.
</p>

<p> With a little rewriting, we can express the evidence lower bound as follows
$$L(\gc{p}, \rc{q}) = KL(\rc{q}_\phi({\bf z}\mid \x), N(0, I)) + \ln \gc{p}_\theta(\x \mid {\bf z}')$$
</p>

Where \\({\bf z}'\\) is a sample from the distribution produces by \\(\rc{q}\\). This is our maximization objective (if your framework requires a loss function, just minimize \\(-L\\)

The first term (another KL divergence) indicates how far the distribution on the latent space diverges from a standard normal distribution. It functions as a kind of regularizer pulling \\(\rc{q}\\)'s output toward the standard normal distribution.

<p>The second term is what we're interested in here:
$$\ln \gc{p}_\theta(\x \mid {\bf z}') \text{.}$$
This is know as the <em>reconstruction loss</em>. It is simply the likelihood of the data under the distribution produced by our generator network. To fill in the specifics of this term, we need to decide what distribution our network outputs. 
</p>

## The reconstruction loss

### From a normal distribution

<p>Let's start with the example we used above: if the generator produced a mean and variance over each pixel, the likelihood is defined by a multivariate normal distribution. Let \(\mu\) and \(\sigma\) be the parameter tensors produced by the generator for input \(\bf z\). Then, filling in the definition of the multivariate normal distribution, and accumulating any constants into a term \(\kc{c}\), we get (after a little scribbling)
$$\begin{align*}
\ln \gc{p}(x \mid {\bf z}) &= \ln N(\x \mid \oc{\mu}, \bc{\sigma}) \\
&= \kc{c} - \frac{1}{2} \sum_i \ln \bc{\sigma}_i - \frac{1}{\bc{\sigma}_i}(x_i - \oc{\mu}_i)^2 
\end{align*}$$
where \(i\) iterates over all pixels and channels. That is, we are optimizing the squared error, moderated by a variance per dimension. The constant term \(\kc{c}\) does not affect optimization, so we can ignore it.
</p>

<p>If we simplify things by setting a fixed, scalar variance \(\bc{\sigma}\) for all dimensions, we retrieve something very close to the sum of squared errors objective:
$$
\ln \gc{p}(\x \mid \z) = \kc{c} -  \frac{1}{2\bc{\sigma}} \sum_i (x_i - \oc{\mu}_i)^2 \text{.}
$$
This is no surprise; it's well known that squared errors minimization follows from an assumption of <a href="https://youtu.be/ZIX7PZgz4qs?t=1694">normally distributed errors</a>. However, one thing is different from what we normally do: we cannot just get rid of the constant multiplier \(\frac{1}{\bc{\sigma}}\). </p>

<p>Why not? Because this is only <em>part of our loss function</em>. We will add the KL loss to this term, and \(\bc{\sigma}\) will determine the balance between the two objectives. Since the KL term and the reconstruction loss tend to pull in opposite directions, balancing the two is important. The smaller we set \(sigma\), the more certain we expect the generator to be about its output, and the less we end up caring about the KL loss (and hence about the layout of the latent space).</p>

<aside>
The factor $\frac{1}{\bc{\sigma}}$ performs essentially the same function the \(\beta\) hyperparameter does in the \(\beta\)-VAE.
</aside>

### Abolute error loss

<p>It's commonly accepted in computer vision circles that for image generation, the absolute distance between the output of a generator and the target makes a better loss function than the the squared errors. So in our case, this suggests that
$$\sum_i |x_i - \oc{\mu}_i|$$
makes a better reconstruction loss than 
$$\sum_i (x_i - \oc{\mu}_i)^2 \text{.}$$
Can we work backwards, and find an output distribution so that \(\ln p_\theta(\x \mid \z)\) rewrites to the absolute loss?
</p>

<p>
As it turns out, yes. The <em>Laplace distribution</em>, which looks like a normal distribution with slightly fatter tails and a sharp peak instead of a bell. It's mulitvariate form is complex, but if we simply interpret each dimension as an independent univariate distribution, we get
$$\begin{align*}
\text{ln } \gc{p}2_\theta(\x\mid \z) &= \text{ln} \prod_i \frac{1}{2\bc{b}} \text{exp } \left(- \frac{|x_i - \oc{\mu}_i|}{\bc{b}}\right) \\
&= \kc{c} - \frac{1}{\bc{b}}\sum_i |x_i - \oc{\mu}_i|
\end{align*}$$
where \(\oc{\mu}\) and \(\bc{b}\) are parameters analogous to the mean and variance in the normal distribution.
</p>

## The binary cross-entropy distribution

<p>Finally, there is the <em>binary cross-entropy loss</em>, the main topic of this post. If we have two distributions \(t\) and \(\gc{p}\) on a set of two outcomes \(\{0, 1\}\), then the binary cross-entropy between them is defined as 
$$H(t, \gc{p}) = - t(0) \text{ln } \gc{p}(0) - t(1) \text{ln } \gc{p}(1)$$
(see <a href="https://youtu.be/k0_56JyYaOM?t=4504">here</a> for some intuition).</p>

<p>The binary cross-entropy makes the most sense in combination with a VAE when our target has binary values. Imagine, for instance, and image whose pixels all have the values 0 or 1. In that case, we can define a ditribution \(t\) representing the data: if a particular pixel \(x_i\) has value one, we set \(t(x_i = 1) = 1, t(x_i=0) = 0\) and if the \(x_i\) has value \(0\), we set \(t(x_i = 1) = 0, t(x_i=0) = 1\). For the output of our model, we allow \(\gc{p}(x_i = 0)\)  and \(\gc{p}(x_i = 1)\) to range between 0 and 1, so that the model can express some uncertainty. That is, our output becomes a <em>Bernoulli</em> distribution.</p>

<p>Setting the model up this way, the binary cross-entropy between the model's output distribution and the target, becomes the log probability of the Bernoulli distribution:
$$\text{ln } p_\theta(\x\mid \z) = \sum_i \text{ln } p_\theta(x_i = t_i)$$
where \(p_\theta(x_i = t_i)\) represents the probability that the model assigns to the correct value.
</p>

<p>The problem is that usually, our images <em>aren't</em> binary-valued. Their values range between 0 and 1, so for the model to make sense technically, \(\gc{p}\) must produce a continuous distribution (ideally on the interval [0,1]), and not a discrete distribution on only the outcomes 0 or 1. Note that, we can still apply the cross-entropy function when faced with non-binary data, but it doesn't reduce to the log probability in the same way.
</p>

<p>The first published VAE experiments were performed on binary images (binarized MNIST). so they could correctly use cross-entropy as a reconstruction loss in this fashion. This is probably why many image VAEs afterwards, also used the binary cross entropy for their reconstruction loss, even though the use didn't seem technically justified.</p>

<p>The problem here was not that the VAEs were technically unsound, the problem was that the binary cross-entropy turns out to work much better than the absolute error or the squared errors. It converges quicker, yields a nicer latent space, and provides much sharper reconstructions. In other words, we <em>want</em> to use the binary cross-entropy loss, but in general, it is seen as not quite technically sound.</p>

<p>Which brings me (finally) to the main point of this blog post. We can do the same thing with the BCE that we did with the absolute errors: start with the loss function we <em>want</em> and work backwards to a continuous probability distribution.</p>

<p>Let's assume that this is possible and that our (univariate) distribution has one parameter \(\oc{\alpha}\). Our generator network \(\gc{p\}\) outputs one such \(\oc{\alpha}_i\) for each dimension \(i\) in our output space, which results in a distribution on the interval \([0, 1]\). Moreover, the log-probability of that distribution has the same functional form, as the binary cross-entropy. In an equation, we are looking for a distribution B paramatrized by \(\oc{\alpha}\) such that 
$$ \text{ln } B'(x \mid \oc{\alpha}) =\kc{c} - x \text{ln } \oc{\alpha} - x' \text{ln } \oc{\alpha}'  $$
where \(x' = 1-x\).
</p>

<p>Rewriting to remove the logarithms, we get 
$$
\begin{align*}
B'(x\mid \alpha) &= \text{exp} (- x \text{ln } \alpha) \text{exp}(x' \text{ln } \alpha') \\
&=  e^{- x \text{ln } \alpha} e^{- x' \text{ln } \alpha'} \\
&= \alpha^{-x} \alpha'^{-x'}
\end{align*}
$$
</p>

<p>This looks a lot like an instance of the Beta distribution, except the parameter and the argument are switched. It's also not a distribution yet, because it isn't <em>normalized</em>. That is, the area under the curve doesn't sum to one over the domain \([0, 1]\). To normalize it, we need to divide by some value $z_\oc{\alpha}$: the area under the curve between 0 and 1. This is well beyond my integration skills, but <a href="https://www.wolframcloud.com/obj/a2cf9adb-6ea0-4ae6-9d0f-b5e1a6d16ba7">Mathematica provides quite a neat solution</a>:
$$
z_\oc{\alpha} = \frac{1-2\oc{\alpha}}{2\;\text{atanh }(1-2\oc{\alpha})} = - \frac{1-2\oc{\alpha}}{\text{ln }\left (\frac{1}{\oc{\alpha}} - 1\right )}
$$
which gives us a proper probability density function
$$
B(x\mid \oc{\alpha}) = \frac{1}{z_\oc{\alpha}}\oc{\alpha}^{-x} \oc{\alpha}'^{-x'} \text{ .}
$$
Taking the logarithm, we get the following loss function
$$
\begin{align*}
\text{ln } B(x \mid \oc{\alpha}) =& -x \text{ln } \oc{\alpha} - x' \text{ln } \oc{\alpha}' -  \text{ln } z_\oc{\alpha} \\
=& -x \text{ln } \oc{\alpha} - x' \text{ln } \oc{\alpha}' -  \text{ln } (1-2\oc{\alpha})\\
&+ \text{ln } (2\;\text{atanh }(1-2\oc{\alpha}))\\
\end{align*}
$$


</p>



## Appendix