"use strict";

const { parseAllGrades } = require('./university.parser');
const { getDataFromWeb } = require('../utils/scraping');
const { valToCampus } = require('../utils/formats');
const EHUrls = require('../utils/ehurls');

const getAllGrades = () => {
	return getDataFromWeb(EHUrls.getAllGrades())
		.then(res => parseAllGrades(res));
};

const getGradesByCampus = (campus) => {
	const campusVal = valToCampus(campus);
	return getAllGrades()
		.then(listOfGrades => listOfGrades.filter(school => school.campus === campusVal));
};

const getGradesBySchool = (school) => {
	return getAllGrades()
		.then(listOfGrades => listOfGrades.filter(school => school.school === school));
};

module.exports = {
	getAllGrades,
	getGradesByCampus,
	getGradesBySchool
}
