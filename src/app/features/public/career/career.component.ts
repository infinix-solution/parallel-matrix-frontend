import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../../core/services/content.service';
import { CareerSection } from '../../../core/models';

@Component({
  selector: 'app-career',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="career" *ngIf="data">
      <div class="container">
        <div class="career reveal in">
          <span class="eyebrow" style="color:#bcd0ff">{{ data.eyebrow }}</span>
          <h2>{{ data.title }}</h2>
          <p class="lead">{{ data.lead }}</p>
          <div class="stats">
            <div *ngFor="let s of data.stats" class="stat">
              <div class="n">{{ s.number }}</div>
              <div class="l">{{ s.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class CareerComponent implements OnInit {
  private content = inject(ContentService);
  data: CareerSection | null = null;

  ngOnInit() {
    const cached = this.content.content();
    if (cached?.careerSection) this.data = cached.careerSection;
    this.content.get().subscribe({
      next: r => { if (r?.data?.careerSection) this.data = r.data.careerSection; }
    });
  }
}
