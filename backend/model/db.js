var mongoose = require("mongoose");
// local database uri: 'mongodb://localhost:27017/urbanNeighbourhood'
const mongo=mongoose.connect('mongodb://basic:chargerHPl1908w@3.13.14.21:27017/urbanNeighbourhood2',{ useNewUrlParser: true }
,(err,res)=>{
if(err) throw err;
console.log("Connected to database 1");
});
var schema = mongoose.Schema;
var parcelDataSchema = new schema({},{collection:'cuyahoga_test'});

let citydataSchema = new schema({view: String, city: String, data: Array}, {collection: 'cuyahoga_cities'});



/*
{collection:'cuyahoga'});
var quotesDataSchema = new schema({
    PAR_CITY:{type: String, required:true},
    PARCELPIN: String,
    //geometry:Object
},
{collection:'cuyahoga'});*/

let parcelDataModel =  mongoose.model('cuyahoga_test',parcelDataSchema);
let cityDataModel = mongoose.model('cuyahoga_cities', citydataSchema);
module.exports = {
    parcelDataModel,
    cityDataModel
}
