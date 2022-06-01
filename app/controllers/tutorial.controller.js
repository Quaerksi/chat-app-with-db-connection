const dbNetwork = require("../models");
let db = dbNetwork.db();
// let allCollections;

// Create and Save a chatMessage
exports.create = (req, res) => {
  console.log(`Room: ${req.body.room}, Message: ${req.body.message}`)
  let room;
  if(req.body.room === undefined){
    room = 'water';
  } else {
    room = req.body.room;
  }
  const MySchema = db[room];
  // Validate request
  if (req.body.message === "undefined") {
    // if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  // console.log(`In create 3 ${req.body.titel}, ${req.body.description}`);

  // Create a new chat message
  const newMessage = new MySchema({
    message: req.body.message
  });
  // Save Tutorial in the database
  newMessage
    .save(newMessage)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      // console.log('In create 5');
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Chat."
      });
    })
};

//create a new collection
exports.createCollection = (req, res) => {

  const room = req.body.room;
  console.log(`room: ${room}, ${db[room]}`);
  if(!db[room]){
    db = dbNetwork.newCollection(room);
    res.status(200).send({
      message: "OK"
    });
  } else {
    res.status(500).send({
      message: "Some error occurred while creating the Chat."
    });
  }
}


// Retrieve all Chats from the database.
exports.findAll = (req, res) => {

  // var mongoose = require('mongoose');
      var connection = db.mongoose.connection;
      var collections = connection.db.listCollections();
      collections.toArray(function (err, names) {
        var namesArray = names.map((input) => input.name)
        // names.map((input) => dbNetwork.newCollection(input.name))
        // console.log(namesArray) 
        //send names of existing arrays
        // allCollections = namesArray;
        res.status(200).send(namesArray);
      });
      // console.log(`All collections: ${allCollections}`)
};


// Find a single Tutorial with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Tutorial.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found Tutorial with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Tutorial with id=" + id });
      });
};
// Update a Tutorial by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
          message: "Data to update can not be empty!"
        });
      }
      const id = req.params.id;
      Tutorial.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
          if (!data) {
            res.status(404).send({
              message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`
            });
          } else res.send({ message: "Tutorial was updated successfully." });
        })
        .catch(err => {
          res.status(500).send({
            message: "Error updating Tutorial with id=" + id
          });
        });
};
// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Tutorial.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
          });
        } else {
          res.send({
            message: "Tutorial was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Tutorial with id=" + id
        });
      });
};
// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
    Tutorial.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Tutorials were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials."
      });
    });
  
};
// Find all published Tutorials
exports.findAllPublished = (req, res) => {
    Tutorial.find({ published: true })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials."
        });
      });
  };
