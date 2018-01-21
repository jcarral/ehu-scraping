class EHUrls {
	constructor(){}
	/**
	 * Returns the url to the page with the list of degrees
	 */
	static getAllDegrees(){
		return 'http://gestion-servicios.ehu.es/pls/entrada/plew0040.htm';
	}

	/**
	 * Returns the degree's main page url
	 * @param {string} degree Degree code
	 * @param {string} school School code
	 */
	static getDegree(degree, school){
		if (!degree || !school)
			throw new Error("Error: Degree and school codes are required. [EHUrls.getDegree]");
		else
			return `http://gestion-servicios.ehu.es/pls/entrada/plew0040.htm_siguiente?p_sesion=&p_cod_idioma=CAS&p_en_portal=N&p_anyoAcad=act&p_cod_centro=${school}&p_cod_plan=${degree}&p_menu=intro`;
	}

	/**
	 * Returns the subjects list page url
	 * @param {string} degree Degree code
	 * @param {string} school School code
	 */
	static getSubjectsPage(degree, school){
		if (!degree || !school)
			throw new Error("Error: Degree and school codes are required. [EHUrls.getSubjectsPage]");
		else
			return `http://gestion-servicios.ehu.es/pls/entrada/plew0040.htm_siguiente?p_sesion=&p_cod_idioma=CAS&p_en_portal=N&p_cod_centro=${school}&p_cod_plan=${degree}&p_anyoAcad=act&p_pestanya=3&p_menu=asig_cursos`;

	}

	/**
	 * Return the subject url
	 * @param {string} subject 
	 * @param {string} school 
	 * @param {string} degree 
	 * @param {string} course 
	 */
	static getSubject(subject, school, degree, course){
		if (!subject) throw new Error("Error: Subject code is required. [EHUrls.getSubject]");
		else if (!school) throw new Error("Error: School code is required. [EHUrls.getSubject]");
		else if (!degree) throw new Error("Error: Degree code is required. [EHUrls.getSubject]");
		else if (!course) throw new Error("Error: Course code is required. [EHUrls.getSubject]");
		else return `http://gestion-servicios.ehu.es/pls/entrada/plew0040.htm_asignatura_next?p_sesion=&p_cod_idioma=CAS&p_en_portal=N&p_cod_centro=${school}&p_cod_plan=${degree}&p_anyoAcad=act&p_pestanya=3&p_menu=principal&p_cod_asig=${subject}&p_ciclo=X&p_curso=${course}&p_vengo_de=asig_cursos`;
	}

	/**
	 * Returns the teacher list url
	 * @param {string} gradeName Degree full name
	 */
	static getTeacherList(gradeName){
		return `https://www.ehu.eus/es/web/estudiosdegrado-gradukoikasketak/${gradeName}-profesorado`;
	}

	/**
	 * Return the teacher's profile url
	 * @param {string} degree 
	 * @param {string} id 
	 */
	static getTeacherProfile(degree, id){
		const year = (new Date()).getFullYear();
		const month = (new Date()).getMonth();
		return `https://www.ehu.eus/es/web/estudiosdegrado-gradukoikasketak/${degree}-profesorado?p_redirect=consultaTutorias&p_anyo_acad=${(month > 6) ? year : (year - 1)}0&p_idp=${id}`
	}
}


module.exports = EHUrls;
