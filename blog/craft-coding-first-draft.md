---
title: AI coding without the vibes 
parent: blog

---

**This is the first draft of the essay [AI coding without the vibes](craft-coding). This is the version I hand wrote, and showed to Fable for feedback. If AI hadn't been available, I probably would have published this as is.

Please note that this draft contains false assertions and other statements I don't really stand behind.
**

# AI coding without the vibes (draft)

We spend a lot of effort these days trying to figure out how to stop students cheating with AI. It's necessary, but it's not the most worthwhile part of the job. Students that want shortcuts around learning are going to find them anyway.

A more worthwhile, and interesting question to spend our energy on is what to tell those students (including PhD students) who aren't looking for shortcuts. The ones that genuinely want to learn and are happy to devote hours each day to developing themselves. The ones who want to be here.

Your initial instinct may be to tell them to pretend AI doesn't exist. Learn everything the old-fashioned way. Never did me any harm. But that would be like telling a student in the 50s to pretend that calculators or computers don't exist. Students today need to prepare themselves for a world in which AI is going to be a major presence. They need to have the skills to navigate that world, whatever it will look like.

You may also think that we should tell them to embrace AI fully. Sign up to the highest tier of Claude and burn tokens like there's no tomorrow. Defer absolutely everything to the machine. This is also bad advice. It's a surefire way to learn absolutely nothing at all.

Not only that, it's the perfect way to make sure that you'll never learn what it _feels like_ to understand something. This is something that is not made explicit often enough: one of the most important things you learn in university is to gauge whether you really understand something. You will find yourself in situtations where you could have sworn you really understood something, and then you get just the right question, and you have no idea how to answer it. Eventually, you learn to ask _yourself_ these questions. And then, slowly, you'll develop an accurate sense of whether you really understand something. 

Deferring everything to AI means that that machinery never develops. You will not just be _knowingly_ taking shortcuts, you will be deceiving yourself into thinking that you've mastered something. When the bill comes due, and you suddenly realize that you don't have any worthwhile skills at all, it may be too late to really learn any new skills at all. 

So what is the answer then? My best advice so far---and bear in mind that I'm just making it up as I go along, just like everybody else---is that most things you do consist of two stages: **doing and checking**. You write some code, and you check it for bugs. You write some text and you fact-check it and proof-read it.

Current AI is not good enough to do both. It will work for a while, but eventually, it goes off the rails. It deletes your database, rewrites your license, or locks you out of your machine. So, if you decide to use AI in some part of your project: let it do the thing while you check its work, or you do the thing, and it checks your work. 

When you put the options like this, it's really no choice at all. Having the AI write the code is what most people do. It's what we call "vibe coding". If you hold to the above rule, you can only do this if you check everything the AI writes and does. It's clear this is a fiction. The human brain was not made for this. Even if you resolve to really check, deeply, every line of code produced by the bot, your attention would wander in under an hour. The failure cases are rare enough that you can't help but start to trust the machine. 

<aside>Even if you could, it's a verbose coder, it overcomplicates things, and it works fast. Even if you had an inhuman level of attention, you couldn't keep up.</aside>

More importantly, it wouldn't be fun. Coding is hard, but ultimately, on some level it should be fun.

So let's do it the other way around. You code and you have the AI check your work. Treat it like a code reviewer. That's my advice in a sentence. It can still save you time, it will catch bugs that would have taken weeks to figure out the old-fashioned way. It will tell you about tricks you missed and technology that you were unaware of. But, a lot of the incentives that point the wrong way in vibe coding are turned around if you do it this way.

In the rest of this blog post, we'll dig into the details. How do you do this in practice? What does it buy you, what doesn't it buy you? How long will this remain a feasible approach? But first, let's see if we can come up with a catchy name.

## Craft Coding

Imagine three bakers. Hanna, Vivian and Cara. 

