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
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css']

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
