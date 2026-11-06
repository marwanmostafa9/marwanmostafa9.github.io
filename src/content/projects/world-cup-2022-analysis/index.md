---
title: World Cup 2022 Analysis
date: 2022-12-23
field: ml
summary: A data analysis of the Qatar 2022 World Cup. I picked the stats fans care about most (goals, passes, team styles) and turned them into pitch visualizations, bar charts and a presentation of the conclusions.
tags: [Python, Matplotlib, Data Analysis, Data Visualization]
captions:
  01.jpeg: 'Pitch visualizations: one mini pitch per team, showing their activity in each third of the field'
  02.jpeg: 'Bar charts: top 5 teams by goals (with non-penalty goals), by passes broken down by distance, and by group-stage goals'
  03.jpeg: 'Slides from the presentation of the conclusions: top scorers in the group stage, and how Argentina dominated inside the field'
---

## Why I built it

I had been waiting for the 2022 World Cup for a long time. It was the perfect chance to apply the data skills I had learned to something I love: football.

## What I did

The tournament dataset is very large, so I didn't try to analyze everything. I focused on the features people are most curious about and built three kinds of output:

- **Pitch visualizations:** a small pitch for every team, split into thirds, so you can see at a glance where each team played their game.
- **Detailed bar charts:** the top 5 teams by total goals and non-penalty goals, by passes (split into short, medium and long), and by goals in the group stage.
- **A presentation of the conclusions:** the findings, written up as slides for people who want the story rather than the charts.

## Highlights

- **Argentina**, the champions, made the most passes of any team (close to 4,000) and led many of the "inside the field" stats.
- **Spain and England** scored the most goals in the group stage, 9 each.

## What I learned

Choosing what *not* to analyze matters as much as the analysis itself. Picking a few questions people actually ask, and answering each with the right chart, made the results easy for anyone to read.
