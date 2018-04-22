function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setLocation);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}
function setLocation(position){
    var userPositionLatitude = position.coords.latitude;
    var userPositionLongitude = position.coords.longitude;
    var coordinates = new google.maps.LatLng(userPositionLatitude, userPositionLongitude);
    var mapOptions = {
        center: coordinates,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    var marker = new google.maps.Marker({position:coordinates, map:map, title:"You are here!"});
}