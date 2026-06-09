import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, signal, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

const FALLBACK_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80', caption: 'Onboard with clarity' },
  { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80', caption: 'Scale with confidence' },
  { url: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1200&q=80', caption: 'Leadership starts here' },
  { url: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&q=80', caption: 'Your potential, amplified' },
];

const MILESTONE_MESSAGES = [
  'Start with extreme clarity, personalized mentorship support, and a high-impact first sprint blueprint.',
  'Build execution confidence early by contributing directly to core products and shipping production systems.',
  'Take complete ownership of domain outcomes, cross-collaborate across lines, and push technical boundaries.',
  'Own strategic initiatives, mentor engineering pods, and play a direct role in shaping architectural directions.'
];

type TrajectoryStage = {
  label: string;
  title: string;
  summary: string;
  metric: string;
  x: number;
  y: number;
  align: 'start' | 'end';
};

type TrajectoryHighlight = {
  value: string;
  label: string;
};

@Component({
  selector: 'app-growth-slider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  styles: [
    `
      :host {
        display: block;
        --navy: #0a1f44;
        --mute: #64748b;
        --gold: #c9a227;
        --gold-dark: #927314;
        --blue2: #1857c4;
        --grad2: linear-gradient(135deg, #1857c4 0%, #0a1f44 100%);
      }

      .trajectory-section {
        position: relative;
        overflow: hidden;
        padding: clamp(56px, 8vw, 104px) 0;
        background:
          radial-gradient(900px 520px at 12% 0%, rgba(24, 87, 196, .14), transparent 55%),
          radial-gradient(760px 460px at 100% 20%, rgba(201, 162, 39, .14), transparent 52%),
          linear-gradient(180deg, #f7f9fd 0%, #edf3fb 100%);
      }

      .trajectory-section::before {
        content: '';
        position: absolute;
        inset: auto -120px -200px auto;
        width: 420px;
        height: 420px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(59, 130, 246, .16), transparent 68%);
        pointer-events: none;
        filter: blur(4px);
      }

      .trajectory-shell {
        width: min(100%, 1280px);
        margin: 0 auto;
        padding: 0 clamp(16px, 3vw, 32px);
        position: relative;
        z-index: 1;
      }

      .trajectory-grid {
        display: grid;
        grid-template-columns: minmax(0, .94fr) minmax(0, 1.06fr);
        gap: clamp(28px, 5vw, 64px);
        align-items: center;
      }

      .trajectory-copy {
        min-width: 0;
      }

      .trajectory-pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 14px;
        border-radius: 999px;
        border: 1px solid rgba(140, 110, 10, .25);
        background: rgba(201, 162, 39, .12);
        color: var(--gold-dark);
        font-size: 11px;
        font-weight: 800;
        letter-spacing: .24em;
        text-transform: uppercase;
        width: fit-content;
        margin-bottom: 22px;
        box-shadow: 0 10px 26px -16px rgba(140, 110, 10, .5);
      }

      .trajectory-title {
        margin: 0;
        max-width: 15ch;
        color: var(--navy);
        font-family: 'Sora', sans-serif;
        font-size: clamp(2.1rem, 4.5vw, 4.6rem);
        font-weight: 800;
        line-height: .98;
        letter-spacing: -.04em;
      }

      .trajectory-title span {
        display: inline-block;
        background: linear-gradient(90deg, var(--blue2), var(--gold));
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }

      .trajectory-description {
        margin: 18px 0 0;
        max-width: 34rem;
        color: var(--mute);
        font-size: clamp(0.98rem, 1.35vw, 1.08rem);
        line-height: 1.7;
      }

      .trajectory-insights {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;
        margin-top: 32px;
      }

      .trajectory-insight {
        min-width: 0;
        padding: 18px 16px;
        border-radius: 20px;
        border: 1px solid rgba(10, 31, 68, .08);
        background: rgba(255, 255, 255, .76);
        backdrop-filter: blur(14px);
        box-shadow: 0 18px 36px -20px rgba(10, 31, 68, .28);
      }

      .trajectory-insight .eyebrow {
        display: block;
        margin: 0 0 10px;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: .2em;
        text-transform: uppercase;
        color: var(--gold-dark);
      }

      .trajectory-insight h3 {
        margin: 0 0 6px;
        color: var(--navy);
        font-size: 15px;
        font-weight: 800;
        line-height: 1.2;
      }

      .trajectory-insight p {
        margin: 0;
        color: var(--mute);
        font-size: 13.5px;
        line-height: 1.55;
      }

      .trajectory-board {
        min-width: 0;
      }

      .trajectory-board-shell {
        position: relative;
        border-radius: 30px;
        padding: 18px;
        background: rgba(10, 31, 68, .04);
        border: 1px solid rgba(10, 31, 68, .08);
        box-shadow: 0 34px 80px -28px rgba(10, 31, 68, .3);
        backdrop-filter: blur(18px);
      }

      .trajectory-board-shell::before {
        content: '';
        position: absolute;
        inset: 12px;
        border-radius: 24px;
        border: 1px solid rgba(255, 255, 255, .58);
        pointer-events: none;
      }

      .trajectory-board-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        padding: 6px 6px 16px;
      }

      .trajectory-board-label {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: var(--gold-dark);
        font-size: 11px;
        font-weight: 800;
        letter-spacing: .22em;
        text-transform: uppercase;
      }

      .trajectory-board-title {
        display: block;
        margin-top: 4px;
        color: var(--navy);
        font-size: 18px;
        font-weight: 800;
        line-height: 1.2;
      }

      .trajectory-board-count {
        flex-shrink: 0;
        padding: 8px 12px;
        border-radius: 999px;
        background: rgba(255, 255, 255, .82);
        border: 1px solid rgba(10, 31, 68, .08);
        color: var(--navy);
        font-size: 12px;
        font-weight: 800;
        letter-spacing: .08em;
        white-space: nowrap;
      }

      .trajectory-canvas {
        display: grid;
        grid-template-columns: minmax(190px, .85fr) minmax(0, 1.15fr);
        gap: 16px;
        align-items: stretch;
      }

      .trajectory-track {
        position: relative;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 20px 4px;
      }

      .trajectory-track::before {
        content: '';
        position: absolute;
        left: 25px;
        top: 18px;
        bottom: 18px;
        width: 2px;
        border-radius: 999px;
        background: linear-gradient(180deg, rgba(24, 87, 196, .12), rgba(201, 162, 39, .5), rgba(24, 87, 196, .12));
      }

      .trajectory-node {
        position: relative;
        width: 100%;
        display: grid;
        grid-template-columns: 40px minmax(0, 1fr);
        align-items: center;
        gap: 12px;
        padding: 12px 14px 12px 0;
        border: 0;
        border-radius: 18px;
        background: transparent;
        color: inherit;
        cursor: pointer;
        text-align: left;
        transition: transform .25s ease, background .25s ease, box-shadow .25s ease;
      }

      .trajectory-node:hover {
        transform: translateX(4px);
        background: rgba(255, 255, 255, .5);
      }

      .trajectory-node.active {
        background: rgba(255, 255, 255, .82);
        box-shadow: 0 14px 30px -22px rgba(10, 31, 68, .35);
      }

      .trajectory-node-dot {
        position: relative;
        z-index: 1;
        width: 18px;
        height: 18px;
        margin-left: 16px;
        border-radius: 50%;
        border: 2px solid rgba(24, 87, 196, .18);
        background: #fff;
        box-shadow: 0 0 0 6px rgba(24, 87, 196, .05);
        flex-shrink: 0;
        transition: all .25s ease;
      }

      .trajectory-node.active .trajectory-node-dot {
        background: var(--grad2);
        border-color: #fff;
        box-shadow: 0 0 0 8px rgba(24, 87, 196, .14), 0 12px 24px -12px rgba(24, 87, 196, .75);
        transform: scale(1.04);
      }

      .trajectory-node-content {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .trajectory-node-eyebrow {
        font-size: 11px;
        font-weight: 800;
        letter-spacing: .18em;
        text-transform: uppercase;
        color: var(--gold-dark);
      }

      .trajectory-node-title {
        color: var(--navy);
        font-size: 14px;
        font-weight: 700;
        line-height: 1.35;
        word-break: break-word;
      }

      .trajectory-stage {
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: flex-end;
        min-height: clamp(340px, 42vw, 460px);
        border-radius: 26px;
        background-color: #0a1f44;
        background-position: center;
        background-size: cover;
        box-shadow: 0 24px 60px -20px rgba(10, 31, 68, .42);
        isolation: isolate;
        transition: background-image 0.4s ease-in-out;
      }

      .trajectory-stage::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(10, 18, 38, .1) 0%, rgba(10, 18, 38, .4) 45%, rgba(10, 18, 38, .88) 100%);
        z-index: 0;
      }

      .trajectory-stage-meta {
        position: relative;
        z-index: 1;
        width: 100%;
        padding: 24px;
        color: #fff;
      }

      .trajectory-stage-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 7px 12px;
        border-radius: 999px;
        background: rgba(255, 255, 255, .14);
        border: 1px solid rgba(255, 255, 255, .2);
        color: #fff;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: .18em;
        text-transform: uppercase;
        backdrop-filter: blur(10px);
      }

      .trajectory-stage-meta h3 {
        margin: 12px 0 8px;
        font-size: clamp(1.2rem, 2.35vw, 1.8rem);
        line-height: 1.1;
        letter-spacing: -.03em;
      }

      .trajectory-stage-meta p {
        margin: 0;
        max-width: 38ch;
        color: #d7e2fb;
        font-size: 14px;
        line-height: 1.6;
      }

      .trajectory-stage-foot {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-top: 20px;
        flex-wrap: wrap;
      }

      .trajectory-progress {
        height: 6px;
        flex: 1 1 180px;
        min-width: 120px;
        border-radius: 999px;
        background: rgba(255, 255, 255, .14);
        overflow: hidden;
      }

      .trajectory-progress span {
        display: block;
        height: 100%;
        border-radius: inherit;
        background: linear-gradient(90deg, var(--gold), #fff);
        transition: width .35s ease;
      }

      .trajectory-controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 16px 6px 6px;
        flex-wrap: wrap;
      }

      .trajectory-nav {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .trajectory-arrow {
        width: 44px;
        height: 44px;
        min-width: 44px;
        min-height: 44px;
        border-radius: 50%;
        border: 1px solid rgba(10, 31, 68, .08);
        background: rgba(255, 255, 255, .9);
        color: var(--navy);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 12px 24px -16px rgba(10, 31, 68, .4);
        cursor: pointer;
        transition: all .2s ease;
      }

      .trajectory-arrow:hover {
        transform: translateY(-2px);
        background: #fff;
        box-shadow: 0 16px 28px -16px rgba(10, 31, 68, .45);
      }

      .trajectory-dots {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        justify-content: flex-end;
      }

      .trajectory-dot-btn {
        width: 9px;
        height: 9px;
        min-width: 9px;
        min-height: 9px;
        padding: 0;
        border: none;
        border-radius: 999px;
        background: rgba(10, 31, 68, .18);
        cursor: pointer;
        transition: width .25s ease, background .25s ease;
      }

      .trajectory-dot-btn.active {
        width: 28px;
        background: var(--grad2);
      }

      /* ─────────────────────────────────────────────────────────
         ── REBUILT HIGH-PERFORMANCE RESPONSIVE INFRASTRUCTURE ──
         ───────────────────────────────────────────────────────── */
      @media (max-width: 1140px) {
        .trajectory-grid {
          grid-template-columns: 1fr;
          gap: 40px;
        }
        .trajectory-title {
          max-width: 100%;
        }
        .trajectory-description {
          max-width: 100%;
        }
      }

      /* Clean Responsive Breakpoint Layer */
      @media (max-width: 860px) {
        .trajectory-canvas {
          grid-template-columns: 1fr; /* Stack into neat mobile cards */
          gap: 20px;
        }

        /* FIX: Hide the sidebar stage track completely on small views */
        .trajectory-track {
          display: none !important;
        }

        .trajectory-insights {
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        }
      }

      @media (max-width: 640px) {
        .trajectory-section {
          padding: 44px 0;
        }

        .trajectory-shell {
          padding: 0 16px;
        }

        .trajectory-board-shell {
          border-radius: 24px;
          padding: 14px;
        }

        .trajectory-stage {
          min-height: 280px;
          border-radius: 20px;
        }

        .trajectory-stage-meta {
          padding: 20px;
        }

        .trajectory-stage-meta p {
          font-size: 13.5px;
        }
      }

      @media (max-width: 480px) {
        .trajectory-insights {
          grid-template-columns: 1fr;
          gap: 12px;
        }
        
        .trajectory-board-top {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }
        
        .trajectory-board-count {
          align-self: flex-end;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .trajectory-node,
        .trajectory-arrow,
        .trajectory-dot-btn,
        .trajectory-progress span {
          transition: none !important;
        }
      }
    `
  ],
  template: `
    <section class="trajectory-section" id="growth-slider">
      <div class="trajectory-shell">
        <div class="trajectory-grid">
          
          <div class="trajectory-copy">
            <div class="trajectory-pill">Your Trajectory</div>

            <h2 class="trajectory-title">
              Growth in <span>Parallel Matrix</span>
            </h2>

            <p class="trajectory-description">
              From day one to leadership — see the paths our people walk.
            </p>

            <div class="trajectory-insights">
              <article class="trajectory-insight">
                <span class="eyebrow">Stage 01</span>
                <h3>Onboard with clarity</h3>
                <p>Fast starts with clear direction, support, and early momentum.</p>
              </article>
              <article class="trajectory-insight">
                <span class="eyebrow">Stage 02</span>
                <h3>Build visible impact</h3>
                <p>Real work, measurable progress, and a path that keeps expanding.</p>
              </article>
              <article class="trajectory-insight">
                <span class="eyebrow">Stage 03</span>
                <h3>Move into leadership</h3>
                <p>Own outcomes, influence decisions, and shape what comes next.</p>
              </article>
            </div>
          </div>

          <div class="trajectory-board" *ngIf="images().length > 0">
            <div class="trajectory-board-shell">
              
              <div class="trajectory-board-top">
                <div>
                  <span class="trajectory-board-label">Growth graph</span>
                  <span class="trajectory-board-title">Trajectory track in motion</span>
                </div>
                <div class="trajectory-board-count">
                  {{ current() + 1 }} / {{ images().length }}
                </div>
              </div>

              <div class="trajectory-canvas">
                
                <div class="trajectory-track" *ngIf="images().length > 1">
                  <button
                    *ngFor="let img of images(); let i = index"
                    type="button"
                    class="trajectory-node"
                    [class.active]="current() === i"
                    (click)="goTo(i)"
                    [attr.aria-label]="'Go to stage ' + (i + 1)">
                    <span class="trajectory-node-dot"></span>
                    <span class="trajectory-node-content">
                      <span class="trajectory-node-eyebrow">Stage {{ i + 1 }}</span>
                      <span class="trajectory-node-title">{{ img.caption || ('Growth path ' + (i + 1)) }}</span>
                    </span>
                  </button>
                </div>

                <div class="trajectory-stage" [style.background-image]="'url(' + images()[current()]?.url + ')'">
                  <div class="trajectory-stage-meta">
                    <span class="trajectory-stage-badge">Leadership path</span>
                    <h3>{{ images()[current()]?.caption || 'Parallel growth' }}</h3>
                    
                    <p>{{ MILESTONE_MESSAGES[current()] }}</p>

                    <div class="trajectory-stage-foot">
                      <div class="trajectory-progress" [attr.aria-label]="'Progress ' + (current() + 1) + ' of ' + images().length">
                        <span [style.width.%]="((current() + 1) / images().length) * 100"></span>
                      </div>
                      <div class="trajectory-board-count">
                        {{ current() + 1 }} / {{ images().length }}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <div class="trajectory-controls" *ngIf="images().length > 1">
                <div class="trajectory-nav">
                  <button class="trajectory-arrow" type="button" (click)="prev()" aria-label="Previous stage">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <button class="trajectory-arrow" type="button" (click)="next()" aria-label="Next stage">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="9 18 13 12 9 6" />
                    </svg>
                  </button>
                </div>

                <div class="trajectory-dots">
                  <button
                    *ngFor="let img of images(); let i = index"
                    type="button"
                    class="trajectory-dot-btn"
                    [class.active]="current() === i"
                    (click)="goTo(i)"
                    [attr.aria-label]="'Go to stage ' + (i + 1)">
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  `
})
export class GrowthSliderComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private zone = inject(NgZone);

  readonly MILESTONE_MESSAGES = MILESTONE_MESSAGES;
  images = signal<{ url: string; caption?: string }[]>([]);
  current = signal(0);
  private timer: ReturnType<typeof setInterval> | null = null;

  readonly stageCards: TrajectoryStage[] = [
    { label: 'Day 1', title: 'Join & Onboard', summary: 'Start with clarity, support, and a guided first sprint.', metric: 'Foundation', x: 16, y: 76, align: 'end' },
    { label: 'Quarter 1', title: 'Skill Up & Contribute', summary: 'Build confidence by shipping meaningful work early.', metric: 'Momentum', x: 39, y: 50, align: 'end' },
    { label: 'Year 1', title: 'Own Outcomes', summary: 'Take wider responsibility and shape team-level results.', metric: 'Ownership', x: 63, y: 34, align: 'start' },
    { label: 'Leadership', title: 'Lead & Impact', summary: 'Guide direction, lift others, and influence what comes next.', metric: 'Impact', x: 86, y: 62, align: 'start' }
  ];

  readonly highlights: TrajectoryHighlight[] = [
    { value: '4', label: 'Growth stages' },
    { value: '1', label: 'Clear trajectory' },
    { value: '360°', label: 'Visibility on progress' }
  ];

  ngOnInit() {
    this.http.get<{ success: boolean; data: { url: string; caption?: string }[] }>(
      `${environment.apiBaseUrl}/sliders/growth`
    ).subscribe({
      next: (res:any) => {
        let list = FALLBACK_IMAGES;
        if (res?.data?.length) {
          list = Array.from({ length: 4 }, (_, idx) => {
            const apiItem = res.data[idx % res.data.length];
            return {
              url: this.resolveUrl(apiItem.url),
              caption: apiItem.caption || FALLBACK_IMAGES[idx].caption
            };
          });
        }
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
  next() { this.current.update((c:number) => (c + 1) % this.images().length); this.resetAutoPlay(); }
  prev() { this.current.update((c:number) => (c - 1 + this.images().length) % this.images().length); this.resetAutoPlay(); }

  private startAutoPlay() {
    if (this.images().length <= 1) return;
    this.zone.runOutsideAngular(() => {
      this.timer = setInterval(() => {
        this.zone.run(() => this.current.update((c:number) => (c + 1) % this.images().length));
      }, 5000);
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