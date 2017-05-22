//function called anonymously 
$(function(){
    scaleMapHeight($(this).height()) 
    //called on window resize
    $(window).resize(function() {
        scaleMapHeight($(this).height())
    });
});

//function matches map height to filters
function scaleMapHeight(height){
    
    var matchHeight = $("#filters").height(); //references height of filters div
    
    //checks for height less than 545px, because that's where the map starts getting distorted
//    if (height < 545){
//       
//        matchHeight = String(matchHeight) //converts to string for css format
//        console.log(matchHeight)
//
//        //sets map to height of filters div
//        document.getElementById("map").style.height = matchHeight + "px";
//    }
    
    document.getElementById("map").style.height = matchHeight + "px";
}

var leafletMap = (function(){

    var leafletFeatureLayer;
    var drawnItems; 
    //var customDeleteButton;
    var rectangle; 
    var polygon;
    
    var initialize = function(){
        
        var map = L.map('map', {
            scrollWheelZoom: determineScroll(), //calls determineScroll() to return true or false
            scrollWheelPan: determineScroll(), 
            zoomControl: false //will add zoom control in the top right corner next
        }).setView([ 47, -90], 6); //setview actually triggers the on load event.

        var terrainLayer = Tangram.leafletLayer({
            scene: 'terrain.yaml',
            attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a>'
        });
        terrainLayer.addTo(map);

        var otherLayer = Tangram.leafletLayer({
            scene: 'cartography.yaml',
            attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a>'
        });
        //otherLayer.addTo(map);
        
        new L.Control.Zoom({ position: 'topright' }).addTo(map);
        //basemap -- default
        //L.esri.basemapLayer('Gray').addTo(map); 
        //L.esri.basemapLayer('GrayLabels').addTo(map);
        
        //panes are supposed to control drawing order... but this isn't working yet for me. 
//        map.createPane('B-PLSSSections');
//        map.createPane('A-drawnSelection');
        
       
        //connects to our map service. Shows the PLSS Sections
        leafletFeatureLayer = L.esri.featureLayer({
            url: PLSSSectionsLayerURL, 
            style: {color: "#000", weight: 0.35, fillColor: "#ece7f2"}
//            , 
//            pane: 'B-PLSSSections'
        }).addTo(map);
        
        //set up leaflet draw layer: 
        // FeatureGroup is to store drawn shapes
        //drawn items is an obj with a _layers obj
        drawnItems = new L.FeatureGroup();
//        drawnItems.options.pane = 'A-drawnSelection';
      
        map.addLayer(drawnItems);
        
        
        //set up the Leaflet Draw buttons. 
        setupMapButtons(map);
        drawListener(map);

        leafletFeatureLayer.bindPopup(function (individualSection) {
            return initPopup(individualSection.feature.properties[sectionsLayerPlssField]);
            
        });
    } //end initialize function

    //called in map properties during the initialize function
    function determineScroll(){
        
        var width = $(this).width() //defines width

        console.log("width:", width)

        //return boolean based on width
        if (width < 926) {
           return false; 
        } else {
         return true;
        }

    }
    
    
    function setupMapButtons(map){
        //called by the map's on load event. 
        //listeners for the leaflet draw buttons
       
        rectangle = new L.Draw.Rectangle(map, {
                shapeOptions: {color:'#000'}, 
                repeatMode: false
            });
        
         polygon = new L.Draw.Polygon(map, {
                shapeOptions: {color:'#529952'}, 
                repeatMode: false, 
                allowIntersection: false
            });
        
        $("#selectRectangleButton").click(function(d){
            console.log("click rectangle");
            //console.log("d is: ", d);
            //console.log("this is: ", this);
            
            //clear all Leaflet Draw indicators and handlers. 
            disableLeafletDraw(); 
            
            $("#selectRectangleButton").addClass("active");
             rectangle.enable();
        });
        
        $("#selectPolygonButton").click(function(d){
            
            //clear all Leaflet Draw indicators and handlers. 
            disableLeafletDraw(); 
            
            $("#selectPolygonButton").addClass("active");
            polygon.enable();
        });
        
       
    } //end setupMapButtons function 
    
    function disableLeafletDraw(){
        $("#selectPolygonButton").removeClass("active");
        $("#selectRectangleButton").removeClass("active");
        polygon.disable();
        rectangle.disable();
    }
        
    function drawListener(map){
        
         //use this if you want something to happen on draw start. 
        //  map.on (L.Draw.Event.DRAWSTART, function(){
        //      console.log("draw start ");
          
        //  });
        
         map.on(L.Draw.Event.DRAWSTOP, function (e) {
              console.log("draw stop.");
             
             //clear all Leaflet Draw indicators and handlers.
             disableLeafletDraw();
             
         });
        
        //listener for draw created event: 
        map.on(L.Draw.Event.CREATED, function (e) {
           console.log("shape created.");
            
            //clear all Leaflet Draw indicators and handlers.    
            disableLeafletDraw();
            
            //To only allow one map selection, clear the layer when a new shape is completed. 
            if (drawnItems && drawnItems.getLayers().length !== 0){
                drawnItems.clearLayers();
            }

            var type = e.layerType; //type is either rectangle or polygon
           
            
            //add new layer to the featureGroup
            var layer = e.layer;
            drawnItems.addLayer(layer);
            drawnItems.setStyle({fillOpacity: 0, color: "#000"});
            
            //style the delete button to enable it: 
            //document.getElementById('customDeleteButton').style.backgroundPosition = "-182px -2px";
            
            //zoom to the selection
            map.fitBounds(layer.getBounds().pad(0.1));
            
            //bring sections to front? TEMPORARY, PARTIAL FIX for seeing the popups. 
            leafletFeatureLayer.bringToFront();
            
            //pass on the layer to the function which will query it for section IDs
            queryGeom(layer);
            
            
        });
        
        
        drawnItems.on('click', function (e){
            console.log("clicked leaflet draw layer.");
        }); 
    }

    function initPopup(individualSection){

        var sectionResults = resultsManager.matchPLSSSection(individualSection);

        if (sectionResults.length == 1){
            var plurality = "Result";
        } else {
            var plurality = "Results";
        }

        var content = "<h3>" + sectionResults.length + " " + plurality + " in this section </h3>"
        
        //establishes popup content variable, adding in header based on PlssId/SectionId
        content += "<ul>";

        //loops through samples in the section adding a line for each of them
        for (i in sectionResults) {

            var listedCatalogNumber = sectionResults[i].attributes.HandSampleCatalogNumber
            var listedSampleId = sectionResults[i].attributes.SampleId;
            var listedRockType = sectionResults[i].attributes.RockType;
            if (listedRockType == null){ listedRockType = "";} //checks for null value

            content = content + "<li><a href='hand-sample.html#" + listedCatalogNumber + "' target='_blank' >Sample " + listedCatalogNumber + " " + listedRockType + "</a></li>";

        }

        content = content + "</ul>";

        return content;

    }
    
    
    var clearMapSelection = function (){
        
       disableLeafletDraw();
        
         //clear the layer
        if (drawnItems && drawnItems.getLayers().length !== 0){
            console.log('clearMapSelection!');
            //clear the map layer. 
            drawnItems.clearLayers();

            //reset the filters var
            filters.mapSectionsInput = null;
            queryTableForFilters();
            
            //remove the item in filter feedback

            //re-style the map tool as disabled. 
            //document.getElementById('customDeleteButton').style.backgroundPosition = "-242px -2px"; //tool disabled style

            //customDeleteButton.disable();
        } else {console.log("no selection to clear.");}

    }
    
    
    function queryGeom(inputGeom){
        //takes in a rectangle from a draw event 
        
        
       // console.log ("input", inputGeom);
        
        var query = L.esri.query({url:PLSSSectionsLayerURL}); 
        query.intersects(inputGeom);
        
        
        query.run(function(error, featureCollection, response){
            //console.log('Found ' + featureCollection.features.length + ' sections');
           // console.log("features", featureCollection.features);
            
            var selectedSections= [];
            for (i in featureCollection.features){
                var selectedSectionId =featureCollection.features[i].properties[sectionsLayerPlssField];
                selectedSections.push(selectedSectionId);
            }
           // console.log("filter based on these sections:", selectedSections);
            filterForSections(selectedSections);
        });
    }
    
    function filterForSections(array){
        //console.log("update map filter/filter for sections");
        
        //reset the filters global var
        filters.mapSectionsInput = array; 
        
        //run the query
        queryTableForFilters(); //handles the filter feedback indicators. 

    }
    
    function calculateClasses(array){
    
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
       // console.log("filtered values array -->", filteredValuesArray)
        console.log("class breaks -->", break0,break1,break2,break3,breakTop)

       return {"class1Array": class1Array, "class2Array": class2Array, "class3Array": class3Array, "class4Array": class4Array};

    } //end calculateClasses
    
       
    var highlight = function (array){
      //  console.log("highlight via Leaflet");
        var classes = calculateClasses(array); 
        
//        console.log("class 1 array:", classes.class1Array);
//        console.log("class 2 array:", classes.class2Array);
//        console.log("class 3 array:", classes.class3Array);
//        console.log("class 4 array:", classes.class4Array);
        
        leafletFeatureLayer.setStyle(function (feature){
            var fillColor; //blank variable for fill color
            var strokeColor = "#8c2d04"; //this applies to all except where it's re-set below
            var fillOpacity = 0.8; //this applies to all except where it's re-set below
            var sectionID = feature.properties[sectionsLayerPlssField]; //pulls out section id from feature
            
            if ( classes.class4Array.indexOf(sectionID) != -1 ){ fillColor = "#8c2d04"}
            else if ( classes.class3Array.indexOf(sectionID) != -1){ fillColor = "#cc4c02"}
            else if ( classes.class2Array.indexOf(sectionID) != -1) {fillColor = "#ec7014"}
            else if ( classes.class1Array.indexOf(sectionID) != -1 ) {fillColor = "#fe9929"}
            //if not found in any class array, given no-value color
            else {fillColor = "#ece7f2", strokeColor = "#444", fillOpacity = 0.2};  // opposite hue, low saturation, slightly diverging to show seperation
           
            //actual style declaration for each feature using assignment from above
            return { color: strokeColor, weight: 0.35, fillColor: fillColor, fillOpacity: fillOpacity };
            
           
        });//end setStyle


        $("#loading").remove(); //stops loading feedback


        
    } //end highlight function
    
    return {
        "initialize": initialize,
        "clearMapSelection": clearMapSelection,
        "highlight": highlight 
        
    }
    
})();