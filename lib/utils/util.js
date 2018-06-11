const objectContains = (container, contained) =>
  Object.keys(contained).every(key => contained[key] === container[key]);

/**
 * Function to group a list of objects by a given attribute
 * @param {String} key
 * @param {Array} list List of objects
 */

const _groupBy = (key, list) => {
  const listGrouped = [];
  for (let i = 0; i < list.length; i++) {
    // let pos = listGrouped.findIndex(obj => obj.name === list[i][key]);
    const pos = listGrouped.findIndex(obj => objectContains(obj, list[i][key]));
    if (pos >= 0) {
      delete list[i][key];
      listGrouped[pos].degrees.push(list[i]);
    } else {
      const newKeyElement = Object.assign({}, list[i][key]);
      // newKeyElement.name = list[i][key];
      newKeyElement.degrees = [];
      delete list[i][key];
      newKeyElement.degrees.push(list[i]);
      listGrouped.push(newKeyElement);
    }
  }
  return listGrouped;
};

module.exports = {
  groupBy: _groupBy,
};
