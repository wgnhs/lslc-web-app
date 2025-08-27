var globalLayer;
var firstLoad = true;

$("#fieldDescriptionSearch").keypress(function(e){
    if(e.which == 13){
        $("#fieldDescriptionSearch").autocomplete("close");
    }
});

//$("#leftPanel").scroll(function(){
//    $("#fieldDescriptionSearch").autocomplete("close");
//})

var leafletMap = (function(){
    var map;
    var leafletFeatureLayer;
    var drawnItems; 
    //var customDeleteButton;
    var rectangle; 
    var polygon;
    
    var initialize = function(){


        
         map = L.map('map', {
            scrollWheelZoom: determineScroll(), //calls determineScroll() to return true or false
            scrollWheelPan: determineScroll(), 
            zoomControl: false, //will add zoom control in the top right corner next
            minZoom: 6,
            maxZoom: 11,
            maxBounds: [[39.0,-110.0],[52.0,-80.0]]
        }).setView([ 48, -92], 6); //setview actually triggers the on load event. 

        
        new L.Control.Zoom({ position: 'topright' }).addTo(map);
        //basemap -- default

        var esriGray =  L.esri.basemapLayer('Gray'); 
        var esriGrayLabels =   L.esri.basemapLayer('GrayLabels');
        
            //mapbox light basemap: 
       var mapboxLight = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', 
            {
            attribution: 'Basemap © <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/feedback/" target="_blank">Improve this map</a></strong>',
            id: 'mapbox.light',
            accessToken: 'pk.eyJ1IjoiY2Fyb2xpbmVyb3NlIiwiYSI6Ik55TUFmMVEifQ.ybZm7IghE2N0ezsMfaDNFQ' 
            });
        
        //Soren basemap: 
        var sorenBasemap = L.tileLayer('https://api.mapbox.com/styles/v1/swal94/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/feedback/" target="_blank">Improve this map</a></strong>',
            id: 'cj48piva31ytj2ro9h2kgv0lx',
            accessToken: 'pk.eyJ1Ijoic3dhbDk0IiwiYSI6ImNpZnk5aWdzcDR5dDl0ZWx5dDhwZW13ejAifQ.y18LYK4VbBo8evRHtqiEiw'
        }).addTo(map);
        
        var macrostratTiles = L.tileLayer('https://macrostrat.org/api/v2/maps/burwell/emphasized/{z}/{x}/{y}/tile.png');
        macrostratTiles.setOpacity(0.4);

        
        //panes are supposed to control drawing order... but this isn't working yet for me. 
//        map.createPane('B-PLSSSections');
//        map.createPane('A-drawnSelection');
        
        var basemapOptions = {
            
            "Labels": mapboxLight, 
            "Terrain": sorenBasemap, 
            
            
        }
        var overlayOptions={"Bedrock Geology from Macrostrat<br><a href='https://macrostrat.org/map/#6/45.997/-90.505' target='_blank'>macrostrat.org</a>": macrostratTiles}
        
        L.control.layers(null, overlayOptions).addTo(map);
       
        //connects to our map service. Shows the PLSS Sections
        leafletFeatureLayer = L.esri.featureLayer({
            url: PLSSSectionsLayerURL, 
            style: {color: "rgba(0,0,0,0)", weight: 1.5, fillColor: "rgba(0,0,0,0)"}
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

        $("#zoomToSelectionButton").click(function(){
            zoomToSelection(map);
        });

        map.on('zoom', function(e){
            changeMapDesign(map, leafletFeatureLayer)
        })
        
       
       
        
    } //end initialize function
    
   
    //called in map properties during the initialize function
    function determineScroll(){
        
        var width = $(this).width() //defines width

        //console.log("width:", width)

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
                shapeOptions: {color:'#103762'}, 
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
            console.log("type: ", type);
            
            //add new layer to the featureGroup
            var layer = e.layer;
            drawnItems.addLayer(layer);
            drawnItems.setStyle({fillOpacity: 0, color: "#000"});
            
            //zoom to the selection
            map.fitBounds(layer.getBounds().pad(0.2));
            
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

            var listedHandSampleNumber = sectionResults[i].attributes[handSampleNumberField];
            var listedSampleId = sectionResults[i].attributes.SampleId;
            var listedRockType = sectionResults[i].attributes.RockType;
            if (listedRockType == null){ listedRockType = "";} //checks for null value

            content = content + "<li><a href='hand-sample.html#" + listedHandSampleNumber + "' target='_blank' >Sample " + listedHandSampleNumber + " " + listedRockType + "</a></li>";

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

        } else {console.log("no selection to clear.");}

    }
    
    
    function queryGeom(inputGeom){
        //takes in a rectangle or polygon from a draw event 

        console.log ("query input geometry", inputGeom);
        
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
            
            //bring sections to front? TEMPORARY, PARTIAL FIX for seeing the popups.
            leafletFeatureLayer.bringToFront();
            console.log("brought sections to front.");
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

        var allBreaks = [break0,break1,break2,break3,breakTop]
        var breaks = [];

        //filters out duplicate and undefined values from the breaks array
        for (i in allBreaks){
            if (allBreaks[i] != allBreaks[i-1] && allBreaks[i]){
                breaks.push(allBreaks[i])
            }
        }


        //defines arrays to be populated with section ids in each class
        var class1Array = [];
        var class2Array = [];
        var class3Array = [];
        var class4Array = [];

        //sticks all class arrays (to be populated with section ids) in an outter array for iteration below
        var classesArray = [null,class1Array,class2Array,class3Array,class4Array]

        //populates each class array by checking how many samples they each have, evaluating via breaks
        //makes use of the 2D choroplethStructureArray
        // for (i = 0; i < choroplethStructureArray.length; i++){
        //   if (choroplethStructureArray[i][1] <= break1){
        //     class1Array.push(choroplethStructureArray[i][0]);
        //   } else if (choroplethStructureArray[i][1] <= break2) {
        //     class2Array.push(choroplethStructureArray[i][0]);
        //   } else if (choroplethStructureArray[i][1] <= break3) {
        //     class3Array.push(choroplethStructureArray[i][0]);
        //   } else {
        //     class4Array.push(choroplethStructureArray[i][0]);
        //   }; 
        // } 

        //populates each class array by checking how many samples they each have, evaluating via breaks
        //makes use of the 2D choroplethStructureArray
        //loops through classesArray on each one. 
        //this overcomes issue of less than 4 breaks
        for (i = 0; i < choroplethStructureArray.length; i++){
            for (j in breaks){
                if (choroplethStructureArray[i][1] <= breaks[j] && j != 0){
                    classesArray[j].push(choroplethStructureArray[i][0])
                    break;
                }
            }
        }

        //tests out how the choropleth system is working
       // console.log("filtered values array -->", filteredValuesArray)
       // console.log("class breaks -->", break0,break1,break2,break3,breakTop)

        createLegend(breaks);
        //console.log("create legend breaks.");

       return {"class1Array": classesArray[1], "class2Array": classesArray[2], "class3Array": classesArray[3], "class4Array": classesArray[4]};

    } //end calculateClasses
    
       
    var highlight = function (array){
      //  console.log("highlight via Leaflet");
        var classes = calculateClasses(array); 
        
//       console.log("class 1 array:", classes.class1Array);
//       console.log("class 2 array:", classes.class2Array);
//       console.log("class 3 array:", classes.class3Array);
//       console.log("class 4 array:", classes.class4Array);
        
        leafletFeatureLayer.setStyle(function (feature){
            var fillColor; //blank variable for fill color
            var strokeColor = "rgba(0,0,0,0)"; //this applies to all except where it's re-set below
            var fillOpacity = 0.6; //this applies to all except where it's re-set below
            var sectionID = feature.properties[sectionsLayerPlssField]; //pulls out section id from feature
            var strokeOpacity = 0.9;
            
            if ( classes.class4Array.indexOf(sectionID) != -1 ){ fillColor = "#8c2d04", strokeColor = "#8c2d04"}
            else if ( classes.class3Array.indexOf(sectionID) != -1){ fillColor = "#cc4c02", strokeColor = "#cc4c02"}
            else if ( classes.class2Array.indexOf(sectionID) != -1) {fillColor = "#ec7014", strokeColor = "#ec7014"}
            else if ( classes.class1Array.indexOf(sectionID) != -1 ) {fillColor = "#fe9929", strokeColor = "#fe9929"}
            //if not found in any class array, given no-value color
            else {fillOpacity = 0, strokeWeight = 0, strokeOpacity = 0};  // opposite hue, low saturation, slightly diverging to show seperation
           
            //actual style declaration for each feature using assignment from above
            return {color: strokeColor, fillColor: fillColor, fillOpacity: fillOpacity, opacity: strokeOpacity};
            
           
        });//end setStyle

    globalLayer = leafletFeatureLayer;

        if (firstLoad){
            initSmartSearch();
            firstLoad = false;
        }

        $("#loading").remove(); //stops loading feedback


        
        
        //reset the map size; this prevents it from skipping the bottom row of tiles. 
        map.invalidateSize();


        
    } //end highlight function

    
    return {
        "initialize": initialize,
        "clearMapSelection": clearMapSelection,
        "highlight": highlight 
        
    }
    
})(); //end leafletMap module 

