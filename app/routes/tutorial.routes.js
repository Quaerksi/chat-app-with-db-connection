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
    router.get("/allChatEntrys/:room", chats.allChatEntrys);
    
    app.use('/api/tutorials', router);
  };