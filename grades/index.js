"use strict"
const request = require('request');

const {getCampusUrl, getAllGradesUrl, getGradeUrl, getGradeSubjectsUrl} = require('../utils/urls');
const {parseCampusData, parseGradesBySchool, parseGradeSummary, parseGradeSubjects} = require('./grades.parser.js');
const {getDataFromWeb} = require('../utils/scraping');

const getGradesByCampus = (campus) => {
  if (!campus || campus.length === 0 || typeof campus === "function") {
    return Promise.reject("Campus must be an String. Only BI, GI, and AR are avalaible.");
  } else {
    return getCampusUrl(campus).then(url => getDataFromWeb(url)).then(data => parseCampusData(data))
  }
};

const getGradesBySchool = (school, callback) => {
  if (!school || typeof school !== typeof 0) {
    return Promise.reject("School must be a valid integer.");
  } else {
    const url = getAllGradesUrl();
    return getDataFromWeb(url).then(data => parseGradesBySchool(data, school));
  }
};

const getGradeSummary = (gradeCode, schoolCode) => {
  if (!gradeCode || typeof gradeCode !== typeof "string")
    return Promise.reject("Error: Grade code is required to obtain the information");
  else if (!schoolCode || typeof schoolCode !== typeof "string")
    return Promise.reject("Error: School code is required to obtain the information");
  else {
    const url = getGradeUrl(gradeCode, schoolCode);

    return getDataFromWeb(url).then(data => parseGradeSummary(data, schoolCode, url));
  }
};

const getGradeSubjects = (gradeCode, schoolCode) => getGradeSubjectsByCourse(gradeCode, schoolCode, null);

const getGradeSubjectsByCourse = (gradeCode, schoolCode, course) => {
  if (!gradeCode || typeof gradeCode !== typeof "string")
    return Promise.reject("Error: Grade code is required to obtain the information");
  else if (!schoolCode || typeof schoolCode !== typeof "string")
    return Promise.reject("Error: School code is required to obtain the information");
  else {
    const url = getGradeSubjectsUrl(gradeCode, schoolCode);
    return getDataFromWeb(url).then(data => parseGradeSubjects(data, course))
  }
};

module.exports = {
  getGradesByCampus: getGradesByCampus,
  getGradesBySchool: getGradesBySchool,
  getGradeSummary: getGradeSummary,
  getGradeSubjects: getGradeSubjects,
  getGradeSubjectsByCourse: getGradeSubjectsByCourse
}