Hanna is a home baker. She's fanatical: she goes to great lengths to let her sourdough starter mature, checking the temperature obsessively. She follows complicated rising processes: turning, retarding and shaping the dough very precisely. This leads to great bread, and she has more skill than many professional bakers. However, because she does everything by hand, including kneading the dough, it will never scale. She knows this, and she's happy to create a tiny amount of perfect bread in her own unique way. 

Vivian is a commercial baker. Her bakery creates vast amounts of bread to fill the supermarket shelves. She defers most decisions about the baking process to food scientists she's hired. She monitors aggregate statistics. Chief among them, how well the bread sells and how much it costs to make. She doesn't care about the quality of the bread. Or rather, she cares about the quality to the extent that her customers care, but no more. If she could get away with it, she would happily cut the flour with chalk to cut costs. The main thing she's worried about is getting undercut by another baker figuring out how to make bread that sells just as well, a little bit cheaper. She's not a bad person, this is just what the market forces her to do.

In between these two extremes, we find Cara. Cara runs a commercial operation. She knows that she can't bake bread the way Hanna does. No commercial bakery kneads dough by hand: it's hugely inefficient and quite unhygienic. However, she's not like Vivian. She cares about the way the bread gets made. She's on top of every part of the process, and this is what gives her satisfaction in her work.

<aside>In the time before kneading machines, a lot of sweat would end up in the bread from bakers having to knead huge masses of dough by hand. 
</aside>

This maps onto modern coding practices as follows. 

Hanna is a **hand-coder**. She abhors AI and is happy to be the one to keep an ancient craft alive, whether it's commercially viable or not. Even if AI code is better in some ways, she's happy to keep doing it by hand.

Vivian is a **vibe-coder**. This is a little counter-intuitive, because "vibe-coding" suggests a kind of laissez-faire atitude where you don't really care about the outcome and you're just having fun. That's what the phrase meant when it was coined, but the world has moved on. Professional programmers are routinely asked to defer entirely to AI and to monitor only high-level markers of quality without ever inspecting the code themselves. This is what modern vibe-coding is. Deferring to the AI, not worrying about the individual lines of code, and keeping an eye on whether the code passes its tests, and throws up any problems in production.

Cara's bakery is what we would call a craft baker, so the equivalent coding style could be called **craft coding**: a coding style that revolves around the inherent quality of the product, down to the details. One where the programmer commits to understanding, in detail, every aspect of the code base. Tools like AI are allowed, but only when they benefit that ideal. 

Like craft baking, craft coding may not hold up under all the stresses of a modern multinational corportation, but there is a niche for it. 

## Where craft matters

One such niche, I believe, is scientific code. In science, the code is not normally the product. The thing we produce is an idea, captured in a paper. The code implements that idea, to prove it right. This means that scientific code has slightly different rules than production code. It doesn't need to be robust to many different use-cases. It really only needs to run the experiments in the paper. That means that you can usually make it a lot simpler than production code. 

What's _more_ important than in production code, however, it that it's _correct_. It absolutely needs to do exactly what the paper says it does. If your production code doesn't quite do what you thought it did, but the customers don't notice, it may not really matter. It's not great, and you want your code to be correct, but if the incorrectness is harmless, you may get away with it. If it happens in science, it invalidates the paper.

<aside>Obviously it does happen a lot in science, still, and often we work with it. Sometimes it doesn't really sink the paper, sometimes some future paper sets things right. But at least in principle, I would say that science cares more about the intrinsic correctness of the code, and production cares more about the effects of the code.
</aside>

I could write a whole blog post about how this affects coding styles in science, but we'll save that for another time. For now, it means that science is the perfect niche for craft coding. As the author of a paper, you are vouching that the code exactly implements the ideas of the paper. You can _only_ do that if you know the code intimately, line by line. Vibe coding won't get you there. 

Until recently, I would have concluded that therefore, scientists should be hand-coders. That is, until I started taking my own code and asking Claude whether it could spot any problems. So far, I have never shown Claude a bit of code that it couldn't spot a serious issue with. The code usually runs, and I can't see anything wrong with it. But the problems are there.  

