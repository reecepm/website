---
title: "orca: Coding agent task management"
date: 2026-04-12
description: "Client-server distributed task management for coding agents"
github: "https://github.com/reecepm/orca"
period: "Jan 2026"
---

## What is Orca
Orca was an experiment I ran in January 2026. It was a distributed task system designed to decouple entirely from Claude Code and allow tasks to flow into multiple agents, via multiple machines. Client-server approach to allow it to work in any app I wanted.


![orca running in the terminal](/screenshots/orca/basic.png)

The difference to ccqueue, is that it had a core focus on client-server setup so that I could use it across multiple machines or remote instances. For example, I could spawn a remote cloud instance, hook it up to an orca server, and pick up individual tasks there.

## Why did I build it
Claude code at this point still did not have shared tasks across agents. I was actively investigating multi-machine workflows and was still heavily relying on spec-based development where specs would be split into atomic tasks via ccqueue.

The old solution was not able to achieve this due to entirely being client-focused. It had some correct core assumptions but I found it easier to start fresh than rejig the solution.

I saw this as an opportunity to rethink this system from the ground up, considering future possible extensions. I quickly landed on a client-server system which I aimed to be swappable with different solutions. Swap out storage, comms protocol, and things would still be fine. 

## Technical details

- Orca was built much more around the primitive of swappable seams. Everything has a contract and a test suite, so it can be extended in any way you like. 
- Transport can be swapped: in-process, gRPC, HTTP
- Storage: memory, SQLite, or Postgres. e.g. I used SQLite for local sync, but Postgres for my Railway remote sync db.
- Client mode: embedded, remote or hybrid (background sync).

Beyond the primitives:
- API-first. Protobuf defined. gRPC server with a gRPC-gateway HTTP/REST layer on top, and Go + Typescript clients generated from the protos.
- Entities: Workspace -> Project -> Task -> Attempt. Agents and Leases for heartbeat and claiming.
- Beefier state machine than ccqueue with retry and dependency-driven ready states via DAG.
- Leases were the new concept which replaced ccqueue's broken heartbeat system. Claiming a task handed back a TTL lease and the agent was expected to renew it while working. If the agent didn't ping, the lease expired, and the task became available with ready state again. It was on whatever client which was consuming it to keep this alive. Easiest setup was just to have a claude/codex hook to keep tasks alive for an agent.
- Codemode MCP. Instead of a full fleet of MCP tools, one execute() tool which ran JS against an orca global inside a node vm sandbox (30s timeout, no fs/process/network, full TS types in the tool description). One call could run through a whole multi-step flow if the agent wanted to.
- Sync.... this ended up being a nightmare but was built as a core concept. v1 was event-sourced bidirectional sync. HLC clocks, three-way merge, giant bloated code. Had crazy amounts of bugs when used in production and couldn't build a reliable enough testing harness to simulate random, realistic scenarios to increase reliability. Even when I got close, odd things would still happen. 
- V2 of sync I deleted it all and just built a server-authoritative write through model. Server was the single source of truth, with 0 merge logic. Offline writes go to a persistent SQLite backed FIFO queue and drain in order on reconnect. Server rejects ones that now conflict (e.g. task already claimed). The server streams every change back to clients, which keep a local cache. Model was slightly more reliable but again buggy and probably overkill. 
- Push distribution was possible but underutilised. Idea was for round-robin vs least-loaded vs capacity-based vs manual distribution, via agent tags for targeted distribution. Barely used in the end.
- Idempotency keys for safer retries.
- Local daemon auto-spawns and proxies. Allowed multiple clients e.g. desktop app, cli, etc on same machine.
- In the attempts to fix sync robustness, lots of throwing fleets of agents to try to build up the e2e test suite for better robustness. Chaos, fault-injection, soak, convergence-property... still didn't stop the bleed. Symptom of vibe coding.


## What were my findings
- Codemode MCP is incredibly good. Agent has way more power and can express itself much more naturally doing things like bulk tasks. Was a little tricky to debug when it ran into issues however.
- Agents just "got it", across all interfaces. 
- Big parallelisation unlock.
- Skills really helped agents go from nothing -> spec -> tasks.
- Atomicity made results reliable. Standards followed better. Much slower though as it often would re-read the same skills/docs.
- Spreading the tasks across devices was extremely effective for certain projects, but limited in others. 
- Lease lifecycle is good in principle but making sure every agent heartbeats properly was annoying to hook in well. Coding agents all have different ways of "keeping alive" and there's no central "hook system". Every time I added a new agent e.g. codex or cursor, I would have to build out a new way to handle the leases lifecycles.
- Sync is hard and probably overkill. Should've known from my mobile app development times. Multiple rewrites, agents throwing a ton of e2e tests in, and still bleeding. This was a limit test of the agent capabilities for me. If I threw more agents at the problem it might have been solved, but I just wanted it to "work", not spend hours engineering an experiment.
- Next time would use an out the box sync solution or opt for remote vs local only and no in between. 
- Client-server was the correct approach.


I still needed an extra step past this. I was spawning agents manually, pointing them to orca skills to pick up the tasks. Fine for bigger chunks of tasks, but the atomic tasks, it was very frustrating, slow and hard to manage. Cue Wanda!
