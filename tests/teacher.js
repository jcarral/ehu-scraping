const chai = require('chai');
const { expect, assert } = chai;
const chaiAsPromised = require('chai-as-promised');

const { Teacher } = require('../');

chai.use(chaiAsPromised);

describe('getTutorships', () => {

	it('should return an error, id is required', () => {
		return expect(new Teacher(null, 'GINFOR20').getTutorships()).to.be.rejected;
	});

	it('should return an error, degree is required', () => {
		return expect(new Teacher('4150').getTutorships()).to.be.rejected;
	});

	it('should return an error, all parameters are required', () => {
		return expect(new Teacher().getTutorships()).to.be.rejected;
	});

	it('should return the teacher schedule object', () => {
		return new Teacher('4150', 'GINFOR20').getTutorships().then(res => {
			expect(res).to.be.an('object');
			expect(res).to.have.property('name');
			expect(res).to.have.property('category');
			expect(res).to.have.property('degree');
			expect(res.degree).to.be.an('object');
			expect(res.degree).to.have.property('name');
			expect(res.degree).to.have.property('code');
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
