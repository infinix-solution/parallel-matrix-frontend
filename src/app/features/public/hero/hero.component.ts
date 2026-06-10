import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
})
export class HeroComponent implements OnInit, OnDestroy {
  private api = inject(ApiService);

  readonly slides = signal<string[]>([]);
  readonly current = signal(0);
  private timer: ReturnType<typeof setInterval> | undefined;

  ngOnInit() {
    this.api.getSliders().subscribe({
      next: res => {
        if (res?.success && res.data?.length) {
          this.slides.set(
            res.data
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map(s => s.url.startsWith('http')
                ? s.url
                : `${environment.apiBaseUrl.replace('/api', '')}${s.url}`)
          );
          this.startRotate();
        }
      },
      error: () => {}
    });
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  private startRotate() {
    if (this.slides().length <= 1) return;
    this.timer = setInterval(() => {
      this.current.set((this.current() + 1) % this.slides().length);
    }, 4500);
  }

  scroll(id: string) {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
  }
}
