---
title: Constrained optimization, a metaphor
---

If you spend some time with people who do technical jobs---programmers, academics, probably lawyers and accountants too---you may notice that they often use technical concepts for the things they do in everyday life. Here's [an example](https://x.com/karpathy/status/1877102757464719652):

![A tweet from Andrej Karpathy. It reads Something I've been trying recently: wake up and go directly to work. Do not check anything no messages, no emails, no news, no nothing. There's something destructive / distracting about checking the outside world that I don't fully understand. It loads my RAM with a ton of distractors and my attention can't focus properly and fully on the highest priority work item. After a few hours, get lunch and optionally gather world state.](/images/karpathy.png)

To be honest, the reference to RAM comes across as a bit dorky. It doesn't really add much beyond just saying "my brain" or "my mind", and the metaphor doesn't really work that well since we're talking primarily about short-term memory here which works very differently. The slightly more obscure references to _attention_ and _world state_ work better for me: they are more accurate technical metaphors and they refer to things that are hard to express in a crisp way.

Here is another example, from ...
<blockquote>“I think that issue is entirely orthogonal to the issue here,” he said. The word is a math term meaning things are perpendicular or at right angles, but Friedman used it to mean that two propositions are irrelevant, the BLT says.

That got the attention of Chief Justice John G. Roberts Jr. “I’m sorry. Entirely what?” he said.

“Orthogonal,” Friedman replied. “Right angle. Unrelated. Irrelevant.”

Friedman tried to continue, but Justice Antonin Scalia jumped in. “What was that adjective? I liked that,” he said.

“I think we should use that in the opinion,” Scalia later added. “Or the dissent,” said Roberts.
</blockquote>
 If you spend enough time around people with a mathematical background, you will encounter this yourself. We will say that two issues are _orthogonal_ to indicate that what we do about one shouldn't affect what we do about the other. We should treat them as separate concerns.

You may roll your eyes at this and think that this is just what nerds do to make themselves sound more interesting than they are. But technical metaphos like these can be very helpful tools in communicating difficult concepts. When talking to my perpetually overloaded co-workers, I often check what their _bandwidth_ is for taking on new tasks. This is eminently helpful. Nobody needs to complain about being so busy, and fear coming off as whiny. It's a simple practical way of acknowledging that you can only do so many things at the same time, and of indicating what your current state is.

Once you start paying attention to it, you'll notice that technical metaphors are everywhere. They usually start as little in-jokes between people of a geeky persuasion, but those that prove useful quickly spread to the wider population, and get adopted by people who probably don't have a particularly solid understanding of the original concept. 

<aside>Of course, there is far greater traffic in the opposite direction: everyday items used as metaphors for technically complex ones. Folders, trees, mounting, desktops and so on. There barely a part of a computer that isn't named after some more familiar concept already in use. Some even go back and forth. Broadcasting used to describe the way a farmer might scatter their seeds. It was then adopted as a technnological term, and is now occasionally used as a metpahor for people whose interpersonal communication is a little one-way. 
</aside>

## Constrained optimization

That overlong introduction was just to excuse what I'd like to do here: to discuss a new technical metaphor that I've found quite helpful in dealing with complex questions. The concept is that of constrained optimization. Let's start, for the uninitiated, with what that means non-metaphorically.

_Optimization_ is the task of finding the best solution for something. A classic example is that of the lifeguard on the beach who spots someone drowning in the see. How do they get there as quickly as possible? They will be quicker on the beach than in the water, so if they run in a straight line they won't get there in the fastest possible time. It's better to run a longer distance on the beach and hit the water closer to the swimmer.     

-- image. Include coords

This is an optimization task. If we call the angle at which the lifeguard hits the water $\rc{a}$ then there are many values of $\rc{a}$ we can choose. Each results in a certain time $t(\rc{a})$ taken to get to the drowning swimmer. We want to pick the $\rc{a}$ for which the time taken is the smallest value. 

We write optimization problems like this:

$$
\argmin_\rc{a} t(\rc{a}) \p 
$$

This means <em>min</em>imize the value of the function $t(\rc{a})$ and return the <em>arg</em>ument $\rc{a}$ of the function.

In many problems we encounter in our daily lives, there is some quantity that we want to optimize. Even if there is no way to mathematically formalize the problem, or if it wouldn't be worth the effort to do so, we still approximate roughly the business of optimization. If you have two days to study for an exam, you want to assign your available time over the different parts of the text book in proportion to how likely they are to appear on the exam. You also want to budget enough time for sleep so that you can absorb the material and be fresh and well-rested in the atual exam. How you assign your time is the <span class="rc">argument</span> you optimize over. The grade you get for the exam is the function that you optimize for.

## Multi-objective optimization

