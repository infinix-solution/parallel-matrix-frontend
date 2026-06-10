import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-vision-mission',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./vision-mission.component.css'],
  templateUrl: './vision-mission.component.html'
})
export class VisionMissionComponent {}