import { Component, ChangeDetectionStrategy, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { ContentService } from '../../../core/services/content.service';
import { TeamMember } from '../../../core/models';

@Component({
  selector: 'app-team',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  styles: [`
    :host {
      display: block;
      background-color: #111827; /* Sophisticated, lighter slate dark background */
      color: #f3f4f6;
      
      /* Rebalanced Color Tokens mapped to your Gold palette */
      --bg-main: #111827;
      --bg-card: #1f2937; /* Lighter charcoal card layer */
      --bg-card-hover: #2563eb10; /* Very subtle glow base */
      --gold-light: rgba(240, 217, 122, 0.15); /* Soft premium gold tint background */
      --gold-text: #f0d97a;
      --text-main: #f9fafb;
      --text-muted: #9ca3af;
      --border-subtle: rgba(255, 255, 255, 0.05);
      --border-hover: rgba(240, 217, 122, 0.3);
    }

    .container {
      width: min(100%, 1200px);
      margin: 0 auto;
      padding: clamp(40px, 5vw, 60px) 24px; /* Tightened container padding to reduce empty space */
    }

    /* ── CENTERED & COMPACT HEADER ── */
    .s-head {
      display: flex;
      flex-direction: column;
      align-items: center; /* Enforces exact horizontal centering for all contents */
      text-align: center;
      margin-bottom: clamp(30px, 4vw, 44px); /* Tightened space below header */
    }

    /* Using your exact structural token styles */
    .eyebrow-tag {
      display: inline-flex;
      align-items: center;
      padding: 6px 14px;
      border-radius: 999px;
      background: var(--gold-light);
      color: #eab308; /* High-contrast readable deep gold over slate background */
      font-size: clamp(10px, 1vw, 11px);
      font-weight: 800;
      letter-spacing: .22em;
      text-transform: uppercase;
      width: fit-content;
      margin-bottom: 16px; /* Slightly adjusted to eliminate dead spaces */
    }

    .s-title {
      margin: 0 0 8px; /* Reduced bottom gap */
      font-size: clamp(1.8rem, 3.5vw, 2.4rem); /* Slightly scaled down to maximize screen area */
      font-weight: 800;
      letter-spacing: -0.02em;
      line-height: 1.2;
      color: #ffffff;
    }

    .s-sub {
      margin: 0;
      color: var(--text-muted);
      font-size: clamp(14px, 1.1vw, 16px);
      line-height: 1.5;
      max-width: 52ch;
    }

    /* ── FLEXIBLE GRID ── */
    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 28px; /* Tighter item spacing */
    }

    /* ── CARD STRUCTURAL LAYOUT ── */
    .tcard {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 14px;
      overflow: hidden;
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
                  background-color 0.4s ease, 
                  border-color 0.4s ease;
    }

    .tcard:hover {
      transform: translateY(-6px);
      border-color: var(--border-hover);
      box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.5);
    }

    .ph {
      position: relative;
      aspect-ratio: 1 / 1; /* Crisp square box aspect match */
      overflow: hidden;
      background: #111827;
    }

    .ph img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .tcard:hover .ph img {
      transform: scale(1.03);
    }

    .badge {
      position: absolute;
      top: 14px;
      left: 14px;
      z-index: 2;
      background: rgba(17, 24, 39, 0.85);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.06);
      color: var(--gold-text);
      padding: 4px 10px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.04em;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .info {
      padding: 20px; /* Reduced card padding for internal data economy */
    }

    .info h3 {
      margin: 0 0 4px;
      font-size: 19px;
      font-weight: 700;
      color: #ffffff;
    }

    .role {
      color: var(--text-muted);
      font-size: 13px;
      font-weight: 500;
      margin-bottom: 16px;
    }

    .row {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #9ca3af;
      font-size: 13px;
      margin-bottom: 8px;
      word-break: break-all;
    }

    .row svg {
      flex-shrink: 0;
      opacity: 0.6;
    }

    /* ── ACTION LINKS ── */
    .acts {
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.04);
      display: flex;
      gap: 8px;
    }

    .acts a {
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      color: var(--text-main);
      padding: 8px 12px;
      font-size: 12.5px;
      font-weight: 600;
      border-radius: 6px;
      text-decoration: none;
      transition: background-color 0.2s ease, border-color 0.2s ease;
    }

    .acts a:hover {
      background-color: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.12);
    }

    .acts a.linkedin-btn {
      flex: 0 0 38px;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.06);
      border-color: rgba(56, 189, 248, 0.1);
    }

    .acts a.linkedin-btn:hover {
      background: rgba(56, 189, 248, 0.12);
      border-color: rgba(56, 189, 248, 0.25);
    }
  `],
  template: `
    <section id="team">
      <div class="container">
        
        <div class="s-head">
          <span class="eyebrow-tag">Leadership Team</span>
          <h2 class="s-title">The people behind the matrix.</h2>
          <p class="s-sub">Real humans, real numbers, real accountability.</p>
        </div>

        <div class="team-grid">
          <div *ngFor="let m of members(); trackBy: trackByMemberName" class="tcard">
            
            <div class="ph">
              <span class="badge">{{ m.badge || m.role }}</span>
              <img [src]="getPhotoUrl(m.photoUrl)" [alt]="m.name" loading="lazy">
            </div>

            <div class="info">
              <h3>{{ m.name }}</h3>
              <div class="role">{{ m.role }}</div>
              
              <div class="row">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
                <span>{{ m.email }}</span>
              </div>
              
              <div class="row">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/></svg>
                <span>{{ m.phone }}</span>
              </div>

              <div class="acts">
                <a [href]="'mailto:' + m.email">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
                  Email
                </a>
                <a [href]="'tel:' + m.phone">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/></svg>
                  Call
                </a>
                <a *ngIf="m.linkedin" [href]="m.linkedin" target="_blank" rel="noopener" class="linkedin-btn" aria-label="LinkedIn Profile">
                  <svg width="13" height="13" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  `
})
export class TeamComponent {
  private api = inject(ApiService);
  private cnt = inject(ContentService);

  private readonly fallback: TeamMember[] = [
    { name: 'Gunjan Meshram', role: 'Founder', email: 'gunjanmeshram@parallelmatrixcorp.com', phone: '+91 78878 55532', photoUrl: 'assets/gunjan.jpg', badge: 'Founder', linkedin: '#' },
    { name: 'Devyani Wankhade', role: 'Human Resource Recruiter', email: 'hr@parallelmatrixcorp.com', phone: '+91 78878 55530', photoUrl: 'assets/devyani.jpg', badge: 'HR Recruiter', linkedin: '#' },
    { name: 'Ashwini Gaware', role: 'Senior Human Resource Recruiter', email: 'ashwini.gaware@parallelmatrixcorp.com', phone: '+91 78878 55533', photoUrl: 'assets/ashwini.jpg', badge: 'Senior HR', linkedin: '#' }
  ];

  members: Signal<TeamMember[]> = toSignal(
    this.api.getTeam().pipe(
      map(res => 
        res?.success && Array.isArray(res.data) && res.data.length > 0
          ? [...res.data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          : this.fallback
      ),
      catchError(() => of(this.fallback))
    ),
    { initialValue: this.fallback }
  );

  getPhotoUrl(path: string | undefined): string {
    return path ? this.cnt.resolveUrl(path) : 'assets/placeholder.jpg';
  }

  trackByMemberName(index: number, item: TeamMember): string {
    return item.name;
  }
}