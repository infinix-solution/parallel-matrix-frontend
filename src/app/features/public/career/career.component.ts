import { 
  Component, OnInit, OnDestroy, ChangeDetectionStrategy, 
  computed, inject, signal, ElementRef, ViewChild, effect, untracked 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../../core/services/content.service';
import { CareerSection } from '../../../core/models';

// ─── MATHEMATICAL & PARSING UTILITIES ───
interface ParsedStat { 
  numeric: number; 
  suffix: string; 
  prefix: string; 
}

function parseStat(raw: string): ParsedStat {
  const m = raw.trim().match(/^([^\d]*)(\d[\d,]*)([^\d]*)$/);
  if (!m) return { numeric: 0, suffix: '', prefix: '' };
  return { numeric: parseInt(m[2].replace(/,/g, ''), 10), prefix: m[1] || '', suffix: m[3] || '' };
}

function easeOutQuart(t: number): number { 
  return 1 - Math.pow(1 - t, 4); 
}

@Component({
  selector: 'app-career',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  styles: [`
    :host {
      display: block;
      background: #0a1f44;
      color: #ffffff;
    }

    .container {
      width: min(100%, 1280px);
      margin: 0 auto;
      padding: clamp(40px, 6vw, 80px) 20px;
    }

    /* ── DUAL LAYER SHOWCASE BACKDROP ── */
    .career-showcase-wrapper {
      position: relative;
      border-radius: 24px;
      overflow: hidden;
      background: #0e254e;
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 40px 90px -30px rgba(4, 12, 30, 0.5);
      min-height: 380px;
      display: grid;
      align-items: center;
    }

    /* Layer 1: Animated Asset Backdrop Canvas */
    .showcase-bg-canvas {
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      overflow: hidden;
    }

    .showcase-bg-canvas img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.22; /* Retains clarity of the graph trend without over-powering typography */
      filter: saturate(1.2) contrast(1.1);
      transition: opacity 0.4s ease;
    }

    /* Gradient Mask creating deep contrast for overlapping foreground copy text */
    .showcase-bg-canvas::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, #0a1f44 30%, rgba(10, 31, 68, 0.85) 70%, rgba(20, 50, 110, 0.4) 100%);
      z-index: 2;
    }

    /* Layer 2: Transparent Foreground Interface Panel */
    .career-foreground-panel {
      position: relative;
      z-index: 3;
      padding: clamp(24px, 5vw, 56px);
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
    }

    .eyebrow {
      display: inline-block;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: .2em;
      text-transform: uppercase;
      color: #bcd0ff;
      margin-bottom: 12px;
    }

    h2 {
      margin: 0 0 16px;
      font-size: clamp(1.8rem, 4vw, 2.8rem);
      font-weight: 800;
      line-height: 1.15;
      color: #ffffff;
    }

    .lead {
      margin: 0 0 36px;
      color: #94a3b8;
      font-size: clamp(15px, 1.2vw, 17px);
      line-height: 1.6;
      max-width: 54ch;
    }

    /* ── STATS TRACK ── */
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 28px;
    }

    .stat .n {
      font-size: clamp(2rem, 3.5vw, 3.2rem);
      font-weight: 800;
      color: #f0d97a;
      line-height: 1;
      margin-bottom: 4px;
      font-feature-settings: "tnum";
    }

    .stat .l {
      font-size: 12px;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* ── SHIMMER ENGINE ── */
    .shimmer-mask {
      position: absolute;
      inset: 0;
      z-index: 5;
      background: linear-gradient(90deg, rgba(14,37,78,0) 0%, rgba(255,255,255,0.04) 50%, rgba(14,37,78,0) 100%);
      background-size: 200% 100%;
      animation: moveShimmer 1.5s infinite linear;
    }

    @keyframes moveShimmer { to { background-position: -200% 0; } }

    /* ── FALLBACK BACKUP TIMELINE CHART ── */
    .career-fallback-canvas {
      position: absolute;
      inset: 0;
      z-index: 1;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 8px;
      padding: 40px;
      opacity: 0.07;
      pointer-events: none;
    }

    .fallback-bar {
      flex: 1;
      background: #ffffff;
      border-radius: 4px 4px 0 0;
      transform-origin: bottom;
      animation: graphGrow 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    
    .fallback-bar.accent { background: #f0d97a; }

    @keyframes graphGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
  `],
  template: `
    <section id="career" *ngIf="data() as d">
      <div class="container">
        
        <div #careerBlock class="career-showcase-wrapper">
          <div class="shimmer-mask" *ngIf="!graphLoaded() && !graphError()"></div>
          
          <div class="showcase-bg-canvas" *ngIf="!graphError()">
            <img
              [src]="gifUrl()"
              alt="Background growth metrics graph"
              (load)="graphLoaded.set(true)"
              (error)="graphError.set(true)"
              [style.opacity]="graphLoaded() ? '0.22' : '0'"
              loading="lazy"
            />
          </div>

          <div class="career-fallback-canvas" *ngIf="graphError()">
            <div class="fallback-bar" style="height: 25%"></div>
            <div class="fallback-bar" style="height: 45%"></div>
            <div class="fallback-bar" style="height: 65%"></div>
            <div class="fallback-bar accent" style="height: 90%"></div>
          </div>

          <div class="career-foreground-panel">
            <span class="eyebrow">{{ d.eyebrow }}</span>
            <h2>{{ d.title }}</h2>
            <p class="lead">{{ d.lead }}</p>
            
            <div class="stats">
              <div *ngFor="let label of statLabels(); let i = index" class="stat">
                <div class="n">{{ displayStats()[i] || '0' }}</div>
                <div class="l">{{ label }}</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  `
})
export class CareerComponent implements OnInit, OnDestroy {
  private content = inject(ContentService);

  // Capitalized ViewChild setter supports multi-version structural bindings safely
  @ViewChild('careerBlock', { static: false }) set careerBlockContent(content: ElementRef<HTMLElement>) {
    if (content) {
      this.attachIntersectionObserver(content.nativeElement);
    }
  }

  data = computed<CareerSection | null>(() => this.content.content()?.careerSection ?? null);

  private parsedStats = computed<ParsedStat[]>(() =>
    (this.data()?.stats || []).map(s => parseStat(s.number))
  );

  displayStats = signal<string[]>([]);
  statLabels   = signal<string[]>([]);
  graphLoaded  = signal(false);
  graphError   = signal(false);
  gifUrl       = signal<string>('assets/career-growth.gif');

  private observer?: IntersectionObserver;
  private isCounting = false;

  constructor() {
    effect(() => {
      const currentData = this.data();
      if (!currentData?.stats) return;

      untracked(() => {
        this.statLabels.set(currentData.stats.map(s => s.label));
        this.displayStats.set(this.parsedStats().map(p => p.prefix + '0' + p.suffix));
        
        // Cache buster enforces fresh asset rendering frames on router changes
        this.gifUrl.set(`assets/career-growth.gif?t=${Date.now()}`);
      });
    });
  }

  ngOnInit() {
    this.content.ensureLoaded().subscribe();
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  private attachIntersectionObserver(element: HTMLElement) {
    this.observer?.disconnect();
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !this.isCounting) {
          this.isCounting = true;
          this.runCountUpSequence();
          this.observer?.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    this.observer.observe(element);
  }

  private runCountUpSequence() {
    const parsed = this.parsedStats();
    if (!parsed.length) return;

    const DURATION = 1400;
    const startTime = performance.now();

    const frame = (now: number) => {
      const elapsed = Math.min((now - startTime) / DURATION, 1);
      const ease = easeOutQuart(elapsed);

      this.displayStats.set(
        parsed.map(p => p.prefix + Math.round(p.numeric * ease).toLocaleString() + p.suffix)
      );

      if (elapsed < 1) {
        requestAnimationFrame(frame);
      }
    };

    requestAnimationFrame(frame);
  }
}