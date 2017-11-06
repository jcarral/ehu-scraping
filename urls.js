"use strict";

const { valToCampus } = require('./formats');

const getCampusUrl = (code) => {
  console.log(code);
  const campus = valToCampus(code);
  const baseUrl = `http://www.ehu.eus/es/web/vicer.grado-innovacion/aurtengo-graduak-campus-ikastegia?p_p_id=upvehuapp_WAR_upvehuappportlet&p_p_state=normal&p_p_mode=view&p_p_col_id=column-2&p_p_col_pos=0&p_p_col_count=1&p_p_lifecycle=1&_upvehuapp_WAR_upvehuappportlet_action=redirectAction&reu=/pls/entrada/plew0040.htm?p_sesion=&p_cod_idioma=CAS&p_en_portal=N&p_titu_nuevas=S&p_opcion=2&p_anyoAcad=act&p_campus=${campus}&p_rama=&p_ciclo=`;
  return Promise.resolve(baseUrl);
}

module.exports = {
  getCampusUrl : getCampusUrl
}
