export class Room {
    constructor(code: number) {
        this.code = code
    }
    code: number
    player1: string
    player2: string
    currentState: number[]
    winner: string
}