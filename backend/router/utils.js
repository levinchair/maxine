var upperCase = require('upper-case');

function createQuery(param, hood){
    //param could be an array or string
    query = {};
    if(param === undefined) throw new Error("Please Specify array of Parcels or a city (undefined)");
    try{
      console.log("here is the passed argument: " + param + ", attempting to parse...");
      paramParsed = JSON.parse(param); //this will throw an error and exit if not possible to parse to JSON
    }catch(e){ //if cannot parse to json, then assume it is a name of a city
      paramParsed = upperCase(param);
      console.log("Unable to parse, default to city. Parse Error: " + JSON.stringify(e));  
    }
    if(Array.isArray(paramParsed)) {
      query = { 
        "properties.parcelpin": { $in: paramParsed }
      }
    }else{
      if(typeof paramParsed === "object") JSON.stringify(paramParsed); // make sure we are not passing an object
      query = {
        "properties.par_city": paramParsed
      }
      if(hood !== undefined){
        Object.defineProperty(query, "properties.SPA_NAME", { value : hood, enumerable : true });       
      }
    }
    return query;
  }


  module.exports = { createQuery };