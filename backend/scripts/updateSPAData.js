/* 
This program will need to be run using node js. This will take an array of geojson data (already serialized onto
 disk )and replace an existing collection with new geojson data. 

 Usage: node updatecollection.js <location of .geojson file> <name of collection to update in database urbanNeighbourhood2>

 it will run the command replaceOne for each of the files in the database, by filter of "properties.parcelpin". 
 If no parcelpin, then it will insert a new document.

 Default collection is cuyahoga_test, which we currently use 7/15/19
*/

var mongoose = require("mongoose"), 
    es = require('event-stream'),
    fs = require("fs"),
    JSONStream = require('JSONStream');

console.log(process.argv[2]);
var filename = process.argv[2];
var argCollection = process.argv[3];
//if(filename === undefined) throw new Error("Please pass filepath as argument");
if(argCollection === undefined) argCollection = "cuyahoga_cities"

console.log("\n *STARTING* \n");
// Get content from file
//make connection to the data base
// local database uri: 'mongodb://localhost:27017/urbanNeighbourhood'
mongoose.connect('mongodb://peter:laptopbottlekey@3.13.14.21:27017/urbanNeighbourhood2',
{ useNewUrlParser: true }, (err, db) => {
    if(err) //console.log("Connection to DB Error: " + err);
        throw new Error(err);
    else{
        console.log("connected to database");
    }
});

//define schema and instantiate mongoose model, this is lenient
var parceldataformat = {
    "type": String,
    "properties" : Object,
    "geometry": Object

}
var parceldataSchema = new mongoose.Schema(parceldataformat, {collection: argCollection});
console.log("writing to collection: " + argCollection);
console.log("This might take a while.");
var cleveland_spa = mongoose.model("cuyahoga_cities", parceldataSchema);

let newData;

//first get all spa, then changethen, then replace them
cleveland_spa.find({}).exec((err, res) => {
    if(err){
        throw new Error("Error at find aggregation: " + err);
    }
    //do data manipulation here
    //reverse coords from [lng, lat] -> [lat, lng]
    for(let data of res){
        for(let point of data.geometry.coordinates[0]){ //an extra array
            point.reverse();
        }
    }
    let newData = res;
    console.log(JSON.stringify(res[0].geometry));
    //replace the database with newData
    for(let document of newData){    
        cleveland_spa.updateOne({"_id": document.properties._id}, {$set: {"geometry.coordinates": document.geometry.coordinates}}).exec(
            (err, writeResult) => {
                if(err) throw new Error("Error and update Aggregation: " + err);
                console.log(writeResult);
            }
        );}
    //close the connection
    //mongoose.connection.close();
});

