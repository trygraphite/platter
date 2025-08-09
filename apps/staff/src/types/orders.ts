import type { OrderStatus } from "@prisma/client";
import type { StaffUser } from "@/utils/auth";

// Temporary type until migration is run
export type OrderItemStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderWithDetails {
  id: string;
  orderNumber: number | null;
  status: OrderStatus;
  totalAmount: number;
  specialNotes: string | null;
  createdAt: Date;
  tableId: string | null;
  table: {
    id: string;
    number: string;
  } | null;
  staff: {
    id: string;
    name: string;
  } | null;
  items: {
    id: string;
    quantity: number;
    price: number;
    status: OrderItemStatus;
    specialNotes: string | null;
    confirmedAt: Date | null;
    preparingAt: Date | null;
    readyAt: Date | null;
    deliveredAt: Date | null;
    cancelledAt: Date | null;
    isMyItem?: boolean; // For operators to distinguish their items
    menuItem: {
      name: string;
      price: number;
      image: string | null;
      servicePointId: string | null;
      servicePoint: {
        id: string;
        name: string;
        description: string | null;
      } | null;
    };
    variety: {
      name: string;
      price: number;
    } | null;
  }[];
  _metadata?: {
    myItemsCount: number;
    otherItemsCount: number;
    myItemsTotal: number;
    otherItemsTotal: number;
    hasMyItems: boolean;
    hasOtherItems: boolean;
  };
}

export interface OrderStats {
  total: number;
  confirmed: number;
  preparing: number;
  delivered: number;
}

export interface StaffOrdersClientProps {
  initialOrders: OrderWithDetails[];
  initialStats: OrderStats;
  staff: StaffUser;
}

export interface StaffOrderStatsProps {
  stats: OrderStats;
}

export interface StaffOrderFiltersProps {
  statusFilter: OrderStatus | "all";
  setStatusFilter: (status: OrderStatus | "all") => void;
  assignedFilter: "all" | "assigned" | "unassigned";
  setAssignedFilter: (filter: "all" | "assigned" | "unassigned") => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export interface StaffOrdersTableProps {
  orders: OrderWithDetails[];
  staff: StaffUser;
  onOrderUpdate: (order: OrderWithDetails) => void;
  getOrderById?: (orderId: string) => OrderWithDetails | undefined;
  renderOrderModal?: (
    selectedOrder: OrderWithDetails,
    onClose: () => void,
    onUpdate: (order: OrderWithDetails) => void,
  ) => React.ReactNode;
  enqueueUiUpdate?: <T>(task: () => Promise<T>) => Promise<T>;
}

export interface StaffOrderModalProps {
  order: OrderWithDetails;
  staff: StaffUser;
  onClose: () => void;
  onUpdate: (order: OrderWithDetails) => void;
  getOrderById?: (orderId: string) => OrderWithDetails | undefined;
  enqueueUiUpdate?: <T>(task: () => Promise<T>) => Promise<T>;
}
