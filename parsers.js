"use strict";

const cheerio = require('cheerio');

const parseCampusData = (data) => new Promise((resolve, reject) => {
  const $ = cheerio.load(data);
  let schools = [];

  $("#contenedor>ul>li").each(function(){
    let school = {};
    school.name = $(this).text();
    school.grades = [];

    $(this).next().find("a").each(function(){
      let grade = {};
      let gradeHref = $(this).attr("href");
      let urlAuxCode = gradeHref.split("p_cod_plan=")[1];
      let urlAuxSchool = gradeHref.split("p_cod_centro=")[1];

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

module.exports = {
  parseCampusData : parseCampusData
}
