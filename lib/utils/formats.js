const _campusValue = (str) => {
  str = str.toUpperCase().trim();
  switch (str) {
    case 'BI':
    case 'BIZKAIA':
    case 'BIZ':
    case 'VIZCAYA':
    case 3:
      return 3;
    case 'AR':
    case 'ARABA':
    case 'ARA':
    case 'ALAVA':
    case 'ÁLAVA':
    case 1:
      return 1;
    case 'GI':
    case 'GIPUZKOA':
    case 'GIP':
    case 'GUIPÚZCOA':
    case 'GUIPUZCOA':
    case 2:
      return 2;
    default:
      throw new Error(`Error: Invalid campus, ${str}`);
  }
};

const _courseValue = str => str[str.length - 1];

const _numToLanguage = (num) => {
  if (isNaN(num)) throw 'Can\'t parse NaN to get a language';
  num = parseInt(parseInt(num, 10) / 10, 10);
  switch (num) {
    case 0:
    case 1:
      return 'es';
    case 3:
    case 4:
      return 'eu';
    case 6:
      return 'en';
    default:
      return 'es';
  }
};

const _valueToType = (str) => {
  const trimmed = str.replace(/\s/g, '');
  switch (trimmed) {
    case 'Magistral':
      return 'M';
    case 'Seminario':
      return 'S';
    case 'P.deAula':
      return 'GA';
    case 'P.Laboratorio':
      return 'GL';
    case 'P.Ordenador':
      return 'GO';
    case 'P.Clínicas':
      return 'GCL';
    case 'Taller':
      return 'TA';
    case 'TallerInd':
      return 'TI';
    case 'P.deCampo':
      return 'GCA';
    default:
      return 'M';
  }
};

/**
 * Function to return the number of the month
 */
const _getMonthValue = (str) => {
  const trimmed = str.toLowerCase().replace(/\s/g, '');
  switch (trimmed) {
    case 'enero':
      return 1;
    case 'febrero':
      return 2;
    case 'marzo':
      return 3;
    case 'abril':
      return 4;
    case 'mayo':
      return 5;
    case 'junio':
      return 6;
    case 'julio':
      return 7;
    case 'agosto':
      return 8;
    case 'septiembre':
      return 9;
    case 'octubre':
      return 10;
    case 'noviembre':
      return 11;
    case 'diciembre':
      return 12;
    default:
      Promise.reject('Month string incorrect');
  }
};

/*
* Get number days in a specified month
*/
const _getMonthDays = (year, month) => new Date(year, month, 0).getDate();

module.exports = {
  valToCampus: _campusValue,
  courseValue: _courseValue,
  numToLanguage: _numToLanguage,
  valueToType: _valueToType,
  getMonthValue: _getMonthValue,
  getMonthDays: _getMonthDays,
};
