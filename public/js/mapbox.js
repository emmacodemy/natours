/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiZW1tYWNvZGVteSIsImEiOiJja2l1MjlpaGYwdWlkMndtbXpmOHNzdWs4In0.Avnhvg_A5XViYZsW4D8_ag';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/emmacodemy/ckiucxalc0qtb19o2vd0e0kpj',
    scrollZoom: false,
    // center: [-118.317791, 34.113674],
    // zoom: 10,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p> Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: { top: 200, bottom: 150, left: 100, right: 100 },
  });
};
