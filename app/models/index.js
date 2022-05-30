const dbConfig = require("../config/db.config.js");
const mongoose = require("mongoose");
const modelCreate = require("./chat.model.js");

mongoose.Promise = global.Promise;
const db = {};

exports.initial = ()=> {
    
    db.mongoose = mongoose;
    db.url = dbConfig.url;
    // db.schema = modelCreate(mongoose);

    db.Garden = mongoose.model('garden', modelCreate(mongoose), 'garden');
    db.Water = mongoose.model('water', modelCreate(mongoose), 'water');

    // return db;
}

exports.newCollection = (name) => {
    db.name = mongoose.model(name, modelCreate(mongoose));
    return db;
}


exports.db = () => {
    return db;
}