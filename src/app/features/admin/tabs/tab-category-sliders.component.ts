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
  templateUrl: './tab-category-sliders.component.html'
})
export class TabCategorySlidersComponent implements OnInit {
  @Input() category: SliderCategory = 'career';
  @Input() label = 'Career';

  private api = inject(ApiService);
  private toast = inject(ToastService);
  slides: SliderImage[] = [];

  ngOnInit() {
    console.log(`Initializing ${this.category} sliders tab...`);
    this.load(); }

  load() {
    this.api.getCategorySliders(this.category).subscribe({
      next: r => this.slides = (r?.success && r.data) ? r.data : [],
      error: () => this.slides = []
    });
    console.log(`Loaded ${this.category} sliders:`, this.slides);
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
          console.log(`Uploaded ${this.category} slider:`, r.data);
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
