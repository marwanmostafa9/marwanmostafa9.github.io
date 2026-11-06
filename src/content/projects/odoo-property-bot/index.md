---
title: Odoo Property Bot
date: 2025-12-17
field: agents
summary: A Telegram bot that creates real-estate records in Odoo from a normal chat. An LLM understands the property details you describe, asks for anything missing, and fills in the Odoo fields, so nobody has to fill forms by hand.
tags: [n8n, LLM, Telegram Bot, Odoo, Automation]
captions:
  01.jpeg: 'The bot greets the user, asks for the property name, then reads a free-text description: "a villa with 3 bedrooms and a garage, no garden, sea view"'
  02.jpeg: It confirms what it understood, asks for the price, accepts a skipped postcode, and creates the property
  03.jpeg: 'The result in Odoo: Demo Villa 1, type Villa, expected price 5,000,000, 3 bedrooms, garage checked, garden unchecked'
---

## The problem

Adding a property to Odoo means opening a form and filling in field after field: name, type, description, bedrooms, garage, garden, expected price. It is slow, and it has to be done at a desk.

## What I built

A **Telegram bot** connected to **Odoo**. The user describes the property in plain language, the way they would tell a colleague, and the bot turns it into a complete property record. The workflow runs in **n8n**, with an **LLM** that understands the messages and maps them to Odoo fields.

<figure class="diagram">
<svg viewBox="0 0 900 245" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Telegram chat goes to an n8n workflow where an LLM extracts the property fields and asks for missing ones, then the record is created in Odoo">
<defs><marker id="op-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="d-head"/></marker></defs>
<rect x="210" y="20" width="460" height="215" rx="14" class="d-box" style="fill-opacity:.25;stroke-dasharray:5 6"/>
<text x="226" y="44" class="d-tag">n8n workflow</text>
<g class="d-line">
<path d="M160 115H246" marker-end="url(#op-arrow)"/>
<path d="M390 115H476" marker-end="url(#op-arrow)"/>
<path d="M620 115H726" marker-end="url(#op-arrow)"/>
<path d="M320 137C320 186 160 186 120 140" marker-end="url(#op-arrow)" class="d-dim"/>
</g>
<rect x="10" y="93" width="150" height="44" rx="10" class="d-box"/>
<text x="85" y="120" class="d-t">Telegram chat</text>
<rect x="250" y="93" width="140" height="44" rx="10" class="d-box d-hi"/>
<text x="320" y="120" class="d-t">LLM</text>
<text x="320" y="82" class="d-tag" text-anchor="middle">understand · extract</text>
<text x="240" y="222" class="d-sub">missing field → ask the user</text>
<rect x="480" y="93" width="140" height="44" rx="10" class="d-box"/>
<text x="550" y="120" class="d-t">Map to fields</text>
<text x="550" y="82" class="d-tag" text-anchor="middle">name · price · rooms…</text>
<rect x="730" y="93" width="160" height="44" rx="10" class="d-box d-hi"/>
<text x="810" y="120" class="d-t">Odoo record</text>
</svg>
</figure>

## How it works

1. The user starts a chat with the bot on Telegram.
2. The bot asks for the property details, one question at a time, in natural language.
3. The **n8n** workflow sends each message to the **LLM**, which pulls out the details and maps them to Odoo fields such as:
   - **Property name**
   - **Description:** bedrooms, garage, garden, extras like a sea view
   - **Expected price**
4. The bot confirms what it understood and asks for anything still missing. Optional fields can be skipped.
5. When the user is done, the property record is **created in Odoo** automatically.

## Why it matters

Data entry moves from a form to a conversation. An agent can add a listing from their phone in a minute, in their own words, and Odoo still gets clean, structured data.
