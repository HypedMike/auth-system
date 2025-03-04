export let JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
export let JWT_ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "15m";
export let JWT_REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || "7d";
export let MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:1234";

export function setConstants({
    jwtSecret,
    jwtAccessTokenExpiresIn,
    jwtRefreshTokenExpiresIn,
    mongoUri
} : {
    jwtSecret: string;
    jwtAccessTokenExpiresIn: string;
    jwtRefreshTokenExpiresIn: string;
    mongoUri: string;
}) {
    JWT_SECRET = jwtSecret;
    JWT_ACCESS_TOKEN_EXPIRES_IN = jwtAccessTokenExpiresIn;
    JWT_REFRESH_TOKEN_EXPIRES_IN = jwtRefreshTokenExpiresIn;
    MONGO_URI = mongoUri;
}