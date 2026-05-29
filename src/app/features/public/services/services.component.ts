import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../../core/services/content.service';
import { ServicesSection, ServiceItem } from '../../../core/models';

interface SvcWithState extends ServiceItem { open?: boolean; }

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="services" style="background:linear-gradient(180deg,var(--bg),#eef2f9)" *ngIf="data">
      <div class="container">
        <div class="s-head reveal in">
          <span class="eyebrow">{{ data.eyebrow }}</span>
          <h2 class="s-title">{{ data.title }}</h2>
          <p class="s-sub">{{ data.sub }}</p>
        </div>
        <div class="svc-grid">
          <div *ngFor="let s of items"
               class="svc reveal in"
               [id]="s.id"
               [class.open]="s.open"
               (click)="s.open = !s.open">
            <img *ngIf="s.image" [src]="resolve(s.image)" alt=""
                 style="width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:16px;margin-bottom:14px">
            <div class="ic">{{ s.icon }}</div>
            <h3>{{ s.title }}</h3>
            <p class="lead">{{ s.lead }}</p>
            <span class="more">Read more
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="9 18 15 12 9 6"/></svg>
            </span>
            <div class="det">
              <ul><li *ngFor="let it of s.items">{{ it }}</li></ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class ServicesComponent implements OnInit {
  private content = inject(ContentService);
  data: ServicesSection | null = null;
  items: SvcWithState[] = [];

  ngOnInit() {
    const cached = this.content.content();
    if (cached?.servicesSection) this.setData(cached.servicesSection);
    this.content.get().subscribe({
      next: r => { if (r?.data?.servicesSection) this.setData(r.data.servicesSection); }
    });
  }

  setData(d: ServicesSection) {
    this.data = d;
    this.items = (d.items || []).map(i => ({ ...i, open: false }));
  }

  resolve(u: string) { return this.content.resolveUrl(u); }
}
