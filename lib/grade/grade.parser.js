'use strict';

const cheerio = require('cheerio');
const { courseValue } = require('../utils/formats');
//Constants to use with the table of subjects
const T_NAME = 0, T_TERM = 1, T_CREDITS = 2, T_LANGUAGES = 4;

const parseGradeSummary = (data, school, url) => new Promise((resolve, reject) => {
	if (!data || !school || !url)  return reject('Can\'t parse empty data');
	const $ = cheerio.load(data);
	let grade = {};
	grade.name = $('.sobre>h1.tit').first().text();
	grade.href = url;
	let contact = {
		name: '',
		email: '',
		address: '',
		phone: ''
	};

	$('#contenedor').find('h2').each(function() {
		let ul;
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
			ul = ($(this).next().is('ul'))? $(this).next(): $(this).next().next();
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

	return resolve(grade);
});

const parseGradeSubjects = (data, course) => new Promise((resolve, reject) => {
	if (!data)   return reject('Can\'t parse empty data');
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
				let href;
				switch (index) {
				case T_NAME:
					href = $(this).find('a').attr('href');
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

const parseAllTeachers = (data, grade) => new Promise((resolve, reject) => {
	if (!data) return reject('Can\'t parse empty data');
	else if (!grade) return reject('Error: can\'t parse teacher list without grade code [parseTeacherList]');

	const $ = cheerio.load(data);

	const teachersObject = {};
	teachersObject.school = '';
	teachersObject.grade = grade;
	const listOfTeachers = [];
	$('tbody').find('tr').each(function () {
		listOfTeachers.push(getTeacherFromRow($, $(this), grade));
	});
	teachersObject.teachers = listOfTeachers;
	return resolve(teachersObject);
});


module.exports = {
	parseGradeSummary,
	parseGradeSubjects,
	parseAllTeachers
};

/**
 * Function to get the teacher info from a row
 */
const getTeacherFromRow = ($, row, grade) => {

	let teacher = {};
	const nameCell = $(row).find('td').first();
	const mailCell = $(nameCell).next();
	const teacherHref = $(nameCell).find('a').attr('href');

	teacher.name = $(nameCell).text();
	teacher.href = `https://www.ehu.eus/es/web/estudiosdegrado-gradukoikasketak/${grade}-profesorado${teacherHref}`;
	teacher.id = teacherHref.split('p_idp=')[1];
	teacher.email = $(mailCell).text();
	return teacher;
};


