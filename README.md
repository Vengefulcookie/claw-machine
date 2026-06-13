# Claw Machine
> An interactive arcade simulator where skill meets chance. Move the claw left and right, time your drop perfectly, and grab prizes. Win 6 unique stickers to complete your collection.

[![Play Now](https://img.shields.io/badge/Play-Now-brightgreen)](https://vcookie-claw-machine.netlify.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repo-blue)](https://github.com/Vengefulcookie/claw-machine)

## What This Project Does
Remember those claw machines at arcades and grocery stores? This is one you can play from your browser — without spending real quarters. Move the claw left and right, press space to drop, and try to grab a prize. Each play costs 1 credit (you start with 5), and winning gives you a sticker. Collect all 6 unique stickers to complete the collection!

**What you can do:**
- Move claw ← and →
- Drop claw with Space bar
- Collect unique stickers (6 total)
- Random animal facts pop up when you win
- Reset game to try again

## How I Built This
- **JavaScript** - Game logic and collision detection
- **Canvas API** - For rendering the claw and prizes
- **Collision Detection** - To know when you've grabbed something
- **Physics simulation** - For the claw movement and prize physics

## Play It Now
[Click here to play Claw Machine](https://vcookie-claw-machine.netlify.app)
Use **←** and **→** to move the claw, **Space** to drop. Try to collect all 6 stickers!

## What I Learned
Physics simulation was the hardest part of this game. The claw needed to feel responsive but not too easy. Collision detection had to be precise — the claw should only grab prizes when it actually touches them. I also learned about managing game state: credits, collected stickers, win/loss conditions, and resetting everything without bugs.

## Running Locally
```bash
git clone https://github.com/Vengefulcookie/claw-machine.git
cd claw-machine
```
# Open index.html in your browser

## Contact
- GitHub: github.com/Vengefulcookie
- LinkedIn: linkedin.com/in/snethemba-shangase-softw-mech-civil0101

Built with ☕, careful physics tuning, and a love for arcade games
