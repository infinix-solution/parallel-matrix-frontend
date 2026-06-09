import {
  Component, OnInit, OnDestroy, inject, signal, ElementRef, AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse, SliderImage } from '../../../core/models';
import { ContentService } from '../../../core/services/content.service';

/** Local fallback images — used when the API returns no slides */
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
  imports: [CommonModule],
  template: `
    <section class="ms-section" #sectionRef>
      <div class="ms-eyebrow fade-in-up">
        <span class="eyebrow">Our Work &amp; Culture</span>
      </div>

      <div class="ms-track-wrapper" *ngIf="images().length">
        <!-- Two identical strips for seamless loop -->
        <div class="ms-track">
          <div class="ms-slide" *ngFor="let img of images()">
            <img [src]="img" alt="Showcase" loading="lazy">
          </div>
          <!-- Duplicate for infinite loop -->
          <div class="ms-slide" *ngFor="let img of images()">
            <img [src]="img" alt="Showcase" loading="lazy">
          </div>
        </div>
      </div>

      <!-- Gradient edge fades -->
      <div class="ms-fade-left"></div>
      <div class="ms-fade-right"></div>
    </section>
  `,
  styles: [`
    .ms-section {
      padding: 48px 0;
      overflow: hidden;
      position: relative;
      opacity: 0;
      transform: translateY(24px);
      transition: opacity .8s cubic-bezier(.2,.9,.3,1), transform .8s cubic-bezier(.2,.9,.3,1);
    }
    .ms-section.visible {
      opacity: 1;
      transform: none;
    }
    .ms-eyebrow {
      text-align: center;
      margin-bottom: 28px;
    }

    /* ===== Marquee Track ===== */
    .ms-track-wrapper {
      overflow: hidden;
      width: 100%;
    }
    .ms-track {
      display: flex;
      gap: 16px;
      width: max-content;
      animation: msMarquee 40s linear infinite;
      will-change: transform;
    }
    .ms-track:hover {
      animation-play-state: paused;
    }
    @keyframes msMarquee {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    /* ===== Individual slides ===== */
    .ms-slide {
      flex-shrink: 0;
      width: 320px;
      height: 200px;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 12px 32px -10px rgba(10,31,68,.18);
      position: relative;
      transition: transform .4s cubic-bezier(.2,.9,.3,1), box-shadow .4s ease;
    }
    .ms-slide:hover {
      transform: scale(1.04) translateY(-4px);
      box-shadow: 0 24px 48px -12px rgba(10,31,68,.28);
    }
    .ms-slide img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform .6s ease;
      display: block;
    }
    .ms-slide:hover img { transform: scale(1.06); }

    /* Edge gradient fades */
    .ms-fade-left, .ms-fade-right {
      position: absolute;
      top: 0; bottom: 0;
      width: 120px;
      z-index: 2;
      pointer-events: none;
    }
    .ms-fade-left  { left: 0;  background: linear-gradient(to right, var(--bg), transparent); }
    .ms-fade-right { right: 0; background: linear-gradient(to left,  var(--bg), transparent); }

    @media (max-width: 560px) {
      .ms-slide { width: 220px; height: 140px; border-radius: 14px; }
      .ms-fade-left, .ms-fade-right { width: 60px; }
    }
    @media (prefers-reduced-motion: reduce) {
      .ms-track { animation: none; }
      .ms-section { opacity: 1; transform: none; transition: none; }
    }
  `]
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
      { threshold: 0.15 }
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() { this.observer?.disconnect(); }
}
