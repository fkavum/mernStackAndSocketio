const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    _id: {type: String, required:true},
    data: {type: Object},
},{
    timestamps:true,
});

const Document = mongoose.model('googleDoc', documentSchema);

module.exports = Document;