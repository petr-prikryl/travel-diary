import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import AddPlaceScreen from './screens/AddPlaceScreen';
import PlaceDetailScreen from './screens/PlaceDetailScreen';
import { savePlace, getPlaces } from './utils/storage';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';




function App() {
  return (
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/add" element={<AddPlaceScreen />} />
            <Route path="/place/:id" element={<PlaceDetailScreen />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
