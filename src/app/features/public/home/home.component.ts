import { Component, OnInit, inject } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { MediaShowcaseComponent } from '../media-showcase/media-showcase.component';
import { AboutComponent } from '../about/about.component';
import { ServicesComponent } from '../services/services.component';
import { CareerComponent } from '../career/career.component';
import { TeamComponent } from '../team/team.component';
import { PolicyComponent } from '../policy/policy.component';
import { FormsComponent } from '../forms/forms.component';
import { ContactComponent } from '../contact/contact.component';
import { ContentService } from '../../../core/services/content.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent, MediaShowcaseComponent, AboutComponent, ServicesComponent,
    CareerComponent, TeamComponent, PolicyComponent, FormsComponent, ContactComponent
  ],
  template: `
    <app-hero></app-hero>
    <app-media-showcase></app-media-showcase>
    <app-about></app-about>
    <app-services></app-services>
    <app-career></app-career>
    <app-team></app-team>
    <app-policy></app-policy>
    <app-forms></app-forms>
    <app-contact></app-contact>
  `
})
export class HomeComponent implements OnInit {
  private content = inject(ContentService);

  ngOnInit() {
    this.content.ensureLoaded().subscribe({
      error: err => console.warn('[Home] Could not load site content:', err)
    });
  }
}
