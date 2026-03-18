export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
  points: number;
  avatar: string;
  createdAt: Date;
  isActive: boolean;
}

export interface Credential {
  id: string;
  email: string;
  password: string;
  isAssigned: boolean;
  assignedTo?: string;
  assignedAt?: Date;
}

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface Product {
  id: string;
  service: string;
  serviceLogo: string;
  planName: string;
  description: string;
  features: PlanFeature[];
  price: number;
  duration: string;
  color: string;
  isActive: boolean;
  credentials: Credential[];
}

export interface Purchase {
  id: string;
  oderId: string;
  userId: string;
  productId: string;
  productName: string;
  serviceName: string;
  serviceLogo: string;
  planName: string;
  credentialEmail: string;
  credentialPassword: string;
  pointsSpent: number;
  purchaseDate: Date;
  expirationDate: Date;
  status: 'active' | 'expired' | 'cancelled';
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

export interface PointsTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'add' | 'remove' | 'spend';
  reason: string;
  date: Date;
  adminId?: string;
}
