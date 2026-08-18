---
title: AI coding without the vibes
image: "https://peterbloem.nl/images/soupcutter.jpg"
image_alt: "The painting 'La Tailleuse de Soupe' (The soup cutter) two stylized female figures are seated at a dinner table, in front of a pot of steaming soup. The figure to the right is cutting slices from a large loaf of bread."
summary: "This question---what we should tell students to do with AI---is a good trigger to think about what we ourselves should be doing (which is what this essay is really about). "
parent: blog

---

# AI coding without the vibes

<ul class="links">
	<li>16 August 2026</li>
</ul>

<figure class="narrow centering">
<img src="/images/soupcutter.jpg" class="tile-full" alt="The painting 'La Tailleuse de Soupe' (The soup cutter) two stylized female figures are seated at a dinner table, in front of a pot of steaming soup. The figure to the right is cutting slices from a large loaf of bread.">
</figure>

We spend a lot of effort these days trying to figure out how to stop students cheating with AI. It's necessary, but it's not the most satisfying part of the job. Students that want shortcuts around learning are going to find them anyway.

A more worthwhile and interesting question to spend our energy on is what to tell those students (including PhD students) who aren't looking for shortcuts. The ones that genuinely want to learn and are happy to devote hours each day to developing themselves. The ones who want to be here. 

This question---what we should tell students to do with AI---is a good trigger to think about what we ourselves should be doing (which is what this essay is really about). 

Your initial instinct may be to tell students to pretend AI doesn't exist. Learn everything the old-fashioned way. Never did me any harm and so on. But that would be like telling a student in the 70s to pretend that calculators or computers don't exist. Students today need to prepare themselves for a world in which AI is going to be a major presence. They need to have the skills to navigate that world, whatever it will look like.

Alternatively, you may think that we should tell them to embrace AI fully. Sign up to the highest tier of Claude and burn tokens like there's no tomorrow. Defer absolutely everything to the machine. This is also bad advice. It's a surefire way to learn absolutely nothing at all.

Not only that, it's the perfect way to make sure that you'll never learn what it _feels like_ to learn something. This is something that is not made explicit often enough: one of the most important things you learn in university is to gauge whether you really understand an idea. You will find yourself in situations where you could have sworn you really understood something, and then you get just the right question, and you have no idea how to answer it. Eventually, you learn to ask _yourself_ these questions. And then, slowly, you'll develop an accurate sense of whether you have really reached a state of understanding.

Deferring everything to AI means that that machinery never develops. You will not just be _knowingly_ taking shortcuts, you will be deceiving yourself into thinking that you've mastered something. When the bill comes due, and you suddenly realize that you don't have any worthwhile skills at all, it may be too late to fix the problem. 

And, again, this applies to ourselves as well, even if we were lucky enough to get to develop this machinery before AI came along. Cognitive skills are like muscles: hard to gain, easy to lose. 

So what is the answer then? My best advice so far is that most things you do consist of two stages: **doing and checking**. You write some code, and you check it for bugs. You write some text and you fact-check it and proofread it.

Current AI is not good enough to do both. It will work for a while, but eventually, there's a real chance it goes off the rails. Sometimes in a big way, like deleting your database, but more often in more subtle ways, shifting the codebase slowly into an unmaintainable mess. More importantly, even if it does both flawlessly, can you really hand it in as "your work"? You have to ask what you are contributing. And, whether you're a student or not, what you are learning.

So, if you decide to use AI in some part of your project: let it do the thing while you check its work, or you do the thing, and it checks your work. 

When you put the options like this, it's really no choice at all. Having the AI write the code is what most people do. It's what we call "vibe-coding". If you hold to the above rule, you can only do this if you check everything the AI writes and does. It's clear this is a fiction. The human brain was not made for this. Even if you resolve to really check, deeply, every line of code produced by the bot, your attention would wander in under an hour. The failure cases are rare enough that you can't help but start to trust the machine. 

<aside>It's a verbose coder, it overcomplicates things, and it works fast. Even if you had an inhuman level of attention, you couldn't keep up.</aside>

More importantly, it wouldn't be fun. Checking other people's code is a grind. Writing your own is fun. 

So let's do it the other way around. You code and you have the AI check your work. Treat it like a reviewer. That's my advice in a sentence. It can still save you time, it will catch bugs that would have taken weeks to figure out the old-fashioned way. It will tell you about tricks you missed and technology that you were unaware of. But, a lot of the incentives that point the wrong way in vibe-coding are turned around if you do it this way.

