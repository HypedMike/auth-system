import { MontResponse, Options } from "./main";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { refresh } from "./refresh";
import { validate } from "./validate";

/**
 * 
 * @param token 
 * @returns if the token is expired returns true, otherwise false
 */
const checkExp = (token: string): boolean => {
    const decoded = jwt.decode(token) as JwtPayload;
    if (!decoded) return false;
    return decoded.exp ? Date.now() >= decoded.exp * 1000 : false;
}

export const auth = async (tokens: {
    accessToken: string;
    refreshToken: string;
}, options: Options): Promise<MontResponse> => {
    let response: MontResponse = {
        accessToken: "",
        refreshToken: "",
        errors: [],
        decoded: {}
    }

    // check if access token is expired
    if (checkExp(tokens.accessToken)) {

        // check if refresh token is expired
        if (checkExp(tokens.refreshToken)) {
            response.errors.push("Refresh token and access token are expired");
            return response;
        } else {

            // refresh the access token
            const refreshResponse = await refresh(tokens.refreshToken, options);
            if (refreshResponse.errors.length > 0) {
                response.errors.push("Error refreshing the access token");
            } else {
                response.accessToken = refreshResponse.accessToken;
                response.refreshToken = refreshResponse.refreshToken;
                response.decoded = refreshResponse.decoded;
            }
        }
    } else {

        // validate the access token
        const validation = await validate(tokens.accessToken, options);
        if (validation.errors.length > 0) {
            response.errors.push("Error validating the access token");
        } else {
            response.accessToken = tokens.accessToken;
            response.refreshToken = tokens.refreshToken;
            response.decoded = validation.decoded;
        }
    }

    return response;
}