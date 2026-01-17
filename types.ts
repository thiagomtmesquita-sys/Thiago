
export interface Message {
  role: 'user' | 'model';
  content: string;
}

export interface ContactInfo {
  whatsapp: string;
  instagram: string;
  email: string;
  name: string;
}

export interface ConsultationResponse {
  summary: string;
  recommendation: string;
  urgency: 'baixa' | 'média' | 'alta';
}
