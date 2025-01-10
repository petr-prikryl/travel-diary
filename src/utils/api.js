const API_KEY = '821e84eb0383552dbdde1dcb8677fd02';

// Získá předpověď počasí pro zadané souřadnice
export async function getWeather(lat, lng) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&lang=cz&appid=${API_KEY}`
    );
    const data = await response.json();
    return data;
}
