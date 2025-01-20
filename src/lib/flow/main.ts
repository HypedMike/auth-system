import { MongoClient } from 'mongodb';
import { validate } from './validate';
import { refresh } from './refresh';
import { createSession } from './create_session';

export type MontResponse = {
    errors: string[];
    accessToken: string;
    refreshToken: string;
    decoded?: any
}

export type Options = {
    dbName: string;
    collectionName: string;

    /*
     * the MongoDB client
     */
    client: MongoClient;
}

interface MontAuth {
    /**
     * validate the access token checking if it's expired and if it belongs to a valid session
     * 
     * @param accessToken the access token to validate
     */
    validate(accessToken: string, options: Options): Promise<MontResponse>;
    refresh(refreshToken: string, options: Options): Promise<MontResponse>;
    createSession(userId: string | number, options: Options): Promise<MontResponse>;
}

export const montAuth: MontAuth = {
    validate,
    refresh,
    createSession
}