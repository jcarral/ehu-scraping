class EHUrls {
	constructor(){}
	/**
	 * Returns the url to the page with the list of grades
	 */
	static getAllGrades(){
		return 'http://gestion-servicios.ehu.es/pls/entrada/plew0040.htm';
	}

	/**
	 * Returns the grade's main page url
	 * @param {string} grade Grade code
	 * @param {string} school School code
	 */
	static getGrade(grade, school){
		if (!grade || !school)
			return Promise.reject("Error: Grade and school codes are required. [EHUrls.getGrade]");
		else
			return `http://gestion-servicios.ehu.es/pls/entrada/plew0040.htm_siguiente?p_sesion=&p_cod_idioma=CAS&p_en_portal=N&p_anyoAcad=act&p_cod_centro=${school}&p_cod_plan=${grade}&p_menu=intro`;
	}

	/**
	 * Returns the subjects list page url
	 * @param {string} grade Grade code
	 * @param {string} school School code
	 */
	static getSubjectsPage(grade, school){
		if (!grade || !school)
			return Promise.reject("Error: Grade and school codes are required. [EHUrls.getSubjectsPage]");
		else
			return `http://gestion-servicios.ehu.es/pls/entrada/plew0040.htm_siguiente?p_sesion=&p_cod_idioma=CAS&p_en_portal=N&p_cod_centro=${school}&p_cod_plan=${grade}&p_anyoAcad=act&p_pestanya=3&p_menu=asig_cursos`;

	}

	/**
	 * Return the subject url
	 * @param {string} subject 
	 * @param {string} school 
	 * @param {string} grade 
	 * @param {string} course 
	 */
	static getSubject(subject, school, grade, course){
		if (!subject) return Promise.reject("Error: Subject code is required. [EHUrls.getSubject]");
		else if (!school) return Promise.reject("Error: School code is required. [EHUrls.getSubject]");
		else if (!grade) return Promise.reject("Error: Grade code is required. [EHUrls.getSubject]");
		else if (!course) return Promise.reject("Error: Course code is required. [EHUrls.getSubject]");
		else return `http://gestion-servicios.ehu.es/pls/entrada/plew0040.htm_asignatura_next?p_sesion=&p_cod_idioma=CAS&p_en_portal=N&p_cod_centro=${school}&p_cod_plan=${grade}&p_anyoAcad=act&p_pestanya=3&p_menu=principal&p_cod_asig=${subject}&p_ciclo=X&p_curso=${course}&p_vengo_de=asig_cursos`;
	}

	/**
	 * Returns the teacher list url
	 * @param {string} gradeName Grade full name
	 */
	static getTeacherList(gradeName){
		return `https://www.ehu.eus/es/web/estudiosdegrado-gradukoikasketak/${grade}-profesorado`;
	}

	/**
	 * Return the teacher's profile url
	 * @param {string} grade 
	 * @param {string} id 
	 */
	static getTeacherProfile(grade, id){
		const year = (new Date()).getFullYear();
		const month = (new Date()).getMonth();
		return `https://www.ehu.eus/es/web/estudiosdegrado-gradukoikasketak/${grade}-profesorado?p_redirect=consultaTutorias&p_anyo_acad=${(month > 6) ? year : (year - 1)}0&p_idp=${id}`
	}
}


module.exports = EHUrls;
