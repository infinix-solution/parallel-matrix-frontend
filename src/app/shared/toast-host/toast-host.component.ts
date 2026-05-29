import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast-host',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngFor="let t of toasts.toasts(); let i = index"
         class="toast"
         [class.err]="t.type === 'err'"
         [style.top.px]="20 + i * 64">
      {{ t.text }}
    </div>
  `
})
export class ToastHostComponent {
  toasts = inject(ToastService);
}
