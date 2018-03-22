'use strict';

const { getTeacherTutorships } = require('./teacher.ctrl');

class Teacher{
	constructor(id, grade){
		this._id = id;
		this._grade = grade;
	}

	/**
	 * Return tutorships from the teacher
	 */
	getTutorships(){
		return getTeacherTutorships(this._grade, this._id);
	}

	get id(){
		return this._id;
	}

	get grade(){
		return this._grade;
	}

	set id(id){
		this._id = id;
	}

	set grade(grade){
		this._grade = grade;
	}
}

module.exports = Teacher;
