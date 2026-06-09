import {
  Component, OnInit, OnDestroy, AfterViewChecked,
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
  imports: [CommonModule],
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
