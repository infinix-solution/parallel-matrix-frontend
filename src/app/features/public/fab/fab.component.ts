import { ChangeDetectionStrategy, Component, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialLinksService } from 'src/app/core/services/social-links.service';
import { ContentService } from 'src/app/core/services/content.service';

@Component({
  selector: 'app-fab',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.css']
})
export class FabComponent implements OnInit {
  @Input() direction: 'left' | 'right' = 'left';

  social = inject(SocialLinksService);
  private content = inject(ContentService);

  ngOnInit() { this.content.ensureLoaded().subscribe(); }
}
