import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { savePlace } from '../utils/storage';
import { Geolocation } from '@capacitor/geolocation';

const defaultIcon = new Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const AddPlaceScreen = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState({ lat: 50, lng: 14 });
    const [address, setAddress] = useState('');

    const handleGetLocation = async () => {
        try {
            const permissionStatus = await Geolocation.requestPermissions();
            if (permissionStatus.location !== 'granted') {
                alert('Oprávnění k poloze nebylo uděleno.');
                return;
            }
            const position = await Geolocation.getCurrentPosition();
            setLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
            alert('Poloha byla úspěšně získána.');
        } catch (error) {
            console.error('Chyba při získávání polohy:', error);
            alert('Nepodařilo se získat polohu. Zkuste to znovu.');
        }
    };

    const handleSearchAddress = async () => {
        if (!address) {
            alert('Zadejte prosím adresu.');
            return;
        }
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
            );
            const data = await response.json();
            if (data.length === 0) {
                alert('Adresa nebyla nalezena.');
                return;
            }
            setLocation({
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            });
            alert('Adresa byla úspěšně nalezena.');
        } catch (error) {
            console.error('Chyba při vyhledávání adresy:', error);
            alert('Nepodařilo se najít adresu.');
        }
    };

    function LocationMarker() {
        useMapEvents({
            click(e) {
                setLocation({
                    lat: e.latlng.lat,
                    lng: e.latlng.lng
                });
            }
        });
        return <Marker position={[location.lat, location.lng]} icon={defaultIcon} />;
    }

    function FlyToLocation({ location }) {
        const map = useMap();
        useEffect(() => {
            map.flyTo([location.lat, location.lng], 13);
        }, [location, map]);
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !description) {
            alert('Vyplňte prosím název a popis.');
            return;
        }

        const newPlace = {
            id: Date.now().toString(),
            name,
            description,
            location
        };

        await savePlace(newPlace);
        alert('Nové místo bylo úspěšně přidáno.');
        navigate('/');
    };

    return (
        <div>
            <h1>Přidat nové místo</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Název:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Popis:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Souřadnice:</label>
                    <p>Latitude: {location.lat}, Longitude: {location.lng}</p>
                    <button type="button" onClick={handleGetLocation}>
                        Získat polohu
                    </button>
                </div>

                <div>
                    <label>Vyhledat adresu:</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Zadejte adresu..."
                    />
                    <button type="button" onClick={handleSearchAddress}>
                        Vyhledat
                    </button>
                </div>

                <button type="submit">Uložit místo</button>
            </form>

            {/* Tlačítko Zpět */}
            <button
                onClick={() => navigate('/')}
                style={{ marginTop: '20px', padding: '10px 20px' }}
            >
                Zpět
            </button>

            <MapContainer
                center={[location.lat, location.lng]}
                zoom={13}
                style={{ height: '400px', width: '100%', marginTop: '20px' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <FlyToLocation location={location} />
                <LocationMarker />
            </MapContainer>
        </div>
    );
};

export default AddPlaceScreen;
