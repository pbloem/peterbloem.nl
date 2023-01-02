---
title: AI and reasoning
article: true
parent: about
---

## Machine learning on knowledge graphs

A slightly less philosophical question is _How do we take this relational knowledge that we have&mdash;in knowledge graphs and relational databases, and scattered about on the internet&mdash;and use it in machine learning contexts?_

One popular model for this task is the relational graph convolutional network, or R-GCN. I played a small part in [the original paper](/publications/relational-graph-convolutional-networks), and we recently wrote [a follow-up](/publications/rgcns-closer-look) that reproduces the original, and tries to epxlain the basic principles more clearly.

A particularly promising line of research combines relational data with _multimodal data_. In a multimodal knowledge graph we can express subsymbolic and relational knowledge in one well-defined framework, potentially allowing ML models to learn hands-free on everythign we know in a domain. We wrote a [position paper on this idea](/publications/the-knowledge-graph-as-the-default). We have several researchers currently working on this direction. Most recently we've published [a benchmark set of knowledge graphs](/publications/kgbench) for evaluating this exact task (as well as relational node classification in general).
