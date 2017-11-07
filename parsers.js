"use strict";

const cheerio = require('cheerio');

const parseCampusData = (data) => new Promise((resolve, reject) => {
  if(!data) return reject("Can't parse empty data");

  const $ = cheerio.load(data);
  let schools = [];

  $("#contenedor>ul>li").each(function(){
    let school = {};
    school.name = $(this).text();
    school.grades = [];

    $(this).next().find("a").each(function(){
      let grade = {};
      const gradeHref = $(this).attr("href");
      const urlAuxCode = gradeHref.split("p_cod_plan=")[1];
      const urlAuxSchool = gradeHref.split("p_cod_centro=")[1];

      grade.name = $(this).text();
      grade.gradeCode = urlAuxCode.substr(0, urlAuxCode.indexOf("&"));
      grade.href = `https://ehu.eus/${gradeHref}`;
      school.code = urlAuxSchool.substr(0, urlAuxSchool.indexOf("&"));
      school.grades.push(grade);

    });
    schools.push(school);
  });
  return resolve(schools);
});


const parseGradesBySchool = (data, code) => new Promise((resolve, reject) => {
  if(!data) return reject("Can't parse empty data");

  const $ = cheerio.load(data);
  let grades = [];
  $("#contenedor>ul>li").each(function(){
    const gradeItem = $(this).find("a");
    const gradeHref = $(gradeItem).attr("href");

    if(gradeHref && gradeHref.includes(`p_cod_centro=${code}`)){
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

module.exports = {
  parseCampusData : parseCampusData,
  parseGradesBySchool: parseGradesBySchool
}
