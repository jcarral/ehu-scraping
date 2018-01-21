"use strict";

const { getTeacherTutorships } = require('./teacher.ctrl');

class Teacher{
	constructor(id, degree){
		this._id = id;
		this._degree = degree;
	}

	/**
	 * Return tutorships from the teacher
	 */
	getTutorships(){
		return getTeacherTutorships(this._degree, this._id);
	}

	get id(){
		return this._id;
	}

	get degree(){
		return this._degree;
	}

	set id(id){
		this._id = id;
	}

	set degree(degree){
		this._degree = degree;
	}
}

module.exports = Teacher;
