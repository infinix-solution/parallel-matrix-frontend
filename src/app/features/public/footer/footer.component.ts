import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="foot">
      <div class="container">
        <div class="foot-grid">
          <div>
            <div class="br"><img src="assets/logo.jpeg" alt="Parallel Matrix"><span>Parallel Matrix</span></div>
            <p class="lead">A Pune-based workforce partner delivering recruitment, staffing, immigration and manpower supply across India and 28 countries.</p>
            <div class="socials">
              <a href="#" aria-label="LinkedIn"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14M8.34 18V10.5H6V18h2.34M7.17 9.43a1.36 1.36 0 1 0 0-2.72 1.36 1.36 0 0 0 0 2.72M18 18v-4.1c0-2.17-1.17-3.18-2.73-3.18-1.26 0-1.82.69-2.13 1.18V10.5H10.8c.03.66 0 7.5 0 7.5h2.34v-4.19c0-.21.01-.42.08-.57.18-.42.57-.86 1.23-.86.87 0 1.21.66 1.21 1.62V18H18Z"/></svg></a>
              <a href="https://wa.me/917887855530" aria-label="WhatsApp"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A12 12 0 0 0 3.6 20l-1.6 4 4.1-1.6A12 12 0 1 0 20.5 3.5"/></svg></a>
              <a href="mailto:hr@parallelmatrixcorp.com" aria-label="Email"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg></a>
            </div>
          </div>
          <div>
            <h5>Services</h5>
            <ul>
              <li><a href="#svc-recruitment">Recruitment</a></li>
              <li><a href="#svc-staffing">Staffing</a></li>
              <li><a href="#svc-immigration">Immigration</a></li>
              <li><a href="#svc-manpower">Manpower Supply</a></li>
            </ul>
          </div>
          <div>
            <h5>Company</h5>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#team">Team</a></li>
              <li><a href="#career">Career</a></li>
              <li><a href="#policy">Policies</a></li>
            </ul>
          </div>
          <div>
            <h5>Contact</h5>
            <ul>
              <li>FL1, S14, The Platinum Towers,</li>
              <li>Old Mundhwa Rd, Tukaram Nagar,</li>
              <li>Kharadi, Pune, Maharashtra 411014</li>
              <li style="margin-top:10px">&#128222; +91 78878 55530</li>
              <li>&#128680; +91 86694 82841</li>
              <li>&#9993; hr&#64;parallelmatrixcorp.com</li>
            </ul>
          </div>
        </div>
        <div class="foot-bot">
          <div>&copy; 2026 Parallel Matrix Management Services. All rights reserved.</div>
          <div>OND 4201-M<sup>P</sup> &middot; Made in Pune</div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
