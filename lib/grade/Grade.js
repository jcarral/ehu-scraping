'use strict';

const EHUrls = require('../utils/ehurls');
const { getGradeSummary,
	getAllSubjects,
	getSubjectsFromCourse,
	getAllTeachers,
	getNameOfGrade,
	getCodeOfGrade,
	getGradeSchool
} = require('./grade.ctrl');

class Grade {
	constructor(code, school){
		this._code = code;
		this._school = school || Grade.getSchool(code);
	}

	/**
	 * Function to get the summary of the grade
	 */
	getSummary(){
		return getGradeSummary(this._code, this._school);
	}

	/**
	 * Function to get all the subjects from the grade
	 * @param {string} course [Optional] 
	 */
	getSubjects(course){
		if(!course) return getAllSubjects(this._code, this._school);
		else return getSubjectsFromCourse(this._code, this._school, course);
	}

	/**
	 * Function to get the list of teachers
	 */
	getTeachers(){
		return getAllTeachers(this._code);
	}
	
	/**
 	* Function to get the grade url
 	*/
	getURL() {
		return EHUrls.getGrade(this._code, this._school);
	}

	get code(){
		return this._code;
	}

	get school(){
		return this._school;
	}

	/**
	 * Function to get the full code
	 * @param {string} code 
	 */
	static getName(code){
		return getNameOfGrade(code);
	}

	/**
	 * Function to get the code of the grade
	 * @param {string} codeName 
	 */
	static getCode(codeName){
		return getCodeOfGrade(codeName);
	}

	/**
	 * Returns the school code
	 * @param {string} code 
	 */
	static getSchool(code){
		return getGradeSchool(code);
	}

}

module.exports = Grade;
