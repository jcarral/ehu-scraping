"use strict";

const cheerio = require('cheerio');

const { getSubjectUrl, getUrlCode } = require('../utils/urls');
const { numToLanguage } = require('../utils/formats');

const C_DATA = 0, C_DEPARTAMENT = 1, C_CREDITS = 2;

const _parseSubjectSummary = (data, school, grade) => new Promise((resolve, reject) => {
  if (!data) return reject("Can't parse empty data");
  else if(!school) return reject("Error: can't parse subject summary without school code [parseSubjectSummary]");
  else if(!grade) return reject("Error: can't parse subject summary without grade code [parseSubjectSummary]");

  const $ = cheerio.load(data);
  let subject = {};
  const content = $('#contenido_ h1');
  const container = $('#contenedor');

  const title = $(content).text().split('-');

  subject.name = title[1].substring(1, title[1].length);
  subject.code = title[0].substring(0, title[0].length - 1);

  subject.school = {};
  subject.grade = {};
  subject.school.code = school;
  subject.grade.code = grade;

  $(container).find('ul').each(function(index){
    switch (index) {
      case C_DATA:
        $(this).find('li').each(function(){
          const section = $(this).find('b').text().split(':')[0];

          switch (section) {
            case 'Centro':
              subject.school.name = $(this).clone().children().remove().end().text();
              break;
            case 'Titulación':
              subject.grade.name = $(this).clone().children().remove().end().text();
              break;
            case 'Curso académico':
              subject.year = $(this).clone().children().remove().end().text();
              break;
            case 'Curso':
              subject.course = $(this).clone().children().remove().end().text();
              break;
          }
        });
        break;
      case C_DEPARTAMENT:
        subject.departament = $(this).find('ul>li').text();
        break;
      case C_CREDITS:
        subject.credits = $(this).find('ul>li').clone().children().remove().end().text();
        break;
    }
  });
  subject.href = getSubjectUrl(subject.code, subject.school.code, subject.grade.code, subject.course);
  subject.teachers = [];
  subject.languages = [];

  $(container).find('.asig').each(function(){
    let teacher = {};
    const currentTeacherUrl = $(this).attr('href');

    teacher.name = $(this).text();
    teacher['code_school'] = getUrlCode('p_cod_centro', currentTeacherUrl);
    teacher['code_grade'] = getUrlCode('p_cod_plan', currentTeacherUrl);
    teacher['id_teacher'] = getUrlCode('p_idp_prof', currentTeacherUrl);
    teacher['dep_teacher'] = getUrlCode('p_dpto_prof', currentTeacherUrl);
    teacher['code_area'] = getUrlCode('p_cod_area', currentTeacherUrl);
    teacher.languages = [];

    const parent = $(this).parent().parent().parent();
    const h3 = parent.prevAll('h3')[0];
    const group = $(h3).text().split(':');
    if(group.length > 1){
      const groupNum = group[1].substring(1, 3);
      const language = numToLanguage(groupNum);

      pushLanguage(language, teacher.languages);
      pushLanguage(language, subject.languages);
    }


    pushTeacher(teacher, subject.teachers);
  });
  return resolve(subject);
});

module.exports = {
  parseSubjectSummary : _parseSubjectSummary
}

function pushTeacher(teacher, list) {
  const found = list.some(function (el) {
    if(el.name === teacher.name && el['id_teacher'] && teacher['id_teacher']){
      if (teacher.languages[0]) pushLanguage(teacher.languages[0], el.languages);
      return true;
    }
    else return false;
  });
  if (!found) list.push(teacher);

}

function pushLanguage(lan, list){
  if (list.indexOf(lan) >= 0) return;
  else list.push(lan);
}
