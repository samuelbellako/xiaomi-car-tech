export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string; // e.g., "XM-74291"
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  paymentMethod: 'PSE' | 'Nequi' | 'Wompi' | 'Bold' | 'Efipay' | 'WhatsApp';
  paymentDetails: {
    transactionId?: string;
    receiptUrl?: string;
    extraMessage?: string;
  };
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'DECLINED';
  createdAt: string; // ISO String
  items: OrderItem[];
}

export interface AdminSession {
  email: string;
  isAuthenticated: boolean;
}
