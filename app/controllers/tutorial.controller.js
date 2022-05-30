 const db = require("../models").db();

// Create and Save a chatMessage
exports.create = (req, res) => {
  const MySchema = db.Water;
  // Validate request
  if (req.body.title === "undefined") {
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
          err.message || "Some error occurred while creating the Tutorial."
      });
    })
};



// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  console.log(`find all 1 ${req.query.titel}`);
    const title = req.query.titel;
    var condition = title ? { titel: { $regex: new RegExp(title), $options: "i" } } : {};
    console.log(`find all 2 ${JSON.stringify(condition)}`);
    Tutorial.find(condition)
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
