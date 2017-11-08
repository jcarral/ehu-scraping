"use strict";

const {valToCampus} = require('./formats');

const getCampusUrl = (code) => {
  const campus = valToCampus(code);
  const baseUrl = `http://www.ehu.eus/es/web/vicer.grado-innovacion/aurtengo-graduak-campus-ikastegia?p_p_id=upvehuapp_WAR_upvehuappportlet&p_p_state=normal&p_p_mode=view&p_p_col_id=column-2&p_p_col_pos=0&p_p_col_count=1&p_p_lifecycle=1&_upvehuapp_WAR_upvehuappportlet_action=redirectAction&reu=/pls/entrada/plew0040.htm?p_sesion=&p_cod_idioma=CAS&p_en_portal=N&p_titu_nuevas=S&p_opcion=2&p_anyoAcad=act&p_campus=${campus}&p_rama=&p_ciclo=`;
  return Promise.resolve(baseUrl);
}

const getAllGradesUrl = () => 'http://www.ehu.eus/es/web/estudiosdegrado-gradukoikasketak/aurtengo-gradu-guztiak';

const getGradeUrl = (grade, school) => {
  if (!grade || !school)
    throw "Error: Grade and school codes are required. [getGradeUrl]";
  else
    return `http://www.ehu.eus/es/web/estudiosdegrado-gradukoikasketak/aurtengo-gradu-guztiak?p_p_id=upvehuapp_WAR_upvehuappportlet&p_p_state=normal&p_p_mode=view&p_p_col_id=column-2&p_p_col_pos=0&p_p_col_count=1&p_p_lifecycle=1&_upvehuapp_WAR_upvehuappportlet_action=redirectAction&reu=/pls/entrada/plew0040.htm_siguiente?p_sesion=&p_cod_idioma=CAS&p_en_portal=N&p_anyoAcad=act&p_cod_centro=${school}&p_cod_plan=${grade}&p_menu=intro`
};

const getGradeSubjectsUrl = (grade, school) => {
  if (!grade || !school)
    throw "Error: Grade and school codes are required. [getGradeSubjectsUrl]";
  else
    return `http://www.ehu.eus/es/web/estudiosdegrado-gradukoikasketak/aurtengo-gradu-guztiak?p_p_id=upvehuapp_WAR_upvehuappportlet&p_p_state=normal&p_p_mode=view&p_p_col_id=column-2&p_p_col_pos=0&p_p_col_count=1&p_p_lifecycle=1&_upvehuapp_WAR_upvehuappportlet_action=redirectAction&reu=/pls/entrada/plew0040.htm_siguiente?p_sesion=&p_cod_idioma=CAS&p_en_portal=N&p_cod_centro=${school}&p_cod_plan=${grade}&p_anyoAcad=act&p_pestanya=3&p_menu=asig_cursos`
};

module.exports = {
  getCampusUrl: getCampusUrl,
  getAllGradesUrl: getAllGradesUrl,
  getGradeUrl: getGradeUrl,
  getGradeSubjectsUrl: getGradeSubjectsUrl
}
