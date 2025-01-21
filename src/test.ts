import { MongoClient } from "mongodb";
import { montAuth } from "./lib/flow/main";
import dotenv from 'dotenv';

dotenv.config();
const dbName = process.env.DB_NAME ?? "test";
const collectionName = process.env.COLLECTION_NAME ?? "test";

const rt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjaWFvIiwiaWF0IjoxNzM3NDA5Nzg4LCJleHAiOjE3Mzc0MDk4NzR9.tA8MyyE1L6-_OZk6olPfmJ2YDUMxAoqUen7Vb8SXVVQ"

MongoClient.connect("mongodb://localhost:1234").then(async (client) => {
    const session = await montAuth.createSession("ciao", {
        dbName,
        collectionName,
        client
    })

    setTimeout(async () => {
        const refresh = await montAuth.refresh(rt, {
            dbName,
            collectionName,
            client
        })

        console.log(refresh);

        await client.close();
    }, 5000)

});