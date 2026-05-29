import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../../core/services/content.service';
import { PolicySection } from '../../../core/models';

interface PolWithState {
  icon: string; title: string; description: string; maxLength: number;
  expanded?: boolean;
}

@Component({
  selector: 'app-policy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="policy" style="background:linear-gradient(180deg,#eef2f9,var(--bg))" *ngIf="data">
      <div class="container">
        <div class="s-head reveal in">
          <span class="eyebrow">{{ data.eyebrow }}</span>
          <h2 class="s-title">{{ data.title }}</h2>
        </div>
        <div class="pol-grid">
          <div *ngFor="let p of items" class="pol reveal in">
            <h4>{{ p.icon }} {{ p.title }}</h4>
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
  `
})
export class PolicyComponent implements OnInit {
  private content = inject(ContentService);
  data: PolicySection | null = null;
  items: PolWithState[] = [];

  ngOnInit() {
    const cached = this.content.content();
    if (cached?.policySection) this.setData(cached.policySection);
    this.content.get().subscribe({
      next: r => { if (r?.data?.policySection) this.setData(r.data.policySection); }
    });
  }

  setData(d: PolicySection) {
    this.data = d;
    this.items = (d.items || []).map(p => ({ ...p, expanded: false }));
  }

  needsToggle(p: PolWithState): boolean {
    return !!p.maxLength && p.description.length > p.maxLength;
  }

  truncated(p: PolWithState): string {
    if (!this.needsToggle(p) || p.expanded) return p.description;
    return p.description.slice(0, p.maxLength).trimEnd() + '\u2026';
  }
}
