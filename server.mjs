import https from "https";
import http from "http";
import fs from "fs";
import fruits from "./routes/fruit.mjs";
import posts from "./routes/post.mjs";
import users from "./routes/user.mjs";
import express from "express"
import cors from "cors"

const PORT = 3000 ;
const app  = express();

const options = {
key : fs.readFileSync('key/privatekey.pom'),
cert: fs.readFilesSync('keys/certificate.pem')
}

app.use(cors());
app.use(express.json());

app.use((reg,res,next)=>
{
  res.setHeader('Acces-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','*');
  res.setHeader('Access-Control-Allow-Methods','*');
  next();
})

app.use("/fruit",posts);
app.routes("/fruit",posts);
app.use("/user",users);
app.route("/user",users);

let server = https.createServer(options,app)
console.log(PORT)
server.listen(PORT);