When I was a PhD student I wrote code by hand and I would eventually, in the course of my experiments, come across these bugs. I would get frustrated and spend weeks writing test suites to get rid of them. It took me years to develop that kind of discipline, and now that I am an assistant professor, with most my time spent on teaching and various other non-coding activities, I've forgotten it. And if I did remember, I would conclude that I can no longer do serious research, because the code I write in the odd free afternoon is simply too full of bugs, even if it runs. The conclusion of my PhD was that the code for even a simple proof-of-concept experiment takes weeks of debugging, and even then I'm not quite sure it really does what I think.

This is where we come back to our bakers. Cara might take pride in her kneading. She might love kneading dough by hand, since it really lets you feel how the gluten develops. However, if she's going to run a commercial operation, she needs to accept the simple truth that using a kneading machine results in better dough, a more hygienic process, and more predictable results. In short, if the tool makes the product better, you need to accept that.

That doesn't mean you need to accept it blindly, or uncritically. Cara can still decide which kneading machine she employs, and how she uses it, but she should at least accept that the machine can do certain things better than she can.

## Craft coding in practice

So, what does this craft coding look like in practice? Put simply, you don't let AI do anything. You only let it critique what you've done, and you implement its suggestions if you agree. The best metaphor, again, is that of a code review by a senior programmer. 

You can do this however you like, but if you want some clear lines you should not let yourself cross, here are 10 commandments of craft coding.

1. No AI in the IDE. That includes autocomplete. Every character of every line is written by one of your fingers hitting a key on the keyboard. 
2. Preferably, don't give the AI access to the codebase. Copy-paste snippets of your code in the web interface.
3If the AI has access to the codebase, this access is read-only.
4. Don't copy-paste code out of the AI chat box.
5. Don't use AI to do anything that plain search can do. 
6. Read the documentation before you ask the AI. 
7. Ask the AI for solutions only if you cannot solve it yourself. Give yourself some time to think. 
8. Check your code yourself before you ask the AI to review. Do your best to minimize mistakes.
9. Run the code, then ask the AI.
10. Don't implement a suggestion you don't understand. Push back. Ask for explanations. Go into a dialogue, but don't take on something before you understand why. 

I don't follow all these religiously. Sometimes I copy-paste something our of Claude, sometimes I ask for a solution because I'm in a hurry. But I know what the ideal is, and I do my best to attain it.  

## What it will do 

If you're a vibe coder, this is asking you to give up a lot. There are still time savings in craft coding, but they are definitely more modest than those of vibe coding. The main benefits lie elsewhere. 

**The code becomes better.** I could out-code some of the early AIs coders, but that time is long past. As a code reviewer, Claude Fable definitely super-human. It spots most mistakes without needing to run the code. It spots _many_ runtime bugs that I would never have caught myself. And it often has good suggestions. 

**Development speeds up.** Again, compared to vibe coding, craft coding is still very slow. Compared to hand-coding, however, what you lose are those bugs that stop development in its tracks for weeks. The bugs that require whole new scripts and scaffolding to track down. For me, that's still a meaningful saving. It means that with a few afternoons blocked per week I can still do meaningful work.  

**It stops you from losing track of what your code does.** For scientific code, this is really important. You need the whole codebase in your head. Every corner of it needs to be loaded into working memory. This is tough to do at the best of times. If you vibe code, it is no longer possible. Little functions and classes will crop up without you knowing whether you asked for them and forgot, or whether the AI just inserted them at some point for some reason.  

**It prevents deskilling.** The main reason that coding companies do (or did) code review is not for the quality of the code. It's a way to transfer skills from a senior to a junior dev. It's a really good teaching channel, because you're talking about something that the junior has just written themselves. It's all loaded up in their head and they can immediately understand anything you say about it. None of it will feel abstract.

