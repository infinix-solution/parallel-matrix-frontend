import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from 'src/app/core/services/content.service';
import { SocialLinksService } from 'src/app/core/services/social-links.service';
import { ContactSection } from 'src/app/core/models';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="foot">
      <div class="container">
        <div class="foot-grid">

          <!-- Brand + Social -->
          <div>
            <div class="br">
              <img src="assets/logo.jpeg" alt="Parallel Matrix">
              <span>Parallel Matrix</span>
            </div>
            <p class="lead">A Pune-based workforce partner delivering recruitment, staffing, immigration and manpower supply across India and 28 countries.</p>
            <div class="socials">
              <a [href]="social.linkedinHref" target="_blank" rel="noopener" aria-label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14M8.34 18V10.5H6V18h2.34M7.17 9.43a1.36 1.36 0 1 0 0-2.72 1.36 1.36 0 0 0 0 2.72M18 18v-4.1c0-2.17-1.17-3.18-2.73-3.18-1.26 0-1.82.69-2.13 1.18V10.5H10.8c.03.66 0 7.5 0 7.5h2.34v-4.19c0-.21.01-.42.08-.57.18-.42.57-.86 1.23-.86.87 0 1.21.66 1.21 1.62V18H18Z"/>
                </svg>
              </a>
              <a [href]="social.whatsappHref" target="_blank" rel="noopener" aria-label="WhatsApp">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                     fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  <path d="M15.5 13.5c-.3-.2-1.8-1-2-.1-.2.2-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.5-1.6-1-1-1.6-2-1.8-2.3-.2-.3 0-.4.1-.6.1-.1.3-.4.5-.6.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.2-.9-2.2-1.2-3-.3-.8-.7-.7-1-.7h-.7c-.3 0-.7.1-1.1.5-.4.4-1.4 1.4-1.4 3.3 0 2 1.4 3.8 1.6 4.1.2.3 2.8 4.3 6.8 6 1 .4 1.7.6 2.3.8.9.3 1.8.3 2.5.2.8-.1 2.4-1 2.7-1.9.3-.9.3-1.7.2-1.9-.1-.1-.4-.3-.7-.4z" fill="#FFFFFF" stroke="none"/>
                </svg>
              </a>
              <a [href]="social.mailtoHref" aria-label="Email">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="5" width="18" height="14" rx="2"/>
                  <path d="m3 7 9 6 9-6"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Services links -->
          <div>
            <h5>Services</h5>
            <ul>
              <li><a href="/#svc-recruitment">Recruitment</a></li>
              <li><a href="/#svc-staffing">Staffing</a></li>
              <li><a href="/#svc-immigration">Immigration</a></li>
              <li><a href="/#svc-manpower">Manpower Supply</a></li>
            </ul>
          </div>

          <!-- Company links -->
          <div>
            <h5>Company</h5>
            <ul>
              <li><a href="/#about">About</a></li>
              <li><a href="/#team">Team</a></li>
              <li><a href="/#career">Career</a></li>
              <li><a routerLink="/matrix-enterprises">Parallel Matrix Ventures</a></li>
              <li><a href="/#policy">Policies</a></li>
            </ul>
          </div>

          <!-- Contact info -->
          <div>
            <h5>Contact</h5>
            <ul *ngIf="contact() as c">
              <li style="display:flex;align-items:flex-start;gap:8px">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     style="flex-shrink:0;margin-top:2px">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                {{ c.address }}
              </li>
              <li style="margin-top:10px;display:flex;align-items:center;gap:8px">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <a [href]="'tel:' + c.phone">{{ c.phone }}</a>
              </li>
              <li style="margin-top:10px;display:flex;align-items:center;gap:8px">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <a [href]="social.mailtoHref">{{ c.email }}</a>
              </li>
            </ul>
          </div>

        </div>
        <div class="foot-bot">
          <div>&copy; 2026 Parallel Matrix. All rights reserved.</div>
          <div>OND 4201-M<sup>P</sup> &middot; Made in Pune</div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent implements OnInit {
  private content = inject(ContentService);
  social = inject(SocialLinksService);

  contact = computed<ContactSection | null>(() => this.content.content()?.contactSection ?? null);

  ngOnInit() { this.content.ensureLoaded().subscribe(); }
}
