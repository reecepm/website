---
title: "We're all building the same agent orchestrator"
date: 2026-04-14
description: "Wanda: Landing on the same agent orchestrator as everyone else"
---

![Wanda](/screenshots/wanda/basic.png)

For 2 months, I've been building an agent task orchestrator as a side project. Turns out, so has everyone else. 

Everyone building the same idea is not news in the AI era. First, everyone was building a "chat with PDF" app. Then along came the "GPT wrappers". Eventually along came AI meeting note takers, then last year was vibe-coding app builders. 

Each wave followed the same arc. Dozens of independent teams converge on an almost identical product, differentiate on vibes, and a handful of winners emerge.

Fast forward, and now it's agent orchestrators and agent sandbox startups.

<style>
.ide-wall { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.55rem; margin: 1.7rem 0; }
@media (max-width: 540px) { .ide-wall { grid-template-columns: repeat(2, 1fr); } }
.ide-wall figure { margin: 0 !important; }
.ide-wall figure img { width: 100% !important; aspect-ratio: 16 / 10; object-fit: cover; object-position: center top; display: block; margin: 0 !important; border-radius: 8px !important; border: 1px solid color-mix(in srgb, currentColor 16%, transparent) !important; transition: opacity 150ms ease; }
.ide-wall figure img:hover { opacity: 0.85; }
.ide-wall figcaption { font-size: 0.72rem; opacity: 0.6; text-align: center; margin: 0.35rem 0 0 !important; }
</style>

<div class="ide-wall">
  <figure><img src="/screenshots/agent-ides/conductor.webp" alt="Conductor" /><figcaption>Conductor</figcaption></figure>
  <figure><img src="/screenshots/agent-ides/t3code.webp" alt="T3 Code" /><figcaption>T3 Code</figcaption></figure>
  <figure><img src="/screenshots/agent-ides/air.png" alt="Air" /><figcaption>Air</figcaption></figure>
  <figure><img src="/screenshots/agent-ides/superset.png" alt="Superset" /><figcaption>Superset</figcaption></figure>
</div>

## How I ended up building the same thing as everyone else

