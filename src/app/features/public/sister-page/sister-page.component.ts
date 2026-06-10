import {
  Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectionStrategy,
  computed, inject, ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../../core/services/content.service';
import { SisterCompanySection } from '../../../core/models';
import { FaIconPipe } from '../../../shared/pipes/fa-icon.pipe';

@Component({
  selector: 'app-sister-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FaIconPipe],
  styleUrls: ['./sister-page.component.css'],
  templateUrl: './sister-page.component.html'
})
export class SisterPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private content = inject(ContentService);
  private el = inject(ElementRef);

  data = computed<SisterCompanySection | null>(() => this.content.content()?.sisterCompany ?? null);

  private observer?: IntersectionObserver;
  private revealSetup = false;

  ngOnInit() {
    this.content.ensureLoaded().subscribe({
      next: () => {
        // Content loaded — if view is already rendered, set up reveals now.
        if (this.el.nativeElement.isConnected && !this.revealSetup) {
          setTimeout(() => this.setupReveal(), 32);
        }
      }
    });
  }

  ngAfterViewInit() {
    // Give *ngIf one tick to render, then set up reveals.
    setTimeout(() => {
      if (!this.revealSetup) this.setupReveal();
    }, 80);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  scrollToContact() {
    const el = document.getElementById('me-contact');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private setupReveal() {
    this.revealSetup = true;
    const host = this.el.nativeElement as HTMLElement;
    const els = host.querySelectorAll<HTMLElement>('.reveal-me');
    if (!els.length) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    els.forEach(el => this.observer!.observe(el));
  }
}
