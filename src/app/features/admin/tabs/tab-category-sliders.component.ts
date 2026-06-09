import { Component, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { SliderImage, SliderCategory } from '../../../core/models';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-tab-category-sliders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="adm-panel">
      <h3>{{ label }} Image Carousel</h3>
      <p class="help">
        Upload up to 8 images (max 300KB each) for the <strong>{{ label }}</strong> section.
        These appear in the carousel on the public site. If none are uploaded, high-quality
        default images are shown automatically.
        <span style="display:inline-block;margin-left:6px;padding:2px 8px;border-radius:999px;background:linear-gradient(135deg,#d4a84c,#f5cb6f);color:#0a1f44;font-size:10px;font-weight:700;letter-spacing:.08em;vertical-align:middle">SUPER</span>
      </p>

      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <label class="adm-btn primary" style="cursor:pointer">
          + Upload Image
          <input type="file" accept="image/*" hidden (change)="upload($event)">
        </label>
        <span style="color:var(--mute);font-size:13px">{{ slides.length }} / 8 uploaded</span>
      </div>

      <div class="adm-slider-grid" *ngIf="slides.length > 0" style="margin-top:16px">
        <div *ngFor="let s of slides" class="s">
          <img [src]="resolveUrl(s.url)" [alt]="s.filename || ''">
          <button (click)="remove(s)" title="Delete">&times;</button>
        </div>
      </div>
      <div class="adm-empty" *ngIf="slides.length === 0" style="margin-top:16px">
        No images uploaded — default stock photos are shown on the site.
      </div>
    </div>
  `
})
export class TabCategorySlidersComponent implements OnInit {
  @Input() category: SliderCategory = 'career';
  @Input() label = 'Career';

  private api = inject(ApiService);
  private toast = inject(ToastService);
  slides: SliderImage[] = [];

  ngOnInit() { this.load(); }

  load() {
    this.api.getCategorySliders(this.category).subscribe({
      next: r => this.slides = (r?.success && r.data) ? r.data : [],
      error: () => this.slides = []
    });
  }

  resolveUrl(u: string) {
    return u.startsWith('http') ? u : `${environment.apiBaseUrl.replace('/api', '')}${u}`;
  }

  upload(e: Event) {
    const input = e.target as HTMLInputElement;
    const f = input.files?.[0];
    input.value = '';
    if (!f) return;
    if (this.slides.length >= 8) { this.toast.show('Maximum of 8 images allowed.', 'err'); return; }
    if (f.size > 300 * 1024) { this.toast.show('File too large (max 300KB).', 'err'); return; }
    if (!f.type.startsWith('image/')) { this.toast.show('Please upload an image file.', 'err'); return; }

    this.api.uploadCategorySlider(this.category, f).subscribe({
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
    if (!confirm('Delete this image?')) return;
    this.api.deleteSlider(s._id).subscribe({
      next: () => { this.slides = this.slides.filter(x => x._id !== s._id); this.toast.show('Deleted.'); },
      error: () => this.toast.show('Delete failed.', 'err')
    });
  }
}
