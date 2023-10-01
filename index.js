const lighthouse = require("@lighthouse-web3/sdk");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");
const connectDB = require("./db/connect");
const apiKey = "074467d7.4316c4885ddb4c53b8060fb67b19cf00";

const Philanthrophist = require("./model/philanthrophist");

app.use(cors());
app.use(express.json());

app.get("/get-all", async (req, res) => {
  const name = await Philanthrophist.find({});
  let c = [];
  let promises = [];
  name.forEach((phil) => {
    c.push(...phil.hashes);
  });
  let a = [];
  c.forEach(async (hash) => {
    promises.push(
      axios
        .get(`https://gateway.lighthouse.storage/ipfs/${hash}`)
        .then((response) => {
          a.push(response.data);
        })
    );
  });

  await Promise.all(promises).then(() => console.log(a));
  console.log(a);
  res.send(a);
});
app.post("/philanthrophist-data", async (req, res) => {
  const c = JSON.stringify(req.body);
  const uploadResponse = await lighthouse.uploadText(c, apiKey);
  const name = await Philanthrophist.findOne({ name: req.body.name });
  console.log(name);
  if (name) {
    console.log(name);
    const philanthrophy = await Philanthrophist.findOneAndUpdate(
      { name: name.name },
      { hashes: [...name.hashes, uploadResponse.data.Hash] }
    );
  } else {
    const philanthrophist = await Philanthrophist.create({
      name: req.body.name,
      hashes: [uploadResponse.data.Hash],
      pan: true,
    });
  }
  res.send("hi");
});
const port = 5500;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log("server is listening on port", port));
  } catch (error) {
    console.log(error);
  }
};
start();
