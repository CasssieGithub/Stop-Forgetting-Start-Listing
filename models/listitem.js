const mongoose = require("mongoose");

const SchemaListItemPage = new mongoose.Schema({
  name: { type: "String", required: true },
  tags: [Array],
  listId: String,
  img: String,
});

const listItemCollection = mongoose.model("listItem", SchemaListItemPage);
module.exports = listItemCollection;
