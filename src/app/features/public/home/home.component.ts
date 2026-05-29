import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { AboutComponent } from '../about/about.component';
import { ServicesComponent } from '../services/services.component';
import { CareerComponent } from '../career/career.component';
import { TeamComponent } from '../team/team.component';
import { SisterComponent } from '../sister/sister.component';
import { PolicyComponent } from '../policy/policy.component';
import { FormsComponent } from '../forms/forms.component';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent, AboutComponent, ServicesComponent, CareerComponent,
    TeamComponent, SisterComponent, PolicyComponent, FormsComponent, ContactComponent
  ],
  template: `
    <app-hero></app-hero>
    <app-about></app-about>
    <app-services></app-services>
    <app-career></app-career>
    <app-team></app-team>
    <app-sister></app-sister>
    <app-policy></app-policy>
    <app-forms></app-forms>
    <app-contact></app-contact>
  `
})
export class HomeComponent {}