The real world is often messier than our mathematical abstractions acknowledge. One of the messier parts of the real world is that we often have multiple objectives to satisfy. For example, when you want to pass an exam, you rarely do it just to obtain a high grade. Most people actually want to retain the knowledge and do something with that knowledge later in life. Our education system is sadly not set up in such a way that the two aims align. You can optimize for a flawless grade and retain absolutely nothing, and you can optimize for retention and barely scrape by with a passing grade.

Most students will want to optimize both objectives to some extent. They will want to pass, even if they don't perfectly retain all the information and they will also want to retain some of the information so that the whole thing doesn't become a vacuous exercise.

We see the same problem from the other side. When you design a course, you think about the _outcomes_ of the course. Where do you want to be when the thing is done and the students move on, what do you want to have achieved? The main goal on paper, and that you'll be judged on is that the students received good grades, and that those grades are reasonably meaningful. This is an empty aim: those grades will go to make up a diploma and that diploma will be used as a shorthand for a certain set of skills. If the grades are meaningless, this system fails, and we may end up with, say, incompetent doctors.

For most teachers, however, this is not why we do the job we do. We like our subject and we want to find those students who are passionate about it and give them the freedom to show that passion. This is often at odds with the more mechanical requirement of making sure that we test for concrete, minimal skills. I you find a passionate, interested student, you can usually just let them learn on their own. Let them build whatever they're interested in building. You don't need grades to test whether they're learning or not. So long as they're busy, they'll learn just fine on their own. As a teacher, the best you can do is give them some shortcuts, so they don't make as many mistakes as you made, and otherwise get out of their way. In an ideal world, this would be all we did. There would be no grading, no testing. Students would build or learn or write, and we would offer gentle guidance where neceassry. At the end, we would simply trust that they had learned plenty after being busy for so long.

Of course, the world is not ideal. For one thing, not every student is interested in every subject. Some course, you will just need to get over with. For another, we are none of us as focused and undistractible as we'd like to be. Even if we are interested, our daily lives our tired bodies and the relentless attention economy all take their toll.

In short, we have two objectives: test whether people have done what we want them to do, and at the same time offer the interested and passionate student the freedom to learn on their own terms. 

I have two more examples, just to hammer home the point. The first is **writing papers**. When we write research papers, the big challenge, especially early in our careers, is to get the paper accepted. Quite simply, we need to get it past the reviewers. This often involves a huge amount of second guessing during the writing and experiment of what sort of things reviewers take issue with. Seomtimes this is very productive: it helps us to better design an experiment that cannot be criticized, and forces to clearly state what we are doing and why. At other times, it makes us do things we'd rather not do, like fill every paragraph with disclaimers and boilerplate, designed to prevent any kind of criticism. In the worst case, you can actively make the paper worse while improving your chances at acceptance: by using complex and inpenetrable language, you make a paper look more impressive than it is. This will sometimes stop reviewers from dismissing your idea as too simple, and it may even get you an accept if the reviewer doesn't want to admit that they didn't really understand the paper.

With all the effort we put into getting a paper accepted, you would be forgiven for thinking that this is what our job is about. That when the paper is accepted we are done, and we have achieved our goal. In fact, I think some people in academia have fallen into the trap of thinking that this is what it's all about.

It isn't of course. The point of a paper is for it to be read. For people to take its message on board and for the knowledge or wisdom that it contains to spread. This is partially aligned with the aim of impressing our reviewers, but not entirely. For one thing, the content of our papers is often, at least in part, _subjective_. While we are most of us scientists, we are often working within frameworks and towards goals that simply not everybody "gets". This is fine, so long as we are honest about it. Maybe we will show that we were right more incontrovertibly in a later paper building on the current one. What matters for now is that our paper find _its audience_. It doesn't need to connect with everybody everywhere, it just needs to find those people that have had sufficiently similar thoughts themselves that they understand what the paper is trying to do. 

This is fundamentally different from the hurdle of passing review. In that case, three randomly chosen people, often with an adversarial mindset need to agree that the paper doesn't have any major flaws and that the paper's aims are worthwhile 

As a final example let's look at a particularly frought issue: **diversity**. This is a complex topic, especially in homogeneous fields like computer science. To make things conrete, let's focus on the subtopics of diversity in hiring and on gender balance. We have very few women in computer science, and so it makes sense to say that we should hire more women.

<aside markdown="1">There are those who would make the case that women are innately less interested in CS and that we shouldn't force subjects on people that they aren't interested in. I don't think this is where we are at the moment, but if this is your view, consider the argument that computer science, like politics, has a massive effect on the world. The world, which consists for a large proportion of women. So, if women are to be affected by CS, they should have a say in how it is developed. Hopefully that will get you on board enought to follow the example.
</aside>

How do we go about this? If we get two applicants, one male one female, how do we balance the two objectives: one to hire as many women as possible, and one to hire the candidate who is best suited for the job? If we favor the female candidate over the male aren't we disadvantaging _him_? Are we not then engaging in---and this may blow your mind---some sort of _reverse_ sexism?

