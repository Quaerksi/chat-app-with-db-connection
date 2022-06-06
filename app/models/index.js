const dbConfig = require("../config/db.config.js");
const mongoose = require("mongoose");
const modelCreate = require("./chat.model.js");

mongoose.Promise = global.Promise;
const db = {};

exports.initial = ()=> {
    
    db.mongoose = mongoose;
    db.url = dbConfig.url;
    db.schema = modelCreate(mongoose);
}

exports.newCollection = (name) => {
    // console.log('In new collection');
    db[name] = mongoose.model(name, modelCreate(mongoose), name);
    return db;
}

exports.db = () => {
    return db;
}