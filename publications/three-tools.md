---
Title: Three tools for practical differential privacy
---

<header>
<h1>Three tools for practical differential privacy</h1>
<span class="venue"><a href="https://ppml-workshop.github.io/ppml/">Privacy Preserving Machine Learning</a> (NeurIPS 2018 workshop)</span>
with 
<ul class="authors">
	  		<li>Koen van der Veen</li>
	  		<li>Ruben Seggers</li>
	  		<li>Giorgio Patrini</li>
</ul>
</header>

<ul class="links">
	<li><a class="article" href="/files/threetools/threetools.pdf">download the article</a></li>
	<li><a class="presentation" href="/files/threetools/threetools.poster.pdf">download the poster (<abbr title="portable document format">PDF</abbr>)</a></li>
</ul>

<aside>
This article was based on the MSc thesis of Koen van der Veen.
</aside>

Differentially private learning on real-world data poses challenges for standard machine learning practice: privacy guarantees are difficult to interpret, hyperparameter
tuning on private data reduces the privacy budget, and ad-hoc privacy attacks are
often required to test model privacy. We introduce three tools to make differentially
private machine learning more practical: 
<ol>
<li>simple sanity checks which can be
carried out in a centralized manner before training,</li> 
<li>an adaptive clipping bound 
to reduce the effective number of tuneable privacy parameters, and </li>
<li>we show
that large-batch training improves model performance.</li>

