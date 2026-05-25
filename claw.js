const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let credits = 5;
let prizesWon = [];
let gameActive = false;
let isDropping = false;
let clawY = 50;
let clawX = canvas.width / 2;
let clawSpeed = 5;
let dropSpeed = 3;
let pendingPrize = null;

let swingAngle = 0;
let swingDirection = 1;
let wasMoving = false;
const SWING_SPEED = 0.12;
const MAX_SWING = 0.25;

let audioCtx = null;
let soundsEnabled = false;

const STORAGE_KEY = 'clawMachineStickers';

const availableStickers = [
    { type: '🐱', name: 'Cat Sticker', facts: [
        'Cats sleep for 70% of their lives!',
        'A group of cats is called a clowder.',
        'Cats have 32 muscles in each ear.',
        'A cat\'s nose print is unique like a human fingerprint.',
        'The first cat in space was French, named Félicette in 1963.'
    ]},
    { type: '🐶', name: 'Dog Sticker', facts: [
        'Dogs have three eyelids!',
        'A dog\'s nose print is as unique as a fingerprint.',
        'Dalmatians are born completely white.',
        'Dogs can smell 10,000 times better than humans.',
        'The average dog is as smart as a 2-year-old child.'
    ]},
    { type: '🐸', name: 'Frog Sticker', facts: [
        'Some frogs can freeze solid and still survive!',
        'A group of frogs is called an army.',
        'Frogs drink water through their skin.',
        'The golden poison frog is one of the most toxic animals on Earth.',
        'Frogs use their eyes to help swallow food.'
    ]},
    { type: '🦄', name: 'Unicorn Sticker', facts: [
        'The unicorn is Scotland\'s national animal!',
        'Unicorns appear in ancient Mesopotamian artworks.',
        'The Greek historian Ctesias described unicorns in 400 BCE as wild donkeys with a horn.',
        'A baby unicorn is called a "sparkle" (mythical term).',
        'Unicorn horns were actually narwhal tusks sold as magic.',
        'The Greek historian Ctesias described unicorns in 400 BCE.'
    ]},
    { type: '🐧', name: 'Penguin Sticker', facts: [
        'Penguins can drink salt water!',
        'The smallest penguin species is only 30cm (12 inches) tall!',
        'Penguins have an organ that filters salt from seawater.',
        'A group of penguins is called a colony or waddle.',
        'Penguins propose to their mate with a special pebble.'
    ]},
    { type: '🌸', name: 'Flower Sticker', facts: [
        'Cherry blossoms bloom for only one week a year!',
        'Sakura (cherry blossoms) are Japan\'s national flower.',
        'There are over 200 varieties of cherry trees.',
        'The oldest cherry tree in Japan is over 1,000 years old.',
        'Cherry blossoms are edible and used in teas and sweets.'
    ]},
    { type: '🦊', name: 'Fox Sticker', facts: [
        'A group of foxes is called a skulk or leash.',
        'Foxes use the Earth\'s magnetic field to hunt.',
        'Arctic foxes don\'t shiver until -70°C (-94°F).',
        'Foxes can make over 40 different sounds.',
        'A fox\'s tail is called a "brush".'
    ]},
    { type: '🐼', name: 'Panda Sticker', facts: [
        'Pandas spend 12 hours a day eating bamboo.',
        'A newborn panda is the size of a stick of butter.',
        'Pandas have an extra "thumb" for gripping bamboo.',
        'Unlike most bears, pandas do not hibernate.',
        'There are only about 1,800 pandas left in the wild.'
    ]},
    { type: '🦁', name: 'Lion Sticker', facts: [
        'A lion\'s roar can be heard from 8km (5 miles) away.',
        'Lions sleep 16-20 hours per day.',
        'A group of lions is called a pride.',
        'Male lions\' manes darken with age.',
        'Lions are the only cats that live in groups.'
    ]},
    { type: '🦉', name: 'Owl Sticker', facts: [
        'Owls can rotate their heads 270 degrees.',
        'A group of owls is called a parliament.',
        'Owls have three eyelids for each eye.',
        'Not all owls hoot! Some whistle or screech.',
        'Owl eyes are tube-shaped, not round.'
    ]},
    { type: '🐝', name: 'Bee Sticker', facts: [
        'A honeybee can fly up to 15mph.',
        'Bees have five eyes!',
        'A single bee produces 1/12 teaspoon of honey in its life.',
        'Bees communicate by dancing.',
        'There are over 20,000 bee species worldwide.'
    ]},
    { type: '🐙', name: 'Octopus Sticker', facts: [
        'Octopuses have three hearts.',
        'Their blood is blue!',
        'An octopus can change color and texture in milliseconds.',
        'They have nine brains (one central + one in each arm).',
        'Octopuses are as smart as domestic cats.'
    ]},
    { type: '🦋', name: 'Butterfly Sticker', facts: [
        'Butterflies taste with their feet.',
        'They can see ultraviolet light.',
        'A group of butterflies is called a kaleidoscope.',
        'The fastest butterfly flies at 12mph.',
        'Butterflies live only 2-4 weeks on average.'
    ]},
    { type: '🐳', name: 'Whale Sticker', facts: [
        'Blue whales are the largest animals ever — bigger than dinosaurs!',
        'Whale songs can travel for thousands of miles.',
        'A whale\'s heart is the size of a small car.',
        'Some whales live over 200 years.',
        'Baby whales drink 150 gallons of milk per day.'
    ]}
];

