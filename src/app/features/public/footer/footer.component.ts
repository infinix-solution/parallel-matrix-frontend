import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from 'src/app/core/services/content.service';
import { SocialLinksService } from 'src/app/core/services/social-links.service';
import { ContactSection } from 'src/app/core/models';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {
  private content = inject(ContentService);
  social = inject(SocialLinksService);

  contact = computed<ContactSection | null>(() => this.content.content()?.contactSection ?? null);

  ngOnInit() { this.content.ensureLoaded().subscribe(); }
}
