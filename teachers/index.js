"use strict"

const { getDataFromWeb } = require('../utils/scraping');
const { getTeachersUrl } = require('../utils/urls');
const { grades } = require('../utils/codes');
const { parseTeacherList } = require('./teachers.parser');

const _getTeachersFromGrade = (grade) => {
	if(!grade || typeof grade !== typeof "string") return Promise.reject("Error: Code of the grade is required [getTeachersFromGrade]");
	if(!grades.hasOwnProperty(grade)) return Promise.reject("Error: Grade doesn't exist");
	
	const gradeName = grades[grade];
	const url = getTeachersUrl(gradeName);
	return getDataFromWeb(url)
		.then(res => parseTeacherList(res, gradeName));

};

const _getTeacherSchedule = (grade, id) => {
	if(!grade || typeof grade !== typeof "string")	 return Promise.reject("Error: Code of the grade is required [getTeacherSummary]");
	if (!id || typeof id !== typeof "string") return Promise.reject("Error: Id of the required is required [getTeacherSummary]");
};

module.exports = {
	getTeachersFromGrade : _getTeachersFromGrade,
	getTeacherSchedule : _getTeacherSchedule
};