In December, I vibe coded [ccqueue](https://github.com/reecepm/ccqueue): a queue-based task system where agents pull and execute atomic tasks until the queue is empty. Cool, but limited. So I built [orca](https://github.com/reecepm/orca): a client-server approach more akin to traditional task management systems like Linear. Workspaces, projects, dependent tasks. Leases and heartbeats so agents couldn't claim the same tasks. MCP.

This was also my first small taste of others building the same thing. Shortly after, [overseer](https://github.com/dmmulroy/overseer) by [@dmmulroy](https://x.com/dillon_mulroy), [dex](https://github.com/dcramer/dex) by [@zeeg](https://x.com/zeeg) and others popped up. Cool to see others had found similar solutions effective.

But I kept wanting more. What if tasks automatically spawned agents? What if I had a central view for watching all of them? How do I manage agents across multiple devices? 

I started building my own app, Wanda. Again vibe coding, with oversight of some data modelling and tech choices but very hands off. Before long I had terminal instances, a view system for different focused and higher level views, DAG workflows, MCP, hacky docker pod spawning, and remote orchestration from my MacBook to my Mac Mini.

<style>
.oc-carousel { position: relative; overflow: hidden; margin: 1.7rem 0; }
.oc-carousel .note { font-size: 0.78rem; line-height: 1.5; opacity: 0.85; border: 1px solid color-mix(in srgb, currentColor 22%, transparent); border-radius: 8px; padding: 0.6rem 0.85rem; margin: 0 0 0.7rem; }
.oc-carousel > input { position: absolute; width: 0; height: 0; opacity: 0; pointer-events: none; }
.oc-carousel .track { display: flex; align-items: flex-start; transition: transform 450ms cubic-bezier(.2,.8,.3,1); }
.oc-carousel .track > figure { flex: 0 0 100%; min-width: 0; margin: 0 !important; }
.oc-carousel .track figure :is(img, video) { width: 100% !important; display: block; margin: 0 !important; border: 0 !important; border-radius: 10px; }
.oc-carousel .track figcaption { font-size: 0.8rem; opacity: 0.72; margin: 0.5rem 0 0 !important; }
.oc-carousel #oc1:checked ~ .track { transform: translateX(0); }
.oc-carousel #oc2:checked ~ .track { transform: translateX(-100%); }
.oc-carousel #oc3:checked ~ .track { transform: translateX(-200%); }
.oc-carousel #oc4:checked ~ .track { transform: translateX(-300%); }
.oc-carousel .arrows { position: absolute; left: 0; right: 0; top: 2.7rem; bottom: 1.9rem; pointer-events: none; }
.oc-carousel .arrow { position: absolute; top: 50%; transform: translateY(-50%); display: none; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 999px; background: rgba(18, 18, 22, 0.5); color: #fff; cursor: pointer; pointer-events: auto; backdrop-filter: blur(2px); transition: background 150ms ease; }
.oc-carousel .arrow:hover { background: rgba(18, 18, 22, 0.72); }
.oc-carousel .arrow svg { width: 16px; height: 16px; }
.oc-carousel .arrow.prev { left: 0.7rem; }
.oc-carousel .arrow.next { right: 0.7rem; }
.oc-carousel #oc1:checked ~ .arrows .n2,
.oc-carousel #oc2:checked ~ .arrows .p1,
.oc-carousel #oc2:checked ~ .arrows .n3,
.oc-carousel #oc3:checked ~ .arrows .p2,
.oc-carousel #oc3:checked ~ .arrows .n4,
.oc-carousel #oc4:checked ~ .arrows .p3 { display: flex; }
.oc-carousel .dots { display: flex; justify-content: center; gap: 0.5rem; margin-top: 0.7rem; }
.oc-carousel .dots label { width: 7px; height: 7px; border-radius: 999px; background: currentColor; opacity: 0.28; cursor: pointer; transition: opacity 150ms ease; }
.oc-carousel .dots label:hover { opacity: 0.55; }
.oc-carousel #oc1:checked ~ .dots label:nth-child(1), .oc-carousel #oc2:checked ~ .dots label:nth-child(2), .oc-carousel #oc3:checked ~ .dots label:nth-child(3), .oc-carousel #oc4:checked ~ .dots label:nth-child(4) { opacity: 0.95; }
</style>

<div class="oc-carousel">
<input type="radio" name="occ" id="oc1" checked />
<input type="radio" name="occ" id="oc2" />
<input type="radio" name="occ" id="oc3" />
<input type="radio" name="occ" id="oc4" />
<div class="note">Early OrcaPods, an old version from before the rename to Wanda. This is not the current product, it is just where it started.</div>
<div class="track">
  <figure>
    <video src="/screenshots/wanda/early/containers.mp4" autoplay muted loop playsinline preload="metadata"></video>
    <figcaption><strong>Containers and view system.</strong> Spawning agents into Docker pods, each with its own set of terminals.</figcaption>
  </figure>
  <figure>
    <video src="/screenshots/wanda/early/dag-workflows.mp4" autoplay muted loop playsinline preload="metadata"></video>
    <figcaption><strong>DAG workflows.</strong> Chaining dependent tasks across agents and automating actions, later removed.</figcaption>
  </figure>
  <figure>
    <img src="/screenshots/wanda/early/ui-cleanup.jpg" alt="OrcaPods workspace UI" />
    <figcaption><strong>UI pass.</strong> Tidying up the multi-terminal workspace view.</figcaption>
  </figure>
  <figure>
    <video src="/screenshots/wanda/early/chat-permissions.mp4" autoplay muted loop playsinline preload="metadata"></video>
    <figcaption><strong>Permission approvals.</strong> Driving agents and approving their actions inline.</figcaption>
  </figure>
</div>
<div class="arrows">
  <label class="arrow prev p1" for="oc1" aria-label="Previous"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></label>
  <label class="arrow prev p2" for="oc2" aria-label="Previous"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></label>
  <label class="arrow prev p3" for="oc3" aria-label="Previous"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></label>
  <label class="arrow next n2" for="oc2" aria-label="Next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></label>
  <label class="arrow next n3" for="oc3" aria-label="Next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></label>
  <label class="arrow next n4" for="oc4" aria-label="Next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></label>
</div>
<div class="dots">
  <label for="oc1" aria-label="Containers"></label>
  <label for="oc2" aria-label="DAG workflows"></label>
  <label for="oc3" aria-label="UI pass"></label>
  <label for="oc4" aria-label="Chat and permissions"></label>
</div>
</div>

Tools like Conductor (by [@charlieholtz](https://x.com/charlieholtz) and [@jacksondecampos](https://x.com/jacksondecampos)) already existed at this point, pioneering this space with strong UX. For me, my workflow lived in the terminal, so I needed something different.

## Why does everyone land in the same place?

I think every single person who has built similar has gone through a version of what I described above. The convergence isn't a coincidence, but doesn't necessarily mean we're seeing early indicators of new patterns.

1. Everyone is hitting the same friction using the same CLI tools, and feeling the same limitations. Claude Code, Codex and others are opinionated and not agnostic.
2. Existing tools don't really solve this new paradigm well. Existing IDE's were made for single-stream development.
3. We are still at a point with models where we want visibility and control. As models improve, this might reduce.
4. Claude Code has weird terms. Some are taking the risk implementing claude via ACP or Agents SDK, but terminals are safe for now.
5. Building with LLM's makes everything seem easy. Code is probably poor but it's simple to do and works so things just ship.

Everyone is walking across the same patch of grass, creating a new path. I don't think this means that we're finding the "final form" or "future of software development". I think more-so, 30 people/teams have all found their own better way to manage the current state of software development.

- "I'm already using worktrees, let's connect that to the instance."
- "I'd like to see the diffs."
- "I'm running commands/scripts constantly, I'm going to add a way to manage them."
- "I don't want to switch to my browser."

Next thing you know, you've built git integrations, diff views, runnable commands and added a browser. Repeat this a handful of times and we've all landed on a very similar setup. 

<div class="ide-wall">
  <figure><img src="/screenshots/agent-ides/emdash.png" alt="Emdash" /><figcaption>Emdash</figcaption></figure>
  <figure><img src="/screenshots/agent-ides/paseo.png" alt="Paseo" /><figcaption>Paseo</figcaption></figure>
  <figure><img src="/screenshots/agent-ides/soloterm.png" alt="Soloterm" /><figcaption>Soloterm</figcaption></figure>
  <figure><img src="/screenshots/agent-ides/super-engineering.png" alt="Super Engineering" /><figcaption>Super Engineering</figcaption></figure>
</div>

---

## The shared feature set

I think there's a foundation that everyone converges on, then sprinkles their own taste on top. Regardless of whether they're open source, VC funded, or an incumbent like Cursor or JetBrains. 

If you want to join the party and build your own, they all come down to roughly this:

- **Environment & execution:** Local and remote instances/SSH, Docker, sandboxing, terminals, runnable scripts/commands per instance.

- **Agent control:** Agent integrations (via PTY or UI), task management, MCP for the whole app, a view system to switch between single-thread and multi-agent views.

- **Developer workflow:** Workspaces, worktrees and git integration, built-in code editor, diff/review mode, knowledge centralisation (skills, rules).

- **Extended features:** Mobile app, embedded browser with interactive highlighting.

<style>
.oc-carousel #wc1:checked ~ .track { transform: translateX(0); }
.oc-carousel #wc2:checked ~ .track { transform: translateX(-100%); }
.oc-carousel #wc3:checked ~ .track { transform: translateX(-200%); }
.oc-carousel #wc4:checked ~ .track { transform: translateX(-300%); }
.oc-carousel #wc5:checked ~ .track { transform: translateX(-400%); }
.oc-carousel #wc6:checked ~ .track { transform: translateX(-500%); }
.oc-carousel #wc7:checked ~ .track { transform: translateX(-600%); }
.oc-carousel #wc1:checked ~ .arrows .n2,
.oc-carousel #wc2:checked ~ .arrows .p1,
.oc-carousel #wc2:checked ~ .arrows .n3,
.oc-carousel #wc3:checked ~ .arrows .p2,
.oc-carousel #wc3:checked ~ .arrows .n4,
.oc-carousel #wc4:checked ~ .arrows .p3,
.oc-carousel #wc4:checked ~ .arrows .n5,
.oc-carousel #wc5:checked ~ .arrows .p4,
.oc-carousel #wc5:checked ~ .arrows .n6,
.oc-carousel #wc6:checked ~ .arrows .p5,
.oc-carousel #wc6:checked ~ .arrows .n7,
.oc-carousel #wc7:checked ~ .arrows .p6 { display: flex; }
.oc-carousel #wc1:checked ~ .dots label:nth-child(1), .oc-carousel #wc2:checked ~ .dots label:nth-child(2), .oc-carousel #wc3:checked ~ .dots label:nth-child(3), .oc-carousel #wc4:checked ~ .dots label:nth-child(4), .oc-carousel #wc5:checked ~ .dots label:nth-child(5), .oc-carousel #wc6:checked ~ .dots label:nth-child(6), .oc-carousel #wc7:checked ~ .dots label:nth-child(7) { opacity: 0.95; }
</style>

<div class="oc-carousel">
<input type="radio" name="wcc" id="wc1" checked />
<input type="radio" name="wcc" id="wc2" />
<input type="radio" name="wcc" id="wc3" />
<input type="radio" name="wcc" id="wc4" />
<input type="radio" name="wcc" id="wc5" />
<input type="radio" name="wcc" id="wc6" />
<input type="radio" name="wcc" id="wc7" />
<div class="note">Wanda latest clips. Recorded shortly after writing this blog post.</div>
<div class="track">
    <figure>
        <video src="/screenshots/wanda/current/view-system.mp4" autoplay muted loop playsinline preload="metadata"></video>
        <figcaption><strong>View system.</strong> Switching between focused single-agent and higher-level views.</figcaption>
    </figure>
    <figure>
        <video src="/screenshots/wanda/current/worktrees.mp4" autoplay muted loop playsinline preload="metadata"></video>
        <figcaption><strong>Worktrees &amp; git.</strong> A worktree per agent, with branch and stack controls.</figcaption>
    </figure>
    <figure>
        <video src="/screenshots/wanda/current/workspace-templates.mp4" autoplay muted loop playsinline preload="metadata"></video>
        <figcaption><strong>Workspace Templates</strong> Fresh pods derived from reusable workspace templates.</figcaption>
    </figure>
    <figure>
        <video src="/screenshots/wanda/current/workspace-views.mp4" autoplay muted loop playsinline preload="metadata"></video>
        <figcaption><strong>Workspace views.</strong> Canvas and carousel layouts across multiple agents.</figcaption>
    </figure>
    <figure>
        <img src="/screenshots/wanda/current/git-diffs.jpg" alt="Wanda diff and review" />
        <figcaption><strong>Diff &amp; review.</strong> Reviewing and stacking changes without leaving the app.</figcaption>
    </figure>
    <figure>
        <video src="/screenshots/wanda/current/tasks.mp4" autoplay muted loop playsinline preload="metadata"></video>
        <figcaption><strong>Task management.</strong> A private task list that drives the agents.</figcaption>
    </figure>
    <figure>
        <video src="/screenshots/wanda/current/agent-assistant.mp4" autoplay muted loop playsinline preload="metadata"></video>
        <figcaption><strong>Agent assistant.</strong> Driving an agent inline with auto mode and MCP.</figcaption>
    </figure>
</div>
<div class="arrows">
  <label class="arrow prev p1" for="wc1" aria-label="Previous"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></label>
  <label class="arrow prev p2" for="wc2" aria-label="Previous"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></label>
  <label class="arrow prev p3" for="wc3" aria-label="Previous"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></label>
  <label class="arrow prev p4" for="wc4" aria-label="Previous"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></label>
  <label class="arrow prev p5" for="wc5" aria-label="Previous"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></label>
  <label class="arrow prev p6" for="wc6" aria-label="Previous"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></label>
  <label class="arrow next n2" for="wc2" aria-label="Next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></label>
  <label class="arrow next n3" for="wc3" aria-label="Next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></label>
  <label class="arrow next n4" for="wc4" aria-label="Next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></label>
  <label class="arrow next n5" for="wc5" aria-label="Next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></label>
  <label class="arrow next n6" for="wc6" aria-label="Next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></label>
  <label class="arrow next n7" for="wc7" aria-label="Next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></label>
</div>
<div class="dots">
  <label for="wc1" aria-label="View system"></label>
  <label for="wc2" aria-label="Worktrees and git"></label>
  <label for="wc3" aria-label="Workspace templates"></label>
  <label for="wc4" aria-label="Workspace views"></label>
  <label for="wc5" aria-label="Diff and review"></label>
  <label for="wc6" aria-label="Task management"></label>
  <label for="wc7" aria-label="Agent assistant"></label>
</div>
</div>

Most of this is trivial with agents doing the work. The hard part is strong foundations, followed by novel features and customizability.

---

## What's still missing

At this point, I am not in the game of building this for other users. Once another solution fits my workflow, I'll jump ship immediately.

- **Plugin/extension system.** It's a core concept of traditional IDE's. Clear way to develop a rich community.

- **View system, and better high level views**. Sidebar with 1 chat, or terminal tabs, is not our only option. Wanda has canvas and carousel views. This is basic, but it's a start.

- **Task management.** I don't want to connect my Linear. I want to set up my own task list that isn't being broadcast to my team.

- **Remove the need for a standalone code editor.** Built in code reviews is a good start, but need more of this.

- **Attempts at novel or futuristic workflows**.

I'm guilty of not experimenting enough myself with Wanda but did try ideas like views and DAG workflows (later removed). 

---

## Looking ahead
 
Everyone has a preferred way of working, so there doesn't have to be 1 winner here. History has shown us that developers will pick what suits their workflow best. VSCode vs JetBrains vs Neovim. Power vs simplicity. Extensibility vs opinionated. Pretty UI vs embedded in terminal.

Cursor are by far the furthest ahead with most of these features (and quality), but their business interests align differently (a non-agnostic tool). I hope that the labs don't lock us down into a single workstream (love you guys, but looking at you, Anthropic).

A year ago, building these apps would've been possible, but much more time intensive and since Claude Code was so early, we couldn't have envisioned the need. If models improve to the same degree, we could see a completely different paradigm rendering this useless. Who really knows. 

## Where that leaves me, and Wanda

For now, I'll continue adding things to Wanda for my own workflow, until one of these other solutions finally convinces me. I have other stuff I want to build instead. 

Good luck to the rest of you trying to win this space. I would love to see some of these solutions experiment more, after mastering the foundations.

Since so far, we all truly have just built the same thing.
