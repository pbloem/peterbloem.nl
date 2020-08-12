---
Title: A friendly introduction to Principal Component Analysis
Date: 31-01-2020
Math: true
Code: true
---

<header>
<h1>A friendly introduction to PCA</h1>
<div class="subh1">With explanations of eigenvectors, eigenvalues, and the singular value decomposition</div>
</header>

<ul class="links">
	<li>31 Jan 2020</li>
	<li><a href="https://github.com/pbloem/blog/blob/master/2020/week02/pca.ipynb">notebook on github</a></li>
</ul>

<aside>
Principal component analysis (PCA) is probably the most magical linear method in data science. Unfortunately, while it's always good to have a sense of wonder about mathematics, if a method seems too magical it usually means that there is something left to understand. After years of almost, but not quite fully understanding these methods, here is my attempt to explain it fully (hopefully leaving some of the magic intact).
</aside>

We will work from the outside in: we start with an explanation of PCA formulated as a intuitive _optimization problem_, which can be solved by any standard optimization method (for instance gradient descent). We will then deal with how to compute a solution to PCA _efficiently_: this is where the **spectral theorem**, **the eigendecomposition**, and the **singular value decomposition** come in to the story.

## Principal Component Analysis

Let's begin by setting up some basic notation. We are faced with some high-dimensional dataset of examples described with real-valued features. That is, we have \\(n\\) _examples_ \\(x_i\\) and each example is described by a vector of \\(d\\) real values. We describe the dataset as a whole as an \\(n \times d\\) matrix \\(\X\\); that is, we arrange the examples as rows, and the features as columns.

[Image of dataset]

As a running example, we'll use a dataset of grayscale images of faces. Specifically, we will use the Olivetti dataset [1]. Here is a small sample:

<figure class="narrow">
<img src="/files/pca/faces.png" />
</figure>

Each pixel will be a feature with a value between 0 (black) and 1 (white). The images are \\(64 \times 64\\) pixels, so each image can be described as a single vector of \\(4096\\) real values. Note that by flattening the images into vectors we are entirely ignoring the grid structure of the features: we are not telling our algorithm whether two pixels are right next to each other, or at opposite ends of the image.

The Olivetti data contains \\(400\\) images, so we end up with a data matrix \\(\X\\) of 
\\(400 \times 4096\\). 

This is a data scientist's worst nightmare: data with many more features than examples. With so many features, the space of possible examples is vast, and we only have a tiny number to learn from. Our saving grace is that the features in this dataset are highly _dependent_: knowing the value of one pixel allows us to say a lot about the value of other pixels. For instance, if there's an eye in the right side of the image, there's likely to be a very similar-looking eye in the left side.

To put it differently, there are some high-level semantic properties to our examples, that determine the likely values for several pixels at a time. For instance, whether the subject is smiling or not has a strong influence on many pixels in the lower half of the image. Whether the subject is male of female affects determines the pixels around the mouth, the eyes, the hair and the outline of the face. 

- Correlated features

- Dimensionality reduction

- New representation (by linear transformation) which minimizes reconstruction loss.

## Minimizing reconstruction loss is maximizing variance.

- Minimizing error is maximizing variance
- Setting the unit to the data variance achieves this
- ...
- Expressing the normal distribution as a linear transformation


## 



##




##


## References

[1] Olivetti data


