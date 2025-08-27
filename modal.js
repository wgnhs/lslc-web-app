var modal = (function(){
    
    /* Functions for closing the modal */
    window.onclick = function(event) {
        if (event.target == modalBackground) {

            modal.close();
        }
    }
    /*for the closemodal button*/
     $('#modalBackground').on('click', '#closemodal', function() {

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
         
            var urlRoot = 'https://data.wgnhs.wisc.edu/lake-superior-legacy/assets/thin-section-images/';
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
    
    var thinSectionViewer = function (thinSectionNumber, handSampleNumber) {
        console.log("show thin section viewer for ID", thinSectionNumber);
        modalContent = "<span id='closemodal' class='close' aria-label='close'>x</span>"; 
        
       
        
        //append the needed divs 
        modalContent += " <h2 id='modalHeader'></h2>";
        modalContent += "<p>Drag the slider to shift from plane-polarized light to cross-polarized light. Zoom to view in detail. </p>"
       // modalContent += "<div id='topSection'>"
        modalContent += "<div id='sampleLink'></div>";
        modalContent += "<div id='sliderContainer'><label>PPL</label><div id='slider'><div class='ui-slider-handle'></div></div><label>XPL</label></div>";
      //  modalContent += "</div>"
        modalContent += "<div id='photo'></div>";

        $("#modal-content").append(modalContent);
        
        
        $('#modalHeader').text('Thin Section #' + thinSectionNumber);
        $('#sampleLink').append("<a href='hand-sample.html#"+handSampleNumber+"' target='_blank'><div>part of Sample #"+ handSampleNumber +"<br/>(click here to view details)</div><img class='sampleChevron' src='images/chevron_right_g.png' alt='view sample details'></a>");
        
        //populate the parts of the thin section viewer: 
        zoomifyThinSection(thinSectionNumber);
            
        
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
