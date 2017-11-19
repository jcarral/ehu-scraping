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
  getSubjectInfo,
	getSubjectSchedule
} = require('./subjects');

module.exports = {
  getGradesByCampus ,
  getGradesBySchool ,
  getGradeSummary,
  getGradeSubjects,
  getGradeSubjectsByCourse,
  getSubjectSummary,
  getSubjectInfo,
	getSubjectSchedule
}
