import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="nav" [class.shrink]="shrink">
      <div class="container nav-row">
        <a (click)="goAnchor('home')" class="brand" style="cursor:pointer">
          <img src="assets/logo.jpeg" alt="Parallel Matrix Logo">
          <div>
            <div class="bt">Parallel Matrix</div>
            <div class="bs">MANAGEMENT SERVICES</div>
          </div>
        </a>
        <div class="nav-links" [class.open]="menuOpen">
          <a (click)="goAnchor('home')" [class.active]="active==='home'">Home</a>
          <a (click)="goAnchor('about')" [class.active]="active==='about'">About</a>
          <div class="dd" [class.open]="ddOpen==='svc'">
            <span class="nl" (click)="toggleDd('svc')">
              Services
              <svg class="caret" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
            <div class="dd-menu">
              <a (click)="goAnchor('svc-recruitment')">&#127919; Recruitment</a>
              <a (click)="goAnchor('svc-staffing')">&#128101; Staffing</a>
              <a (click)="goAnchor('svc-immigration')">&#127757; Immigration</a>
              <a (click)="goAnchor('svc-manpower')">&#127959;&#65039; Manpower Supply</a>
            </div>
          </div>
          <div class="dd" [class.open]="ddOpen==='cmp'">
            <span class="nl" (click)="toggleDd('cmp')">
              Company
              <svg class="caret" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
            <div class="dd-menu">
              <a (click)="goAnchor('team')">&#128100; Our Team</a>
              <a (click)="goAnchor('career')">&#128200; Career Growth</a>
              <a (click)="goAnchor('policy')">&#128220; Policies</a>
            </div>
          </div>
          <a (click)="goAnchor('contact')" [class.active]="active==='contact'">Contact</a>
        </div>
        <div class="nav-cta">
          <a (click)="goAnchor('contact')" class="btn btn-primary" style="padding:10px 18px;font-size:13px;cursor:pointer">Get Started</a>
          <button class="burger" [class.open]="menuOpen" (click)="menuOpen=!menuOpen" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  shrink = false;
  menuOpen = false;
  ddOpen: string | null = null;
  active = 'home';

  constructor(private router: Router) {}

  @HostListener('window:scroll')
  onScroll() {
    this.shrink = window.scrollY > 20;
    const y = window.scrollY + 120;
    const ids = ['home', 'about', 'services', 'career', 'team', 'policy', 'contact'];
    let cur = 'home';
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= y) cur = id;
    }
    this.active = cur;
  }

  toggleDd(k: string) {
    if (window.innerWidth <= 960) this.ddOpen = this.ddOpen === k ? null : k;
  }

  goAnchor(id: string) {
    this.menuOpen = false; this.ddOpen = null;
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
    } else if (this.router.url !== '/') {
      this.router.navigate(['/']).then(() => setTimeout(() => this.goAnchor(id), 300));
    }
    if (id.startsWith('svc-')) {
      setTimeout(() => document.getElementById(id)?.classList.add('open'), 500);
    }
  }
}
