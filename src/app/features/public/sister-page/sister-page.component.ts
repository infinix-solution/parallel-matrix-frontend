import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SisterComponent } from '../sister/sister.component';
import { ContentService } from '../../../core/services/content.service';

/**
 * Standalone page route for the Sister Concern (Matrix Enterprises).
 * Reuses the existing <app-sister> component but adds:
 *   - Top padding so content clears the fixed navbar
 *   - Optional hero strip introducing the page
 *   - Calls ContentService.ensureLoaded() as a safety net (in case the user
 *     deep-links directly to /matrix-enterprises without visiting home first)
 */
@Component({
  selector: 'app-sister-page',
  standalone: true,
  imports: [CommonModule, SisterComponent],
  template: `
    <div style="padding-top:90px;background:var(--bg);min-height:60vh">
      <app-sister></app-sister>
    </div>
  `
})
export class SisterPageComponent implements OnInit {
  private content = inject(ContentService);

  ngOnInit() {
    // Fetch site content if not already loaded (deep-link safety).
    this.content.ensureLoaded().subscribe();
  }
}
