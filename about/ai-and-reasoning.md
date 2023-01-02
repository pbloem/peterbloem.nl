---
title: AI and reasoning
article: true
parent: about
---

# AI and reasoning


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
