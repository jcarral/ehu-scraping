"use strict";

const request = require('request');

const getDataFromWeb = (url) => new Promise((resolve, reject) => {
  if(url.length === 0) return reject("Error: Invalid url. [getDataFromWeb]");
  request(url, (err, res, body) => {
    if (err) return reject(`Err: ${err}. [getDataFromWeb]`);
    return resolve(body);
  });
});

module.exports = {
  getDataFromWeb : getDataFromWeb
}
