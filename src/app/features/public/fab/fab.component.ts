import { Component, computed, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from 'src/app/core/services/content.service';
import { ContactSection } from 'src/app/core/models';

@Component({
  selector: 'app-fab',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pm-fab-wrapper" [class.expand-left]="direction === 'left'" [class.expand-right]="direction === 'right'">
      <input type="checkbox" id="pm-fab-toggle" class="pm-fab-toggle" hidden>

      <!-- Sub-icons -->
      <a href="https://wa.me/{{data()?.whatsapp}}"
         target="_blank"
         rel="noopener"
         class="pm-fab-sub pm-fab-wa"
         aria-label="WhatsApp">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.5 3.5A12 12 0 0 0 3.6 20l-1.6 4 4.1-1.6A12 12 0 1 0 20.5 3.5M12 21.9a9.9 9.9 0 0 1-5-1.4l-.4-.2-2.4 1 .9-2.4-.2-.4A9.9 9.9 0 1 1 12 21.9m5.4-7.4-2-.6-.5.5c-.4.4-1 .6-1.6.2-1.2-.8-2-1.7-2.7-2.8-.3-.5-.2-1 .2-1.5l.4-.6-.6-1.9c-.1-.4-.5-.6-.9-.5h-1c-.6.1-1 .6-1 1.2 0 2.8 2 5.4 4.6 6.7 2.6 1.3 4.3 1.1 5 .9.5-.1.9-.6.9-1.1v-1c0-.4-.3-.7-.7-.5Z"/>
        </svg>
      </a>

      <a href="{{data()?.linkdnUrl}}"
         target="_blank"
         rel="noopener"
         class="pm-fab-sub pm-fab-fb"
         aria-label="Facebook">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14M8.34 18V10.5H6V18h2.34M7.17 9.43a1.36 1.36 0 1 0 0-2.72 1.36 1.36 0 0 0 0 2.72M18 18v-4.1c0-2.17-1.17-3.18-2.73-3.18-1.26 0-1.82.69-2.13 1.18V10.5H10.8c.03.66 0 7.5 0 7.5h2.34v-4.19c0-.21.01-.42.08-.57.18-.42.57-.86 1.23-.86.87 0 1.21.66 1.21 1.62V18H18Z"/></svg>
      </a>

      <!-- Main toggle button -->
      <label for="pm-fab-toggle" class="pm-fab-main" aria-label="Open social menu">
        <span class="pm-fab-line"></span>
        <span class="pm-fab-line"></span>
      </label>
    </div>
  `,
  styles: [`
    /* ===== Wrapper ===== */
    .pm-fab-wrapper {
      position: fixed;
      right: 22px;
      bottom: 22px;
      z-index: 90;
      width: 60px;
      height: 60px;
    }

    .pm-fab-toggle { position: absolute; opacity: 0; pointer-events: none; }

    /* ===== Main circular button ===== */
    .pm-fab-main {
      position: absolute;
      inset: 0;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1857c4, #3b82f6);
      box-shadow: 0 12px 30px -6px rgba(24, 87, 196, 0.5);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition:
        background 0.4s cubic-bezier(0.4, 0, 0.2, 1),
        transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
        box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 3;
    }
    .pm-fab-main:hover { transform: scale(1.06); }

    /* Pulse ring */
    .pm-fab-main::after {
      content: "";
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 2px solid #3b82f6;
      opacity: 0.4;
      animation: pmFabPulse 2s ease-out infinite;
    }
    @keyframes pmFabPulse {
      0%   { transform: scale(0.8); opacity: 0.6; }
      100% { transform: scale(1.4); opacity: 0; }
    }

    /* ===== Plus / X lines ===== */
    .pm-fab-line {
      position: absolute;
      width: 22px;
      height: 3px;
      background: #fff;
      border-radius: 3px;
      transition: transform 0.45s cubic-bezier(0.65, -0.25, 0.35, 1.25);
    }
    .pm-fab-line:nth-child(1) { transform: rotate(0deg); }
    .pm-fab-line:nth-child(2) { transform: rotate(90deg); }

    /* ===== Sub-icon buttons ===== */
    .pm-fab-sub {
      position: absolute;
      top: 0;
      left: 0;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #fff;
      color: #0a1f44;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 20px -4px rgba(10, 31, 68, 0.3);
      opacity: 0;
      pointer-events: none;
      transform: translate(0, 0) scale(0.4);
      transition:
        transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
        opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
        background 0.25s ease,
        color 0.25s ease;
      z-index: 1;
    }

    /* Brand-colored hover (preserves the open position via CSS vars) */
    .pm-fab-wa:hover { background: #25D366; color: #fff; }
    .pm-fab-fb:hover { background: #1877F2; color: #fff; }

    /* ===== OPEN STATE — main button ===== */
    .pm-fab-toggle:checked ~ .pm-fab-main {
      background: linear-gradient(135deg, #dc2626, #ef4444);
      box-shadow: 0 12px 30px -6px rgba(220, 38, 38, 0.5);
    }
    .pm-fab-toggle:checked ~ .pm-fab-main::after { animation: none; opacity: 0; }
    .pm-fab-toggle:checked ~ .pm-fab-main .pm-fab-line:nth-child(1) { transform: rotate(45deg); }
    .pm-fab-toggle:checked ~ .pm-fab-main .pm-fab-line:nth-child(2) { transform: rotate(-45deg); }

    /* Sub-icons appear */
    .pm-fab-toggle:checked ~ .pm-fab-sub {
      opacity: 1;
      pointer-events: auto;
    }

    /* ===========================================================
       TRIANGLE FAN-OUT
       - WhatsApp:  diagonally up + sideways  (the "tip" of triangle)
       - Facebook:  straight up
       Together with the main button, they form a triangle.
       =========================================================== */

    /* ----- Expand LEFT (default — for bottom-right corner) ----- */
    .expand-left .pm-fab-toggle:checked ~ .pm-fab-wa {
      transform: translate(-70px, -70px) scale(1);
    }
    .expand-left .pm-fab-toggle:checked ~ .pm-fab-fb {
      transform: translate(0, -85px) scale(1);
    }
    .expand-left .pm-fab-toggle:checked ~ .pm-fab-wa:hover {
      transform: translate(-70px, -70px) scale(1.12);
    }
    .expand-left .pm-fab-toggle:checked ~ .pm-fab-fb:hover {
      transform: translate(0, -85px) scale(1.12);
    }

    /* ----- Expand RIGHT (mirror) ----- */
    .expand-right .pm-fab-toggle:checked ~ .pm-fab-wa {
      transform: translate(70px, -70px) scale(1);
    }
    .expand-right .pm-fab-toggle:checked ~ .pm-fab-fb {
      transform: translate(0, -85px) scale(1);
    }
    .expand-right .pm-fab-toggle:checked ~ .pm-fab-wa:hover {
      transform: translate(70px, -70px) scale(1.12);
    }
    .expand-right .pm-fab-toggle:checked ~ .pm-fab-fb:hover {
      transform: translate(0, -85px) scale(1.12);
    }

    /* Stagger the appearance slightly so they pop one after the other */
    .pm-fab-toggle:checked ~ .pm-fab-fb { transition-delay: 0.05s; }
    .pm-fab-toggle:checked ~ .pm-fab-wa { transition-delay: 0.12s; }

    /* ===== Mobile tweak ===== */
    @media (max-width: 560px) {
      .pm-fab-wrapper { right: 16px; bottom: 16px; }
    }

    @media (prefers-reduced-motion: reduce) {
      .pm-fab-main, .pm-fab-line, .pm-fab-sub { transition-duration: 0.001ms; }
      .pm-fab-main::after { animation: none; }
    }
  `]
})
export class FabComponent {
  /** 'left' (default, fans up-left) or 'right' (fans up-right) */
  @Input() direction: 'left' | 'right' = 'left';

   private content = inject(ContentService);
    
      data = computed<ContactSection | null>(() => this.content.content()?.contactSection ?? null);
    
      ngOnInit() { this.content.ensureLoaded().subscribe(); }
}