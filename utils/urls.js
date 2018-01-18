"use strict";

const {valToCampus} = require('./formats');
const _getCampusUrl = (code) => {
	const campus = valToCampus(code);
	const baseUrl = `http://www.ehu.eus/es/web/vicer.grado-innovacion/aurtengo-graduak-campus-ikastegia?p_p_id=upvehuapp_WAR_upvehuappportlet&p_p_state=normal&p_p_mode=view&p_p_col_id=column-2&p_p_col_pos=0&p_p_col_count=1&p_p_lifecycle=1&_upvehuapp_WAR_upvehuappportlet_action=redirectAction&reu=/pls/entrada/plew0040.htm?p_sesion=&p_cod_idioma=CAS&p_en_portal=N&p_titu_nuevas=S&p_opcion=2&p_anyoAcad=act&p_campus=${campus}&p_rama=&p_ciclo=`;
	return Promise.resolve(baseUrl);
}

const _getAllGradesUrl = () => 'http://gestion-servicios.ehu.es/pls/entrada/plew0040.htm';
const _getTeachersUrl = (grade) => `https://www.ehu.eus/es/web/estudiosdegrado-gradukoikasketak/${grade}-profesorado`;
const _getTeacherProfileUrl = (grade, id) => {
	const year = (new Date()).getFullYear();
	const month = (new Date()).getMonth();
	return `https://www.ehu.eus/es/web/estudiosdegrado-gradukoikasketak/${grade}-profesorado?p_redirect=consultaTutorias&p_anyo_acad=${(month > 6)?year:(year-1)}0&p_idp=${id}`
};

const _getGradeUrl = (grade, school) => {
	if (!grade || !school)
		throw "Error: Grade and school codes are required. [getGradeUrl]";
	else
		//return `http://www.ehu.eus/es/web/estudiosdegrado-gradukoikasketak/aurtengo-gradu-guztiak?p_p_id=upvehuapp_WAR_upvehuappportlet&p_p_state=normal&p_p_mode=view&p_p_col_id=column-2&p_p_col_pos=0&p_p_col_count=1&p_p_lifecycle=1&_upvehuapp_WAR_upvehuappportlet_action=redirectAction&reu=/pls/entrada/plew0040.htm_siguiente?p_sesion=&p_cod_idioma=CAS&p_en_portal=N&p_anyoAcad=act&p_cod_centro=${school}&p_cod_plan=${grade}&p_menu=intro`
		return `http://gestion-servicios.ehu.es/pls/entrada/plew0040.htm_siguiente?p_sesion=&p_cod_idioma=CAS&p_en_portal=N&p_anyoAcad=act&p_cod_centro=${school}&p_cod_plan=${grade}&p_menu=intro`;
};

const _getGradeSubjectsUrl = (grade, school) => {
	if (!grade || !school)
		throw "Error: Grade and school codes are required. [getGradeSubjectsUrl]";
	else
		//return `http://www.ehu.eus/es/web/estudiosdegrado-gradukoikasketak/aurtengo-gradu-guztiak?p_p_id=upvehuapp_WAR_upvehuappportlet&p_p_state=normal&p_p_mode=view&p_p_col_id=column-2&p_p_col_pos=0&p_p_col_count=1&p_p_lifecycle=1&_upvehuapp_WAR_upvehuappportlet_action=redirectAction&reu=/pls/entrada/plew0040.htm_siguiente?p_sesion=&p_cod_idioma=CAS&p_en_portal=N&p_cod_centro=${school}&p_cod_plan=${grade}&p_anyoAcad=act&p_pestanya=3&p_menu=asig_cursos`
		return `http://gestion-servicios.ehu.es/pls/entrada/plew0040.htm_siguiente?p_sesion=&p_cod_idioma=CAS&p_en_portal=N&p_cod_centro=${school}&p_cod_plan=${grade}&p_anyoAcad=act&p_pestanya=3&p_menu=asig_cursos`;
};

const _getSubjectUrl = (subject, school, grade, course) => {
	if (!subject) throw "Error: Subject code is required. [getSubjectUrl]";
	else if (!school) throw "Error: School code is required. [getSubjectUrl]";
	else if (!grade) throw "Error: Grade code is required. [getSubjectUrl]";
	else if (!course) throw "Error: Course code is required. [getSubjectUrl]";
	else return `http://gestion-servicios.ehu.es/pls/entrada/plew0040.htm_asignatura_next?p_sesion=&p_cod_idioma=CAS&p_en_portal=N&p_cod_centro=${school}&p_cod_plan=${grade}&p_anyoAcad=act&p_pestanya=3&p_menu=principal&p_cod_asig=${subject}&p_ciclo=X&p_curso=${course}&p_vengo_de=asig_cursos`;
	//else return `http://www.ehu.eus/es/web/estudiosdegrado-gradukoikasketak/aurtengo-gradu-guztiak?p_p_id=upvehuapp_WAR_upvehuappportlet&p_p_state=normal&p_p_mode=view&p_p_col_id=column-2&p_p_col_pos=0&p_p_col_count=1&p_p_lifecycle=1&_upvehuapp_WAR_upvehuappportlet_action=redirectAction&reu=/pls/entrada/plew0040.htm_asignatura_next?p_sesion=&p_cod_idioma=CAS&p_en_portal=N&p_cod_centro=${school}&p_cod_plan=${grade}&p_anyoAcad=act&p_pestanya=3&p_menu=principal&p_cod_asig=${subject}&p_ciclo=X&p_curso=${course}&p_vengo_de=asig_cursos`;
};

const _getUrlCode = (str, url) => {
	if (!str || !url) throw "Error: Can't get the code from url, 2 parameters are required";
	const urlCode = url.split(str);
	if(urlCode.length === 0) throw "Error: Code not found [getUrlCode]";
	const code = urlCode[1].split('&')[0]
	return code.substring(1);
};

module.exports = {
	getCampusUrl: _getCampusUrl,
	getAllGradesUrl: _getAllGradesUrl,
	getGradeUrl: _getGradeUrl,
	getGradeSubjectsUrl: _getGradeSubjectsUrl,
	getSubjectUrl : _getSubjectUrl,
	getUrlCode : _getUrlCode,
	getTeachersUrl: _getTeachersUrl,
	getTeacherProfileUrl: _getTeacherProfileUrl
};
