const mongoose = require("mongoose");

const SchemaListPage = new mongoose.Schema({
  name: { type: "String", required: true },
  date: String,
  img: String,
});

const listCollection = mongoose.model("list", SchemaListPage);
module.exports = listCollection;
