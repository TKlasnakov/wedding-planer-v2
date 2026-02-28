import { Injectable, inject, signal } from '@angular/core';
import { Table } from '../models/table.model';
import { StorageService } from '../../shared/services/storage.service';

@Injectable({ providedIn: 'root' })
export class TableService {
  private readonly STORAGE_KEY = 'wedding_tables';
  private readonly storageService = inject(StorageService);
  private readonly _tables = signal<Table[]>(this.loadTables());

  readonly tables = this._tables.asReadonly();

  addTable(table: Omit<Table, 'id'>): void {
    const newTable: Table = { ...table, id: crypto.randomUUID() };
    this._tables.update(tables => [...tables, newTable]);
    this.persist();
  }

  updateTable(id: string, updates: Omit<Table, 'id'>): void {
    this._tables.update(tables =>
      tables.map(table => (table.id === id ? { ...updates, id } : table)),
    );
    this.persist();
  }

  deleteTable(id: string): void {
    this._tables.update(tables => tables.filter(table => table.id !== id));
    this.persist();
  }

  private loadTables(): Table[] {
    return this.storageService.get<Table[]>(this.STORAGE_KEY) ?? [];
  }

  private persist(): void {
    this.storageService.set(this.STORAGE_KEY, this._tables());
  }
}