With AI, you are the junior. The way things are going, you will always be the junior. That's the bitter pill. There is no graduating to senior anymore, where you get to teach the young'uns how to code. All that's left is to keep learning. However, the alternative is the Guitar Hero equivalent of coding: an infinitely fun game that makes you feel hugely powerful and creative, while removing all the difficulty and friction that cause you to actually learn anything.

With craft coding, not only do you prevent deskilling, you are actually actively learning. Like I said the suggestions from Claude are usually genuinely good, and even if they aren't, you are still actively judging whether to implement each one. Since everything filter through your active attention, you keep learning.

**It limit environmental and financial impact.** Environmental impact is hotly discussed. The industry as a whole is having a worrying impact. The VC funding means that AI is vastly subsidized. The vibe coders occasionally feel the sting, when the true cost of tokens shines through, and they realize that at cost, their token use would burn their own salaries many times over. With craft coding this concern becomes minimal. A single chat with Claude is enough for several days of craft coding. The basic 20$/month plan pays for this and the environmental impact is likely less than that of the coffee you consume while coding. 

This is also something of a middle ground if you find it difficult to stomach giving the AI companies your money. Right now, those 20$/month subscriptions are not what's keeping them afloat. If you want them to fail, but still want to understand the impact of frontier models on coding, this approach is at least better than burning tokens at the rate of full-time vibe coders.  

**It incentivizes checking your own code.** In most AI interaction patterns, the incentive is towards checking your own code less and less. Even if you don't want to, a little laziness and a little time pressure is enough to defer to the machine a little bit more each day. 

It perhaps depends a little on your personality type, but when I treat Claude as my code reviewer, I find myself trying pretty hard to get the code bug-free before it looks at it (I rarely succeed). I know it doesn't care, and there's no one there to judge me. But that goes for the Duolingo owl too, and that still manipulates millions of people into practicing their Spanish every day.

So maybe it's a little pathetic to want to impress Claude with my flawless code, but if the alternative is apathy and deskilling, I'll take it.

**It promotes proper documentation instead of disincentivizing it.** One of the worst effects of vibe coding is that people have stopped documenting properly. Since the AI can read the raw code, nobody documents functions anymore. Even if you're committed to vibe coding, this is a scary development. Function documentation forces you to think about a contract. Code that hangs together in well-defined contracts is much more reliable and interpretable, even if a swarm of AI agents is doing the maintenance.

When you're craft coding, comments are extremely helpful for context. You want your code to be readable _as a snippet_. If you don't let the AI read the context, the comments become a key part of interpreting what you're doing and why. And code that is readable as a snippet is, by definition, decoupled.

**It stops you from self-delusions about being able to out-think the AI. It keeps you aligned to frontier AI abilities.** Most of the people I interact with on social media are AI critics. On balance, I find them a healthier, more agreeable crowd than the Kool-aid gang on Twitter. Still, being an AI researcher on Mastodon or Bluesky is not without frustrations. Not to put too fine a point on it, but most AI critics are woefully under-informed about how AI really works, and what frontier models can really do. Most criticism of the actual abilities is based on silly examples like the AI summaries above Google searches or the free version of ChatGPT from three years ago. 

This makes some sense: if you're fundamentally opposed to AI on moral grounds, you're not going to shill out 20 bucks a month to Anthropic and keep up to date with all the latest developments. You'll check in every now and then to convince yourself that it's still bullshit and leave it at that. 

The problem with that is twofold. First, AI moves fast. To keep up with progress, you need to check carefully, every few months at least. Second, you have an ego-incentive not to check too carefully. Especially if you're a hand coder. Even if you're very honest with yourself, there will be something in you that doesn't want to know that a machine is outrunning you. If you're not _very_ disciplined, this something will stop you from checking quite as carefully as you would otherwise have done.

In this sense, craft coding keeps you honest. You still write your own code, one character at the time. It is still entirely yours and you still understand every detail. But there is always that step of copy-pasting it into the Claude chat window and asking it if it can spot any problems. Ask yourself why you don't want to do that, at least every now and then?

## What you still lose

