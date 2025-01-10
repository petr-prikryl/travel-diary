import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { savePlace } from '../utils/storage';
import { useNavigate } from 'react-router-dom';
import { Geolocation } from '@capacitor/geolocation';

function AddPlaceScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const navigate = useNavigate();

  const handleSavePlace = async () => {
    try {
      if (!name.trim()) {
        alert('Název místa je povinný!');
        return;
      }
      if (!location) {
        alert('Nejprve získat polohu kliknutím na tlačítko "Získat aktuální polohu".');
        return;
      }
      const newPlace = {
        id: Date.now().toString(),
        name,
        description,
        location,
      };

      console.log('Nové místo k uložení:', newPlace);
      await savePlace(newPlace);
      console.log('Místo bylo úspěšně uloženo');
      navigate('/');
    } catch (error) {
      console.error('Chyba při ukládání místa: ', error);
    }
  };

  const handleGetLocation = async () => {
    try {
      const permissionStatus = await Geolocation.requestPermissions();
      if (permissionStatus.location !== 'granted') {
        alert('Oprávnění k poloze nebylo uděleno.');
        return;
      }

      const position = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = position.coords;

      const coords = {
        lat: latitude,
        lng: longitude,
      };

      setLocation(coords);
      console.log('Získaná poloha:', coords);
    } catch (error) {
      console.error('Chyba při získávání polohy:', error);
      alert('Nepodařilo se získat polohu. Zkuste to znovu.');
    }
  };


  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Přidat nové místo
      </Typography>
      <TextField
        label="Název místa"
        variant="outlined"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginBottom: '20px' }}
      />
      <TextField
        label="Popis místa"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ marginBottom: '20px' }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleGetLocation}
        style={{ marginBottom: '20px' }}
      >
        Získat aktuální polohu
      </Button>
      {location && (
        <Typography variant="body1" style={{ marginBottom: '20px' }}>
          Aktuální poloha: {`Latitude: ${location.lat}, Longitude: ${location.lng}`}
        </Typography>
      )}
      <Button variant="contained" color="secondary" onClick={handleSavePlace}>
        Uložit místo
      </Button>
    </div>
  );
}

export default AddPlaceScreen;
