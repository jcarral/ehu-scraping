const chai = require('chai');
const { expect, assert } = chai;
const chaiAsPromised = require('chai-as-promised');

const {
	University
} = require('../');

chai.use(chaiAsPromised);

describe('getGradesList:', function () {
	it('should return an error, wrong campus code', function () { 
		return expect(University.getGradesList({ campus: 'R2D2' })).to.be.rejected;
	});


	it('should return an object with all the attributes', () => {

		return University.getGradesList({campus: 'BI'})
			.then(res => {
				expect(res).to.be.an('array');
				if (res.length > 0) {
					const school = res[0];
					expect(school).to.be.an('object');
					expect(school).to.have.property('name');
					expect(school).to.have.property('code');
					expect(school).to.have.property('campus');
					expect(school).to.have.property('grades');
					expect(school.grades).to.be.an('array');
					if (school.grades.length > 0) {
						const grade = school.grades[0];
						expect(grade).to.be.an('object');
						expect(grade).to.have.property('name');
						expect(grade).to.have.property('href');
						expect(grade).to.have.property('code');
					}
				}
			});
	});

	it('should return all the grades', () => {

		return University.getGradesList()
			.then(res => {
				expect(res).to.be.an('array');
				if (res.length > 0) {
					const school = res[0];
					expect(school).to.be.an('object');
					expect(school).to.have.property('name');
					expect(school).to.have.property('code');
					expect(school).to.have.property('campus');
					expect(school).to.have.property('grades');
					expect(school.grades).to.be.an('array');
					if (school.grades.length > 0) {
						const grade = school.grades[0];
						expect(grade).to.be.an('object');
						expect(grade).to.have.property('name');
						expect(grade).to.have.property('href');
						expect(grade).to.have.property('code');
					}
				}
			});
	});


	it('should return all the grades filtered by school', () => {
		return University.getGradesList({school: '328'})
			.then(res => {
				expect(res).to.be.an('array');
				if (res.length > 0) {
					const school = res[0];
					expect(school).to.be.an('object');
					expect(school).to.have.property('name');
					expect(school).to.have.property('code');
					expect(school).to.have.property('campus');
					expect(school).to.have.property('grades');
					expect(school.grades).to.be.an('array');
					if (school.grades.length > 0) {
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
