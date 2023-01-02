---
title: "kgbench: A Collection of Knowledge Graph Datasets for Evaluating Relational and Multimodal Machine Learning"
article: true
parent: publications

---

<header>
<h1><code>kgbench</code>: A Collection of Knowledge Graph Datasets for Evaluating Relational and Multimodal Machine Learning</h1>
<span class="venue">Published at ESWC together with 
<ul class="authors">
  <li>Xander Wilcke</li>
  <li>Lucas van Berkel</li>
  <li>and <a href="http://www.victordeboer.com">Victor de Boer</a></li>
</ul></span> 
</header>

<ul class="links">
    <li>2 Nov 2022</li>
	<li>read <a href="https://openreview.net/forum?id=yeK_9wxRDbA">the article</a></li>
	<li>use <a href="https://kgbench.info">the data</a></li>
</ul>

### Abstract

Graph neural networks and other machine learning models offer a promising direction for interpretable machine learning on relational and multimodal data. Until now, however, progress in this area is difficult to gauge. This is primarily due to a limited number of datasets with (a) a high enough number of labeled nodes in the test set for precise measurement of performance, and (b) a rich enough variety of multimodal information to learn from. We introduce a set of new benchmark tasks for node classification on RDF-encoded knowledge graphs. We focus primarily on node classification, since this setting cannot be solved purely by node embedding models. For each dataset, we provide test and validation sets of at least 1 000 instances, with some over 10 000. Each task can be performed in a purely relational manner, or with multimodal information. All datasets are packaged in a CSV format that is easily consumable in any machine learning environment, together with the original source data in RDF and pre-processing code for full provenance. We provide code for loading the data into numpy and pytorch. We compute performance for several baseline models.

