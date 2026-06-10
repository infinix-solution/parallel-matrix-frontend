import {
  Component, OnInit, OnDestroy, inject, signal, NgZone, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

const FALLBACK_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=80', caption: 'Building careers with clear structural purpose.' },
  { url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80', caption: 'Every role represents a new milestone chapter.' },
  { url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=80', caption: 'Connecting corporate ambition with a global network.' },
  { url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80', caption: 'Where elite industry talent meets true opportunity.' },
];

@Component({
  selector: 'app-career-slider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  styleUrls: ['./career-slider.component.css'],
  templateUrl: './career-slider.component.html'
})
export class CareerSliderComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private zone = inject(NgZone);

  images = signal<{ url: string; caption?: string }[]>([]);
  current = signal(0);
  private timer: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.http.get<{ success: boolean; data: { url: string }[] }>(
      `${environment.apiBaseUrl}/sliders/career`
    ).subscribe({
      next: res => {
        const list = res?.data?.length
          ? res.data.map(s => ({ url: this.resolveUrl(s.url), caption: s.url.includes('unsplash') ? '' : 'Custom uploaded workspace asset' }))
          : FALLBACK_IMAGES;
        this.images.set(list);
        this.startAutoPlay();
      },
      error: () => {
        this.images.set(FALLBACK_IMAGES);
        this.startAutoPlay();
      }
    });
  }

  ngOnDestroy() { this.stopAutoPlay(); }

  goTo(index: number) { this.current.set(index); this.resetAutoPlay(); }
  next() { this.current.update(c => (c + 1) % this.images().length); this.resetAutoPlay(); }
  prev() { this.current.update(c => (c - 1 + this.images().length) % this.images().length); this.resetAutoPlay(); }

  private startAutoPlay() {
    if (this.images().length <= 1) return;
    this.zone.runOutsideAngular(() => {
      this.timer = setInterval(() => {
        this.zone.run(() => this.current.update(c => (c + 1) % this.images().length));
      }, 4500);
    });
  }

  private stopAutoPlay() { if (this.timer) { clearInterval(this.timer); this.timer = null; } }
  private resetAutoPlay() { this.stopAutoPlay(); this.startAutoPlay(); }

  private resolveUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${environment.apiBaseUrl.replace('/api', '')}${url}`;
  }
}