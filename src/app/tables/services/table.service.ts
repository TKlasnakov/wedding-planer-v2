import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Table } from '../models/table.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TableService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/tables`;
  private readonly _tables = signal<Table[]>([]);
  readonly loading = signal(false);

  readonly tables = this._tables.asReadonly();

  fetchTables(): Observable<Table[]> {
    this.loading.set(true);
    return this.http.get<Table[]>(this.apiUrl).pipe(
      tap((tables) => {
        this._tables.set(tables);
        this.loading.set(false);
      }),
    );
  }

  addTable(data: Omit<Table, 'id'>): Observable<Table> {
    return this.http.post<Table>(this.apiUrl, data).pipe(
      tap((table) => this._tables.update((tables) => [...tables, table])),
    );
  }

  updateTable(id: string, data: Omit<Table, 'id'>): Observable<Table> {
    return this.http.patch<Table>(`${this.apiUrl}/${id}`, data).pipe(
      tap((updated) =>
        this._tables.update((tables) =>
          tables.map((table) => (table.id === id ? updated : table)),
        ),
      ),
    );
  }

  deleteTable(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this._tables.update((tables) => tables.filter((table) => table.id !== id))),
    );
  }
}
