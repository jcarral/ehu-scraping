'use strict';
const { getSubjectSummary, getSubjectDetail, getSubjectSchedule } = require('./subject.ctrl');
const Degree = require('../degree');

class Subject {
	constructor(subject, degree, course, school){
		this._subject = subject;
		this._school = school||Degree.getSchool(degree);
		this._degree = degree;
		this._course = course;
	}

	/**
	 * Returns the summary of the subject
	 */
	getSummary(){
		return getSubjectSummary(this._subject, this._school, this._degree, this._course);
	}

	/**
	 * Returns the detailed information of the subject
	 */
	getDetail(){
		return getSubjectDetail(this._subject, this._school, this._degree, this._course); 
	}

	/**
	 * Returns the timetable of the subject
	 */
	getSchedule(){
		return getSubjectSchedule(this._subject, this._school, this._degree, this._course);
	}

	get subject(){
		return this._subject;
	}

	get school() {
		return this._school;
	}

	get degree(){
		return this._degree;
	}

	get course(){
		return this._course;
	}

	set school(school){
		this._school = school;
	}

	set degree(degree){
		this._degree = degree;
	}
	
	set subject(subject){
		this._subject = subject;
	}

	set course(course){
		this._course = course;
	}
}

module.exports = Subject;
