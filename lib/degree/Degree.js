"use strict";

const EHUrls = require('../utils/ehurls');
const { getDegreeSummary,
				getAllSubjects,
				getSubjectsFromCourse,
				getAllTeachers,
				getNameOfDegree,
				getCodeOfDegree,
				getDegreeSchool
			} = require('./degree.ctrl');

class Degree {
	constructor(code, school){
		this._code = code;
		this._school = school || Degree.getSchool(code);
	}

	/**
	 * Function to get the summary of the degree
	 */
	getSummary(){
		return getDegreeSummary(this._code, this._school);
	};

	/**
	 * Function to get all the subjects from the degree
	 * @param {string} course [Optional] 
	 */
	getSubjects(course){
		if(!course) return getAllSubjects(this._code, this._school);
		else return getSubjectsFromCourse(this._code, this._school, course);
	};

	/**
	 * Function to get the list of teachers
	 */
	getTeachers(){
		return getAllTeachers(this._code, this._school);
	};
	
	/**
 	* Function to get the degree url
 	*/
	getURL() {
		return EHUrls.getDegree(this._code, this._school);
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
		return getNameOfDegree(code);
	};

	/**
	 * Function to get the code of the degree
	 * @param {string} codeName 
	 */
	static getCode(codeName){
		return getCodeOfDegree(codeName);
	};

	/**
	 * Returns the school code
	 * @param {string} code 
	 */
	static getSchool(code){
		return getDegreeSchool(code)
	}

}

module.exports = Degree;
