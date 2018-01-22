# Teacher
Módulo correspondiente a la clase *Teacher* donde se puede obtener toda la información referente a un profesor de la universidad.

```javascript
import { Teacher } from 'ehu-scraping';

const prof = new Teacher('4150', 'GINFOR20');
```

Un profesor esta caracterizado por su id y el grado sobre el que se pretende consultar su información. Dado que un profesor puede impartir clases en diferentes grados se especifica de cual es el que se quiere obtener la información.

- [Teacher](#teacher)
	- [getTutorships()](#gettutorships-promise)
	- [id](#id-string)
	- [degree](#degree-string)

---
## Métodos

### getTutorships() : Promise

Función para obtener los horarios de las tutorias del docente. Las tutorias estan compuestas por el lugar, hora de inicio y hora de fin.
Además, se muestra la información básica de este profesor.

```javascript
prof.getTutorships().then(res => ...).catch(err => ...);
```

Respuesta:
```javascript
{
    "degree": {
        "name": "grado-ingenieria-informatica",
        "code": "GINFOR20"
    },
    "category": "Profesorado Titular De Universidad (Doctor)",
    "departament": "Lenguajes y Sistemas InformÃ¡ticos",
    "email": "josemiguel.blanco@ehu.eus",
    "area": "Lenguajes y Sistemas InformÃ¡ticos",
    "id": "4150",
    "name": "BLANCO ARBE, JOSE MIGUEL",
    "href": "https://www.ehu.eus/es/web/estudiosdegrado-gradukoikasketak/grado-ingenieria-informatica-profesorado?p_redirect=consultaTutorias&p_anyo_acad=20170&p_idp=4150",
    "schedule": [
        {
            "place": "Facultad De InformÃ¡tica Despacho Del Profesor O Profesora - 234",
            "date-start": "2017-09-11T17:15",
            "date-end": "2017-09-11T19:15"
        },{..},{
            "place": "Facultad De InformÃ¡tica Despacho Del Profesor O Profesora - 234",
            "date-start": "2018-07-26T15:30",
            "date-end": "2018-07-26T18:30"
        }
    ]
}
```

### id : String
Atributo del objeto que permite ver y modificar el codigo del profesor.

```javascript
const idProf = prof.id; //'4150'
idProf.id = '1234';
```
### degree : String
Atributo del objeto que permite ver y modificar el codigo del grado.

```javascript
const deg = prof.degree; //'GINFOR20
deg.degree = 'GINFAN10';
```
