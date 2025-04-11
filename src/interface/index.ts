export interface Pagination {
  page: number;
  total: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
}

export interface UserSchema {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  NID: string;
  role: "admin" | "manager" | "super_admin";
  active: boolean;
  avatar: string;
}

export interface CustomerSchema {
  _id: string;
  name: string;
  phone: string;
  address: string;
  defaultPrice: number;
  defaultQuantity: number;
  defaultItem: "lunch" | "dinner" | "lunch&dinner";
  defaultOffDays: string[];
  paymentStatus: "paid" | "partially_paid" | "pending";
  paymentSystem: "weekly" | "monthly";
  active: boolean;
  createdAt: Date;
  accessKey: string;
  accessKeyExpiredAt: Date;
  amount: number;
}

export interface SingleCustomerSchema {
  customer: CustomerSchema;
  orders: {
    data: OrderSchema[];
  };
  payments: {
    data: OrderSchema[];
  };
}

export interface OrderSchema {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  price: number;
  quantity: number;
  total: number;
  item: string;
  date: Date;
  note?: string;
}

export interface PaymentSchema {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  price: number;
  quantity: number;
  total: number;
  item: string;
  date: Date;
  note?: string;
}
