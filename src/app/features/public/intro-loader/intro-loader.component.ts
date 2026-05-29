import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-intro-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div id="intro" aria-hidden="true">
      <div class="lg"><img src="assets/logo.jpeg" alt="Parallel Matrix"></div>
      <div class="nm">
        <span *ngFor="let c of letters; let i = index"
              [style.animation-delay.s]="0.5 + i * 0.06"
              [innerHTML]="c === ' ' ? '&nbsp;' : c"></span>
      </div>
      <div class="tag">RECRUITMENT &middot; STAFFING &middot; IMMIGRATION &middot; MANPOWER</div>
    </div>
  `
})
export class IntroLoaderComponent implements OnInit {
  letters: string[] = [];
  ngOnInit() { this.letters = 'PARALLEL MATRIX'.split(''); }
}
