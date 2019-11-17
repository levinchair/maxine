var mongoose = require("mongoose");
// local database uri: 'mongodb://localhost:27017/urbanNeighbourhood'
const mongo=mongoose.connect('mongodb://basic:chargerHPl1908w@3.13.14.21:27017/urbanNeighbourhood2',{ useNewUrlParser: true }
,(err,res)=>{
if(err) throw err;
console.log("Connected to database 1");
});

var schema = mongoose.Schema;
var parcelDataSchema = new schema({},{collection:'cuyahoga_test'});
let cityBoundsSchema = new schema({view: String, city: String, data: Array}, {collection: 'cuyahoga_cities'});
let xwalkdataSchema = new schema({}, {collection: 'xwalk_full_lodes'});
let neighborhoodBoundariesSchema = new schema({}, {collection: "cleveland_spa"});

/*
{collection:'cuyahoga'});
var quotesDataSchema = new schema({
    PAR_CITY:{type: String, required:true},
    PARCELPIN: String,
    //geometry:Object
},
{collection:'cuyahoga'});*/

let parcelDataModel =  mongoose.model('cuyahoga_test',parcelDataSchema);
let cityBoundsModel = mongoose.model('cuyahoga_cities', cityBoundsSchema);
let xwalkdataModel = mongoose.model('xwalk_full_lodes', xwalkdataSchema);
let neighborhoodBoundariesModel = mongoose.model('cleveland_spa', neighborhoodBoundariesSchema);

module.exports = {
    mongoose,
    parcelDataModel,
    cityBoundsModel,
    xwalkdataModel,
    neighborhoodBoundariesModel
}
