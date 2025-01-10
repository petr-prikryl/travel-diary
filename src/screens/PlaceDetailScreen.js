import React, { useEffect, useState } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getPlaces, deletePlace } from '../utils/storage';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';

const defaultIcon = new Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const PlaceDetailScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [place, setPlace] = useState(null);

    useEffect(() => {
        async function fetchPlaceDetails() {
            const places = await getPlaces();
            const selectedPlace = places.find((place) => place.id === id);
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

    if (!place) return <p className="text-center mt-5">Načítání...</p>;

    return (
        <Container className="mt-5">
            <Card>
                <Card.Body>
                    <h1 className="text-center mb-4">{place.name}</h1>
                    <p><strong>Popis:</strong> {place.description}</p>
                    <p><strong>GPS souřadnice:</strong> Latitude: {place.location.lat}, Longitude: {place.location.lng}</p>

                    {place.weather && (
                        <div className="mb-4">
                            <h4>Počasí při navštívení</h4>
                            <p>Teplota: {Math.round(place.weather.main.temp - 273.15)}°C</p>
                            <p>Podmínky: {place.weather.weather[0].description}</p>
                        </div>
                    )}

                    <MapContainer
                        center={[place.location.lat, place.location.lng]}
                        zoom={13}
                        style={{ height: '400px', width: '100%', marginBottom: '20px' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={[place.location.lat, place.location.lng]} icon={defaultIcon}>
                            <Popup>{place.name}</Popup>
                        </Marker>
                    </MapContainer>

                    <Row className="mt-4">
                        <Col>
                            <Button
                                variant="danger"
                                onClick={handleDelete}
                                className="w-100"
                            >
                                Vymazat místo
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                variant="outline-primary"
                                onClick={() => navigate('/')}
                                className="w-100"
                            >
                                Zpět na seznam míst
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default PlaceDetailScreen;
