---
title: "Wanda: Agent Orchestration"
description: "Yes, another agent orchestrator"
date: 2026-05-24
period: "Feb 2026 – May 2026" 
github: "https://github.com/reecepm/wanda"
---

## What is Wanda
- A desktop app for orchestrating a fleet of coding agents. The third step after [ccqueue](/experiments/ccqueue) and [orca](/experiments/orca).
- Started life as "OrcaPods", later renamed to Wanda. Another agent orchestrator launched with "Orca". So I decided to rename after the first killer whale which was taken into captivity.
- The jump from orca: orca coordinated *tasks*; Wanda coordinates the *agents themselves* and surrounding developer environments, spawning, watching, and driving them from one place, across machines. 
- I will probably open source this at some point, I just don't have the time to clean up all the loose ends and broken bits right now.
 
This is the build-log companion to the [blog post](/blog/wanda-agent-orchestrator).

![Wanda](/screenshots/wanda/basic.png)

## Why did I build it
- orca solved task coordination but I was still spawning agents by hand and pointing them at skills. Atomic tasks especially were slow and frustrating to babysit. 
- CLI-based agents were (and still kind of are) the primary way to interact with coding agents.
- CLI provided a consistent foundation for running all types of coding agents, even if they had different setups like hooks, auth, etc.
- The wishlist that orca couldn't answer:
  - tasks that automatically spawn agents
  - a single central view to watch all of them at once
  - managing agents across multiple devices
  - having consistent developer environments spawned for each agent within a project.

## Technical details
- **Pods / containers.** Used docker containers to spin up multiple envs on 1 machine. Eventually rewrote to just lie on top of OrbStack machines because it suited my workflow more and at that point I wasn't interested in productizing for other users.
- **Terminal instances + PTY.** Driving agents over PTY rather than a custom UI. I love apps like Conductor and T3 Code removing this layer, but as we've now seen with Anthropic, not all providers are intending to support outside of their own tooling.
- **View system.** Switch between focused single-agent view and higher-level views; canvas and carousel layouts across multiple agents. Leans on existing react frameworks here for some.
- **Worktrees & git.** An optional worktree per pod, with branch and stack controls; in-app diff/review and change stacking.
- **Workspace templates.** Fresh pods derived from reusable workspace templates. Simply a template version of the same data model to do simple duplication.
- **Task management.** A private task list that drives the agents. Initially was powered by an orca sidecar, however, eventually ripped out to a simpler in-app solution. Primarily due to the sync model I previously wrote about having issues with. I could have spent time here improving orca's sync model and also to have actual typescript packages instead of the sidecar - but I opted for just rebuilding. 
- **Agent assistant.** Idea was to have a quick interface to be able to operate the app with natural language. In principle it worked decently well but 9 times out of 10 it was faster for me to use shortcuts and do it myself. 
- **MCP.** App-wide MCP surface using codemode. Allowed any agent to hook into the task system but also do things like restart terminals, spawn pods, etc. Concept was there - MCP needed more refinement. Also powered the high-level assistant mentioned above. 
- **Remote orchestration.** Local + remote instances went through a few iterations. Started as SSH, but eventually scrapped it since it didn't allow me to do the full "build machine from scratch" following the docker method. Eventually just became each instance being a "server" that any others could connect to and be broadcasted events. Did it cross-machine on tailscale between my laptop and mac mini. SSH was the north star but only would have made sense if I could figure out spinning up the dev envs.
- **DAG workflows (removed).** Chaining dependent tasks across agents and automating actions. The engine was custom — I'd first built it for a side project a year or two ago, then dusted it off and updated it for this. The front end was wired up with React Flow, and there was a YAML format so agents could author the workflows themselves, though that part never proved very useful. Built, then later removed. 
- **Tech stack.** Electron, React, TypeScript, Effect, Drizzle, orpc with tanstack query, zustand, few other bits.

<figure>
  <video src="/screenshots/wanda/current/view-system.mp4" autoplay muted loop playsinline preload="metadata"></video>
  <figcaption>The view system — drop into a single agent, or pull back to watch the whole fleet at once.</figcaption>
</figure>

## What were my findings
- Everyone clearly was walking on the same patch of grass: [blog post](/blog/wanda-agent-orchestrator). Still not able to entirely stop using wanda due to papercuts on other apps, but hopefully one gets there soon.
- View system is the single biggest feature I think others need. So useful to have higher level views of what's happening, especially when you're running multiple agents at once. Some others have played with this by going canvas-only or parallax-only but the view system allows the flexibility.
- DAG workflows (removed) were a nice idea but I preferred to give control to the agents as/when to spawn dependent tasks. Didn't have many other use cases. 
- Remote / multi-device I ended up using less than I thought. I still think SSH with robust developer environment configuration is the north star. Some others are building cloud so it's kind of in this vein, we'll see how it goes.
- MCP and tasks carried over decently conceptually from orca but I ended up using tasks far less once I had better visibility.
- I over-indexed too early on making it general and missed concepts like Graphite (stacked PRs) which were core to my own personal workflow.
- Vibe coding had a very mixed result. Early on I did not look at the code once, apart from defining a bit of the data modelling. Eventually looked under the hood and it was expectedly, chaos. Hadn't set strong enough guardrails. Once I introduced them, the agents were pretty good at following patterns. Effect and strong TypeScript guardrails helped a lot too. Still not perfect and it's obviously vibe coded software.. but it was far better than before. If I were to rebuild I'd have put more eggs in this basket early, and probably been much more hands on at those early stages to set good standards for the agents to build from.

<figure>
  <img src="/screenshots/wanda/current/git-diffs.jpg" alt="Wanda diff and review" />
  <figcaption>Reviewing and stacking changes without leaving the app.</figcaption>
</figure>

## What's next
I want other tools to take over my workflow. I don't think we're quite at the point of "personal software" where I can justify developing Wanda forever. 

I'll likely switch back to a model of focusing on building more agnostic "side tools" which can work across agents and leave the agent environment to other tools. The dream of course is still an all-in-one but I don't think it's realistic to expect the quality to be there for these tools. 

The way I see it:
- Side tools are agnostic to the agent environment and harness
- Even if I went all in on say, codex or claude desktop, these tools still will work
- Will be far more purpose-built for certain workflows (e.g. pr reviews)
- They'll be smaller, so easier to maintain, and lower commitment
- Can get more wild with experiments rather than worrying about it fitting Wanda
