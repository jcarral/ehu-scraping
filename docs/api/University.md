# University

El módulo *University* está compuesto por funciones que devuelven información referente a la UPV-EHU.

```javascript
import { University } from 'ehu-scraping'
```

- [University](#university)
	- [static getDegreesList([data])](#static-getdegreeslistdata-promise)
	- [static getCampus()](#static-getcampus-object)
	- [static getDegreesUrl()](#static-getdegreesurl-string)

---
## Métodos

### static getDegreesList([data])() : Promise
Función estática para obtener la lista de grados de la UPV-EHU. El parámetro `data` es opcional, es un objeto que puede tener cualquiera de los siguientes atributos para filtrar la lista.
```javascript
{
	campus: 'BI',
	school: '226'
}
```
 Si no se introduce ningún parámetro se devuelve la lista completa de grados.
 Los valores que acepta en el campo `campus` son los siguientes:
 ```javascript
 //Bizkaia
 ['BI', 'BIZKAIA', 'BIZ', 'VIZCAYA', 3]
 //Gipuzkoa
 [ 'GI', 'GIPUZKOA', 'GIP', 'GUIPÚZCOA', 'GUIPUZCOA', 2]
 //Araba
 ['AR', 'ARABA', 'ARA', 'ALAVA', 'ÁLAVA', 1]
 ```
 Uso:
 ```javascript
 University.getDegreesList({campus: 'GI'});
 ```
 Respuesta:
 ```javascript
 [
    {
        "code": "263",
        "name": "Escuela de Ingeniería de Gipuzkoa",
        "campus": 2,
        "degrees": [
            {
                "href": "http://gestion-servicios.ehu.es/pls/entrada/plew0040.htm/pls/entrada/plew0040.htm_siguiente?p_sesion=&p_cod_idioma=CAS&p_en_portal=N&p_anyoAcad=act&p_cod_centro=263&p_cod_plan=GDIMEL20&p_menu=intro",
                "name": "Doble Grado en Ingeniería Mecánica e Ingeniería Electrónica Industrial y Automática ",
                "code": "GDIMEL20"
            },
           {...},{
        "code": "215",
        "name": "Facultad de Ciencias Químicas",
        "campus": 2,
        "degrees": [
            {
                "href": "http://gestion-servicios.ehu.es/pls/entrada/plew0040.htm/pls/entrada/plew0040.htm_siguiente?p_sesion=&p_cod_idioma=CAS&p_en_portal=N&p_anyoAcad=act&p_cod_centro=215&p_cod_plan=GQUIMI20&p_menu=intro",
                "name": "Grado en Química ",
                "code": "GQUIMI20"
            }
        ]
    }
]
```

### static getCampus() : [Object]
Devuelve la lista con los campus y sus codigos.

```javascript
University.getCampus();
/*
Respuesta: [
	{
		name: 'BI',
		code: 3
	},{
		name: 'GI',
		code: 2
	},{
		name: 'AR',
		code: 1
	}
];
*/
```

### static getDegreesUrl() : String
Devuelve la url de la página con todos los grados.

```javascript
University.getDegreesUrl();
//Res: 'http://gestion-servicios.ehu.es/pls/entrada/plew0040.htm'
```
