import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Guest } from '../../guests/models/guest.model';

@Component({
  selector: 'app-unassigned-guests',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DragDropModule, MatCardModule, MatIconModule],
  templateUrl: './unassigned-guests.component.html',
  styleUrl: './unassigned-guests.component.scss',
})
export class UnassignedGuestsComponent {
  readonly guests = input.required<Guest[]>();
  readonly connectedTo = input.required<string[]>();
  readonly dropped = output<CdkDragDrop<Guest[]>>();
}
