---
title: My Smart Friend · صديقي الذكي
date: 2025-08-01
field: agents
summary: An Arabic-speaking AI companion for children that helps with studies, tells interactive stories and teaches life skills, in Egyptian Arabic and inside a safe, age-appropriate chat.
tags: [LangGraph, LangChain, Groq, Flask, Arabic RTL]
captions:
  01.jpeg: The home screen, with quick actions for "Tell me a story" and "I want to learn"
  02.jpeg: The agent greets the child and asks about their age and interests
  03.jpeg: It remembers what the child shares (name, age, loves football) and builds on it
  04.jpeg: Explaining Arabic sun and moon letters with a football analogy
  05.jpeg: Teaching Arabic long vowels in a playful, step-by-step way
  06.jpeg: A kid-friendly confirmation before clearing the conversation
---

## The idea

Most AI assistants are built for adults: formal language, long answers, and no thought for who is on the other side. Children need something different: a friend who speaks their language, keeps them curious, and stays safe.

**My Smart Friend** (صديقي الذكي) is an AI companion for children that helps with their studies, tells interactive stories, and teaches life skills. It talks in **Egyptian Arabic** dialect, so it feels relatable to local kids rather than like a textbook.

## Features

- **Interactive storytelling** with famous Arabic tales
- **Educational content** tailored for children
- **Voice-to-text input**, so kids who can't type well can still talk to it
- **Memory within a session:** it remembers the child's name, age and interests and uses them in later answers
- **Safe, monitored interactions** with age-appropriate content filtering
- **Mobile-first interface** designed for young users, with full Arabic right-to-left support

## How it's built

- **Agent:** LangChain ecosystem, with **LangGraph** managing the conversation workflow
- **LLM:** served through the **Groq API**
- **Backend:** **Flask**, with session management and persistent memory
- **Frontend:** responsive web design with Arabic RTL support

_Status: working prototype, not yet deployed to production._
