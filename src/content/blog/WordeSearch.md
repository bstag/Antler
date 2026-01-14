---
title: WordSearch
description: A simple word search generator
publicationDate: '2025-12-10T00:00:00.000Z'
featuredImage: /images/projects/WordSearch.webp
tags:
  - Next.js
  - Static
  - GitHub Pages
  - React
  - TypeScript
author: Jason Henriksen
readingTime: 2
featured: true
---
Have you ever had that frustration moment, when you do a google search and find a dozen things do what you want but limit you in one way or another? This last Sunday I needed to generate a harder wordsearch for the older kids in my class. They were always finishing the simple ones to fast, no real challenge existed is the ones provided in our lessons. Everything I tried had some type of limitation or registration, maybe some of them had a free tier but it had some limitations. I finally decided to build my own. 

So yesterday I sat down infront of my computer and started to build the word search generator. I started with the basic functionality, a simple word search generator that would take a list of words and generate a word search grid. I decided to use Next.js to build the project, as it would allow me to easily deploy the project to GitHub Pages or Vercel. I also decided to use React to build the frontend, as it would allow me to easily build a simple and interactive user interface.

It has the following features:
-   **Dynamic Grid Generation**: Create puzzles from 5x5 up to 30x30.
-   **Smart Placement Algorithm**: Automatically sorts and places words, handling collisions and retries.
-   **Configurable Directions**: Toggle support for:
    -   Horizontal & Vertical
    -   Diagonals
    -   Backwards (Reverse)
-   **Difficulty Slider (Misspelled Distractors)**: Adds "fake" words (e.g., "TIGEK" instead of "TIGER") to increase challenge.
-   **Print-Optimized**:
    -   **Ink-Saving Mode**: No background colors or heavy borders.
    -   **Auto-Scaling**: Fonts and grids automatically resize to fit A4/Letter pages.
    -   **Smart Layout**: Dynamic margins and word bank sizing to prevent overflow.
    -   **Answer Key**: Automatically generates a second page with the solution (ink-friendly format).
-   **Puzzle Sharing**: All settings (title, words, config) are synced to the URL, making puzzles easy to bookmark or share. It will regenerate the puzzle on load.
-   **Overflow Detection**: Warns you if your word list is too long for the selected grid size.

I will continue to update the product with some more features as I need them. I often woinder how many side projects start with jasy a simple "why is this so hard?" 
I will need to keep this simple. I have the tendancy to over engineer a solution, this just needs to be what it is. 
