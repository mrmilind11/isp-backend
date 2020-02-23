const { ErrorHandler } = require('../utils/errorHandler');
const mongoose = require('mongoose');
const { ISPModel, validateAddISP } = require('../models/isp');
const _ = require('lodash');
const fs = require('fs');
const ejs = require('ejs');
const convertHTMLToPDF = require('pdf-puppeteer');

const setDataForClient = (req, data) => {
    let newData = _.cloneDeep(data.toJSON());
    newData.image = `${req.protocol}://${req.get('host')}/images/${newData.image}`;
    delete newData.__v;
    return newData;
}
const removeImageFromStorage = (imageName) => {
    fs.unlink('public/images/' + imageName, (err) => {
        if (err) console.log('Error in file remove', err);
    });
}
const getQueryAndSortHash = (req) => {
    let queryHash = {};
    let sortHash = { 'name': 1 };
    if (req.query && JSON.stringify(req.query) !== '{}') {
        if (req.query.searchText) {
            let orList = [];
            orList.push({ 'name': new RegExp(req.query.searchText, 'ig') });
            const searchTextInt = parseInt(req.query.searchText);
            if (!isNaN(searchTextInt)) {
                orList.push({ 'rating': searchTextInt });
                orList.push({ 'lowest_price': searchTextInt })
            }
            queryHash = { $or: orList };
        }
        if (req.query.sortBy) {
            const sortByMap = { 'price': 'lowest_price', 'rating': 'rating', 'name': 'name' };
            const sortBy = sortByMap[req.query.sortBy] || 'name';
            const orderBy = req.query.orderBy === 'DES' ? -1 : 1;
            sortHash = {};
            sortHash[sortBy] = orderBy;
        }
    }
    return { queryHash, sortHash };
}
const get_isp_list = async (req, res, next) => {
    const { queryHash, sortHash } = getQueryAndSortHash(req);
    try {
        let fetchedISPLIst = await ISPModel.find(queryHash).sort(sortHash);
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
const download_pdf = async (req, res, next) => {
    let id = req.params.id;
    if (!id) return next(new ErrorHandler(400, 'No id provided'));
    if (!mongoose.Types.ObjectId.isValid(id)) return next(new ErrorHandler(400, 'Not a valid id'));
    try {
        const ispData = await ISPModel.findById(id);
        let ispDataJson = _.cloneDeep(ispData);
        let imageSrc = 'public/images/' + ispDataJson.image;
        fs.readFile(imageSrc, (err, data) => {
            if (err) {
                return next(new ErrorHandler(500, err));
            }
            else {
                let imageData = `data:image/${imageSrc.split('.')[1]};base64,${data.toString('base64')}`;
                const dr = {
                    name: ispDataJson.name,
                    image: imageData,
                    price: ispDataJson.price,
                    max_speed: ispDataJson.max_speed,
                    email: ispDataJson.email,
                    contact_number: ispDataJson.contact_number,
                    description: ispDataJson.description
                }
                ejs.renderFile('templates/ispDetails.ejs', dr, (err, html) => {
                    if (err) {
                        return next(new ErrorHandler(500, err));
                    }
                    else {
                        convertHTMLToPDF(html, (pdf) => {
                            const newFilepath = 'pdf' / ispDataJson.name + '_' + Date.now() + '.pdf'
                            fs.writeFile(newFilepath, pdf, (err) => {
                                if (err) return next(new ErrorHandler(500, err));
                                res.download(newFilepath);
                            });
                        })
                    }

                })
            }
        });
    }
    catch (error) {
        next(new ErrorHandler(500, error.message));
    }
}
module.exports.get_isp_list = get_isp_list;
module.exports.add_isp = add_isp;
module.exports.delete_isp = delete_isp;
module.exports.download_pdf = download_pdf;