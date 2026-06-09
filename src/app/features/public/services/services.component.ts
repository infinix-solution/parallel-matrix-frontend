import { Component, OnInit, computed, inject, signal, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../../core/services/content.service';
import { ServicesSection, ServiceItem } from '../../../core/models';
import { FaIconPipe } from '../../../shared/pipes/fa-icon.pipe';

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

interface SvcWithState extends ServiceItem { resolvedImage: string; }

@Component({
  selector: 'app-services',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FaIconPipe],
  styles: [`
    /* ── Modal overlay ── */
    .svc-modal-backdrop {
      position: fixed; inset: 0;
      background: rgba(10,18,38,.65);
      backdrop-filter: blur(10px);
      z-index: 500;
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
      animation: svcFadeIn .22s ease;
    }
    @keyframes svcFadeIn { from { opacity: 0 } to { opacity: 1 } }

    .svc-modal {
      background: #fff;
      border-radius: 24px;
      max-width: 560px;
      width: 100%;
      max-height: 88vh;
      overflow-y: auto;
      box-shadow: 0 32px 80px -20px rgba(10,31,68,.45);
      animation: svcPopIn .3s cubic-bezier(.2,1.4,.4,1);
      position: relative;
    }
    @keyframes svcPopIn { from { opacity:0; transform:scale(.88) translateY(16px) } to { opacity:1; transform:none } }

    .svc-modal-img {
      width: 100%; aspect-ratio: 16/8;
      object-fit: cover;
      border-radius: 24px 24px 0 0;
      display: block;
    }
    .svc-modal-body { padding: 28px 32px 32px; }

    .svc-modal-close {
      position: absolute; top: 14px; right: 14px;
      width: 38px; height: 38px;
      border-radius: 50%;
      background: rgba(10,18,38,.55);
      border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-size: 20px; line-height: 1;
      transition: background .2s, transform .2s;
      z-index: 10;
    }
    .svc-modal-close:hover { background: rgba(10,18,38,.85); transform: scale(1.08); }

    .svc-modal-icon {
      width: 52px; height: 52px; border-radius: 14px;
      background: var(--grad2);
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-size: 24px;
      box-shadow: 0 10px 25px -8px rgba(24,87,196,.45);
      margin-bottom: 14px;
    }
    .svc-modal-title { font-family: 'Sora',sans-serif; font-size: 24px; font-weight: 800; color: var(--navy); margin: 0 0 8px; }
    .svc-modal-lead { color: var(--mute); font-size: 15px; margin: 0 0 20px; line-height: 1.6; }
    .svc-modal-list { padding-left: 20px; margin: 0; }
    .svc-modal-list li { margin: 8px 0; font-size: 14.5px; color: #3a4761; line-height: 1.55; }
    .svc-modal-list li::marker { color: var(--blue2); }
  `],
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
               [style.animation-delay]="(i * 80) + 'ms'">

            <div class="svc-img">
              <img [src]="s.resolvedImage" [alt]="s.title" loading="lazy">
            </div>

            <div class="svc-body">
              <div class="ic" [innerHTML]="s.icon | faIcon"></div>
              <h3>{{ s.title }}</h3>
              <p class="lead">{{ s.lead }}</p>

              <span class="more" *ngIf="s.items.length"
                    (click)="$event.stopPropagation(); openModal(s)">
                Learn more
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="3">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Service detail modal ── -->
    <div class="svc-modal-backdrop" *ngIf="activeService()" (click)="closeModal()">
      <div class="svc-modal" (click)="$event.stopPropagation()" role="dialog" aria-modal="true"
           [attr.aria-label]="activeService()?.title">

        <button class="svc-modal-close" (click)="closeModal()" aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <img *ngIf="activeService() as s" class="svc-modal-img"
             [src]="s.resolvedImage" [alt]="s.title">

        <div class="svc-modal-body" *ngIf="activeService() as s">
          <div class="svc-modal-icon" [innerHTML]="s.icon | faIcon"></div>
          <h2 class="svc-modal-title">{{ s.title }}</h2>
          <p class="svc-modal-lead">{{ s.lead }}</p>
          <ul class="svc-modal-list">
            <li *ngFor="let it of s.items">{{ it }}</li>
          </ul>
        </div>
      </div>
    </div>
  `
})
export class ServicesComponent implements OnInit {
  private content = inject(ContentService);

  activeService = signal<SvcWithState | null>(null);

  data = computed<ServicesSection | null>(() => this.content.content()?.servicesSection ?? null);

  items = computed<SvcWithState[]>(() =>
    (this.data()?.items || []).map((s, i) => ({
      ...s,
      resolvedImage: this.resolveServiceImage(s, i)
    }))
  );

  ngOnInit() { this.content.ensureLoaded().subscribe(); }

  openModal(s: SvcWithState) {
    this.activeService.set(s);
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.activeService.set(null);
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEscape() { this.closeModal(); }

  private resolveServiceImage(s: ServiceItem, index: number): string {
    if (s.image) return this.content.resolveUrl(s.image);
    const key = (s.id || s.title || '').toLowerCase();
    for (const [k, url] of Object.entries(SERVICE_IMAGES)) {
      if (!k.startsWith('default') && key.includes(k)) return url;
    }
    return SERVICE_IMAGES[`default_${index % 4}`];
  }
}
