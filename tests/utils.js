const chai = require('chai');
const { expect, assert, should } = chai;
const chaiAsPromised = require('chai-as-promised');

const { groupBy } = require('../utils/util');

describe('GroupBy:', () => {
	it('should return an grouped by the name of grade', () => {
		const groupedData = groupBy('school', fakeData);
		expect(groupedData).to.deep.have.same.members(fakeDataGrouped);
		});
});

const sortArrayByName = (a, b) => a.name > b.name;

const fakeData = [
	{
		school: {
			name: "aute exercitation"
		},
		name: "dolor ea quis adipisicing eu"
	},
	{
		school: {
			name: "cillum dolor nulla labore"
		},
		name: 'non in'
	},
	{
		school: {
			name: "aute exercitation"
		},
		name: "Ut adipisicing Excepteur"
	},
	{
		school: {
			name: "officia et nostrud nulla"
		},
		name: "elit"
	},
	{
		school: {
			name: "cillum dolor nulla labore"
		},
		name: 'nostrud amet exercitation anim minim'
	},
	{
		school: {
			name: "officia et nostrud nulla"
		},
		name: "aliqua sunt cupi"
	},
];


const fakeDataGrouped = [
	{
		"name": "aute exercitation",
		"grades": [
			{
				"name": "dolor ea quis adipisicing eu"
			},
			{
				"name": "Ut adipisicing Excepteur"
			}
		]
	},
	{
		"name": "cillum dolor nulla labore",
		"grades": [
			{
				"name": "non in"
			},
			{
				"name": "nostrud amet exercitation anim minim"
			}
		]
	},
	{
		"name": "officia et nostrud nulla",
		"grades": [
			{
				"name": "elit"
			},
			{
				"name": "aliqua sunt cupi"
			}
		]
	}
];
