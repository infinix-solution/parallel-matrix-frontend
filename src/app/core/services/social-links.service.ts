import { Injectable, inject, computed } from '@angular/core';
import { ContentService } from './content.service';
import { SocialLinks } from '../models';

const FALLBACKS: SocialLinks = {
  linkedin: 'https://www.linkedin.com/company/parallel-matrix',
  whatsapp: '919999999999',
  email:    'hr@parallelmatrixcorp.com'
};

/**
 * Single source of truth for social / contact links.
 * Reads from SiteContent.contactSection; falls back to compile-time defaults
 * if the backend hasn't been configured yet.
 */
@Injectable({ providedIn: 'root' })
export class SocialLinksService {
  private content = inject(ContentService);

  links = computed<SocialLinks>(() => {
    const c = this.content.content()?.contactSection;
    return {
      linkedin: c?.linkdnUrl  || FALLBACKS.linkedin,
      whatsapp: c?.whatsapp   || FALLBACKS.whatsapp,
      email:    c?.email      || FALLBACKS.email
    };
  });

  get whatsappHref(): string {
    const num = this.links().whatsapp.replace(/\D/g, '');
    return `https://wa.me/${num}`;
  }

  get linkedinHref(): string { return this.links().linkedin; }
  get mailtoHref():   string { return `mailto:${this.links().email}`; }
}
