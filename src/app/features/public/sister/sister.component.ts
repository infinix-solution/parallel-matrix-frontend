import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../../core/services/content.service';
import { SisterCompanySection } from '../../../core/models';

@Component({
  selector: 'app-sister',
  standalone: true,
  imports: [CommonModule],
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
            <h3 style="font-size:26px;color:var(--navy);margin-bottom:14px">{{ d.aboutTitle }}</h3>
            <p class="lead" style="margin-bottom:14px;color:#3a4761">{{ d.aboutText1 }}</p>
            <p class="lead" style="color:#3a4761">{{ d.aboutText2 }}</p>
            <div *ngIf="d.tagline" style="margin-top:22px;padding:18px 22px;border-radius:16px;background:linear-gradient(135deg,var(--navy),#1e3a6f);color:#fff;font-style:italic;font-weight:500">
              "{{ d.tagline }}"
            </div>
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
          <div class="career" style="padding:36px;background:linear-gradient(135deg,#b8860b,#d4a84c);color:var(--navy)">
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
            <div style="font-weight:700;color:var(--navy);margin-top:4px;word-break:break-word">{{ d.email }}</div>
          </div>
          <div *ngIf="d.phone">
            <div style="font-size:12px;color:var(--mute);font-weight:700;letter-spacing:.1em">PHONE</div>
            <div style="font-weight:700;color:var(--navy);margin-top:4px">{{ d.phone }}</div>
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
