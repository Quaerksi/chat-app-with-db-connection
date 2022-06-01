module.exports = app => {
    const chats = require("../controllers/tutorial.controller.js");
    var router = require("express").Router();

    // Create a new Tutorial
    router.post("/", chats.create);
    // Create new collection with room name
    router.post("/newroom", chats.createCollection)
    // Retrieve all chats
    router.get("/", chats.findAll);


    // Retrieve all published chats
    router.get("/published", chats.findAllPublished);
    // Retrieve a single Tutorial with id
    router.get("/:id", chats.findOne);
    // Update a Tutorial with id
    router.put("/:id", chats.update);
    // Delete a Tutorial with id
    router.delete("/:id", chats.delete);
    // Create a new Tutorial
    router.delete("/", chats.deleteAll);
    app.use('/api/tutorials', router);
  };