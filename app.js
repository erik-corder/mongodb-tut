const express = require("express");
const { connectToDb, getDb } = require("./db");
const { ObjectId } = require("mongodb");

//init app & middleware
const app = express();
app.use(express.json());

//connect to db
let db;

connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("Server started on port 3000");
    });
    db = getDb();
  }
});

//routes
// app.get("/books", (req, res) => {
//   let books = [];
//   db.collection("books")
//     .find()
//     .sort({ author: 1 })
//     .forEach((book) => {
//       return books.push(book);
//     })
//     .then(() => {
//       res.status(200).json(books);
//     })
//     .catch((err) => {
//       res.status(500).json({ error: "Could not fetch the documents" });
//     });
// });

app.get("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((book) => {
        res.status(200).json(book);
      })
      .catch((err) => {
        res.status(500).json({ error: "Could not fetch the documents" });
      });
  } else {
    res.status(404).json({ error: "Book not found" });
  }
});

app.post("/books", (req, res) => {
  db.collection("books")
    .insertOne(req.body)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: "Could not insert the document" });
    });
});

app.delete("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then((result) => {
        res.status(204).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "Could not delete the document" });
      });
  } else {
    res.status(404).json({ error: "Book not found" });
  }
})

app.patch("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body }
      )
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "Could not update the document" });
      });
  } else {
    res.status(404).json({ error: "Book not found" });
  }
})

// pagination
app.get("/books", (req, res) => {
  let page = parseInt(req.params.p || 0);
  const bookPerPage = 3
  let books = [];
  db.collection("books")
   .find()
   .sort({ author: 1 })
   .skip(page * bookPerPage)
   .limit(bookPerPage)
   .forEach((book) => {
      return books.push(book);
    })
   .then(() => {
      res.status(200).json(books);
    })
   .catch((err) => {
      res.status(500).json({ error: "Could not fetch the documents" });
    });
});