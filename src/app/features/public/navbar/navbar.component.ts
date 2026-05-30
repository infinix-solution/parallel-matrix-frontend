import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="nav" [class.shrink]="shrink">
      <div class="container nav-row">
        <a (click)="goHomeAnchor('home')" class="brand" style="cursor:pointer">
          <img src="assets/logo.jpeg" alt="Parallel Matrix Logo">
          <div>
            <div class="bt">Parallel Matrix</div>
            <div class="bs">MANAGEMENT SERVICES</div>
          </div>
        </a>
        <div class="nav-links" [class.open]="menuOpen">
          <a (click)="goHomeAnchor('home')" [class.active]="active==='home'">Home</a>
          <a (click)="goHomeAnchor('about')" [class.active]="active==='about'">About</a>
          <div class="dd" [class.open]="ddOpen==='svc'">
            <span class="nl" (click)="toggleDd('svc')">
              Services
              <svg class="caret" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
            <div class="dd-menu">
              <a (click)="goHomeAnchor('svc-recruitment')">🎯 Recruitment</a>
              <a (click)="goHomeAnchor('svc-staffing')">👥 Staffing</a>
              <a (click)="goHomeAnchor('svc-immigration')">🌍 Immigration</a>
              <a (click)="goHomeAnchor('svc-manpower')">🏗️ Manpower Supply</a>
            </div>
          </div>
          <div class="dd" [class.open]="ddOpen==='cmp'">
            <span class="nl" (click)="toggleDd('cmp')">
              Company
              <svg class="caret" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
            <div class="dd-menu">
              <a (click)="goHomeAnchor('team')">👤 Our Team</a>
              <a (click)="goHomeAnchor('career')">📈 Career Growth</a>
              <a routerLink="/matrix-enterprises" (click)="closeMenu()">🧱 Matrix Enterprises</a>
              <a (click)="goHomeAnchor('policy')">📜 Policies</a>
            </div>
          </div>
          <a (click)="goHomeAnchor('contact')" [class.active]="active==='contact'">Contact</a>
        </div>
        <div class="nav-cta">
          <a (click)="goHomeAnchor('contact')" class="btn btn-primary" style="padding:10px 18px;font-size:13px;cursor:pointer">Get Started</a>
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
    // Only do active-link detection on the home page
    if (this.router.url !== '/') return;
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

  closeMenu() {
    this.menuOpen = false;
    this.ddOpen = null;
  }

  /**
   * Smart anchor navigation:
   * - If we're already on the home page, just smooth-scroll to the anchor
   * - Otherwise, navigate to home first, then scroll to the anchor after render
   */
  goHomeAnchor(id: string) {
    this.closeMenu();

    if (this.router.url === '/') {
      this.scrollTo(id);
      return;
    }

    this.router.navigate(['/']).then(() => {
      setTimeout(() => this.scrollTo(id), 100);
    });
  }

  private scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
    if (id.startsWith('svc-')) {
      setTimeout(() => el.classList.add('open'), 500);
    }
  }
}
