'use strict';

const { getDataFromWeb } = require('../utils/scraping');
const { parseTeacherSchedule } = require('./teacher.parser');
const EHUrls = require('../utils/ehurls');
const Degree = require('../degree');

/**
 * Return tutorships from the teacher
 * @param {string} degree 
 * @param {string} id 
 */
const getTeacherTutorships = (degree, id) => {
	try{
		if (!degree || typeof degree !== typeof 'string') return Promise.reject('Error: Code of the degree is required [getTeacherSummary]');
		if (!id || typeof id !== typeof 'string') return Promise.reject('Error: Id of the required is required [getTeacherSummary]');

		const degreeName = Degree.getName(degree);
		const url = EHUrls.getTeacherProfile(degreeName, id);
		return getDataFromWeb(url)
			.then(data => parseTeacherSchedule(data, degree, id));
	}catch(e){
		return Promise.reject(e);
	}
};

module.exports = {
	getTeacherTutorships
};
