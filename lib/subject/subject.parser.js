// TODO: MODULARIZAR
const cheerio = require('cheerio');
const EHUrls = require('../utils/ehurls');
const { numToLanguage, valueToType } = require('../utils/formats');

const C_DATA = 0;
const C_DEPARTAMENT = 1;
const C_CREDITS = 3;
const C_WEEKS = 0;
const C_MONDAY = 1;
const C_TUESDAY = 2;
const C_WEDNESDAY = 3;
const C_THURSDAY = 4;
const C_FRIDAY = 5;
const H2_DESC = 'Descripción y Contextualización de la Asignatura';
const H2_COMPETENCES = 'Competencias/ Resultados de aprendizaje de la asignatura';
const H2_CONTENT = 'Contenidos Teórico-Prácticos';
const H2_ORDINARY = 'Convocatoria Ordinaria: Orientaciones y Renuncia:';
const H2_EXTRA = 'Convocatoria Extraordinaria: Orientaciones y Renuncia';
const H2_BIBLIOGRAPHY = 'Bibliografía';
const H2_OBS = 'Observaciones';

const getScheduleFromTable = ($, node, title) => {
  const listOfWeeks = [];
  $(node).find('tbody>tr').each(function () {
    const weeks = {};
    $(this).find('td').each(function (index) {
      const currentDay = {
        type: title.type,
        hours: $(this).text(),
      };
      switch (index) {
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
        default:
      }
    });
    listOfWeeks.push(weeks);
  });
  return listOfWeeks;
};

const getGroupTitleData = (str) => {
  const aGroup = str.split(':')[1];
  const code = aGroup.substring(1, 3);
  const typeStr = aGroup.substring(4).split(' )')[0].split('-')[0];
  return {
    code,
    type: valueToType(typeStr),
  };
};

const pushLanguage = (lan, list) => {
  if (list.indexOf(lan) >= 0) return;
  list.push(lan);
};

const pushTeacher = (teacher, list) => {
  const found = list.some((el) => {
    if (el.name === teacher.name && el.id_teacher && teacher.id_teacher) {
      if (teacher.languages[0]) pushLanguage(teacher.languages[0], el.languages);
      return true;
    }
    return false;
  });
  if (!found) list.push(teacher);
};

const getTeacher = ($, node) => {
  const teacher = {};
  const currentTeacherUrl = $(node).attr('href');

  teacher.name = $(node).text();
  if (currentTeacherUrl) {
    teacher.code_school = EHUrls.getCode('p_cod_centro', currentTeacherUrl);
    teacher.code_degree = EHUrls.getCode('p_cod_plan', currentTeacherUrl);
    teacher.id_teacher = EHUrls.getCode('p_idp_prof', currentTeacherUrl);
    teacher.dep_teacher = EHUrls.getCode('p_dpto_prof', currentTeacherUrl);
    teacher.code_area = EHUrls.getCode('p_cod_area', currentTeacherUrl);
  }
  teacher.languages = [];

  const parent = $(node).parent().parent().parent();
  const h3 = parent.prevAll('h3')[0];
  const group = $(h3).text().split(':');
  if (group.length > 1) {
    const groupNum = group[1].substring(1, 3);
    const language = numToLanguage(groupNum);

    pushLanguage(language, teacher.languages);
  }
  return teacher;
};

// TODO: 👎🏼 Improve eficience
// TODO: GroupBy Type ????
const scheduleGroupByWeeks = (schedule) => {
  const listOfWeeks = [];
  schedule.forEach((elem) => {
    const found = listOfWeeks.some((el) => {
      if (elem.weeks === el.weeks) {
        el.monday.push(elem.monday);
        el.tuesday.push(elem.tuesday);
        el.wednesday.push(elem.wednesday);
        el.thursday.push(elem.thursday);
        el.friday.push(elem.friday);
        return true;
      }
      return false;
    });
    if (!found || listOfWeeks.length === 0) {
      listOfWeeks.push({
        weeks: elem.weeks,
        monday: [elem.monday],
        tuesday: [elem.tuesday],
        wednesday: [elem.wednesday],
        thursday: [elem.thursday],
        friday: [elem.friday],
      });
    }
  });
  return listOfWeeks;
};

const getGroupSchedule = ($, node) => {
  const group = {};
  let title = getGroupTitleData($(node).text());
  group.code = title.code;
  group.schedule = [];
  group.teachers = [];
  let listOfWeeks = [];

  $(node).nextUntil('h3').each(function () {
    const tagClass = $(this).attr('class');
    let auxWeeks = [];
    if (tagClass === 'tabla') {
      auxWeeks = getScheduleFromTable($, this, title);
      const teacherUl = $(this).next().next().find('.asig');
      const currentTeacher = getTeacher($, teacherUl);
      pushTeacher(currentTeacher, group.teachers);
    } else if (tagClass === 'tab') {
      title = getGroupTitleData($(this).find('h4').text());
      auxWeeks = getScheduleFromTable($, $(this).find('table'), title);
      const teacherUl = $(this).find('.asig');
      const currentTeacher = getTeacher($, teacherUl);
      pushTeacher(currentTeacher, group.teachers);
    }
    listOfWeeks = listOfWeeks.concat(auxWeeks);
  });

  group.schedule = scheduleGroupByWeeks(listOfWeeks);
  group.schedule = group.schedule.map((el) => {
    el.monday = el.monday.filter(day => day.hours !== '--');
    el.tuesday = el.tuesday.filter(day => day.hours !== '--');
    el.wednesday = el.wednesday.filter(day => day.hours !== '--');
    el.thursday = el.thursday.filter(day => day.hours !== '--');
    el.friday = el.friday.filter(day => day.hours !== '--');
    return el;
  });
  return group;
};
const getJustText = ($, node) => $(node)
  .clone()
  .children()
  .remove()
  .end()
  .text();

