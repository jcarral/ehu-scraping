"use strict"
const request = require('request');

const { getCampusUrl } = require('./urls');
const { parseCampusData } = require('./parsers');
const { getDataFromWeb } = require('./utils');

const getGradesByCampus = (campus, callback) => new Promise((resolve, reject) => {
  if(campus.length === 0 || typeof campus === "function"){
    reject("Campus must be an String. Only BI, GI, and AR are avalaible.");
    return callback("Campus must be an String. Only BI, GI, and AR are avalaible.");
  }else{
    return getCampusUrl(campus)
      .then(url => getDataFromWeb(url))
      .then(data => parseCampusData(data))
      .then(res => resolve(res))
      .catch(err => reject(err));
  }
});


module.exports = {
  getGradesByCampus : getGradesByCampus
}
