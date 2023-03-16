const express = require("express");
const app = express();
const mongoose = require("mongoose");
const List = require("./models/data.js");
const ListItem = require("./models/dataitem.js");
const SchemaListPage = require("./models/list.js");
const methodOverride = require("method-override");
const SchemaListItemPage = require("./models/listitem.js");

app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/list").then(() => {
  console.log("The connection with mongod is established!!");
});

app.listen(3000, () => {
  console.log("Listen...");
});

app.get("/seedlist", (request, response) => {
  SchemaListPage.create(List).then((data) => {
    response.send(data);
  });
});

app.get("/list", (request, response) => {
  SchemaListPage.find({}).then((allListInformation) => {
    response.render("index.ejs", {
      allListInformation: allListInformation,
    });
  });
});

app.get("/list/new", (request, response) => {
  response.render("new.ejs");
});

// The line of code below, is used to create the new category and bring user back to main page.
app.post("/list", (request, response) => {
  SchemaListPage.create(request.body)
    .then(() => {
      response.redirect("/list");
    })
    .catch((err) => {
      response.send(err);
    });
});

app.get("/list/:id", (request, response) => {
  SchemaListPage.findById(request.params.id).then((foundList) => {
    SchemaListItemPage.find({
      listId: request.params.id,
    }).then((allListItemInformation) => {
      console.log(allListItemInformation);
      response.render("show.ejs", {
        allListItemInformation: allListItemInformation,
        foundList: foundList,
      });
    });
  });
});

app.get("/list/:id/edit", (request, response) => {
  SchemaListPage.findById(request.params.id).then((foundList) => {
    response.render("edit.ejs", {
      foundList: foundList,
    });
  });
});

app.put("/list/:id", (request, response) => {
  SchemaListPage.findByIdAndUpdate(request.params.id, request.body).then(
    (updatedList) => {
      response.redirect("/list");
      // console.log("hi");
    }
  );
});

app.delete("/list/:id", (request, response) => {
  SchemaListPage.findByIdAndRemove(request.params.id).then(() => {
    response.redirect("/list");
  });
});

// <!--===================== new code ============================= -->
// <!--===================== new code ============================= -->
// <!--===================== new code ============================= -->

app.get("/seedlist/listitem", (request, response) => {
  SchemaListItemPage.create(ListItem).then((data) => {
    response.send(data);
  });
});

app.post("/list/show", (request, response) => {
  SchemaListItemPage.create(request.body).then(() => {
    response.redirect("/list");
  });
});

app.get("/list/:id/newitem", (request, response) => {
  SchemaListPage.findById(request.params.id).then((foundList) => {
    response.render("newItem.ejs", {
      foundList: foundList,
    });
  });
});

app.post("/list/:id/newitem", (request, response) => {
  request.body.listId = request.params.id;
  SchemaListItemPage.create(request.body).then(() => {
    response.redirect(`/list/${request.params.id}`);
  });
});

app.get("/list/:id/edititem", (request, response) => {
  SchemaListItemPage.findById(request.params.id).then((foundListItem) => {
    response.render("edititem.ejs", {
      foundListItem: foundListItem,
    });
  });
});

app.put("/list/:id/edititem", (request, response) => {
  SchemaListItemPage.findByIdAndUpdate(request.params.id, request.body).then(
    (updatedListItem) => {
      response.redirect(`/list/${updatedListItem.listId}`);
    }
  );
});

app.delete("/list/:id/deleteitem", (request, response) => {
  SchemaListItemPage.findByIdAndRemove(request.params.id, request.body).then(
    (deletedListItem) => {
      response.redirect(`/list/${deletedListItem.listId}`);
    }
  );
});

// Delete button is not working.
// I need to figure out where the button is coming from. === show.ejs
// I need to figure out where the button is going. the old list button from top of page.
// This means, I need to change something in the app.delete, IN the server.js
