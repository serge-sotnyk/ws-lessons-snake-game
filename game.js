document.addEventListener('DOMContentLoaded', () => {
    // Game canvas setup
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // Game constants
    const GRID_SIZE = 15;
    const GAME_SPEED = 200; // milliseconds
    const FOOD_MOVE_INTERVAL = 5; // Food moves every 5 game updates
    
    // Game variables
    let snake = [{ x: 10, y: 10 }]; // Start with a single segment
    let food = generateFood();
    let direction = 'right';
    let nextDirection = 'right';
    let score = 0;
    let gameRunning = true;
    let gamePaused = false;
    let gameLoop;
    let backgroundColor = 'black'; // Default background color
    let gameUpdateCounter = 0; // Counter for game updates
    
    // Explosion animation variables
    let explosionParticles = [];
    let explosionActive = false;
    let explosionDuration = 0;
    const MAX_EXPLOSION_DURATION = 10; // frames
    
    // Array of background colors to cycle through
    const backgroundColors = [
        'black', 
        '#1a1a2e', 
        '#16213e', 
        '#0f3460', 
        '#1e3a5f', 
        '#2c3e50', 
        '#34495e', 
        '#2e294e', 
        '#1b1b2f', 
        '#322e2f'
    ];
    
    // Function to get a random background color
    function getRandomBackgroundColor() {
        let newColor;
        do {
            newColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
        } while (newColor === backgroundColor); // Ensure we get a different color
        return newColor;
    }
    
    // Event listeners
    document.addEventListener('keydown', handleKeyPress);
    document.getElementById('restartBtn').addEventListener('click', resetGame);
    document.getElementById('pauseBtn').addEventListener('click', togglePause);
    
    // Start the game
    startGame();
    
    function startGame() {
        gameLoop = setInterval(gameUpdate, GAME_SPEED);
    }
    
    function gameUpdate() {
        if (!gameRunning || gamePaused) return;
        
        // Increment game update counter
        gameUpdateCounter++;
        
        // Update direction
        direction = nextDirection;
        
        // Move snake
        const head = { ...snake[0] };
        
        switch (direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }
        
        // Check for collisions
        if (
            head.x < 0 || 
            head.y < 0 || 
            head.x >= canvas.width / GRID_SIZE || 
            head.y >= canvas.height / GRID_SIZE ||
            isSnakeCollision(head)
        ) {
            gameOver();
            return;
        }
        
        // Add new head
        snake.unshift(head);
        
        // Check if food eaten
        if (head.x === food.x && head.y === food.y) {
            // Increase score
            score += 10;
            document.getElementById('score').textContent = score;
            
            // Change background color
            backgroundColor = getRandomBackgroundColor();
            
            // Create explosion at food location
            createExplosion(food.x * GRID_SIZE + GRID_SIZE/2, food.y * GRID_SIZE + GRID_SIZE/2);
            
            // Generate new food
            food = generateFood();
        } else {
            // Remove tail if no food eaten
            snake.pop();
            
            // Move food occasionally
            if (gameUpdateCounter % FOOD_MOVE_INTERVAL === 0) {
                moveFood();
            }
        }
        
        // Update explosion animation
        if (explosionActive) {
            updateExplosion();
        }
        
        // Draw everything
        draw();
    }
    
    function draw() {
        // Clear canvas
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw snake
        ctx.fillStyle = 'lime';
        snake.forEach(segment => {
            ctx.fillRect(
                segment.x * GRID_SIZE, 
                segment.y * GRID_SIZE, 
                GRID_SIZE, 
                GRID_SIZE
            );
        });
        
        // Draw food as apple emoji
        ctx.font = `${GRID_SIZE * 1.5}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            '🍎', 
            food.x * GRID_SIZE + GRID_SIZE/2, 
            food.y * GRID_SIZE + GRID_SIZE/2
        );
        
        // Draw grid (optional)
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 0.5;
        
        // Draw vertical lines
        for (let i = 0; i <= canvas.width; i += GRID_SIZE) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let i = 0; i <= canvas.height; i += GRID_SIZE) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }
        
        // Draw explosion particles if active
        if (explosionActive) {
            drawExplosion();
        }
        
        // Draw pause overlay if game is paused
        if (gamePaused) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.font = '30px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
            ctx.font = '20px Arial';
            ctx.fillText('Press P or the Pause button to resume', canvas.width / 2, canvas.height / 2 + 40);
        }
    }
    
    function generateFood() {
        // Generate random position
        const x = Math.floor(Math.random() * (canvas.width / GRID_SIZE));
        const y = Math.floor(Math.random() * (canvas.height / GRID_SIZE));
        
        // Make sure food doesn't spawn on snake
        for (const segment of snake) {
            if (segment.x === x && segment.y === y) {
                return generateFood(); // Try again
            }
        }
        
        return { x, y };
    }
    
    function isSnakeCollision(position) {
        // Check if position collides with any snake segment (except the tail which will move)
        return snake.some((segment, index) => {
            // Skip the tail since it will move
            if (index === snake.length - 1) return false;
            return segment.x === position.x && segment.y === position.y;
        });
    }
    
    function handleKeyPress(event) {
        // Handle direction changes
        switch (event.key) {
            case 'ArrowUp':
                if (direction !== 'down') nextDirection = 'up';
                break;
            case 'ArrowDown':
                if (direction !== 'up') nextDirection = 'down';
                break;
            case 'ArrowLeft':
                if (direction !== 'right') nextDirection = 'left';
                break;
            case 'ArrowRight':
                if (direction !== 'left') nextDirection = 'right';
                break;
            case 'p':
            case 'P':
                togglePause();
                break;
        }
    }
    
    function gameOver() {
        gameRunning = false;
        clearInterval(gameLoop);
        
        // Display game over message
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = '30px Arial';
        ctx.fillStyle = 'red';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
        
        ctx.font = '20px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
        ctx.fillText('Press Restart to play again', canvas.width / 2, canvas.height / 2 + 80);
    }
    
    function resetGame() {
        // Reset game variables
        snake = [{ x: 10, y: 10 }];
        food = generateFood();
        direction = 'right';
        nextDirection = 'right';
        score = 0;
        document.getElementById('score').textContent = score;
        gameRunning = true;
        gamePaused = false;
        backgroundColor = 'black'; // Reset background color
        gameUpdateCounter = 0; // Reset counter
        
        // Update pause button text
        document.getElementById('pauseBtn').textContent = 'Pause Game (P)';
        
        // Clear previous interval and start a new one
        clearInterval(gameLoop);
        startGame();
    }
    
    // Function to move the food
    function moveFood() {
        // Possible directions for food movement
        const directions = [
            { dx: 0, dy: -1 }, // up
            { dx: 0, dy: 1 },  // down
            { dx: -1, dy: 0 }, // left
            { dx: 1, dy: 0 }   // right
        ];
        
        // Randomly select a direction
        const randomDir = directions[Math.floor(Math.random() * directions.length)];
        
        // Calculate new position
        const newX = food.x + randomDir.dx;
        const newY = food.y + randomDir.dy;
        
        // Check if the new position is valid (within bounds and not on snake)
        if (
            newX >= 0 && 
            newY >= 0 && 
            newX < canvas.width / GRID_SIZE && 
            newY < canvas.height / GRID_SIZE && 
            !isPositionOnSnake(newX, newY)
        ) {
            food.x = newX;
            food.y = newY;
        }
    }
    
    function isPositionOnSnake(x, y) {
        return snake.some(segment => segment.x === x && segment.y === y);
    }
    
    // Function to toggle pause state
    function togglePause() {
        gamePaused = !gamePaused;
        
        // Update pause button text
        const pauseBtn = document.getElementById('pauseBtn');
        pauseBtn.textContent = gamePaused ? 'Resume Game (P)' : 'Pause Game (P)';
        
        // Redraw to show/hide pause overlay
        draw();
    }
    
    // Explosion functions
    function createExplosion(x, y) {
        explosionParticles = [];
        // Create 20 particles
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2; // Random angle
            const speed = 1 + Math.random() * 3; // Random speed
            const size = 2 + Math.random() * 3; // Random size
            
            // Random color for particles
            const colors = ['#ff0000', '#ff7700', '#ffff00', '#ffffff'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            explosionParticles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                color: color,
                alpha: 1
            });
        }
        explosionActive = true;
        explosionDuration = 0;
    }
    
    function updateExplosion() {
        explosionDuration++;
        
        if (explosionDuration >= MAX_EXPLOSION_DURATION) {
            explosionActive = false;
            return;
        }
        
        // Update each particle
        explosionParticles.forEach(particle => {
            // Move particle
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Fade out
            particle.alpha = 1 - (explosionDuration / MAX_EXPLOSION_DURATION);
        });
    }
    
    function drawExplosion() {
        explosionParticles.forEach(particle => {
            ctx.globalAlpha = particle.alpha;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1; // Reset alpha
    }
    
    // Initial draw
    draw();
});
