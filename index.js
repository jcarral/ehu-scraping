"use strict"

const {
  getGradesByCampus,
  getGradesBySchool,
  getGradeSummary,
  getGradeSubjects,
  getGradeSubjectsByCourse,
} = require("./grades");

const {
  getSubjectSummary,
  getSubjectInfo
} = require('./subjects');

module.exports = {
  getGradesByCampus : getGradesByCampus,
  getGradesBySchool : getGradesBySchool,
  getGradeSummary: getGradeSummary,
  getGradeSubjects: getGradeSubjects,
  getGradeSubjectsByCourse: getGradeSubjectsByCourse,
  getSubjectSummary: getSubjectSummary,
  getSubjectInfo: getSubjectInfo
}
