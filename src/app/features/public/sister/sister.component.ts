import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../../core/services/content.service';
import { SisterCompanySection } from '../../../core/models';

@Component({
  selector: 'app-sister',
  standalone: true,
  imports: [CommonModule, RouterLink],
  styles: [`
    :host { display: block; }

    .sister-logo-badge {
      display: inline-flex;
      align-items: center;
      gap: 14px;
      padding: 14px 20px;
      background: #fff;
      border-radius: 18px;
      box-shadow: 0 8px 24px -8px rgba(10,31,68,.15);
      border: 1px solid rgba(10,31,68,.05);
      margin-bottom: 28px;
      transition: transform .25s, box-shadow .25s;
    }
    .sister-logo-badge:hover {
      transform: translateY(-3px);
      box-shadow: 0 14px 36px -10px rgba(10,31,68,.22);
    }
    .sister-logo-img {
      width: 56px; height: 56px;
      border-radius: 12px;
      object-fit: contain;
      background: var(--grad);
      padding: 8px;
      flex-shrink: 0;
    }
    .sister-logo-text .name {
      font-family: 'Sora', sans-serif;
      font-weight: 800; font-size: 16px; color: var(--navy);
    }
    .sister-logo-text .tagline {
      font-size: 12px; color: var(--mute); margin-top: 2px;
    }
    .sister-cta {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-top: 22px;
      padding: 12px 24px;
      border-radius: 999px;
      background: var(--grad2);
      color: #fff;
      font-weight: 700;
      font-size: 14px;
      text-decoration: none;
      box-shadow: 0 10px 28px -8px rgba(24,87,196,.5);
      transition: transform .2s, box-shadow .2s;
      min-height: 44px;
    }
    .sister-cta:hover { transform: translateY(-2px); box-shadow: 0 16px 36px -10px rgba(24,87,196,.65); }
  `],
  template: `
    <section id="construction" style="background:linear-gradient(180deg,var(--bg),#eef2f9)" *ngIf="data() as d">
      <div class="container">
        <div class="s-head reveal in">
          <span class="eyebrow">{{ d.eyebrow }}</span>
          <h2 class="s-title">{{ d.title }}</h2>
          <p class="s-sub">{{ d.sub }}</p>
        </div>

        <div class="about-grid reveal in" style="margin-bottom:50px">
          <div>
            <!-- Logo badge with image -->
            <a class="sister-logo-badge" routerLink="/matrix-enterprises">
              <img class="sister-logo-img"
                   src="assets/ventures-logo.png"
                   onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
                   [alt]="d.title + ' Logo'">
              <div class="sister-logo-img"
                   style="display:none;align-items:center;justify-content:center;font-size:24px">
                {{ d.primaryServiceIcon || '🏗️' }}
              </div>
              <div class="sister-logo-text">
                <div class="name">{{ d.title }}</div>
                <div class="tagline">{{ d.primaryServiceTitle }}</div>
              </div>
            </a>

            <h3 style="font-size:26px;color:var(--navy);margin-bottom:14px">{{ d.aboutTitle }}</h3>
            <p class="lead" style="margin-bottom:14px;color:#3a4761">{{ d.aboutText1 }}</p>
            <p class="lead" style="color:#3a4761">{{ d.aboutText2 }}</p>
            <div *ngIf="d.tagline" style="margin-top:22px;padding:18px 22px;border-radius:16px;background:linear-gradient(135deg,var(--navy),#1e3a6f);color:#fff;font-style:italic;font-weight:500">
              "{{ d.tagline }}"
            </div>
            <a class="sister-cta" routerLink="/matrix-enterprises">
              View Full Profile
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </a>
          </div>
          <div>
            <div class="svc" style="cursor:default">
              <div class="ic">{{ d.primaryServiceIcon }}</div>
              <h3>{{ d.primaryServiceTitle }}</h3>
              <p class="lead">{{ d.primaryServiceLead }}</p>
            </div>
          </div>
        </div>

        <div class="pol-grid reveal in">
          <div *ngFor="let c of d.serviceCards" class="pol">
            <h4>{{ c.icon }} {{ c.title }}</h4>
            <p>{{ c.description }}</p>
          </div>
        </div>

        <div class="about-grid reveal in" style="margin-top:50px">
          <div class="career" style="padding:36px;background:linear-gradient(135deg,#1a2547,var(--navy))">
            <span class="eyebrow" style="color:#bcd0ff">{{ d.visionTitle }}</span>
            <p style="color:#cdd9f0;margin-top:14px">{{ d.visionText }}</p>
          </div>
          <div class="career" style="padding:36px;background:linear-gradient(135deg,#b8860b,#c9a227);color:var(--navy)">
            <span class="eyebrow" style="color:var(--navy)">{{ d.missionTitle }}</span>
            <p style="color:#3a2f10;margin-top:14px">{{ d.missionText }}</p>
          </div>
        </div>

        <div class="reveal in" style="margin-top:50px">
          <h3 style="text-align:center;color:var(--navy);font-size:24px;margin-bottom:22px">{{ d.industriesTitle }}</h3>
          <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center">
            <span *ngFor="let chip of d.industries"
                  style="display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:999px;background:#fff;color:var(--navy);font-weight:600;font-size:14px;box-shadow:var(--shadow-sm);border:1px solid rgba(10,31,68,.06)">
              {{ chip.icon }} {{ chip.label }}
            </span>
          </div>
        </div>

        <div class="reveal in" style="margin-top:50px;padding:34px;border-radius:24px;background:#fff;box-shadow:var(--shadow);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px;text-align:center">
          <div *ngIf="d.email">
            <div style="font-size:12px;color:var(--mute);font-weight:700;letter-spacing:.1em">EMAIL</div>
            <a href="mailto:{{ d.email }}" style="font-weight:700;color:var(--navy);margin-top:4px;word-break:break-word">{{ d.email }}</a>
          </div>
          <div *ngIf="d.phone">
            <div style="font-size:12px;color:var(--mute);font-weight:700;letter-spacing:.1em">PHONE</div>
            <a href="tel:{{ d.phone }}" style="font-weight:700;color:var(--navy);margin-top:4px">{{ d.phone }}</a>
          </div>
          <div *ngIf="d.locations">
            <div style="font-size:12px;color:var(--mute);font-weight:700;letter-spacing:.1em">LOCATIONS</div>
            <div style="font-weight:700;color:var(--navy);margin-top:4px">{{ d.locations }}</div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class SisterComponent implements OnInit {
  private content = inject(ContentService);

  data = computed<SisterCompanySection | null>(() => this.content.content()?.sisterCompany ?? null);

  ngOnInit() { this.content.ensureLoaded().subscribe(); }
}
