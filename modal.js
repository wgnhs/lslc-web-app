var modal = (function(){
    
    /* Functions for closing the modal */
    window.onclick = function(event) {
        if (event.target == modalBackground) {
            console.log("clicked modalBackground.");
            modal.close();
        }
    }
    /*for the closemodal button*/
     $('#modalBackground').on('click', '#closemodal', function() {
            console.log("close modal via background.");
            modal.close();   
    });
    
    
    var modalContent; 
    
    
    
    var zoomifyThinSection = function (id){
        console.log("showThinSection", id);
            var thinSectionMap = new L.Map('photo'
                      , {crs: L.CRS.Simple, minZoom: -5}
                  );
                //.setView(new L.LatLng(0,0), 0);
            var sectionNum = id;
         
            var urlRoot = 'https://geodata.wgnhs.uwex.edu/lake-superior-legacy/assets/thin-section-images/';
            var photoWidth = 2700;
            var photoHeight = 1800;
            var bounds = [[0,0], [4000,6000]];
        
            var ppl = L.imageOverlay(urlRoot + sectionNum + 'ppl.jpg', bounds).addTo(thinSectionMap);
            var xpl = L.imageOverlay(urlRoot + sectionNum + 'xpl.jpg', bounds);
            
            xpl.setOpacity(0.0).addTo(thinSectionMap);
            thinSectionMap.fitBounds(bounds);

            $("#slider").slider({
                value: 0,
                slide: function (e, ui) {
                    xpl.setOpacity(ui.value / 100);
                }
            });

    };
    
    var thinSectionViewer = function (id) {
        console.log("show thin section viewer for ID", id);
        modalContent = "<span id='closemodal' class='close'>x</span>"; 
        
       
        
        //append the needed divs 
        modalContent += " <h2 id='modalHeader'></h2>";
        modalContent += "<p>Drag the slider to shift from plane-polarized light to cross-polarized light. Zoom to view in detail. </p>"
       // modalContent += "<div id='topSection'>"
        modalContent += "<div id='sampleLink'></div>";
        modalContent += "<div id='sliderContainer'><label class='align-right'>PPL</label><div id='slider'><div class='ui-slider-handle'></div></div><label>XPL</label></div>";
      //  modalContent += "</div>"
        modalContent += "<div id='photo'></div>";

        $("#modal-content").append(modalContent);
        
        
        $('#modalHeader').text('Thin Section #' + id);
        $('#sampleLink').append("<div>part of Sample #"+ id +"<br/>(click here to view record)</div><img class='sampleChevron' src='images/chevron_right_gw.png' alt=''>");
        
        //populate the parts of the thin section viewer: 
        zoomifyThinSection(id);
            
        
        //make the modal visible. 
        modalBackground.style.visibility = "visible";
    };
    var close = function(){
        console.log("close modal via close button.");
        
        //clear all contents of the modal... 
        $("#modal-content").html("");
        //make it invisible
        modalBackground.style.visibility = 'hidden';
    };
    
    return {
        
        thinSectionViewer: thinSectionViewer, //pass an id value as the argument
        close: close
        
        
    }; 
    
})();