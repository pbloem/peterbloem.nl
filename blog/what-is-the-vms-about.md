---
title: What is the Voynich Manuscript about?
date: 02-09-2017
math: true
jquery: true
script: what-is-the-vms-about
---

<header>
<h1>What is the Voynich Manuscript about?</h1>

</header>

This is the _Voynich Manuscript_:

<figure class="wide">
	<img src="/files/vms/tile1.jpg" class="tile"
	/><img src="/files/vms/tile2.jpg" class="tile"
	/><img src="/files/vms/tile3.jpg" class="tile"/>
</figure>	
	
It consists of a little over two hundred pages of vellum, covered in an unknown script. Most pages are richly illustrated with non-existent plants, astronomical diagrams and little bathing women. After at least a hundred years of research, the current state of knowledge of the VMs can best be summed up as follows: we don't know. We don't what it is and we don't know what it says. We know it was probably written in the 15th century, and that it's probably from Italy, but that's about it. It could be a coded text, it could be a dead or invented language. It could well be a hoax: somebody trying to make some money from an old stock of vellum by filling with enticing scribbles and trying to flog it to some gullible academic.

Given that we know so little, it seems a little presumptuous to ask what it's about. Surely we would need to translate the thing first. Well, perhaps not.

# Level statistics

In _Level statistics of words: finding keywords in literary texts and symbolic sequences_ ([abstract](https://journals.aps.org/pre/abstract/10.1103/PhysRevE.79.035102), [PDF](https://pdfs.semanticscholar.org/4c95/897633779b20191aa53537ef4190287f29e2.pdf)), the authors provide an interesting statistical approach to unsupervised analysis of text that might hold a lot of promise for computational attacks on the VMs.

The approach works as follows. Imagine a book, where every occurrence of a particular words has been highlighted. Consider the distribution of the highlights across the pages. If the word is a common word, like "it" or "the" we will see frequent highlights,in roughly equal numbers on each page. For other words, the number of highlights per page will decrease, but the expected number per page will remain the same. What we are interested in here, is the words for which one page contains a mass of highlights, and two pages on, there are no highlights at all. These are, so goes the theory, the words with high _aboutness_. They are the words that the text&mdash;or at least the section with many highlightsh&mdash;is about.

Think of the book as a line, indicating the continuous string of words, where we mark each occurrence of the word of interest with a colored dot. If the words are spread out randomly, we will see the occurrences of the words spread out relatively evenly along the line. For words with high aboutness, we will see the words clustering together, as if they're particles, attracting each other. Here is an illustration from the paper:

<figure>
<img src="/files/vms/spectrum.png" />
</figure>

The test then simply boils down to computing how unlikely it is to see the given clustering pattern under the assumption that the sequence was produced randomly, or to be more specific under the assumption that the sequence was a sample from a _geometric distribution_. The more unlikely this is, the more aboutness we assign the word. 

Does it work? Here are the top fifteen words for the concatenated _Alice in Wonderland_ and _Alice through the Looking Glass_ (together roughly the same size as the VMs): 

<table class="expandable">
<tr><th>\(C\)</th><th>\(\sigma_\text{nor}\)</th></tr>
<tr><td>knight</td><td>knight</td></tr>
<tr><td>queen</td><td>hatter</td></tr>
<tr><td>king</td><td>mouse</td></tr>
<tr><td>hatter</td><td>caterpillar</td></tr>
<tr><td>he</td><td>kitty</td></tr>
<tr><td>dumpty</td><td>dormouse</td></tr>
<tr><td>mouse</td><td>dumpty</td></tr>
<tr><td>turtle</td><td>kitten</td></tr>
<tr><td>dormouse</td><td>sheep</td></tr>
<tr><td>red</td><td>turtle</td></tr>
<tr><td>humpty</td><td>humpty</td></tr>
<tr><td>mock</td><td>king</td></tr>
<tr><td>caterpillar</td><td>mock</td></tr>
<tr><td>gryphon</td><td>gryphon</td></tr>
<tr><td>she</td><td>red</td></tr>
</table>
\\(C\\) and \\(\sigma_\text{nor}\\) are two slightly different notions of relevance, based on the principle described above. We notice that there are certainly reasonable "subject" words shown. The word "alice" itself, what the book is nominally about, is not shown, and indeed does not get a positive score. This is an important key for interpreting the results: what we are getting is more akin to a list of keywords, than the single subject of the book. Topics that are discussed in specific sections of the book.

For more examples, the authors [provide some results online](http://bioinfo2.ugr.es/TextKeywords/) for various texts from project Gutenberg. 

# Aboutness in the VMs

Why is this such an exciting technique for the VMs? Because all we've used is the large scale structure of the book. Imagine translating _The Hound of the Baskervilles_ to German. The words, of course, would change completely. So would the grammar, and probably the style. But the level statistics, the occurrences, at least of the salient words, would remain largely the same. The word _Hund_ in the German version would occur on different pages, and with a different frequency than the word _Hound_ in the English, but the basic clustering behavior would remain the same. So, even if we can't read German, we can at least get a reasonable idea for which words have high aboutness.

Cutting to the chase, here are top 50 Voynichese words with the highest aboutness for \\(C\\) and for \\(\sigma_\text{nor}\\):

<table class="expandable">
<tr><th>\(C\)</th><th>\(\sigma_\text{nor}\)</th></tr>
<tr><td>shedy</td><td>cthy</td>                   </tr>
<tr><td>qokeedy	</td><td>qol</td>                 </tr>
<tr><td>qol</td><td>	kchy</td>                 </tr>
<tr><td>qokaiin</td><td>	qokeedy</td>          </tr>
<tr><td>chor</td><td>	cthol</td>                </tr>
<tr><td>cthy</td><td>	*</td>                    </tr>
<tr><td>qokedy</td><td>	chor</td>                 </tr>
<tr><td>chedy</td><td>	shedy</td>                </tr>
<tr><td>qokeey</td><td>	sho</td>                  </tr>
<tr><td>sho</td><td>	shaiin</td>               </tr>
<tr><td>qokai!n</td><td>	qokaiin</td>          </tr>
<tr><td>al</td><td>	okai!n</td>                   </tr>
<tr><td>chol</td><td>	cthor</td>                </tr>
<tr><td>s</td><td>	qokedy</td>                   </tr>
<tr><td>daiin</td><td>	qoteedy</td>              </tr>
<tr><td>okai!n</td><td>	qokchol</td>              </tr>
<tr><td>otedy</td><td>	ctho</td>                 </tr>
<tr><td>lchedy</td><td>	cheo</td>                 </tr>
<tr><td>cthol</td><td>	otai!n</td>               </tr>
<tr><td>qoteedy</td><td>	qotchy</td>           </tr>
<tr><td>otai!n</td><td>	lchedy</td>               </tr>
<tr><td>dy</td><td>	cthar</td>                    </tr>
<tr><td>cheo</td><td>	cheeo</td>                </tr>
<tr><td>qotchy</td><td>	yky</td>                  </tr>
<tr><td>qokar</td><td>	chaiin</td>               </tr>
<tr><td>kchy</td><td>	chan</td>                 </tr>
<tr><td>dai!n</td><td>	chdaiin</td>              </tr>
<tr><td>ol</td><td>	cho</td>                      </tr>
<tr><td>oteedy</td><td>	otedy</td>                </tr>
<tr><td>okeey</td><td>	qodaiin</td>              </tr>
<tr><td>oteey</td><td>	qokai!n</td>              </tr>
<tr><td>dol</td><td>	f</td>                    </tr>
<tr><td>cthor</td><td>	r!aiin</td>               </tr>
<tr><td>qokal</td><td>	dain</td>                 </tr>
<tr><td>dain</td><td>	s</td>                    </tr>
<tr><td>aiin</td><td>	chedy</td>                </tr>
<tr><td>cho</td><td>	qotchor</td>              </tr>
<tr><td>qotedy</td><td>	opchy</td>                </tr>
<tr><td>cheody</td><td>	kchor</td>                </tr>
<tr><td>ar</td><td>	lkchey</td>                   </tr>
<tr><td>chdy</td><td>	qotchol</td>              </tr>
<tr><td>chaiin</td><td>	qokeey</td>               </tr>
<tr><td>chody</td><td>	lkeey</td>                </tr>
<tr><td>shey</td><td>	chom</td>                 </tr>
<tr><td>or</td><td>	oteedy</td>                   </tr>
<tr><td>qotaiin</td><td>	chos</td>             </tr>
<tr><td>okedy</td><td>	ckhy</td>                 </tr>
<tr><td>qokey</td><td>	al</td>                   </tr>
<tr><td>qodaiin</td><td>	ckhey</td>            </tr>
<tr><td>dar</td><td>	qodar</td>                </tr>
</table>

For this experiment, I used the Takahashi EVA transcription. Anything between curly brackets was replaced by a space, and any sequence of multiple special characters (!, *, %) was collapsed into one. 

<aside>
This is a crude way to prepare a VMs corpus. I'm just looking for a large chunk of "typical" running Voynichese. If this method is worth anything, it should be invariant to any details in transcription, omitted sections, and character-level detail. The code is available if anybody wants to try the experiment with a different transcription.
</aside>

What does this tell us? Well not much, but a little. If the VMs is about anything, some paerts are likely about "shedy" and about "qokeedy". More interestingly, note that most of the top words in the Alice example were nouns. That suggests that if these words refer to anything, they probably refer to concepts of some sort. Most of them perhaps _function_ like nouns. Perhaps. I'll finish up with some thoughts on how we can expand on this, but first, let's look at another experiment the authors of this method did.    

# Aboutness at the character level

For their second experiment, the authors removed all whitespace from a book, and performed the analysis for all character strings, up to a particular length. I couldn't reproduce their results with their algorithm as they describe it, but I came up with something that performs similarly. Here are the top substrings for our concatenated Alice, with all whitespace removed:

<table class="level expandable">
<tr><th> </th><th> count </th><th>\(\sigma_\text{norm}\) </th><th> \(C\) </th></tr>
<tr><td> umpty 	</td><td> 106 </td><td>5.46 </td><td> 48.38 </td></tr>
<tr><td> <strong>queen</strong> 	</td><td> 273 </td><td>3.36 </td><td> 39.88 </td></tr>
<tr><td> <strong>mouse</strong> 	</td><td> 86 </td><td>4.69 </td><td> 36.40 </td></tr>
<tr><td> <strong>thered</strong><strong>queen</strong> 	</td><td> 54 </td><td>5.15 </td><td> 33.42 </td></tr>
<tr><td> <strong>the</strong><strong>queen</strong> 	</td><td> 143 </td><td>3.67 </td><td> 33.30 </td></tr>
<tr><td> <strong>knight</strong> 	</td><td> 59 </td><td>4.90 </td><td> 32.64 </td></tr>
<tr><td> <strong>the</strong><strong>hatter</strong> 	</td><td> 52 </td><td>5.08 </td><td> 32.38 </td></tr>
<tr><td> <strong>the</strong><strong>knight</strong> 	</td><td> 41 </td><td>5.02 </td><td> 28.91 </td></tr>
<tr><td> <strong>the</strong>ki 	</td><td> 128 </td><td>3.37 </td><td> 28.07 </td></tr>
<tr><td> humpt 	</td><td> 56 </td><td>4.29 </td><td> 26.98 </td></tr>
<tr><td> tweed<strong>led</strong> 	</td><td> 60 </td><td>4.08 </td><td> 26.00 </td></tr>
<tr><td> <strong>the</strong><strong>king</strong> 	</td><td> 111 </td><td>3.31 </td><td> 25.64 </td></tr>
<tr><td> <strong>the</strong><strong>mouse</strong> 	</td><td> 29 </td><td>4.88 </td><td> 24.37 </td></tr>
<tr><td> <strong>dormouse</strong> 	</td><td> 40 </td><td>4.37 </td><td> 24.04 </td></tr>
<tr><td> dthe<strong>king</strong> 	</td><td> 49 </td><td>3.89 </td><td> 22.40 </td></tr>
<tr><td> <strong>humpty</strong><strong>dumpty</strong> 	</td><td> 53 </td><td>3.78 </td><td> 22.28 </td></tr>
<tr><td> <strong>the</strong><strong>caterpillar</strong> 	</td><td> 26 </td><td>4.48 </td><td> 21.06 </td></tr>
<tr><td> <strong>kitty</strong> 	</td><td> 25 </td><td>4.51 </td><td> 20.92 </td></tr>
<tr><td> <strong>kitten</strong> 	</td><td> 26 </td><td>4.45 </td><td> 20.86 </td></tr>
<tr><td> <strong>the</strong><strong>dormouse</strong> 	</td><td> 35 </td><td>4.08 </td><td> 20.86 </td></tr>
<tr><td> <strong>mock</strong><strong>turtle</strong> 	</td><td> 56 </td><td>3.52 </td><td> 20.68 </td></tr>
</table>

On balance, it seems like most phrases detected start and end at a word boundary, and most complete phrases are indicative of what a local part of the text is about. I've highlighted where phrases start and end with a string that was a word (of more than three characters) in the original text. The highlighting doesn't work perfectly, but it gives a decent impression, which we can use to interpret the VMs results.

"umpty", incidentally, provides a good intuition for where the method fails. The character's name "humpty dumpty" has high aboutness (C=22.28), but _every_ time the string umpty occurs, it then immediately occurs again one character later (even though the string is relatively rare overall). This is such a non-random level of clustering that "umpty" gets a very high C-score.

The character level analysis of the VMs shows some interesting differences:

<table class="level expandable">
<tr><th> </th><th> count </th><th>\(\sigma_\text{norm}\) </th><th> \(C\) </th></tr>
<tr><td> <span>edyqo</span> 	</td><td> 1503 </td><td>4.01 </td><td> 117.28 </td></tr>
<tr><td> <span>hedyqo</span> 	</td><td> 790 </td><td>3.62 </td><td> 74.31 </td></tr>
<tr><td> <span>edy</span><strong>qok</strong> 	</td><td> 965 </td><td>3.33 </td><td> 73.03 </td></tr>
<tr><td> <span></span><strong>chedy</strong> 	</td><td> 1247 </td><td>2.95 </td><td> 69.16 </td></tr>
<tr><td> <span>yq</span><strong>oke</strong> 	</td><td> 1033 </td><td>3.05 </td><td> 66.41 </td></tr>
<tr><td> <span>dyq</span><strong>oke</strong> 	</td><td> 628 </td><td>3.20 </td><td> 55.66 </td></tr>
<tr><td> <span>q</span><strong>okai</strong> 	</td><td> 578 </td><td>2.98 </td><td> 48.12 </td></tr>
<tr><td> <span>edy</span><strong>qol</strong> 	</td><td> 93 </td><td>5.68 </td><td> 47.77 </td></tr>
<tr><td> <span>hedy</span><strong>qok</strong> 	</td><td> 500 </td><td>3.01 </td><td> 45.57 </td></tr>
<tr><td> <span>edyq</span><strong>oke</strong> 	</td><td> 516 </td><td>2.92 </td><td> 44.15 </td></tr>
<tr><td> <span></span><strong>keedy</strong> 	</td><td> 639 </td><td>2.66 </td><td> 42.56 </td></tr>
<tr><td> <span>yqokee</span> 	</td><td> 580 </td><td>2.72 </td><td> 41.86 </td></tr>
<tr><td> <strong>chedy</strong><span>qo</span> 	</td><td> 451 </td><td>2.93 </td><td> 41.70 </td></tr>
<tr><td> <span></span><strong>yqokain</strong> 	</td><td> 211 </td><td>3.78 </td><td> 41.57 </td></tr>
<tr><td> <span></span><strong>shedy</strong> 	</td><td> 658 </td><td>2.57 </td><td> 40.68 </td></tr>
<tr><td> <span>h</span><strong>olcho</strong> 	</td><td> 121 </td><td>4.46 </td><td> 39.93 </td></tr>
<tr><td> <strong>eedy</strong><span>qo</span> 	</td><td> 461 </td><td>2.80 </td><td> 39.15 </td></tr>
<tr><td> <span>eyq</span><strong>oke</strong> 	</td><td> 305 </td><td>3.11 </td><td> 37.69 </td></tr>
<tr><td> <span>y</span><strong>qokeed</strong> 	</td><td> 271 </td><td>3.17 </td><td> 36.57 </td></tr>
<tr><td> <span></span><strong>cheod</strong> 	</td><td> 255 </td><td>3.23 </td><td> 36.53 </td></tr>
<tr><td> <span>edy</span><strong>qot</strong> 	</td><td> 308 </td><td>2.96 </td><td> 35.14 </td></tr>
<tr><td> <strong>kain</strong><span>sh</span> 	</td><td> 114 </td><td>4.11 </td><td> 34.86 </td></tr>
<tr><td> <span>h</span><strong>eody</strong> 	</td><td> 244 </td><td>3.11 </td><td> 33.88 </td></tr>
<tr><td> <strong>eey</strong><span></span><strong>qok</strong> 	</td><td> 270 </td><td>3.00 </td><td> 33.67 </td></tr>
<tr><td> <span>y</span><strong>qokeedy</strong> 	</td><td> 253 </td><td>3.06 </td><td> 33.63 </td></tr>
<tr><td> <strong>aiin</strong><span></span><strong>cth</strong> 	</td><td> 106 </td><td>4.08 </td><td> 33.46 </td></tr>
<tr><td> <span>dyq</span><strong>oka</strong> 	</td><td> 391 </td><td>2.62 </td><td> 32.64 </td></tr>
<tr><td> <span>ch</span><strong>old</strong> 	</td><td> 156 </td><td>3.50 </td><td> 32.43 </td></tr>
<tr><td> <span>hedy</span><strong>qol</strong> 	</td><td> 63 </td><td>4.73 </td><td> 32.09 </td></tr>
<tr><td> <span></span><strong>haiin</strong> 	</td><td> 138 </td><td>3.56 </td><td> 31.42 </td></tr>
<tr><td> <span></span><strong>okcho</strong> 	</td><td> 151 </td><td>3.44 </td><td> 31.20 </td></tr>
<tr><td> <span>edyqokee</span> 	</td><td> 289 </td><td>2.79 </td><td> 31.19 </td></tr>
<tr><td> <strong>shedy</strong><span>qo</span> 	</td><td> 313 </td><td>2.67 </td><td> 30.30 </td></tr>
<tr><td> <span>edyq</span><strong>oka</strong> 	</td><td> 299 </td><td>2.64 </td><td> 29.03 </td></tr>
<tr><td> <strong>eody</strong><span>qo</span> 	</td><td> 151 </td><td>3.20 </td><td> 28.19 </td></tr>
<tr><td> <span>hedyq</span><strong>oke</strong> 	</td><td> 239 </td><td>2.75 </td><td> 27.84 </td></tr>
<tr><td> <span>ch</span><strong>olcho</strong> 	</td><td> 86 </td><td>3.81 </td><td> 27.78 </td></tr>
<tr><td> <span></span><strong>qokedy</strong> 	</td><td> 273 </td><td>2.62 </td><td> 27.39 </td></tr>
<tr><td> <span>h</span><strong>orcho</strong> 	</td><td> 85 </td><td>3.77 </td><td> 27.25 </td></tr>
<tr><td> <span></span><strong>lshed</strong> 	</td><td> 247 </td><td>2.67 </td><td> 27.02 </td></tr>
<tr><td> <span></span><strong>lched</strong> 	</td><td> 418 </td><td>2.29 </td><td> 26.90 </td></tr>
<tr><td> <span></span><strong>odaiin</strong> 	</td><td> 345 </td><td>2.40 </td><td> 26.56 </td></tr>
<tr><td> <strong>eey</strong><span>q</span><strong>oke</strong> 	</td><td> 161 </td><td>3.00 </td><td> 26.40 </td></tr>
<tr><td> <span></span><strong>qokaiin</strong> 	</td><td> 265 </td><td>2.58 </td><td> 26.37 </td></tr>
<tr><td> <strong>daiin</strong><span></span><strong>cth</strong> 	</td><td> 63 </td><td>4.04 </td><td> 26.18 </td></tr>
<tr><td> <strong>chedy</strong><span></span><strong>qok</strong> 	</td><td> 278 </td><td>2.51 </td><td> 25.74 </td></tr>
<tr><td> <strong>kain</strong><span></span><strong>she</strong> 	</td><td> 86 </td><td>3.56 </td><td> 25.35 </td></tr>
<tr><td> <strong>keedy</strong><span>qo</span> 	</td><td> 240 </td><td>2.59 </td><td> 25.31 </td></tr>
<tr><td> <strong>chor</strong><span>c</span> 	</td><td> 183 </td><td>2.80 </td><td> 25.18 </td></tr>
<tr><td> <span>y</span><strong>qokeey</strong> 	</td><td> 233 </td><td>2.60 </td><td> 25.16 </td></tr>
<tr><td> <span></span><strong>dyqokeedy</strong> 	</td><td> 182 </td><td>2.80 </td><td> 25.10 </td></tr>
<tr><td> <strong>eedy</strong><span></span><strong>qok</strong> 	</td><td> 303 </td><td>2.41 </td><td> 25.09 </td></tr>
<tr><td> <span>y</span><strong>qokedy</strong> 	</td><td> 226 </td><td>2.61 </td><td> 24.86 </td></tr>
<tr><td> <span>hedyqokee</span> 	</td><td> 132 </td><td>3.06 </td><td> 24.77 </td></tr>
<tr><td> <span></span><strong>lshedy</strong> 	</td><td> 224 </td><td>2.56 </td><td> 24.01 </td></tr>
<tr><td> <strong>hol</strong><span>dai</span> 	</td><td> 97 </td><td>3.29 </td><td> 23.90 </td></tr>
<tr><td> <span>eyqokee</span> 	</td><td> 186 </td><td>2.69 </td><td> 23.84 </td></tr>
<tr><td> <span>olkai</span> 	</td><td> 169 </td><td>2.73 </td><td> 23.33 </td></tr>
<tr><td> <span>ho</span><strong>lchol</strong> 	</td><td> 63 </td><td>3.68 </td><td> 23.15 </td></tr>
<tr><td> <span>yl</span><strong>che</strong> 	</td><td> 185 </td><td>2.64 </td><td> 23.12 </td></tr>
<tr><td> <strong>okain</strong><span>sh</span> 	</td><td> 78 </td><td>3.43 </td><td> 23.02 </td></tr>
<tr><td> <span></span><strong>lchedy</strong> 	</td><td> 366 </td><td>2.16 </td><td> 22.64 </td></tr>
<tr><td> <span>edyq</span><strong>okai</strong> 	</td><td> 168 </td><td>2.66 </td><td> 22.30 </td></tr>
<tr><td> <span>ch</span><strong>orcho</strong> 	</td><td> 69 </td><td>3.48 </td><td> 22.25 </td></tr>
<tr><td> <span>e</span><strong>dyqokeedy</strong> 	</td><td> 163 </td><td>2.67 </td><td> 22.23 </td></tr>
<tr><td> <span>iin</span><strong>cho</strong> 	</td><td> 223 </td><td>2.44 </td><td> 22.18 </td></tr>
<tr><td> <strong>chod</strong><span>a</span> 	</td><td> 148 </td><td>2.72 </td><td> 21.87 </td></tr>
<tr><td> <span></span><strong>otedy</strong> 	</td><td> 254 </td><td>2.33 </td><td> 21.79 </td></tr>
<tr><td> <strong>tchy</strong><span>c</span> 	</td><td> 43 </td><td>3.96 </td><td> 21.73 </td></tr>
<tr><td> <span>eyq</span><strong>oka</strong> 	</td><td> 181 </td><td>2.53 </td><td> 21.32 </td></tr>
<tr><td> <span>q</span><strong>otch</strong> 	</td><td> 221 </td><td>2.37 </td><td> 20.99 </td></tr>
<tr><td> <strong>shedy</strong><span></span><strong>qok</strong> 	</td><td> 207 </td><td>2.39 </td><td> 20.71 </td></tr>
<tr><td> <strong>chol</strong><span>da</span> 	</td><td> 93 </td><td>3.00 </td><td> 20.54 </td></tr>
<tr><td> <span></span><strong>otcho</strong> 	</td><td> 158 </td><td>2.55 </td><td> 20.35 </td></tr>
<tr><td> <strong>chor</strong><span>d</span> 	</td><td> 65 </td><td>3.32 </td><td> 20.34 </td></tr>
<tr><td> <strong>keedy</strong><span></span><strong>qok</strong> 	</td><td> 167 </td><td>2.51 </td><td> 20.29 </td></tr>
<tr><td> <span>hedyo</span> 	</td><td> 354 </td><td>2.05 </td><td> 20.15 </td></tr>
<tr><td> <span>dy</span><strong>qokedy</strong> 	</td><td> 164 </td><td>2.49 </td><td> 19.90 </td></tr>
<tr><td> <span></span><strong>keody</strong> 	</td><td> 141 </td><td>2.60 </td><td> 19.81 </td></tr>
<tr><td> <span></span><strong>chaiin</strong> 	</td><td> 83 </td><td>3.02 </td><td> 19.70 </td></tr>
<tr><td> <span>or</span><strong>cth</strong> 	</td><td> 52 </td><td>3.44 </td><td> 19.42 </td></tr>
<tr><td> <strong>kain</strong><span>ch</span> 	</td><td> 189 </td><td>2.36 </td><td> 19.31 </td></tr>
<tr><td> <span></span><strong>olched</strong> 	</td><td> 188 </td><td>2.35 </td><td> 19.24 </td></tr>
<tr><td> <strong>eody</strong><span></span><strong>qok</strong> 	</td><td> 92 </td><td>2.88 </td><td> 19.24 </td></tr>
<tr><td> <span>h</span><strong>oldaiin</strong> 	</td><td> 72 </td><td>3.09 </td><td> 19.18 </td></tr>
<tr><td> <span>eodai</span> 	</td><td> 132 </td><td>2.58 </td><td> 19.02 </td></tr>
<tr><td> <strong>aiin</strong><span></span><strong>cho</strong> 	</td><td> 196 </td><td>2.29 </td><td> 18.76 </td></tr>
<tr><td> <span></span><strong>cheody</strong> 	</td><td> 141 </td><td>2.51 </td><td> 18.76 </td></tr>
<tr><td> <strong>chedy</strong><span></span><strong>qol</strong> 	</td><td> 37 </td><td>3.70 </td><td> 18.71 </td></tr>
<tr><td> <strong>keedy</strong><span>q</span><strong>oke</strong> 	</td><td> 98 </td><td>2.75 </td><td> 18.44 </td></tr>
<tr><td> <strong>okeedy</strong><span>qo</span> 	</td><td> 166 </td><td>2.37 </td><td> 18.38 </td></tr>
<tr><td> <span>d</span><strong>ycho</strong> 	</td><td> 191 </td><td>2.28 </td><td> 18.30 </td></tr>
<tr><td> <span></span><strong>lkaiin</strong> 	</td><td> 137 </td><td>2.49 </td><td> 18.21 </td></tr>
<tr><td> <strong>chedy</strong><span>q</span><strong>oke</strong> 	</td><td> 127 </td><td>2.53 </td><td> 18.06 </td></tr>
<tr><td> <strong>eody</strong><span>o</span> 	</td><td> 136 </td><td>2.47 </td><td> 17.98 </td></tr>
<tr><td> <span></span><strong>olshedy</strong> 	</td><td> 107 </td><td>2.64 </td><td> 17.92 </td></tr>
<tr><td> <strong>hor</strong><span>da</span> 	</td><td> 55 </td><td>3.19 </td><td> 17.88 </td></tr>
<tr><td> <strong>ody</strong><span>ch</span> 	</td><td> 203 </td><td>2.21 </td><td> 17.77 </td></tr>
<tr><td> <strong>okain</strong><span></span><strong>she</strong> 	</td><td> 62 </td><td>3.06 </td><td> 17.73 </td></tr>
<tr><td> <strong>shedy</strong><span>q</span><strong>oke</strong> 	</td><td> 101 </td><td>2.66 </td><td> 17.72 </td></tr>
<tr><td> <span>y</span><strong>qokaiin</strong> 	</td><td> 184 </td><td>2.26 </td><td> 17.71 </td></tr>
<tr><td> <span></span><strong>cthol</strong> 	</td><td> 82 </td><td>2.82 </td><td> 17.66 </td></tr>
<tr><td> <span>ey</span><strong>qokeey</strong> 	</td><td> 100 </td><td>2.66 </td><td> 17.62 </td></tr>
<tr><td> <span></span><strong>okeod</strong> 	</td><td> 124 </td><td>2.50 </td><td> 17.62 </td></tr>
<tr><td> <span></span><strong>lshee</strong> 	</td><td> 126 </td><td>2.49 </td><td> 17.60 </td></tr>
<tr><td> <strong>qokedy</strong><span>q</span> 	</td><td> 84 </td><td>2.78 </td><td> 17.49 </td></tr>
<tr><td> <strong>lchedy</strong><span>qo</span> 	</td><td> 137 </td><td>2.42 </td><td> 17.42 </td></tr>
<tr><td> <strong>qokedy</strong><span>qo</span> 	</td><td> 83 </td><td>2.76 </td><td> 17.22 </td></tr>
<tr><td> <span>eyq</span><strong>okai</strong> 	</td><td> 124 </td><td>2.47 </td><td> 17.17 </td></tr>
<tr><td> <strong>keey</strong><span>q</span> 	</td><td> 181 </td><td>2.23 </td><td> 17.14 </td></tr>
<tr><td> <span>in</span><strong>che</strong> 	</td><td> 664 </td><td>1.65 </td><td> 17.09 </td></tr>
<tr><td> <strong>eey</strong><span>qokee</span> 	</td><td> 98 </td><td>2.62 </td><td> 17.02 </td></tr>
<tr><td> <span>edy</span><strong>che</strong> 	</td><td> 255 </td><td>2.03 </td><td> 17.00 </td></tr>
<tr><td> <strong>otchy</strong><span>c</span> 	</td><td> 28 </td><td>3.72 </td><td> 16.97 </td></tr>
<tr><td> <span>h</span><strong>otch</strong> 	</td><td> 53 </td><td>3.10 </td><td> 16.90 </td></tr>
<tr><td> <span>edy</span><strong>qokedy</strong> 	</td><td> 139 </td><td>2.37 </td><td> 16.89 </td></tr>
<tr><td> <strong>aiin</strong><span></span><strong>ctho</strong> 	</td><td> 43 </td><td>3.29 </td><td> 16.88 </td></tr>
<tr><td> <span></span><strong>eeody</strong> 	</td><td> 150 </td><td>2.31 </td><td> 16.82 </td></tr>
<tr><td> <span>ed</span><strong>yqokain</strong> 	</td><td> 86 </td><td>2.69 </td><td> 16.81 </td></tr>
<tr><td> <span>ey</span><strong>lch</strong> 	</td><td> 86 </td><td>2.69 </td><td> 16.81 </td></tr>
<tr><td> <span></span><strong>chody</strong> 	</td><td> 177 </td><td>2.21 </td><td> 16.78 </td></tr>
<tr><td> <strong>cho</strong><span></span><strong>lchol</strong> 	</td><td> 47 </td><td>3.19 </td><td> 16.77 </td></tr>
<tr><td> <span></span><strong>sheod</strong> 	</td><td> 122 </td><td>2.44 </td><td> 16.72 </td></tr>
<tr><td> <span>hokch</span> 	</td><td> 75 </td><td>2.78 </td><td> 16.67 </td></tr>
<tr><td> <strong>eedy</strong><span>qokee</span> 	</td><td> 116 </td><td>2.46 </td><td> 16.56 </td></tr>
<tr><td> <span>n</span><strong>cthy</strong> 	</td><td> 31 </td><td>3.55 </td><td> 16.56 </td></tr>
<tr><td> <span></span><strong>qoteed</strong> 	</td><td> 83 </td><td>2.69 </td><td> 16.50 </td></tr>
<tr><td> <span>hey</span><strong>qok</strong> 	</td><td> 264 </td><td>1.99 </td><td> 16.48 </td></tr>
<tr><td> <span></span><strong>lkain</strong> 	</td><td> 120 </td><td>2.42 </td><td> 16.37 </td></tr>
</table>

There's a lot to note here.

Firstly, the C scores are bigger than any observed in a natural language text of this size. This indicates a much more clustered non-randomness in how substrings occur within the text. It was known already that there was more structure to the VMs text than to natural language, but it's interesting to see that this leads to _more_ clustering. Even if the method by which the text was composed is random, this suggest that strongly non-stationary process. In short, you can tell by the local properties of the text which part of the book you're in (better than you can with a natural language book). If it _is_ generated text, the generator either has a very sophisticated long-term memory, or the author reconfigured the generator between chapters.

Secondly, we are getting a _lot_ more results. In both experiments, I started with the 200 substrings with the highest C score. For any pair \\((s, l)\\) of these, where \\(s\\) contained \\(l\\), I remove \\(l\\) if its score is more than 2.5 below that of \\(s\\), otherwise I remove \\(s\\). I think we can hypothesize that the VMs text is somehow less "transitive" with its substrings than natural language. For instance, if "dormouse" occurs in a clustered way throughout Alice, then we can assume that most of its substrings (ormouse, rmous, dormo), will follow exactly the same pattern. Only a rare few (mouse, use) are words meaning something different, and are likely to show a different clustering pattern. In Voynichese, it seems, a random substring of a specific word, is much less likely to follow the clustering behavior of its superstring. We can see this from the top two entries: "hedyqo" has a high score, but nowhere near as high as its substring "edyqo". In other words "edyqo" occurs many more times, and in many different words than just in "hedyqo" alone.

Quite what the Voynich "words" mean, and what role substrings play in the text is an open question. Hopefully, I'll come back to that in a later post.

# A promising method

Of course, it doesn't do us much good to know that the VMs is about "shedy" if we don't know what that means. But it does paint a promising picture of a more structured approach to cracking the VMs. Let's start by stating our assumptions:

1. The VMs contains, in some form, possibly encoded, meaningful text in natural language (the _plaintext_).
2. The words of the VMS, i.e. strings separated by whitespace, map to plaintext words, phrases, or at least broad concepts.
3. Two occurrences of the same Voynichese word, more likely than not, mean the same thing. 

There are certainly plausible scenarios for these assumptions to be violated, but as assumptions go in Voynich-land, these are pretty light-weight.

Given these assumptions, we know the level statistics are likely to be informative, and we can take the lists above as roughly "correct". But that's not where their usefulness ends. Remember that the words with the highest aboutness _are likely to be nouns_. Similarly, parts of speech like verbs and articles are likely to have very uniform distributions. However noisy, the level statistics, and similar features allow us to make an informed guess about the parts of speech of different Voynich words.

Imagine the following experiment:
* Take a book in language A, and tag the words with a set of simplified POS tags, like {noun, verb, numeral, other}.
* For each word, collect a series of measurements in the vein of level statistics: features that are largely invariant to cross-language translation.
* Train a simple (probabilistic) classifier to classify words by their POS tags
* Take a book in language B, collect the features for each word and use the classifier to tag the words.

Even if we filter everything but the 100 words the classifier is most certain about, it would still provide great insight into the grammatical structure of the VMs. Considering how many cyphers were cracked just by [identifying a single numeral](https://en.wikipedia.org/wiki/Known-plaintext_attack) in the cyphertext, a provisional POS-tagger seems like a great luxury.

# Code and links

The code is available [on GitHub](https://github.com/pbloem/voynich-experiments). It's a weekend project, so it's far from perfect. If you'd like to play around with it, let me know, I'll help you get set up.

Similar work was performed, with different methods, in the article [Keywords and Co-Occurrence Patterns in the Voynich Manuscript: An Information-Theoretic Analysis](http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0066344#pone.0066344-Ortuo1), published in PLOS One in 2013.

 




