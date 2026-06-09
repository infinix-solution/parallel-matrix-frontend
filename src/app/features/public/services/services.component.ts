import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../../core/services/content.service';
import { ServicesSection, ServiceItem } from '../../../core/models';

/** Premium Unsplash images keyed loosely by service type — used as fallback */
const SERVICE_IMAGES: Record<string, string> = {
  recruitment:  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=700&q=80',
  staffing:     'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=700&q=80',
  immigration:  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=700&q=80',
  manpower:     'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=700&q=80',
  default_0:    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=700&q=80',
  default_1:    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&q=80',
  default_2:    'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=700&q=80',
  default_3:    'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=700&q=80'
};

interface SvcWithState extends ServiceItem { open?: boolean; resolvedImage: string; }

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="services" *ngIf="data() as d"
             style="background:linear-gradient(180deg,var(--bg),#eef2f9)">
      <div class="container">
        <div class="s-head reveal in">
          <span class="eyebrow">{{ d.eyebrow }}</span>
          <h2 class="s-title">{{ d.title }}</h2>
          <p class="s-sub">{{ d.sub }}</p>
        </div>

        <div class="svc-grid">
          <div *ngFor="let s of items(); let i = index"
               class="svc reveal in"
               [id]="s.id"
               [class.open]="s.open"
               (click)="s.open = !s.open"
               [style.animation-delay]="(i * 80) + 'ms'">

            <!-- Illustrative image header -->
            <div class="svc-img">
              <img [src]="s.resolvedImage" [alt]="s.title" loading="lazy">
            </div>

            <div class="svc-body">
              <!-- Emoji / text icon badge -->
              <div class="ic" *ngIf="s.icon">{{ s.icon }}</div>
              <h3>{{ s.title }}</h3>
              <p class="lead">{{ s.lead }}</p>

              <span class="more" *ngIf="s.items.length"
                    (click)="$event.stopPropagation(); s.open = !s.open">
                {{ s.open ? 'Show less' : 'Learn more' }}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="3">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </span>

              <div class="det">
                <ul><li *ngFor="let it of s.items">{{ it }}</li></ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class ServicesComponent implements OnInit {
  private content = inject(ContentService);

  data = computed<ServicesSection | null>(() => this.content.content()?.servicesSection ?? null);

  items = computed<SvcWithState[]>(() =>
    (this.data()?.items || []).map((s, i) => ({
      ...s,
      open: false,
      resolvedImage: this.resolveServiceImage(s, i)
    }))
  );

  ngOnInit() { this.content.ensureLoaded().subscribe(); }

  private resolveServiceImage(s: ServiceItem, index: number): string {
    if (s.image) return this.content.resolveUrl(s.image);

    // Try to match by id or title keyword
    const key = (s.id || s.title || '').toLowerCase();
    for (const [k, url] of Object.entries(SERVICE_IMAGES)) {
      if (!k.startsWith('default') && key.includes(k)) return url;
    }
    return SERVICE_IMAGES[`default_${index % 4}`];
  }
}
