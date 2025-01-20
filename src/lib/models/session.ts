import { ObjectId } from "mongodb";

class Session {
    id: ObjectId;
    userId: ObjectId | string | number;
    accessTokens: string[];
    refreshTokens: string[];
    createdAt: number;
    updatedAt: number;

    constructor({
        id = new ObjectId(),
        userId = "",
        accessTokens = [],
        refreshTokens = [],
        createdAt = 0,
        updatedAt = 0
    }: {
        id?: ObjectId,
        userId?: ObjectId | string | number,
        accessTokens?: string[],
        refreshTokens?: string[],
        createdAt?: number,
        updatedAt?: number
    }) {
        this.id = id;
        this.userId = userId;
        this.accessTokens = accessTokens;
        this.refreshTokens = refreshTokens;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static fromJson(json: any): Session {
        return new Session({
            id: json.id,
            userId: json.userId,
            accessTokens: json.accessTokens,
            refreshTokens: json.refreshTokens,
            createdAt: json.createdAt,
            updatedAt: json.updatedAt
        });
    }

    toJson() {
        return {
            id: this.id,
            userId: this.userId,
            accessTokens: this.accessTokens,
            refreshTokens: this.refreshTokens,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

export default Session;