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
  styles: [`
    :host {
      display: block;
      --pm-navy: #0a1f44;
      --pm-gold: #c9a227;
      --pm-gold-light: rgba(201, 162, 39, 0.12);
      --pm-text-mute: #64748b;
    }

    .career-section {
      position: relative;
      padding: clamp(40px, 7vw, 110px) 0;
      background: linear-gradient(180deg, #ffffff 0%, #f5f9fd 100%);
      overflow: hidden;
    }

    .career-container {
      width: min(100%, 1280px);
      margin: 0 auto;
      padding: 0 clamp(16px, 4vw, 32px);
    }

    .career-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: clamp(24px, 5vw, 70px);
      align-items: center;

      @media (min-width: 1024px) {
        grid-template-columns: minmax(0, 0.88fr) minmax(0, 1.12fr);
      }
    }

    /* ── Typography Column ── */
    .career-content {
      display: flex;
      flex-direction: column;
      z-index: 2;
      
      @media (max-width: 1023px) {
        text-align: center;
        align-items: center;
      }
    }

    .career-eyebrow {
      display: inline-flex;
      align-items: center;
      padding: 6px 14px;
      border-radius: 999px;
      background: var(--pm-gold-light);
      color: #927314;
      font-size: clamp(10px, 1vw, 11px);
      font-weight: 800;
      letter-spacing: .22em;
      text-transform: uppercase;
      width: fit-content;
      margin-bottom: clamp(12px, 2vw, 20px);
    }

    .career-title {
      font-family: 'Sora', sans-serif;
      font-size: clamp(1.75rem, 4vw, 3.2rem);
      font-weight: 800;
      line-height: 1.15;
      color: var(--pm-navy);
      margin: 0 0 14px 0;
      letter-spacing: -0.03em;
    }

    .career-title span {
      background: linear-gradient(90deg, #1857c4, var(--pm-gold));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .career-description {
      font-size: clamp(14px, 1.1vw, 16.5px);
      line-height: 1.55;
      color: var(--pm-text-mute);
      margin: 0 0 clamp(20px, 3vw, 32px) 0;
      max-width: 540px;
    }

    /* ── Mobile-Optimized Swiper Tabs ── */
    .career-steps {
      display: flex;
      gap: 8px;
      width: 100%;
      margin-top: 4px;
      
      @media (max-width: 1023px) {
        /* CHANGED: Hide the workspace step tabs on mobile/tablet views layout entirely */
        display: none !important;
      }
    }

    .career-step-pill {
      padding: 10px 18px;
      border-radius: 14px;
      background: #ffffff;
      border: 1px solid rgba(10, 31, 68, 0.07);
      font-size: 12px;
      font-weight: 700;
      color: var(--pm-navy);
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(10, 31, 68, 0.02);
      white-space: nowrap;
      scroll-snap-align: start;
      transition: all 0.25s cubic-bezier(0.25, 1, 0.5, 1);
    }

    .career-step-pill.active {
      background: var(--pm-navy);
      color: #ffffff;
      box-shadow: 0 8px 18px -6px rgba(10, 31, 68, 0.25);
      transform: translateY(-1px);
    }

    /* ── Visual Frame Column ── */
    .career-visual-wrapper {
      position: relative;
      width: 100%;
    }

    .career-display-frame {
      position: relative;
      width: 100%;
      aspect-ratio: 4/3;
      border-radius: clamp(24px, 4vw, 48px) 14px clamp(24px, 4vw, 48px) 14px;
      overflow: hidden;
      box-shadow: 0 25px 55px -20px rgba(10, 31, 68, 0.2);
      background: #020813;

      @media (min-width: 640px) {
        aspect-ratio: 16/10;
      }
    }

    .career-img-layer {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      opacity: 0;
      transform: scale(1.05);
      transition: opacity 0.75s cubic-bezier(0.25, 1, 0.5, 1), transform 0.75s ease;
    }

    .career-img-layer.active {
      opacity: 1;
      transform: scale(1);
    }

    .career-img-layer::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent 40%, rgba(10, 31, 68, 0.8) 100%);
    }

    /* Floating Adaptive Caption Box */
    .career-glass-card {
      position: absolute;
      bottom: clamp(12px, 3vw, 24px);
      left: clamp(12px, 3vw, 24px);
      right: clamp(12px, 3vw, 24px);
      padding: clamp(14px, 2.5vw, 20px);
      background: rgba(255, 255, 255, 0.88);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-radius: 18px;
      border: 1px solid rgba(255, 255, 255, 0.5);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
      z-index: 3;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .career-glass-tag {
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: var(--pm-gold);
    }

    .career-glass-text {
      font-size: clamp(12px, 1.1vw, 14.5px);
      font-weight: 600;
      color: var(--pm-navy);
      line-height: 1.4;
    }

    /* Navigation Controls Row */
    .career-action-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 18px;
      gap: 16px;
      
      @media (max-width: 480px) {
        margin-top: 14px;
      }
    }

    .career-arrows-row {
      display: flex;
      gap: 10px;
    }

    .career-nav-btn {
      width: clamp(42px, 5vw, 46px);
      height: clamp(42px, 5vw, 46px);
      border-radius: 50%;
      background: #ffffff;
      border: 1px solid rgba(10, 31, 68, 0.08);
      color: var(--pm-navy);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(10, 31, 68, 0.04);
      transition: all 0.2s ease;
    }

    .career-nav-btn:hover {
      background: var(--pm-navy);
      color: #ffffff;
      transform: translateY(-2px);
    }
    
    .career-nav-btn:active {
      transform: scale(0.95);
    }

    .career-counter {
      font-size: 12px;
      font-weight: 700;
      color: var(--pm-navy);
      background: rgba(10, 31, 68, 0.04);
      padding: 6px 14px;
      border-radius: 999px;
    }
  `],
  template: `
    <section class="career-section" id="career-slider">
      <div class="career-container">
        <div class="career-grid">
          
          <div class="career-content">
            <div class="career-eyebrow">Life at Parallel Matrix</div>
            <h2 class="career-title">Career in <span>Parallel Matrix</span></h2>
            <p class="career-description">
              Join a team that grows together. See what a career at Parallel Matrix looks like.
            </p>

            <div class="career-steps" *ngIf="images().length > 1">
              <button 
                *ngFor="let img of images(); let i = index"
                type="button"
                class="career-step-pill"
                [class.active]="current() === i"
                (click)="goTo(i)">
                Workspace {{ i + 1 }}
              </button>
            </div>
          </div>

          <div class="career-visual-wrapper" *ngIf="images().length > 0">
            <div class="career-display-frame">
              <div *ngFor="let img of images(); let i = index"
                   class="career-img-layer"
                   [class.active]="current() === i"
                   [style.background-image]="'url(' + img.url + ')'">
              </div>

              <div class="career-glass-card" *ngIf="images()[current()]?.caption">
                <span class="career-glass-tag">Corporate Environment</span>
                <span class="career-glass-text">{{ images()[current()].caption }}</span>
              </div>
            </div>

            <div class="career-action-controls" *ngIf="images().length > 1">
              <div class="career-arrows-row">
                <button class="career-nav-btn" (click)="prev()" aria-label="Previous slide">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </button>
                <button class="career-nav-btn" (click)="next()" aria-label="Next slide">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>

              <div class="career-counter">
                {{ current() + 1 }} &nbsp;/&nbsp; {{ images().length }}
              </div>
            </div>
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