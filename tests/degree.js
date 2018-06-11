const chai = require('chai');
const  { expect, assert } = chai;
const chaiAsPromised = require('chai-as-promised');

const {
	Degree
} = require('../');

chai.use(chaiAsPromised);

describe('getSummary: ', () => {
	it('should return an error, parameters required', () => {
		return expect(new Degree().getSummary()).to.be.rejected;
	});

	it('should return an error, school code required', function() {
		return expect(new Degree('GINFOR30').getSummary()).to.be.rejected;
	});

	it('should return an object with all the attributes', () => {
		const sociologia = new Degree('GESOCI30', '354');
		return sociologia.getSummary()
			.then(res => {
				expect(res).to.be.an('object');
				expect(res).to.have.property('name');
				expect(res).to.have.property('href');
				expect(res).to.have.property('summary');
				expect(res).to.have.property('minimum-degree');
				expect(res).to.have.property('contact');
				expect(res.contact).to.be.an('object');
				expect(res.contact).to.have.property('address');
				expect(res.contact).to.have.property('phone');
				expect(res.contact).to.have.property('email'); //Optional
				expect(res).to.have.property('school');
				expect(res.school).to.be.an('object');
				expect(res.school).to.have.property('name');
				expect(res.school).to.have.property('code');
			});
	});
});


describe('getSubjects: ', () => {
	it('should return an error, parameters required', () => {
		return expect(new Degree().getSubjects()).to.be.rejected;
	});

	it('should return an error, school code required', function() {
		return expect(new Degree('GINFOR30').getSubjects()).to.be.rejected;
	});

	it('should return an object with all the attributes', function() {
		const sociologia = new Degree('GESOCI30', "354");
		return sociologia.getSubjects()
			.then(res => {
				expect(res).to.be.an('array');
				const first = res[0];
				expect(first).to.be.an('object');
				expect(first).to.have.property('course');
				expect(first).to.have.property('subjects');
				expect(first.subjects).to.be.an('array');
				const subject = first.subjects[0];
				expect(subject).to.be.an('object');
				expect(subject).to.have.property('name');
				expect(subject).to.have.property('href');
				expect(subject).to.have.property('code');
				expect(subject).to.have.property('term');
				expect(subject).to.have.property('credits');
				expect(subject).to.have.property('languages');
				expect(subject.languages).to.be.an('array');
			});
	});

	it('should return an object with all the attributes', function () {
		const sociologia = new Degree('GESOCI30', "354");
		return sociologia.getSubjects('1')
			.then(res => {
				expect(res).to.be.an('array');
				const first = res[0];
				expect(first).to.be.an('object');
				expect(first).to.have.property('course');
				expect(first).to.have.property('subjects');
				expect(first.subjects).to.be.an('array');
				const subject = first.subjects[0];
				expect(subject).to.be.an('object');
				expect(subject).to.have.property('name');
				expect(subject).to.have.property('href');
				expect(subject).to.have.property('code');
				expect(subject).to.have.property('term');
				expect(subject).to.have.property('credits');
				expect(subject).to.have.property('languages');
				expect(subject.languages).to.be.an('array');
			});
	});
});

describe('getTeachers', () => {
	it('should return an error, degree code is required', () => {
		return expect(new Degree().getTeachers()).to.be.rejected;
	});

	it('should return an object with the list of teachers', () => {
		return new Degree('GINFOR20').getTeachers()
			.then(res => {
				expect(res).to.be.an('object');
				expect(res).to.have.property('degree');
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
