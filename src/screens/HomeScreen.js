import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getPlaces } from '../utils/storage'; // Funkce pro načítání míst
import { Container, Card, ListGroup, Button } from 'react-bootstrap';

const defaultIcon = new Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

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
        <Container className="mt-5">
            <Card className="shadow-lg">
                <Card.Body>
                    <h1 className="text-center mb-4">Seznam míst</h1>

                    {/* Zobrazení mapy s markery všech míst */}
                    <MapContainer
                        center={[50, 14]} // Střed mapy - můžete upravit podle potřeby
                        zoom={6}
                        style={{ height: '400px', width: '100%', marginBottom: '20px' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {places.map((place) => (
                            <Marker
                                key={place.id}
                                position={[place.location.lat, place.location.lng]}
                                icon={defaultIcon}
                            >
                                <Popup>
                                    <strong>{place.name}</strong>
                                    <br />
                                    <Link to={`/place/${place.id}`}>Zobrazit detail</Link>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>

                    {/* Seznam míst */}
                    <Card className="mt-4">
                        <Card.Header className="text-center bg-primary text-white">
                            <h5>Uložená místa</h5>
                        </Card.Header>
                        <ListGroup variant="flush">
                            {places.map((place) => (
                                <ListGroup.Item key={place.id}>
                                    <Link to={`/place/${place.id}`}>{place.name}</Link>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>

                    <div className="d-flex justify-content-center mt-4">
                        <Button variant="success" size="lg" as={Link} to="/add">
                            Přidat nové místo
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default HomeScreen;
