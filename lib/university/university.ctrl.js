'use strict';

const { parseAllGrades } = require('./university.parser');
const { getDataFromWeb } = require('../utils/scraping');
const { valToCampus } = require('../utils/formats');
const EHUrls = require('../utils/ehurls');

const getAllGrades = () => {
	try {
		return getDataFromWeb(EHUrls.getAllGrades())
			.then(res => parseAllGrades(res));
	} catch (e) {
		return Promise.reject(e);
	}
};

const getGradesByCampus = (campus) => {
	try {
		const campusVal = valToCampus(campus);
		return getAllGrades()
			.then(listOfGrades => listOfGrades.filter(school => school.campus === campusVal));
	} catch (e) {
		return Promise.reject(e);
	}
};

const getGradesBySchool = (school) => {
	try {
		return getAllGrades()
			.then(listOfGrades => listOfGrades.filter(sc => sc.code === school));
	} catch (e) {
		return Promise.reject(e);
	}
};

module.exports = {
	getAllGrades,
	getGradesByCampus,
	getGradesBySchool
};