const getSummaryBasic = ($, node, subject, index) => {
  switch (index) {
    case C_DATA:
      $(node).find('li').each(function () {
        const section = $(this).find('b').text().split(':')[0];

        switch (section) {
          case 'Centro':
            subject.school.name = getJustText($, this);
            break;
          case 'Titulación':
            subject.degree.name = getJustText($, this);
            break;
          case 'Curso académico':
            subject.course = getJustText($, this);
            break;
          case 'Curso':
            subject.year = getJustText($, this);
            break;
          default:
        }
      });
      break;
    case C_DEPARTAMENT:
      subject.departament = getJustText($, $(node).find('ul>li'));
      break;
    case C_CREDITS:
      subject.credits = getJustText($, $(node).find('ul>li'));
      break;
    default:
  }
};

const getInfoBasic = ($, node, subject) => {
  const title = $(node).find('b').text().split(':')[0];

  switch (title) {
    case 'Centro':
      subject.school = getJustText($, node);
      break;
    case 'Titulación':
      subject.degree = getJustText($, node);
      break;
    case 'Curso académico':
      subject.course = getJustText($, node);
      break;
    case 'Curso':
      subject.year = getJustText($, node);
      break;
    default:
  }
};

const getInfoTitles = ($, node, subject) => {
  const h2 = $(node).text();
  let bibliographyBasic;
  let bibliographyDeep;
  let currentBibliography;
  switch (h2) {
    case H2_DESC:
      subject.description = $(node).next().text();
      break;
    case H2_EXTRA:
      subject.extraordinary_announcement = $(node).next().text();
      break;
    case H2_CONTENT:
      subject.content = $(node).next().text();
      break;
    case H2_ORDINARY:
      subject.ordinary_announcement = $(node).next().text();
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
      bibliographyDeep = $(currentBibliography).next().next().next()
        .html()
        .split('<br>');
      subject.bibliography = bibliographyBasic.concat(bibliographyDeep);
      break;
    default:
  }
};

const getTitleAndCode = ($) => {
  const content = $('#contenido h1');
  const title = $(content).text().split('-');
  return {
    name: title[1].substring(1, title[1].length),
    code: title[0].substring(0, title[0].length - 1),
  };
};

/**
 * Format data from a subject
 * @param  {[Object]} data
 * @param  {[String]} school [School code]
 * @param  {[String]} degree  [Degree code]
 * @return {[Promise]}        [Parsed data]
 */
const _parseSubjectSummary = (data, school, degree) => new Promise((resolve, reject) => {
  if (!data) return reject('Can\'t parse empty data');
  else if (!school) return reject('Error: can\'t parse subject summary without school code [parseSubjectSummary]');
  else if (!degree) return reject('Error: can\'t parse subject summary without degree code [parseSubjectSummary]');

  const $ = cheerio.load(data);
  const subject = {};
  const container = $('#contenedor');
  const title = getTitleAndCode($);

  subject.name = title.name;
  subject.code = title.code;
  subject.school = {};
  subject.degree = {};
  subject.teachers = [];
  subject.languages = [];
  subject.school.code = school;
  subject.degree.code = degree;

  $(container).find('ul').each(function (index) {
    getSummaryBasic($, this, subject, index);
  });

  $(container).find('.asig').each(function () {
    const currentTeacher = getTeacher($, this);
    pushTeacher(currentTeacher, subject.teachers);
    currentTeacher.languages.forEach(language => pushLanguage(language, subject.languages));
  });

  subject.href =
    EHUrls.getSubject(subject.code, subject.school.code, subject.degree.code, subject.course);

  return resolve(subject);
});

/**
 * Format data from subject info page
 * @param  {[Object]} data [Data object]
 * @return {[Promise]}      [Parsed data]
 */
const _parseSubjectInfo = data => new Promise((resolve, reject) => {
  if (!data) return reject('Can\'t parse empty data');

  const $ = cheerio.load(data);
  const container = $('#contenedor');
  const content = $('#contenido h1');
  const title = $(content).text().split('-');
  const subject = {};

  subject.name = title[1].substring(1, title[1].length);
  subject.bibliography = [];

  $(container).children('ul').find('li').each(function () { getInfoBasic($, this, subject); });

  $(container).find('h2').each(function () { getInfoTitles($, this, subject); });

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
  const schedule = {};
  schedule.groups = [];
  $(container).find('h3').each(function () {
    const gr = getGroupSchedule($, this);
    schedule.groups.push(gr);
  });
  resolve(schedule);
});

module.exports = {
  parseSubjectSummary: _parseSubjectSummary,
  parseSubjectInfo: _parseSubjectInfo,
  parseSubjectSchedule: _parseSubjectSchedule,
};

