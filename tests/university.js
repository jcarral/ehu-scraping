const chai = require('chai');
const { expect, assert } = chai;
const chaiAsPromised = require('chai-as-promised');

const {
	University
} = require('../');

chai.use(chaiAsPromised);

describe('getDegreesList:', function () {
	it('should return an error, wrong campus code', function () { 
		return expect(University.getDegreesList({ campus: 'R2D2' })).to.be.rejected;
	});


	it('should return an object with all the attributes', () => {

		return University.getDegreesList({campus: 'BI'})
			.then(res => {
				expect(res).to.be.an('array');
				if (res.length > 0) {
					const school = res[0];
					expect(school).to.be.an('object');
					expect(school).to.have.property('name');
					expect(school).to.have.property('code');
					expect(school).to.have.property('campus');
					expect(school).to.have.property('degrees');
					expect(school.degrees).to.be.an('array');
					if (school.degrees.length > 0) {
						const grade = school.degrees[0];
						expect(grade).to.be.an('object');
						expect(grade).to.have.property('name');
						expect(grade).to.have.property('href');
						expect(grade).to.have.property('code');
					}
				}
			});
	});

	it('should return all the degrees', () => {

		return University.getDegreesList()
			.then(res => {
				expect(res).to.be.an('array');
				if (res.length > 0) {
					const school = res[0];
					expect(school).to.be.an('object');
					expect(school).to.have.property('name');
					expect(school).to.have.property('code');
					expect(school).to.have.property('campus');
					expect(school).to.have.property('degrees');
					expect(school.degrees).to.be.an('array');
					if (school.degrees.length > 0) {
						const grade = school.degrees[0];
						expect(grade).to.be.an('object');
						expect(grade).to.have.property('name');
						expect(grade).to.have.property('href');
						expect(grade).to.have.property('code');
					}
				}
			});
	});


	it('should return all the degrees filtered by school', () => {
		return University.getDegreesList({school: '328'})
			.then(res => {
				expect(res).to.be.an('array');
				if (res.length > 0) {
					const school = res[0];
					expect(school).to.be.an('object');
					expect(school).to.have.property('name');
					expect(school).to.have.property('code');
					expect(school).to.have.property('campus');
					expect(school).to.have.property('degrees');
					expect(school.degrees).to.be.an('array');
					if (school.degrees.length > 0) {
						const grade = school.degrees[0];
						expect(grade).to.be.an('object');
						expect(grade).to.have.property('name');
						expect(grade).to.have.property('href');
						expect(grade).to.have.property('code');
					}
				}
			});
	});
});
