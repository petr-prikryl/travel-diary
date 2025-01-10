import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPlaces } from '../utils/storage'; // Funkce pro načítání míst

const HomeScreen = () => {
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        async function fetchPlaces() {
            const storedPlaces = await getPlaces();
            setPlaces(storedPlaces);
        }
        fetchPlaces();
    }, []);

    return (
        <div>
            <h1>Seznam míst</h1>
            <ul>
                {places.map((place) => (
                    <li key={place.id}>
                        <Link to={`/place/${place.id}`}>{place.name}</Link>
                    </li>
                ))}
            </ul>
            <Link to="/add">Přidat nové místo</Link>
        </div>
    );
};

export default HomeScreen;
