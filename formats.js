"use strict";

const campusValue = (str) => {
  str = str.toUpperCase();
  switch (str) {
    case "BI" || "BIZKAIA" || "BIZ" || "VIZCAYA":
      return 3;
    case "AR" || "ARABA" || "ARA" || "ALAVA":
      return 1;
    case "GI" || "GIPUZKOA" || "GIP" || "GUIPÚZCOA" || "GUIPUZCOA":
      return 2;
    default:
      return Promise.reject("Error: Invalid campus");
  }
};


module.exports = {
  valToCampus : campusValue
}
