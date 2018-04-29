//global variables
var map;
var markers = [];//array of markers
var searchBox;
var userLocation;

//init map and services
function initMap(){
    //create a map, default centered in the middle of Kyiv
    //shuld be later overridden by real user's position
    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: 50.45466, lng: 30.5238},
        zoom: 11,
        mapTypeControl: false,
        fullscreenControl: false
    });

    //marker for user's position
    var marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        title: "You are here!"
    });

    var infoWindow = new google.maps.InfoWindow({
        content: 'You are here!'
    });
    marker.addListener('click', function () {
        infoWindow.open(map, marker);
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    searchBox = new google.maps.places.SearchBox(input);
    //set the searchBox to the top
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

    //execute this function when user enters something new into the searchBox
    searchBox.addListener('places_changed', function() {
        //get set of places user requested
        var places = searchBox.getPlaces();

        //break if no places were found
        if (places.length === 0) {
            return;
        }

        markers.forEach(function(marker){
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            /*
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                //scaledSize: new google.maps.Size(25, 25)
            };
            */

            var icon = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });

        var placeInfoWindow = new google.maps.InfoWindow();
        for (var i = 0; i < markers.length; i++){
            markers[i].addListener('click', function(){
                populateInfoWindow(this, placeInfoWindow);
            });
        }
        map.fitBounds(bounds);
    });

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            marker.setPosition(userLocation);
            map.setCenter(userLocation);
            map.setZoom(13);
            marker.setMap(map);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker !== marker) {
        infowindow.marker = marker;
        infowindow.setContent('<h3>' + marker.title + '</h3>' + '<button class="btn btn-warning btn-s addToFavorites">Add to favorites</button>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick',function(){
            infowindow.setMarker = null;
        });
    }
}

