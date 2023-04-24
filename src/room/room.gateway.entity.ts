import { Socket } from 'socket.io'

export class EnterRoomDto {
    name: string
    code: number
}

export class ChangeMapDto {
    token: string
    sign: Value
    position: number
}

export enum Value {
    NOTHING = 0,
    CROSS = 1,
    ZERO = 2
}

// export class PlayerConnections extends Map<string, Socket> {}
