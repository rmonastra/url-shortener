//Structure of database
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchema = new Schema({
    original_url: String,
    short_url: String
});

const ModelClass = mongoose.model('shortUrl', urlSchema);

module.exports = ModelClass;
