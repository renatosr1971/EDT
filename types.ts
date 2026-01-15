export enum OrderStatus {
  PENDING = 'Pendente',
  PRODUCTION = 'Em Produção',
  COMPLETED = 'Concluído',
  DELIVERED = 'Entregue',
  CANCELLED = 'Cancelado'
}

export interface OrderItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerAvatar?: string;
  phone: string;
  address: string;
  status: OrderStatus;
  createdAt: string;
  timestamp?: string;
  itemsSummary: string;
  items?: OrderItem[];
  totalValue: number;
  deliveryType: 'Retirada' | 'Entrega';
  pickupDate: string;
  cancellationReason?: string;
}

export interface KPIStats {
  pending: number;
  production: number;
  completed: number;
  delivered: number;
}