let prizes = [];

function getRandomUniqueItems(arr, count) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
}

function getRandomPosition(index) {
    const minX = 60;
    const maxX = canvas.width - 90;
    const minY = 310;
    const maxY = 360;
    
    const x = minX + (index * ((maxX - minX) / 5)) + (Math.random() * 15 - 7);
    const y = minY + Math.random() * (maxY - minY);
    
    return {
        x: Math.min(maxX - 30, Math.max(minX, x)),
        y: Math.min(maxY, Math.max(minY, y))
    };
}

function generateRandomPrizes() {
    const randomStickers = getRandomUniqueItems(availableStickers, 6);
    const newPrizes = [];
    
    randomStickers.forEach((sticker, i) => {
        const pos = getRandomPosition(i);
        newPrizes.push({
            x: pos.x,
            y: pos.y,
            width: 30,
            height: 30,
            type: sticker.type,
            name: sticker.name,
            facts: sticker.facts
        });
    });
    
    return newPrizes;
}

function getFactsForSticker(type) {
    const sticker = availableStickers.find(s => s.type === type);
    return sticker ? sticker.facts : ['This sticker is super rare!', 'Collect them all!', 'A great addition to your collection!'];
}

const creditsSpan = document.getElementById('credits');
const prizeCountSpan = document.getElementById('prizeCount');
const prizesWonDiv = document.getElementById('prizesWon');
const playBtn = document.getElementById('playBtn');
const resetBtn = document.getElementById('resetBtn');
const popupOverlay = document.getElementById('popupOverlay');
const popupEmoji = document.getElementById('popupEmoji');
const popupTitle = document.getElementById('popupTitle');
const popupFact = document.getElementById('popupFact');
const collectBtn = document.getElementById('collectBtn');

function initAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    soundsEnabled = true;
}

function playSound(type) {
    if (!soundsEnabled) return;
    
    const now = audioCtx.currentTime;
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    switch(type) {
        case 'drop':
            oscillator.frequency.value = 440;
            gainNode.gain.value = 0.15;
            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 0.3);
            oscillator.stop(now + 0.3);
            break;
        case 'grab':
            oscillator.frequency.value = 880;
            gainNode.gain.value = 0.2;
            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 0.2);
            oscillator.stop(now + 0.2);
            break;
        case 'miss':
            oscillator.frequency.value = 220;
            gainNode.gain.value = 0.15;
            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 0.2);
            oscillator.stop(now + 0.2);
            break;
        case 'collect':
            oscillator.frequency.value = 660;
            gainNode.gain.value = 0.15;
            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 0.15);
            oscillator.stop(now + 0.15);
            break;
    }
}

function saveToLocalStorage() {
    const toSave = prizesWon.map(p => ({ type: p.type, name: p.name }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            prizesWon = parsed.map(p => ({ ...p, type: p.type, name: p.name }));
            updateUI();
        } catch(e) {
            console.log('Failed to load saved stickers');
        }
    }
}

function animateCounter(element, start, end, duration = 300) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / duration);
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function showCollectAllBonus() {
    const bonusDiv = document.createElement('div');
    bonusDiv.className = 'bonus-message';
    bonusDiv.textContent = '🎉 AMAZING! You collected ALL stickers! 🎉';
    document.body.appendChild(bonusDiv);
    
    setTimeout(() => {
        bonusDiv.style.opacity = '0';
        setTimeout(() => bonusDiv.remove(), 500);
    }, 3000);
}

