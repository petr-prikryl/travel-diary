import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getPlaces, deletePlace } from '../utils/storage'; // Import funkcí
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const defaultIcon = new Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41], // Velikost ikony
    iconAnchor: [12, 41], // Bod ukotvení ikony
    popupAnchor: [1, -34], // Umístění popupu vůči ikoně
    shadowSize: [41, 41] // Velikost stínu
});

const PlaceDetailScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [place, setPlace] = useState(null);

    useEffect(() => {
        async function fetchPlaceDetails() {
            const places = await getPlaces();
            const selectedPlace = places.find(place => place.id === id);
            if (selectedPlace) {
                setPlace(selectedPlace);
            }
        }
        fetchPlaceDetails();
    }, [id]);

    const handleDelete = async () => {
        try {
            await deletePlace(id);
            alert('Místo bylo úspěšně smazáno.');
            navigate('/');
        } catch (error) {
            console.error('Chyba při mazání místa:', error);
            alert('Nepodařilo se smazat místo.');
        }
    };

    if (!place) return <p>Načítání...</p>;

    return (
        <div>
            <h1>{place.name}</h1>
            <p>{place.description}</p>
            <p>GPS souřadnice: {`Latitude: ${place.location.lat}, Longitude: ${place.location.lng}`}</p>

            {/* Zobrazení uloženého počasí */}
            {place.weather && (
                <div style={{ marginBottom: '20px' }}>
                    <h2>Počasí při uložení</h2>
                    <p>Teplota: {Math.round(place.weather.main.temp - 273.15)}°C</p>
                    <p>Podmínky: {place.weather.weather[0].description}</p>
                </div>
            )}

            {/* Zobrazení mapy s markerem */}
            <MapContainer
                center={[place.location.lat, place.location.lng]}
                zoom={13}
                style={{ height: '400px', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[place.location.lat, place.location.lng]} icon={defaultIcon}>
                    <Popup>{place.name}</Popup>
                </Marker>
            </MapContainer>

            <button onClick={handleDelete}>Vymazat místo</button>
            <Link to="/">Zpět na seznam míst</Link>
        </div>
    );

};

export default PlaceDetailScreen;
