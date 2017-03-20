var leafletMap = (function(){
    
    
    var leafletFeatureLayer;
    
    var initialize = function(){
        console.log("Leaflet map setup."); 
        
       
        
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
        console.log("set up leaflet map buttons.");
        
        // FeatureGroup is to store editable layers
        var drawnItems = new L.FeatureGroup;
        var drawnLayer;
        map.addLayer(drawnItems);
        
 
         var drawControl = new L.Control.Draw({
             edit: false,
           //  {
            //     featureGroup: drawnItems
                 //,
                 //poly: {allowIntersection: false}
           //  },
             draw: {
                 marker: false, polyline: false, polygon: false, circle: false, rectangle: {repeatMode: false}
                 //,
                // polygon: {allowIntersection: false}
             }
             
         });
         map.addControl(drawControl);
        
        map.on (L.Draw.Event.DRAWSTART, function(){
            console.log("clear all ", drawnLayer);
            
           // drawnItems.clearLayers(); //seems to do nothing
           //map.removeLayer(drawnLayer); //nothing 
            //map.removeLayer(drawnItems); //nothing
            //L.EditToolbar.Delete.removeAllLayers(); //not a function
            
        });
        
        map.on(L.Draw.Event.CREATED, function (e) {
            console.log("draw stop");

           var layer = e.layer;

          drawnLayer = map.addLayer(layer);
            
            
        });
        
       
    }
    
    function updateMapFilter(){
        console.log("update map filter");
    }
    
    function calculateClasses(array){
        console.log("calculate classes.");
    }
    
    function styleSections (){
        console.log ("style sections");
    }
    
    var highlight = function (array){
        console.log("highlight via Leaflet");
        calculateClasses(array); 
    }
    
    return {
        "initialize": initialize,
        "highlight": highlight
    }
    
})();