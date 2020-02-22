const { ErrorHandler } = require('../utils/errorHandler');
const mongoose = require('mongoose');
const { ISPModel, validateAddISP } = require('../models/isp');
const _ = require('lodash');

const setDataForClient = (req, data) => {
    let newData = _.cloneDeep(data);
    newData.image = `${req.protocol}://${req.get('host')}/images/${newData.image}`;
    delete newData.__V;
    return newData;
}

const get_isp_list = async (req, res, next) => {
    try {
        let fetchedISPLIst = await ISPModel.find({}).sort('name');
        fetchedISPLIst.map((data) => { return setDataForClient(req, data) });
        res.send({ 'ispList': fetchedISPLIst });
    }
    catch (error) {
        next(new ErrorHandler(500, error.message));
    }
}
const add_isp = async (req, res, next) => {
    if (!req.file) return next(new ErrorHandler(400, 'No image added'));
    let ispData = req.body;
    ispData.image = req.file.filename;

    const { error } = validateAddISP(ispData);
    if (error) return next(new ErrorHandler(400, error.details[0].message));

    ispData._id = new mongoose.Schema.Types.ObjectId();
    let newISP = new ISPModel(ispData);
    try {
        let savedData = await newISP.save();
        res.send(setDataForClient(savedData));
    }
    catch (error) {
        next(new ErrorHandler(500, error.message));
    }
}
module.exports.get_isp_list = get_isp_list;
module.exports.add_isp = add_isp;