const { parseAllDegrees } = require('./university.parser');
const { getDataFromWeb } = require('../utils/scraping');
const { valToCampus } = require('../utils/formats');
const EHUrls = require('../utils/ehurls');

const getAllDegrees = () => {
  try {
    return getDataFromWeb(EHUrls.getAllDegrees())
      .then(res => parseAllDegrees(res));
  } catch (e) {
    return Promise.reject(e);
  }
};

const getDegreesByCampus = (campus) => {
  try {
    const campusVal = valToCampus(campus);
    return getAllDegrees()
      .then(listOfDegrees => listOfDegrees.filter(school => school.campus === campusVal));
  } catch (e) {
    return Promise.reject(e);
  }
};

const getDegreesBySchool = (school) => {
  try {
    return getAllDegrees()
      .then(listOfDegrees => listOfDegrees.filter(sc => sc.code === school));
  } catch (e) {
    return Promise.reject(e);
  }
};

module.exports = {
  getAllDegrees,
  getDegreesByCampus,
  getDegreesBySchool,
};
