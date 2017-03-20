var modal = (function(){
    
    /* Functions for closing the modal */
    window.onclick = function(event) {
        if (event.target == modalBackground) {
      //      console.log("clicked modalBackground.");
            modal.close();
        }
    }
    /*for the closemodal button*/
     $('#modalBackground').on('click', '#closemodal', function() {
         //   console.log("clicked closebutton.");
            modal.close();   
    });
    
    
    var modalContent; 
    
    
    
    var showThinSection = function (id){
        console.log("showThinSection", id);
            var map = new L.Map('photo').setView(new L.LatLng(0,0), 0);
            var sectionNum = id;
            var urlRoot = 'http://mp-web2t/lslc/assets/thin-section/zoomify/';
            var photoWidth = 2700;
            var photoHeight = 1800;

            
            var ppl = new ZoomifyLayer(urlRoot + sectionNum + 'ppl/', {
                width: photoWidth,
                height: photoHeight,
                //tolerance: 0.8,
                opacity: 1.0,
                attribution: 'Photo: Wisconsin Geological Survey'
            }).addTo(map);

            var xpl = new ZoomifyLayer(urlRoot + sectionNum + 'xpl/', {
                width: photoWidth,
                height: photoHeight,
                //tolerance: 0.8,
                //opacity: 0.0,
                attribution: 'Photo: Wisconsin Geological Survey'
            });

            xpl.setOpacity(0.0).addTo(map);

            $("#slider").slider({
                value: 0,
                slide: function (e, ui) {
                    xpl.setOpacity(ui.value / 100);
                }
            });

    };
    
    var thinSectionViewer = function(id){
        console.log("show thin section viewer for ID", id);
        modalContent = "<span id='closemodal' class='close'>x</span>"; 
        
       
        
        //append the needed divs 
        modalContent += " <h2 id='header'></h2>";
        modalContent += "<p>Drag the slider to shift from plane-polarized light to cross-polarized light. Zoom to view in detail. </p>"
       // modalContent += "<div id='topSection'>"
        modalContent += "<div id='sampleLink'></div>";
        modalContent += "<div id='sliderContainer'><label class='align-right'>PPL</label><div id='slider'><div class='ui-slider-handle'></div></div><label>XPL</label></div>";
      //  modalContent += "</div>"
        modalContent += "<div id='photo'></div>";

        $("#modal-content").append(modalContent);
        
        
        $('#header').text('Thin Section #' + id);
        $('#sampleLink').append("<div>part of Sample #"+ id +"<br/>(click here to view record)</div><img class='sampleChevron' src='images/chevron_right_gw.png' alt=''>");
        
        //populate the parts of the thin section viewer: 
        showThinSection(id);
            
        
        //make the modal visible. 
        modalBackground.style.visibility = "visible";
    };
    var close = function(){
        console.log("close modal.");
        
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