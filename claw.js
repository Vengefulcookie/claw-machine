// CLAW MACHINE - Step 1
// Move left/right, drop, grab prizes

// ========== CANVAS ==========
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ========== GAME STATE ==========
let credits = 5;
let prizesWon = [];
let gameActive = true;
let isDropping = false;
let clawY = 50;  // Starting Y position (top)
let clawX = canvas.width / 2;
let clawSpeed = 5;
let dropSpeed = 3;
let grabRange = 15;  // How close claw needs to be to grab

// ========== PRIZES ==========
const prizes = [
    { x: 100, y: 320, width: 30, height: 30, type: '🐱', name: 'Cat Sticker' },
    { x: 200, y: 350, width: 30, height: 30, type: '🐶', name: 'Dog Sticker' },
    { x: 300, y: 330, width: 30, height: 30, type: '🐸', name: 'Frog Sticker' },
    { x: 400, y: 360, width: 30, height: 30, type: '🦄', name: 'Unicorn Sticker' }
];

// ========== DOM ELEMENTS ==========
const prizeCountSpan = document.getElementById('prizeCount');
const creditsSpan = document.getElementById('credits');
const prizesWonDiv = document.getElementById('prizesWon');
const playBtn = document.getElementById('playBtn');
const resetBtn = document.getElementById('resetBtn');

// ========== KEYBOARD CONTROLS ==========
const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    Space: false
};

// ========== UPDATE DISPLAY ==========
function updateUI() {
    creditsSpan.textContent = credits;
    prizeCountSpan.textContent = prizesWon.length;
    
    if (prizesWon.length === 0) {
        prizesWonDiv.innerHTML = '<strong>Your Stickers:</strong> None yet';
    } else {
        const stickerList = prizesWon.map(p => p.type).join(' ');
        prizesWonDiv.innerHTML = `<strong>Your Stickers:</strong> ${stickerList}`;
    }
    
    if (credits <= 0) {
        playBtn.disabled = true;
        gameActive = false;
    } else {
        playBtn.disabled = false;
        gameActive = true;
    }
}

// ========== DRAW CLAW ==========
function drawClaw() {
    ctx.save();
    ctx.shadowBlur = 0;
    
    // Draw cable (line from top to claw)
    ctx.beginPath();
    ctx.moveTo(clawX, 0);
    ctx.lineTo(clawX, clawY);
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw claw (triangle)
    ctx.beginPath();
    ctx.moveTo(clawX, clawY);
    ctx.lineTo(clawX - 10, clawY + 20);
    ctx.lineTo(clawX + 10, clawY + 20);
    ctx.closePath();
    ctx.fillStyle = '#ffcc00';
    ctx.fill();
    ctx.strokeStyle = '#aa8800';
    ctx.stroke();
    
    // Draw claw tips
    ctx.fillStyle = '#ff9900';
    ctx.fillRect(clawX - 5, clawY + 18, 3, 8);
    ctx.fillRect(clawX + 2, clawY + 18, 3, 8);
    
    ctx.restore();
}

// ========== DRAW PRIZES ==========
function drawPrizes() {
    prizes.forEach(prize => {
        // Draw prize box
        ctx.fillStyle = '#ffdd88';
        ctx.fillRect(prize.x, prize.y, prize.width, prize.height);
        ctx.strokeStyle = '#aa8844';
        ctx.strokeRect(prize.x, prize.y, prize.width, prize.height);
        
        // Draw prize emoji
        ctx.font = '20px Arial';
        ctx.fillStyle = '#000';
        ctx.fillText(prize.type, prize.x + 5, prize.y + 23);
    });
}

// ========== DRAW GROUND ==========
function drawGround() {
    ctx.fillStyle = '#4a2a5a';
    ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
    ctx.fillStyle = '#6a3a7a';
    for (let i = 0; i < canvas.width; i += 20) {
        ctx.fillRect(i, canvas.height - 62, 10, 4);
    }
}

// ========== CHECK COLLISION ==========
function checkGrab() {
    if (!isDropping) return null;
    
    for (let i = 0; i < prizes.length; i++) {
        const prize = prizes[i];
        // Check if claw overlaps prize
        const clawBottom = clawY + 28;
        const clawLeft = clawX - 10;
        const clawRight = clawX + 10;
        
        if (clawBottom > prize.y && 
            clawLeft < prize.x + prize.width && 
            clawRight > prize.x) {
            // Grab successful!
            prizesWon.push(prize);
            prizes.splice(i, 1);
            updateUI();
            return prize;
        }
    }
    return null;
}

// ========== UPDATE GAME ==========
function updateGame() {
    if (!gameActive && credits > 0) return;
    if (credits <= 0) return;
    
    // Move claw left/right (only when not dropping)
    if (!isDropping) {
        if (keys.ArrowLeft && clawX > 30) {
            clawX -= clawSpeed;
        }
        if (keys.ArrowRight && clawX < canvas.width - 30) {
            clawX += clawSpeed;
        }
    }
    
    // Handle dropping
    if (isDropping) {
        clawY += dropSpeed;
        
        // Hit bottom?
        if (clawY + 30 >= canvas.height - 55) {
            // Check if grabbed anything
            const grabbed = checkGrab();
            if (grabbed) {
                console.log('Grabbed:', grabbed.name);
            }
            // Return to top
            isDropping = false;
            clawY = 50;
        }
    }
    
    if (keys.Space && !isDropping && gameActive && credits > 0) {
        isDropping = true;
        keys.Space = false; // Prevent multiple drops
    }
}

function render() {
    ctx.fillStyle = '#2a1a3a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawGround();
    drawPrizes();
    drawClaw();
}

function gameLoop() {
    updateGame();
    render();
    requestAnimationFrame(gameLoop);
}

function playGame() {
    if (credits <= 0) {
        alert('No credits left! Click Reset to play again.');
        return;
    }
    
    if (!gameActive) {
        resetGame();
    }
    
    credits--;
    updateUI();
    gameActive = true;
    
    isDropping = false;
    clawY = 50;
}

function resetGame() {
    credits = 5;
    prizesWon = [];

    prizes.length = 0;
    prizes.push(
        { x: 100, y: 320, width: 30, height: 30, type: '🐱', name: 'Cat Sticker' },
        { x: 200, y: 350, width: 30, height: 30, type: '🐶', name: 'Dog Sticker' },
        { x: 300, y: 330, width: 30, height: 30, type: '🐸', name: 'Frog Sticker' },
        { x: 400, y: 360, width: 30, height: 30, type: '🦄', name: 'Unicorn Sticker' }
    );
    gameActive = true;
    isDropping = false;
    clawY = 50;
    clawX = canvas.width / 2;
    updateUI();
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        keys.ArrowLeft = true;
        e.preventDefault();
    } else if (e.key === 'ArrowRight') {
        keys.ArrowRight = true;
        e.preventDefault();
    } else if (e.key === ' ' || e.key === 'Space') {
        keys.Space = true;
        e.preventDefault();
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') {
        keys.ArrowLeft = false;
        e.preventDefault();
    } else if (e.key === 'ArrowRight') {
        keys.ArrowRight = false;
        e.preventDefault();
    } else if (e.key === ' ' || e.key === 'Space') {
        keys.Space = false;
        e.preventDefault();
    }
});

playBtn.addEventListener('click', playGame);
resetBtn.addEventListener('click', resetGame);

resetGame();
updateUI();
gameLoop();
