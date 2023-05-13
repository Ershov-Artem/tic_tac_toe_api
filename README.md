<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">

## Description

Tic Tac Toe API realisation based on NestJS.

## API Doc

### REST

* POST `/room` - taking nothing, returns room code. Example response:
```json
{
  "code": 3290
}
```

### Socket.io

Socket.io server works on the same port as the main app, on path `/socket.io`.
On connection accepts query parameters `code` (room code, number) and `name`(player nickname, string).

Events

Incoming:

* `changeMap` - is used to add new sign to map. Accepts JSON containing JWT-token and position (0 to 8) of new sign.

Message body example:
```json
{
  "token": "eyJhbGciOiJIUzI1Ni....",
  "position": 1
}
```

* `revengeRequest` - is used to request rematch after the end of current game. Accepts JSON containing JWT-token.

Message body example:
```json
{
  "token": "eyJhbGciOiJIUzI1Ni....",
}
```

Outgoing:

* `token` - sends JSON containing JWT-token to be used for authentication. Is sent only once on new client connection (only to this client).

Message body example:
```json
{
  "token": "eyJhbGciOiJIUzI1Ni....",
}
```

* `roomState` - sends current room state as JSON. Is sent to all clients in room when some changes happen. Is also sent on new client connection and on rematch accept.

Message body example:
```json
{
  "id": 5564,
  "players": [
    {
      "wantsRevenge": false,
      "name": "xX_ryan69gosling_Xx",
      "sign": 1
    }
  ],
  "currentState": [0, 0, 0, 0, 0, 0, 0, 0, 0],
  "winner": 0,
  "turn": 0,
  "createdAt": "2023-05-13T22:57:01.510Z"
}
```

* `win` - is sent to the winner after the end of current game. Contains JSON with winner inside of it

Message body example:
```json
{
  "winner": {
    "wantsRevenge": false,
    "name": "xX_ryan69gosling_Xx",
    "sign": 1
  }
}
```

* `lose` - is sent to the loser after the end of current game. Contains JSON with winner inside of it

Message body example:
```json
{
  "winner": {
    "wantsRevenge": false,
    "name": "xX_ryan69gosling_Xx",
    "sign": 1
  }
}
```

* `revengeRequest` - when one of the players request the rematch (via `revengeRequest` client incoming event) it is sent to the second player.
* `revenge` - is sent to all players in the room when all of them accepted rematch.
* `disconnected` - when one of the players leaves room, it is sent to other player.
* `message` - is used for some extraordinary events, contains raw string with description. Usually is used for errors.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```
