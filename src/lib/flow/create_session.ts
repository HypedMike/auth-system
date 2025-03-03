import { ObjectId } from "mongodb";
import { MontResponse, Options } from "./main";
import jwt from 'jsonwebtoken';
import Session from "../models/session";
import { JWT_ACCESS_TOKEN_EXPIRES_IN, JWT_REFRESH_TOKEN_EXPIRES_IN, JWT_SECRET } from "../../costants";

export const createSession = async (userId: string | number | ObjectId, options: Options): Promise<MontResponse> => {
    // create response
    let response: MontResponse = {
        errors: [],
        accessToken: "",
        refreshToken: ""
    }

    // generate a new refresh token
    const refreshToken = jwt.sign({
        userId: userId.toString()
    }, JWT_SECRET ?? "", {
        expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN
    });

    // generate a new access token
    const accessToken = jwt.sign({
        userId: userId.toString()
    }, JWT_SECRET ?? "", {
        expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN
    });

    // create a new session
    let session: Session = new Session({
        _id: new ObjectId(),
        userId: userId,
        accessTokens: [accessToken],
        refreshTokens: [refreshToken],
        createdAt: Date.now(),
        updatedAt: Date.now()
    })
    
    await options.client.db(options.dbName).collection<Session>(options.collectionName).insertOne(session);

    // return the response
    response.accessToken = accessToken;
    response.refreshToken = refreshToken;

    return response;
}