The story is not all sunshine and roses. Deskilling is real, even if you use AI in a minimal fashion. What I learned to do in my PhD was to spend a week, 8 hours per day, debugging code. Even code I wasn't sure had a bug. That was a whole skillset, it came with its own kind of creativity. It required persistence. With craft coding, that is mostly lost. If you have a deep bug, Fable will just tell you. If AI every disappeared for some reason, you would be shocked at the effort required to find these bugs yourself.

<aside>I'm sure there are bugs that are so deep that it takes Fable many days and lots of interactive debugging to find them, but that is the world of AlphaGo playing against itself: a world of intellectual depth that now exists that we can not be a part of.</aside> 

For any bug that is important to me, Fable spots it instantly without needing to run any code, and it usually tells me how to fix it. The skill to find those bugs by hand will soon be lost. It's not nothing, I'm sure there are many benefits to learning that process. But then many skills are lost as technology progresses. Maybe this is one we can afford to let go of. 

## What it won't do

There are many things that craft coding won't do for you. It won't feel like magic. It won't sick up that programming language you've been thinking about building for the past 10 years, at the cost of 6 hours of tokens. But maybe it's time to accept that the world doesn't need another programming language. Or of it does, that it also needs somebody to put in the time of maintaining and popularizing that language. And that goes for most of the things that you can magically vibe-code into existence. If you don't have the time to maintain them and nurture them, you should keep them in your fantasies where they belong. The building time was never the bottleneck. The maintenance time is, and that is still a human job.     

If your boss is doing the equivalent of selling bread to supermarkets, craft coding is going to be a hard sell. Mostly, bosses won't care about the inherent quality of code, or about how well their programmers understand every line of their codebase. They'll care about the aggregate stats. Does it sell. Does the customers swallow it?

But, just like Cara the craft-baker finds her niche in people who are tired of the homogeneity of supermarket produce, so there is a niche for craft coding. I believe that scientific code, specifically the code that implements the experiments that we report on in our papers, should be craft coded. Not because AI is bad for you, and we should minimize its use. Not because science should be accelerated, and we must embrace AI for all it's worth. But because if we use AI in the right way, the code will contain fewer mistakes, and the science will become more reliable. Everything else is of secondary concern.

## Beyond the current regime

Maybe these are all just temporary fixes. Maybe by the end of 2027, AI can do and check at the same time, for a long time, without any sudden failures and the above philosophy falls down. If that happens, however, there isn't much that we can contribute anymore anyway. The need for programmers and scientists will drop by a factor of 10 or 100 or more, and it's hard to predict what things will look like after that. Broadly, there are two options. 

First, no human cognitive skills will be required anymore, and we will defer to the machines in all aspects, with all the associated risks. If that is the case, we may as well invest in the skills and activities we enjoy, because working for our own entertainment will be all that's left.

Second, some new set of skills will emerge. Something that people can do that machines can't or won't be trusted to. We don't know what these skills will be. They could be creativity and long-term planning, but I wouldn't bet the bank on it. In any case, we're no good at teaching those, certainly not at universities. 

People often point to the calculator---I did so myself at the start---as something that came along and made a skill obsolete. The implicit conclusion being that when the calculator came along, kids were better off not learning mental arithmetic. But were they really? Even now, imagine two colleagues, largely similar but one is skilled at mental artihmetic and the other isn't. Do you really think of the second one as having a useless skill, something like solving a Rubik's cube, helpful to make you look smart, but otherwise pointless? Or does it actually come in handy, at least in technical professions: in helping you think through problems, analyse things on the hoof. The benefit may be small, but it's not nothing.

Similarly, when the ability to read and write code by hand becomes no longer strictly necessary, it might still be a useful skill. Something you don't need for your job, but that can still set you apart. Something that can give you a deeper understanding of the job you're hired to do.

Since we don't know what skills _will_ be fundamentally necessary, why not invest in those that give us joy, and those that have a decent probability of offering some benefit in the future, among whatever skills survive as AI improves. 