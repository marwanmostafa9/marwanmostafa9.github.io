---
title: CV Intelligence Platform
date: 2026-08-12
field: llm
summary: An AI recruitment platform that goes beyond keyword matching. It ranks candidates against a job description with semantic search, answers questions about each candidate with RAG, and runs an AI hiring panel.
tags: [LangChain, ChromaDB, Sentence Transformers, Groq, Streamlit, RAG]
captions:
  01.jpeg: 'The platform at a glance: JD match & rank, candidate comparison, interview kit, RAG profile Q&A and the AI hiring panel'
---

## The problem

Traditional CV screening relies on keyword matching. A strong candidate who describes their experience in different words than the job post gets filtered out, and recruiters still end up reading CVs one by one.

## What I built

A personal project exploring how **RAG**, **LLMs**, **semantic search** and **vector databases** can improve recruitment. CVs are processed and stored as embeddings in a vector database, so candidates are matched on what their experience *means*, not on exact words.

## Features

- **CV upload & intelligent processing:** upload CVs and the platform extracts and structures their content.
- **Job description matching & candidate ranking:** every candidate gets a transparent match score broken down by skills, experience, education and domain fit.
- **Candidate comparison:** compare candidates side by side, including a skills-overlap table that shows strengths and gaps.
- **AI interview kit:** technical and behavioral questions generated from each candidate's match against the job description.
- **RAG-powered candidate profiles & Q&A:** ask anything about a candidate and get answers grounded in their CV, with page citations.
- **AI hiring panel:** a technical lead, a hiring manager and a culture & growth partner each give their view, and the panel recommends a candidate.

## How it's built

- **Embeddings:** Sentence Transformers turn CVs and job descriptions into vectors
- **Vector database:** ChromaDB powers semantic search across all CVs
- **LLM layer:** LangChain orchestrates the LLM calls, served through Groq
- **Interface:** Streamlit

**Flow:** upload CVs → add a job description → AI processing → match & rank → compare & evaluate → hire the best.
