import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ContentService } from '../../../core/services/content.service';
import { ContactSection } from '../../../core/models';

@Component({
  selector: 'app-contact',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  private content = inject(ContentService);
  private sanitizer = inject(DomSanitizer);

  isLoading = computed(() => this.content.content() === null);
  data = computed<ContactSection | null>(() => this.content.content()?.contactSection ?? null);

  ngOnInit() { this.content.ensureLoaded().subscribe(); }

  mapUrl(d: ContactSection): SafeResourceUrl {
    const q = encodeURIComponent(d.mapQuery || d.address || 'Pune');
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.google.com/maps?q=${q}&output=embed`
    );
  }
}
