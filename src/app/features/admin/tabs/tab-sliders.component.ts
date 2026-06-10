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
  templateUrl: './tab-sliders.component.html'
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
      console.log('Loaded sliders:', this.slides);
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
          console.log('Uploaded slider:', r.data);
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
