/**
 * MODUL AHSP & REGIONAL PRICING ENGINE
 * Mengelola kalkulasi harga satuan AHSP, database wilayah, dan custom item
 */

import { REGIONS, MASTER_UPAH, MASTER_BAHAN, MASTER_ALAT, getPriceByCode } from '../data/regional-prices-2026.js';
import { AHSP_DIVISIONS, AHSP_ITEMS, calculateAhspBreakdown } from '../data/ahsp-library-2026.js';

export class AhspEngine {
  constructor(initialRegion = 'MUARA_TEWEH') {
    this.currentRegion = initialRegion;
    this.customAhspList = [];
    this.customPrices = {}; // { [regionId]: { [code]: price } }
  }

  setRegion(regionId) {
    if (regionId in REGIONS) {
      this.currentRegion = regionId;
      return true;
    }
    return false;
  }

  getRegionInfo() {
    return REGIONS[this.currentRegion] || REGIONS.MUARA_TEWEH;
  }

  getAllRegions() {
    return Object.values(REGIONS);
  }

  getPrice(code, regionId = this.currentRegion) {
    if (this.customPrices[regionId] && this.customPrices[regionId][code] !== undefined) {
      return this.customPrices[regionId][code];
    }
    return getPriceByCode(code, regionId);
  }

  setCustomPrice(code, price, regionId = this.currentRegion) {
    if (!this.customPrices[regionId]) {
      this.customPrices[regionId] = {};
    }
    this.customPrices[regionId][code] = Number(price);
  }

  getDivisions() {
    return AHSP_DIVISIONS;
  }

  getAllAhspItems() {
    return [...AHSP_ITEMS, ...this.customAhspList];
  }

  getAhspByCode(code) {
    return this.getAllAhspItems().find(item => item.code === code);
  }

  calculateItemPrice(ahspCode, regionId = this.currentRegion) {
    const item = this.getAhspByCode(ahspCode);
    if (!item) return null;
    return calculateAhspBreakdown(item, regionId, (code, reg) => this.getPrice(code, reg));
  }

  getAllCalculatedItems(regionId = this.currentRegion, divisionFilter = null, searchQuery = '') {
    let items = this.getAllAhspItems();

    if (divisionFilter) {
      items = items.filter(it => it.divisionId === divisionFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(it => 
        it.code.toLowerCase().includes(q) || 
        it.name.toLowerCase().includes(q) ||
        (it.description && it.description.toLowerCase().includes(q))
      );
    }

    return items.map(item => this.calculateItemPrice(item.code, regionId));
  }

  addCustomAhsp(customItem) {
    const exists = this.getAhspByCode(customItem.code);
    if (exists) {
      throw new Error(`Kode AHSP ${customItem.code} sudah ada!`);
    }
    this.customAhspList.push(customItem);
    return customItem;
  }
}
