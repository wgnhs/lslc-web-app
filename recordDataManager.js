var recordDataManager = (function(){ 
    
    var clear = function(){
        sampleRecordData = {};
        sampleRecordData.location = {};
        sampleRecordData.thinSections =[];
        sampleRecordData.lithologies = [];
    
    }


    return {
        "clear": clear
    
    }
    
})();