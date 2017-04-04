var leafletMap = (function(){
    
    
    var leafletFeatureLayer;
    var drawnItems; 
    var customDeleteButton;
    
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

        //sample filter object
        var incomingSampleFilters = {
        "mapSectionsInput": null, 
        "rockTypeInput": "quartzite", 
        "countyInput": "", 
        "handSampleAvailabilityInput": null, 
        "thinSectionAvailabilityInput": "1", 
        "stateInput": null, 
        "notesInput": null, 
        "notebookInput": null, 
        "notebookPageInput": null, 
        "WGNHSInput": null
        };

        //converts to object elements that corrospond with sectionResults
        //omits filters that dont corrospond with sectionResult element
        var sampleFilters = {
            "RockType": incomingSampleFilters.rockTypeInput,
            "County": incomingSampleFilters.countyInput,
            "HandSampleCount": incomingSampleFilters.handSampleAvailabilityInput,
            "ThinSectionCount": incomingSampleFilters.thinSectionAvailabilityInput,
            "State": incomingSampleFilters.stateInput,
            "NotebookNum": incomingSampleFilters.notebookInput,
            "NotebookPage": incomingSampleFilters.notebookPageInput,
            "WgnhsId": incomingSampleFilters.WGNHSInput
        }

        //sectionResults - copied and pasted from exampleSectionResults
        //normally would come from method
        var sectionResults = [{"attributes":{"OBJECTID":1466,"SampleId":2747,"SectionId":3171,"WgnhsId":26700009,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":null,"QuarterQuarter":null,"County":"Iron","LocNote":"Penokee Iron Range","RockType":null,"Notes":null,"NotebookPage":"31","Chemistry":null,"NotebookNum":"35","ThinSectionCount":1,"HandSampleCount":1,"HandSampleCatalogNumber":"9083"}},{"attributes":{"OBJECTID":1467,"SampleId":2748,"SectionId":3171,"WgnhsId":26700010,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":null,"QuarterQuarter":null,"County":"Iron","LocNote":"Penokee Iron Range","RockType":"Massive quartzite","Notes":null,"NotebookPage":"31","Chemistry":null,"NotebookNum":"35","ThinSectionCount":1,"HandSampleCount":1,"HandSampleCatalogNumber":"9084"}},{"attributes":{"OBJECTID":1468,"SampleId":2749,"SectionId":3171,"WgnhsId":26700176,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":null,"QuarterQuarter":null,"County":"Iron","LocNote":"Penokee Iron Range","RockType":"Medium grained quartzite","Notes":null,"NotebookPage":"32","Chemistry":null,"NotebookNum":"35","ThinSectionCount":1,"HandSampleCount":null,"HandSampleCatalogNumber":"9086"}},{"attributes":{"OBJECTID":1469,"SampleId":2750,"SectionId":3171,"WgnhsId":26700012,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":null,"QuarterQuarter":null,"County":"Iron","LocNote":"Penokee Iron Range","RockType":"Siliceous slate and quartzite","Notes":null,"NotebookPage":"32","Chemistry":null,"NotebookNum":"35","ThinSectionCount":1,"HandSampleCount":1,"HandSampleCatalogNumber":"9088"}},{"attributes":{"OBJECTID":1470,"SampleId":2751,"SectionId":3171,"WgnhsId":26700165,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":null,"QuarterQuarter":null,"County":"Iron","LocNote":"Penokee Iron Range","RockType":"Purple siliceous slate","Notes":null,"NotebookPage":"33","Chemistry":null,"NotebookNum":"35","ThinSectionCount":1,"HandSampleCount":null,"HandSampleCatalogNumber":"9089"}},{"attributes":{"OBJECTID":1471,"SampleId":2752,"SectionId":3171,"WgnhsId":26700166,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":null,"QuarterQuarter":null,"County":"Iron","LocNote":"Penokee Iron Range","RockType":"Schist conglomerate","Notes":null,"NotebookPage":"37","Chemistry":null,"NotebookNum":"35","ThinSectionCount":1,"HandSampleCount":null,"HandSampleCatalogNumber":"9093"}},{"attributes":{"OBJECTID":1472,"SampleId":2753,"SectionId":3171,"WgnhsId":26700017,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":null,"QuarterQuarter":null,"County":"Iron","LocNote":"Penokee Iron Range","RockType":"Conglomerate","Notes":null,"NotebookPage":"37","Chemistry":null,"NotebookNum":"35","ThinSectionCount":1,"HandSampleCount":1,"HandSampleCatalogNumber":"9097"}},{"attributes":{"OBJECTID":1473,"SampleId":2754,"SectionId":3171,"WgnhsId":26700167,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":null,"QuarterQuarter":null,"County":"Iron","LocNote":"Penokee Iron Range","RockType":null,"Notes":null,"NotebookPage":"38","Chemistry":null,"NotebookNum":"35","ThinSectionCount":1,"HandSampleCount":null,"HandSampleCatalogNumber":"9099"}},{"attributes":{"OBJECTID":1474,"SampleId":2755,"SectionId":3171,"WgnhsId":26700168,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":null,"QuarterQuarter":null,"County":"Iron","LocNote":"Penokee Iron Range","RockType":"Mica slate","Notes":null,"NotebookPage":"39","Chemistry":null,"NotebookNum":"35","ThinSectionCount":1,"HandSampleCount":null,"HandSampleCatalogNumber":"9107"}},{"attributes":{"OBJECTID":1556,"SampleId":2860,"SectionId":3171,"WgnhsId":26700015,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":null,"QuarterQuarter":null,"County":"Iron","LocNote":"Penokee Iron Range","RockType":"Schist","Notes":null,"NotebookPage":"37","Chemistry":null,"NotebookNum":"35","ThinSectionCount":1,"HandSampleCount":1,"HandSampleCatalogNumber":"9095"}},{"attributes":{"OBJECTID":1557,"SampleId":2861,"SectionId":3171,"WgnhsId":26700016,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":null,"QuarterQuarter":null,"County":"Iron","LocNote":"Penokee Iron Range","RockType":"Schist","Notes":null,"NotebookPage":"37","Chemistry":null,"NotebookNum":"35","ThinSectionCount":1,"HandSampleCount":1,"HandSampleCatalogNumber":"9096"}},{"attributes":{"OBJECTID":1558,"SampleId":2862,"SectionId":3171,"WgnhsId":26700019,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":null,"QuarterQuarter":null,"County":"Iron","LocNote":"Penokee Iron Range","RockType":null,"Notes":null,"NotebookPage":"38","Chemistry":null,"NotebookNum":"35","ThinSectionCount":1,"HandSampleCount":1,"HandSampleCatalogNumber":"9100"}},{"attributes":{"OBJECTID":1559,"SampleId":2863,"SectionId":3171,"WgnhsId":26700149,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":null,"QuarterQuarter":null,"County":"Iron","LocNote":"Penokee Iron Range","RockType":null,"Notes":null,"NotebookPage":"38","Chemistry":"Yes","NotebookNum":"35","ThinSectionCount":1,"HandSampleCount":null,"HandSampleCatalogNumber":"9101"}},{"attributes":{"OBJECTID":1560,"SampleId":2864,"SectionId":3171,"WgnhsId":26700020,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":null,"QuarterQuarter":null,"County":"Iron","LocNote":"Penokee Iron Range","RockType":null,"Notes":null,"NotebookPage":"38","Chemistry":null,"NotebookNum":"35","ThinSectionCount":1,"HandSampleCount":1,"HandSampleCatalogNumber":"9102"}},{"attributes":{"OBJECTID":1561,"SampleId":2865,"SectionId":3171,"WgnhsId":26700150,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":null,"QuarterQuarter":null,"County":"Iron","LocNote":"Penokee Iron Range","RockType":null,"Notes":null,"NotebookPage":"38","Chemistry":null,"NotebookNum":"35","ThinSectionCount":1,"HandSampleCount":null,"HandSampleCatalogNumber":"9103"}},{"attributes":{"OBJECTID":1562,"SampleId":2866,"SectionId":3171,"WgnhsId":26700151,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":null,"QuarterQuarter":null,"County":"Iron","LocNote":"Penokee Iron Range","RockType":"Chloritic gneiss","Notes":null,"NotebookPage":"38","Chemistry":null,"NotebookNum":"35","ThinSectionCount":1,"HandSampleCount":null,"HandSampleCatalogNumber":"9106"}},{"attributes":{"OBJECTID":1944,"SampleId":3263,"SectionId":3171,"WgnhsId":26700014,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":null,"QuarterQuarter":null,"County":"Iron","LocNote":"Penokee Iron Range","RockType":"Transition from conglomerate to siliceous slate","Notes":null,"NotebookPage":"37","Chemistry":null,"NotebookNum":"35","ThinSectionCount":1,"HandSampleCount":1,"HandSampleCatalogNumber":"9094"}},{"attributes":{"OBJECTID":1947,"SampleId":3267,"SectionId":3171,"WgnhsId":26700120,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":"SE","QuarterQuarter":"SE","County":"Iron","LocNote":"Penokee Range, Iron County","RockType":"Schist","Notes":null,"NotebookPage":"7","Chemistry":null,"NotebookNum":"39","ThinSectionCount":1,"HandSampleCount":null,"HandSampleCatalogNumber":"9173"}},{"attributes":{"OBJECTID":1948,"SampleId":3268,"SectionId":3171,"WgnhsId":26700121,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":"SE","QuarterQuarter":"SE","County":"Iron","LocNote":"Penokee Range, Iron County","RockType":"Schist","Notes":null,"NotebookPage":"7","Chemistry":null,"NotebookNum":"39","ThinSectionCount":1,"HandSampleCount":null,"HandSampleCatalogNumber":"9174"}},{"attributes":{"OBJECTID":1949,"SampleId":3269,"SectionId":3171,"WgnhsId":26700122,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":"SE","QuarterQuarter":"SE","County":"Iron","LocNote":"Penokee Range, Iron County","RockType":"Conglomerate","Notes":null,"NotebookPage":"7","Chemistry":null,"NotebookNum":"39","ThinSectionCount":1,"HandSampleCount":null,"HandSampleCatalogNumber":"9177"}},{"attributes":{"OBJECTID":1950,"SampleId":3270,"SectionId":3171,"WgnhsId":26700111,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":"SE","QuarterQuarter":"SE","County":"Iron","LocNote":"Penokee and Gogebic Ranges","RockType":null,"Notes":null,"NotebookPage":"6","Chemistry":null,"NotebookNum":"39","ThinSectionCount":1,"HandSampleCount":null,"HandSampleCatalogNumber":"9179"}},{"attributes":{"OBJECTID":2624,"SampleId":4161,"SectionId":3171,"WgnhsId":null,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":"SW","QuarterQuarter":"SW","County":null,"LocNote":"Penokee Iron Range","RockType":"Magnetitic quartzite","Notes":"Section line between 19, 24 Ranges 1, 2","NotebookPage":"29","Chemistry":null,"NotebookNum":"35","ThinSectionCount":null,"HandSampleCount":1,"HandSampleCatalogNumber":"9081"}},{"attributes":{"OBJECTID":2631,"SampleId":4169,"SectionId":3171,"WgnhsId":26700021,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":null,"QuarterQuarter":null,"County":"Iron","LocNote":"Penokee Iron Range","RockType":"Ferruginous quartzite","Notes":null,"NotebookPage":"38","Chemistry":null,"NotebookNum":"35","ThinSectionCount":null,"HandSampleCount":1,"HandSampleCatalogNumber":"9104"}},{"attributes":{"OBJECTID":11736,"SampleId":19646,"SectionId":3171,"WgnhsId":26700011,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":null,"QuarterQuarter":null,"County":"Iron","LocNote":"Penokee Iron Range","RockType":"Siliecous slate","Notes":null,"NotebookPage":"32","Chemistry":null,"NotebookNum":"35","ThinSectionCount":null,"HandSampleCount":1,"HandSampleCatalogNumber":"9085"}},{"attributes":{"OBJECTID":11737,"SampleId":19647,"SectionId":3171,"WgnhsId":26700013,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":null,"QuarterQuarter":null,"County":"Iron","LocNote":"Penokee Iron Range","RockType":"Chloritic schist","Notes":null,"NotebookPage":"34","Chemistry":null,"NotebookNum":"35","ThinSectionCount":null,"HandSampleCount":1,"HandSampleCatalogNumber":"9092"}},{"attributes":{"OBJECTID":11738,"SampleId":19648,"SectionId":3171,"WgnhsId":26700018,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":null,"QuarterQuarter":null,"County":"Iron","LocNote":"Penokee Iron Range","RockType":"Comglomerate pebbles","Notes":null,"NotebookPage":"37","Chemistry":null,"NotebookNum":"35","ThinSectionCount":null,"HandSampleCount":1,"HandSampleCatalogNumber":"9098"}},{"attributes":{"OBJECTID":11740,"SampleId":19652,"SectionId":3171,"WgnhsId":26700039,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":null,"QuarterQuarter":null,"County":"Iron","LocNote":"Penokee Range, Iron County","RockType":null,"Notes":null,"NotebookPage":"6","Chemistry":null,"NotebookNum":"39","ThinSectionCount":null,"HandSampleCount":1,"HandSampleCatalogNumber":"9181"}},{"attributes":{"OBJECTID":11809,"SampleId":19762,"SectionId":3171,"WgnhsId":26700066,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":null,"QuarterQuarter":null,"County":"Iron","LocNote":"Gogebic Iron Range","RockType":null,"Notes":null,"NotebookPage":"48","Chemistry":null,"NotebookNum":"73","ThinSectionCount":null,"HandSampleCount":1,"HandSampleCatalogNumber":"14704"}},{"attributes":{"OBJECTID":16696,"SampleId":27154,"SectionId":3171,"WgnhsId":null,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":null,"QuarterQuarter":null,"County":null,"LocNote":"Penokee Iron Range","RockType":"Siliceous Slate / Quartzite","Notes":null,"NotebookPage":"32","Chemistry":null,"NotebookNum":"35","ThinSectionCount":null,"HandSampleCount":null,"HandSampleCatalogNumber":"9087"}},{"attributes":{"OBJECTID":16697,"SampleId":27155,"SectionId":3171,"WgnhsId":null,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":null,"QuarterQuarter":null,"County":null,"LocNote":"Penokee Iron Range","RockType":"Siliceous Slate","Notes":null,"NotebookPage":"33","Chemistry":null,"NotebookNum":"35","ThinSectionCount":null,"HandSampleCount":null,"HandSampleCatalogNumber":"9090"}},{"attributes":{"OBJECTID":16698,"SampleId":27156,"SectionId":3171,"WgnhsId":null,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":null,"QuarterQuarter":null,"County":null,"LocNote":"Penokee Iron Range","RockType":"Chloritic Schist or Gneiss","Notes":null,"NotebookPage":"33","Chemistry":null,"NotebookNum":"35","ThinSectionCount":null,"HandSampleCount":null,"HandSampleCatalogNumber":"9091"}},{"attributes":{"OBJECTID":16719,"SampleId":27177,"SectionId":3171,"WgnhsId":null,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":null,"QuarterQuarter":null,"County":null,"LocNote":"Penokee Range, Iron County","RockType":"Scist","Notes":null,"NotebookPage":"7","Chemistry":null,"NotebookNum":"39","ThinSectionCount":null,"HandSampleCount":null,"HandSampleCatalogNumber":"9176"}},{"attributes":{"OBJECTID":16720,"SampleId":27178,"SectionId":3171,"WgnhsId":null,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":null,"QuarterQuarter":null,"County":null,"LocNote":"Penokee Range, Iron County","RockType":null,"Notes":null,"NotebookPage":"7","Chemistry":null,"NotebookNum":"39","ThinSectionCount":null,"HandSampleCount":null,"HandSampleCatalogNumber":"9178"}},{"attributes":{"OBJECTID":16721,"SampleId":27179,"SectionId":3171,"WgnhsId":null,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":null,"QuarterQuarter":null,"County":null,"LocNote":"Penokee Range, Iron County","RockType":"Calcite nests in Schist","Notes":null,"NotebookPage":"6","Chemistry":null,"NotebookNum":"39","ThinSectionCount":null,"HandSampleCount":null,"HandSampleCatalogNumber":"9180"}},{"attributes":{"OBJECTID":17972,"SampleId":278153,"SectionId":3171,"WgnhsId":26700008,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":null,"QuarterQuarter":null,"County":"Iron","LocNote":"Penokee Iron Range","RockType":"Coarse quartzite","Notes":null,"NotebookPage":"31","Chemistry":null,"NotebookNum":"35","ThinSectionCount":1,"HandSampleCount":1,"HandSampleCatalogNumber":"9082"}},{"attributes":{"OBJECTID":17973,"SampleId":278154,"SectionId":3171,"WgnhsId":26700022,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":null,"QuarterQuarter":null,"County":"Iron","LocNote":"Penokee Iron Range","RockType":"Siliceous slate","Notes":null,"NotebookPage":"38","Chemistry":null,"NotebookNum":"35","ThinSectionCount":null,"HandSampleCount":1,"HandSampleCatalogNumber":"9105"}},{"attributes":{"OBJECTID":17977,"SampleId":278158,"SectionId":3171,"WgnhsId":26700134,"State":"Wisconsin","Township":"45","Range":"1","Direction":"E","Section_":"19","Quarter":"SE","QuarterQuarter":"SE","County":"Iron","LocNote":"Penokee Range, Iron County","RockType":"Matrix","Notes":null,"NotebookPage":"7","Chemistry":null,"NotebookNum":"39","ThinSectionCount":2,"HandSampleCount":null,"HandSampleCatalogNumber":"9175"}}]



        var appliedFilters = {}; //creates empty object
        //loop iterates through filters object and popuplates applied filters by checking for nul values / empty strings and not writing if so
        for (var prop in sampleFilters) {
            if (sampleFilters[prop] != "" && sampleFilters[prop] != null) {
                appliedFilters[prop] = sampleFilters[prop];
            }

        }

        console.log(appliedFilters);

        //establishes popup content variable, adding in header besaed on SectionId
        var content = "<ul>";

        //loops through samples in the section adding a line for each of them
        for (i in sectionResults) {

            //maybe better way to do this: adjusts for multiple hand samples by changing the value in the sectionResults, that way they will match even if there's more than specified
            if (sectionResults[i].attributes.HandSampleCount >= sampleFilters.HandSampleCount) {
                sectionResults[i].attributes.HandSampleCount = sampleFilters.HandSampleCount
            }

            //maybe better way to do this: adjusts for multiple thin sections by changing the value in the sectionResults, that way they will match even if there's more than specified
            if (sectionResults[i].attributes.ThinSectionCount >= sampleFilters.ThinSectionCount) {
                sectionResults[i].attributes.ThinSectionCount = sampleFilters.ThinSectionCount
            }

            var listedSampleId = sectionResults[i].attributes.SampleId;
            var listedRockType = sectionResults[i].attributes.RockType;
            if (listedRockType == null){ listedRockType = "Unknown";} //checks for null value

            //establishes a boolean to check whether or not the sample meets the filter criteria, starts off as true. Changed below
            var writeToPopup = true; 
            
            //loop iterates through applied filters object
            for (var prop in appliedFilters) {
                //checks to see if the filter are null (error saving for indexOf)
                //if it is, it will not write to popup
                if (sectionResults[i]["attributes"][prop] == null){
                    writeToPopup = false;
                } else {
                    //if not null, checks for comparison with selected filter 
                    if (sectionResults[i]["attributes"][prop].indexOf(appliedFilters[prop]) == -1){
                        //if the search params are not contained in string will not write
                        writeToPopup = false;
                    }
                }
            }
 
            //creates a new li with a link to the smaples page
            //RENDER POPUP WITH SAMPLE FILTERS APPLIED
            if (writeToPopup){
                content = content + "<li>" + listedRockType + ": <a href='sampleRecord.html#" + listedSampleId + "'>" + listedSampleId + "</a></li>";
            }

            //RENDER POPUP WITH ALL 37 SAMPLES
            // content = content + "<li>" + listedRockType + ": <a href='sampleRecord.html#" + listedSampleId + "'>" + listedSampleId + "</a></li>";

        }

        content = content + "</ul>"

        return content;

        //opens popup with content when layer (defined on line 28) is clicked
        //layer.bindPopup(content).openPopup();

        // layer.layers.1.feature.properties.UID

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
        
    } //end highlight function
    
    return {
        "initialize": initialize,
        "clearMapSelection": clearMapSelection,
        "highlight": highlight
    }
    
})();