let map;
let marker;
let infowindow;
let service;

function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            map = new google.maps.Map(document.getElementById('map'), {
                center: pos,
                zoom: 13,
            });

            infowindow = new google.maps.InfoWindow();
            service = new google.maps.places.PlacesService(map);

            marker = new google.maps.Marker({
                position: pos,
                map: map,
            });
            infowindow.setContent('You are here');
            infowindow.open(map, marker);

            document.getElementById('search-button').addEventListener('click', performSearch);
            document.getElementById('current-location-button').addEventListener('click', showCurrentLocation);
        }, () => {
            handleLocationError(true, map.getCenter());
        });
    } else {
        handleLocationError(false, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, pos) {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 41.902782, lng: 12.496364 },
        zoom: 13,
    });

    infowindow = new google.maps.InfoWindow();
    infowindow.setPosition(pos);
    infowindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infowindow.open(map);
}

function performSearch() {
    const searchInput = document.getElementById('search-input').value;
    const request = {
        query: searchInput,
        fields: ['name', 'geometry', 'formatted_address'],
    };

    service.findPlaceFromQuery(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            map.setCenter(results[0].geometry.location);
            if (marker) marker.setMap(null);
            marker = new google.maps.Marker({
                position: results[0].geometry.location,
                map: map,
            });
            infowindow.setContent(`${results[0].name}<br>${results[0].formatted_address}`);
            infowindow.open(map, marker);
        }
    });
}

function showCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            map.setCenter(pos);
            if (marker) marker.setMap(null);
            marker = new google.maps.Marker({
                position: pos,
                map: map,
            });
            infowindow.setContent('You are here');
            infowindow.open(map, marker);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

document.addEventListener('DOMContentLoaded', initMap);
