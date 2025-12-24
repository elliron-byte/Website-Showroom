
export interface PerformanceData {
  month: string;
  revenue: number;
  visitors: number;
}

export interface WebsiteListing {
  id: string;
  name: string;
  url: string;
  description: string;
  category: 'SaaS' | 'Content' | 'E-commerce' | 'Tool' | 'Marketplace';
  price: number;
  monthlyRevenue: number;
  monthlyProfit: number;
  monthlyTraffic: number;
  techStack: string[];
  image: string;
  performance: PerformanceData[];
  age: string;
  askingMultiple: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
