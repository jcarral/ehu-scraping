"use strict";

const cheerio = require('cheerio');
const {courseValue, valToCampus} = require('../utils/formats');
const { groupBy } = require('../utils/util');
//Constants to use with the table of subjects
const T_NAME = 0, T_TERM = 1, T_CREDITS = 2, T_LANGUAGES = 4;

/**
 * Function to get all schools and grades from the campus
 * @param {*} data 
 * @param {String} campus Campus code
 */
const parseCampusData = (data, campus) => {
	if (!data) return Promise.reject("Can't parse empty data");
	if (!campus) return Promise.reject("Can't continue without the campus value");
	const campusVal = valToCampus(campus);
	return parseAllGrades(data)
		.then(listOfSchools => listOfSchools.filter(school => school.campus === campusVal));
};

/**
 * Function to get all grades from the college
 * @param {*} data 
 */
const parseAllGrades = (data) => new Promise((resolve, reject) => {
	const $ = cheerio.load(data);
	let grades = [];

	//All grades wrappers have the asig class
	$(`.asig`).each(function () {
		let grade = {};
		const gradeHref = $(this).attr("href");
		grade.href = `http://gestion-servicios.ehu.es/pls/entrada/plew0040.htm${gradeHref}`;
		grade.name = $(this).text().split('(')[0]; 
		//Object with the school code, name and the grade code
		const info = getSchoolAndGradeInfo($(this).text(), gradeHref);
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

const parseGradesBySchool = (data, code)  => {
	if (!data || !code)
		return Promise.reject("Can't parse empty data");

	return parseAllGrades(data)
		.then(listOfSchools => listOfSchools.filter(school => school.code === code));

};

const parseGradeSummary = (data, school, url) => new Promise((resolve, reject) => {
	if (!data || !school || !url)  return reject("Can't parse empty data");
	const $ = cheerio.load(data);
	let grade = {};
	grade.name = $(".sobre>h1.tit").first().text();
	grade.href = url;
	let contact = {
		name: '',
		email: '',
		address: '',
		phone: ''
	};

	$('#contenedor>h2').each(function() {
		switch ($(this).text()) {
			case 'Resumen del grado':
				grade.summary = $(this).next().text();
				break;
			case 'Nota de corte':
				grade['minimum-grade'] = $(this).next().text().split(' ')[0];
				break;
			case 'Centro de impartición y dirección':
				grade.school = {
					name: $(this).next().find('b').text(),
					code: school
				};
				break;
			case 'Contacto':
				const ul = ($(this).next().is('ul'))
					? $(this).next()
					: $(this).next().next();
				$(ul).find('li').each(function() {
					switch ($(this).find('b').text()) {
						case 'Nombre:':
							contact.name = $(this).clone().children().remove().end().text();
							break;
						case 'Mail:':
							contact.email = $(this).clone().children().remove().end().text();
							break;
						case 'Dirección:':
							contact.address = $(this).clone().children().remove().end().text();
							break;
						case 'Teléfono:':
							contact.phone = $(this).clone().children().remove().end().text();
					}
				});
				break;
		}
	});

	grade.contact = contact;
	resolve(grade);
});

const parseGradeSubjects = (data, course) => new Promise((resolve, reject) => {
	if (!data)   return reject("Can't parse empty data");
	const $ = cheerio.load(data);
	let courses = [];

	$('.tabla').each(function() {
		let currentCourse = {};
		currentCourse.course = courseValue($(this).attr('id'));
		if (course && currentCourse.course !== course)
			return true;
		currentCourse.subjects = [];

		$(this).find('tbody>tr').each(function() {
			let subject = {};

			$(this).find('td').each(function(index) {
				switch (index) {
					case T_NAME:
						const href = $(this).find('a').attr('href');
						subject.name = $(this).text();
						subject.href = `https://www.ehu.eus${href}`;
						subject.code = href.split('p_cod_asig=')[1].split('&')[0];
						break;
					case T_TERM:
						subject.term = $(this).text();
						break;
					case T_CREDITS:
						subject.credits = $(this).text();
						break;
					case T_LANGUAGES:
						subject.languages = [];
						$(this).find('abbr').each(function() {
							subject.languages.push($(this).text());
						});
						break;
				}
			});

			currentCourse.subjects.push(subject);
		});

		courses.push(currentCourse);
	});

	resolve(courses);
});

module.exports = {
	parseCampusData: parseCampusData,
	parseGradesBySchool: parseGradesBySchool,
	parseGradeSummary: parseGradeSummary,
	parseGradeSubjects: parseGradeSubjects
}


/**
 * Function to retrieve the the school name, school code, campus code and grade name from text and url
 * text = Grado en pinta y colorea (Araba) (Facultad Informatica)
 * @param {String} text 
 * @param {String} href
 */
const getSchoolAndGradeInfo = (text, href) => {
	const bracketsTxt = text.split('(');
	const school = {};
	const schoolCode = href.split('p_cod_centro=')[1].split('&')[0];
	const gradeCode = href.split('p_cod_plan=')[1].split('&')[0];
	
	if(bracketsTxt.length === 3) return {
		code: gradeCode,
		campus: bracketsTxt[1].substring(0, bracketsTxt[1].indexOf(')')),
		school: {
			name: bracketsTxt[2].substring(0, bracketsTxt[2].indexOf(')')),
			code: schoolCode,
		}
	}
	else if(bracketsTxt.length === 4) return { //If the text has 3 strings between brackets
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
