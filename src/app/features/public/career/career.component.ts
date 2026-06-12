import { 
  Component, OnInit, OnDestroy, ChangeDetectionStrategy, 
  computed, inject, signal, ElementRef, ViewChild, effect, untracked 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../../core/services/content.service';
import { CareerSection } from '../../../core/models';

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
  styleUrls: ['./career.component.css'],
  templateUrl: './career.component.html'
})
export class CareerComponent implements OnInit, OnDestroy {
  private content = inject(ContentService);

  @ViewChild('careerBlock', { static: false }) set careerBlockContent(content: ElementRef<HTMLElement>) {
    if (content) {
      this.attachIntersectionObserver(content.nativeElement);
    }
  }

  isLoading = computed(() => this.content.content() === null);
  data = computed<CareerSection | null>(() => this.content.content()?.careerSection ?? null);

  private parsedStats = computed<ParsedStat[]>(() =>
    (this.data()?.stats || []).map(s => parseStat(s.number))
  );

  displayStats = signal<string[]>([]);
  statLabels   = signal<string[]>([]);

  private observer?: IntersectionObserver;
  private isCounting = false;

  constructor() {
    effect(() => {
      const currentData = this.data();
      if (!currentData?.stats) return;

      untracked(() => {
        this.statLabels.set(currentData.stats.map(s => s.label));
        this.displayStats.set(this.parsedStats().map(p => p.prefix + '0' + p.suffix));
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