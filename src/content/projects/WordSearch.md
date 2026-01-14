---
projectName: "Word Search"
projectImage: "/images/projects/WordSearch.webp"
description: "A simple word search generator"
technologies: ["Next.js", "Static", "GitHub Pages", "React", "TypeScript"]
liveUrl: "https://bstag.github.io/wordsearch/"
featured: true
createdAt: 2026-12-10
---
A modern, print-optimized Word Search Generator built with Next.js, TypeScript, and Tailwind CSS. Create custom puzzles with configurable difficulty, directions, and instant shareable links.


## 🌟 Features

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
-   **State Sharing**: All settings (title, words, config) are synced to the URL, making puzzles easy to bookmark or share.
-   **Overflow Detection**: Warns you if your word list is too long for the selected grid size.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **State Management**: [nuqs](https://nuqs.47ng.com/) (URL-based state)
-   **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)
-   **Deployment**: [GitHub Pages](https://pages.github.com/)
