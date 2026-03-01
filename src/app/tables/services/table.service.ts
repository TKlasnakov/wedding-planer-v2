import { Injectable, signal } from '@angular/core';
import { Table } from '../models/table.model';

@Injectable({ providedIn: 'root' })
export class TableService {
  private readonly _tables = signal<Table[]>([]);

  readonly tables = this._tables.asReadonly();

  addTable(table: Omit<Table, 'id'>): void {
    const newTable: Table = { ...table, id: crypto.randomUUID() };
    this._tables.update(tables => [...tables, newTable]);
  }

  updateTable(id: string, updates: Omit<Table, 'id'>): void {
    this._tables.update(tables =>
      tables.map(table => (table.id === id ? { ...updates, id } : table)),
    );
  }

  deleteTable(id: string): void {
    this._tables.update(tables => tables.filter(table => table.id !== id));
  }
}
