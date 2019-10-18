# Cleveland State Urban Planning Neighborhood Web Application

# --Structure--
# General Components
    `charts:` charts.js custom charts, contained in sidebar
    `control-panel:` select city, neighborhood, land use, filter options, search by
                     address button, and go button
    `leaflet-map:` leaflet map with glify polygon rendering, lasso, and selection
    `sidebar:` contains charts expandable sections

# Modal Components: Uses Bootstrap modals
    `abatement-modal:` Displays information about abatements
    `dtlu-modal:` Displays information about Detailed Taxable Land Use
    `landing-page-content:` first modal displayed when website is loaded
    `progress-spinner:` after go is pressed in control panel displays loading spinner
    `tables:` ng2-tables displays data from relevant chart

# Services
    `central.service:` main data control point, creates subjects for all data views
                       when a component subscribes to receive data on any update this
                       is the control point for that data.

# Assets: contains all icons and pictures, structured by data type

# Models: structures for custom data types
    `SearchOptions:` Used in central.service, model of filters/options for
                     database search query, set via control-panel upon search
                     (located in ..app/Service)
    `view(n):` different data to send to charts/tables
    `featurecollection:` useful for formatting json feature collections



# V02

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.1.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
