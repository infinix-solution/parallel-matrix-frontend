// ===== Existing models =====
export interface SliderImage {
  _id?: string;
  url: string;
  filename?: string;
  order?: number;
}

export interface TeamMember {
  _id?: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  linkedin?: string;
  photoUrl?: string;
  badge?: string;
  order?: number;
}

export interface FormsConfig {
  sectionEyebrow: string;
  sectionTitle: string;
  sectionSub: string;
  hrTitle: string;
  hrSubtitle: string;
  candidateTitle: string;
  candidateSubtitle: string;
}

export interface LoginResponse {
  token: string;
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// ===== Dynamic Page Builder =====
export type FormFieldType = 'text' | 'number' | 'email' | 'dropdown' | 'textarea' | 'tel' | 'file';

export interface DynamicFormField {
  id: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  placeholder: string;
  options: string[];
  minLength?: number | null;
  maxLength?: number | null;
  min?: number | null;
  max?: number | null;
  pattern?: string;
  patternMessage?: string;
  // File field
  accept?: string;
  maxFileSizeKb?: number | null;
}

export interface PageLayout {
  title: string;
  description: string;
  heroImage: string;
  sidebarImage: string;
}

export interface SectionHeader {
  eyebrow: string;
  title: string;
  sub: string;
}

export interface FormSection {
  title: string;
  subtitle: string;
  icon: string;
  submitLabel: string;
  fields: DynamicFormField[];
}

export interface PageConfig {
  _id?: string;
  pageLayout: PageLayout;
  sectionHeader: SectionHeader;
  hrForm: FormSection;
  candidateForm: FormSection;
  formFields?: DynamicFormField[];
}

// ===== Site Content =====
export interface HighlightCard {
  icon: string;
  title: string;
  description: string;
}

export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  lead: string;
  image?: string;
  items: string[];
}

export interface StatItem {
  number: string;
  label: string;
}

export interface PolicyItem {
  icon: string;
  title: string;
  description: string;
  maxLength: number;
}

export interface ChipItem {
  icon: string;
  label: string;
}

export interface AboutSection {
  eyebrow: string;
  title: string;
  sub: string;
  image: string;
  highlights: HighlightCard[];
}

export interface ServicesSection {
  eyebrow: string;
  title: string;
  sub: string;
  items: ServiceItem[];
}

export interface CareerSection {
  eyebrow: string;
  title: string;
  lead: string;
  stats: StatItem[];
}

export interface SisterCompanySection {
  eyebrow: string;
  title: string;
  sub: string;
  aboutTitle: string;
  aboutText1: string;
  aboutText2: string;
  tagline: string;
  primaryServiceIcon: string;
  primaryServiceTitle: string;
  primaryServiceLead: string;
  serviceCards: HighlightCard[];
  visionTitle: string;
  visionText: string;
  missionTitle: string;
  missionText: string;
  industriesTitle: string;
  industries: ChipItem[];
  email: string;
  phone: string;
  locations: string;
}

export interface PolicySection {
  eyebrow: string;
  title: string;
  items: PolicyItem[];
}

export interface ContactSection {
  eyebrow: string;
  title: string;
  sub: string;
  address: string;
  phone: string;
  emergency: string;
  email: string;
  mapQuery: string;
  directionsUrl: string;
  linkdnUrl: string;
  whatsapp: string;
}

export interface SiteContent {
  _id?: string;
  aboutSection: AboutSection;
  servicesSection: ServicesSection;
  careerSection: CareerSection;
  sisterCompany: SisterCompanySection;
  policySection: PolicySection;
  contactSection: ContactSection;
}
