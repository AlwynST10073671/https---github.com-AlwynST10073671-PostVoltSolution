// app.mjs
import express from 'express';
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is up (HTTP). Use /__db/health to check DB.');
});

app.get('/__db/health', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) return res.status(500).json({ ok: false, error: 'db missing' });
    await db.command({ ping: 1 });
    res.json({ ok: true, db: db.databaseName });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'db ping failed' });
  }
});

app.post('/__db/write-test', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const result = await db.collection('pings').insertOne({
      createdAt: new Date(),
      note: req.body?.note || 'hello-from-postman'
    });
    res.json({ insertedId: result.insertedId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'insert failed' });
  }
});

app.get('/__db/reads', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const docs = await db.collection('pings')
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
    res.json(docs);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'read failed' });
  }
});

export default app; // IMPORTANT
