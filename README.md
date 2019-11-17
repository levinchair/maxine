# Cleveland State Urban Planning Neighborhood Web Application

# --FrontEnd Structure--
## General Components
    `charts:` charts.js custom charts, contained in sidebar
    `control-panel:` select city, neighborhood, land use, filter options, search by
                     address button, and go button
    `leaflet-map:` leaflet map with glify polygon rendering, lasso, and selection
    `sidebar:` contains charts expandable sections

## Modal Components: Uses Bootstrap modals
    `abatement-modal:` Displays information about abatements
    `dtlu-modal:` Displays information about Detailed Taxable Land Use
    `landing-page-content:` first modal displayed when website is loaded
    `progress-spinner:` after go is pressed in control panel displays loading spinner
    `tables:` ng2-tables displays data from relevant chart
    `address-search`: Display the form to search for an address. Area of interest
                     is the area analyzed area around the parcel with associated address

## Services
    `central.service:` main data control point, creates subjects for all data views
                       when a component subscribes to receive data on any update this
                       is the control point for that data.

## Assets: contains all icons and pictures, structured by data type

## Models: structures for custom data types
    `SearchOptions:` Used in centralService, model of filters/options for
                     database search query, set via control-panel upon search
                     (located in ..app/Service)
    `view(n):` different data to send to charts/tables
    `AddressOptions`: Used in centralService and an address Componenet
    `featurecollection:` useful for formatting json feature collections


## Front End File Structure
```bash
.
├── app
│   ├── charts
│   ├── control-panel
│   ├── leaflet-map
│   ├── modalComponents
│   │   ├── abatement-modal
│   │   ├── address-search
│   │   ├── dtlu-modal
│   │   ├── landing-page-content
│   │   └── progress-spinner
│   ├── Service
│   ├── sidebar
│   └── tables
├── assets
│   ├── bootstrap-png
│   ├── data
│   ├── icons-16px
│   │   └── png
│   ├── icons-24px
│   │   ├── license
│   │   └── png
│   ├── icons-50px
│   │   └── png
│   ├── images
│   └── JSON
├── environments
├── GeoJSON_Data
└── model

 ```


# V02

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.1.3.

## Development server

Run `ng serve` or `npm start`(alias) for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

    To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).]


# --Backend Structure--

To run the Backend, go to folder /backend and run: 
```
node server.js
```
- This will start the server at IP:  http://localhost:3000

```bash
.
├── app.js
├── index.html
├── model
│   ├── db.js
│   └── view1.js
├── package.json
├── package-lock.json
├── prerendered
│   └── CLEVELAND
│       ├── CLEVELANDconcentrationbylanduse.json
│       ├── CLEVELANDconcentration.json
│       ├── CLEVELANDshowgeometry.json
│       ├── CLEVELANDview1.json
│       ├── CLEVELANDview2.json
│       ├── CLEVELANDview3.json
│       └── CLEVELANDview4.json
├── router
│   ├── cities.js
│   ├── geometry.js
│   ├── getMax.js
│   ├── neighbourhood.js
│   ├── OwnerConcentration.js
│   ├── utils.js
│   ├── view1.js
│   ├── view2.js
│   ├── view3.js
│   ├── view4.js
│   └── viewOwners.js
├── scripts
│   ├── prerendercities.js
│   ├── test_lodes.js
│   ├── updatecollection.js
│   └── updateSPAData.js
└── server.js

```

## Router
    These Express Routers handle incoming requests after the Parser verifies them, does some data manipulation using Mongo Aggregation Pipelines, then send a response with new data. 
    Here are some API Endpoints:
    ```
    - /showcities
    - /showgeometry/:param?/:hood?
    - /getparcels/:geoObject?
    - /showhood/:city
    - /getNeighborhoodBoundaries
    - /concentration/:param?/:hood?
    - /concentrationbylanduse/:param2?/:hood2?
    - /owners/:city?/:hood?
    ```
    These are simple complementary routes to get supplemntary information for the main routes, which are listed below: 
    ```
    - /view1/:param?/:hood?
    - /view2/:param?/:hood?
    - /view3/:param?/:hood?
    - /view4/:param?/:hood?
    ```
    utils.js has some re-usable mongo pipelines as well as a function that takes req.body and converts it to a Mongo Match Query.
## Prerendered 
    These are static file of outputs from the Mongo Aggregattion pipeline. Might be used a solution to speed up the backend by serving these files instead
    of re-calculating them.
## Scripts
    These are Node scripts that allow for precise and miscellaneuos data calculations.
    - prerenderedcities.js
        - Updates the prerendered files
    - updatecollection.js 
        - Usage: 
            ``` node updatecollection.js <location of .geojson file> <name  of collection to update in database urbanNeighbourhood2> ```
        - Updates the specified colletion with the new data in the database by matching the parcelpin of the file with the parclepin in the databse. If the parcelpin is not found, it will add a new document.
    - Various.
## model
    
