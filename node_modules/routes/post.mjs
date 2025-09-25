import express from "express";
import { getDb } from "../db/conn.mjs";

const router = express.Router();

// GET /post -> all posts
router.get("/", async (req, res) => {
  try {
    const collection = getDb().collection("posts");
    const results = await collection.find({}).toArray();
    res.json(results);
  } catch (e) {
    console.error("GET /post error:", e);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// POST /post/upload -> create a post
router.post("/upload", async (req, res) => {
  try {
    const { user, content, image } = req.body;
    if (!user || !content) {
      return res.status(400).json({ error: "user and content are required" });
    }

    const doc = { user, content, image: image || null, createdAt: new Date() };
    const result = await getDb().collection("posts").insertOne(doc);

    res.status(201).json({ message: "Created", id: result.insertedId });
  } catch (e) {
    console.error("POST /post/upload error:", e);
    res.status(500).json({ error: "Failed to create post" });
  }
});

// Update a record by id 
router.patch("/:id", async (req, res) => {
    const query = { _id: new ObjectId(req.params.id) };
    const update = { 
        $set:{ 
    name:req.body.name,
    comment : req.body.comment}
 };
 let collection = await db.collection("posts");
 let result = await collection.updateOne(query,update);
 res.json(result).status(200);
});

// Get a single record by id
router.get("/:id", async (req, res) => {
    let collection = await db.collection("posts");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);
    
    if(!result) res.send("Not found").status(404);
});

//Delete a record 
router.delete("/:id", async (req, res) => {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("posts");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
});
    export default router;
