'use strict';
//TODO: MODULARIZAR
const cheerio = require('cheerio');
const EHUrls = require('../utils/ehurls');
const { numToLanguage, valueToType } = require('../utils/formats');

const C_DATA = 0, C_DEPARTAMENT = 1, C_CREDITS = 3;
const C_WEEKS = 0, C_MONDAY = 1, C_TUESDAY = 2, C_WEDNESDAY = 3, C_THURSDAY = 4, C_FRIDAY = 5;
const H2_DESC = 'Descripción y Contextualización de la Asignatura',
	H2_COMPETENCES = 'Competencias/ Resultados de aprendizaje de la asignatura',
	H2_CONTENT = 'Contenidos Teórico-Prácticos',
	H2_ORDINARY = 'Convocatoria Ordinaria: Orientaciones y Renuncia:',
	H2_EXTRA = 'Convocatoria Extraordinaria: Orientaciones y Renuncia',
	H2_BIBLIOGRAPHY = 'Bibliografía',
	H2_OBS = 'Observaciones';

/**
 * Format data from a subject
 * @param  {[Object]} data
 * @param  {[String]} school [School code]
 * @param  {[String]} grade  [Grade code]
 * @return {[Promise]}        [Parsed data]
 */
const _parseSubjectSummary = (data, school, grade) => new Promise((resolve, reject) => {
	if (!data) return reject('Can\'t parse empty data');
	else if(!school) return reject('Error: can\'t parse subject summary without school code [parseSubjectSummary]');
	else if(!grade) return reject('Error: can\'t parse subject summary without grade code [parseSubjectSummary]');

	const $ = cheerio.load(data);
	let subject = {};
	const container = $('#contenedor');
	const title = getTitleAndCode($);

	subject.name = title.name;
	subject.code = title.code;
	subject.school = {};
	subject.grade = {};
	subject.teachers = [];
	subject.languages = [];
	subject.school.code = school;
	subject.grade.code = grade;

	$(container).find('ul').each(function(index){
		getSummaryBasic($, this, subject, index);
	});

	$(container).find('.asig').each(function(){
		const currentTeacher = getTeacher($, this);
		pushTeacher(currentTeacher, subject.teachers);
		currentTeacher.languages.forEach((language) => pushLanguage(language, subject.languages));
	});

	subject.href = EHUrls.getSubject(subject.code, subject.school.code, subject.grade.code, subject.course);

	return resolve(subject);
});

/**
 * Format data from subject info page
 * @param  {[Object]} data [Data object]
 * @return {[Promise]}      [Parsed data]
 */
const _parseSubjectInfo = (data) => new Promise((resolve, reject) => {
	if (!data) return reject('Can\'t parse empty data');

	const $ = cheerio.load(data);
	const container = $('#contenedor');
	const content = $('#contenido h1');
	const title = $(content).text().split('-');
	let subject = {};

	subject.name = title[1].substring(1, title[1].length);
	subject.bibliography = [];

	$(container).children('ul').find('li').each(function(){ getInfoBasic($, this, subject); });

	$(container).find('h2').each(function(){ getInfoTitles($, this, subject); });

	subject.bibliography = subject.bibliography.filter(el => el.length > 0);
	subject.bibliography = subject.bibliography.map(el => unescape($('<textarea/>').html(el).text()));
	return resolve(subject);
});

/**
 * Format data from subject summary page to get subject schedule
 * @param {[Object]} data [Data object]
 * @return {[Promise]} [Parsed data]
 */
const _parseSubjectSchedule = data => new Promise((resolve, reject) => {
	if (!data) return reject('Can\'t parse empty data');

	const $ = cheerio.load(data);
	const container = $('#contenedor');
	let schedule = {};
	schedule.groups = [];
	$(container).find('h3').each(function(){
		let gr = getGroupSchedule($, this);
		schedule.groups.push(gr);
	});
	resolve(schedule);
});



