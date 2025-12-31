
export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  content: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  notes: string;
  type: 'income' | 'expense';
  classification?: 'need' | 'want';
  isRecurring?: boolean;
  frequency?: 'weekly' | 'monthly' | 'yearly';
  nextDueDate?: string;
}

export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  type: 'saving' | 'debt';
  reminderDays?: number;
}
