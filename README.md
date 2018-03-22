# EHU-UPV Scraping 
[![Build Status](https://travis-ci.org/jcarral/ehu-scraping.svg?branch=master)](https://travis-ci.org/jcarral/ehu-scraping) [![npm version](https://badge.fury.io/js/ehu-scraping.svg)](https://badge.fury.io/js/ehu-scraping)

Libreria para obtener los datos de la web de la universidad EHU-UPV en formato JSON.

### Tabla de contenidos
- [Instalación](#instalacion)
- [Utilización](#utilizacion)
- [Documentacion](#documentacion)
- [Tests](#tests)
- [Licencia](#licencia)

---

## Instalación

Se puede utilizar un gestor de paquetes como [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/en/), la versión zip también está disponible.

```
npm i --save ehu-scraping
```
```
yarn add ehu-scraping
```

## Utilización

Una vez instalada la librería hay que importarla en el proyecto.
```javascript
import {University, Grade } from 'ehu-scraping';
const { University } = require('ehu-scraping');
```

Luego, basta con utilizar las funciones de los objetos que se han importado. Para más información visitar la documentación extendida.

```javascript
// Lista de grados del campus de Bizkaia
const listaDeGrados = University.getGradesList({campus: 'BI'}); 

//Asignaturas de la carrera de informatica de la FISS
const gradoInformatica = new Grade('GINFOR20');
const asignaturasInfor = gradoInformatica.getSubjects(); 
```

## Documentación

La lista de funciones disponibles es la siguiente, para más información acceder a la información detallada.

- [University](./docs/api/University.md#university)
	- [static getGradesList([data])](./docs/api/University.md#static-getgradeslistdata--promise)
	- [static getCampus()](./docs/api/University.md#static-getcampus--object)
	- [static getGradesUrl()](./docs/api/University.md#static-getgradesurl--string)
- [Grade](./docs/api/Grade.md#grade)
	- [getSummary()](./docs/api/Grade.md#getsummary--promise)
	- [getSubjects([course])](./docs/api/Grade.md#getsubjectscourse--promise)
	- [getTeachers()](./docs/api/Grade.md#getteachers--promise)
	- [getURL()](./docs/api/Grade.md#static-geturl--string)
	- [static getName(code)](./docs/api/Grade.md#static-getnamecode--string)
	- [static getCode(codeName)](./docs/api/Grade.md#static-getcodename--string)
	- [code](./docs/api/Grade.md#code--string)
	- [school](./docs/api/Grade.md#school--string)
- [Subject](./docs/api/Subject.md#subject)
	- [getSummary()](./docs/api/Subject.md#getsummary--promise)
	- [getDetail()](./docs/api/Subject.md#getdetail--promise)
	- [getSchedule()](./docs/api/Subject.md#getschedule--promise)
	- [subject](./docs/api/Subject.md#subject--string)
	- [school](./docs/api/Subject.md#school--string)
	- [grade](./docs/api/Subject.md#grade--string)
	- [course](./docs/api/Subject.md#course--string)
- [Teacher](./docs/api/Teacher.md#teacher)
	- [getTutorships()](./docs/api/Teacher.md#gettutorships--promise)
	- [id](./docs/api/Teacher.md#id--string)
	- [grade](./docs/api/Teacher.md#grade--string)


## Tests
Las pruebas se han realizado utilizando las herramientas [mocha](https://mochajs.org/) y [chai](http://chaijs.com/).
Para ejecutar las pruebas hay que utilizar el siguiente comando:
```
npm run test
```

## Licencia
Esta librería está bajo la licencia [ISC](./LICENSE.md)