In the rest of this essay, we'll dig into the details. How do you do this in practice? What does it buy you, what doesn't it buy you? How long will this remain a feasible approach? But first, let's see if we can come up with a catchy name.

## Craft coding

Imagine three bakers. Hanna, Vivian and Cara. 

Hanna is a home baker. She's fanatical: she goes to great lengths to let her sourdough starter mature, checking the temperature obsessively. She follows complicated rising processes: turning, retarding and shaping the dough very precisely. This leads to great bread, and she has more skill than many professional bakers. However, because she does everything by hand, including kneading the dough, it will never scale. She knows this, and she's happy to create a few loaves of perfect bread in her own unique way. 

Vivian is a commercial baker. Her bakery creates vast amounts of bread to fill the supermarket shelves. She defers most decisions about the baking process to food scientists she's hired. She monitors aggregate statistics. Chief among them, how well the bread sells and how much it costs to make. She doesn't care about the quality of the bread. Or rather, she cares about the quality to the extent that her customers care, but no more. She will happily use cheap flour to cut costs and reduce rising times to make production more robust. The main thing she's worried about is getting undercut by another baker who figures out how to make bread that sells just as well, but a little bit cheaper. She's not a bad person, she just cares about other things than Hanna, and if she didn't, she wouldn't last long in her job.

In between these two extremes, we find Cara. Cara runs a commercial operation. She knows that she can't bake bread the way Hanna does. No commercial bakery kneads dough by hand: it's hugely inefficient and quite unhygienic. 

<aside>In the time before kneading machines, a lot of sweat would end up in the bread from bakers having to knead huge masses of dough by hand [1].
</aside>

However, Cara is not like Vivian either. She cares about the way the bread gets made. Good bread has intrinsic value to her. Even if her customers didn't care, she still would. She's on top of every part of the process, and this is what gives her satisfaction in her work.

This maps onto modern coding practices as follows. 

Hanna is a **hand-coder**. She abhors AI and is happy to be the one to keep an ancient craft alive, whether it's commercially viable or not. Even if AI code is better in some ways, she's happy to keep doing it by hand.

Vivian is a **vibe-coder**. This is a little counter-intuitive, because "vibe-coding" suggests a kind of laissez-faire attitude where you don't really care about the outcome and you're just having fun. That's what the phrase meant [when it was coined](https://en.wikipedia.org/wiki/Vibe_coding), but the world has moved on. In many companies professional programmers are using AI in such a way that it's impossible to imagine that they are also reading the resulting code in detail. This is what modern vibe-coding is. Deferring to the AI, not worrying about the individual lines of code, and keeping an eye on whether the code passes its tests and throws up any problems in production. 

Cara is what we would call a _craft baker_, so the equivalent coding style could be called **craft coding**: a coding style that revolves around the inherent quality of the product, down to the details. One where the programmer commits to understanding, in detail, every aspect of the code base. Tools like AI are allowed, but only when they benefit that ideal, and only _in a way_ that benefits that ideal. 

Like craft baking, craft coding may not hold up under all the stresses of a modern multinational corporation, but there are niches for it. 

## Where craft matters

One such niche, I believe, is scientific code. In science, the code is not normally the product. The thing we produce is an idea, captured in a paper. The code implements that idea, to prove it right. This means that scientific code has slightly different rules than production code. It doesn't need to be robust to many different use-cases. It really only needs to run the experiments in the paper. That means that you can usually make it a lot simpler than production code. 

What's _more_ important than in production code, however, is that it's _correct_. It absolutely needs to do exactly what the paper says it does. If your production code doesn't quite do what you thought it did, but the customers don't notice, it may not really matter. It's not great, and you want your code to be correct, but if the incorrectness is harmless, you may get away with it. If it happens in science, it invalidates the paper.

<aside>Obviously it does happen a lot in science, still. Sometimes it doesn't really sink the paper, sometimes some future paper sets things right. But at least in principle, I would say that science cares more about the intrinsic correctness of the code, and production cares more about the effects of the code.
</aside>

I could write a whole essay about how this affects coding styles in science, but we'll save that for another time. For now, it means that science is one strong niche for craft coding. As the author of a paper, you are vouching that the code exactly implements the ideas of the paper. You can _only_ do that if you know the code intimately, line by line. Vibe-coding won't get you there. 

Until recently, my conclusion was that therefore, scientists should be hand-coders. Then, I started taking my own code and asking Claude whether it could spot any problems. So far, I have never shown it a snippet of code that it couldn't spot a serious issue withg. The code usually runs, and I can't see anything wrong with it. But the problems are there. 

