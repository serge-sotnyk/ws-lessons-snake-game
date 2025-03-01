# Snake Game

A classic Snake game implemented with HTML, CSS, and JavaScript.

## How to Play

1. Open `index.html` (https://raw.githack.com/serge-sotnyk/ws-lessons-snake-game/main/index.html) in your web browser 
2. Use the arrow keys to control the snake:
   - ↑ (Up Arrow): Move up
   - ↓ (Down Arrow): Move down
   - ← (Left Arrow): Move left
   - → (Right Arrow): Move right
   - P: Pause/Resume the game
3. Eat the 🍎 apple to grow longer and increase your score (the apple moves around, making it more challenging!)
4. Watch the background color change each time you eat an apple
5. Click the "Restart Game" button to play again after game over

## Features

- Responsive canvas-based gameplay
- Score tracking
- Game over detection
- Restart functionality
- Pause/Resume functionality (via 'P' key or button)
- Dynamic background colors that change when food is eaten
- Apple emoji as food instead of a simple square
- Particle explosion animation when food is consumed
- Moving apple that changes position periodically, adding challenge

## Implementation Details

The game uses HTML5 Canvas for rendering and JavaScript for game logic. The snake moves on a grid system, and collision detection is implemented to check for wall hits and self-collisions.
