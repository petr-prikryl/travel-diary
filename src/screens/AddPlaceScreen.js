import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { savePlace } from '../utils/storage';
import { Geolocation } from '@capacitor/geolocation';
import { getWeather } from '../utils/api'; // Import funkce pro získání počasí


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
    const [weather, setWeather] = useState(null);


    const handleGetLocation = async () => {
        try {
            const permissionStatus = await Geolocation.requestPermissions();
            if (permissionStatus.location !== 'granted') {
                alert('Oprávnění k poloze nebylo uděleno.');
                return;
            }
            const position = await Geolocation.getCurrentPosition();
            const coords = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            setLocation(coords);

            // Načíst počasí
            const weatherData = await getWeather(coords.lat, coords.lng);
            setWeather(weatherData);
            alert('Poloha a počasí byly úspěšně získány.');
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
            const coords = {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            };
            setLocation(coords);

            // Načíst počasí
            const weatherData = await getWeather(coords.lat, coords.lng);
            setWeather(weatherData);
            alert('Adresa a počasí byly úspěšně nalezeny.');
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
            location,
            weather
        };

        await savePlace(newPlace);
        alert('Nové místo bylo úspěšně přidáno.');
        navigate('/');
    };

    return (
        <Container className="mt-5">
            <Card>
                <Card.Body>
                    <h1 className="mb-4 text-center">Přidat nové místo</h1>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formName" className="mb-3">
                            <Form.Label>Název:</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Zadejte název místa"
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formDescription" className="mb-3">
                            <Form.Label>Popis:</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Popište místo"
                                required
                            />
                        </Form.Group>

                        <Row className="mb-3">
                            <Col>
                                <Button variant="primary" onClick={handleGetLocation} block>
                                    Získat polohu
                                </Button>
                            </Col>
                            <Col>
                                <Form.Control
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Zadejte adresu..."
                                />
                                <Button
                                    variant="secondary"
                                    onClick={handleSearchAddress}
                                    className="mt-2"
                                    block
                                >
                                    Vyhledat adresu
                                </Button>
                            </Col>
                        </Row>

                        <Button variant="success" type="submit" block>
                            Uložit místo
                        </Button>
                    </Form>

                    <Button
                        variant="outline-danger"
                        onClick={() => navigate('/')}
                        className="mt-4"
                        block
                    >
                        Zpět
                    </Button>

                    {/* Map Container */}
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

                                        {/* Zobrazení počasí */}
                                        {weather && (
                                            <Card className="mt-4">
                                                <Card.Body>
                                                    <h5>Aktuální počasí:</h5>
                                                    <p><strong>Teplota:</strong> {(weather.main.temp - 273.15).toFixed(1)} °C</p>
                                                    <p><strong>Podmínky:</strong> {weather.weather[0].description}</p>
                                                </Card.Body>
                                            </Card>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Container>
                        );
                    };

                    export default AddPlaceScreen;
