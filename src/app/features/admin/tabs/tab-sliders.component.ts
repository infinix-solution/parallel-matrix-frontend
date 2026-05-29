import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { SliderImage } from '../../../core/models';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-tab-sliders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="adm-panel">
      <h3>Image Slider Assets</h3>
      <p class="help">Upload up to 5 images (max 300KB each). They'll rotate as the hero background. If none, the default <code></code> is used.</p>

      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <label class="adm-btn primary" style="cursor:pointer">
          + Upload Image
          <input type="file" accept="image/*" hidden (change)="upload($event)">
        </label>
        <span style="color:var(--mute);font-size:13px">{{ slides.length }} / 5 uploaded</span>
      </div>

      <div class="adm-slider-grid" *ngIf="slides.length > 0">
        <div *ngFor="let s of slides" class="s">
          <img [src]="resolveUrl(s.url)" [alt]="s.filename || ''">
          <button (click)="remove(s)" title="Delete">&times;</button>
        </div>
      </div>
      <div class="adm-empty" *ngIf="slides.length === 0">No slides uploaded &mdash; using default hero background.</div>
    </div>
  `
})
export class TabSlidersComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  slides: SliderImage[] = [];

  ngOnInit() { this.load(); }

  load() {
    this.api.getSliders().subscribe({
      next: r => this.slides = (r?.success && r.data) ? r.data : [],
      error: () => this.slides = []
    });
  }

  resolveUrl(u: string) {
    return u.startsWith('http') ? u : `${environment.apiBaseUrl.replace('/api','')}${u}`;
  }

  upload(e: Event) {
    const input = e.target as HTMLInputElement;
    const f = input.files?.[0];
    input.value = '';
    if (!f) return;
    if (this.slides.length >= 5) { this.toast.show('Maximum of 5 slides allowed.', 'err'); return; }
    if (f.size > 300 * 1024) { this.toast.show('File too large (max 300KB).', 'err'); return; }
    if (!f.type.startsWith('image/')) { this.toast.show('Please upload an image file.', 'err'); return; }

    this.api.uploadSlider(f).subscribe({
      next: r => {
        if (r?.success && r.data) {
          this.slides = [...this.slides, r.data];
          this.toast.show('Image uploaded.');
        }
      },
      error: err => this.toast.show(err?.error?.message || 'Upload failed.', 'err')
    });
  }

  remove(s: SliderImage) {
    if (!s._id) return;
    if (!confirm('Delete this slide?')) return;
    this.api.deleteSlider(s._id).subscribe({
      next: () => { this.slides = this.slides.filter(x => x._id !== s._id); this.toast.show('Deleted.'); },
      error: () => this.toast.show('Delete failed.', 'err')
    });
  }
}
