const express = require("express");
const cors = require("cors");
const axios = require("axios");
const route = require("./routes/route");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", route);

app.listen(3000, async () => {
  console.log("Listening on Port 3000");

  const externalIpRequest = await axios.get(
    "https://api.ipify.org?format=json"
  );
  let ip = externalIpRequest.data.ip;

  console.log(`Instance external IP: ${ip}`);
});
