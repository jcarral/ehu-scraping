# EHU-UPV Scraping 
[![Build Status](https://travis-ci.org/jcarral/ehu-scraping.svg?branch=master)](https://travis-ci.org/jcarral/ehu-scraping) [![npm version](https://badge.fury.io/js/ehu-scraping.svg)](https://badge.fury.io/js/ehu-scraping)
![Code style](https://camo.githubusercontent.com/1c5c800fbdabc79cfaca8c90dd47022a5b5c7486/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f636f64652532307374796c652d616972626e622d627269676874677265656e2e7376673f7374796c653d666c61742d737175617265)

Libreria para obtener los datos de la web de la universidad EHU-UPV en formato JSON.

### Tabla de contenidos
1. [Primeros pasos](#primeros-pasos)
    1. [Prerequisitos](#prerequisitos)
    2. [Instalación](#instalación)
    3. [Uso](#uso)
2. [API](#api)
3. [Tests](#tests)
4. [Contribución](#contribución)
5. [Autors](#autores)
6. [Licencia](#licencia)

## Primeros pasos
### Prerequisitos

Para poder hacer uso de esta herramienta se necesitan, al menos, los siguientes herramientas:
* [NodeJS > 8.9.4](https://nodejs.org/es/)
* [NPM](http://npmjs.com/) o [Yarn](https://yarnpkg.com/lang/en/)

### Instalación

Se puede utilizar un gestor de paquetes como [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/en/), la versión zip también está disponible.

```
npm i --save ehu-scraping
```
```
yarn add ehu-scraping
```

### Uso

Una vez instalada la librería hay que importarla en el proyecto.
```javascript
import {University, Degree } from 'ehu-scraping';
const { University } = require('ehu-scraping');
```

Luego, basta con utilizar las funciones de los objetos que se han importado. Para más información visitar la documentación extendida.

```javascript
// Lista de grados del campus de Bizkaia
const listaDeGrados = University.getDegreesList({campus: 'BI'}); 

//Asignaturas de la carrera de informatica de la FISS
const gradoInformatica = new Degree('GINFOR20');
const asignaturasInfor = gradoInformatica.getSubjects(); 
```

## API

La lista de funciones disponibles es la siguiente, para más información acceder a la información detallada.

- [University](./docs/api/University.md#university)
	- [static getDegreesList([data])](./docs/api/University.md#static-getdegreeslistdata--promise)
	- [static getCampus()](./docs/api/University.md#static-getcampus--object)
	- [static getDegreesUrl()](./docs/api/University.md#static-getdegreesurl--string)
- [Degree](./docs/api/Degree.md#degree)
	- [getSummary()](./docs/api/Degree.md#getsummary--promise)
	- [getSubjects([course])](./docs/api/Degree.md#getsubjectscourse--promise)
	- [getTeachers()](./docs/api/Degree.md#getteachers--promise)
	- [getURL()](./docs/api/Degree.md#static-geturl--string)
	- [static getName(code)](./docs/api/Degree.md#static-getnamecode--string)
	- [static getCode(codeName)](./docs/api/Degree.md#static-getcodename--string)
	- [code](./docs/api/Degree.md#code--string)
	- [school](./docs/api/Degree.md#school--string)
- [Subject](./docs/api/Subject.md#subject)
	- [getSummary()](./docs/api/Subject.md#getsummary--promise)
	- [getDetail()](./docs/api/Subject.md#getdetail--promise)
	- [getSchedule()](./docs/api/Subject.md#getschedule--promise)
	- [subject](./docs/api/Subject.md#subject--string)
	- [school](./docs/api/Subject.md#school--string)
	- [degree](./docs/api/Subject.md#degree--string)
	- [course](./docs/api/Subject.md#course--string)
- [Teacher](./docs/api/Teacher.md#teacher)
	- [getTutorships()](./docs/api/Teacher.md#gettutorships--promise)
	- [id](./docs/api/Teacher.md#id--string)
	- [degree](./docs/api/Teacher.md#degree--string)


## Tests
Las pruebas se han realizado utilizando las herramientas [mocha](https://mochajs.org/) y [chai](http://chaijs.com/).
Para ejecutar las pruebas hay que utilizar el siguiente comando:
```
npm run test
```

## Contribución

Por favor, ve al fichero [CONTRIBUTING.md](CONTRIBUTING.md) para leer con detalle como contribuir al proyecto.

## Autores

* **Joseba Carral** - *Autor* - [jcarral](https://github.com/jcarral)


## Licencia
Esta librería está bajo la licencia [MIT](./LICENSE.md)
