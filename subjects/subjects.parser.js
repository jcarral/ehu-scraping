"use strict";

const cheerio = require('cheerio');

const { getSubjectUrl } = require('../utils/urls');

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
  return resolve(subject);
});

module.exports = {
  parseSubjectSummary : _parseSubjectSummary
}
