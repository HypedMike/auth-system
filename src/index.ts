import { MongoClient } from "mongodb";
import { montAuth } from "./lib/flow/main";
import dotenv from 'dotenv';

dotenv.config();
const dbName = process.env.DB_NAME ?? "test";
const collectionName = process.env.COLLECTION_NAME ?? "test";

MongoClient.connect("mongodb://localhost:1234").then(async (client) => {
    const session = await montAuth.createSession("dljvnlsnvlfkvfl", {
        dbName,
        collectionName,
        client
    });

    console.log("Session", session);

    const validation = await montAuth.validate(session.accessToken, {
        dbName,
        collectionName,
        client
    });

    console.log("Validation", validation);
});