module.exports = {
	parseSubjectSummary : _parseSubjectSummary,
	parseSubjectInfo : _parseSubjectInfo,
	parseSubjectSchedule: _parseSubjectSchedule
};

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const getGroupSchedule = ($, node) => {
	let group = {};
	let title = getGroupTitleData($(node).text());
	group.code = title.code;
	group.schedule = [];
	group.teachers = [];
	let listOfWeeks = [];

	$(node).nextUntil('h3').each(function(){
		const tagClass = $(this).attr('class');
		let auxWeeks = [];
		if(tagClass === 'tabla'){
			auxWeeks = getScheduleFromTable($, this, title);
			const teacherUl = $(this).next().next().find('.asig');
			const currentTeacher = getTeacher($, teacherUl);
			pushTeacher(currentTeacher, group.teachers);
		}else if(tagClass === 'tab'){
			title = getGroupTitleData($(this).find('h4').text());
			auxWeeks = getScheduleFromTable($, $(this).find('table'), title);
			const teacherUl = $(this).find('.asig');
			const currentTeacher = getTeacher($, teacherUl);
			pushTeacher(currentTeacher, group.teachers);
		}
		listOfWeeks = listOfWeeks.concat(auxWeeks);
	});

	group.schedule = scheduleGroupByWeeks(listOfWeeks);
	group.schedule = group.schedule.map(el => {
		el.monday = el.monday.filter(day => day.hours !== '--');
		el.tuesday = el.tuesday.filter(day => day.hours !== '--');
		el.wednesday = el.wednesday.filter(day => day.hours !== '--');
		el.thursday = el.thursday.filter(day => day.hours !== '--');
		el.friday = el.friday.filter(day => day.hours !== '--');
		return el;
	});
	return group;
};

//TODO: 👎🏼 Improve eficience
//TODO: GroupBy Type ????
const scheduleGroupByWeeks = (schedule) => {
	let listOfWeeks = [];
	schedule.forEach((elem) => {
		const found = listOfWeeks.some(function (el) {
			if(elem.weeks === el.weeks){
				el.monday.push(elem.monday);
				el.tuesday.push(elem.tuesday);
				el.wednesday.push(elem.wednesday);
				el.thursday.push(elem.thursday);
				el.friday.push(elem.friday);
				return true;
			}
			return false;
		});
		if (!found ||listOfWeeks.length === 0){
			listOfWeeks.push({
				weeks: elem.weeks,
				monday: [elem.monday],
				tuesday: [elem.tuesday],
				wednesday: [elem.wednesday],
				thursday: [elem.thursday],
				friday: [elem.friday]
			});
		}
	});
	return listOfWeeks;
};

const getScheduleFromTable = ($, node, title) => {
	let listOfWeeks = [];
	$(node).find('tbody>tr').each(function(){
		const weeks = {};
		$(this).find('td').each(function(index){
			let currentDay = {
				type: title.type,
				hours: $(this).text()
			};
			switch(index){
			case C_WEEKS:
				weeks.weeks = $(this).text();
				break;
			case C_MONDAY:
				weeks.monday = currentDay;
				break;
			case C_TUESDAY:
				weeks.tuesday = currentDay;
				break;
			case C_WEDNESDAY:
				weeks.wednesday = currentDay;
				break;
			case C_THURSDAY:
				weeks.thursday = currentDay;
				break;
			case C_FRIDAY:
				weeks.friday = currentDay;
				break;
			}
		});
		listOfWeeks.push(weeks);
	});
	return listOfWeeks;
};

