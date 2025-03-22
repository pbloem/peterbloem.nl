---
Title: About me
article: true
---

# About me

I'm an assistant professor at the [Learning and reasoning group](https://lr.cs.vu.nl/) at the Vrije Universiteit Amsterdam. I specialize in the combination of Machine Learning and Knowledge Representation.

I have a fairly unfocused set of research interests, although I try to stick to general AI and machine learning related topics. My MSs thesis, way back when, was about [the application of fractal geometry to the problems of machine learning](/publications/msc-thesis). 

My [PhD thesis](/publications/thesis) dealt with the problems of [computable approximations to Kolmogorov complexity](/publications/safe-approximation), [seperating structure from noise in an objective manner](/two-problems) and, more practically, [finding meaningful subnetworks in large graphs](/publications/compression-for-motifs) using the principle of minimum description length. 

Since then, I have focused more on machine learning. See below for some of my current research directions.

# Topics of interest

## AI and reasoning

Machine learning has made some serious leaps in recent years. At the time of writing models like GPT and DALL·E are capable of things we wouldn't have dreamed of suggesting when I started out in AI.

However, with every new leap there are certain limitations that become ever more clear. Ask and image generator to draw you a bowl with three bananas and no oranges, and you'll certainly get a fruitbowl. But whether you get exactly three banasas, and whether its really managed to draw no oranges is a mostly a toss up.

This is, loosely interpreted, a form of _relational reasoning_. Breaking the world up into discrete objects, and using clear, certain knowledge about the relations between them. It seems that even with models trained at massive scales, this is not a property that simply emerges.

<aside>Perhaps it will at even larger scales. We've thought this about other abilities before. Still, such scales would be very unwieldy, so it still pays to understand such behaviors at a more down-to-earth level.
</aside>

This is the fundamental theme of the Learning and reasoning group. It leads to questions like
<ul>
<li>How can we instill models with a greater inductive bias towards relational reasoning?</li>
<li>How do we take the relational knowledge that we already have, and use it to help models learn more effectively?</li>
<li>Can we look at what models have learned, and extract it in relational terms?</li>
</ul>

One question that I'm particularly interested in is how do we allow models to learn their own registration of the world&mdash;that is, their own division of the world in to objects and their relations&mdash;and yet guide them with the relational knowledge that we have for our shared registration of the world. This is after all, how we do it ourselves. We learn our own understanding of the world, but we also map this directly to the meanings of the words that our parents use to help us learn.

This is a relatively recent direction. [Here is a presentation](/files/registrations.pdf) that explains it in more detail. We have also recently published [a paper at the Black Box NLP workshop at EMNLP](/publications/probing-transformers), that was partly inspired by this question.

## Machine learning on knowledge graphs

A slightly less philosophical question is _How do we take this relational knowledge that we have&mdash;in knowledge graphs and relational databases, and scattered about on the internet&mdash;and use it in machine learning contexts?_

One popular model for this task is the relational graph convolutional network, or R-GCN. I played a small part in [the original paper](/publications/relational-graph-convolutional-networks), and we recently wrote [a follow-up](/publications/rgcns-closer-look) that reproduces the original, and tries to epxlain the basic principles more clearly.

A particularly promising line of research combines relational data with _multimodal data_. In a multimodal knowledge graph we can express subsymbolic and relational knowledge in one well-defined framework, potentially allowing ML models to learn hands-free on everythign we know in a domain. We wrote a [position paper on this idea](/publications/the-knowledge-graph-as-the-default). We have several researchers currently working on this direction. Most recently we've published [a benchmark set of knowledge graphs](/publications/kgbench) for evaluating this exact task (as well as relational node classification in general).

## Machine learning and information theory



# Miscellaneous

* I wrote some oblique strategy cards for academia once. You can find them [here](oblique.tips), or [on twitter](https://twitter.com/obliquademia). 
* In my spare time, I occasionally try my hand at writing short stories. It's mostly high-concept science fiction and some flash fiction. You can find them at [profane-tmesis.info](https://profane-tmesis.info).
* I also occasionally draw. You can find a selection of my drawings and illustrations at [unrefined.info](https://unrefined.info/).

