var resultsManager = (function(){
    
  
    var resultsPage = function (pageNum){
    //pageNum is an integer beginning at 1 
    
    }
    var matchSection = function (clickSectionID){
        //sectionID comes from the UID of a clicked section. 
        //this function will pull all results that are in that section, using the result's sectionID attribute. 
        console.log("match section", clickSectionID);
        
        var sectionResults = [];
        
        for (i in globalResultsArray){
          //  console.log("result section", globalResultsArray[i].attributes.SectionId);
            if (globalResultsArray[i].attributes.SectionId == clickSectionID){
                sectionResults.push(globalResultsArray[i]);
            }
            
        }
        return sectionResults; 
        
    }

    return {
      
        "resultsPage": resultsPage, 
        "matchSection": matchSection 
       
    }
    
})();