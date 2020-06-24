import axios, { Canceler } from 'axios';

interface Place {
  id: number;
  lat: number;
  lng: number;
  distance: number;
}

window.initMap = () => {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 35.681236, lng: 139.767125 },
    zoom: 14
  });

  let markers: Array< google.maps.Marker> = [];
  let cancel: Canceler = null;
  const updateMarkers = async () => {
    if (cancel) {
      cancel();
    }

    markers.forEach((marker) => { marker.setMap(null); });
    markers.length = 0;

    const centerLatLng = map.getCenter();

    let res;
    try {
      res = await axios.get<Array<Place>>(
        '/places.json',
        {
          params: { lat: centerLatLng.lat(), lng: centerLatLng.lng(), distance: 1000 },
          cancelToken: new axios.CancelToken((c) => {
            cancel = c;
          })
        }
      );
    } catch(e) {
      // cancel
    }
    
    cancel = null;

    if (res) {
      res.data.forEach((place) => {
        const center = new google.maps.Marker({
          title: `center`,
          icon: {
            fillColor: "#0000ff",
            fillOpacity: 1.0,
            path: google.maps.SymbolPath.CIRCLE,
            scale: 16,
            strokeColor: "#0000ff",
            strokeWeight: 1.0
          },
          position: centerLatLng,
          map: map
        });
        markers.push(center);
  
        const marker = new google.maps.Marker({
          title: `distance=${place.distance}m`,
          position: place,
          map: map
        });
        markers.push(marker);
      });
    }
  };


  map.addListener('idle', updateMarkers);
  updateMarkers();
}
