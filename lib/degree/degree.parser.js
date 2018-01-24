"use strict";

const cheerio = require('cheerio');
const { courseValue, valToCampus } = require('../utils/formats');
const { groupBy } = require('../utils/util');
//Constants to use with the table of subjects
const T_NAME = 0, T_TERM = 1, T_CREDITS = 2, T_LANGUAGES = 4;

const parseDegreeSummary = (data, school, url) => new Promise((resolve, reject) => {
	if (!data || !school || !url)  return reject("Can't parse empty data");
	const $ = cheerio.load(data);
	let degree = {};
	degree.name = $(".sobre>h1.tit").first().text();
	degree.href = url;
	let contact = {
		name: '',
		email: '',
		address: '',
		phone: ''
	};

	$('#contenedor').find('h2').each(function() {
		switch ($(this).text()) {
			case 'Resumen del grado':
				degree.summary = $(this).next().text();
				break;
			case 'Nota de corte':
				degree['minimum-degree'] = $(this).next().text().split(' ')[0];
				break;
			case 'Centro de impartición y dirección':
				degree.school = {
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

	degree.contact = contact;

	return resolve(degree);
});

const parseDegreeSubjects = (data, course) => new Promise((resolve, reject) => {
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

const parseAllTeachers = (data, degree) => new Promise((resolve, reject) => {
	if (!data) return reject("Can't parse empty data");
	else if (!degree) return reject("Error: can't parse teacher list without degree code [parseTeacherList]");

	const $ = cheerio.load(data);

	const teachersObject = {};
	teachersObject.school = '';
	teachersObject.degree = degree;
	const listOfTeachers = [];
	$('tbody').find('tr').each(function () {
		listOfTeachers.push(getTeacherFromRow($, $(this), degree));
	});
	teachersObject.teachers = listOfTeachers;
	return resolve(teachersObject);
});


module.exports = {
	parseDegreeSummary,
	parseDegreeSubjects,
	parseAllTeachers
};

/**
 * Function to get the teacher info from a row
 */
const getTeacherFromRow = ($, row, degree) => {

	let teacher = {};
	const nameCell = $(row).find('td').first();
	const mailCell = $(nameCell).next();
	const teacherHref = $(nameCell).find('a').attr('href');

	teacher.name = $(nameCell).text();
	teacher.href = `https://www.ehu.eus/es/web/estudiosdegrado-gradukoikasketak/${degree}-profesorado${teacherHref}`;
	teacher.id = teacherHref.split('p_idp=')[1];
	teacher.email = $(mailCell).text();
	return teacher;
};

/**
 * Function to retrieve the the school name, school code, campus code and degree name from text and url
 * text = Grado en pinta y colorea (Araba) (Facultad Informatica)
 * @param {String} text 
 * @param {String} href
 */
const getSchoolAndDegreeInfo = (text, href) => {
	const bracketsTxt = text.split('(');
	const school = {};
	const schoolCode = href.split('p_cod_centro=')[1].split('&')[0];
	const degreeCode = href.split('p_cod_plan=')[1].split('&')[0];
	
	if(bracketsTxt.length === 3) return {
		code: degreeCode,
		campus: bracketsTxt[1].substring(0, bracketsTxt[1].indexOf(')')),
		school: {
			name: bracketsTxt[2].substring(0, bracketsTxt[2].indexOf(')')),
			code: schoolCode,
		}
	}
	else if(bracketsTxt.length === 4) return { //If the text has 3 strings between brackets
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
