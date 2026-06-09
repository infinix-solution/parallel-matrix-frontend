import { Component, OnInit, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../../core/services/content.service';
import { PolicySection } from '../../../core/models';
import { FaIconPipe } from '../../../shared/pipes/fa-icon.pipe';

interface PolWithState {
  icon: string; title: string; description: string; maxLength: number;
  expanded?: boolean;
}

@Component({
  selector: 'app-policy',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FaIconPipe],
  template: `
    <section id="policy" style="background:linear-gradient(180deg,#eef2f9,var(--bg))" *ngIf="data() as d">
      <div class="container">
          <div class="s-head reveal in" style="margin-bottom:40px; display: flex; flex-direction: column; align-items: center; text-align: center;">
          <span class="eyebrow-tag">{{ d.eyebrow }}</span>
          <h2 class="s-title">{{ d.title }}</h2>
        </div>
        <div class="pol-grid">
          <div *ngFor="let p of items" class="pol reveal in">
            <h4>
              <span *ngIf="p.icon" [innerHTML]="p.icon | faIcon" style="margin-right:8px"></span>{{ p.title }}
            </h4>
            <p>
              {{ truncated(p) }}
              <a *ngIf="needsToggle(p)" (click)="p.expanded = !p.expanded"
                 style="display:inline-block;margin-left:4px;color:var(--blue2);font-weight:700;cursor:pointer">
                {{ p.expanded ? 'Read less' : 'Read more' }}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .eyebrow-tag {
      display: inline-flex;
      align-items: center;
      padding: 6px 14px;
      border-radius: 999px;
      background: rgba(240, 217, 122, 0.15);
      color: #eab308;
      font-size: clamp(10px, 1vw, 11px);
      font-weight: 800;
      letter-spacing: .22em;
      text-transform: uppercase;
      width: fit-content;
      margin-bottom: 20px;
    }
    `]

})
export class PolicyComponent implements OnInit {
  private content = inject(ContentService);
  items: PolWithState[] = [];

  data = computed<PolicySection | null>(() => {
    const d = this.content.content()?.policySection ?? null;
    if (d) this.items = (d.items || []).map(p => ({ ...p, expanded: false }));
    return d;
  });

  ngOnInit() { this.content.ensureLoaded().subscribe(); }

  needsToggle(p: PolWithState): boolean {
    return !!p.maxLength && p.description.length > p.maxLength;
  }

  truncated(p: PolWithState): string {
    if (!this.needsToggle(p) || p.expanded) return p.description;
    return p.description.slice(0, p.maxLength).trimEnd() + '\u2026';
  }
}
