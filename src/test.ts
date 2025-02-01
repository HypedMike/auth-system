import { MongoClient, ObjectId } from "mongodb";
import { montAuth } from "./lib/flow/main";
import dotenv from 'dotenv';

dotenv.config();
const dbName = process.env.DB_NAME ?? "test";
const collectionName = process.env.COLLECTION_NAME ?? "test";

MongoClient.connect(process.env.MONGO_URI ?? "").then(client => {
    montAuth.createSession("ciao", {
        dbName,
        collectionName,
        client
    }).then(response => {
        setTimeout(() => {
            montAuth.auth({
                accessToken: response.accessToken,
                refreshToken: response.refreshToken
            }, {
                dbName,
                collectionName,
                client
            }).then(response => {
                console.log(response);
            })
        }, 3000);
    }).catch(err => {
        console.error(err);
    })
})