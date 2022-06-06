const dbNetwork = require("../models");
let db = dbNetwork.db();

// Create and Save a chatMessage
exports.create = (req, res) => {
  // console.log(`Room: ${req.body.room}, Message: ${req.body.message}`)
  let room;
  if(req.body.room === undefined){
    // room = 'water';
    return console.log('Room name needed')
  } else {
    room = req.body.room;
  }

  // Validate request
  if (req.body.message === "undefined") {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  // console.log(`In create 3 ${req.body.titel}, ${req.body.description}`);

  // Create a new chat message
  const MySchema = db[room];
  const newMessage = new MySchema({
    message: req.body.message
  });

  // Save Tutorial in the database
  newMessage
    .save(newMessage)
    .then(data => {
      // res.send(data);
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
  // console.log(`room: ${room}}`);
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

      var connection = db.mongoose.connection;
      var collections = connection.db.listCollections();
      collections.toArray(function (err, names) {
        var namesArray = names.map((input) => input.name)
        res.status(200).send(namesArray);
      });
};

//Get all Entrys from an chat collection, sort it and save it in an Array
exports.allChatEntrys = (req, res) => {

  const room = req.params.room;
  const filter = {};

  console.log(`Rooms in all Chat Entrys: ${room}`);
  // console.log(`db[room]: ${db[room]}`);
  
  const all = db[room].find(filter).sort({date: -1}).exec(function(err,docs){
  const messagesInLine = docs.map(document => document.message);
  // console.log(`All: ${messagesInLine}`)
  res.status(200).send(messagesInLine);
  });
 
}