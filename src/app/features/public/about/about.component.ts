import {
  Component,
  OnInit,
  computed,
  inject,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../../core/services/content.service';
import { AboutSection } from '../../../core/models';
import { FaIconPipe } from '../../../shared/pipes/fa-icon.pipe';

const FALLBACK: AboutSection = {
  eyebrow: 'About Us',
  title: 'A workforce partner that moves at the speed of your ambition.',
  sub: 'Parallel Matrix Management Services helps companies hire faster, scale smarter and move people across borders with confidence.',
  image: 'assets/about.jpg',
  highlights: [
    { icon: '\u26A1', title: 'Speed & Precision', description: 'Curated shortlists in days, not weeks.' },
    { icon: '\u{1F91D}', title: 'Human-first', description: 'We treat every candidate like a future leader. This is an intentionally longer description line designed to test the dynamic threshold calculation of our line clamping engine to ensure the button reveals itself only when needed.' }
  ]
};

@Component({
  selector: 'app-about',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush, // Performance boost: Only check on state mutations
  imports: [CommonModule, FaIconPipe],
  template: `
    <section id="about" class="about-section" *ngIf="data() as d">
      <div class="about-container">
        <div class="about-grid">
          
          <div class="about-content">
            <span class="eyebrow-tag">{{ d.eyebrow }}</span>
            <h2 class="main-title">{{ d.title }}</h2>
            <p class="sub-lead">{{ d.sub }}</p>
            
            <div class="highlight-card" *ngFor="let h of d.highlights; let i = index">
              <div class="icon-frame" *ngIf="h.icon" [innerHTML]="h.icon | faIcon"></div>
              <div class="card-body">
                <h4 class="card-title">{{ h.title }}</h4>
                
                <p #descText class="description-text" [class.expanded]="isExpanded(i)">
                  {{ h.description }}
                </p>
                
                <button *ngIf="canExpand(i)" class="read-more-link" (click)="toggleExpand(i)">
                  {{ isExpanded(i) ? 'Read less \u2191' : 'Read more \u2192' }}
                </button>
              </div>
            </div>
          </div>

          <div class="about-image-wrapper">
            <div class="image-frame">
              <img [src]="imageUrl(d.image)" alt="About Parallel Matrix">
            </div>
          </div>

        </div>
      </div>
    </section>
  `,
  styles: [
    `
    :host {
      display: block;
      --navy: #0a1f44;
      --gold: #c9a227;
      --text-mute: #64748b;
      --gold-light: rgba(201, 162, 39, 0.1);
    }

    .about-section {
      padding: clamp(60px, 10vw, 120px) 0;
      background: #ffffff;
      overflow: hidden;
    }

    .about-container {
      width: min(100%, 1280px);
      margin: 0 auto;
      padding: 0 clamp(16px, 4vw, 32px);
      box-sizing: border-box;
    }

    /* ── HYBRID RESPONSIVE GRID CONFIGURATION ── */
    .about-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: clamp(40px, 6vw, 80px);
      align-items: center;

      @media (min-width: 1024px) {
        grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
      }
    }

    /* ── TYPOGRAPHY STYLING INFRASTRUCTURE ── */
    .about-content {
      display: flex;
      flex-direction: column;
    }

    .main-title {
      font-family: 'Sora', sans-serif;
      font-size: clamp(1.8rem, 4.2vw, 2.8rem);
      font-weight: 800;
      line-height: 1.2;
      color: var(--navy);
      margin: 0 0 16px 0;
      letter-spacing: -0.02em;
    }

    .sub-lead {
      font-size: clamp(15px, 1.2vw, 17.5px);
      line-height: 1.6;
      color: var(--text-mute);
      margin: 0 0 40px 0;
    }

    /* ── HIGHLIGHT FEATURE CARDS ── */
    .highlight-card {
      display: flex;
      gap: 18px;
      margin-bottom: 28px;
      padding-bottom: 24px;
      border-bottom: 1px solid rgba(10, 31, 68, 0.06);
    }

    .highlight-card:last-of-type {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }

    .icon-frame {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: rgba(24, 87, 196, 0.06);
      color: #1857c4;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }

    .card-body {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .card-title {
      font-size: 17px;
      font-weight: 700;
      color: var(--navy);
      margin: 0 0 6px 0;
    }

    /* ── READ MORE CLAMP MANAGEMENT SYSTEM ── */
    .description-text {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin: 0 0 4px 0;
      line-height: 1.55;
      color: var(--text-mute);
      font-size: 14.5px;
    }

    .description-text.expanded {
      display: block !important;
      -webkit-line-clamp: unset !important;
      max-height: none !important;
      overflow: visible !important;
    }

    .read-more-link {
      background: none;
      border: none;
      color: #1857c4;
      padding: 0;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      width: fit-content;
      transition: color 0.2s ease;
      text-align: left;
    }

    .read-more-link:hover {
      color: var(--gold);
    }

    /* ── VISUAL MEDIA FRAMING ── */
    .about-image-wrapper {
      position: relative;
      width: 100%;
    }

    .image-frame {
      position: relative;
      width: 100%;
      aspect-ratio: 4/3;
      border-radius: clamp(24px, 4vw, 40px) 12px;
      overflow: hidden;
      box-shadow: 0 30px 60px -25px rgba(10, 31, 68, 0.15);
      
      @media (min-width: 1024px) {
        aspect-ratio: 1/1; /* Square framing on large screens matches long scroll heights nicely */
      }
    }

    .image-frame img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
    }

    .image-frame:hover img {
      transform: scale(1.03);
    }
  `
  ]
})
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {
  private content = inject(ContentService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChildren('descText') descTexts!: QueryList<ElementRef<HTMLParagraphElement>>;

  expandedIndices = new Set<number>();
  overflowingIndices = new Set<number>();
  private resizeObserver?: ResizeObserver;

  data = computed<AboutSection>(() => this.content.content()?.aboutSection ?? FALLBACK);

  constructor() {
    effect(() => {
      this.data(); 
      this.expandedIndices.clear();
      this.overflowingIndices.clear();
    });
  }

  ngOnInit() {
    this.content.ensureLoaded().subscribe();
  }

  ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver(() => {
      this.checkOverflow();
    });

    this.descTexts.changes.subscribe(() => {
      this.observeElements();
    });

    this.observeElements();
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }

  imageUrl(u: string | undefined): string {
    if (!u) return 'assets/about.jpg';
    return this.content.resolveUrl(u);
  }

  toggleExpand(index: number): void {
    if (this.expandedIndices.has(index)) {
      this.expandedIndices.delete(index);
    } else {
      this.expandedIndices.add(index);
    }
    this.cdr.detectChanges();
  }

  isExpanded(index: number): boolean {
    return this.expandedIndices.has(index);
  }

  canExpand(index: number): boolean {
    return this.overflowingIndices.has(index);
  }

  private observeElements() {
    this.resizeObserver?.disconnect();
    this.descTexts.forEach((el) => {
      this.resizeObserver?.observe(el.nativeElement);
    });
  }

  private checkOverflow() {
    this.descTexts.forEach((el, index) => {
      const nativeEl = el.nativeElement;
      
      if (!this.isExpanded(index)) {
        const hasOverflow = nativeEl.scrollHeight > nativeEl.clientHeight;
        if (hasOverflow) {
          this.overflowingIndices.add(index);
        } else {
          this.overflowingIndices.delete(index);
        }
      }
    });
    this.cdr.detectChanges();
  }
}