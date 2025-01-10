import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPlaces, deletePlace } from '../utils/storage'; // Import funkce deletePlace

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
            await deletePlace(id); // Smazání místa podle ID
            alert('Místo bylo úspěšně smazáno.');
            navigate('/'); // Přesměrování na hlavní obrazovku
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
            <button onClick={handleDelete}>Vymazat místo</button>
            <Link to="/">Zpět na seznam míst</Link>
        </div>
    );
};

export default PlaceDetailScreen;
