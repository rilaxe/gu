import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { liveQuery } from "dexie";

interface mylogo {
    id: number;
    logo: string;
    signature: string;
}

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService extends Dexie {
    logoStore!: Dexie.Table<mylogo, number>; // Table definition

  constructor() {
    super('MyDatabase'); // Database name
    this.version(1).stores({
        logoStore: '++id, logo, signature' // Auto-incremented id and data fields
    });
    this.logoStore = this.table('logoStore');
  }

  // Add a Base64 string to the database
  async addLogoString(logoString: string, signatureString: string): Promise<number> {
    return await this.logoStore.add({id: 1, logo: logoString, signature: signatureString });
  }

  // Retrieve all Base64 strings from the database
  async getAllLogoString(): Promise<any[]> {
    return await this.logoStore.toArray();
  }

  // Retrieve a specific Base64 string by id
  async getLogoStringById(id: number): Promise<any> {
    return await this.logoStore.get(id);
  }

  async clearLogoRowById(): Promise<any> {
    return await this.logoStore.clear();
  }
}
