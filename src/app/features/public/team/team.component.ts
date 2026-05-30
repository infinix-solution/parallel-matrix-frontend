import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { ContentService } from '../../../core/services/content.service';
import { TeamMember } from '../../../core/models';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="team">
      <div class="container">
        <div class="s-head reveal in">
          <span class="eyebrow">Leadership Team</span>
          <h2 class="s-title">The people behind the matrix.</h2>
          <p class="s-sub">Real humans, real numbers, real accountability.</p>
        </div>
        <div class="team-grid">
          <div *ngFor="let m of members" class="tcard reveal in">
            <div class="ph">
              <span class="badge">{{ m.badge || m.role }}</span>
              <img [src]="photoUrl(m)" [alt]="m.name">
            </div>
            <div class="info">
              <h3>{{ m.name }}</h3>
              <div class="role">{{ m.role }}</div>
              <div class="row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
                {{ m.email }}
              </div>
              <div class="row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/></svg>
                {{ m.phone }}
              </div>
              <div class="acts">
                <a [href]="'mailto:' + m.email">&#9993; Email</a>
                <a [href]="'tel:' + m.phone"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/></svg> Call</a>
                <a [href]="m.linkedin || '#'" target="_blank" rel="noopener"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-linkedin" viewBox="0 0 16 16">
  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
</svg>in</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class TeamComponent implements OnInit {
  private api = inject(ApiService);
  private cnt = inject(ContentService);
  members: TeamMember[] = [];

  private fallback: TeamMember[] = [
    { name: 'Gunjan Meshram', role: 'Founder', email: 'gunjanmeshram@parallelmatrixcorp.com', phone: '+91 78878 55532', photoUrl: 'assets/gunjan.jpg', badge: 'Founder', linkedin: '#' },
    { name: 'Devyani Wankhade', role: 'Human Resource Recruiter', email: 'hr@parallelmatrixcorp.com', phone: '+91 78878 55530', photoUrl: 'assets/devyani.jpg', badge: 'HR Recruiter', linkedin: '#' },
    { name: 'Ashwini Gaware', role: 'Senior Human Resource Recruiter', email: 'ashwini.gaware@parallelmatrixcorp.com', phone: '+91 78878 55533', photoUrl: 'assets/ashwini.jpg', badge: 'Senior HR', linkedin: '#' }
  ];

  ngOnInit() {
    this.api.getTeam().subscribe({
      next: res => {
        this.members = (res?.success && res.data && res.data.length > 0)
          ? res.data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          : this.fallback;
      },
      error: () => this.members = this.fallback
    });
  }

  photoUrl(m: TeamMember): string {
    if (!m.photoUrl) return 'assets/placeholder.jpg';
    return this.cnt.resolveUrl(m.photoUrl);
  }
}
