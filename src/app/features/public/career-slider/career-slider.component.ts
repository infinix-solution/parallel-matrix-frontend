import {
  Component, OnInit, OnDestroy, inject, signal, computed, NgZone, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

const FALLBACK_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=80', caption: 'Building careers with purpose' },
  { url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80', caption: 'Every role, a new chapter' },
  { url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=80', caption: 'Your ambition, our network' },
  { url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80', caption: 'Talent meets opportunity' },
];

@Component({
  selector: 'app-career-slider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  styles: [`
    :host { display: block; }

    .cslider-section {
      padding: 80px 0;
      background: var(--pm-grad);
      color: #fff;
      overflow: hidden;
      position: relative;
    }
    .cslider-section::after {
      content: '';
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 80px;
      background: linear-gradient(180deg, transparent, rgba(10,18,38,.3));
      pointer-events: none;
    }

    .cslider-head {
      text-align: center;
      margin-bottom: 44px;
      position: relative;
      z-index: 2;
    }
    .cslider-eyebrow {
      display: inline-block;
      font-size: 11px; font-weight: 700;
      letter-spacing: .3em; text-transform: uppercase;
      color: #bcd0ff; margin-bottom: 12px;
    }
    .cslider-title {
      font-family: 'Sora', sans-serif;
      font-size: clamp(26px, 3.5vw, 40px);
      font-weight: 800; margin: 0 0 12px;
      color: #fff;
    }
    .cslider-sub {
      color: #cfd9f0; font-size: 15px;
      max-width: 520px; margin: 0 auto;
      line-height: 1.6;
    }

    /* ── Carousel ── */
    .cslider-track-wrap {
      position: relative;
      border-radius: 24px;
      overflow: hidden;
      aspect-ratio: 21/9;
      max-height: 440px;
      box-shadow: 0 30px 70px -20px rgba(0,0,0,.5);
      z-index: 2;
    }
    .cslider-slide {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      opacity: 0;
      transition: opacity .9s cubic-bezier(.4,0,.2,1);
    }
    .cslider-slide.active { opacity: 1; }
    .cslider-slide::after {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(180deg, transparent 40%, rgba(10,18,38,.65) 100%);
    }
    .cslider-caption {
      position: absolute;
      bottom: 22px; left: 24px; right: 80px;
      color: #fff;
      font-size: 15px; font-weight: 600;
      z-index: 3;
      text-shadow: 0 2px 8px rgba(0,0,0,.5);
    }

    /* ── Navigation dots ── */
    .cslider-dots {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-top: 20px;
      position: relative; z-index: 2;
    }
    .cslider-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: rgba(255,255,255,.35);
      border: none; cursor: pointer;
      padding: 0; transition: background .25s, transform .25s;
      min-height: 8px; min-width: 8px;
    }
    .cslider-dot.active {
      background: #fff;
      transform: scale(1.35);
    }

    /* ── Prev/Next arrows ── */
    .cslider-arrows {
      position: absolute;
      top: 50%; right: 16px;
      transform: translateY(-50%);
      display: flex; flex-direction: column; gap: 8px;
      z-index: 3;
    }
    .cslider-arrow {
      width: 36px; height: 36px;
      border-radius: 50%;
      background: rgba(255,255,255,.18);
      border: 1px solid rgba(255,255,255,.3);
      color: #fff; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background .2s; min-height: 36px;
    }
    .cslider-arrow:hover { background: rgba(255,255,255,.35); }

    @media (max-width: 768px) {
      .cslider-track-wrap { aspect-ratio: 4/3; max-height: 300px; }
      .cslider-section { padding: 56px 0; }
      .cslider-head { margin-bottom: 28px; }
    }
    @media (max-width: 480px) {
      .cslider-track-wrap { aspect-ratio: 1/1; max-height: 260px; border-radius: 16px; }
      .cslider-section { padding: 44px 0; }
    }
  `],
  template: `
    <section class="cslider-section" id="career-slider">
      <div class="container">
        <div class="cslider-head reveal in">
          <div class="cslider-eyebrow">Life at Parallel Matrix</div>
          <h2 class="cslider-title">Career in Parallel Matrix</h2>
          <p class="cslider-sub">Join a team that grows together. See what a career at Parallel Matrix looks like.</p>
        </div>

        <div style="position:relative" *ngIf="images().length > 0">
          <div class="cslider-track-wrap">
            <div *ngFor="let img of images(); let i = index"
                 class="cslider-slide"
                 [class.active]="current() === i"
                 [style.background-image]="'url(' + img.url + ')'">
            </div>
            <div class="cslider-caption" *ngIf="images()[current()]?.caption">
              {{ images()[current()].caption }}
            </div>
            <div class="cslider-arrows" *ngIf="images().length > 1">
              <button class="cslider-arrow" (click)="prev()" aria-label="Previous slide">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg>
              </button>
              <button class="cslider-arrow" (click)="next()" aria-label="Next slide">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
            </div>
          </div>

          <div class="cslider-dots" *ngIf="images().length > 1">
            <button *ngFor="let img of images(); let i = index"
                    class="cslider-dot"
                    [class.active]="current() === i"
                    (click)="goTo(i)"
                    [attr.aria-label]="'Go to slide ' + (i+1)">
            </button>
          </div>
        </div>
      </div>
    </section>
  `
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
          ? res.data.map(s => ({ url: this.resolveUrl(s.url) }))
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

  goTo(index: number) {
    this.current.set(index);
    this.resetAutoPlay();
  }

  next() {
    this.current.update(c => (c + 1) % this.images().length);
    this.resetAutoPlay();
  }

  prev() {
    this.current.update(c => (c - 1 + this.images().length) % this.images().length);
    this.resetAutoPlay();
  }

  private startAutoPlay() {
    if (this.images().length <= 1) return;
    this.zone.runOutsideAngular(() => {
      this.timer = setInterval(() => {
        this.zone.run(() => this.current.update(c => (c + 1) % this.images().length));
      }, 4500);
    });
  }

  private stopAutoPlay() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  }

  private resetAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  private resolveUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${environment.apiBaseUrl.replace('/api', '')}${url}`;
  }
}
