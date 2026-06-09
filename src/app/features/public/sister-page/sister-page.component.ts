import {
  Component, OnInit, AfterViewInit, OnDestroy,
  computed, inject, signal, ElementRef, effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../../core/services/content.service';
import { SisterCompanySection } from '../../../core/models';

@Component({
  selector: 'app-sister-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  styles: [`
    :host { display: block; }

    /* ── Page canvas ── */
    .me-page {
      background: #f8fafc;
      padding-top: 80px;
      min-height: 100vh;
      color: #0f172a;
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    }
    .me-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

    /* ── Hero ── */
    .me-hero {
      padding: 80px 0 70px;
      background: linear-gradient(145deg, #f8fafc 0%, #eff6ff 60%, #f0fdf4 100%);
      border-bottom: 1px solid #e2e8f0;
      overflow: hidden;
      position: relative;
    }
    .me-hero-inner {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 64px;
      align-items: center;
    }
    .me-breadcrumb {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: #64748b;
      margin-bottom: 24px;
      font-weight: 500;
    }
    .me-breadcrumb a { color: #2563eb; text-decoration: none; }
    .me-breadcrumb a:hover { text-decoration: underline; }
    .me-breadcrumb span { color: #94a3b8; }
    .me-hero-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: .15em;
      text-transform: uppercase;
      color: #2563eb;
      margin-bottom: 20px;
    }
    .me-hero-title {
      font-family: 'Sora', sans-serif;
      font-size: clamp(30px, 3.8vw, 52px);
      font-weight: 800;
      color: #0f172a;
      line-height: 1.1;
      margin: 0 0 20px;
      letter-spacing: -.03em;
    }
    .me-hero-title em {
      font-style: normal;
      background: linear-gradient(90deg, #2563eb, #059669);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: #2563eb;
    }
    .me-hero-desc {
      font-size: 17px;
      color: #475569;
      line-height: 1.7;
      margin: 0 0 36px;
      max-width: 500px;
    }
    .me-cta {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 14px 30px;
      background: #2563eb;
      color: #fff;
      border-radius: 999px;
      font-weight: 700;
      font-size: 15px;
      text-decoration: none;
      transition: transform .2s cubic-bezier(.16,1,.3,1), box-shadow .2s ease;
      box-shadow: 0 12px 30px -8px rgba(37,99,235,.5);
      cursor: pointer;
      border: none;
      min-height: 48px;
    }
    .me-cta:hover { transform: translateY(-3px); box-shadow: 0 20px 42px -10px rgba(37,99,235,.65); }

    /* Hero visual */
    .me-hero-visual {
      position: relative;
      height: 380px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .me-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(55px);
      pointer-events: none;
    }
    .me-blob-1 {
      width: 300px; height: 300px;
      background: radial-gradient(circle, rgba(37,99,235,.18), transparent 70%);
      top: 5%; left: 5%;
    }
    .me-blob-2 {
      width: 220px; height: 220px;
      background: radial-gradient(circle, rgba(5,150,105,.14), transparent 70%);
      bottom: 8%; right: 8%;
    }
    .me-glass-card {
      background: rgba(255,255,255,.9);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid #e2e8f0;
      border-radius: 24px;
      padding: 32px;
      width: 100%;
      max-width: 370px;
      box-shadow: 0 20px 40px -10px rgba(15,23,42,.09), 0 0 0 1px rgba(37,99,235,.04);
      position: relative;
      z-index: 1;
    }
    .me-glass-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 22px;
      padding-bottom: 18px;
      border-bottom: 1px solid #e2e8f0;
    }
    .me-glass-icon {
      width: 50px; height: 50px;
      border-radius: 14px;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      display: flex; align-items: center; justify-content: center;
      font-size: 22px;
      flex-shrink: 0;
      box-shadow: 0 8px 20px -6px rgba(37,99,235,.5);
    }
    .me-glass-name {
      font-family: 'Sora', sans-serif;
      font-weight: 800; font-size: 16px; color: #0f172a;
    }
    .me-glass-sub { font-size: 12px; color: #64748b; margin-top: 2px; }
    .me-mini-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 18px;
    }
    .me-mini-stat {
      background: #f8fafc;
      border-radius: 12px;
      padding: 12px 8px;
      text-align: center;
      border: 1px solid #e2e8f0;
    }
    .me-mini-num {
      font-family: 'Sora', sans-serif;
      font-size: 20px; font-weight: 800; color: #2563eb;
    }
    .me-mini-lbl {
      font-size: 10px; color: #64748b;
      margin-top: 2px; font-weight: 600;
      letter-spacing: .06em; text-transform: uppercase;
    }
    .me-svc-tags { display: flex; flex-wrap: wrap; gap: 7px; }
    .me-svc-tag {
      padding: 5px 11px;
      background: #eff6ff; border: 1px solid #bfdbfe;
      border-radius: 999px;
      font-size: 11px; font-weight: 600; color: #2563eb;
    }
    .me-float-badge {
      position: absolute;
      bottom: 24px; right: -24px;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 999px;
      padding: 10px 18px;
      font-size: 13px; font-weight: 700; color: #059669;
      box-shadow: 0 8px 20px -6px rgba(0,0,0,.1);
      z-index: 2; white-space: nowrap;
    }

    /* ── About ── */
    .me-about {
      padding: 100px 0;
      background: #fff;
    }
    .me-about-grid {
      display: grid;
      grid-template-columns: .95fr 1.05fr;
      gap: 64px;
      align-items: center;
    }
    .me-img-wrap {
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,.05), 0 8px 10px -6px rgba(0,0,0,.04);
      background: linear-gradient(135deg, #0f172a 0%, #1e3a6f 40%, #0b3a8c 100%);
      aspect-ratio: 4/3;
      display: flex; align-items: center; justify-content: center;
      border: 1px solid #e2e8f0;
    }
    .me-img-inner { text-align: center; padding: 40px; }
    .me-img-icon { font-size: 68px; display: block; margin-bottom: 16px; }
    .me-img-caption { color: rgba(255,255,255,.75); font-size: 15px; font-weight: 500; line-height: 1.5; }
    .me-eyebrow {
      display: inline-block;
      font-size: 12px; font-weight: 700;
      letter-spacing: .25em; text-transform: uppercase;
      color: #2563eb; margin-bottom: 14px;
    }
    .me-section-title {
      font-family: 'Sora', sans-serif;
      font-size: clamp(24px, 2.8vw, 36px);
      font-weight: 800; color: #0f172a;
      line-height: 1.15; margin: 0 0 18px;
      letter-spacing: -.025em;
    }
    .me-body { font-size: 16px; color: #475569; line-height: 1.7; margin: 0 0 14px; }
    .me-tagline {
      margin: 22px 0 0;
      padding: 18px 22px;
      background: linear-gradient(135deg, #0f172a, #1e3a6f);
      border-radius: 16px;
      font-style: italic; font-weight: 500; font-size: 15px;
      color: rgba(255,255,255,.88);
      border-left: 4px solid #2563eb;
    }

    /* ── Primary Service ── */
    .me-primary { padding: 80px 0; background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%); }
    .me-primary-card {
      background: #fff;
      border-radius: 28px;
      padding: 48px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,.04);
      display: flex; gap: 36px; align-items: flex-start;
    }
    .me-primary-icon {
      width: 72px; height: 72px; border-radius: 20px;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      display: flex; align-items: center; justify-content: center;
      font-size: 32px; flex-shrink: 0;
      box-shadow: 0 12px 30px -8px rgba(37,99,235,.45);
    }
    .me-primary-title {
      font-family: 'Sora', sans-serif;
      font-size: clamp(20px, 2.4vw, 28px); font-weight: 800;
      color: #0f172a; margin: 0 0 12px; letter-spacing: -.02em;
    }
    .me-primary-lead { font-size: 16px; color: #475569; line-height: 1.7; margin: 0; }

    /* ── Verticals Grid ── */
    .me-verticals { padding: 100px 0; background: #f8fafc; }
    .me-section-head { text-align: center; margin-bottom: 56px; }
    .me-section-sub { font-size: 16px; color: #475569; max-width: 520px; margin: 12px auto 0; line-height: 1.7; }
    .me-cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 22px;
    }
    .me-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      padding: 28px 26px;
      transition: transform .2s cubic-bezier(.16,1,.3,1), box-shadow .2s cubic-bezier(.16,1,.3,1);
      cursor: default;
    }
    .me-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px -12px rgba(15,23,42,.12);
    }
    .me-card-icon-wrap {
      width: 50px; height: 50px; border-radius: 14px;
      background: #eff6ff;
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; margin-bottom: 18px;
    }
    .me-card h3 {
      font-family: 'Sora', sans-serif;
      font-size: 17px; font-weight: 700; color: #0f172a;
      margin: 0 0 10px;
    }
    .me-card p { font-size: 14px; color: #475569; line-height: 1.65; margin: 0; }

    /* ── Values ── */
    .me-values { padding: 90px 0; background: #fff; }
    .me-values-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
    .me-value-card { border-radius: 24px; padding: 40px; }
    .me-vision { background: linear-gradient(135deg, #1a2547, #0a1f44); }
    .me-vision .me-eyebrow { color: #93c5fd; }
    .me-vision p { color: #cbd5e1; font-size: 15px; line-height: 1.7; margin: 14px 0 0; }
    .me-mission { background: linear-gradient(135deg, #b8860b, #d4a84c); }
    .me-mission .me-eyebrow { color: #78350f; }
    .me-mission p { color: #451a03; font-size: 15px; line-height: 1.7; margin: 14px 0 0; }

    /* ── Industries ── */
    .me-industries { padding: 70px 0; background: #f8fafc; }
    .me-industries-title {
      text-align: center;
      font-family: 'Sora', sans-serif;
      font-size: 26px; font-weight: 700; color: #0f172a;
      margin: 0 0 30px;
    }
    .me-chips { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
    .me-chip {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 10px 18px;
      border-radius: 999px;
      background: #fff; color: #0f172a;
      font-weight: 600; font-size: 14px;
      box-shadow: 0 2px 8px rgba(15,23,42,.06);
      border: 1px solid #e2e8f0;
      transition: border-color .15s, box-shadow .15s;
    }
    .me-chip:hover { border-color: #bfdbfe; box-shadow: 0 4px 12px rgba(37,99,235,.1); }

    /* ── Contact ── */
    .me-contact-sec { padding: 90px 0; background: #fff; }
    .me-contact-card {
      background: linear-gradient(135deg, #0f172a 0%, #1e3a6f 100%);
      border-radius: 28px;
      padding: 52px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 36px;
      align-items: center;
    }
    .me-contact-lbl {
      font-size: 11px; font-weight: 700;
      letter-spacing: .18em; text-transform: uppercase;
      color: #93c5fd; margin-bottom: 8px;
    }
    .me-contact-val { font-size: 15px; font-weight: 600; color: #f1f5f9; word-break: break-word; }
    .me-contact-val a { color: #f1f5f9; text-decoration: none; }
    .me-contact-val a:hover { color: #93c5fd; }

    /* ── Scroll reveal ── */
    .reveal-me {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity .6s cubic-bezier(.16,1,.3,1), transform .6s cubic-bezier(.16,1,.3,1);
      will-change: transform, opacity;
    }
    .reveal-me.visible { opacity: 1; transform: none; }
    .reveal-me.d1 { transition-delay: .1s; }
    .reveal-me.d2 { transition-delay: .2s; }
    .reveal-me.d3 { transition-delay: .3s; }
    .reveal-me.d4 { transition-delay: .4s; }
    .reveal-me.d5 { transition-delay: .5s; }

    /* ── Responsive ── */
    @media (max-width: 960px) {
      .me-hero-inner { grid-template-columns: 1fr; gap: 44px; }
      .me-hero-visual { height: 300px; }
      .me-float-badge { display: none; }
      .me-about-grid { grid-template-columns: 1fr; gap: 40px; }
      .me-cards-grid { grid-template-columns: repeat(2, 1fr); }
      .me-values-grid { grid-template-columns: 1fr; }
      .me-primary-card { flex-direction: column; gap: 24px; padding: 32px; }
      .me-hero { padding: 60px 0 50px; }
      .me-about, .me-verticals, .me-values, .me-contact-sec { padding: 70px 0; }
      .me-primary { padding: 60px 0; }
    }
    @media (max-width: 640px) {
      .me-cards-grid { grid-template-columns: 1fr; }
      .me-contact-card { padding: 30px; }
      .me-hero { padding: 50px 0 40px; }
      .me-hero-desc { font-size: 15px; }
      .me-glass-card { max-width: 100%; }
      .me-about, .me-verticals, .me-values, .me-contact-sec, .me-industries { padding: 60px 0; }
      .me-primary { padding: 50px 0; }
      .me-primary-card { padding: 24px; }
      .me-value-card { padding: 28px; }
    }
    @media (prefers-reduced-motion: reduce) {
      .reveal-me { opacity: 1; transform: none; transition: none; }
    }
  `],
  template: `
    <div class="me-page" *ngIf="data() as d; else loading">

      <!-- ═══ 1. HERO HEADER ═══════════════════════════════════════════ -->
      <section class="me-hero">
        <div class="me-container">
          <div class="me-hero-inner">

            <!-- Left column -->
            <div>
              <nav class="me-breadcrumb" aria-label="Breadcrumb">
                <a routerLink="/">Home</a>
                <span>›</span>
                <span>Sister Concerns</span>
                <span>›</span>
                <span style="color:#0f172a;font-weight:600">Matrix Enterprises</span>
              </nav>
              <div class="me-hero-eyebrow">🏢 Sister Concern</div>
              <h1 class="me-hero-title">
                Matrix Enterprises —<br>
                <em>Scale with Certainty.</em>
              </h1>
              <p class="me-hero-desc">
                {{ d.sub || 'A diversified enterprise delivering infrastructure, corporate services, and supply chain solutions with precision and integrity.' }}
              </p>
              <button class="me-cta" (click)="scrollToContact()">
                Get In Touch &rarr;
              </button>
            </div>

            <!-- Right column: glassmorphism visual -->
            <div class="me-hero-visual">
              <div class="me-blob me-blob-1"></div>
              <div class="me-blob me-blob-2"></div>
              <div class="me-glass-card">
                <div class="me-glass-header">
                  <div class="me-glass-icon">🏗️</div>
                  <div>
                    <div class="me-glass-name">Matrix Enterprises</div>
                    <div class="me-glass-sub">Infrastructure &amp; Corporate Services</div>
                  </div>
                </div>
                <div class="me-mini-stats">
                  <div class="me-mini-stat">
                    <div class="me-mini-num">10+</div>
                    <div class="me-mini-lbl">Projects</div>
                  </div>
                  <div class="me-mini-stat">
                    <div class="me-mini-num">5+</div>
                    <div class="me-mini-lbl">Years</div>
                  </div>
                  <div class="me-mini-stat">
                    <div class="me-mini-num">100%</div>
                    <div class="me-mini-lbl">Committed</div>
                  </div>
                </div>
                <div class="me-svc-tags">
                  <span class="me-svc-tag">Infrastructure</span>
                  <span class="me-svc-tag">Trading</span>
                  <span class="me-svc-tag">Supply Chain</span>
                  <span class="me-svc-tag">Corporate Services</span>
                </div>
              </div>
              <div class="me-float-badge">✓ Trusted Enterprise</div>
            </div>

          </div>
        </div>
      </section>

      <!-- ═══ 2. ABOUT SPLIT ═══════════════════════════════════════════ -->
      <section class="me-about">
        <div class="me-container">
          <div class="me-about-grid">
            <div class="me-img-wrap reveal-me">
              <div class="me-img-inner">
                <span class="me-img-icon">{{ d.primaryServiceIcon || '🏛️' }}</span>
                <p class="me-img-caption">{{ d.primaryServiceTitle || 'Enterprise Infrastructure' }}</p>
              </div>
            </div>
            <div class="reveal-me d1">
              <span class="me-eyebrow">{{ d.eyebrow }}</span>
              <h2 class="me-section-title">{{ d.aboutTitle }}</h2>
              <p class="me-body">{{ d.aboutText1 }}</p>
              <p class="me-body" *ngIf="d.aboutText2">{{ d.aboutText2 }}</p>
              <blockquote class="me-tagline" *ngIf="d.tagline">"{{ d.tagline }}"</blockquote>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══ 3. PRIMARY SERVICE ════════════════════════════════════════ -->
      <section class="me-primary" *ngIf="d.primaryServiceTitle">
        <div class="me-container">
          <div class="me-primary-card reveal-me">
            <div class="me-primary-icon">{{ d.primaryServiceIcon }}</div>
            <div>
              <h2 class="me-primary-title">{{ d.primaryServiceTitle }}</h2>
              <p class="me-primary-lead">{{ d.primaryServiceLead }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══ 4. OPERATIONAL VERTICALS GRID ════════════════════════════ -->
      <section class="me-verticals" *ngIf="d.serviceCards.length">
        <div class="me-container">
          <div class="me-section-head reveal-me">
            <span class="me-eyebrow">What We Do</span>
            <h2 class="me-section-title">Operational Verticals</h2>
            <p class="me-section-sub">Delivering end-to-end value across every vertical we operate in — built on reliability and enterprise-grade execution.</p>
          </div>
          <div class="me-cards-grid">
            <div *ngFor="let card of d.serviceCards; let i = index"
                 class="me-card reveal-me"
                 [class.d1]="i % 3 === 0"
                 [class.d2]="i % 3 === 1"
                 [class.d3]="i % 3 === 2">
              <div class="me-card-icon-wrap">{{ card.icon }}</div>
              <h3>{{ card.title }}</h3>
              <p>{{ card.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══ 5. VISION & MISSION ══════════════════════════════════════ -->
      <section class="me-values" *ngIf="d.visionTitle || d.missionTitle">
        <div class="me-container">
          <div class="me-section-head reveal-me">
            <span class="me-eyebrow">Core Principles</span>
            <h2 class="me-section-title">Vision &amp; Mission</h2>
          </div>
          <div class="me-values-grid">
            <div class="me-value-card me-vision reveal-me" *ngIf="d.visionTitle">
              <span class="me-eyebrow">{{ d.visionTitle }}</span>
              <p>{{ d.visionText }}</p>
            </div>
            <div class="me-value-card me-mission reveal-me d1" *ngIf="d.missionTitle">
              <span class="me-eyebrow">{{ d.missionTitle }}</span>
              <p>{{ d.missionText }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══ 6. INDUSTRIES ════════════════════════════════════════════ -->
      <section class="me-industries" *ngIf="d.industries.length">
        <div class="me-container">
          <h3 class="me-industries-title reveal-me">{{ d.industriesTitle }}</h3>
          <div class="me-chips reveal-me d1">
            <span *ngFor="let chip of d.industries" class="me-chip">
              {{ chip.icon }} {{ chip.label }}
            </span>
          </div>
        </div>
      </section>

      <!-- ═══ 7. CONTACT ═══════════════════════════════════════════════ -->
      <section class="me-contact-sec" id="me-contact">
        <div class="me-container">
          <div class="me-section-head reveal-me" style="margin-bottom:36px">
            <span class="me-eyebrow">Get In Touch</span>
            <h2 class="me-section-title">Connect With Us</h2>
          </div>
          <div class="me-contact-card reveal-me d1">
            <div *ngIf="d.email">
              <div class="me-contact-lbl">Email</div>
              <div class="me-contact-val"><a href="mailto:{{ d.email }}">{{ d.email }}</a></div>
            </div>
            <div *ngIf="d.phone">
              <div class="me-contact-lbl">Phone</div>
              <div class="me-contact-val"><a href="tel:{{ d.phone }}">{{ d.phone }}</a></div>
            </div>
            <div *ngIf="d.locations">
              <div class="me-contact-lbl">Locations</div>
              <div class="me-contact-val">{{ d.locations }}</div>
            </div>
          </div>
        </div>
      </section>

    </div>

    <ng-template #loading>
      <div style="min-height:80vh;display:flex;align-items:center;justify-content:center;background:#f8fafc;padding-top:80px">
        <div style="text-align:center;color:#64748b">
          <div style="font-size:32px;margin-bottom:12px">🏗️</div>
          <p style="font-size:15px;font-weight:500">Loading Matrix Enterprises…</p>
        </div>
      </div>
    </ng-template>
  `
})
export class SisterPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private content = inject(ContentService);
  private el = inject(ElementRef);

  data = computed<SisterCompanySection | null>(() => this.content.content()?.sisterCompany ?? null);

  private observer?: IntersectionObserver;
  private revealSetup = false;
  private viewReady = false;

  constructor() {
    // When data arrives after the view is ready, set up scroll reveals.
    effect(() => {
      if (this.data() && this.viewReady && !this.revealSetup) {
        this.revealSetup = true;
        // One frame delay lets Angular render the *ngIf blocks before we query.
        setTimeout(() => this.setupReveal(), 16);
      }
    });
  }

  ngOnInit() {
    this.content.ensureLoaded().subscribe();
  }

  ngAfterViewInit() {
    this.viewReady = true;
    // If data was already loaded (e.g. navigating from home), set up immediately.
    if (this.data() && !this.revealSetup) {
      this.revealSetup = true;
      setTimeout(() => this.setupReveal(), 16);
    }
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  scrollToContact() {
    const el = document.getElementById('me-contact');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private setupReveal() {
    const host = this.el.nativeElement as HTMLElement;
    const els = host.querySelectorAll<HTMLElement>('.reveal-me');
    if (!els.length) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    els.forEach(el => this.observer!.observe(el));
  }
}
