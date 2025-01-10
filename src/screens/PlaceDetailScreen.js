import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPlaces } from '../utils/storage';
import { getWeather } from '../utils/api'; // Funkce pro získání počasí

const PlaceDetailScreen = () => {
    const { id } = useParams(); // ID přichází jako string z URL
    const [place, setPlace] = useState(null);
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        async function fetchPlaceDetails() {
            const places = await getPlaces();
            const selectedPlace = places.find(place => place.id === id);

            if (selectedPlace) {
                setPlace(selectedPlace);
                const weatherData = await getWeather(
                    selectedPlace.position.lat,
                    selectedPlace.position.lng
                );
                setWeather(weatherData);
            }
        }
        fetchPlaceDetails();
    }, [id]);


    if (!place) return <p>Načítání...</p>;

    return (
        <div>
            <h1>{place.name}</h1>
            <p>{place.description}</p>
            {weather && (
                <div>
                    <h2>Předpověď počasí</h2>
                    <p>Teplota: {Math.round(weather.main.temp - 273.15)}°C</p>
                    <p>Počasí: {weather.weather[0].description}</p>
                </div>
            )}
        </div>
    );
};

export default PlaceDetailScreen;
