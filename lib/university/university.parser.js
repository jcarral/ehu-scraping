'use strict';

const cheerio = require('cheerio');
const { groupBy } = require('../utils/util');
const { valToCampus } = require('../utils/formats');
/**
 * Function to get all Degrees from the college
 * @param {Object} data 
 */
const parseAllDegrees = (data) => new Promise((resolve, reject) => {
	if (!data) return reject('Can\'t parse empty data');

	const $ = cheerio.load(data);
	let degrees = [];

	//All degrees wrappers have the asig class
	$('.asig').each(function () {
		let degree = {};
		const degreeHref = $(this).attr('href');
		degree.href = `http://gestion-servicios.ehu.es/pls/entrada/plew0040.htm${degreeHref}`;
		degree.name = $(this).text().split('(')[0];
		//Object with the school code, name and the degree code
		const info = _getSchoolAndDegreeInfo($(this).text(), degreeHref);
		degree.school = {};
		degree.school.code = info.school.code;
		degree.school.name = info.school.name;
		degree.school.campus = valToCampus(info.campus);
		degree.code = info.code;

		degrees.push(degree);
	});
	const schools = groupBy('school', degrees);
	return resolve(schools);
});

/**
 * Function to retrieve the the school name, school code, campus code and degree name from text and url
 * text = Grado en pinta y colorea (Araba) (Facultad Informatica)
 * @param {String} text 
 * @param {String} href
 */
const _getSchoolAndDegreeInfo = (text, href) => {
	const bracketsTxt = text.split('(');
	const schoolCode = href.split('p_cod_centro=')[1].split('&')[0];
	const degreeCode = href.split('p_cod_plan=')[1].split('&')[0];

	if (bracketsTxt.length === 3) return {
		code: degreeCode,
		campus: bracketsTxt[1].substring(0, bracketsTxt[1].indexOf(')')),
		school: {
			name: bracketsTxt[2].substring(0, bracketsTxt[2].indexOf(')')),
			code: schoolCode,
		}
	};
	else if (bracketsTxt.length === 4) return { //If the text has 3 strings between brackets
		code: degreeCode,
		campus: bracketsTxt[2].substring(0, bracketsTxt[2].indexOf(')')),
		school: {
			name: bracketsTxt[3].substring(0, bracketsTxt[3].indexOf(')')),
			code: schoolCode
		}
	};
	else return {
		code: degreeCode || 'Unknown',
		campus: 0,
		school: {
			name: 'Unknown',
			code: schoolCode || 'NaN'
		}
	};
};

module.exports = {
	parseAllDegrees
};
