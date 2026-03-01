import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';
import { Table } from './models/table.model';
import { TableService } from './services/table.service';

export const tablesResolver: ResolveFn<Table[]> = () =>
  inject(TableService).fetchTables().pipe(catchError(() => of([])));
