---
title: Football Match Analyst
date: 2026-10-17
field: agents
summary: A multi-agent system that turns a football match into a full report — player ratings, a match summary, and tactical analysis — written by three specialist agents working in parallel.
tags: [Python, Gradio, Multi-Agent, Agentic Patterns]
captions:
  01.png: 'The Gradio app: enter a match, and three panels fill in: match report, player ratings and tactics'
  02.png: Analysing the 2022 World Cup final. The three agents run in parallel
  03.png: 'Match report agent: key events, goals and turning points'
  04.png: 'Player ratings agent: the top five performers, rated out of 10'
  05.png: 'Tactics agent: formations and the decisions that shaped the game'
  06.png: The tactics agent's conclusion on what made the difference
---

## The problem

A single LLM prompt asked to "analyze this match" gives a shallow, one-angle answer. Real match analysis needs several perspectives at once: how each player performed, what happened in the game, and why the tactics worked or failed.

## What I built

A football match analysis app in **Python** with a **Gradio** interface. Instead of one big prompt, the work is split across specialist agents that are coordinated into one report. I used the project to apply five agentic design patterns end to end.

<figure class="diagram">
<svg viewBox="0 0 900 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pipeline: the router checks the query is about football, the orchestrator sends it to three parallel agents, and an evaluator refines the combined report">
<defs><marker id="fa-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="d-head"/></marker></defs>
<text x="10" y="22" class="d-tag">prompt chain →</text>
<g class="d-line">
<path d="M110 150H136" marker-end="url(#fa-arrow)"/>
<path d="M250 150H276" marker-end="url(#fa-arrow)"/>
<path d="M400 150C420 150 420 62 436 62" marker-end="url(#fa-arrow)"/>
<path d="M400 150H436" marker-end="url(#fa-arrow)"/>
<path d="M400 150C420 150 420 238 436 238" marker-end="url(#fa-arrow)"/>
<path d="M580 62C600 62 600 150 616 150" marker-end="url(#fa-arrow)"/>
<path d="M580 150H616"/>
<path d="M580 238C600 238 600 150 616 150"/>
<path d="M740 150H766" marker-end="url(#fa-arrow)"/>
<path d="M195 172V222" marker-end="url(#fa-arrow)" class="d-dim"/>
<path d="M650 128C650 92 710 92 710 124" marker-end="url(#fa-arrow)"/>
</g>
<rect x="10" y="128" width="100" height="44" rx="10" class="d-box"/>
<text x="60" y="155" class="d-t">Query</text>
<rect x="140" y="128" width="110" height="44" rx="10" class="d-box"/>
<text x="195" y="155" class="d-t">Router</text>
<text x="195" y="118" class="d-tag" text-anchor="middle">routing</text>
<text x="195" y="242" class="d-sub">not football → declined</text>
<rect x="280" y="128" width="120" height="44" rx="10" class="d-box d-hi"/>
<text x="340" y="155" class="d-t">Orchestrator</text>
<text x="340" y="196" class="d-tag" text-anchor="middle">orchestrator–worker</text>
<rect x="440" y="40" width="140" height="44" rx="10" class="d-box"/>
<text x="510" y="67" class="d-t">Player ratings</text>
<rect x="440" y="128" width="140" height="44" rx="10" class="d-box"/>
<text x="510" y="155" class="d-t">Match summary</text>
<rect x="440" y="216" width="140" height="44" rx="10" class="d-box"/>
<text x="510" y="243" class="d-t">Tactical analysis</text>
<text x="510" y="282" class="d-tag" text-anchor="middle">parallel agents</text>
<rect x="620" y="128" width="120" height="44" rx="10" class="d-box"/>
<text x="680" y="155" class="d-t">Evaluator</text>
<text x="680" y="84" class="d-tag" text-anchor="middle">evaluate ⇄ optimize</text>
<rect x="770" y="128" width="120" height="44" rx="10" class="d-box d-hi"/>
<text x="830" y="155" class="d-t">Match report</text>
</svg>
</figure>

## How it works

- **Prompt chaining:** the analysis runs as a sequence of structured steps, where each step's output feeds the next.
- **Routing:** every query is checked first. Only football-related requests go through to the analysis agents; anything else is filtered out.
- **Parallelization:** three specialist agents run at the same time:
  - one rates each **player's** performance
  - one writes the **match summary**
  - one breaks down the **tactics**
- **Orchestrator–worker:** an orchestrator hands the match to the specialists and combines their outputs into one complete report.
- **Generator–evaluator–optimizer:** I explored scoring the generated analysis and refining it, to make the final report more accurate and relevant.

## What I learned

Splitting one vague task into focused agents gives deeper, better-organized output than a single prompt. Running the agents in parallel keeps the extra depth from making the app slower.
