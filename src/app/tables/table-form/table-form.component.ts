import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Table } from '../models/table.model';

export interface TableFormData {
  table?: Table;
}

@Component({
  selector: 'app-table-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './table-form.component.html',
  styleUrl: './table-form.component.scss',
})
export class TableFormComponent {
  protected readonly data = inject<TableFormData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<TableFormComponent>);
  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.nonNullable.group({
    name: [this.data.table?.name ?? '', Validators.required],
    number: [this.data.table?.number ?? 1, [Validators.required, Validators.min(1)]],
    capacity: [this.data.table?.capacity ?? 8, [Validators.required, Validators.min(1)]],
  });

  protected save(): void {
    if (this.form.invalid) return;
    const { name, number, capacity } = this.form.getRawValue();
    this.dialogRef.close({ name, number: Number(number), capacity: Number(capacity) });
  }
}
