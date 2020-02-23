const mongoose = require('mongoose');

const queryCountSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    queryName: { type: String, required: true, unique: true },
    count: { type: Number, required: true, default: 0 }
})

const QueryCountModel = mongoose.model('queryCount', queryCountSchema, 'queryCount');

module.exports.QueryCountModel = QueryCountModel;