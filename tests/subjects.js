const chai = require('chai');
const  { expect, assert } = chai;
const chaiAsPromised = require('chai-as-promised');

const {
  getSubjectSummary
} = require('../');

chai.use(chaiAsPromised);

describe('getSubjectSummary', () => {
  it('should return an error, parameters are required', () => expect(getSubjectSummary()).to.be.rejected);

  it('should return an object with the subject info summary attributes from complete subject', () => {
    return getSubjectSummary('26224', '226', 'GINFOR20', '4')
      .then(res => {
        completeSubjectSummary(res);
      });
  });

  it('should return an object with the subject info summary attributes from partial subject', () => {
    return getSubjectSummary('25016', '323', 'GSOCIO30', '4')
      .then(res => {
        completeSubjectSummary(res);
      });
  });


});


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
  expect(res).to.have.property('grade');
  expect(res.grade).to.be.an('object')
  expect(res.grade).to.have.property('name');
  expect(res.grade).to.have.property('code');
  expect(res).to.have.property('languages');
  expect(res.languages).to.be.an('array');
  expect(res).to.have.property('teachers');
  expect(res.teachers).to.be.an('array');
  if(res.teachers.length > 0){
    const teacher = res.teachers[0];
    expect(teacher).to.be.an('object');
    expect(teacher).to.have.property('name');
    expect(teacher).to.have.property('code');
    expect(teacher).to.have.property('language');
  }
};
