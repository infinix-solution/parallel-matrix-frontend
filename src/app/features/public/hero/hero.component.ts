import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero" id="home">
      <div class="hero-slides" *ngIf="slides.length > 1">
        <div *ngFor="let s of slides; let i = index"
             class="slide"
             [class.active]="i === current"
             [style.background-image]="'url(' + s + ')'"></div>
      </div>
      <div class="container hero-inner">
        <span class="pill"><span class="dot"></span> Parallel Matrix Promise</span>
        <h1>Talent you can Trust,<br><span class="grad">Growth you can Measure.</span></h1>
        <p>End-to-end recruitment, staffing, immigration &amp; manpower supply &mdash; built on trust, powered by precision, delivered with care.</p>
        <div class="tags">
          <span>Recruitment</span><span>Staffing</span><span>Immigration</span><span>Manpower Supply</span>
        </div>
        <div class="hero-cta">
          <a (click)="scroll('services')" class="btn btn-primary" style="cursor:pointer">Explore Services &rarr;</a>
          <a (click)="scroll('contact')" class="btn btn-ghost" style="cursor:pointer">Talk to Us</a>
        </div>
      </div>
    </section>
  `
})
export class HeroComponent implements OnInit, OnDestroy {
  private api = inject(ApiService);
  slides: string[] = [];
  current = 0;
  private timer: any;

  ngOnInit() {
    this.api.getSliders().subscribe({
      next: res => {
        if (res?.success && res.data && res.data.length > 0) {
          this.slides = res.data
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map(s => s.url.startsWith('http') ? s.url : `${environment.apiBaseUrl.replace('/api','')}${s.url}`);
          this.startRotate();
        }
      },
      error: () => {}
    });
  }

  ngOnDestroy() { if (this.timer) clearInterval(this.timer); }

  private startRotate() {
    if (this.slides.length <= 1) return;
    this.timer = setInterval(() => {
      this.current = (this.current + 1) % this.slides.length;
    }, 4500);
  }

  scroll(id: string) {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
  }
}
