---
title: Universal pre-training
parent: publications

---

<header>
<h1>Universal pre-training by iterated random computation</h1>
<span class="venue"><em>pre-print</em></span>
</header>

<ul class="links">
	<li>read <a href="https://arxiv.org/abs/2506.20057">the article</a></li>
<li>
download <a href="/files/KCLondon.2025.pdf">the presentation</a>
</li>
</ul>

A monkey behind a typewriter will produce the collected works of Shakespeare eventually. But what if we put a monkey behind a computer? 

<figure class="wide">
	<img  src="/images/up/scaling-tests.svg"/>

<figcaption>
<p>Zero-shot performance on various datasets as universal pretraining progresses (evaluated at every 100 000 pre-training instances). Note that this performance is without the model ever seeing the data except for the small amount encountered in the context.</p>
</figcaption>
</figure>

The monkey behind a typewriter needs to be lucky enough to type all characters of all of Shakespeare correctly. The monkey behind the computer only needs to be lucky enough to type a _program_ for Shakespeare. Since human language contains a lot of structure, such a program will be much shorter than the collected works themselves, so the second monkey will get there faster, 

This suggests that if we pass random noise through a random computation, we enrich it. We make it more likely for interesting structures to appear. This means that such data could be useful for pre-training: we sample a random computer program and pass random noise through it and we pre-train a large machine learning model on the output. Then we see how well the model does on real-world data afterwards, whether by in-ontext learning or by finetuning.

This may seem like a violation of the No-Free-Lunch principle: how can we pretrain before we know what the task is? Wouldn't that suggest that there's some universal way of pre-training. The answer is that this kind of pretraining isn't universal over all tasks, but it is universal over all tasks that emerge from a mixture of computationa and randomness. Since this covers all data that we are likely to encounter in machine learning, the term universal is still suitable. 

In this paper, we first approach this idea theoretically, and show various things:
* The approach is an approximation to Solomonoff induction (which was earlier used for pre-training in [1]). We build a different approximation framework in the basis of model classes.
* Iterating the approach, pass the sampled output through another random computation enriches the data further.
* We can implement this approach with LSTMs and ensure that the iteration converges to the universal distribution. 

We then test the approach experimentally by pretraining a transformer model and show that on a range of synthetic and real-world datasets the model outperforms a random baseline by zero-shot in-context learning. Moreover, on several real-world datasets, the model beats a strong in-context Markov model.



## References

[1] Grau-Moya, J., Genewein, T., Hutter, M., Orseau, L., Delétang, G., Catt, E., ... & Veness, J. (2024). Learning universal predictors. arXiv preprint arXiv:2401.14953.


