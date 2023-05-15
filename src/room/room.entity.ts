import { BaseEntity,
         Column,
         Entity } from 'ts-redis-orm'
import { Value } from './room.gateway.entity'

export class Player {
    constructor(name: string, sign: number) {
        this.name = name
        this.sign = sign
    }

    name: string
    sign: Value
    wantsRevenge: boolean = false
}

@Entity({connection: "default", table: "Room"})
export class Room extends BaseEntity {
    constructor(id?: number) {
        super()
        this.id = id
        this.turn = Value.CROSS
    }

    @Column()
    id: number = 0

    @Column()
    players: Player[] = []

    @Column()
    currentState: Value[] = [0, 0, 0,
                             0, 0, 0,
                             0, 0, 0]

    @Column()
    winner: number = null

    @Column()
    turn: Value = null
}

