import { Component, OnInit, computed, inject, signal, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../../core/services/content.service';
import { ServicesSection, ServiceItem } from '../../../core/models';
import { FaIconPipe } from '../../../shared/pipes/fa-icon.pipe';

const SERVICE_IMAGES: Record<string, string> = {
  recruitment:  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=700&q=80',
  staffing:     'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=700&q=80',
  immigration:  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=700&q=80',
  manpower:     'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=700&q=80',
  default_0:    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=700&q=80',
  default_1:    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&q=80',
  default_2:    'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=700&q=80',
  default_3:    'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=700&q=80'
};

interface SvcWithState extends ServiceItem { resolvedImage: string; }

@Component({
  selector: 'app-services',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FaIconPipe],
  styleUrls: ['./services.component.css'],
  templateUrl: './services.component.html'
})
export class ServicesComponent implements OnInit {
  private content = inject(ContentService);

  activeService = signal<SvcWithState | null>(null);

  isLoading = computed(() => this.content.content() === null);
  data = computed<ServicesSection | null>(() => this.content.content()?.servicesSection ?? null);

  items = computed<SvcWithState[]>(() =>
    (this.data()?.items || []).map((s, i) => ({
      ...s,
      resolvedImage: this.resolveServiceImage(s, i)
    }))
  );

  ngOnInit() { this.content.ensureLoaded().subscribe(); }

  openModal(s: SvcWithState) {
    this.activeService.set(s);
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.activeService.set(null);
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEscape() { this.closeModal(); }

  private resolveServiceImage(s: ServiceItem, index: number): string {
    if (s.image) return this.content.resolveUrl(s.image);
    const key = (s.id || s.title || '').toLowerCase();
    for (const [k, url] of Object.entries(SERVICE_IMAGES)) {
      if (!k.startsWith('default') && key.includes(k)) return url;
    }
    return SERVICE_IMAGES[`default_${index % 4}`];
  }
}
