import { ObjectId } from "mongodb";
import { JWT_REFRESH_TOKEN_EXPIRES_IN } from "../../costants";
import Session from "../models/session";
import { MontResponse, Options } from "./main";
import jwt from 'jsonwebtoken';

function generateRefreshToken(sessionId: string, secret: string): string {
    return jwt.sign({
        sessionId
    }, secret, {
        expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN
    });
}

export const refresh = async (refreshToken: string, options: Options): Promise<MontResponse> => {
    // get session where the refresh token is stored inside the refreshTokens array
    const session = await options.client.db(options.dbName).collection<Session>(options.collectionName).findOne({
        refreshTokens: {
            $in: [refreshToken]
        }
    })

    if (!session) {
        return {
            errors: ["Invalid refresh token"],
            accessToken: "",
            refreshToken: ""
        };
    }

    // check if refresh token is expired
    const decoded = jwt.decode(refreshToken);

    if (!decoded) {
        return {
            errors: ["Invalid refresh token"],
            accessToken: "",
            refreshToken: ""
        };
    }

    // check if the refresh token is the last one of the array
    if (session.refreshTokens[session.refreshTokens.length - 1] !== refreshToken) {
        // delete session
        const deleteRes = await options.client.db(options.dbName).collection<Session>(options.collectionName).deleteOne({
            _id: session._id
        });

        if (deleteRes.deletedCount === 0) {
            return {
                errors: ["Invalid refresh token", "Couldn't delete session"],
                accessToken: "",
                refreshToken: ""
            };
        }

        return {
            errors: ["Invalid refresh token"],
            accessToken: "",
            refreshToken: ""
        };
    }

    // create response
    let response: MontResponse = {
        errors: [],
        accessToken: "",
        refreshToken: ""
    }

    // check if the refresh token is the last one of the array
    if (session.refreshTokens[session.refreshTokens.length - 1] !== refreshToken) {
        response.errors.push("Invalid refresh token");
        return response;
    }

    // generate a new refresh token
    const newRefreshToken = generateRefreshToken(session._id.toHexString(), process.env.JWT_SECRET ?? "");

    // generate a new access token
    const newAccessToken = jwt.sign({
        sessionId: session._id.toHexString()
    }, process.env.JWT_SECRET ?? "", {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN
    });

    // update the session
    const updateRes = await options.client.db(options.dbName).collection<Session>(options.collectionName).updateOne({
        _id: session._id
    }, {
        $push: {
            accessTokens: newAccessToken,
            refreshTokens: newRefreshToken
        }
    });

    if (updateRes.modifiedCount === 0) {
        response.errors.push("Couldn't update session");
        return response;
    }

    // return the response
    response.accessToken = newAccessToken;
    response.refreshToken = newRefreshToken;
    response.decoded = jwt.decode(newAccessToken);

    return response;
}