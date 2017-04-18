console.log('running')
var leafletMap = (function(){
    
    
    var leafletFeatureLayer;
    var drawnItems; 
    var customDeleteButton;
    var loadingPageOn;
    
    var initialize = function(){
        
        var map = L.map('map')
            //.on('load', function(){setupMapButtons();})
            .setView([ 47, -90], 7) //setview actually triggers the on load event. 
            ; //sets up esri leaflet map
        
      //   map.on("load", function(){setupMapButtons();});
        
        //basemap -- default
        L.esri.basemapLayer('Gray').addTo(map); 
        L.esri.basemapLayer('GrayLabels').addTo(map);
        
        //panes are supposed to control drawing order... but this isn't working yet for me. 
//        map.createPane('BPLSSSections');
//        map.createPane('AdrawnSelection');
        
       
        //connects to our map service
        leafletFeatureLayer = L.esri.featureLayer({
            url: PLSSSectionsLayerURL, 
            style: {color: "#000", weight: 0.35, fillColor: "#ece7f2"}
//            , 
//            pane: 'BPLSSSections'
        }).addTo(map);

        setupMapButtons(map);
        //initPopups(63821);

        leafletFeatureLayer.bindPopup(function (individualSection) {
            return "<h3>Samples in Section " + individualSection.feature.properties.UID + "</h3>" + initPopups(individualSection.feature.properties.UID)
            
        });
    }
    
    function setupMapButtons(map){
        //called by the map's on load event. 
        //console.log("set up leaflet map buttons.");
        
       
        //working with pane to make this appear above the sections layer. 
        //NOT WORKING RIGHT NOW. 
         // FeatureGroup is to store editable layers
        drawnItems = new L.FeatureGroup;
//        drawnItems.options.pane = 'AdrawnSelection';
        
        map.addLayer(drawnItems);
        

        var drawControl = new L.Control.Draw({
             edit: 
                 false,
//             {
//                 featureGroup: drawnItems
//                 ,
//                 poly: {allowIntersection: false}
//                 
//             },
             draw: {
                 marker: false, polyline: false, circle: false, rectangle: {repeatMode: false}
                    //not sure why, but circle doesn't seem to work with the query. 
                 ,
                 polygon: {allowIntersection: false}
             }

        });
        map.addControl(drawControl);
        
        customDeleteButton = L.Control.extend({
            options: {position: "topleft"},
            onAdd: function(map){
                var container = L.DomUtil.create('a', 'leaflet-bar leaflet-control leaflet-control-custom leaflet-draw-toolbar leaflet-draw-edit-remove');
                container.id = 'customDeleteButton';
                container.title = "Clear map selection";
                container.style.backgroundColor = 'white'; 
                container.style.width = '26px';
                container.style.height = '26px';
                container.style.backgroundImage = "linear-gradient(transparent, transparent), url('https://unpkg.com/leaflet-draw@0.4.7/dist/images/spritesheet.svg')";
                container.style.backgroundPosition = "-242px -2px"; //tool disabled style
               // container.style.backgroundPosition = "-182px -2px"; //tool enabled style
                container.style.backgroundSize = "270px 30px";
                container.style.backgroundClip = "padding-box";
                container.style.pointerEvents = "auto";
                container.style.cursor = 'pointer';
                //hover? 
 
                container.onclick = function(){clearMapSelection();}

                return container; 
            }
        });
       
        //add a delete button
         map.addControl(new customDeleteButton());
        
        //use this if you want something to happen on draw start. 
        //  map.on (L.Draw.Event.DRAWSTART, function(){
        //      console.log("draw start ");
          
        //  });
        
        //listener for draw end event: 
        map.on(L.Draw.Event.CREATED, function (e) {

           
            //To only allow one selection, clear the layer when a new shape is completed. 
            if (drawnItems && drawnItems.getLayers().length !== 0){
                drawnItems.clearLayers();
            }
            
            //add new layer to the featureGroup
            var layer = e.layer;
            drawnItems.addLayer(layer);
            drawnItems.setStyle({fillOpacity: 0, color: "#333"});
            
            //style the 
            document.getElementById('customDeleteButton').style.backgroundPosition = "-182px -2px";
            
            //zoom to the selection
            map.fitBounds(layer._bounds);
            
            //pass on the layer to the function which will query it for section IDs
            queryGeom(layer);
            
            
        });
        
        
        drawnItems.on('click', function (e){
            console.log("clicked layer.");
        }); 
       
    } //end setupMapButtons function 

    function initPopups(individualSection){

        var sectionResults = resultsManager.matchSection(individualSection);
        
        //establishes popup content variable, adding in header besaed on SectionId
        var content = "<ul>";

        //loops through samples in the section adding a line for each of them
        for (i in sectionResults) {

            var listedSampleId = sectionResults[i].attributes.SampleId;
            var listedRockType = sectionResults[i].attributes.RockType;
            if (listedRockType == null){ listedRockType = "Unknown";} //checks for null value

            content = content + "<li>" + listedRockType + ": <a href='sampleRecord.html#" + listedSampleId + "'>" + listedSampleId + "</a></li>";

        }

        content = content + "</ul>"

        return content;

    }
    
    
    var clearMapSelection = function (){
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
            document.getElementById('customDeleteButton').style.backgroundPosition = "-242px -2px"; //tool disabled style

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
                var selectedSectionId =featureCollection.features[i].properties.UID;
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
            var sectionID = feature.properties.UID; //pulls out section id from feature
            
            if ( classes.class4Array.indexOf(sectionID) != -1 ){ fillColor = "#8c2d04"}
            else if ( classes.class3Array.indexOf(sectionID) != -1){ fillColor = "#cc4c02"}
            else if ( classes.class2Array.indexOf(sectionID) != -1) {fillColor = "#ec7014"}
            else if ( classes.class1Array.indexOf(sectionID) != -1 ) {fillColor = "#fe9929"}
            //if not found in any class array, given no-value color
            else {fillColor = "#ece7f2", strokeColor = "#444", fillOpacity = 0.2};  // opposite hue, low saturation, slightly diverging to show seperation
           
            //actual style declaration for each feature using assignment from above
            return { color: strokeColor, weight: 0.35, fillColor: fillColor, fillOpacity: fillOpacity };
            
           
        });//end setStyle

        $("#loading").remove() //stops loading feedback

        
    } //end highlight function
    
    return {
        "initialize": initialize,
        "clearMapSelection": clearMapSelection,
        "highlight": highlight
    }
    
})();