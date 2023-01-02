---
title: Probing the representations of named entities in Transformer-based Language Models
article: true
parent: publications
---

<header>
<h1>Probing the representations of named entities in Transformer-based Language Models</h1>
<span class="venue">Published at <a href="https://blackboxnlp.github.io/">Black Box NLP</a> together with 
<ul class="authors">
  <li><a href="https://sfschouten.github.io/">Stefan F. Schouten</a> (first author)</li>
  <li>and <a href="https://vossen.info/">Piek Vossen</a></li>
</ul></span> 
</header>

<ul class="links">
    <li>8 Dec 2022</li>
	<li>read <a href="probing-transformers.pdf">the article</a></li>
</ul>

### Abstract

In this work we analyze the named entity representations learned by Transformer-based language models. We investigate the role entities play in two tasks: a language modeling task, and a sequence classification task. For this purpose we collect a novel news topic classification dataset with 12 topics called RefNews-12. We perform two complementary methods of analysis. First, we use diagnostic models allowing us to quantify to what degree entity information is present in the hidden representations. Second, we perform entity mention substitution to measure how substitute-entities with different properties impact model performance. By controlling for model uncertainty we are able to show that entities are identified, and depending on the task, play a measurable role in the model’s predictions. Additionally, we show that the entities’ types alone are not enough to account for this. Finally, we find that the the frequency with which entities occur are important for the masked language modeling task, and that the entities’ distributions over topics are important for topic classification.