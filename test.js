const {getGradesByCampus} = require('./');
/*
getGradesByCampus("AR");
getGradesByCampus("");

getGradesByCampus("BI", (err, res) => {
  if(err) console.log('Err0'+err);
  else console.log('aaa'+res);
});*/

// getGradesByCampus("", (res) => {
//   console.log("Bla: " + res);
// });

getGradesByCampus("BI")
  .then(res => console.log(JSON.stringify(res)))
  .catch(err => console.error('err' + err));
