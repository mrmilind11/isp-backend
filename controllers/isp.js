const { ErrorHandler } = require('../utils/errorHandler');
const mongoose = require('mongoose');
const { ISPModel, validateAddISP } = require('../models/isp');
const _ = require('lodash');
const fs = require('fs');

const setDataForClient = (req, data) => {
    let newData = _.cloneDeep(data.toJSON());
    newData.image = `${req.protocol}://${req.get('host')}/images/${newData.image}`;
    delete newData.__v;
    console.log('new data', newData);
    return newData;
}
const removeImageFromStorage = (imageName) => {
    fs.unlink('public/images/' + imageName, (err) => {
        if (err) console.log('Error in file remove', err);
    });
}
const get_isp_list = async (req, res, next) => {
    try {
        let fetchedISPLIst = await ISPModel.find({}).sort('name');
        const dataToSend = fetchedISPLIst.map((data) => { return setDataForClient(req, data) });
        res.send({ 'ispList': dataToSend });
    }
    catch (error) {
        next(new ErrorHandler(500, error.message));
    }
}
const add_isp = async (req, res, next) => {
    if (!req.file) return next(new ErrorHandler(400, 'No image added'));
    let ispData = req.body || {};
    ispData.image = req.file.filename;
    delete ispData._id;

    const { error } = validateAddISP(ispData);
    if (error) {
        removeImageFromStorage(ispData.image);
        return next(new ErrorHandler(400, error.details[0].message));
    }
    ispData._id = new mongoose.Types.ObjectId();
    let newISP = new ISPModel(ispData);
    try {
        let savedData = await newISP.save();
        const dataToSend = setDataForClient(req, savedData)
        res.send(dataToSend);
    }
    catch (error) {
        removeImageFromStorage(ispData.image);
        next(new ErrorHandler(500, error.message));
    }
}

const delete_isp = async (req, res, next) => {
    const id = req.query.id;
    if (!id) return next(new ErrorHandler(400, 'No id provided'));
    if (!mongoose.Types.ObjectId.isValid(id)) return next(new ErrorHandler(400, 'Not a valid id'));

    try {
        const removedData = await ISPModel.findByIdAndDelete(id);
        if (removedData) {
            removeImageFromStorage(removedData.image);
            res.send(setDataForClient(req, removedData))
        }
        else {
            next(new ErrorHandler(500, 'No matching id found'))
        }
    }
    catch (error) {
        next(new ErrorHandler(500, error.message));
    }
}
module.exports.get_isp_list = get_isp_list;
module.exports.add_isp = add_isp;
module.exports.delete_isp = delete_isp;