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
    { icon: '⚡', title: 'Speed & Precision', description: 'Curated shortlists in days, not weeks.' },
    { icon: '\u{1F91D}', title: 'Human-first', description: 'We treat every candidate like a future leader. This is an intentionally longer description line designed to test the dynamic threshold calculation of our line clamping engine to ensure the button reveals itself only when needed.' }
  ]
};

@Component({
  selector: 'app-about',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FaIconPipe],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {
  private content = inject(ContentService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChildren('descText') descTexts!: QueryList<ElementRef<HTMLParagraphElement>>;

  expandedIndices = new Set<number>();
  overflowingIndices = new Set<number>();
  private resizeObserver?: ResizeObserver;

  /** True until ContentService resolves the first API response */
  isLoading = computed(() => this.content.content() === null);
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