const getGroupTitleData = (str) => {
	const aGroup = str.split(':')[1];
	const code = aGroup.substring(1,3);
	const typeStr = aGroup.substring(4).split(' )')[0].split('-')[0];
	return {
		code: code,
		type: valueToType(typeStr)
	};
};
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const getSummaryBasic = ($, node, subject, index) => {
	switch (index) {
	case C_DATA:
		$(node).find('li').each(function(){
			const section = $(this).find('b').text().split(':')[0];

			switch (section) {
			case 'Centro':
				subject.school.name = getJustText($, this);
				break;
			case 'Titulación':
				subject.grade.name = getJustText($, this);
				break;
			case 'Curso académico':
				subject.course = getJustText($, this);
				break;
			case 'Curso':
				subject.year = getJustText($, this);
				break;
			}
		});
		break;
	case C_DEPARTAMENT:
		subject.departament = getJustText($, $(node).find('ul>li'));
		break;
	case C_CREDITS:
		subject.credits = getJustText($, $(node).find('ul>li'));
		break;
	}
};

const getTeacher = ($, node) => {
	let teacher = {};
	const currentTeacherUrl = $(node).attr('href');

	teacher.name = $(node).text();
	if (currentTeacherUrl) {
		teacher['code_school'] = EHUrls.getCode('p_cod_centro', currentTeacherUrl);
		teacher['code_grade'] = EHUrls.getCode('p_cod_plan', currentTeacherUrl);
		teacher['id_teacher'] = EHUrls.getCode('p_idp_prof', currentTeacherUrl);
		teacher['dep_teacher'] = EHUrls.getCode('p_dpto_prof', currentTeacherUrl);
		teacher['code_area'] = EHUrls.getCode('p_cod_area', currentTeacherUrl);
	}
	teacher.languages = [];

	const parent = $(node).parent().parent().parent();
	const h3 = parent.prevAll('h3')[0];
	const group = $(h3).text().split(':');
	if(group.length > 1){
		const groupNum = group[1].substring(1, 3);
		const language = numToLanguage(groupNum);

		pushLanguage(language, teacher.languages);
	}
	return teacher;
};

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const getInfoBasic = ($, node, subject) => {
	const title = $(node).find('b').text().split(':')[0];

	switch (title) {
	case 'Centro':
		subject.school = getJustText($, node);
		break;
	case 'Titulación':
		subject.grade = getJustText($, node);
		break;
	case 'Curso académico':
		subject.course = getJustText($, node);
		break;
	case 'Curso':
		subject.year = getJustText($, node);
		break;
	}
};

const getInfoTitles = ($, node, subject) => {
	const h2 = $(node).text();
	let bibliographyBasic, bibliographyDeep, currentBibliography;
	switch (h2) {
	case H2_DESC:
		subject.description = $(node).next().text();
		break;
	case H2_EXTRA:
		subject['extraordinary_announcement'] = $(node).next().text();
		break;
	case H2_CONTENT:
		subject.content = $(node).next().text();
		break;
	case H2_ORDINARY:
		subject['ordinary_announcement'] = $(node).next().text();
		break;
	case H2_COMPETENCES:
		subject.competences = $(node).next().text();
		break;
	case H2_OBS:
		subject.observation = $(node).next().text();
		break;
	case H2_BIBLIOGRAPHY:
		currentBibliography = $(node).next().next().next();
		bibliographyBasic = $(currentBibliography).html().split('<br>');
		bibliographyDeep = $(currentBibliography).next().next().next().html().split('<br>');
		subject.bibliography = bibliographyBasic.concat(bibliographyDeep);
	}
};

const getJustText = ($, node) => {
	return $(node).clone().children().remove().end().text();
};

const getTitleAndCode = ($) => {
	const content = $('#contenido h1');
	const title = $(content).text().split('-');
	return {
		name: title[1].substring(1, title[1].length),
		code: title[0].substring(0, title[0].length - 1)
	};
};

const pushTeacher = (teacher, list)  => {
	const found = list.some(function (el) {
		if(el.name === teacher.name && el['id_teacher'] && teacher['id_teacher']){
			if (teacher.languages[0]) pushLanguage(teacher.languages[0], el.languages);
			return true;
		}
		else return false;
	});
	if (!found) list.push(teacher);
};

const pushLanguage = (lan, list) => {
	if (list.indexOf(lan) >= 0) return;
	else list.push(lan);
};
