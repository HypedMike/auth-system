import { MongoClient, ObjectId } from "mongodb";
import { montAuth } from "./lib/flow/main";
import dotenv from 'dotenv';

dotenv.config();
const dbName = process.env.DB_NAME ?? "test";
const collectionName = process.env.COLLECTION_NAME ?? "test";

MongoClient.connect(process.env.MONGO_URI ?? "").then(async (client) => {
    let accessToken = "";
    let refreshToken = "";

    // create session
    const session = await montAuth.createSession(
        "test",
        {
            client,
            dbName,
            collectionName
        });

    accessToken = session.accessToken;
    refreshToken = session.refreshToken;

    // auth every 2 seconds
    setInterval(async () => {
        const res = await montAuth.auth({
            accessToken,
            refreshToken
        }, {
            client,
            dbName,
            collectionName
        })

        accessToken = res.accessToken;
        refreshToken = res.refreshToken;

        console.log(res);
    }, 2000);
})