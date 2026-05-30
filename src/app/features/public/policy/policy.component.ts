import { Component, OnInit, computed, inject } from '@angular/core';
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
    <section id="policy" style="background:linear-gradient(180deg,#eef2f9,var(--bg))" *ngIf="data() as d">
      <div class="container">
        <div class="s-head reveal in">
          <span class="eyebrow">{{ d.eyebrow }}</span>
          <h2 class="s-title">{{ d.title }}</h2>
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
