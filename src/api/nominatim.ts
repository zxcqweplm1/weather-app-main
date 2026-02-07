export const getCoordinates = async (location: string) => {
  const geocodingUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
  
  try {
    const response = await fetch(geocodingUrl);
    const data = await response.json();
    console.log(data)
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
        display_name: data[0].display_name,
      };
    } else {
      throw new Error('Location not found');
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
};

export const getLocation = async (location: string) => {
  const geocodingUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
  try {
    const response = await fetch(geocodingUrl);
    const data = await response.json();
    console.log(data);
    if (data && data.length > 0) {
      return data.map((d: any) => ({
        display_name: d.display_name,
        place_id: d.place_id,
      }));
    } else {
      throw new Error('Location not found');
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
};
