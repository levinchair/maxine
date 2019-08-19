// this is a sandbox to try out aggregation pipelines for speed and reliability. 
// ctyname is the County name in XWALK.
// tabblk2010 is the Censu Block. The smallest unit of data in the dataset
//ctycsubname is hte name of the citiy that we ar referring to
// test tabblk2010: 390351011011001
// to calculate Inflow/Outflow

const db = require("../model/db.js").xwalkdataModel;
const mongoose = require("../model/db.js").mongoose;

mongoose.set('debug', true );

var pipeline  = [
    {$match: { "ctyname" : 'Cuyahoga County, OH', "ctycsubname": 'Cleveland city (Cuyahoga, OH)'}},
    {$project: { "tabblk2010": 1}},
    {$lookup: {
        from: "od_cuyahoga_lodes",
        localField: "tabblk2010",
        foreignField: "h_geocode",
        as: "od_data"
    }}
]

db.aggregate(pipeline).exec(
    (err, res) => {
        console.log("got a response ");
        if(err) return err;
        console.log(res);
    }
)

// db.find( { "ctyname" : 'Cuyahoga County, OH', "ctycsubname": 'Cleveland city (Cuyahoga, OH)'})
// .exec(
//     (error, response) => {
//         if(error) throw error;
//         console.log(response);
//     } 
// );

// db.distinct("ctycsubname").exec(
//     (errr, res) => {
//         console.log(res);
//     }
// )
