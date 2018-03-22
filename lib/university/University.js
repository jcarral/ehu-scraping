'use strict';

const EHUrls = require('../utils/ehurls');
const { getAllGrades, getGradesByCampus, getGradesBySchool } = require('./university.ctrl');

class University {

	/**
	 * Return an object with the list of Grades
	 * @param {Object} data Object with the diferent parameters
	 */
	static getGradesList(data){
		if (data && data.hasOwnProperty('school') && data.school !== '' && typeof data.school === typeof '') return getGradesBySchool(data.school);
		else if (data && data.hasOwnProperty('campus') && data.campus !== '' && typeof data.campus === typeof '') return getGradesByCampus(data.campus);
		else return getAllGrades();
	}

	/**
	 * Return the url from the Grades list page
	 */
	static getGradesUrl(){
		return EHUrls.getAllGrades();
	}

	/**
	 * Returns an array with the diferent campus
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

module.exports = University;


