import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, signal, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

const FALLBACK_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80', caption: 'Onboard with clarity' },
  { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80', caption: 'Scale with confidence' },
  { url: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1200&q=80', caption: 'Leadership starts here' },
  { url: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&q=80', caption: 'Your potential, amplified' },
];

const MILESTONE_MESSAGES = [
  'Start with extreme clarity, personalized mentorship support, and a high-impact first sprint blueprint.',
  'Build execution confidence early by contributing directly to core products and shipping production systems.',
  'Take complete ownership of domain outcomes, cross-collaborate across lines, and push technical boundaries.',
  'Own strategic initiatives, mentor engineering pods, and play a direct role in shaping architectural directions.'
];

type TrajectoryStage = {
  label: string;
  title: string;
  summary: string;
  metric: string;
  x: number;
  y: number;
  align: 'start' | 'end';
};

type TrajectoryHighlight = {
  value: string;
  label: string;
};

@Component({
  selector: 'app-growth-slider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  styleUrls: ['./growth-slider.component.css'],
  templateUrl: './growth-slider.component.html'
})
export class GrowthSliderComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private zone = inject(NgZone);

  readonly MILESTONE_MESSAGES = MILESTONE_MESSAGES;
  images = signal<{ url: string; caption?: string }[]>([]);
  current = signal(0);
  private timer: ReturnType<typeof setInterval> | null = null;

  readonly stageCards: TrajectoryStage[] = [
    { label: 'Day 1', title: 'Join & Onboard', summary: 'Start with clarity, support, and a guided first sprint.', metric: 'Foundation', x: 16, y: 76, align: 'end' },
    { label: 'Quarter 1', title: 'Skill Up & Contribute', summary: 'Build confidence by shipping meaningful work early.', metric: 'Momentum', x: 39, y: 50, align: 'end' },
    { label: 'Year 1', title: 'Own Outcomes', summary: 'Take wider responsibility and shape team-level results.', metric: 'Ownership', x: 63, y: 34, align: 'start' },
    { label: 'Leadership', title: 'Lead & Impact', summary: 'Guide direction, lift others, and influence what comes next.', metric: 'Impact', x: 86, y: 62, align: 'start' }
  ];

  readonly highlights: TrajectoryHighlight[] = [
    { value: '4', label: 'Growth stages' },
    { value: '1', label: 'Clear trajectory' },
    { value: '360°', label: 'Visibility on progress' }
  ];

  ngOnInit() {
    this.http.get<{ success: boolean; data: { url: string; caption?: string }[] }>(
      `${environment.apiBaseUrl}/sliders/growth`
    ).subscribe({
      next: (res:any) => {
        let list = FALLBACK_IMAGES;
        if (res?.data?.length) {
          list = Array.from({ length: 4 }, (_, idx) => {
            const apiItem = res.data[idx % res.data.length];
            return {
              url: this.resolveUrl(apiItem.url),
              caption: apiItem.caption || FALLBACK_IMAGES[idx].caption
            };
          });
        }
        this.images.set(list);
        this.startAutoPlay();
      },
      error: () => {
        this.images.set(FALLBACK_IMAGES);
        this.startAutoPlay();
      }
    });
  }

  ngOnDestroy() { this.stopAutoPlay(); }

  goTo(index: number) { this.current.set(index); this.resetAutoPlay(); }
  next() { this.current.update((c:number) => (c + 1) % this.images().length); this.resetAutoPlay(); }
  prev() { this.current.update((c:number) => (c - 1 + this.images().length) % this.images().length); this.resetAutoPlay(); }

  private startAutoPlay() {
    if (this.images().length <= 1) return;
    this.zone.runOutsideAngular(() => {
      this.timer = setInterval(() => {
        this.zone.run(() => this.current.update((c:number) => (c + 1) % this.images().length));
      }, 5000);
    });
  }

  private stopAutoPlay() { if (this.timer) { clearInterval(this.timer); this.timer = null; } }
  private resetAutoPlay() { this.stopAutoPlay(); this.startAutoPlay(); }

  private resolveUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${environment.apiBaseUrl.replace('/api', '')}${url}`;
  }
}