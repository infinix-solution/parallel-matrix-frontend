import {
  Component, OnInit, AfterViewInit, OnDestroy,
  ChangeDetectionStrategy, ChangeDetectorRef,
  computed, inject, signal, ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../../core/services/content.service';
import { SisterCompanySection } from '../../../core/models';
import { FaIconPipe } from '../../../shared/pipes/fa-icon.pipe';

@Component({
  selector: 'app-sister-page',
  standalone: true,
  imports: [CommonModule, FaIconPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./sister-page.component.css'],
  templateUrl: './sister-page.component.html'
})
export class SisterPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private content = inject(ContentService);
  private el = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);

  data = computed<SisterCompanySection | null>(() => this.content.content()?.sisterCompany ?? null);

  statProjects  = signal('0+');
  statYears     = signal('0+');
  statCommitted = signal('0%');

  private observer?: IntersectionObserver;
  private statsObserver?: IntersectionObserver;
  private revealSetup = false;
  private hasCounted  = false;

  ngOnInit() {
    this.content.ensureLoaded().subscribe({
      next: () => {
        // Tell OnPush to re-check so *ngIf="data()" flips to the real template
        this.cdr.markForCheck();
        // Wait one rAF so Angular has flushed the signal change into the DOM
        // before we query .reveal-me elements and attach the IntersectionObserver
        requestAnimationFrame(() => {
          this.setupReveal();
          this.setupCounters();
        });
      }
    });
  }

  ngAfterViewInit() {
    // Warm boot (navigating from another page — signal already populated).
    // Cold boot: ensureLoaded() subscribe above owns setup after the rAF.
    if (this.content.content()) {
      setTimeout(() => {
        this.setupReveal();
        this.setupCounters();
      }, 32);
    }
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    this.statsObserver?.disconnect();
  }

  scrollToContact() {
    const el = document.getElementById('me-contact');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private setupReveal() {
    if (this.revealSetup) return;
    const host = this.el.nativeElement as HTMLElement;
    const els = host.querySelectorAll<HTMLElement>('.reveal-me');
    // Don't set the flag until elements are found — allows retry on cold boot
    if (!els.length) return;
    this.revealSetup = true;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    els.forEach(el => this.observer!.observe(el));
  }

  private setupCounters() {
    const host = this.el.nativeElement as HTMLElement;
    const statsEl = host.querySelector<HTMLElement>('.me-mini-stats');
    if (!statsEl) return;

    this.statsObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !this.hasCounted) {
          this.hasCounted = true;
          this.runCounters();
          this.statsObserver?.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    this.statsObserver.observe(statsEl);
  }

  private runCounters() {
    const DURATION = 1600;
    const targets = [
      { target: 10,  suffix: '+', set: (v: string) => this.statProjects.set(v)  },
      { target: 5,   suffix: '+', set: (v: string) => this.statYears.set(v)     },
      { target: 100, suffix: '%', set: (v: string) => this.statCommitted.set(v) }
    ];
    const startTime = performance.now();

    const frame = (now: number) => {
      const elapsed = Math.min((now - startTime) / DURATION, 1);
      const ease = 1 - Math.pow(1 - elapsed, 4);
      targets.forEach(t => t.set(Math.round(t.target * ease) + t.suffix));
      if (elapsed < 1) requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  }
}
