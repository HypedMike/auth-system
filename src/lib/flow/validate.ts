import Session from "../models/session";
import { MontResponse, Options } from "./main";
import jwt, { JwtPayload } from 'jsonwebtoken';

export const validate = async (accessToken: string, options: Options): Promise<MontResponse> => {
    // create response
    let response: MontResponse = {
        errors: [],
        accessToken: "",
        refreshToken: "",
        decoded: {}
    }

    // decode the access token
    const decoded = jwt.decode(accessToken);

    response.decoded = decoded;

    if (!decoded) {
        response.errors.push("Invalid access token, coudln't decode it");
        return response;
    }

    // check if the access token is expired
    if (Date.now() >= ((decoded as JwtPayload).exp ?? 0) * 1000) {
        response.errors.push("Access token expired");
        return response;
    }

    // get session where the access token is stored inside the accessTokens array
    const session = await options.client.db(options.dbName).collection<Session>(options.collectionName).findOne({
        accessTokens: {
            $in: [accessToken]
        }
    })

    if (!session) {
        response.errors.push("Invalid access token, session not found");
        return response;
    }

    // check if token is the last one of the array
    if (session.accessTokens[session.accessTokens.length - 1] !== accessToken) {
        response.errors.push("Invalid access token");
        return response;
    }

    // return the response
    response.accessToken = accessToken;

    return response;
}