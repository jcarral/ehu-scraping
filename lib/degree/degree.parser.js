const cheerio = require('cheerio');
const { courseValue } = require('../utils/formats');
// Constants to use with the table of subjects
const T_NAME = 0;
const T_TERM = 1;
const T_CREDITS = 2;
const T_LANGUAGES = 4;

/**
 * Function to get the teacher info from a row
 */
const getTeacherFromRow = ($, row, degree) => {
  const teacher = {};
  const nameCell = $(row).find('td').first();
  const mailCell = $(nameCell).next();
  const teacherHref = $(nameCell).find('a').attr('href');

  teacher.name = $(nameCell).text();
  teacher.href = `https://www.ehu.eus/es/web/estudiosdegrado-gradukoikasketak/${degree}-profesorado${teacherHref}`;
  teacher.id = teacherHref.split('p_idp=')[1];
  teacher.email = $(mailCell).text();
  return teacher;
};

const parseDegreeSummary = (data, school, url) => new Promise((resolve, reject) => {
  if (!data || !school || !url) return reject('Can\'t parse empty data');
  const $ = cheerio.load(data);
  const degree = {};
  degree.name = $('.sobre>h1.tit').first().text();
  degree.href = url;
  const contact = {
    name: '',
    email: '',
    address: '',
    phone: '',
  };

  $('#contenedor').find('h2').each(function () {
    let ul;
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
          code: school,
        };
        break;
      case 'Contacto':
        ul = ($(this).next().is('ul')) ? $(this).next() : $(this).next().next();
        $(ul).find('li').each(function () {
          switch ($(this).find('b').text()) {
            case 'Nombre:':
              contact.name = $(this).clone().children().remove()
                .end()
                .text();
              break;
            case 'Mail:':
              contact.email = $(this).clone().children().remove()
                .end()
                .text();
              break;
            case 'Dirección:':
              contact.address = $(this).clone().children().remove()
                .end()
                .text();
              break;
            case 'Teléfono:':
              contact.phone = $(this).clone().children().remove()
                .end()
                .text();
              break;
            default:
          }
        });
        break;
      default:
    }
  });

  degree.contact = contact;

  return resolve(degree);
});

const parseDegreeSubjects = (data, course) => new Promise((resolve, reject) => {
  if (!data) return reject('Can\'t parse empty data');
  const $ = cheerio.load(data);
  const courses = [];

  $('.tabla').each(function () {
    const currentCourse = {};
    currentCourse.course = courseValue($(this).attr('id'));
    if (course && currentCourse.course !== course) return true;
    currentCourse.subjects = [];

    $(this).find('tbody>tr').each(function () {
      const subject = {};

      $(this).find('td').each(function (index) {
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
            $(this).find('abbr').each(function () {
              subject.languages.push($(this).text());
            });
            break;
          default:
        }
      });

      currentCourse.subjects.push(subject);
    });

    courses.push(currentCourse);
  });

  resolve(courses);
});

const parseAllTeachers = (data, degree) => new Promise((resolve, reject) => {
  if (!data) return reject('Can\'t parse empty data');
  else if (!degree) return reject('Error: can\'t parse teacher list without degree code [parseTeacherList]');

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
  parseAllTeachers,
};
