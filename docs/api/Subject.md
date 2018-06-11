# Subject
Este módulo devuelve toda la información relacionada con una asignatura.

```javascript
import { Subject } from 'ehu-scraping';

//Asignatura de gestión de proyectos de 3º de ingenieria informatica de la FISS
const gestion = new Subject('25987', 'GINFOR20', '3');
```
El constructor de la asignatura recibe el código de la asignatura, el código del grado y el curso de la misma.
El curso puede tomar cualquiera de los siguientes valores: `['1', '2', '3', '4', '5', 'X' ]`:

- [Subject](#subject)
	- [getSummary()](#getsummary--promise)
	- [getDetail()](#getdetail--promise)
	- [getSchedule()](#getschedule--promise)
	- [subject](#subject--string)
	- [school](#school--string)
	- [degree](#degree--string)
	- [course](#course--string)

---
## Métodos

### getSummary() : Promise

Función que devuelve el resumen con la información básica de la asignatura.

```javascript
gestion.getSummary().then(res => ...).catch(err => ...)
```
Respuesta:
```javascript
{
    "name": "Gestión de Proyectos",
    "code": "25987",
    "school": {
        "code": "226",
        "name": "Facultad de Informática"
    },
    "degree": {
        "code": "GINFOR20",
        "name": "Grado en Ingeniería Informática"
    },
    "teachers": [
        {
            "name": "BANCO ARBE, JOSE MANUEL",
            "code_school": "226",
            "code_degree": "GINFOR20",
            "id_teacher": "4150",
            "dep_teacher": "141",
            "code_area": "0570",
            "languages": []
        },{...}
    ],
    "languages": [],
    "year": "2017/18",
    "course": "3",
    "departament": "",
    "credits": "6",
    "href": "http://gestion-servicios.ehu.es/pls/entrada/plew0040.htm_asignatura_next?p_sesion=&p_cod_idioma=CAS&p_en_portal=N&p_cod_centro=226&p_cod_plan=GINFOR20&p_anyoAcad=act&p_pestanya=3&p_menu=principal&p_cod_asig=25987&p_ciclo=X&p_curso=3&p_vengo_de=asig_cursos"
}
```

### getDetail() : Promise

Función para obtener la información detalla de la asignatura, descripción, temario, bibliografía, evaluación, ...

```javascript
gestion.getDetail().then(res => ...).catch(err => ...)
```
Respuesta: 
```javascript
{
    "name": "Gestión de Proyectos",
    "bibliography": [
        "Guía de los Fundamentos de la Dirección de Proyectos (Guía del PMBOK®), 5ª edición, PMI, 2014",
        "Software extension to the PMBOK Guide Fifth Edition, PMI, 2013",
        ...
    ],
    "school": "Facultad de Informática",
    "degree": "Grado en Ingeniería Informática",
    "course": "2017/18",
    "year": "3",
    "description": "La asignatura corresponde al ámbito de la Gestión de Proyectos Informáticos, tiene asignada seis créditos y se imparte en el tercer curso del Grado en Ingeniería Informática.La formación específica en Gestión de Proyectos en las titulaciones universitarias en informática aparece, con carácter general, a mediados de la década de los noventa, con motivo de la transformación de los planes estudio de Licenciatura en Informática a las ingenierías. ...",
    "competences": "En forma resumida, se pretende que el estudiante sea capaz de:Identificar las principales etapas, actividades y roles relacionados con la planificación, seguimiento y control de proyectos. (RI2, RI4, C2, C12)Identificar y poner en práctica habilidades de estimación y planificación, aplicando experiencias y conocimientos previos. ...",
    "observation": "http://www.aenui.net/jenui2014/55.pdfhttp://www.aenui.net/jenui2014/54.pdf"
}
```

### getSchedule() : Promise

Función para obtener el horario de la asignatura.
El horario esta compuesto por los grupos de la asignatura, donde cada uno tiene su codigo y horario con sus profesores.

```javascript
gestion.getSchedule().then(res => ...).catch(err => ...);
```
Respuesta:

```javascript
{
    "groups": [
        {
            "code": "01",
            "schedule": [
                {
                    "weeks": "16-30",
                    "monday": [
                        {
                            "type": "M",
                            "hours": "12:30-14:00"
                        }
                    ],
                    "tuesday": [],
                    "wednesday": [],
                    "thursday": [
                        {
                            "type": "GA",
                            "hours": "09:00-10:30"
                        }
                    ],
                    "friday": [
                        {
                            "type": "M",
                            "hours": "10:45-12:15"
                        }
                    ]
                },
                {
                    "weeks": "18-32",
                    "monday": [],
                    "tuesday": [],
                    "wednesday": [],
                    "thursday": [
                        {
                            "type": "GA",
                            "hours": "09:00-10:30"
                        }
                    ],
                    "friday": []
                }
            ],
            "teachers": [
                {
                    "name": "BANCO ARBE, JOSE MANUEL",
                    "code_school": "226",
                    "code_degree": "GINFOR20",
                    "id_teacher": "4150",
                    "dep_teacher": "141",
                    "code_area": "0570",
                    "languages": []
                },
                {
                    "name": "PEREZ FERNANDEZ, LUIS",
                    "code_school": "226",
                    "code_degree": "GINFOR20",
                    "id_teacher": "3397",
                    "dep_teacher": "141",
                    "code_area": "0570",
                    "languages": []
                }
            ]
        }, {...}
        
    ]
}
```

### subject : String
Atributo del objeto que permite ver y modificar el codigo de la asignatura.
```javascript
const asig = gestion.subject; //25987
asig.subject = '12345';
```

### degree : String
Atributo del objeto que permite ver y modificar el codigo del grado.

```javascript
const deg = gestion.degree; //'GINFOR20
deg.degree = 'GINFAN10';
```
### course : String
Atributo del objeto que permite ver y modificar el curso de la asignatura.

```javascript
const curso = gestion.course; //'3'
deg.course = 'X';

```
### school : String
Atributo del objeto que permite ver la facultad a la que pertenece la asignatura.

```javascript
const facultad = gestion.school; //'226'
```
