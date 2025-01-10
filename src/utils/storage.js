import { Storage } from '@capacitor/storage';

export async function savePlace(place) {
    try {
        const { value } = await Storage.get({ key: 'places' });
        const places = value ? JSON.parse(value) : []; // Pokud je hodnota null, vytvoří prázdné pole
        places.push(place);
        await Storage.set({ key: 'places', value: JSON.stringify(places) });
    } catch (error) {
        console.error('Chyba při ukládání místa:', error);
    }
}
window.savePlace = savePlace;
window.getPlaces = getPlaces;

// Načte všechna uložená místa z úložiště
export async function getPlaces() {
    const { value } = await Storage.get({ key: 'places' });
    return value ? JSON.parse(value) : [];
}
