"use strict"
const cheerio = require('cheerio');
const codes = require('../utils/codes');
const { getTeacherProfileUrl } = require('../utils/urls');
const { getMonthValue, getMonthDays } = require('../utils/formats');

//Constants of the teacher's page summary
const SUMMARY_CATEGORY = 0, SUMMARY_DEPARTAMENT = 1, SUMMARY_AREA = 2, SUMMARY_MAIL = 3;
//Constant of the teacher schedule table
const SC_WEEKS = 0, SC_MO = 1, SC_TU = 2, SC_WED = 3, SC_TH = 4, SC_FR = 5;

const _parseTeacherList = (data, grade) => new Promise((resolve, reject) => {
	if (!data) return reject("Can't parse empty data");
	else if (!grade) return reject("Error: can't parse teacher list without grade code [parseTeacherList]");

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

/**
 * Function to parse the teacher schedule
 * @param {*} data Object with the website data
 * @param {*} grade Name of the grade
 * @param {*} id Teacher id
 */
const _parseTeacherSchedule = (data, grade, id) => new Promise((resolve, reject) => {
	if (!data) return reject("Can't parse empty data");
	else if (!id) return reject("Error: can't parse teacher schedule without id code [parseTeacherSchedule]");
	else if (!grade) return reject("Error: can't parse teacher schedule without grade code [parseTeacherSchedule]");

	const $ = cheerio.load(data);
	let teacher = {};
	const teacherName = $('#layout-column_column-2').find('h1');
	const summary = $(teacherName).next();
	const scheduleTable = $(teacherName).next().next().next();

	const gradeName = codes.grades[grade];
	teacher.grade = {
		name: gradeName,
		code: grade
	};

	$(summary).find('dd').each(function (index) {
		const text = $(this).text().trim() ||  '';
		switch (index) {
			case SUMMARY_AREA:
				teacher.area = text;
				break;
			case SUMMARY_CATEGORY:
				teacher.category = text;
				break;
			case SUMMARY_DEPARTAMENT:
				teacher.departament = text;
			case SUMMARY_MAIL:
				teacher.email = text;
		}
	});
	teacher.id = id;
	teacher.name = $(teacherName).text().trim();
	teacher.href = getTeacherProfileUrl(gradeName, id);
	teacher.schedule = getTeacherSchedule($, scheduleTable);

	return resolve(teacher);
});

/**
 * Function to parse the table with the schedule
 *
 */
const getTeacherSchedule = ($, table) => {
	let tutorships = [];
	let rowTutorships = [];
	$(table).find('tbody').find('tr').each(function () {
		rowTutorships = parseScheduleRow($, $(this));
		tutorships = tutorships.concat(rowTutorships);
	});
	return tutorships;
};

/**
 * Function to get the tutorships from each row
 */
const parseScheduleRow = ($, row) => {
	let tutorships = [];
	let weekInfo = {};
	$(row).find('td').each(function (index) {
		const cell = $(this);
		switch (index) {
			case SC_WEEKS:
				weekInfo = getWeekInfo($, cell);
				break;
			default:
				let tutorship = getTutorship($, cell, weekInfo, index);
				if (Object.keys(tutorship).length > 0) tutorships.push(tutorship);
		}
	});
	return tutorships;
};

/**
 * Function to get the info of the week [dayStart, dayEnd, year, month]
 */
const getWeekInfo = ($, cell) => {
	let weekInfo = {};
	const rawText = $(cell).text().split(' ');
	const month = getMonthValue(rawText[0]);
	weekInfo.year = rawText[1];
	weekInfo.month = month;
	weekInfo.dayStart = parseInt(rawText[4].trim());
	weekInfo.dayEnd = parseInt(rawText[6].trim());
	return weekInfo;
};

/**
 * Function to create an object with the tutorship data
 */
const getTutorship = ($, cell, weekInfo, index) => {
	let tutorship = {};
	let day, month;
	const hours = $(cell).find('strong').text();
	const place = $(cell).text().replace(hours, '');
	if(hours === '') return {}; 
	else {
		tutorship.place = place;
		const hoursSplitted = hours.split('-');
		day = weekInfo.dayStart + index - 1;
		month = weekInfo.month;
		if (weekInfo.dayStart > weekInfo.dayEnd){
			const monthDays = getMonthDays(parseInt(weekInfo.year), weekInfo.month);
			day = (day > monthDays)?day-monthDays:day;
			month += 1;
		}

		const dayStr = (day < 10) ? '0'+day:day.toString();
		const monthStr = (month < 10) ? '0' + month : month.toString();

		tutorship['date-start'] = `${weekInfo.year}-${monthStr}-${dayStr}T${hoursSplitted[0].trim()}`;
		tutorship['date-end'] = `${weekInfo.year}-${monthStr}-${dayStr}T${hoursSplitted[1].trim()}`;
	}
	return tutorship;
};


module.exports = {
	parseTeacherList: _parseTeacherList,
	parseTeacherSchedule: _parseTeacherSchedule
};
