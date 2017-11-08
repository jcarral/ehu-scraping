"use strict";

const cheerio = require('cheerio');
const {courseValue} = require('../utils/formats');

//Constants to use with the table of subjects
const T_NAME = 0, T_TERM = 1, T_CREDITS = 2, T_LANGUAGES = 4;

const parseCampusData = (data) => new Promise((resolve, reject) => {
  if (!data) return reject("Can't parse empty data");

  const $ = cheerio.load(data);
  let schools = [];

  $("#contenedor>ul>li").each(function() {
    let school = {};
    school.name = $(this).text();
    school.grades = [];

    $(this).next().find("a").each(function() {
      let grade = {};
      const gradeHref = $(this).attr("href");
      const urlAuxCode = gradeHref.split("p_cod_plan=")[1];
      const urlAuxSchool = gradeHref.split("p_cod_centro=")[1];

      grade.name = $(this).text();
      grade.code = urlAuxCode.substr(0, urlAuxCode.indexOf("&"));
      grade.href = `https://ehu.eus/${gradeHref}`;
      school.code = urlAuxSchool.substr(0, urlAuxSchool.indexOf("&"));
      school.grades.push(grade);

    });
    schools.push(school);
  });
  return resolve(schools);
});

const parseGradesBySchool = (data, code) => new Promise((resolve, reject) => {
  if (!data || !code)
    return reject("Can't parse empty data");

  const $ = cheerio.load(data);
  let grades = [];
  $("#contenedor>ul>li").each(function() {
    const gradeItem = $(this).find("a");
    const gradeHref = $(gradeItem).attr("href");

    if (gradeHref && gradeHref.includes(`p_cod_centro=${code}`)) {
      let grade = {};
      const urlAuxCode = gradeHref.split("p_cod_plan=")[1];

      grade.name = $(this).text();
      grade.gradeCode = urlAuxCode.substr(0, urlAuxCode.indexOf("&"));
      grade.href = `https://ehu.eus/${gradeHref}`;

      grades.push(grade);
    }
  });
  return resolve(grades);
});

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
