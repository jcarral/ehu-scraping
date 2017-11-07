"use strict"
const request = require('request');

const { getCampusUrl, getAllGradesUrl } = require('./urls');
const { parseCampusData, parseGradesBySchool } = require('./parsers');
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

const getGradesBySchool = (school, callback) => new Promise((resolve, reject) => {
  if(!school || typeof school !== typeof 0){
    reject("School must be a valid integer.");
    return callback("School must be a valid integer");
  }else{
    const url = getAllGradesUrl();
    return getDataFromWeb(url)
      .then(data => parseGradesBySchool(data, school))
      .then(res => resolve(res))
    //  .then(() => callback(null, res))
      .catch((err) => {
    //    callback(err);
        reject(err);
      });
  }
});

module.exports = {
  getGradesByCampus : getGradesByCampus,
  getGradesBySchool : getGradesBySchool
}
