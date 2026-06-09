import {
  Component, OnInit, OnDestroy, AfterViewChecked, ChangeDetectionStrategy,
  computed, inject, signal, ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../../core/services/content.service';
import { CareerSection } from '../../../core/models';

interface ParsedStat { numeric: number; suffix: string; prefix: string; }

function parseStat(raw: string): ParsedStat {
  const m = raw.trim().match(/^([^\d]*)(\d[\d,]*)([^\d]*)$/);
  if (!m) return { numeric: 0, suffix: '', prefix: '' };
  return { numeric: parseInt(m[2].replace(/,/g, ''), 10), prefix: m[1] || '', suffix: m[3] || '' };
}

function easeOutQuart(t: number): number { return 1 - Math.pow(1 - t, 4); }

@Component({
  selector: 'app-career',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  styles: [`
    .career-graph-wrap {
      margin-top: 36px;
      padding-top: 28px;
      border-top: 1px solid rgba(255,255,255,.12);
    }
    .career-graph-label {
      font-size: 12px; font-weight: 700; letter-spacing: .18em;
      text-transform: uppercase; color: #bcd0ff; margin-bottom: 14px;
    }
    .career-graph-img-wrap {
      border-radius: 16px; overflow: hidden;
      background: rgba(255,255,255,.06);
      border: 1px solid rgba(255,255,255,.12);
      min-height: 180px; position: relative;
    }
    .career-graph-shimmer {
      position: absolute; inset: 0;
      background: linear-gradient(90deg, rgba(255,255,255,.04) 25%, rgba(255,255,255,.12) 50%, rgba(255,255,255,.04) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.6s infinite;
    }
    @keyframes shimmer { to { background-position: -200% 0 } }
    .career-graph-img {
      width: 100%; display: block;
      opacity: 0; transition: opacity .5s ease;
    }
    .career-graph-img-wrap.loaded .career-graph-img { opacity: 1; }
    .career-graph-fallback {
      display: flex; align-items: flex-end; gap: 12px;
      padding: 24px 28px; height: 180px; justify-content: center;
    }
    .cgf-bar {
      flex: 1; max-width: 48px; border-radius: 8px 8px 0 0;
      background: rgba(255,255,255,.18);
      display: flex; align-items: flex-end; justify-content: center;
      padding-bottom: 6px; font-size: 10px; color: rgba(255,255,255,.6);
      font-weight: 700; letter-spacing: .04em;
      animation: barGrow .9s cubic-bezier(.2,.9,.3,1) both;
    }
    .cgf-bar--accent { background: linear-gradient(180deg,#f0d97a,#c9a227); color: #0a1f44; }
    @keyframes barGrow { from { transform: scaleY(0); transform-origin: bottom } to { transform: scaleY(1) } }
  `],
  template: `
    <section id="career" *ngIf="data() as d">
      <div class="container">
        <div class="career">
          <span class="eyebrow" style="color:#bcd0ff">{{ d.eyebrow }}</span>
          <h2>{{ d.title }}</h2>
          <p class="lead">{{ d.lead }}</p>
          <div class="stats">
            <div *ngFor="let s of displayStats(); let i = index" class="stat">
              <div class="n">{{ s }}</div>
              <div class="l">{{ statLabels()[i] }}</div>
            </div>
          </div>

          <!-- Career growth graph visual -->
          <div class="career-graph-wrap">
            <div class="career-graph-label">
              <i class="fa-solid fa-chart-line" aria-hidden="true"></i>&nbsp;Growth Trajectory
            </div>
            <div class="career-graph-img-wrap" [class.loaded]="graphLoaded()">
              <div class="career-graph-shimmer" *ngIf="!graphLoaded()"></div>
              <img
                src="assets/career-growth.gif"
                alt="Career growth graph"
                class="career-graph-img"
                loading="lazy"
                (load)="graphLoaded.set(true)"
                (error)="onGraphError($event)"
                *ngIf="!graphError()"
              >
              <!-- Fallback CSS chart when GIF is unavailable -->
              <div class="career-graph-fallback" *ngIf="graphError()">
                <div class="cgf-bar" style="height:35%"><span>Y1</span></div>
                <div class="cgf-bar" style="height:55%"><span>Y2</span></div>
                <div class="cgf-bar" style="height:70%"><span>Y3</span></div>
                <div class="cgf-bar" style="height:88%"><span>Y4</span></div>
                <div class="cgf-bar cgf-bar--accent" style="height:100%"><span>Now</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class CareerComponent implements OnInit, AfterViewChecked, OnDestroy {
  private content = inject(ContentService);
  private el     = inject(ElementRef);

  data = computed<CareerSection | null>(() => this.content.content()?.careerSection ?? null);

  private parsedStats = computed<ParsedStat[]>(() =>
    (this.data()?.stats || []).map(s => parseStat(s.number))
  );

  displayStats = signal<string[]>([]);
  statLabels   = signal<string[]>([]);
  graphLoaded  = signal(false);
  graphError   = signal(false);

  onGraphError(e: Event) {
    (e.target as HTMLImageElement).style.display = 'none';
    this.graphError.set(true);
  }

  private observer?: IntersectionObserver;
  private animating        = false;
  private observerAttached = false;

  ngOnInit() { this.content.ensureLoaded().subscribe(); }

  /**
   * Fires after EVERY change-detection cycle, including after *ngIf renders
   * new nodes. This is the only reliable hook to detect when .career appears.
   *
   * The three guards make each call trivially cheap after the first success.
   */
  ngAfterViewChecked() {
    if (this.observerAttached) return;                 // done — fast exit
    if (!this.data()?.stats?.length) return;           // data not ready
    const block = (this.el.nativeElement as HTMLElement)
      .querySelector<HTMLElement>('.career');
    if (!block) return;                                // DOM not ready

    // Mark attached synchronously so re-entrant calls are no-ops.
    this.observerAttached = true;

    // Defer signal writes to avoid ExpressionChangedAfterItHasBeenChecked.
    // Promise.resolve() is a microtask — zone.js will schedule one more CD
    // cycle after this, which picks up the updated displayStats/statLabels.
    Promise.resolve().then(() => {
      const d = this.data();
      if (!d) return;
      this.statLabels.set(d.stats.map(s => s.label));
      this.displayStats.set(
        this.parsedStats().map(p => p.prefix + '0' + p.suffix)
      );
    });

    this.attachObserver(block);
  }

  ngOnDestroy() { this.observer?.disconnect(); }

  private attachObserver(block: HTMLElement) {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !this.animating) {
          this.animating = true;
          this.runCountUp();
          this.observer?.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    this.observer.observe(block);
  }

  private runCountUp() {
    const parsed = this.parsedStats();
    if (!parsed.length) return;

    const DURATION = 1500;
    const start    = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      const e = easeOutQuart(t);
      this.displayStats.set(
        parsed.map(p => p.prefix + Math.round(p.numeric * e).toLocaleString() + p.suffix)
      );
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }
}