function createLegend(breaksArray){

    //console.log(breaksArray)

        $("#legend").remove();
        $("#map").append($("<div id='legend'><div>"));
        $("#legend").append($("<div id='legendTitleContainer'><p class='legendTitle'><strong>Results per Section</strong></p></div>"));

        if (breaksArray.length == 0){
            $("#legend").append($("<div class='legendBox' id='legendBox1'></div>"));
            $("#legend").append($("<div class='legendLabel' id='legendLabel1'><p class='legendText'>0</p></div>"));
        }

            for (i in breaksArray){

                var idValue = parseInt(i) + 1;
                var lowEnd = breaksArray[i - 1];
                var highEnd = parseInt(breaksArray[i]);

                if (idValue != 1 && idValue != 2 && lowEnd != highEnd){
                    lowEnd += 1;
                };

                $("#legend").append($("<div class='legendBox' id='legendBox" + idValue + "'></div>"));
                $("#legend").append($("<div class='legendLabel' id='legendLabel" + idValue + "'></div>"));

                if (i == 0){
                    $("#legendLabel" + idValue).append($("<p class='legendText'>0</p>"));
                } else if (lowEnd == highEnd){
                    $("#legendLabel" + idValue).append($("<p class='legendText'>" + highEnd + "</p>"));
                } else {
                    $("#legendLabel" + idValue).append($("<p class='legendText'>" + lowEnd + "–" + highEnd + "</p>"));
                }

            }

}

