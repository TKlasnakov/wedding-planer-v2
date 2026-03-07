import { Injectable } from '@angular/core';

type StorageType = 'local' | 'session';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly localAvailable = this.checkAvailability('localStorage');
  private readonly sessionAvailable = this.checkAvailability('sessionStorage');

  get<T>(key: string, storage: StorageType = 'local'): T | null {
    if (!this.isAvailable(storage)) return null;
    try {
      const raw = this.resolve(storage).getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  set(key: string, value: unknown, storage: StorageType = 'local'): void {
    if (!this.isAvailable(storage)) return;
    try {
      this.resolve(storage).setItem(key, JSON.stringify(value));
    } catch {
      // storage full or blocked
    }
  }

  remove(key: string, storage: StorageType = 'local'): void {
    if (!this.isAvailable(storage)) return;
    this.resolve(storage).removeItem(key);
  }

  isAvailable(storage: StorageType): boolean {
    return storage === 'local' ? this.localAvailable : this.sessionAvailable;
  }

  private resolve(storage: StorageType): Storage {
    return storage === 'local' ? localStorage : sessionStorage;
  }

  private checkAvailability(type: 'localStorage' | 'sessionStorage'): boolean {
    try {
      const storage = window[type];
      const probe = '__storage_probe__';
      storage.setItem(probe, probe);
      storage.removeItem(probe);
      return true;
    } catch {
      return false;
    }
  }
}
