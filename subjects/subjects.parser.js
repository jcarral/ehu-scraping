"use strict";
//TODO: MODULARIZAR
const cheerio = require('cheerio');

const { getSubjectUrl, getUrlCode } = require('../utils/urls');
const { numToLanguage } = require('../utils/formats');

const C_DATA = 0, C_DEPARTAMENT = 1, C_CREDITS = 3;
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
  if (!data) return reject("Can't parse empty data");
  else if(!school) return reject("Error: can't parse subject summary without school code [parseSubjectSummary]");
  else if(!grade) return reject("Error: can't parse subject summary without grade code [parseSubjectSummary]");

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

  subject.href = getSubjectUrl(subject.code, subject.school.code, subject.grade.code, subject.course);

  return resolve(subject);
});

/**
 * Format data from subject info page
 * @param  {[Object]} data [Data object]
 * @return {[Promise]}      [Parsed data]
 */
const _parseSubjectInfo = (data) => new Promise((resolve, reject) => {
  if (!data) return reject("Can't parse empty data");

  const $ = cheerio.load(data);
  const container = $('#contenedor');
  const content = $('#contenido_ h1');
  const title = $(content).text().split('-');
  let subject = {};

  subject.name = title[1].substring(1, title[1].length);
  subject.bibliography = [];

  $(container).children('ul').find('li').each(function(){
      getInfoBasic($, this, subject);
  });

  $(container).find('h2').each(function(){
      getInfoTitles($, this, subject);
  });

  subject.bibliography = subject.bibliography.filter(el => el.length > 0);
  subject.bibliography = subject.bibliography.map(el => unescape($('<textarea/>').html(el).text()));
  return resolve(subject);
});


module.exports = {
  parseSubjectSummary : _parseSubjectSummary,
  parseSubjectInfo : _parseSubjectInfo
}

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
            subject.year = getJustText($, this);
            break;
          case 'Curso':
            subject.course = getJustText($, this);
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
}

const getTeacher = ($, node) => {
  let teacher = {};
  const currentTeacherUrl = $(node).attr('href');

  teacher.name = $(node).text();
  teacher['code_school'] = getUrlCode('p_cod_centro', currentTeacherUrl);
  teacher['code_grade'] = getUrlCode('p_cod_plan', currentTeacherUrl);
  teacher['id_teacher'] = getUrlCode('p_idp_prof', currentTeacherUrl);
  teacher['dep_teacher'] = getUrlCode('p_dpto_prof', currentTeacherUrl);
  teacher['code_area'] = getUrlCode('p_cod_area', currentTeacherUrl);
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
}

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
}

const getInfoTitles = ($, node, subject) => {
  const h2 = $(node).text();

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
      const currentBibliography = $(node).next().next().next();
      let bibliographyBasic = $(currentBibliography).html().split('<br>');
      let bibliographyDeep = $(currentBibliography).next().next().next().html().split('<br>')
      subject.bibliography = bibliographyBasic.concat(bibliographyDeep);
  }
}

const getJustText = ($, node) => {
  return $(node).clone().children().remove().end().text();
}

const getTitleAndCode = ($) => {
  const content = $('#contenido_ h1');
  const title = $(content).text().split('-');
  return {
    name: title[1].substring(1, title[1].length),
    code: title[0].substring(0, title[0].length - 1)
  };
}

const pushTeacher = (teacher, list)  => {
  const found = list.some(function (el) {
    if(el.name === teacher.name && el['id_teacher'] && teacher['id_teacher']){
      if (teacher.languages[0]) pushLanguage(teacher.languages[0], el.languages);
      return true;
    }
    else return false;
  });
  if (!found) list.push(teacher);

}

const pushLanguage = (lan, list) => {
  if (list.indexOf(lan) >= 0) return;
  else list.push(lan);
}
