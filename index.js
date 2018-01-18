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

const {
	getTeacherSchedule,
	getTeachersFromGrade
} = require('./teachers');

module.exports = {
  getGradesByCampus ,
  getGradesBySchool ,
  getGradeSummary,
  getGradeSubjects,
  getGradeSubjectsByCourse,
  getSubjectSummary,
  getSubjectInfo,
	getSubjectSchedule,
	getTeachersFromGrade,
	getTeacherSchedule
}
