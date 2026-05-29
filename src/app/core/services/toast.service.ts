import { Injectable, signal } from '@angular/core';

export interface Toast { id: number; text: string; type: 'ok' | 'err'; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);
  private seq = 0;

  show(text: string, type: 'ok' | 'err' = 'ok', ms = 3000) {
    const id = ++this.seq;
    this.toasts.update(list => [...list, { id, text, type }]);
    setTimeout(() => this.toasts.update(list => list.filter(t => t.id !== id)), ms);
  }
}
