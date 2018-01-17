"use strict";

const { getDataFromWeb } = require('../utils/scraping');
const { getSubjectUrl } = require('../utils/urls');
const { parseSubjectSummary, parseSubjectInfo, parseSubjectSchedule } = require('./subjects.parser');

const _getSubjectSummary = (subject, school, grade, course) => {
	if (!subject || typeof subject !== typeof "string") return Promise.reject('Error: Subject code is required. [getSubjectSummary]');
	else if (!school || typeof school !== typeof "string") return Promise.reject('Error: School code is required. [getSubjectSummary]');
	else if (!grade || typeof grade !== typeof "string") return Promise.reject('Error: Grade code is required. [getSubjectSummary]');
	else if (!course || typeof course !== typeof "string") return Promise.reject('Error: Course is required. [getSubjectSummary]');

	const url = getSubjectUrl(subject, school, grade, course);
	return getDataFromWeb(url)
					.then(data => parseSubjectSummary(data, school, grade));
};

const _getSubjectInfo = (subject, school, grade, course) => {
	if (!subject || typeof subject !== typeof "string") return Promise.reject('Error: Subject code is required. [getSubjectSummary]');
	else if (!school || typeof school !== typeof "string") return Promise.reject('Error: School code is required. [getSubjectSummary]');
	else if (!grade || typeof grade !== typeof "string") return Promise.reject('Error: Grade code is required. [getSubjectSummary]');
	else if (!course || typeof course !== typeof "string") return Promise.reject('Error: Course is required. [getSubjectSummary]');

	let url = getSubjectUrl(subject, school, grade, course);
	url = url.replace('p_menu=principal', 'p_menu=guia');
	return getDataFromWeb(url)
					.then(data => parseSubjectInfo(data));
};

const _getSubjectSchedule = (subject, school, grade, course) => {
	if (!subject || typeof subject !== typeof "string") return Promise.reject('Error: Subject code is required. [getSubjectSchedule]');
	else if (!school || typeof school !== typeof "string") return Promise.reject('Error: School code is required. [getSubjectSchedule]');
	else if (!grade || typeof grade !== typeof "string") return Promise.reject('Error: Grade code is required. [getSubjectSchedule]');
	else if (!course || typeof course !== typeof "string") return Promise.reject('Error: Course is required. [getSubjectSchedule]');

	const url = getSubjectUrl(subject, school, grade, course);
	return getDataFromWeb(url)
					.then(data => parseSubjectSchedule(data, school, grade));
};

module.exports = {
	getSubjectSummary: _getSubjectSummary,
	getSubjectInfo: _getSubjectInfo,
	getSubjectSchedule: _getSubjectSchedule
}
