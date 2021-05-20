mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: JSON.parse(cg).geometry.coordinates, // starting position [lng, lat]
    zoom: 5 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(JSON.parse(cg).geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${JSON.parse(cg).title}</h3><p>${JSON.parse(cg).location}</p>`
            )
    )
    .addTo(map)

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

