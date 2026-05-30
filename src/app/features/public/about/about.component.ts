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
  effect 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../../core/services/content.service';
import { AboutSection } from '../../../core/models';

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
  imports: [CommonModule],
  template: `
    <section id="about" class="about" *ngIf="data() as d">
      <div class="container">
        <div class="about-grid">
          <div class="reveal in">
            <span class="eyebrow">{{ d.eyebrow }}</span>
            <h2 class="s-title">{{ d.title }}</h2>
            <p class="s-sub">{{ d.sub }}</p>
            
            <div class="b" *ngFor="let h of d.highlights; let i = index">
              <div class="bi" *ngIf="h.icon">{{ h.icon }}</div>
              <div>
                <h4>{{ h.title }}</h4>
                
                <p #descText class="description-text" [class.expanded]="isExpanded(i)">
                  {{ h.description }}
                </p>
                
                <button *ngIf="canExpand(i)" class="read-more-btn" (click)="toggleExpand(i)">
                  {{ isExpanded(i) ? 'Read less' : 'Read more' }}
                </button>
              </div>
            </div>

          </div>
          <div class="about-img reveal in">
            <img [src]="imageUrl(d.image)" alt="About">
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
    .description-text {
      display: -webkit-box;
      -webkit-line-clamp: 2; /* Shows 2 lines initially */
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: 4px;
      line-height: 1.5;
    }

    /* Force expansion to override any hidden global theme restrictions */
    .description-text.expanded {
      display: block !important;
      -webkit-line-clamp: unset !important;
      max-height: none !important;
      overflow: visible !important;
    }

    .read-more-btn {
      background: none;
      border: none;
      color: #0066cc;
      padding: 0;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 2px;
    }

    .read-more-btn:hover {
      text-decoration: underline;
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
    
    // Force Angular to render the class change immediately on click
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