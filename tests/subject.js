const chai = require('chai');
const  { expect, assert } = chai;
const chaiAsPromised = require('chai-as-promised');

const {
	Subject
} = require('../');

chai.use(chaiAsPromised);

describe('getSummary', () => {
	it('should return an error, parameters are required', () => expect(new Subject().getSummary()).to.be.rejected);

	it('should return an object with the subject info summary attributes from complete subject', () => {
		return new Subject('26224', '226', 'GINFOR20', '4').getSummary()
			.then(res => {
				completeSubjectSummary(res);
			});
	});

	it('should return an object with the subject info summary attributes from partial subject', () => {
		return new Subject('25016', '323', 'GSOCIO30', '4').getSummary()
			.then(res => {
				completeSubjectSummary(res);
			});
	});


});


describe('getDetail', () => {
	it('should return an error, parameters are required', () => expect(new Subject().getDetail()).to.be.rejected);

	it('should return an object with the subject info attributes from complete subject', () => {
		return new Subject('26224', '226', 'GINFOR20', '4').getDetail()
			.then(res => {
				completeSubjectInfo(res);
			});
	});

	it('should return an object with the subject info attributes from partial subject', () => {
		return new Subject('25016', '323', 'GSOCIO30', '4').getDetail()
			.then(res => {
				completeSubjectInfo(res);
			});
	});
});

describe('getSchedule', () => {
	it('should return an error, parameters are required', () => expect(new Subject().getSchedule()).to.be.rejected);

	it('should return an object with the subject schedule attributes from complete subject', () => {
		return new Subject('26224', '226', 'GINFOR20', '4').getSchedule()
			.then(res => {
				completeSubjectSchedule(res);
			});
	});

	it('should return an object with the subject schedule attributes from partial subject', () => {
		return new Subject('25016', '323', 'GSOCIO30', '4').getSchedule()
			.then(res => {
				completeSubjectSchedule(res);
			});
	});


});


const completeSubjectInfo = (res) => {
	expect(res).to.be.an('object');
	expect(res).to.have.property('name');
	expect(res).to.have.property('school');
	expect(res).to.have.property('degree');
	expect(res).to.have.property('year');
	expect(res).to.have.property('course');
	expect(res).to.have.property('description');
	expect(res).to.have.property('competences');
	expect(res).to.have.property('content');
	expect(res).to.have.property('bibliography');
	expect(res.bibliography).to.be.an('array');
	expect(res).to.have.property('observation');
	expect(res).to.have.property('ordinary_announcement');
	expect(res).to.have.property('extraordinary_announcement');

};

const completeSubjectSummary = (res) => {
	expect(res).to.be.an('object');
	expect(res).to.have.property('name');
	expect(res).to.have.property('href');
	expect(res).to.have.property('course');
	expect(res).to.have.property('credits');
	expect(res).to.have.property('code');
	expect(res).to.have.property('departament');
	expect(res).to.have.property('year');
	expect(res).to.have.property('school');
	expect(res.school).to.be.an('object');
	expect(res.school).to.have.property('name');
	expect(res.school).to.have.property('code');
	expect(res).to.have.property('degree');
	expect(res.degree).to.be.an('object')
	expect(res.degree).to.have.property('name');
	expect(res.degree).to.have.property('code');
	expect(res).to.have.property('languages');
	expect(res.languages).to.be.an('array');
	expect(res).to.have.property('teachers');
	expect(res.teachers).to.be.an('array');
	if(res.teachers.length > 0){
		const teacher = res.teachers[0];
		expect(teacher).to.be.an('object');
		expect(teacher).to.have.property('name');
		expect(teacher).to.have.property('code_school');
		expect(teacher).to.have.property('code_degree');
		expect(teacher).to.have.property('id_teacher');
		expect(teacher).to.have.property('dep_teacher');
		expect(teacher).to.have.property('code_area');
		expect(teacher).to.have.property('languages');
		expect(teacher.languages).to.be.an('array');
	}
};

const completeSubjectSchedule = (res) => {
	expect(res).to.be.an('object');
	expect(res).to.have.property('groups');
	expect(res.groups).to.be.an('array');
	if(res.groups.length > 0){
		const group = res.groups[0];
		expect(group).to.be.an('object');
		expect(group).to.have.property('code');
		expect(group).to.have.property('teachers');
		expect(group.teachers).to.be.an('array');
		if(group.teachers.length > 0){
			const teacher = group.teachers[0];
			expect(teacher).to.be.an('object');
			expect(teacher).to.have.property('name');
			expect(teacher).to.have.property('code_school');
			expect(teacher).to.have.property('code_degree');
			expect(teacher).to.have.property('id_teacher');
			expect(teacher).to.have.property('dep_teacher');
			expect(teacher).to.have.property('code_area');
		}
		expect(group).to.have.property('schedule');
		expect(group.schedule).to.be.an('array');
		if(group.schedule.length > 0){
			const schedule = group.schedule[0];
			expect(schedule).to.be.an('object');
			expect(schedule).to.have.property('weeks');
			expect(schedule).to.have.property('monday');
			checkDayOfWeek(schedule.monday);
			expect(schedule).to.have.property('tuesday');
			checkDayOfWeek(schedule.tuesday);
			expect(schedule).to.have.property('wednesday');
			checkDayOfWeek(schedule.wednesday);
			expect(schedule).to.have.property('thursday');
			checkDayOfWeek(schedule.thursday);
			expect(schedule).to.have.property('friday');
			checkDayOfWeek(schedule.friday);
		}
	}
};

const checkDayOfWeek = (daySchedule) => {
		const types = ['M', 'S', 'GA', 'GL', 'GO', 'GCL', 'TA', 'TI', 'GCA'];
		expect(daySchedule).to.be.an('array');
		if(daySchedule.length > 0){
			const day = daySchedule[0];
			expect(day).to.be.an('object');
			expect(day).to.have.property('hours');
			expect(day).to.have.property('type');
			expect(day.type).to.be.oneOf(types);
		}
};
