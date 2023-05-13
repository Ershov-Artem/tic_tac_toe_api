export class EnterRoomDto {
    name: string
    code: number
}

export class ChangeMapDto {
    token: string
    position: number
}

export enum Value {
    NOTHING = 0,
    CROSS = 1,
    ZERO = 2
}