const chai = require('chai');
const  { expect, assert } = chai;
const chaiAsPromised = require('chai-as-promised');

const {
	getGradesByCampus,
	getGradesBySchool,
	getGradeSummary,
	getGradeSubjects
} = require('../');

chai.use(chaiAsPromised);

describe('getGradesByCampus:', function ()  {
	it('should return an error, campus code needed', function() {
		return expect(getGradesByCampus()).to.be.rejected;
	});

	it('should return an object with all the attributes', () => {
		return getGradesByCampus("BI")
			.then(res => {
				expect(res).to.be.an('array');
				if(res.length > 0){
					const school = res[0];
					expect(school).to.be.an('object');
					expect(school).to.have.property('name');
					expect(school).to.have.property('code');
					expect(school).to.have.property('grades');
					expect(school.grades).to.be.an('array');
					if(school.grades.length > 0){
						const grade = school.grades[0];
						expect(grade).to.be.an('object');
						expect(grade).to.have.property('name');
						expect(grade).to.have.property('href');
						expect(grade).to.have.property('code');
					}
				}
			});
	});
});

describe('getGradeSummary: ', () => {
	it('should return an error, parameters needed', () => {
		return expect(getGradeSummary()).to.be.rejected;
	});

	it('should return an error, school code required', function() {
		return expect(getGradeSummary('GINFOR30')).to.be.rejected;
	});

	it('should return an object with all the attributes', () => {
		return getGradeSummary('GESOCI30', "354")
			.then(res => {
				expect(res).to.be.an('object');
				expect(res).to.have.property('name');
				expect(res).to.have.property('href');
				expect(res).to.have.property('summary');
				expect(res).to.have.property('minimum-grade');
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


describe('getGradesSubjects: ', () => {
	it('should return an error, parameters required', () => {
		return expect(getGradeSubjects()).to.be.rejected;
	});

	it('should return an error, school code required', function() {
		return expect(getGradeSubjects('GINFOR30')).to.be.rejected;
	});

	it('should return an object with all the attributes', function() {
		return getGradeSubjects('GESOCI30', "354")
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
