"use strict"
const cheerio = require('cheerio');

const _parseTeacherList = (data, grade) => new Promise((resolve, reject) => {
	const $ = cheerio.load(data);
	
	const teachersObject = {};
	teachersObject.school = '';
	teachersObject.grade = grade;
	const listOfTeachers = [];
	$('tbody').find('tr').each(function(){
		listOfTeachers.push(getTeacherFromRow($, $(this), grade));
	});
	teachersObject.teachers = listOfTeachers;
	return resolve(teachersObject);
});

const getTeacherFromRow = ($, row, grade)=> {
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
module.exports = {
	parseTeacherList : _parseTeacherList
};