<aside>This is not just Claude throwing up false positives. I check what it says, and agree that it has found a serious bug. I never implement suggestions I don't understand.
</aside>

When I was a PhD student I wrote code by hand and I would eventually, in the course of my experiments, come across these bugs. I would get frustrated and spend weeks writing test suites to get rid of them. It took me years to develop that kind of discipline, and now that I am an assistant professor, with most of my time spent on teaching and various other non-coding activities, I've forgotten it. And if I did remember, I would conclude that I can no longer do serious research, because the code I write in the odd free afternoon is simply too full of bugs, even if it runs. The conclusion of my PhD was that the code for even a simple proof-of-concept experiment takes weeks of debugging, and even then, I'm not quite sure it really does what I think.

This is where we come back to our bakers. Cara might take pride in her kneading. She might love kneading dough by hand, since it really lets you feel how the gluten develops. However, if she's going to run a commercial operation, she needs to accept the simple truth that using a kneading machine results in better dough, a more hygienic process, and more predictable results. In short, if the tool makes the product better, you need to accept that.

That doesn't mean you need to accept it blindly, or uncritically. Cara can still decide which kneading machine she employs, and how she uses it, but she should at least accept that the machine can do certain things better than she can.

## Craft coding in practice

So, what does this craft coding look like in practice? Let's separate the general philosophy from the main piece of advice I'm giving. Calling yourself a "craft coder" requires levels of self-importance that even I cannot rise to, but I may need a clear, simple phrase to summarize how a piece of code came to be. For that, we might use the more prosaic "Hand-written, AI reviewed" to summarize the key practice. "Craft coding" encompasses this but refers to the broader philosophy of (a) intrinsically valuing code quality and (b) accepting every tool that unambiguously brings you closer to that ideal.

The simple advice for now, given the state of current models, is not to let AI _do_ anything. You only let it critique what you've done, and you implement its suggestions if you agree. The best metaphor, again, is that of a code review by a senior programmer. 

You can do this however you like, but if you want some clear lines you should not let yourself cross, here are 10 dogmas of craft coding.

1. No AI in the IDE. That includes LLM-driven autocomplete. Every character of every line is written by one of your fingers hitting a key on the keyboard.
2. Preferably, don't give the AI access to the codebase. Copy-paste snippets of your code in the web interface. If the AI does have access to the codebase, this access is read-only.
3. Don't let the AI run anything. It suggests, you run.
4. Don't copy-paste code out of the AI chat box.
5. Don't use AI to do anything that plain search can do. 
6. Read the documentation before you ask the AI. 
7. Ask the AI for solutions only if you cannot solve it yourself. Give yourself some time to think. 
8. Check your code yourself before you ask the AI to review. Do your best to minimize mistakes.
9. Run the code to check for problems, then let the AI review find the rest.
10. Don't implement a suggestion you don't understand.

I don't follow all these religiously. My main sin, when I'm being lazy, or I'm too tired to think deeply, is to write sloppy code and to let Claude debug it for me without doing a pass myself.

There is a danger of deskilling here if I do this too much. Then again, in a hand-coding setting, I would either not write anything at all in that state, or bash out the messy sketch code, and leave the checking to later. This way, AI coding allows me to do a little more work when I'm not at my sharpest, at the risk of sliding into deferring to the machine all the time. In any case, I know what the ideal is, and I do my best to push in that direction. 

## What it will do 

If you're a vibe-coder, this is asking you to give up a lot. There are still time savings in craft coding, but they are definitely more modest than those of vibe-coding. The main benefits lie elsewhere. 

**The code becomes better.** I could out-code some of the early AI models, but that time is long past. As a code reviewer, Claude Fable is definitely superhuman. It spots most mistakes without needing to run the code. It spots _many_ runtime bugs that I would never have caught myself. And it often has good suggestions. 

**It is _required_ for security.** This is a subset of the above point, but it bears highlighting. Humans do not write secure code. That was never a problem, because if we are not great at finding deep security problems, that cuts both ways, and the problems will, by and large, stay hidden. But a new entity has entered the chat. An entity that can very quickly find problems that we would never spot. You don't have to agree that AI has greater intelligence, just that it's different. 

