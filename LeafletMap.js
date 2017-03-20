var leafletMap = (function(){
    
    
    var leafletFeatureLayer;
    
    var initialize = function(){
        //console.log("Leaflet map setup."); 
        
       
        
        var map = L.map('map')
            //.on('load', function(){setupMapButtons();})
            .setView([ 47, -90], 7) //setview actually triggers the on load event. 
            ; //sets up esri leaflet map
        
      //   map.on("load", function(){setupMapButtons();});
        
        //basemap -- default
          L.esri.basemapLayer('Gray').addTo(map); 
          L.esri.basemapLayer('GrayLabels').addTo(map);
        
        //connects to our map service
        leafletFeatureLayer = L.esri.featureLayer({
            url: 'http://geodata.wgnhs.uwex.edu/arcgis/rest/services/lslc/lslc/MapServer/0', 
            style: {color: "#000", weight: 0.35, fillColor: "#ece7f2"}
        }).addTo(map);
        
        setupMapButtons(map);
    }
    
    function setupMapButtons(map){
        //called by the map's on load event. 
        //console.log("set up leaflet map buttons.");
        
        // FeatureGroup is to store editable layers
        var drawnItems = new L.FeatureGroup;
        
        map.addLayer(drawnItems);

        var drawControl = new L.Control.Draw({
             edit: 
                 false,
//             {
//                 featureGroup: drawnItems
//                 ,
//                 poly: {allowIntersection: false}
//             },
             draw: {
                 marker: false, polyline: false, circle: false, rectangle: {repeatMode: false}
                    //not sure why, but circle doesn't seem to work with the query. 
                 ,
                 polygon: {allowIntersection: false}
             }

        });
        map.addControl(drawControl);
        
        //use this if you want something to happen on draw start. 
        //  map.on (L.Draw.Event.DRAWSTART, function(){
        //      console.log("draw start ");
          
        //  });
    
        map.on(L.Draw.Event.CREATED, function (e) {

           
            //To only allow one selection, clear the layer when a new shape is completed. 
            if (drawnItems && drawnItems.getLayers().length !== 0){
                drawnItems.clearLayers();
            }
            
            var layer = e.layer;
            drawnItems.addLayer(layer);

            queryGeom(layer);
            
            
        });
        
        
//        layer.on('click', function (e){
//            
//        })
       
    }
    function queryGeom(layer){
        //takes in a rectangle from a draw event 
        var inputGeom = layer;
        
        console.log ("input", inputGeom);
        
//        leafletFeatureLayer.query()[intersect](inputGeom).ids(function(error, ids){
//            console.log(ids);
//        })
        
        var query = L.esri.query({url:"http://geodata.wgnhs.uwex.edu/arcgis/rest/services/lslc/lslc/MapServer/0"}); 
        query.intersects(inputGeom);
        
        query.run(function(error, featureCollection, response){
            console.log('Found ' + featureCollection.features.length + ' sections');
           // console.log("features", featureCollection.features);
            
            var selectedSections= [];
            for (i in featureCollection.features){
                var selectedSectionId =featureCollection.features[i].properties.UID;
                selectedSections.push(selectedSectionId);
            }
           // console.log("filter based on these sections:", selectedSections);
            filterForSections(selectedSections);
        });
    }
    
    function filterForSections(array){
        //console.log("update map filter/filter for sections");
        
        filters.mapSectionsInput = array; 
        queryTableForFilters();
        
    }
    
    function calculateClasses(array){
        console.log("calculate classes.");
         console.log("highlight the map sections", array);
    //set the symbol to the variable highlightSymbol (an object defined above)

    //filters out redundant section ids 
    var sortedArray = array.sort(function(a,b){return a-b});
    var filteredSections = []

    for (i = 0; i < sortedArray.length; i++){
      if (sortedArray[i] != sortedArray[i-1]) {
        filteredSections.push(sortedArray[i])
      }
    }
       
    //CHOROPLETH-----------------------------------------
        var choroplethStructureArray = [];
        //populates 2D array with [[sectionID, # of records in it],,]
        for (i = 0; i < sortedArray.length; i++){
          if (sortedArray[i] != sortedArray[i-1]){
            choroplethStructureArray.push([sortedArray[i], 1]);
          } else {
            choroplethStructureArray[choroplethStructureArray.length-1][1]++;
          }
        }

        //creates array with just the # of records; later used to find class breaks
        var classBreaksFinderArray = [];
        for (i = 0; i < choroplethStructureArray.length; i++){
          classBreaksFinderArray.push(choroplethStructureArray[i][1]);
        }

        //sorts the array containing # of samples; sorts and filteres ot redundant values
        //gives us unique count numbers
        var sortedClassFinderArray = classBreaksFinderArray.sort(function(a,b){return a-b});
        var filteredValuesArray = [];
        for (i = 0; i < sortedClassFinderArray.length; i++){
          if (sortedClassFinderArray[i] != sortedClassFinderArray[i-1]) {
            filteredValuesArray.push(sortedClassFinderArray[i])
          }
        }

        //sets up 4 class break values using jerry-rigged equal interval -- maybe switch and import D3?
        var break0 = filteredValuesArray[0];
        var break1 = filteredValuesArray[Math.round((filteredValuesArray.length / 4) - 1)];
        var break2 = filteredValuesArray[Math.round((filteredValuesArray.length / 2) - 1)];
        var break3 = filteredValuesArray[Math.round((filteredValuesArray.length / (4/3)) - 1)];
        var breakTop = filteredValuesArray[filteredValuesArray.length - 1];

        //defines arrays to be populated with section ids in each class
        var class1Array = [];
        var class2Array = [];
        var class3Array = [];
        var class4Array = [];

        //populates each class array by checking how many samples they each have, evaluating via breaks
        //makes use of the 2D choroplethStructureArray
        for (i = 0; i < choroplethStructureArray.length; i++){
          if (choroplethStructureArray[i][1] <= break1){
            class1Array.push(choroplethStructureArray[i][0]);
          } else if (choroplethStructureArray[i][1] <= break2) {
            class2Array.push(choroplethStructureArray[i][0]);
          } else if (choroplethStructureArray[i][1] <= break3) {
            class3Array.push(choroplethStructureArray[i][0]);
          } else {
            class4Array.push(choroplethStructureArray[i][0]);
          }; 
        } 

        //tests out how the choropleth system is working
        console.log("filtered values array -->", filteredValuesArray)
        console.log("class breaks -->", break0,break1,break2,break3,breakTop)
       

        //create new Feature Layer with each of these
        
        
        return {"class1Array": class1Array, "class2Array": class2Array, "class3Array": class3Array, "class4Array": class4Array};
        
        
        
    } //end calculateClasses
    
    function styleSections (){
        console.log ("style sections");
    }
    
    var highlight = function (array){
        console.log("highlight via Leaflet");
        var classes = calculateClasses(array); 
        
        console.log("class 1 array:", classes.class1Array);
        console.log("class 2 array:", classes.class2Array);
        console.log("class 3 array:", classes.class3Array);
        console.log("class 4 array:", classes.class4Array);
        
          /*
        var mapHighlight = new Query();
        mapHighlight.where = ('UID IN ('+filteredSections+')');

        fl.selectFeatures(mapHighlight, fl.SELECTION_NEW); 
        //zoom to the extent of the filter results.
*/
    }
    
    return {
        "initialize": initialize,
        
        "highlight": highlight
    }
    
})();