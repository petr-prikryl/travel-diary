import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPlaces } from '../utils/storage';

const PlaceDetailScreen = () => {
    const { id } = useParams(); // ID přichází jako string z URL
    const [place, setPlace] = useState(null);

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
        <div>
            <h1>{place.name}</h1>
            <p>{place.description}</p>
            <p>
                <strong>GPS souřadnice:</strong> {`Latitude: ${place.location.lat}, Longitude: ${place.location.lng}`}
            </p>
        </div>
    );
};

export default PlaceDetailScreen;