function zoomToSelection(map){
    var bounds = L.latLngBounds([]);

    globalLayer.eachFeature(function(lyr){
        var layerBounds = lyr.getBounds();
        console.log(lyr.options)
        if (lyr.options.fillOpacity != 0){
            bounds.extend(layerBounds)
        }

    })

    map.fitBounds(bounds)
}


//called once on page load after highlight map
function initSmartSearch(){

    var possibleRockTypes = [];
    
    for (i in globalResultsArray){
        var thisType = globalResultsArray[i].attributes.RockType;
        if (possibleRockTypes.indexOf(thisType) == -1 && thisType != null){
            possibleRockTypes.push(thisType);
        }
    }

    $("#fieldDescriptionSearch").autocomplete({
            source: possibleRockTypes,
            minLength: 4,
            select: function(event, ui){
                delay(function(){
                    resetFilters();
                }, 1000);
            }, 
            appendTo: "#autocomplete"
        }); 


}

function changeMapDesign(map, layer){
    var zoomLevel = map.getZoom()
    console.log(zoomLevel)

    if (zoomLevel == 6 || zoomLevel == 7){
        var strokeWeight = 1.5
    } else if (zoomLevel == 8){
        var strokeWeight = 1
    }  else {
        var strokeWeight = 0.4
    }

    if (zoomLevel > 8){
        // layer.setStyle({color: "#757575"})
    }

    layer.setStyle({weight: strokeWeight})
    //color: "#c1c1c1", 
}


