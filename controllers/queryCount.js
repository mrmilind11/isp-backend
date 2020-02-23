const { QueryCountModel } = require('../models/queryCount');
const { ErrorHandler } = require('../utils/errorHandler');
const mongoose = require('mongoose');
const update_Count = async (name) => {
    if (name) {
        try {
            const data = await QueryCountModel.findOne({ 'queryName': name });
            if (data) {
                console.log('data', data);
                await data.updateOne({ $inc: { count: 1 } })
            }
            else {
                let newData = { queryName: name, count: 1, _id: new mongoose.Types.ObjectId() };
                const queryCountData = new QueryCountModel(newData);
                await queryCountData.save();
            }
        }
        catch (error) {
            console.log('error', error);
            return new ErrorHandler(500, error.message);
        }
    }
}
const get_total_count = async (req, res, next) => {
    try {
        const countObj = await QueryCountModel.aggregate([{ $match: {} }, { $project: { 'totalCount': { $sum: '$count' } } }]);
        res.send({ 'totalCount': countObj[0].totalCount || 0 })
    }
    catch (error) {
        next(new ErrorHandler(500, error.message));
    }
}
module.exports.update_Count = update_Count;
module.exports.get_total_count = get_total_count;