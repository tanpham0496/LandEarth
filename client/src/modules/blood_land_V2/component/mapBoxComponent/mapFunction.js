async function getFisrtLocation(){
    
  const lat = localStorage.getItem('lat');
  const lng = localStorage.getItem('lng');
  const syncMapCenter = localStorage && lat && lng && { lat: parseFloat(lat), lng: parseFloat(lng) };
  if(syncMapCenter && syncMapCenter.lat && syncMapCenter.lng) return syncMapCenter;

  const curentCenter = await getCurrentLocation();
  if(curentCenter && curentCenter.lat && curentCenter.lng) return curentCenter;

  const DEFAULT_CENTER = { lat: 37.566535, lng: 126.9779692 };
  return DEFAULT_CENTER;

  async function getCurrentLocation(){
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            position => {
                if(position && position.coords && position.coords.latitude && position.coords.longitude) resolve({ lat: position.coords.latitude, lng: position.coords.longitude });
                resolve(null);
            },
            error => {
                //console.log("can't getCurrentPosition!!");
                resolve(null);
            }
        );
    })
  }
}

export {
	getFisrtLocation,
}
