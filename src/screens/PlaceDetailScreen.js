import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlaces } from '../utils/storage';
import { Button } from '@mui/material'; // Materiálové tlačítko

const PlaceDetailScreen = () => {
    const { id } = useParams(); // ID přichází jako string z URL
    const [place, setPlace] = useState(null);
    const navigate = useNavigate(); // Hook pro navigaci zpět

    useEffect(() => {
        async function fetchPlaceDetails() {
            const places = await getPlaces(); // Načtení všech uložených míst
            const selectedPlace = places.find((place) => place.id === id); // Najdeme místo podle ID

            if (selectedPlace) {
                setPlace(selectedPlace); // Uložíme nalezené místo do state
            }
        }
        fetchPlaceDetails();
    }, [id]);

    if (!place) return <p>Načítání...</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>{place.name}</h1>
            <p>{place.description}</p>
            <p>
                <strong>GPS souřadnice:</strong> {`Latitude: ${place.location.lat}, Longitude: ${place.location.lng}`}
            </p>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(-1)} // Navigace zpět
                style={{ marginTop: '20px' }}
            >
                Zpět
            </Button>
        </div>
    );
};

export default PlaceDetailScreen;
