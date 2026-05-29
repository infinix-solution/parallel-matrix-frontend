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
                <a [href]="'tel:' + m.phone">&#128222; Call</a>
                <a [href]="m.linkedin || '#'" target="_blank" rel="noopener">in</a>
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
