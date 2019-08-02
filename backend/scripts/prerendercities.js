//This file will update prerendered cities, based on the queries made by the routers in router/.
// it will use the server's own API in order to make requests. 
//only works for Cleveland since the server becomes overloaded with work.
//I plan on making this synchronous

const request = require("request");
const db = require("../model/db.js");
const fs = require('fs');

const VIEWS = ["showgeometry","concentration",
 "concentrationbylanduse", "view1", "view2", "view3", "view4"]

var requestPromise = async(cityname,viewname) => {
    return new Promise((resolve, reject) => {
        request(`http://localhost:3000/${viewname}/${cityname}/`, {json: true}, (error, response, body) => {
            if (error) return reject(error);
            try {
                resolve({ 
                    city: cityname,
                    view: viewname,
                    data: response.body
                });
            } catch(e) {
                reject(e);
            }
        });
    });
}


const createfiles = async(cityname) => {
    
    console.log("Querying Database....");
    fullcityData =  VIEWS.map( (view) => {
        return requestPromise(cityname, view)
    });
    
    return Promise.all(fullcityData);
}

const ensureDirSync = dirpath => {
    try{
        fs.mkdirSync(dirpath);
        console.log("directory created");
    }catch(e){
        if(e.code !== 'EEXIST') {throw e}
        else {
            console.log("directory already exists.");
            return true
        }
    }
}

(async() => {
    //get all cities from the database
    // cities =  await db.parcelDataModel.distinct("properties.par_city")
    // cities = cities.filter(x => x !== null);

    cities = ['CLEVELAND']
    console.log(cities);

    
    //create files on the hard disk in the appropriate directory
    for(let city of cities){
        if(ensureDirSync(`backend/prerendered/${city}`) && fs.existsSync(`backend/prerendered/${city}/${city}${VIEWS[0]}.json`)){
            console.log("prerendered files already exist. Exiting.");
            break;
        };
        createfiles(city)
        .then(result => {
            console.log("done, adding to database...");
            //add the data to the db.cityDataModel
            result.map( doc => {
                console.log("doc: " + doc);
                fs.writeFile(`backend/prerendered/${city}/${city}${doc.view}.json`, JSON.stringify(doc), {encoding: 'utf8'},
                err => {
                    if (err) throw err;
                    console.log("File was written to backend/prerendered");
                });
                // db.cityDataModel.replaceOne({"city": doc.city, "view": doc.view},
                //     doc, {upsert: true}, (err, res) => {
                //         if(err) throw err;
                //         console.log(res);
                //     });
            });
            console.log(`finished prerendering ${city}`);
            
        })
        .catch(err => console.log(err));
    }

})();


