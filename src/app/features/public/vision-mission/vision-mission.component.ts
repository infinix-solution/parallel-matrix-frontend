import { Component } from '@angular/core';

@Component({
  selector: 'app-vision-mission',
  standalone: true,
  styles: [`
    :host { display: block; }

    .vm-section {
      padding: 70px 0;
      background: linear-gradient(180deg, #f8fafc, var(--bg));
    }
    .vm-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 22px;
    }
    .vm-card {
      border-radius: 24px;
      padding: 40px;
      position: relative;
      overflow: hidden;
    }
    .vm-card::before {
      content: '';
      position: absolute;
      top: -40%; right: -15%;
      width: 260px; height: 260px;
      border-radius: 50%;
      pointer-events: none;
    }
    .vm-vision {
      background: linear-gradient(145deg, #0a1f44 0%, #1e3a6f 100%);
      color: #fff;
    }
    .vm-vision::before {
      background: radial-gradient(circle, rgba(115,255,184,.12), transparent 70%);
    }
    .vm-mission {
      background: linear-gradient(145deg, #b8860b 0%, #c9a227 100%);
      color: #fff;
    }
    .vm-mission::before {
      background: radial-gradient(circle, rgba(255,255,255,.15), transparent 70%);
    }
    .vm-icon {
      width: 52px; height: 52px;
      border-radius: 14px;
      background: rgba(255,255,255,.15);
      display: flex; align-items: center; justify-content: center;
      font-size: 24px;
      margin-bottom: 20px;
      position: relative;
    }
    .vm-eyebrow {
      font-size: 11px; font-weight: 700;
      letter-spacing: .28em; text-transform: uppercase;
      opacity: .7; margin-bottom: 10px;
      position: relative;
    }
    .vm-title {
      font-family: 'Sora', sans-serif;
      font-size: clamp(20px, 2.4vw, 26px);
      font-weight: 800;
      margin: 0 0 14px;
      position: relative;
    }
    .vm-text {
      font-size: 15px;
      line-height: 1.75;
      opacity: .88;
      margin: 0;
      position: relative;
    }
    .vm-divider {
      width: 40px; height: 3px;
      border-radius: 2px;
      background: rgba(255,255,255,.4);
      margin: 16px 0;
      position: relative;
    }

    @media (max-width: 768px) {
      .vm-grid { grid-template-columns: 1fr; }
      .vm-card { padding: 28px; }
    }
  `],
  template: `
    <section class="vm-section" id="vision-mission">
      <div class="container">
        <div class="s-head reveal in" style="margin-bottom:40px">
          <span class="eyebrow">Our Purpose</span>
          <h2 class="s-title">Our Vision and Mission</h2>
          <p class="s-sub">The principles that guide every placement, every partnership, every decision we make.</p>
        </div>

        <div class="vm-grid">
          <!-- Vision -->
          <div class="vm-card vm-vision reveal in">
            <div class="vm-icon">🔭</div>
            <div class="vm-eyebrow">Vision</div>
            <h3 class="vm-title">Where we're headed</h3>
            <div class="vm-divider"></div>
            <p class="vm-text">
              To be South Asia's most trusted workforce enabler — connecting talent to opportunity across
              borders, sectors and seniority levels with precision, speed and unwavering integrity.
              We envision a world where the right person is always in the right role.
            </p>
          </div>

          <!-- Mission -->
          <div class="vm-card vm-mission reveal in">
            <div class="vm-icon">🎯</div>
            <div class="vm-eyebrow">Mission</div>
            <h3 class="vm-title">How we get there</h3>
            <div class="vm-divider"></div>
            <p class="vm-text">
              To deliver measurable, human-first talent solutions that elevate both businesses and careers.
              By combining rigorous process with genuine empathy, we reduce time-to-hire, improve retention
              and create sustainable workforce ecosystems for our clients and candidates alike.
            </p>
          </div>
        </div>
      </div>
    </section>
  `
})
export class VisionMissionComponent {}
