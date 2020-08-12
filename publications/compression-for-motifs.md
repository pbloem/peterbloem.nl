---
Title: Finding Network Motifs in Large Graphs using Compression as a Measure of Relevance
---

<header>
<h1>Finding Network Motifs in Large Graphs using Compression as a Measure of Relevance</h1>
<span class="venue">Under submission</span>
with 
<ul class="authors">
  <li>Steven de Rooij</li>
</ul>
</header>

<a href="https://arxiv.org/abs/1701.02026">see the pre-print at the arXiv</a>

We introduce a new learning method for network motifs: interesting or informative subgraph patterns in a network. Current methods for finding motifs rely on the frequency of the motif: specifically, subgraphs are motifs when their frequency in the data is high compared to the expected frequency under a null model. To compute this expectation, the search for motifs is normally repeated on as many as 1000 random graphs sampled from the null model, a prohibitively expensive step. We use ideas from the Minimum Description Length (MDL) literature to define a new measure of motif relevance. This has several advantages: the subgraph count on samples from the null model can be eliminated, and the search for motif candidates within the data itself can be greatly simplified. Our method allows motif analysis to scale to networks with billions of links, provided that a fast null model is used.

