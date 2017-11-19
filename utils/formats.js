"use strict";

const _campusValue = (str) => {
	str = str.toUpperCase();
	switch (str) {
		case "BI" || "BIZKAIA" || "BIZ" || "VIZCAYA":
			return 3;
		case "AR" || "ARABA" || "ARA" || "ALAVA":
			return 1;
		case "GI" || "GIPUZKOA" || "GIP" || "GUIPÚZCOA" || "GUIPUZCOA":
			return 2;
		default:
			return Promise.reject("Error: Invalid campus");
	}
};

const _courseValue = (str) => str[str.length - 1];

const _numToLanguage = num => {
	if(isNaN(num)) throw "Can't parse NaN to get a language";
		num = parseInt(parseInt(num)/10);
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

const _valueToType = str => {
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

module.exports = {
	valToCampus: _campusValue,
	courseValue: _courseValue,
	numToLanguage: _numToLanguage,
	valueToType: _valueToType
}
