//add html content for the header (nhome link, nav bar) and the footer. 
//each html page must have a header and a footer div. 

var header = "<a href='index.html'><img src='images/LSLCLogo_v3_lightLake.png' alt='The Lake Superior Legacy Collection Logo'/></a><!--<span>geologic samples from the Lake Superior Division of the USGS, 1882-1922</span>-->";

header += "<div class='striped-1 messageBar'><span>This webpage is currently under construction. You may encounter broken hyperlinks or other errors.</span></div>";

header += "<nav>";

header+="<a id='navHome' href='index.html' class='navMainLink'>Home</a>";

header+="<div id='navCollection' href='#' class='navMainLink dropdownContainer'>Collection<div class='dropdown-content'><a id='navFilter'href='interactive-map.html'>Interactive Map</a><a id='navSample' href='hand-sample.html'>Hand Sample </a><a href='notebooks.html'>Notebooks</a><a href='downloads.html'>Data Downloads</a></div>";

header+="</div><div id='navAbout' href='#' class='navMainLink dropdownContainer'>About<div class='dropdown-content'><a href='about-history.html'>Lake Superior Division, 1882-1922</a><a href='about-wgnhs.html'>WGNHS and the LSLC</a><a href='about-collection.html'>The collection</a></div></div>";

header += "<a id='navContact' href='contact.html' class='navMainLink'>Contact</a>";

header+="</nav>";

$("#header").append(header);

//may need to work on this header's responsiveness in narrow windows... figure out how to collapse to a simple list or a menu button. 

var footer = "<p> Lake Superior Legacy Collection <br/> Wisconsin Geological and Natural History Survey <br/>University of Wisconsin Extension </p>";

$("#footer").append(footer);