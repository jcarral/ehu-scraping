"use strict"

const {
  getGradesByCampus,
  getGradesBySchool,
  getGradeSummary,
  getGradeSubjects,
  getGradeSubjectsByCourse
} = require("./grades");

module.exports = {
  getGradesByCampus : getGradesByCampus,
  getGradesBySchool : getGradesBySchool,
  getGradeSummary: getGradeSummary,
  getGradeSubjects: getGradeSubjects,
  getGradeSubjectsByCourse: getGradeSubjectsByCourse
}
