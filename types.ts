export enum AppMode {
  PATIENT = 'PATIENT',
  PROFESSIONAL = 'PROFESSIONAL',
}

export interface CaseStudy {
  title: string;
  patientProfile: {
    age: number;
    gender: string;
    background: string;
  };
  presentingComplaint: string;
  historyOfPresentingIllness: string;
  pastMedicalHistory: string;
  differentialDiagnosis: string[];
  investigations: string;
  managementPlan: string;
  discussionPoints: string[];
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string | CaseStudy;
  type: 'text' | 'caseStudy' | 'error' | 'welcome';
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  mode: AppMode;
}
