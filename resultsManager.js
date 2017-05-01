var resultsManager = (function(){
    
    var clearAll = function(){
        globalResultsArray = [];
    }
    
    var resultsPage = function (pageNum){
    //pageNum is an integer beginning at 1 
    
    }
    var matchSection = function (clickSectionID){
        //sectionID comes from the UID/PlssId of a clicked section. 
        //this function will pull all results that are in that section, using the result's PlssId/sectionID attribute. 
        console.log("match section", clickSectionID);
        
        var sectionResults = [];
        
        for (i in globalResultsArray){
          //  console.log("result section", globalResultsArray[i].attributes[PlssField]);
            if (globalResultsArray[i].attributes[PlssField] == clickSectionID){
                sectionResults.push(globalResultsArray[i]);
            }
            
        }
        return sectionResults; 
        
    }
    
    function add(additionalFeatures){
        globalResultsArray = globalResultsArray.concat(additionalFeatures);
    }

    return {
      
        "resultsPage": resultsPage, 
        "matchSection": matchSection, 
        "clearAll": clearAll, 
        "add": add
    }
    
})();