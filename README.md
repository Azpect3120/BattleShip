# Battleship Web Game

## Description

A web-based battleship game which can be played between two or more players.
The game board is created by the server and sent to the players.
A custom binary protocol is used to communicate between the server and the clients.
Online games through lobbies will be supported, or private games through a code and 
link.


## Game Loop

1. The server generates a blank game board and sends it down to the clients.
2. Then each player places their ships on the board and submits it to the server. Each client
   will have a set time period (e.g. 1 minute) to place their ships.
3. The server will then receive the boards from the client, verify the boards and start the 
   game.
4. Each client will then be able to select a cell on the opponent's board to attack and submit it
   to the server. The client's will have a set time period (e.g. 30 seconds) to make their move.
   If no move is made within the time period, the server will make a random move for the client.
   When selecting a move, the player will be shown the board, as they have seen it, with the previous
   selection they have made.
5. Once both clients have made their selection, the server will send the results of the move to the 
   clients. The results will be the board with the updated information of the opponent's board as well
   as their own board.
6. The game will continue between steps 4 and 5 until one of the players has no ships or surrenders.


## Smaller Features

- Spectating: Players can spectate a game in progress. Also a spectator chat.
- Chat: Players can chat with each other during the game.
- Camera Shake: When a player's ship is hit, the camera will shake.

## Sprites 

- Ships: 
  - Carrier (1): 5 cells
  - Battleship (1): 4 cells
  - Submarine (1): 3 cells
  - Cruiser (2): 3 cells
  - Destroyer (2): 2 cells

*Sizes are subject to change. Will be based on the size of the board*

- Board:

## Stack

- Server: Golang
- Frontend: Typescript
  - Canvas for the game board
