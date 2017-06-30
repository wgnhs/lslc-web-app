//add html content for the header (nhome link, nav bar) and the footer. 
//each html page must have a header and a footer div. 

var header = "<div id='navWrapper'>"

header += "<div id='logoContainer'> <a href='index.html'><img id='homeLogo' src='images/lslc-logo_v4_light-lake_smaller.png' alt='The Lake Superior Legacy Collection Logo'/></a></div>";

header+= "<label for='expand-menu-checkbox' id='expand-menu-icon'><img src='images/menu-white.png' alt='menu icon'></label>    <input type='checkbox' id='expand-menu-checkbox' role='button'>";

header += "<nav>";

//header+="<a id='navHome' href='index.html' class='navMainLink'>Home</a>";

header+="<div id='navCollection' class='navMainLink dropdownContainer'><h3>Collection</h3><div class='dropdown-content'><a id='navFilter' href='interactive-map.html'>Interactive Map</a><a id='navSample' href='hand-sample.html'>Hand Sample </a><a href='notebooks.html'>Notebooks</a><a href='thin-sections.html'>Thin Section Gallery</a><a href='downloads.html'>Data Downloads</a></div></div>";


header+="<div id='navAbout' href='#' class='navMainLink dropdownContainer'><h3>About</h3><div class='dropdown-content'><a href='about-history.html'>Lake Superior Division, 1882–1922</a><a href='about-wgnhs.html'>Digitizing the collection</a><a href='about-collection.html'>Items in the collection</a></div></div>";


header += "<a id='navContact' href='contact.html' class='navMainLink'><h3>Contact</h3></a>";

header+="</nav></div>";

$("#header").append(header);

//may need to work on this header's responsiveness in narrow windows... figure out how to collapse to a simple list or a menu button. 

var footer = "<p> Lake Superior Legacy Collection <br/> <a href='http://wgnhs.uwex.edu' target='_blank'>Wisconsin Geological and Natural History Survey</a> <br/><a href='http://uwex.edu' target='_blank'>University of Wisconsin-Extension</a></p>";

$("#footer").append(footer);