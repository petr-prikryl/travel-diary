import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

export const getCurrentPosition = async () => {
         try {
           // Požádej o oprávnění k poloze
           const permissionStatus = await Geolocation.requestPermissions();

           // Zkontroluj, zda byla oprávnění udělena
           if (permissionStatus.location !== 'granted') {
             console.error('Oprávnění k poloze nebyla udělena.');
             return null;
           }

           // Získej aktuální polohu
           const position = await Geolocation.getCurrentPosition();

           console.log('Aktuální pozice:', position);

           // Vrať souřadnice ve formátu { lat, lng }
           return {
             lat: position.coords.latitude,
             lng: position.coords.longitude,
           };
         } catch (error) {
           console.error('Chyba při získávání polohy:', error);
           return null;
         }
       };


