// db/conn.mjs
import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.ATLAS_URI;
const dbName = process.env.DB_NAME || "Cluster0";

if (!uri) throw new Error("❌ Missing ATLAS_URI in .env");

let client;
let db;

/** Initialize Mongo once (call before app.listen) */
export async function initMongo() {
  if (db) return db;

  client = new MongoClient(uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
  });

  await client.connect();
  await client.db("admin").command({ ping: 1 });
  db = client.db(dbName);

  console.log(`✅ MongoDB connected. Using database: ${db.databaseName}`);
  return db;
}

/** Get DB after initMongo() */
export function getDb() {
  if (!db) throw new Error("Mongo not initialized. Call initMongo() first.");
  return db;
}

/** Optional graceful close */
export async function closeMongo() {
  if (client) {
    await client.close();
    console.log("🛑 MongoDB connection closed.");
    db = undefined;
  }
}