function updateUI() {
    const oldCount = parseInt(prizeCountSpan.textContent) || 0;
    const newCount = prizesWon.length;
    
    creditsSpan.textContent = credits;
    
    if (oldCount !== newCount) {
        animateCounter(prizeCountSpan, oldCount, newCount);
    } else {
        prizeCountSpan.textContent = newCount;
    }
    
    if (prizesWon.length === 0) {
        prizesWonDiv.innerHTML = '<strong>Your Stickers:</strong> None yet';
    } else {
        const stickerList = prizesWon.map(p => p.type).join(' ');
        prizesWonDiv.innerHTML = `<strong>Your Stickers:</strong> ${stickerList}`;
    }
    
    if (credits <= 0) {
        playBtn.disabled = true;
    } else {
        playBtn.disabled = false;
    }
    
    saveToLocalStorage();
}

function updateSwing(isMoving) {
    if (isMoving && !isDropping) {
        swingAngle += SWING_SPEED * swingDirection;
        if (swingAngle > MAX_SWING) swingDirection = -1;
        if (swingAngle < -MAX_SWING) swingDirection = 1;
    } else {
        swingAngle *= 0.95;
        if (Math.abs(swingAngle) < 0.01) swingAngle = 0;
    }
    wasMoving = isMoving && !isDropping;
}

let missedMessageTimeout = null;

function showMissedMessage() {
    playSound('miss');
    
    let missedDiv = document.getElementById('missedMessage');
    if (!missedDiv) {
        missedDiv = document.createElement('div');
        missedDiv.id = 'missedMessage';
        missedDiv.className = 'missed-message';
        document.querySelector('.container').appendChild(missedDiv);
    }
    
    missedDiv.textContent = '😿 No prize this time! Try again! 😿';
    missedDiv.style.display = 'block';
    
    if (missedMessageTimeout) clearTimeout(missedMessageTimeout);
    
    missedMessageTimeout = setTimeout(() => {
        missedDiv.style.opacity = '0';
        setTimeout(() => {
            missedDiv.style.display = 'none';
            missedDiv.style.opacity = '1';
        }, 300);
    }, 2000);
}

function showStickerFact(prize) {
    playSound('grab');
    
    const facts = getFactsForSticker(prize.type);
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    
    popupEmoji.textContent = prize.type;
    popupTitle.textContent = `✨ You Won: ${prize.name}! ✨`;
    popupFact.textContent = randomFact;
    popupOverlay.style.display = 'flex';
    
    popupEmoji.style.animation = 'none';
    setTimeout(() => {
        popupEmoji.style.animation = 'bounce 0.4s ease';
    }, 10);
}

function collectPrize() {
    if (pendingPrize) {
        const wasComplete = prizesWon.length === 6;
        prizesWon.push(pendingPrize);
        playSound('collect');
        updateUI();
        
        if (!wasComplete && prizesWon.length === 6) {
            showCollectAllBonus();
        }
        
        pendingPrize = null;
    }
    popupOverlay.style.display = 'none';
}

function drawClaw() {
    ctx.save();
    ctx.shadowBlur = 0;
    
    const swingOffsetX = Math.sin(swingAngle) * 8;
    const clawXWithSwing = clawX + swingOffsetX;
    
    ctx.beginPath();
    ctx.moveTo(clawX, 0);
    ctx.lineTo(clawXWithSwing, clawY);
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(clawXWithSwing, clawY);
    ctx.lineTo(clawXWithSwing - 10, clawY + 20);
    ctx.lineTo(clawXWithSwing + 10, clawY + 20);
    ctx.closePath();
    ctx.fillStyle = '#ffcc00';
    ctx.fill();
    ctx.strokeStyle = '#aa8800';
    ctx.stroke();
    
    ctx.fillStyle = '#ff9900';
    ctx.fillRect(clawXWithSwing - 5, clawY + 18, 3, 8);
    ctx.fillRect(clawXWithSwing + 2, clawY + 18, 3, 8);
    
    ctx.restore();
}

function drawPrizes() {
    prizes.forEach(prize => {
        ctx.fillStyle = '#ffdd88';
        ctx.fillRect(prize.x, prize.y, prize.width, prize.height);
        ctx.strokeStyle = '#aa8844';
        ctx.strokeRect(prize.x, prize.y, prize.width, prize.height);
        
        ctx.font = '20px Arial';
        ctx.fillStyle = '#000';
        ctx.fillText(prize.type, prize.x + 5, prize.y + 23);
    });
}

