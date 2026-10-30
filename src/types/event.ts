export interface BudgetCategory {
  category: string;
  allocated: number;
  percentage: number;
  tips: string;
  actualSpent?: number;
}

export interface BudgetAllocation {
  total: number;
  currency: string;
  contingencyReserve: number;
  categories: BudgetCategory[];
}

export interface TimelineItem {
  id?: string;
  time: string;
  phase: 'Arrival' | 'Core Ceremony' | 'Reception' | 'Wrap-up' | 'Networking' | 'Keynote' | 'Hack Time' | string;
  activity: string;
  details: string;
  bufferMinutes: number;
  completed?: boolean;
}

export interface VendorTask {
  id: string;
  category: string;
  task: string;
  deadlineWeeksBefore: number;
  priority: 'High' | 'Medium' | 'Low';
  negotiationCheck: string;
  completed?: boolean;
}

export interface InvitationStudio {
  formalInvitation: string;
  casualWhatsAppCopy: string;
  rsvpCallToAction: string;
}

export interface RiskContingency {
  risk: string;
  probability: 'Low' | 'Med' | 'High';
  impact: 'Low' | 'Med' | 'High' | 'Critical';
  contingencyPlan: string;
  triggerCondition: string;
}

export interface EventSummary {
  title: string;
  themeConcept: string;
  colorPalette: string[];
  dressCode: string;
  tagline: string;
}

export interface EventPlan {
  id: string;
  createdAt: string;
  eventType: string;
  eventDate?: string;
  guestCount: number;
  durationHours: number;
  locationType: string;
  specialRequirements?: string;
  coverImage?: string;
  eventSummary: EventSummary;
  budgetAllocation: BudgetAllocation;
  timelineItinerary: TimelineItem[];
  vendorChecklist: VendorTask[];
  invitationStudio: InvitationStudio;
  riskContingencyMatrix: RiskContingency[];
}

export interface EventInput {
  eventType: string;
  eventDate: string;
  totalBudget: number;
  currency: string;
  guestCount: number;
  durationHours: number;
  locationType: string;
  specialRequirements: string;
}
