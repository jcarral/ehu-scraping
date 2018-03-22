'use strict';

const EHUrls = require('../utils/ehurls');
const { getDataFromWeb } = require('../utils/scraping');
const { grades, schools } = require('../utils/codes');
const { parseGradeSummary, parseGradeSubjects, parseAllTeachers } = require('./grade.parser');

/**
 * Return the grade summary
 * @param { string } code
 * @param {string} school
 */
const getGradeSummary = (code, school) => {
	try {
  if(!_validGrade(code)) return Promise.reject('Invalid grade');
		const url = EHUrls.getGrade(code, school);
		return getDataFromWeb(url)
			.then(res => parseGradeSummary(res, school, url));
	} catch (e) {
		return Promise.reject(e);
	}
};

/**
 * Returns the list of subjects of the grade
 * @param {*} grade 
 * @param {*} school 
 */
const getAllSubjects = (grade, school) => {
	try {
		if (!_validGrade(grade)) return Promise.reject('Invalid grade');
		const url = EHUrls.getSubjectsPage(grade, school);
		return getDataFromWeb(url)
			.then(res => parseGradeSubjects(res));
	} catch (e) {
		return Promise.reject(e);
	}
};

/**
 * 
 * @param {*} grade 
 * @param {*} school 
 * @param {*} course 
 */
const getSubjectsFromCourse = (grade, school, course) => {
	try {
		if (!_validGrade(grade)) return Promise.reject('Invalid grade');
		const url = EHUrls.getSubjectsPage(grade, school);
		return getDataFromWeb(url)
			.then(res => parseGradeSubjects(res, course));
	} catch (e) {
		return Promise.reject(e);
	}
};

/**
 * Returns the list of teachers
 * @param {string} grade 
 * @param {string} school 
 */
const getAllTeachers = (grade) => {
	try {
		const gradeName = getNameOfGrade(grade);
		const url = EHUrls.getTeacherList(gradeName);
		return getDataFromWeb(url)
			.then(res => parseAllTeachers(res, grade));
	} catch (e) {
		return Promise.reject(e);
	}
};

/**
 * Returns the code of the grade
 * @param {string} name 
 */
const getCodeOfGrade = name => {
	const gradeList = Object.keys(grades).filter(key => grades[key] === name);
	return (gradeList.length > 0)?gradeList[0]:null;
};

/**
 * Returns the name of the grade
 * @param {string} code 
 */
const getNameOfGrade = code => {
	if (!_validGrade(code)) throw new Error('Invalid code of grade');
	else return grades[code];
};

/**
 * Returns true of the grade exists
 */
const _validGrade = (code) => grades.hasOwnProperty(code);


/**
 * Retuns the code of the school
 * @param {string} code
 */
const getGradeSchool = (code) => {
	return schools[code];
};

module.exports = {
	getGradeSummary,
	getAllSubjects,
	getAllTeachers,
	getSubjectsFromCourse,
	getNameOfGrade,
	getCodeOfGrade,
	getGradeSchool
};
