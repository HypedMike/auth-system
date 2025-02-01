import { ObjectId } from "mongodb";

class Session {
    _id: ObjectId;
    userId: ObjectId | string | number;
    accessTokens: string[];
    refreshTokens: string[];
    createdAt: number;
    updatedAt: number;

    constructor({
        _id = new ObjectId(),
        userId = "",
        accessTokens = [],
        refreshTokens = [],
        createdAt = 0,
        updatedAt = 0
    }: {
        _id?: ObjectId,
        userId?: ObjectId | string | number,
        accessTokens?: string[],
        refreshTokens?: string[],
        createdAt?: number,
        updatedAt?: number
    }) {
        this._id = _id;
        this.userId = userId;
        this.accessTokens = accessTokens;
        this.refreshTokens = refreshTokens;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static fromJson(json: any): Session {
        return new Session({
            _id: json._id,
            userId: json.userId,
            accessTokens: json.accessTokens,
            refreshTokens: json.refreshTokens,
            createdAt: json.createdAt,
            updatedAt: json.updatedAt
        });
    }

    toJson() {
        return {
            _id: this._id,
            userId: this.userId,
            accessTokens: this.accessTokens,
            refreshTokens: this.refreshTokens,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

export default Session;