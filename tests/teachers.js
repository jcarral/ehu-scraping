const chai = require('chai');
const { expect, assert } = chai;
const chaiAsPromised = require('chai-as-promised');

const { getTeachersFromGrade, getTeacherSchedule } = require('../');

chai.use(chaiAsPromised);

describe('getTeacherByGrade', () => {
	it('should return an error, grade code is required', () => {
		return expect(getTeachersFromGrade()).to.be.rejected;
	});

	it('should return an object with the list of teachers', () => {
		return getTeachersFromGrade('GINFOR20')
			.then(res => {
				expect(res).to.be.an('object');
				expect(res).to.have.property('grade');
				expect(res).to.have.property('teachers');
				expect(res.teachers).to.be.an('array');
				const teacher = res.teachers[0];
				expect(teacher).to.be.an('object');
				expect(teacher).to.have.property('name');
				expect(teacher).to.have.property('id');
				expect(teacher).to.have.property('email');
				expect(teacher).to.have.property('href');
			});
	});
});

describe('getTeacherSchedule', () => {

	it('should return an error, id is required', () => {
		return expect(getTeacherSchedule('GINFOR20')).to.be.rejected;
	});

	it('should return an error, grade is required', () => {
		return expect(getTeacherSchedule(null, '4150')).to.be.rejected;
	});

	it('should return an error, all parameters are required', () => {
		return expect(getTeacherSchedule()).to.be.rejected;
	});

	it('should return the teacher schedule object', () => {
		return getTeacherSchedule('GINFOR20', '4150').then(res => {
			expect(res).to.be.an('object');
			expect(res).to.have.property('name');
			expect(res).to.have.property('category');
			expect(res).to.have.property('grade');
			expect(res.grade).to.be.an('object');
			expect(res.grade).to.have.property('name');
			expect(res.grade).to.have.property('code');
			expect(res).to.have.property('departament');
			expect(res).to.have.property('area');
			expect(res).to.have.property('id');
			expect(res).to.have.property('email');
			expect(res).to.have.property('schedule');
			expect(res.schedule).to.be.an('array');
			const tutorship = res.schedule[0];
			if(tutorship){
				expect(tutorship).to.be.an('object');
				expect(tutorship).to.have.property('date-start'); //TODO: Validate type YYYY-MM-DDTHH:MM
				expect(tutorship).to.have.property('date-end');
				expect(tutorship).to.have.property('place');
			}
		});
	});

});
