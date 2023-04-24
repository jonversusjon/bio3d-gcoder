/*
This service provides four methods to interact with LocalStorage:

setItem: Save data to LocalStorage for a given key.
getItem: Retrieve data from LocalStorage for a given key.
removeItem: Remove data from LocalStorage for a given key.
clear: Clear all data in LocalStorage.
*/

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  setItem(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error storing data in LocalStorage:', error);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error retrieving data from LocalStorage:', error);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data from LocalStorage:', error);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing data in LocalStorage:', error);
    }
  }
}
