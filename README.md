# Banania (JavaScript port of Windows 3.x game)

## What is Banania

Banania is a video game for Windows 3.x that was released in 1992. It was created by the programmer Rüdiger Appel and the comics artist Markuß Golschinski.

![Banania running on Windows 95](/banania_win95.png)

The game was published by Data Becker, a German company that went out of business in the year 2014. Because of that, the original Pascal source code is most likely lost, as Rüdiger Appel does not have it either.

This project aims to recreate Banania in a faithful and pixel-perfect way using JavaScript. The sprites, sounds, level data and game logic have been extracted and reverse-engineered from the originally released binary.

## How to run the game

You can [play Banania online](https://mental-reverb.com/creations/banania/banania.html) as a port on Benjamin Richner's personal website. The original version can be played online in an emulator or downloaded [from the internet archive](https://archive.org/details/banania).

To run Banania locally, clone this repository and open `banania.html` in your favourite browser. No installation is needed. A browser that supports JavaScript and HTML5 canvas is required.

## How to play

Start the game by pressing the button that depicts our yellow protagonist between the two blue number displays. Use the arrow keys to move. Avoid the green and purple monsters and collect all the banana peels to reach the next level. Keys unlock doors with the corresponding number. Blue blocks can be pushed: An unlimited number of light blue blocks can be pushed at once, but the dark blue blocks depicting a diamond shape can only be moved one by one. Grey blocks cannot be moved.

## Game backstory

You are Berti, the garbage collector, who has been called into a warehouse to clean up after a runaway monkey. The monkey discovered banana trees here and has hidden on the 51st floor. However, on his escape, he ate a lot of bananas and carelessly threw the peels onto the floor. You must now make your way up through each floor, picking up after him and avoiding the garbage monsters.

To get through each level, you'll also have to strategically move blocks to gain access to the banana peels and to block the monsters. Two types of monsters will be after you, but watch out for the purple ones as they can also move blocks.
