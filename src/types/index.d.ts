export {};

declare global {
  interface Window {
    initMap: () => void;
    google: {
      maps: {
        MarkerLibrary: any; // Ersetzen Sie 'any' durch den genauen Typ von MarkerLibrary
        importLibrary: (libraryName: string) => Promise<any>; // Hinzufügen der importLibrary-Methode
      }
    }
  }

  interface Marker {
    importLibrary: (libraryName: string) => Promise<any>;
  }
}