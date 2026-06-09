import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Transforms a FontAwesome class string (e.g. "fa-solid fa-bolt") into
 * a safe <i> HTML element. Falls back to plain text for legacy emoji values.
 */
@Pipe({ name: 'faIcon', standalone: true, pure: true })
export class FaIconPipe implements PipeTransform {
  constructor(private san: DomSanitizer) {}

  transform(cls: string | undefined | null): SafeHtml {
    if (!cls) return '';
    const trimmed = cls.trim();
    if (trimmed.startsWith('fa')) {
      return this.san.bypassSecurityTrustHtml(
        `<i class="${trimmed}" aria-hidden="true"></i>`
      );
    }
    return trimmed;
  }
}
