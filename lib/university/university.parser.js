"use strict";

const cheerio = require('cheerio');
const { groupBy } = require('../utils/util');
const { valToCampus } = require('../utils/formats');
/**
 * Function to get all grades from the college
 * @param {Object} data 
 */
const parseAllGrades = (data) => new Promise((resolve, reject) => {
	if (!data) return Promise.reject("Can't parse empty data");

	const $ = cheerio.load(data);
	let grades = [];

	//All grades wrappers have the asig class
	$(`.asig`).each(function () {
		let grade = {};
		const gradeHref = $(this).attr("href");
		grade.href = `http://gestion-servicios.ehu.es/pls/entrada/plew0040.htm${gradeHref}`;
		grade.name = $(this).text().split('(')[0];
		//Object with the school code, name and the grade code
		const info = _getSchoolAndGradeInfo($(this).text(), gradeHref);
		grade.school = {};
		grade.school.code = info.school.code;
		grade.school.name = info.school.name;
		grade.school.campus = valToCampus(info.campus);
		grade.code = info.code;

		grades.push(grade);
	});
	const schools = groupBy('school', grades);
	return resolve(schools);
});

/**
 * Function to retrieve the the school name, school code, campus code and grade name from text and url
 * text = Grado en pinta y colorea (Araba) (Facultad Informatica)
 * @param {String} text 
 * @param {String} href
 */
const _getSchoolAndGradeInfo = (text, href) => {
	const bracketsTxt = text.split('(');
	const school = {};
	const schoolCode = href.split('p_cod_centro=')[1].split('&')[0];
	const gradeCode = href.split('p_cod_plan=')[1].split('&')[0];

	if (bracketsTxt.length === 3) return {
		code: gradeCode,
		campus: bracketsTxt[1].substring(0, bracketsTxt[1].indexOf(')')),
		school: {
			name: bracketsTxt[2].substring(0, bracketsTxt[2].indexOf(')')),
			code: schoolCode,
		}
	}
	else if (bracketsTxt.length === 4) return { //If the text has 3 strings between brackets
		code: gradeCode,
		campus: bracketsTxt[2].substring(0, bracketsTxt[2].indexOf(')')),
		school: {
			name: bracketsTxt[3].substring(0, bracketsTxt[3].indexOf(')')),
			code: schoolCode
		}
	};
	else return {
		code: gradeCode || 'Unknown',
		campus: 0,
		school: {
			name: 'Unknown',
			code: schoolCode || 'NaN'
		}
	};
};

module.exports = {
	parseAllGrades
};
