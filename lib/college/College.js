"use strict";

const EHUrls = require('../utils/ehurls');
const { getAllGrades, getGradesByCampus, getGradesBySchool } = require('./college.ctrl');

class College {

	/**
	 * Return an object with the list of grades
	 * @param {Object} data Object with the diferent parameters
	 */
	static getGradesList(data){
		if (data && data.hasOwnProperty('school') && data.school !== '' && typeof data.school === typeof '') return getGradesBySchool(data.school);
		else if (data && data.hasOwnProperty('campus') && data.campus !== '' && typeof data.campus === typeof '') return getGradesByCampus(data.campus);
		else return getAllGrades();
	}

	/**
	 * Return the url from the grades list page
	 */
	static getGradesUrl(){
		return EHUrls.getAllGrades();
	}

	/**
	 * Return an array with the diferent campus
	 */
	static getCampus(){
		return [
			{
				name: 'BI',
				code: 3
			},{
				name: 'GI',
				code: 2
			},{
				name: 'AR',
				code: 1
			}
		];
	}
	
}

module.exports = College;