In recent months we have seen Mythos/Fable [raise sufficient scurity concerns](https://www.theguardian.com/technology/2026/apr/22/what-is-anthropic-mythos-ai-threat-global-cybersecurity) to make the US government step in. This release was followed by a wave of AI-assisted [breaches](https://www.cnbc.com/2026/08/14/data-breaches-surge-2026-ai-cyberattacks.html) and [exploits](https://www.reddit.com/r/cybersecurity/comments/1tys5z7/ai_agent_uncovers_21_zerodays_in_ffmpeg_chrome/). Then, last month, we found out that OpenAI and Anthropic's models are actively circumventing their restraints [[OpenAI](https://www.politico.com/news/2026/08/05/openai-models-shared-hacking-tips-secret-messaging-board-hugging-face-breach-01026750), [Anthropic]((https://www.anthropic.com/news/investigating-incidents-cybersecurity-evals)] in ways that their maintainers did not foresee.   

This means that in the age of AI, hand-written code is simply not safe. It will contain problems that we will never spot and that an AI-powered attacker can exploit effortlessly. Programmers need to loop AI in somewhere, somehow, or the game becomes laughably asymmetric. 

If you think you are special and different and you can write secure code every time, I beg you to let a modern AI model review it. Maybe I'm wrong in your case, and you can get in touch to gloat. I'm sure a few of you are good enough for that. I'm also sure it's not the majority of you, and the majority of coders is where the majority of code comes from.

**Development speeds up.** Again, compared to vibe-coding, craft-coding is still very slow. Compared to hand-coding, however, what you lose are those bugs that stop development in its tracks for weeks. The bugs that require whole new scripts and scaffolding to track down. For me, that's still a meaningful saving. It means that with a few afternoons blocked per week I can still do meaningful work.  

**It stops you from losing track of what your code does.** For scientific code, this is really important. You need the whole codebase in your head. Every corner of it needs to be loaded into working memory. This is tough to do at the best of times. If you vibe-code, it is no longer possible. Little functions and classes will crop up without you knowing whether you asked for them and forgot, or whether the AI just inserted them at some point for some reason.  

**It prevents (most) deskilling.** Code reviews are not just good for the quality of the code. They are also an excellent way to transfer skills from a senior to a junior dev. It's a really good teaching channel, because you're talking about something that the junior has just written themselves. It's all loaded up in their head and they can immediately understand anything you say about it. None of it will feel abstract.

With AI, you are the junior. The way things are going, you will always be the junior. That's the bitter pill. There is no graduating to senior anymore, where you get to teach the young'uns how to code. All that's left is to keep learning. However, the alternative is the Guitar Hero equivalent of coding: an infinitely fun game that makes you feel hugely powerful and creative, while removing all the difficulty and friction that cause you to actually learn anything.

With craft coding, not only do you prevent deskilling, you are actively learning. Like I said, the suggestions from Claude are usually genuinely good, and even if they aren't, you are still judging for yourself whether to implement each one. Since everything filters through your active attention, you keep learning.

**It limits environmental and financial impact.** The environmental impact of AI is hotly discussed. The industry as a whole is having a worrying impact, and there is a real lack of transparency about energy use. For full-time vibe-coding, the costs are not negligible [2], and some companies are apparently finding that [AI is more expensive than people](https://www.forbes.com/sites/jemmagreen/2026/07/02/ai-costs-more-than-the-people-it-replaced/). 

With craft coding this concern becomes minimal. A single, modest chat with Claude is enough for several days of coding. The basic $20/month plan pays for this and the environmental impact is less than that of the coffee you drink while coding [3]. 

This is also something of a middle ground if you find it difficult to stomach giving AI companies your money. Right now, those $20/month subscriptions are not what's keeping them afloat. If you want them to fail in some way, or to change their ways, but still want to understand the impact of frontier models on coding, this approach is at least better than burning tokens at the rate of full-time vibe-coders.

**It incentivizes checking your code.** In most AI interaction patterns, the incentive is towards checking your own code less and less. Even if you don't want to, a little laziness and a little time pressure is enough to defer to the machine a little bit more each day. 

It probably depends on your personality type, but when I treat Claude as my code reviewer, I find myself trying pretty hard to get the code bug-free before it looks at it (I never succeed). I know it doesn't care, and there's no one there to judge me. But that goes for the Duolingo owl too, and he still manipulates millions of people into practicing their Spanish every day.

So maybe it's a little pathetic to want to impress Claude with my code, but if the alternative is apathy and deskilling, I'll take it.

[//]: # (**It promotes proper documentation instead of disincentivizing it.** One of the worst effects of vibe coding is a lack of proper documentation. I don't know if this is a broad trend, but I certainly am finding it increasingly hard to find plain HTML documentation of APIs for many projects, and the AI-related ones seem to be the worst affected.)

[//]: # ()
[//]: # (My guess is that since the AI can read the raw code, the thinking is tyhat documentation is no longer necessary. )

[//]: # ()
[//]: # (Even if you're committed to vibe coding, this is a scary development. Function documentation forces you to think about a contract. Code that hangs together in well-defined contracts is much more reliable and interpretable, even if a swarm of AI agents is doing the maintenance.)

[//]: # ()
[//]: # ()
[//]: # (When you're craft coding, comments are extremely helpful for context. You want your code to be readable _as a snippet_. If you don't let the AI read the context, the comments become a key part of interpreting what you're doing and why. And code that is readable as a snippet is, by definition, decoupled.)

**It stops you from self-delusions about being able to out-think the AI. It keeps you aligned with frontier AI abilities.** Most of the people I interact with on social media are AI critics. On balance, I find them a healthier, more agreeable crowd than the Kool-Aid gang on Twitter. Still, being an AI researcher on Mastodon or Bluesky is not without frustrations. Not to put too fine a point on it, but most AI critics seem under-informed about how AI really works, and what frontier models can really do. Most criticism of the actual abilities is based on silly examples like the AI summaries above Google searches or the free version of ChatGPT from three years ago. 

This makes some sense: if you're fundamentally opposed to AI on moral grounds, you're not going to shell out 20 bucks a month to Anthropic and keep up to date with all the latest developments. You'll check in every now and then. It's hard to blame people for that. But there are two serious problems with this approach.

First, AI moves fast. To keep up with progress, you need to check carefully, every few months at least. Second, you have an ego-incentive not to check too carefully. Especially if you're a hand-coder. Even if you're very honest with yourself, there will be something in you that doesn't want to know that a machine is outrunning you. If you're not _very_ disciplined, this something will stop you from checking quite as carefully as you would otherwise have done.

In this sense, craft coding keeps you honest. You still write your own code, one character at a time. It is still entirely yours, and you still understand every detail. But there is always that step of copy-pasting it into the Claude chat window and asking it if it can spot any problems. 

Ask yourself---if it really is just a parlor trick---why you don't want to do that, at least every now and then?

## What you still lose

The story is not all sunshine and roses. Deskilling is real, even if you use AI in a minimal fashion. What I learned to do in my PhD was to spend a week, 8 hours per day, debugging code. Even code I wasn't sure had a bug. That was a whole skillset, it came with its own kind of creativity. It required persistence. With craft coding, that is mostly lost. If you have a deep bug, Claude Fable will just tell you. If AI ever disappeared for some reason, you would be shocked at the effort required to find these bugs yourself.

<aside>I'm sure there are bugs that are so deep that it takes Fable many days and lots of interactive debugging to find them, but that is the world of AlphaGo playing against itself: a world of intellectual depth that now exists that we cannot be a part of.</aside> 

This is why I hedged above and said it prevents _most_ deskilling. Note, however, that I didn't say it _reduces_ deskilling. It's not about minimizing the harm. For the skills you still use, you will increase your skills, since the code reviews can show you things you didn't know or didn't think of. Only the skill of real deep, grinding debugging will probably fade. It's not nothing, I'm sure there are many benefits to learning that process. But then many skills are lost as technology progresses. Maybe this is one we can afford to let go of.

## What it won't do

There are many things that craft coding won't do for you. It won't feel like magic. It won't sick up that programming language you've been thinking about building for the past 10 years, at the cost of 6 hours of tokens. But maybe it's time to accept that the world doesn't need another programming language. Or if it does, that it also needs somebody to put in the time of maintaining and popularizing that language. And that goes for most of the things that you can magically vibe-code into existence. If you don't have the time to maintain them and nurture them, you should keep them in your fantasies where they belong. The building time was never the bottleneck. The maintenance time is, and that is still a human job.

If your company is doing the equivalent of selling bread to supermarkets, craft coding is going to be a hard sell. Mostly, companies won't care about the inherent quality of code, or about how well their programmers understand every line of their codebase. They'll care about the aggregate stats. Does it sell. Do the customers swallow it?

But, just like Cara the craft baker finds her niche in people who are tired of the homogeneity of supermarket produce, so there is a niche for craft coding. I believe that scientific code, specifically the code that implements the experiments that we report on in our papers, should be craft coded. Not because AI is bad for you, and we should minimize its use. Not because science should be accelerated, and we must embrace AI for all it's worth. But because if we use AI in the right way, the code will contain fewer mistakes, and the science will become more reliable. Everything else is of secondary concern.

## The ethics of the thing

Well, almost everything. In science, the ethics of our methods should be of greater concern than the results they provide us with. If a result can only be obtained unethically, then we don't obtain it.

For me, the conclusion so far is that I'm not happy with the way AI is built, but (a) I do see that it could be built better if we really wanted to and (b) a lot of the criticism, while not based on nothing, is being blown out of proportion. Those are strong claims, but I'll have to substantiate them in a future essay.

For now, I'm putting AI in the category of things I can use reluctantly. I don't fly or drive or eat meat, so that category is smaller than it may be for most people. It does include eating cheese, and having packages delivered to my door instead of to pickup points. It includes buying things from Amazon if they aren't available elsewhere and it includes not deleting my Twitter account. Feel free to make your judgments. The point is we all decide to do some things we know are bad for one reason or another. Maybe because there are worse things, maybe because we think they are not inherently bad, just badly executed for the time being. 

[//]: # (I think craft coding makes an acceptable compromise. The issue of software security shows this most crisply. In a world of modern AI, hand-written code cannot be trusted in production anymore. That means the choice is between vibe-coding and craft-coding. Craft coding minimizes the reliance on AI, the deskilling and the environmental impact. Perhaps, if we accept that AI can be used in a way that makes our code better than it has ever been, if we accept that AI is a useful and even a necessary tool for code quality, then we can even start to think about how to build it ethically.)

## Beyond the current regime

Maybe these are all just temporary fixes. Maybe by the end of 2027, AI can do and check at the same time, for a long time, without any sudden failures and the above philosophy falls down. If that happens, however, there isn't much that we can contribute anymore anyway. The need for programmers and scientists will drop by a factor of 10 or 100 or more, and it's hard to predict what things will look like after that. Broadly, there are two options.

First, no human cognitive skills will be required anymore, and we will defer to the machines in all aspects, with all the associated risks. If that is the case, we may as well invest in the skills and activities we enjoy, because working for our own entertainment will be all that's left.

Second, some new set of skills will emerge. Something that people can do that machines can't or won't be trusted to. We don't know what these skills will be. They could be creativity and long-term planning, but I wouldn't bet the bank on it. In any case, we're no good at teaching those, certainly not at universities. 

<aside markdown="1">For a more in-depth analysis of what we may do after AI reaches human levels of long-term reliability, see my other essay [The Experience Feedback Loop](/blog/experience-feedback).
</aside>

People often point to the calculator---I did so myself at the start---as something that came along and made a skill obsolete. The implicit conclusion being that when the calculator came along, kids were better off not learning mental arithmetic, because we were preparing them for a world that had calculators in it. But were they really? Even now, imagine two colleagues, largely similar but one is skilled at mental arithmetic and the other isn't. Do you really think of the second one as having a useless skill, something like solving a Rubik's cube: helpful to make you look smart, but otherwise pointless? Or does it actually come in handy, at least in technical professions: in helping you think through problems and analyse things on the hoof? The benefit may be smaller than before the calculator, but it's not nothing. 

Similarly, when the ability to read and write code by hand becomes no longer strictly necessary, it might still be a useful skill to have. Something you don't _need_ for your job, but that can still set you apart. Something that can give you a deeper understanding of the job you're hired to do.

Since we don't know what skills _will_ be fundamentally necessary, why not invest in those that give us joy, and those that have a decent probability of offering some benefit in the future, among whatever skills survive as AI improves.

Beyond that, I hope that this approach can help to create some center ground in a rapidly polarizing area. 

In recent weeks:
* Codeberg [has come out strongly and broadly against AI coding]. The policy focuses mostly on vibe coding, but included in the type of projects that should consider themselves on borrowed time are "Projects heavily tied to the LLM ecosystem." Moreover, the arguments given for the policy make it clear that this is not just about protecting their resources, but about pushing back against AI existing at all.
* Debian started [a vote](https://www.debian.org/vote/2026/vote_002#proposerg) consisting initially of a Brexit-style choice between two extremes: disallow AI or embrace it. Happily, since then, the vote has expanded to include many options. One of them, option G, allows AI for review of human written coding, which aligns well with what I argued for above. 
* Linus Torvalds [has come out in favor of allowing AI tools](https://lore.kernel.org/linux-media/CAHk-=wi4zC+Ze8e+p3tMv8TtG_80KzsZ1syL9anBtmEh5Z40vg@mail.gmail.com/). The furore around this post made it look like he was arguing in favor of all AI coding, but the _context_ of the discussion was about _review_ tools. Elsewhere, [he has stated](https://www.theregister.com/software/2025/11/18/linus-torvalds-vibe-coding-is-fine-but-not-for-production/2708038) that vibe coding is harmless so long as it's not used for anything important. Interpolating between these positions, we can surmize that for kernel code, he's probably a craft coder by the terms of this essay, while allowing a little extra elbow room for other people to make up their own mind. Note that the tool under discussion catches [over 50% of bugs that human reviewers missed](https://github.com/sashiko-dev/sashiko#quality-of-reviews). 

In short, there is a heated discussion, with much polarization, but as ever the most important and productive steps are made in the center ground. 

The security issue makes the dilemma most clear to me. I no longer consider hand-coding a viable approach for safety-critical software. Not when we have access to a genuine super-human code reviewer who can instantly spot deep bugs that we may never have found otherwise. 

That doesn't mean we have to give everything over to AI. It does mean that we have to consider our options carefully. And, zooming out a bit, it means that we have to resist our insatiable hunger for polarization. This is not a two-side issue. Few issues are. There is a great middle ground, full of intelligent, interesting and exciting opportunities. So long as we are careful, and we don't stop using our brains, the solutions are all right there.

## Coda: craft-writing this post

To practice what I preach, I "craft-wrote" this blog-post. I wrote and checked a first draft and then asked Claude Fable to proofread it, fact check it and give me a general critique. If you like, you can read the original draft [here](craft-coding-first-draft).

It found many typos, of course, and some failures in English idiom. More interestingly, it flagged some overstated comments, and things I should really substantiate, which led to the footnotes below. This is perhaps the main benefit of a review phase in building anything. It forces the tired part of you that wants to be finished, and the excited part of you that wants to publish, to be quiet for just a bit longer, and it gives you a way to inspect the thing you've done critically one last time. It doesn't matter that much what the critique is, the act of reading it, finding the targets of it in your text or code and thinking about whether you agree are enough to live with your work for just a little bit longer.  

Claude's most helpful general critique was that the intended audience drifts a little, and that my attitude to the audience is a bit unfair (whether they're vibe-coders or AI skeptics). I've fixed the latter part, and minimized the drifting audience a bit at the start. But really, I kind of like that rambling aspect of my prose, so I decided not to listen to Claude too much in this instance.

## Footnotes

[1] One source of evidence for this is a report for the UK houses of parliament called "[Grievances complained of by the journeyman bakers](https://dn760002.eu.archive.org/0/items/b22352673/b22352673.pdf)". Apparently, this report is famous because it was reported on by Marx in an article for [Die Presse](https://wikirouge.net/texts/en/Bread_Manufacture_(Marx,_1862)) and later in [Das Kapital](https://www.marxists.org/archive/marx/works/1867-c1/ch10.htm#S1) (search for "perspiration" in either source).

[//]: # (When the first technologies came in that prevented these unhygienic practices &#40;not kneading machines, so much as [Aerated bread]&#40;https://en.wikipedia.org/wiki/Aerated_Bread_Company&#41;&#41; Marx himself, the original anti-capitalist, seems to have been much in favor. For the _Die Presse_ article:)

[//]: # ()
[//]: # (<blockquote>The triumph of machine-made bread will mark a turning point in the history of large-scale industry, the point at which it will storm the hitherto doggedly defended last ditch of medieval artisanship.</blockquote>)

[2] This line originally said that full-time vibe-coding was only sustainable due to heavy subsidization of tokens. This is a common view, but after looking into it, I think it's wrong. There is certainly a huge gap between spend and income in AI companies, but it's probably not coming from subsidizing tokens for power users.

To show the gap, here is [a handy website](https://isaiprofitable.com/). It illustrates that the gap runs in the hundreds of billions for some companies.

On the subsidized tokens, [here's a post](https://martinalderson.com/posts/no-it-doesnt-cost-anthropic-5k-per-claude-code-user/) by a user skeptical of an earlier claim by Forbes of a factor of 25 ($200/month users getting $5000 of compute). By a different route, they arrive at a subsidization of $300 per month, and that's only for users who manage to consume a huge amount of tokens. Mostly, the article argues that the API cost of tokens is substantially higher than cost, which is where Forbes probably went wrong. 

Another piece of evidence is Copilot's [recent change](https://techcrunch.com/2026/05/30/what-a-joke-github-copilots-new-token-based-billing-spurs-consternation-among-devs/) from flat-rate to usage-based billing. For some heavy vibe-coders, this meant that they went from $30 to $750 per month. That's evidence that some companies, for some time at least, are willing to heavily subsidize tokens to grab some user share.

On the other hand, some [recent leaked figures](https://www.wheresyoured.at/exclusive-openai-financials/) from OpenAI (published by Ed Zitron and verified by the Financial Times) suggest that API pricing is not just sold at cost, but with a margin. The revenue over 2025 was $13 billion and the cost of revenue (the direct costs of producing that revenue) was $7.5 billion, so a gross profit of about $5.5 billion. 

Note that the cost of serving users free tokens has to come under that $7.5 billion dollar cost of revenue.  

Stacked against that gross profit are Research and Development costs of $19 billion, Sales and Marketing costs of $5.6 billion and General and Administrative costs of $1.6 billion.

Put differently, if OpenAI killed all R&D (that is, fired all researchers and trained no further new models), and cut S&M by about $2 billion, they would be profitable today. Nobody seems to know what's in that S&M budget, but it's apparently unlikely that auditors would allow token subsidies to go in there.

All in all, my best guess is that the API tokens are generally sold at a profit, and the free and flat-rate tiers are heavily subsidized to capture market share, but most of the profitability gap is actually the up-front expense of training new models and the cost of retaining research talent.

<aside>One salient conclusion, if this picture is correct, is that R&D spend does not predict impact. Anthropic is eating OpenAI's lunch on a much smaller budget, and DeepSeek, whose expenses are barely visible, is regularly making waves. Is OpenAI just bloated and wasteful, or does that R&D budget hide some real operating expenses? I don't know, we're well beyond the boundaries of my expertise here. 
</aside>

[3] Let's look at water use first. One standard cup of coffee (125 ml) drunk in the Netherlands costs about [half a bathtub of fresh water](https://www.sciencedirect.com/science/article/abs/pii/S092180090700105X) to produce (140 liters). That sounds shocking, but about [96% of that is rainwater](https://digitalcommons.unl.edu/wffdocs/69/) that would have fallen on that land regardless of whether coffee was growing there or not. That leaves us with 5.6 liters of water used for irrigation, washing the coffee fruits and diluting the fertilizer (green and gray water).

<aside markdown="1">You can argue about whether the irrigation water is "used" or just returned to the water cycle, but then you can argue the same thing about evaporative cooling of datacenters. I think the more important question is how much is drawn from local sources of fresh water that could be used for other purposes. 
</aside>

The water use of AI is contested. The range of estimates runs from 0.6 ml to 1 liter [for 200 words](https://techjournal.org/does-ai-use-water-data-centers). Let's go with the upper end of that range for a conservative estimate.  

One of my recent two-day craft coding sessions resulted in a chat of about 1800 words (mine included), so at the _very_ worst about 9 liters of water consumed over two days. I consume about 3 cups of coffee per day, so the coffee costs 33.6 liters.

<aside markdown="1">This kind of water use felt hard to defend when AI was seen as a silly toy. However, if you accept the argument of the essay, it's not just a useful tool for writing quality code, but an _essential_ one. More important that the coffee.
</aside>

Next, we can look at energy use. AI companies are not transparent, and they deserve all the criticism they get for that. In our case, however, the difference is big enough that we don't need accurate numbers. 100 mL of coffee [apparently costs about half a kWh to produce](https://www.ase.org/blog/coffee-gives-us-energy-how-much-does-it-use). About a year ago, the cost of a median LLM query to Gemini was [about a quarter Wh](https://hannahritchie.substack.com/p/ai-footprint-august-2025). So even if our code review by Fable costs double that, we're still three orders of magnitude off the energy required to make a small cup of coffee.

I'm ignoring the training cost here and counting only inference. Training cost is a factor of how much use a model sees before the next model replaces it. If you're happy to keep using the current generation of models forever, you'll be fine for craft coding, and the training cost of, say, Fable will be amortized over such a long time that it becomes negligible. If you switch to the latest model whenever it's available, and Anthropic keeps training a new model every year, the energy use would go up, but it still would be negligible compared to the cup of coffee.

<aside markdown="1">Fable is probably much bigger than 2025's Gemini and it definitely "thinks" for longer. On the other hand, inference is getting more efficient at an extraordinary rate (Google [improved it by a factor of 33 between 2024 and '25](https://cloud.google.com/blog/products/infrastructure/measuring-the-environmental-impact-of-ai-inference)), so it's hard to say whether the energy cost of using Fable is higher. In any case, it's unlikely to be one thousand times as high as it was a year before. 
</aside>
