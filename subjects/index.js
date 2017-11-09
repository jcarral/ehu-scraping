"use strict";

const { getDataFromWeb } = require('../utils/scraping');
const { getSubjectUrl } = require('../utils/urls');
const { parseSubjectSummary } = require('./subjects.parser');

const getSubjectSummary = (subject, school, grade, course) => {
  if (!subject || typeof subject !== typeof "string") return Promise.reject('Error: Subject code is required. [getSubjectSummary]');
  else if (!school || typeof school !== typeof "string") return Promise.reject('Error: School code is required. [getSubjectSummary]');
  else if (!grade || typeof grade !== typeof "string") return Promise.reject('Error: Grade code is required. [getSubjectSummary]');
  else if (!course || typeof course !== typeof "string") return Promise.reject('Error: Course is required. [getSubjectSummary]');

  const url = getSubjectUrl(subject, school, grade, course);
  return getDataFromWeb(url)
          .then(data => parseSubjectSummary(data, school, grade));
};

module.exports = {
  getSubjectSummary: getSubjectSummary
}
