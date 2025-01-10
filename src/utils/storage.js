import { Storage } from '@capacitor/storage';

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

window.savePlace = savePlace;
window.getPlaces = getPlaces;

// Načte všechna uložená místa z úložiště
export async function getPlaces() {
    const { value } = await Storage.get({ key: 'places' });
    return value ? JSON.parse(value) : [];
}
