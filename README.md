# My First Game

A browser-based platformer built with **p5.js** during my first term studying Computer Science 
at the University of London. The player navigates canyons and enemies, collecting items while 
racing against a countdown timer to complete the level.

## Overview

This project started as a coursework assignment and was extended with a full set of custom 
features beyond the base requirements — game states, audio feedback, and UI elements designed 
to make the game feel complete rather than a bare prototype.

## Features

- **Intro screen** — press space to start the game and begin the timer
- **Dynamic countdown timer** — turns red and triggers a warning sound in the final 5 seconds
- **Level Complete screen** — transparent overlay with celebratory sound effects
- **Game Over screen** — animated red/black blink with a voice line
- **Full audio design** — background music, jump, fall, and warning sound effects
- **Score, timer, and lives UI** — real-time feedback for the player
- **Custom enemies and platforms** — hand-designed obstacles for difficulty progression

## Tech Stack

- **p5.js** — rendering, game loop, and input handling
- **JavaScript** — core game logic and state management
- **HTML/CSS** — page structure and styling

## Engineering Notes

The main challenge was code organization. Early on, the `draw()` function mixed rendering and 
game logic together, which made debugging difficult as the project grew. I refactored by 
separating concerns into smaller, purpose-specific functions — a decision that significantly 
improved readability and made it easier to extend the game with new features.

Other problems solved along the way:

- **State management** — coordinating intro, playing, win, and game-over states so the correct 
  screen and audio always triggered at the right moment
- **Data structures** — using arrays and loops to manage multiple collectibles and obstacles 
  efficiently
- **Audio bugs** — debugging sound effects that repeated or overlapped unexpectedly
- **UI design** — building a clear, minimal HUD for score, timer, and lives

## What I Learned

This project was my first real exercise in structuring a non-trivial program rather than a 
short script. It taught me the value of separating logic from presentation early, and gave me 
practical experience debugging state-driven, event-based code — skills that carried directly 
into later coursework.