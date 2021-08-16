const dotenv = require("dotenv");
dotenv.config();
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.CONNECTIONSTRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err, client) => {
  module.exports = client.db();
  const app = require("./app");
  app.listen(process.env.PORT);
});
