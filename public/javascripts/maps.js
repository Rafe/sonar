
if (GBrowserIsCompatible()) {
  // Display the map, with some controls
  var map = new GMap(document.getElementById("map"));
  map.addControl(new GLargeMapControl());
  map.addControl(new GMapTypeControl());
  map.setCenter(new GLatLng(40.728771,-73.995752),16);

  // arrays to hold copies of the markers and html used by the side_bar
  // because the function closure trick doesnt work there
  var side_bar_html = "";
  var gmarkers = [];
  var htmls = [];
  var i = 0;

  // A function to create the marker and set up the event window
  function createMarker(point,name,html) {
    var marker = new GMarker(point);
    GEvent.addListener(marker, "click", function() {
      marker.openInfoWindowHtml(html);
      joinRoom(name);
    });
    // save the info we need to use later for the side_bar
    gmarkers[i] = marker;
    htmls[i] = html;
    // add a line to the side_bar html
    side_bar_html += '<a href="javascript:myclick(' + i + ')">' + name + '<\/a><br>';
    i++;
    return marker;
  }

  // This function picks up the click and opens the corresponding info window
  function myclick(i) {
    gmarkers[i].openInfoWindowHtml(htmls[i]);
  }

  processVenues = function(data){
    for (var i=0; i<data.length; i++) {
      var point = new GLatLng(data[i].location.lat, data[i].location.lng);
      var chatHtml = '<div class="content"><div class="chat-box popup"><h3>' + 
        data[i].name + '</h3><div id="avatars" class="avatars">' + 
        '<img src="https://graph.facebook.com/jimmytcchao/picture?type=small"/><img src="https://graph.facebook.com/42403930/picture?type=small"/><img src="http://thestart.me/images/avatars/darenb.png"/><img src="https://graph.facebook.com/1105177/picture?type=large"/><div style="clear:both;">&nbsp;</div>' + 
        '</div><ul id="chatroom"></ul><input id="say" type="text"></input></div></div>';
      var marker = createMarker(point, data[i].name, chatHtml);
      map.addOverlay(marker);
    }
  }

  process_it = function(json) {
    var jsonData = json;
    
    for (var i=0; i<jsonData.markers.length; i++) {
      var point = new GLatLng(jsonData.markers[i].lat, jsonData.markers[i].lng);
      var chatHtml = '<div class="content"><div class="chat-box popup"><h3>' + 
        jsonData.markers[i].chat + '</h3><div id="avatars" class="avatars">' + 
        '<img src="https://graph.facebook.com/jimmytcchao/picture?type=small"/><img src="https://graph.facebook.com/42403930/picture?type=small"/><img src="http://thestart.me/images/avatars/darenb.png"/><img src="https://graph.facebook.com/1105177/picture?type=large"/><div style="clear:both;">&nbsp;</div>' + 
        '</div><ul id="chatroom"></ul><input id="say" type="text"></input></div></div>';
      var marker = createMarker(point, jsonData.markers[i].chat, chatHtml);
      map.addOverlay(marker);
    }
  }          
      
	var JSONfeed = '{"markers": [ {"lat":40.728771, "lng":-73.995752, "chat":"HackNY", "users":"Jimmy, Daren, Ray", "label":"Marker One"}, {"lat":40.729218, "lng":-73.996664, "chat":"NYU Stern", "users":"Jimmy, Daren, Ray", "label":"Marker One"}, {"lat":40.730779, "lng":-73.997533, "chat":"Washington Sq Park", "users":"Jimmy, Daren, Ray", "label":"Marker Three"},{"lat":40.730779, "lng":-73.997533, "chat":"Washington Sq Park", "users":"Jimmy, Daren, Ray", "label":"Marker Two"}  ]}';
} else {
  alert("Sorry, the Google Maps API is not compatible with this browser");
}
