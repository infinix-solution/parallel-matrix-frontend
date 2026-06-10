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
  templateUrl: './media-showcase.component.html',
  styleUrls: ['./media-showcase.component.css']
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
