# TESTS

Para los tests se utilizan las librerías [mocha](https://mochajs.org/) y [chai](http://chaijs.com/).

Todos los tests se realizan en el directorio `/tests/`. Cada clase de la librería tiene su propio fichero con pruebas. El resto, las utilidades, se hacen sobre el fichero `utils.js`.

## Ejemplo

```javascript
describe('getSummary: ', () => {
	it('should return an error, parameters required', () => {
		return expect(new Degree().getSummary()).to.be.rejected;
	});

	it('should return an error, school code required', function() {
		return expect(new Degree('GINFOR30').getSummary()).to.be.rejected;
	});

	it('should return an object with all the attributes', () => {
		const sociologia = new Degree('GESOCI30', '354');
		return sociologia.getSummary()
			.then(res => {
				expect(res).to.be.an('object');
				expect(res).to.have.property('name');
				expect(res).to.have.property('href');
				expect(res).to.have.property('summary');
				expect(res).to.have.property('minimum-degree');
				expect(res).to.have.property('contact');
				expect(res.contact).to.be.an('object');
				expect(res.contact).to.have.property('address');
				expect(res.contact).to.have.property('phone');
				expect(res.contact).to.have.property('email'); //Optional
				expect(res).to.have.property('school');
				expect(res.school).to.be.an('object');
				expect(res.school).to.have.property('name');
				expect(res.school).to.have.property('code');
			});
	});
});

```
