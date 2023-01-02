---
title: Machine learning and information theory
article: true
parent: about

---

# Machine learning and algorithmic information theory

Information theory is widely used in machine learning. Every time you build a classifier, odds are that you train it by some sort of entropy-based loss, directly or indirectly.

A connection that hasn't been quite so throoughly established is that between machine learning and _algorithmic_ information theory. That is, the branch of information theory that has given us concepts like Kolmogorov complexity, and algorithmic statistics.

This is the topic that most of [my PhD thesis](/publications/thesis) was about. Most of it deals with learning, directly or indirectly, but always learning in a sort of platonic domain, using unbounded computation, turning one bitstring into another. While I was working on these topics in my PhD, it all seemd very far removed from the algorithms then available to us. 

At the same time, however, _deep learning_ was beginning to emerge. And while deep learning may not allow us unbounded computation, it does provide us, for more ore less the first time with model classes that can naturally expand _towards_ unbounded computation. We can now approximate what happens when you let a learning grow, and we are beginning to see some of the scaling effects that take place.

In this new world of machine learning, I expect there is a new place for computable approximations to things like [Kolmogorov complexity](/publications/safe-approximation), logical depth and [model sophistication](/publications/two-problems).

I don't have much to show yet for this particular research direction, but watch this space.
