---
title: The knowledge graph as the default data model for learning on heterogeneous knowledge
parent: publications

---

<header>
<h1>The knowledge graph as the default data model for learning on heterogeneous knowledge</h1>
<span class="venue">Published in <a href="https://datasciencehub.net/">Data Science</a></span>
with 
<ul class="authors">
  <li>Xander Wilcke</li>
  <li>and <a href="http://www.victordeboer.com/">Victor de Boer</a></li>
</ul>
</header>

<ul class="links">
	<li><a class="article" href="https://datasciencehub.net/paper/knowledge-graph-default-data-model-machine-learning-0">download the article</a></li>
	<li><a class="presentation" href="/files/aaa.poster.web.pdf">download the poster (<abbr title="portable document format">PDF</abbr>)</a></li>
</ul>

In modern machine learning, raw data is the preferred input for our models. Where a decade ago data scientists were still engineering features, manually picking out the details they thought salient, they now prefer the data in their raw form. As long as we can assume that all relevant and irrelevant information is present in the input data, we can design deep models that build up intermediate representations to sift out relevant features. However, these models are often domain specific and tailored to the task at hand, and therefore unsuited for learning on heterogeneous knowledge: information of different types and from different domains. If we can develop methods that operate on this form of knowledge, we can dispense with a great deal of ad-hoc feature engineering and train deep models end-to-end in many more domains. To accomplish this, we first need a data model capable of expressing heterogeneous knowledge naturally in various domains, in as usable a form as possible, and satisfying as many use cases as possible. In this position paper, we argue that the knowledge graph is a suitable candidate for this data model. This paper describes current research and discusses some of the promises and challenges of this approach.