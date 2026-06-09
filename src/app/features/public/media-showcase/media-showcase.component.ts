import {
  Component, OnInit, OnDestroy, inject, signal, ElementRef, AfterViewInit, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse, SliderImage } from '../../../core/models';
import { ContentService } from '../../../core/services/content.service';

const FALLBACK_IMAGES: string[] = [
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80',
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
  'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80',
  'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&q=80',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80'
];

@Component({
  selector: 'app-media-showcase',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <section class="ms-section" #sectionRef>
      <div class="ms-header-block">
        <span class="eyebrow-tag">Our Work &amp; Culture</span>
      </div>

      <div class="ms-track-wrapper" *ngIf="images().length">
        <div class="ms-track">
          
          <div class="ms-slide" *ngFor="let img of images()">
            <img [src]="img" alt="Showcase Image" loading="lazy">
          </div>
          
          <div class="ms-slide" *ngFor="let img of images()" aria-hidden="true">
            <img [src]="img" alt="Showcase Image Duplicate" loading="lazy">
          </div>
          
        </div>
      </div>

      <div class="ms-fade-mask ms-fade-left"></div>
      <div class="ms-fade-mask ms-fade-right"></div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      --navy: #0a1f44;
      --gold-light: rgba(201, 162, 39, 0.1);
      --bg-surface: #ffffff; /* Matches your white page background seamlessly */
      --track-gap: 20px;
    }

    .ms-section {
      padding: 54px 0;
      overflow: hidden;
      position: relative;
      background: var(--bg-surface);
    }

    /* ── HEADER STYLING ── */
    .ms-header-block {
      text-align: center;
      margin-bottom: 36px;
    }

    /* ── BUTTERY SMOOTH LIQUID MARQUEE ENGINE ── */
    .ms-track-wrapper {
      display: flex;
      width: max-content;
      overflow: hidden;
    }

    .ms-track {
      display: flex;
      gap: var(--track-gap);
      /* 45 seconds creates a slow, elegant, premium glide */
      animation: smoothGlider 45s linear infinite; 
      will-change: transform;
    }

    /* Soft pause behavior on interaction */
    .ms-track-wrapper:hover .ms-track {
      animation-play-state: paused;
    }

    /* translate3d tells the browser to process animation frames via GPU hardware acceleration */
    @keyframes smoothGlider {
      0% {
        transform: translate3d(0, 0, 0);
      }
      100% {
        transform: translate3d(calc(-100% - var(--track-gap)), 0, 0);
      }
    }

    /* ── SLIDE CARDS ── */
    .ms-slide {
      flex-shrink: 0;
      width: clamp(250px, 20vw, 340px);
      aspect-ratio: 16 / 10;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(10, 31, 68, 0.07);
      background: #f8fafc;
      transition: transform 0.4s cubic-bezier(0.2, 0.9, 0.3, 1);
    }

    /* Clean subtle micro-raise on hover */
    .ms-slide:hover {
      transform: translateY(-4px);
    }

    .ms-slide img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.6s ease;
    }

    /* ── GRADIENT OVERLAY SHIELDS ── */
    .ms-fade-mask {
      position: absolute;
      top: 0;
      bottom: 0;
      width: clamp(60px, 12vw, 180px);
      z-index: 5;
      pointer-events: none;
    }
    
    .ms-fade-left { 
      left: 0; 
      background: linear-gradient(to right, var(--bg-surface) 15%, transparent 100%); 
    }
    
    .ms-fade-right { 
      right: 0; 
      background: linear-gradient(to left, var(--bg-surface) 15%, transparent 100%); 
    }

    @media (prefers-reduced-motion: reduce) {
      .ms-track { animation: none; }
    }
  `
  ]
})
export class MediaShowcaseComponent implements OnInit, AfterViewInit, OnDestroy {
  private http = inject(HttpClient);
  private content = inject(ContentService);
  private el = inject(ElementRef);

  images = signal<string[]>([]);
  private observer?: IntersectionObserver;

  ngOnInit() {
    this.http.get<ApiResponse<SliderImage[]>>(`${environment.apiBaseUrl}/sliders`).subscribe({
      next: res => {
        const urls = (res?.success && res.data?.length)
          ? res.data.map(s => this.content.resolveUrl(s.url))
          : [];
        this.images.set(urls.length ? urls : FALLBACK_IMAGES);
      },
      error: () => this.images.set(FALLBACK_IMAGES)
    });
  }

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          (this.el.nativeElement as HTMLElement)
            .querySelector('.ms-section')
            ?.classList.add('visible');
          this.observer?.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() { this.observer?.disconnect(); }
}
