import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ContentService } from '../../../core/services/content.service';
import { ContactSection } from '../../../core/models';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="contact" style="background:linear-gradient(180deg,var(--bg),#eef2f9)" *ngIf="data() as d">
      <div class="container">
        <div class="s-head reveal in">
          <span class="eyebrow">{{ d.eyebrow }}</span>
          <h2 class="s-title">{{ d.title }}</h2>
          <p class="s-sub">{{ d.sub }}</p>
        </div>
        <div class="contact-grid">
          <div class="map-wrap reveal in">
            <iframe loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade"
              [src]="mapUrl(d)"></iframe>
          </div>
          <div class="addr-card reveal in">
            <h3>Office Address</h3>
            <div class="addr-row" *ngIf="d.address">
              <div class="ic">\u{1F4CD}</div>
              <div><div class="t">Address</div><div class="v">{{ d.address }}</div></div>
            </div>
            <div class="addr-row" *ngIf="d.phone">
              <div class="ic">\u{1F4DE}</div>
              <div><div class="t">Office Contact</div><div class="v">{{ d.phone }}</div></div>
            </div>
            <div class="addr-row" *ngIf="d.emergency">
              <div class="ic">\u{1F6A8}</div>
              <div><div class="t">Emergency</div><div class="v">{{ d.emergency }}</div></div>
            </div>
            <div class="addr-row" *ngIf="d.email">
              <div class="ic">\u2709</div>
              <div><div class="t">Email</div><div class="v">{{ d.email }}</div></div>
            </div>
            <a class="btn btn-ghost" target="_blank" rel="noopener"
               [href]="d.directionsUrl || 'https://maps.google.com'">Open in Google Maps \u2192</a>
          </div>
        </div>
      </div>
    </section>
  `
})
export class ContactComponent implements OnInit {
  private content = inject(ContentService);
  private sanitizer = inject(DomSanitizer);

  data = computed<ContactSection | null>(() => this.content.content()?.contactSection ?? null);

  ngOnInit() { this.content.ensureLoaded().subscribe(); }

  mapUrl(d: ContactSection): SafeResourceUrl {
    const q = encodeURIComponent(d.mapQuery || d.address || 'Pune');
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.google.com/maps?q=${q}&output=embed`
    );
  }
}