The other side is that there is bias in the way we decide which candidate is better and that by skewing more towards the female candidate we are countering this bias and actually choosing the candidate that is objectively better.   

At this point the scene is set for a shouting match. In my experience, where things don't devolve into a heated argument, it's because people, on both sides of the argument hide their true opinions---some for fear of being seen as sexist and some for fear of causing conflict. I don't like that as an approach to diversity. I think it's an important topic and it's tough to solve optimization problems collectively if people have to be wary of what they say.

If we think of this as a multi-objective optimization problem, one objective is clearly to hire more women, and another to hire the best candidate. But that second objective can also be unpacked into a many more objectives: are they going to write good papers, are they going to teach good lectures, are they going to behave poorly to their coworkers, are they going to pull their wiehgt in the administrative tasks, are they going to hire good people themselves, are they going to collaborate with good people abroad? Diversity is just one in a vast number of objectives that we need to balance in hiring.  

## Acknowledging subjectivity

A key thread in all these examples is that some aims are mostly objective and some are mostly subjective. An exam tests objectively whether you've covered the key parts of the material. But what you want to retain are the parts of the material that are going to be relevant to you. This depends entirely on what kind of career you see for yourself. It should be entirely different from student to student.

Whether a paper passes review should be an objective decision. It shouldn't depend at all on who wrote the paper and ideally it shouldn't matter too much on who are chosen as reviewers.

<aside>[Research shows]() that we are not doing too well on the later metric.  
</aside>

Whether and by whom a paper is read can be an entirely subjective matter. There are plenty of things we do in science, thta will only chime with a small proportion of the community. Proposing a new methodology, critiquing an existing methodology, setting new benchmarks. All of these require people to "get it" if they are going to be taken up. You can improve your chances by motivating your work better, and explaining it more clearly, but ultimately some people will get it and some won't. And this is fine. If the idea is worthwhile, a few dedicated followers is opften all you need.

In hiring as well, there are many subjective aspects. This is where the diversity discussion often derails, in my opinion. When people ask "but what if the male is the better candidate" they imagine a kind of one dimensional line of how "good at science" you are onto which everybody can be projected. Perhaps with Einstein on one end and Homer Simpson at the other. This is a cartoon view. Not just of the world, but of everything. How suitable you are as a scientist to work in a certain department can be answered in many different ways. It depends on what the prospective coworkers need and what the plan is for the development of the department. 

If you are building a team you don't hire four nmechanics, even if they are the four best mechanics in the world. You hire one strong man, one confidence artist, a tactician and an ace pilot. Even if the pilot is a little crazy.

## Compromise a hobgobling of little minds 

In short, you need to see the problem of optimization as high-dimensional. Candidate A can be a better fit than candidate A in terms of their publication record, but B can be better than A in terms of their teaching record. Which is more important? That's up to you. 

This brings us to the worst possible instinct to rely on in situations like these. The instinct to _compromise_. I've written before on how much I hate compromise as a problem solving technique and I will probably do so again in the future.

In our current context, compromise means balancing your objectives. In the case of hiring you might compromise as follows: give the candidate's research output a grade from 0 to 1, and give their teaching quality a grade from 0 to 1. Take the average of the two and then rank your candidates by this score and hire the top candidate. If you value research a little higher than teaching, then take a weighted average.

The problem is that we are still rushing into that one dimensional space. The space where we don't have to think, and we can simply look at the ranking of candidates. This is especially troublesome if we're combining objective and subjective aims. Let's say you get your candidates, one who looks to be better at research and one who looks to be better at teaching. Do you just average the two? Or do you look closer: ask them how they would work to improve their teaching or reserach respectively, see what they need and whether you are in a position to offer it?

The key here is to resist project down to one dimension. Keep the candidate options in all their glorious high-dimensional complexity and use the full power of your brain to see what opportunities there are.

## Designing structures with constrained optimization in mind

But aren't we always guilty of one-dimensional optimization, you may ask? Isn't there always some line of suitability according to which we will have arranged our candidates, even if we aren't doing so conciously? Perhaps, if you formalize it enough, but there is a big difference between what you do conciously and what sombody can claim you did in retrospect. It's the difference between saying "We chose candidate A becauserthey were better at teaching according to some score" and "We chose candidate A because they offer the kind of teaching that we need in our department" or "We chose candidate A because they showed that their less impressive publication record was down to the limited availability of computing resources, which we have plenty of."

So how do we do this the formal land of mathematical optimization? What do we do if we have a multi-objective optimization problem, but we don't want to simply average everything down to a single objective functions that takes a weighted average of all our objectives?

One simple and very powerful approach, and the subject of this post, is _constrained optimization_. For all but one of the things we want to optimize, we instead set a threshold, and then we optimize the remaining objective.

 





-- Goodheart's law (Straithern)

-- Designing a course
-- Writing papers
-- Diversity, hiring

-- the review process