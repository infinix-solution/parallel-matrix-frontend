import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  private cdr = inject(ChangeDetectorRef);

  shrink = false;
  menuOpen = false;
  ddOpen: string | null = null;
  active = 'home';

  constructor(private router: Router) {}

  @HostListener('window:scroll')
  onScroll() {
    this.shrink = window.scrollY > 20;
    if (this.router.url === '/') {
      const y = window.scrollY + 120;
      const ids = ['home', 'about', 'services', 'career', 'team', 'policy', 'contact'];
      let cur = 'home';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) cur = id;
      }
      this.active = cur;
    }
    this.cdr.markForCheck();
  }

  toggleDd(k: string) {
    if (window.innerWidth <= 960) this.ddOpen = this.ddOpen === k ? null : k;
    this.cdr.markForCheck();
  }

  closeMenu() {
    this.menuOpen = false;
    this.ddOpen = null;
    this.cdr.markForCheck();
  }

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
