export class Landing {
 constructor(){}
   option1 = "<b>Method 1: Searching a whole city</b><br>" +
             "<ol><li>Select a city from the dropdown menu.</li>" +
                "<li>Select <b>Null</b> for the neighborhood category.</li> "+
                "<li>Click the search button in the top right.</li></ol>"+
             "<em>Note: We do not recommend searching all of Cleveland, as it will take a long time to render. All of the other cities are operational.</em><br><br>" +
             "<b>Method 2: Searching a specific Neighborhood</b><br>"+
             "<ol><li>Select a city from the dropdown menu.</li>"+
                "<li> Select a neighborhood.</li>"+
                "<li>Click the search button in the top right.</li></ol>";

   option2 = "<b>Lasso Tool</b><br>"+
             "<ul><li>The Lasso tool allows a user to draw one or many areas onto the map for searching.</li>" +
                "<li>A city or neighborhood needs to be selected first, see <em>1.Search by City and Neighborhood</em for instructions then continue.</li>" +
                "<li>Toggle the Lasso tool [<img src='../assets/icons-24px/png/002-map-location.png' height='19' width='19'>] to begin selecting the desired area.</li>" +
                "<li>Click the Go button to search the lasso area or click the Delete button [<img src='../assets/icons-24px/png/008-trash.png' height='16' width='16' title='Remove all Lasso areas'>] to start over and select a new area.</li>" +
                "<li>The Tables and Charts are updated with only the plots contained within the lasso area.</li>";

   option3 = "<b>Search Bar</b><br><p>[Beta] Type an address into the search bar. Click Search in the top right. The map will update with a pin at the address with the address's neighborhood loaded into the table, map, and charts.</p>";
}
