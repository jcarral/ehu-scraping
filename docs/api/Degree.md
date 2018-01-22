# Degree

- [Degree](#degree)
	- [getSummary()](#getsummary--promise)
	- [getSubjects([course])](#getsubjectscourse--promise)
	- [getTeachers()](#getteachers--promise)
	- [getURL()](#static-geturl--string)
	- [static getName(code)](#static-getnamecode--string)
	- [static getCode(codeName)](#static-getcodename--string)
	- [code](#code--string)
	- [school](#school--string)

El objeto grado esta compuesto por dos atributos, el código del grado  Se pueden consultar estos datos en la [tabla de equivalencias](./Equivalencias.md).

```javascript
const informaticaFISS = new Grade('GINFOR20');
```

---
 ## Métodos

 ### getSummary() : Promise
 Función para obtener el resumen del grado. Devuelve una promesa con el un objeto JSON con la información o un mensaje de error en caso fallido.

 ```javascript
 // Resumen de la facultad de informática de San Sebastian.
 informaticaFISS.getSummary().then(res => {...}).catch(err => console.log(err));
 ```

Respuesta: 
```javascript
{
    name: 'Grado en Ingeniería Informática - 2017/18',
    href: 'http://gestion-servicios.ehu.es/pls/entrada/plew0040.htm_siguiente?p_sesion=&p_cod_idioma=CAS&p_en_portal=N&p_anyoAcad=act&p_cod_centro=226&p_cod_plan=GINFOR20&p_menu=intro',
    summary: 'El Grado en Ingeniería Informática te ofrece un inmenso campo para el estudio, la investigación y la innovación. Las Nuevas Tecnologías de la Información y la Comunicación están hoy en día presentes en todos los ámbitos de nuestra vida cotidiana. En este grado podrás profundizar en áreas tan apasionantes como la inteligencia artificial, la robótica, el procesamiento del lenguaje natural, el procesamiento digital de imagen y sonido, las comunicaciones multimedia, etc. Todo esto lo podrás averiguar en el Grado de Ingeniería Informática. Y además podrás especializarte en Computación, Ingeniería de Computadores o Ingeniería del Software. También, te  formarás para trabajar de manera autónoma o integrada en equipos multidisciplinares.',
    'minimum-degree': '9,83',
    school: { name: 'Facultad de Informática', code: '226' },
    contact:
        {
            name: ' NEREA PEREZ',
            email: ' nerea@ehu.eus',
            address: '',
            phone: ' 943018123'
        }
};
```

### getSubjects([course]) : Promise
Devuelve la lista de asignaturas que tiene ese grado. El parámetro `course` es opcional y puede tomar cualquiera de los siguientes valores : `['1', '2', '3', '4', '5', 'X' ]`.
La respuesta es una promesa que en caso de exito devuelve el objeto con los datos.

```javascript
//Lista de asignaturas del segundo año de la facultad de informatica
informaticaFISS.getSubjests('2').then(res => ...).catch(err => ...);
```

Respuesta:
```json
[
    {
        "course": "2",
        "subjects": [
            {
                "name": "Arquitectura de Computadores",
                "href": "https://www.ehu.eus/pls/entrada/plew0040.htm_asignatura_next?p_sesion=&p_cod_idioma=CAS&p_en_portal=N&p_cod_centro=226&p_cod_plan=GINFOR20&p_anyoAcad=act&p_pestanya=3&p_menu=principal&p_cod_asig=26018&p_ciclo=X&p_curso=2&p_vengo_de=asig_cursos",
                "code": "26018",
                "term": "Cuatrimestre 1",
                "credits": "6",
                "languages": [
                    "es",
                    "eu",
                    "en"
                ]
            },{...},{
                "name": "Lenguajes, Computación y Sistemas Inteligentes",
                "href": "https://www.ehu.eus/pls/entrada/plew0040.htm_asignatura_next?p_sesion=&p_cod_idioma=CAS&p_en_portal=N&p_cod_centro=226&p_cod_plan=GINFOR20&p_anyoAcad=act&p_pestanya=3&p_menu=principal&p_cod_asig=26021&p_ciclo=X&p_curso=2&p_vengo_de=asig_cursos",
                "code": "26021",
                "term": "Cuatrimestre 1",
                "credits": "6",
                "languages": [
                    "es",
                    "eu",
                    "en"
                ]
            }
        ]
    }
]
```

### getTeachers() : Promise
Devuelve una lista con todos los profesores que imparten clases en el grado.

```javascript
informaticaFISS.getTeachers().then(res=> ...).catch(err => ...);
```

Respuesta:

```json
{
    "degree": "GINFOR20",
    "teachers": [
        {
            "name": "SALINAS GONZALEZ, JULIO",
            "href": "https://www.ehu.eus/es/web/estudiosdegrado-gradukoikasketak/GINFOR20-profesorado?p_redirect=consultaTutorias&p_anyo_acad=20170&p_idp=1879",
            "id": "1879",
            "email": " julio.salinas@ehu.eus"
        },{...},{
            "name": "ZUBIZARRETA DIEZ, RAMON",
            "href": "https://www.ehu.eus/es/web/estudiosdegrado-gradukoikasketak/GINFOR20-profesorado?p_redirect=consultaTutorias&p_anyo_acad=20170&p_idp=5341",
            "id": "5341",
            "email": " ramon.zubizarreta@ehu.eus"
        }
    ]
}
```
### static getURL() : String
Devuelve la URL del grado.
```javascript
informatica.getURL();
```

### static getName(code) : String
Devuelve el nombre el nombre del grado asociado a un grado.
Se puede consultar todos los nombres en la [tabla de equivalencias.](./Equivalencias.md)

```javascript
Degree.getName('GINFOR20');
// Respuesta: grado-ingenieria-informatica
```

### static getCode(name) : String
Dado un grado devuelve el codigo del mismo.

```javascript
Degree.getCode('grado-ingenieria-informatica');
// Respuesta: GINFOR20
```

### code : String
Devuelve el valor del codigo del grado.
```javascript
const facultad = informaticaFISS.code;
//facultad : 'GINFOR20'
informaticaFISS.code = 'GINFAN30';

```

### school : String
Devuelve el valor del código de la escuela/facultad del grado.
```javascript
const facultad = informaticaFISS.school;
//facultad : '226'
```
