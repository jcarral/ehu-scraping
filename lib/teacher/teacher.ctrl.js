'use strict';

const { getDataFromWeb } = require('../utils/scraping');
const { parseTeacherSchedule } = require('./teacher.parser');
const EHUrls = require('../utils/ehurls');
const Grade = require('../grade');

/**
 * Return tutorships from the teacher
 * @param {string} grade 
 * @param {string} id 
 */
const getTeacherTutorships = (grade, id) => {
	try{
		if (!grade || typeof grade !== typeof 'string') return Promise.reject('Error: Code of the grade is required [getTeacherSummary]');
		if (!id || typeof id !== typeof 'string') return Promise.reject('Error: Id of the required is required [getTeacherSummary]');

		const gradeName = Grade.getName(grade);
		const url = EHUrls.getTeacherProfile(gradeName, id);
		return getDataFromWeb(url)
			.then(data => parseTeacherSchedule(data, grade, id));
	}catch(e){
		return Promise.reject(e);
	}
};

module.exports = {
	getTeacherTutorships
};
