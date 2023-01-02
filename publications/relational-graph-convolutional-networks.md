---
title: Modeling Relational Data with Graph Convolutional Networks
D3: true
script: rel
parent: publications

---

<header>
<h1> Modeling Relational Data with Graph Convolutional Networks</h1>
<span class="venue">pre-publication</span>
with 
<ul class="authors">
  <li>Michael Schlichtkrull</li>
  <li><a href="https://tkipf.github.io/">Thomas Kipf</li>
  <li><a href="http://www.uva.nl/en/about-the-uva/organisation/staff-members/content/b/e/r.vandenberg2/r.vandenberg2.html">Rianne van den Berg</li>
  <li><a href="http://ivan-titov.org/">Ivan Titov</li>
  <li><a href="https://staff.fnwi.uva.nl/m.welling/">Max Welling</li>
</ul>
</header>

<ul class="links">
	<li><a href="https://arxiv.org/abs/1703.06103">see the pre-print at the arXiv</a>
</li>
</ul>

<aside>
This paper presents a model for learning on <em>relational data</em>. Specifically, we introduce a neural network layer that
allows information to propagate over a <em>knowledge graph</em>. Below is an informal introduction.
</aside>


Machine Learning likes to see the world as a table. Specifically a table where the rows are the things we are trying to learn about (the <em>instances</em>), and the columns different aspects of those things we've measured (the <em>features</em>).

For limited domains, this approach works fine: we can take some people, and measure their age, their gender and their zip code and from these three features try to predict their income. Or we can take a set of grayscale images and take each pixel as a feature, predicting whether the image contains a cat or not.

However the broader our domain, the more heterogeneous our data, the more difficult it becomes to fit it all in one large table. Not for nothing do most companies store their data in a selection of interlinked tables: a relational database. Heterogeneous knowledge in a domain is most naturally expressed as objects, their properties and their relations. Converting such relational knowledge to a single table is a complex process, requiring many ad-hoc preprocessing decisions. Decisions that cannot be reverted or finetuned once the machine learning has started.    

A better option would be to design a model that consumes a natural representation for relational data, a format that describes objects, relations and properties in a straightforward way, and finds intermediate feature-based representations itself: and end-to-end model, starting with data in a relational representation, and finishing with the target values.

The natural choice for that format is a <em>knowledge graph</em>: a multigraph with nodes representing objects and properties, and edges representing relations. Here is an example:

<figure class="wide first">

</figure>

Notice how naturally this  represents <em>knowledge</em>: we simply have a collection of objects of different types, and we can draw arrows for different relations. For properties of the objects (names, birthdays, biographies) we can use a special type of node called a literal.




---

Knowledge bases play a crucial role in many applications, for example question answering and information retrieval. Despite the great effort invested in creating and maintaining them, even the largest representatives (e.g., Yago, DBPedia or Wikidata) are highly incomplete. We introduce relational graph convolutional networks (R-GCNs) and apply them to two standard knowledge base completion tasks: link prediction (recovery of missing facts, i.e. subject-predicate-object triples) and entity classification (recovery of missing attributes of entities). R-GCNs are a generalization of graph convolutional networks, a recent class of neural networks operating on graphs, and are developed specifically to deal with highly multi-relational data, characteristic of realistic knowledge bases. Our methods achieve competitive results on standard benchmarks for both tasks.