function drawGround() {
    ctx.fillStyle = '#3a1a4a';
    ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
    
    ctx.fillStyle = '#5a2a6a';
    for (let i = 0; i < canvas.width; i += 20) {
        ctx.fillRect(i, canvas.height - 62, 10, 4);
    }
}

function checkGrab() {
    if (!isDropping) return null;
    
    const swingOffsetX = Math.sin(swingAngle) * 8;
    const clawXWithSwing = clawX + swingOffsetX;
    const clawBottom = clawY + 40;
    const clawLeft = clawXWithSwing - 14;
    const clawRight = clawXWithSwing + 14;
    
    for (let i = 0; i < prizes.length; i++) {
        const prize = prizes[i];
        
        if (clawBottom > prize.y && 
            clawLeft < prize.x + prize.width && 
            clawRight > prize.x) {
            const grabbed = prize;
            prizes.splice(i, 1);
            return grabbed;
        }
    }
    return null;
}

function endTurn() {
    gameActive = false;
    isDropping = false;
    clawY = 50;
}

function updateGame() {
    if (!gameActive) return;
    
    const isMoving = (keys.ArrowLeft || keys.ArrowRight) && !isDropping;
    updateSwing(isMoving);
    
    if (!isDropping) {
        if (keys.ArrowLeft && clawX > 30) {
            clawX -= clawSpeed;
        }
        if (keys.ArrowRight && clawX < canvas.width - 30) {
            clawX += clawSpeed;
        }
    }
    
    if (isDropping) {
        clawY += dropSpeed;
        
        if (clawY + 45 >= canvas.height - 35) {
            const grabbed = checkGrab();
            endTurn();
            
            if (grabbed) {
                pendingPrize = grabbed;
                showStickerFact(grabbed);
                console.log(`Won: ${grabbed.name}`);
            } else {
                console.log('Missed!');
                showMissedMessage();
            }
        }
    }
    
    if (keys.Space && !isDropping && gameActive && clawY <= 55) {
        isDropping = true;
        keys.Space = false;
        playSound('drop');
    }
}

function render() {
    ctx.fillStyle = '#2a1a3a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawGround();
    drawPrizes();
    drawClaw();
}

function playGame() {
    initAudio();
    
    if (credits <= 0) {
        alert('No credits left! Click Reset to play again.');
        return;
    }
    
    if (gameActive) {
        alert('Finish your current turn first!');
        return;
    }
    
    credits--;
    gameActive = true;
    isDropping = false;
    clawY = 50;
    clawX = canvas.width / 2;
    swingAngle = 0;
    updateUI();
}

function resetGame() {
    credits = 5;
    prizesWon = [];
    pendingPrize = null;
    gameActive = false;
    isDropping = false;
    clawY = 50;
    clawX = canvas.width / 2;
    swingAngle = 0;
    popupOverlay.style.display = 'none';
    
    prizes = generateRandomPrizes();
    
    updateUI();
    localStorage.removeItem(STORAGE_KEY);
    
    // Optional: Show a little message that stickers refreshed
    const resetMsg = document.createElement('div');
    resetMsg.className = 'missed-message';
    resetMsg.textContent = '🔄 New sticker set loaded! 🔄';
    resetMsg.style.display = 'block';
    resetMsg.style.backgroundColor = '#ff66cc';
    resetMsg.style.color = '#1a1a2e';
    document.querySelector('.container').appendChild(resetMsg);
    
    setTimeout(() => {
        resetMsg.style.opacity = '0';
        setTimeout(() => resetMsg.remove(), 300);
    }, 2000);
}

function gameLoop() {
    updateGame();
    render();
    requestAnimationFrame(gameLoop);
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
    } else if (e.key === 'Escape' && popupOverlay.style.display === 'flex') {
        collectPrize();
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

const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    Space: false
};

playBtn.addEventListener('click', playGame);
resetBtn.addEventListener('click', resetGame);
collectBtn.addEventListener('click', collectPrize);

popupOverlay.addEventListener('click', (e) => {
    if (e.target === popupOverlay) {
        collectPrize();
    }
});

prizes = generateRandomPrizes();
loadFromLocalStorage();
updateUI();
gameLoop();