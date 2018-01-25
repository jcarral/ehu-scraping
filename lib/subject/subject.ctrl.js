'use strict';
const EHUrls = require('../utils/ehurls');
const { getDataFromWeb } = require('../utils/scraping');
const { parseSubjectSummary, parseSubjectInfo, parseSubjectSchedule } = require('./subject.parser');

/**
 * Returns the summary of the subject
 * @param {string} subject 
 * @param {string} school 
 * @param {string} degree 
 * @param {string} course 
 */
const getSubjectSummary = (subject, school, degree, course) => {
	if (!subject || typeof subject !== typeof 'string') return Promise.reject('Error: Subject code is required. [getSubjectSummary]');
	else if (!school || typeof school !== typeof 'string') return Promise.reject('Error: School code is required. [getSubjectSummary]');
	else if (!degree || typeof degree !== typeof 'string') return Promise.reject('Error: Degree code is required. [getSubjectSummary]');
	else if (!course || typeof course !== typeof 'string') return Promise.reject('Error: Course is required. [getSubjectSummary]');

	const url = EHUrls.getSubject(subject, school, degree, course);
	return getDataFromWeb(url)
		.then(data => parseSubjectSummary(data, school, degree));
};

/**
 * Returns the detailed information of the subject
 * @param {string} subject 
 * @param {string} school 
 * @param {string} degree 
 * @param {string} course 
 */
const getSubjectDetail = (subject, school, degree, course) => {
	if (!subject || typeof subject !== typeof 'string') return Promise.reject('Error: Subject code is required. [getSubjectSummary]');
	else if (!school || typeof school !== typeof 'string') return Promise.reject('Error: School code is required. [getSubjectSummary]');
	else if (!degree || typeof degree !== typeof 'string') return Promise.reject('Error: Degree code is required. [getSubjectSummary]');
	else if (!course || typeof course !== typeof 'string') return Promise.reject('Error: Course is required. [getSubjectSummary]');

	let url = EHUrls.getSubject(subject, school, degree, course);
	url = url.replace('p_menu=principal', 'p_menu=guia');
	return getDataFromWeb(url)
		.then(data => parseSubjectInfo(data));
};

/**
 * Returns the timetable of the subject
 * @param {string} subject 
 * @param {string} school 
 * @param {string} degree 
 * @param {string} course 
 */
const getSubjectSchedule = (subject, school, degree, course) => {
	if (!subject || typeof subject !== typeof 'string') return Promise.reject('Error: Subject code is required. [getSubjectSchedule]');
	else if (!school || typeof school !== typeof 'string') return Promise.reject('Error: School code is required. [getSubjectSchedule]');
	else if (!degree || typeof degree !== typeof 'string') return Promise.reject('Error: Degree code is required. [getSubjectSchedule]');
	else if (!course || typeof course !== typeof 'string') return Promise.reject('Error: Course is required. [getSubjectSchedule]');

	const url = EHUrls.getSubject(subject, school, degree, course);
	return getDataFromWeb(url)
		.then(data => parseSubjectSchedule(data, school, degree));
};

module.exports = {
	getSubjectSummary,
	getSubjectDetail,
	getSubjectSchedule
};
