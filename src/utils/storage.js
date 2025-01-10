import { Storage } from '@capacitor/storage';
const PLACES_KEY = 'places';
export const savePlace = async (newPlace) => {
  try {
    const existingPlaces = await Storage.get({ key: 'places' });
    const places = existingPlaces.value ? JSON.parse(existingPlaces.value) : [];

    places.push(newPlace);

    console.log('Místa k uložení:', places); // Log všech míst včetně nového

    await Storage.set({ key: 'places', value: JSON.stringify(places) });
  } catch (error) {
    console.error('Chyba při ukládání místa:', error);
  }
};
export async function savePlaces(places) {
    localStorage.setItem(PLACES_KEY, JSON.stringify(places));
};
window.savePlace = savePlace;
window.getPlaces = getPlaces;

// Načte všechna uložená místa z úložiště
export async function getPlaces() {
    const { value } = await Storage.get({ key: 'places' });
    return value ? JSON.parse(value) : [];
};
// Funkce pro smazání místa podle jeho ID
export async function deletePlace(id) {
     const places = await getPlaces(); // Načti aktuální seznam míst
     const updatedPlaces = places.filter(place => place.id !== id); // Odstraň místo podle ID
     await Storage.set({ key: 'places', value: JSON.stringify(updatedPlaces) }); // Ulož aktualizovaný seznam
 }

