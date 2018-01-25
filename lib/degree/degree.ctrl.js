'use strict';

const EHUrls = require('../utils/ehurls');
const { getDataFromWeb } = require('../utils/scraping');
const { degrees, schools } = require('../utils/codes');
const { parseDegreeSummary, parseDegreeSubjects, parseAllTeachers } = require('./degree.parser');

/**
 * Return the degree summary
 * @param {string} code 
 * @param {string} school 
 */
const getDegreeSummary = (code, school) => {
	try {
		if(!_validDegree(code)) return Promise.reject('Invalid degree');
		const url = EHUrls.getDegree(code, school);
		return getDataFromWeb(url)
			.then(res => parseDegreeSummary(res, school, url));
	} catch (e) {
		return Promise.reject(e);
	}
};

/**
 * Returns the list of subjects of the degree
 * @param {*} degree 
 * @param {*} school 
 */
const getAllSubjects = (degree, school) => {
	try {
		if (!_validDegree(degree)) return Promise.reject('Invalid degree');
		const url = EHUrls.getSubjectsPage(degree, school);
		return getDataFromWeb(url)
			.then(res => parseDegreeSubjects(res));
	} catch (e) {
		return Promise.reject(e);
	}
};

/**
 * 
 * @param {*} degree 
 * @param {*} school 
 * @param {*} course 
 */
const getSubjectsFromCourse = (degree, school, course) => {
	try {
		if (!_validDegree(degree)) return Promise.reject('Invalid degree');
		const url = EHUrls.getSubjectsPage(degree, school);
		return getDataFromWeb(url)
			.then(res => parseDegreeSubjects(res, course));
	} catch (e) {
		return Promise.reject(e);
	}
};

/**
 * Returns the list of teachers
 * @param {string} degree 
 * @param {string} school 
 */
const getAllTeachers = (degree) => {
	try {
		const degreeName = getNameOfDegree(degree);
		const url = EHUrls.getTeacherList(degreeName);
		return getDataFromWeb(url)
			.then(res => parseAllTeachers(res, degree));
	} catch (e) {
		return Promise.reject(e);
	}
};

/**
 * Returns the code of the degree
 * @param {string} name 
 */
const getCodeOfDegree = name => {
	const degreeList = Object.keys(degrees).filter(key => degrees[key] === name);
	return (degreeList.length > 0)?degreeList[0]:null;
};

/**
 * Returns the name of the degree
 * @param {string} code 
 */
const getNameOfDegree = code => {
	if (!_validDegree(code)) throw new Error('Invalid code of degree');
	else return degrees[code];
};

/**
 * Returns true of the degree exists
 */
const _validDegree = (code) => degrees.hasOwnProperty(code);


/**
 * Retuns the code of the school
 * @param {string} code
 */
const getDegreeSchool = (code) => {
	return schools[code];
};

module.exports = {
	getDegreeSummary,
	getAllSubjects,
	getAllTeachers,
	getSubjectsFromCourse,
	getNameOfDegree,
	getCodeOfDegree,
	getDegreeSchool
};
