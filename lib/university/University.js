"use strict";

const EHUrls = require('../utils/ehurls');
const { getAllDegrees, getDegreesByCampus, getDegreesBySchool } = require('./university.ctrl');

class University {

	/**
	 * Return an object with the list of Degrees
	 * @param {Object} data Object with the diferent parameters
	 */
	static getDegreesList(data){
		if (data && data.hasOwnProperty('school') && data.school !== '' && typeof data.school === typeof '') return getDegreesBySchool(data.school);
		else if (data && data.hasOwnProperty('campus') && data.campus !== '' && typeof data.campus === typeof '') return getDegreesByCampus(data.campus);
		else return getAllDegrees();
	}

	/**
	 * Return the url from the Degrees list page
	 */
	static getDegreesUrl(){
		return EHUrls.getAllDegrees();
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


