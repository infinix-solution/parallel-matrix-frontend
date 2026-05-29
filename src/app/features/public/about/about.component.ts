import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../../core/services/content.service';
import { AboutSection } from '../../../core/models';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="about" class="about" *ngIf="data">
      <div class="container">
        <div class="about-grid">
          <div class="reveal in">
            <span class="eyebrow">{{ data.eyebrow }}</span>
            <h2 class="s-title">{{ data.title }}</h2>
            <p class="s-sub">{{ data.sub }}</p>
            <div class="b" *ngFor="let h of data.highlights">
              <div class="bi">{{ h.icon }}</div>
              <div><h4>{{ h.title }}</h4><p>{{ h.description }}</p></div>
            </div>
          </div>
          <div class="about-img reveal in">
            <img [src]="imageUrl()" alt="About">
          </div>
        </div>
      </div>
    </section>
  `
})
export class AboutComponent implements OnInit {
  private content = inject(ContentService);
  data: AboutSection | null = null;

  fallback: AboutSection = {
    eyebrow: 'About Us',
    title: 'A workforce partner that moves at the speed of your ambition.',
    sub: 'Parallel Matrix Management Services helps companies hire faster, scale smarter and move people across borders with confidence.',
    image: 'assets/about.jpg',
    highlights: [
      { icon: '\u26A1', title: 'Speed & Precision', description: 'Curated shortlists in days, not weeks.' },
      { icon: '\u{1F91D}', title: 'Human-first', description: 'We treat every candidate like a future leader.' }
    ]
  };

  ngOnInit() {
    const cached = this.content.content();
    if (cached?.aboutSection) this.data = cached.aboutSection;
    else this.data = this.fallback;
    this.content.get().subscribe({
      next: r => { if (r?.data?.aboutSection) this.data = r.data.aboutSection; }
    });
  }

  imageUrl(): string {
    const u = this.data?.image;
    if (!u) return 'assets/about.jpg';
    return this.content.resolveUrl(u);
  }
}
