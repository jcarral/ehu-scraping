'use strict';
const { getSubjectSummary, getSubjectDetail, getSubjectSchedule } = require('./subject.ctrl');
const Grade = require('../grade');

class Subject {
	constructor(subject, grade, course, school){
		this._subject = subject;
		this._school = school||Grade.getSchool(grade);
		this._grade = grade;
		this._course = course;
	}

	/**
	 * Returns the summary of the subject
	 */
	getSummary(){
		return getSubjectSummary(this._subject, this._school, this._grade, this._course);
	}

	/**
	 * Returns the detailed information of the subject
	 */
	getDetail(){
		return getSubjectDetail(this._subject, this._school, this._grade, this._course); 
	}

	/**
	 * Returns the timetable of the subject
	 */
	getSchedule(){
		return getSubjectSchedule(this._subject, this._school, this._grade, this._course);
	}

	get subject(){
		return this._subject;
	}

	get school() {
		return this._school;
	}

	get grade(){
		return this._grade;
	}

	get course(){
		return this._course;
	}

	set school(school){
		this._school = school;
	}

	set grade(grade){
		this._grade = grade;
	}
	
	set subject(subject){
		this._subject = subject;
	}

	set course(course){
		this._course = course;
	}
}

module.exports = Subject;
