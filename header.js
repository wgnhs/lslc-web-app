//add html content for the header (nhome link, nav bar) and the footer. 
//each html page must have a header and a footer div. 

var filtersIcon1 = '<svg version="1.1" id="filtersSvg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 55 55" enable-background="new 0 0 55 55" xml:space="preserve"><line fill="none" stroke="#000000" stroke-width="4" stroke-miterlimit="10" x1="3" y1="16" x2="51" y2="16"/><line fill="none" stroke="#000000" stroke-width="4" stroke-miterlimit="10" x1="3" y1="28" x2="51" y2="28"/><line fill="none" stroke="#000000" stroke-width="4" stroke-miterlimit="10" x1="3" y1="40" x2="51" y2="40"/><circle fill="#a8a8a8" stroke="#000000" stroke-width="4" stroke-miterlimit="10" cx="18.4" cy="15.9" r="5.6"/><circle fill="#a8a8a8" stroke="#000000" stroke-width="4" stroke-miterlimit="10" cx="36.4" cy="39.9" r="5.6"/></svg>'

var filtersIcon2 = '<svg version="1.1" id="filtersSvg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 55 55" enable-background="new 0 0 55 55" xml:space="preserve"><line fill="none" stroke="#000000" stroke-width="4" stroke-miterlimit="10" x1="3" y1="16" x2="51" y2="16"/><line fill="none" stroke="#000000" stroke-width="4" stroke-miterlimit="10" x1="3" y1="28" x2="51" y2="28"/><line fill="none" stroke="#000000" stroke-width="4" stroke-miterlimit="10" x1="3" y1="40" x2="51" y2="40"/><circle fill="#b74226" stroke="#000000" stroke-width="4" stroke-miterlimit="10" cx="18.4" cy="15.9" r="5.6"/><circle fill="#b74226" stroke="#000000" stroke-width="4" stroke-miterlimit="10" cx="36.4" cy="39.9" r="5.6"/></svg>'

var hamburgerIcon = '<svg version="1.1" id="hamburgerSvg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 55 55" enable-background="new 0 0 55 55" xml:space="preserve"><line fill="none" stroke="#000000" stroke-width="4" stroke-miterlimit="10" x1="3" y1="16" x2="51" y2="16"/><line fill="none" stroke="#000000" stroke-width="4" stroke-miterlimit="10" x1="3" y1="28" x2="51" y2="28"/><line fill="none" stroke="#000000" stroke-width="4" stroke-miterlimit="10" x1="3" y1="40" x2="51" y2="40"/></svg>'

if ($(window).width() <= 800) {
	$("body").append($("<div id='headerToggle'>" + hamburgerIcon + "</div></div>"));
	$("body").append($("<div id='sidePanel'>"));

	$("body").append($("<div id='filtersToggle'>" + filtersIcon1 + "</div>"));
}

var header = "<div id='navWrapper'>"

header += "<div id='logoContainer'> <a href='index.html'><img id='homeLogo' src='images/lslc-logo_v4_light-lake_smaller.png' alt='The Lake Superior Legacy Collection Logo'/></a></div><!--<span>geologic samples from the Lake Superior Division of the USGS, 1882-1922</span>-->";

//header += "<div class='striped-1 messageBar'><span>This webpage is currently under construction. You may encounter broken hyperlinks or other errors.</span></div>";

header += "<nav>";

//header+="<a id='navHome' href='index.html' class='navMainLink'>Home</a>";

header+="<div id='navCollection' href='#' class='navMainLink dropdownContainer'><h3>Collection</h3><div class='dropdown-content'><a id='navFilter'href='interactive-map.html'>Interactive Map</a><a id='navSample' href='hand-sample.html'>Hand Sample </a><a href='notebooks.html'>Notebooks</a><a href='thin-gallery.html'>Thin Section Gallery</a><a href='downloads.html'>Data Downloads</a></div></div>";


header+="<div id='navAbout' href='#' class='navMainLink dropdownContainer'><h3>About</h3><div class='dropdown-content'><a href='about-history.html'>Lake Superior Division, 1882–1922</a><a href='about-wgnhs.html'>Digitizing the collection</a><a href='about-collection.html'>Items in the collection</a></div></div>";


header += "<a id='navContact' href='contact.html' class='navMainLink'><h3>Contact</h3></a>";

header+="</nav></div>";

if ($(window).width() <= 800){
	$("#sidePanel").append(header);
} else {
	$("#header").append(header);
}


//may need to work on this header's responsiveness in narrow windows... figure out how to collapse to a simple list or a menu button. 

var footer = "<p> Lake Superior Legacy Collection <br/> <a href='http://wgnhs.uwex.edu' target='_blank'>Wisconsin Geological and Natural History Survey</a> <br/><a href='http://uwex.edu' target='_blank'>University of Wisconsin-Extension</a></p>";

$("#footer").append(footer);

//------------------------collaspable button functionality
var sidePanelOn = false;
var filtersPanelOn = false;

var hoverColorOff = "#828282";
var hoverColorOn = "#773322";
var onColor = "#b74226";
var offColor = "#a8a8a8";

var hoverShadow = "0px 0px 8px 4px rgba(0,0,0,0.7)";
var regShadow = "0px 0px 5px 3px rgba(0,0,0,0.5)";

$("#headerToggle").click(function(){
	if (filtersPanelOn){
		pressFiltersToggle()
	}
	pressHeaderToggle();
})

$("#filtersToggle").click(function(){
	if (sidePanelOn){
		pressHeaderToggle()
	}
	pressFiltersToggle();
})

function pressHeaderToggle(){
	if (sidePanelOn){
		sidePanelOn = false;
		$("#sidePanel").css("visibility","hidden")
			$("#headerToggle").css({"background-color":offColor,"box-shadow":regShadow})
			$("#headerToggle").hover(function(){
                    $(this).css({"background-color":hoverColorOff,"box-shadow":hoverShadow})
            }, function(){
                    $(this).css({"background-color":offColor,"box-shadow":regShadow})
            })
	} else {
		sidePanelOn = true;
		$("#sidePanel").css("visibility","visible")
			$("#headerToggle").css({"background-color":onColor,"box-shadow":"none"})
			$("#headerToggle").hover(function(){
                    $(this).css({"background-color":hoverColorOn,"box-shadow":"none"})
            }, function(){
                    $(this).css({"background-color":onColor,"box-shadow":"none"})
            })
	}
}

function pressFiltersToggle(){
	if (filtersPanelOn){
		filtersPanelOn = false;
		$("#leftPanel").css("visibility","hidden")
			$("#filtersSvg").remove()
			$("#filtersToggle").append($(filtersIcon1))
			$("#filtersToggle").css({"background-color":offColor,"box-shadow":regShadow})
			$("#filtersToggle").hover(function(){
                    $(this).css({"background-color":hoverColorOff,"box-shadow":hoverShadow})
            }, function(){
                    $(this).css({"background-color":offColor,"box-shadow":regShadow})
            })
	} else {
		filtersPanelOn = true;
		$("#leftPanel").css("visibility","visible")
			$("#filtersSvg").remove()
			$("#filtersToggle").append($(filtersIcon2))
			$("#filtersToggle").css({"background-color":onColor,"box-shadow":"none"})
			$("#filtersToggle").hover(function(){
                    $(this).css({"background-color":hoverColorOn,"box-shadow":"none"})
            }, function(){
                    $(this).css({"background-color":onColor,"box-shadow":"none"})
            })
	}
}



