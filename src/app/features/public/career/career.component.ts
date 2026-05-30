import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../../core/services/content.service';
import { CareerSection } from '../../../core/models';

@Component({
  selector: 'app-career',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="career" *ngIf="data() as d">
      <div class="container">
        <div class="career reveal in">
          <span class="eyebrow" style="color:#bcd0ff">{{ d.eyebrow }}</span>
          <h2>{{ d.title }}</h2>
          <p class="lead">{{ d.lead }}</p>
          <div class="stats">
            <div *ngFor="let s of d.stats" class="stat">
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

  data = computed<CareerSection | null>(() => this.content.content()?.careerSection ?? null);

  ngOnInit() { this.content.ensureLoaded().subscribe(); }
}
