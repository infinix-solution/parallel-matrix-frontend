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
    :host {
      display: block;
      --navy: #0a1f44;
      --blue: #1857c4;
      --gold: #c9a227;
      --mute: #64748b;
      --bg-gradient: linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%);
      --gold-light: rgba(201, 162, 39, 0.1);
      --card-gap: clamp(16px, 3vw, 28px);
    }

    /* ── BASE SECTION CONTAINER ── */
    .services-section {
      padding: clamp(60px, 8vw, 120px) 0;
      background: var(--bg-gradient);
    }

    .services-container {
      width: min(100%, 1280px);
      margin: 0 auto;
      padding: 0 clamp(16px, 4vw, 32px);
      box-sizing: border-box;
    }

    /* ── CONTAINER HEADER BLOCK ── */
    .s-head {
      text-align: center;
      margin-bottom: clamp(40px, 6vw, 64px);
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .eyebrow {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 999px;
      background: var(--gold-light);
      color: #927314;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: .22em;
      text-transform: uppercase;
      margin-bottom: 12px;
    }

    .s-title {
      font-family: 'Sora', sans-serif;
      font-size: clamp(1.8rem, 4vw, 2.6rem);
      font-weight: 800;
      line-height: 1.25;
      color: var(--navy);
      margin: 0 0 12px 0;
      letter-spacing: -0.02em;
      max-width: 700px;
    }

    .s-sub {
      font-size: clamp(15px, 1.2vw, 17px);
      line-height: 1.6;
      color: var(--mute);
      margin: 0;
      max-width: 600px;
    }

    /* ── RESPONSIVE FLEXIBLE CARD GRID ── */
    .svc-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: var(--card-gap);
    }

    /* ── COMPACT INDIVIDUAL CARD ARCHITECTURE ── */
    .svc {
      background: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 30px -10px rgba(10, 31, 68, 0.06);
      display: flex;
      flex-direction: column;
      height: 100%;
      transition: transform 0.4s cubic-bezier(0.2, 0.9, 0.3, 1), 
                  box-shadow 0.4s ease;
    }

    .svc:hover {
      transform: translateY(-6px);
      box-shadow: 0 20px 40px -15px rgba(10, 31, 68, 0.12);
    }

    .svc-img {
      width: 100%;
      aspect-ratio: 16 / 10;
      overflow: hidden;
      position: relative;
      background: #e2e8f0;
    }

    .svc-img img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
    }

    .svc:hover .svc-img img {
      transform: scale(1.04);
    }

    .svc-body {
      padding: 24px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .ic {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: rgba(24, 87, 196, 0.06);
      color: var(--blue);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      margin-bottom: 16px;
    }

    .svc-body h3 {
      font-size: 19px;
      font-weight: 700;
      color: var(--navy);
      margin: 0 0 8px 0;
    }

    .svc-body .lead {
      font-size: 14px;
      line-height: 1.55;
      color: var(--mute);
      margin: 0 0 20px 0;
      flex: 1;
    }

    .more {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--blue);
      font-size: 13.5px;
      font-weight: 700;
      cursor: pointer;
      width: fit-content;
      margin-top: auto;
      transition: color 0.2s ease;
    }

    .more svg {
      transition: transform 0.2s ease;
    }

    .more:hover {
      color: var(--gold);
    }

    .more:hover svg {
      transform: translateX(3px);
    }

    /* ── RE-ENGINEERED OVERFLOW MODAL SYSTEM ── */
    .svc-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(6, 14, 30, 0.7);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: clamp(12px, 3vw, 24px);
      animation: svcFadeIn 0.2s ease-out;
    }

    @keyframes svcFadeIn { 
      from { opacity: 0; } 
      to { opacity: 1; } 
    }

    .svc-modal {
      background: #ffffff;
      border-radius: 24px;
      max-width: 540px;
      width: 100%;
      max-height: min(640px, 85vh);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 30px 70px -15px rgba(6, 14, 30, 0.4);
      animation: svcPopIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
    }

    @keyframes svcPopIn { 
      from { opacity: 0; transform: scale(0.96) translateY(10px); } 
      to { opacity: 1; transform: none; } 
    }

    .svc-modal-img {
      width: 100%;
      aspect-ratio: 16 / 8;
      object-fit: cover;
      display: block;
      flex-shrink: 0;
    }

    .svc-modal-body { 
      padding: clamp(20px, 5vw, 32px);
      overflow-y: auto; /* Restricts scrolling to just the body text area */
      -webkit-overflow-scrolling: touch;
      flex: 1;
    }

    .svc-modal-close {
      position: absolute;
      top: 14px;
      right: 14px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(6, 14, 30, 0.6);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      transition: background 0.2s, transform 0.2s;
      z-index: 1010;
    }
    
    .svc-modal-close:hover { 
      background: rgba(6, 14, 30, 0.85); 
      transform: scale(1.05); 
    }

    .svc-modal-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: rgba(24, 87, 196, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--blue);
      font-size: 20px;
      margin-bottom: 16px;
    }

    .svc-modal-title {
      font-family: 'Sora', sans-serif;
      font-size: clamp(20px, 4vw, 24px);
      font-weight: 800;
      color: var(--navy);
      margin: 0 0 8px 0;
    }

    .svc-modal-lead {
      color: var(--mute);
      font-size: 14.5px;
      margin: 0 0 24px 0;
      line-height: 1.6;
    }

    .svc-modal-list {
      padding-left: 20px;
      margin: 0;
    }

    .svc-modal-list li {
      margin: 10px 0;
      font-size: 14px;
      color: #344054;
      line-height: 1.55;
    }

    .svc-modal-list li::marker {
      color: var(--blue);
    }
  `],
  template: `
    <section id="services" class="services-section" *ngIf="data() as d">
      <div class="services-container">
        
        <div class="s-head">
          <span class="eyebrow">{{ d.eyebrow }}</span>
          <h2 class="s-title">{{ d.title }}</h2>
          <p class="s-sub">{{ d.sub }}</p>
        </div>

        <div class="svc-grid">
          <div *ngFor="let s of items(); let i = index"
               class="svc"
               [id]="s.id">

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

    <div class="svc-modal-backdrop" *ngIf="activeService()" (click)="closeModal()">
      <div class="svc-modal" (click)="$event.stopPropagation()" role="dialog" aria-modal="true"
           [attr.aria-label]="activeService()?.title">

        <button class="svc-modal-close" (click)="closeModal()" aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
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
