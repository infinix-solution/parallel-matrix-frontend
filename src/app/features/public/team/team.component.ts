import { Component, ChangeDetectionStrategy, inject, Signal, signal } from '@angular/core';
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
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent {
  private api = inject(ApiService);
  private cnt = inject(ContentService);

  private readonly fallback: TeamMember[] = [
    { name: 'Gunjan Meshram', role: 'Founder', email: 'gunjanmeshram@parallelmatrixcorp.com', phone: '+91 78878 55532', photoUrl: 'assets/gunjan.jpg', badge: 'Founder', linkedin: '#' },
    { name: 'Devyani Wankhade', role: 'Human Resource Recruiter', email: 'hr@parallelmatrixcorp.com', phone: '+91 78878 55530', photoUrl: 'assets/devyani.jpg', badge: 'HR Recruiter', linkedin: '#' },
    { name: 'Ashwini Gaware', role: 'Senior Human Resource Recruiter', email: 'ashwini.gaware@parallelmatrixcorp.com', phone: '+91 78878 55533', photoUrl: 'assets/ashwini.jpg', badge: 'Senior HR', linkedin: '#' }
  ];

  /** True until getTeam() settles (success or error); drives skeleton visibility */
  readonly isLoading = signal(true);

  members: Signal<TeamMember[]> = toSignal(
    this.api.getTeam().pipe(
      map(res => {
        this.isLoading.set(false);
        return res?.success && Array.isArray(res.data) && res.data.length > 0
          ? [...res.data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          : this.fallback;
      }),
      catchError(() => {
        this.isLoading.set(false);
        return of(this.fallback);
      })
    ),
    { initialValue: [] as TeamMember[] }
  );

  getPhotoUrl(path: string | undefined): string {
    return path ? this.cnt.resolveUrl(path) : 'assets/placeholder.jpg';
  }

  trackByMemberName(index: number, item: TeamMember): string {
    return item.name;
  }
}
