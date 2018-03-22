'use strict';
/**
 * Function to group a list of objects by a given attribute
 * @param {String} key 
 * @param {Array} list List of objects
 */

const _groupBy = (key, list) => {
	let listGrouped = [];
	for(let i = 0; i < list.length; i++){
		//let pos = listGrouped.findIndex(obj => obj.name === list[i][key]);
		let pos = listGrouped.findIndex(obj => objectContains(obj, list[i][key]));
		if (pos >= 0) {
			delete list[i][key];
			listGrouped[pos].grades.push(list[i]);
		}else{
			let newKeyElement = Object.assign({}, list[i][key]);
			//newKeyElement.name = list[i][key];
			newKeyElement.grades = [];
			delete list[i][key];
			newKeyElement.grades.push(list[i]);
			listGrouped.push(newKeyElement);
		}
	}
	return listGrouped;
};

const objectContains = (container, contained) => {
	return Object.keys(contained).every(function (key) {
		return contained[key] === container[key];
	});
};

module.exports = {
	groupBy: _groupBy
};
