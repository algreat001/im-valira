export interface DashboardMetrics {
  pendingOrdersCount: number;
  unpaidOrdersCount: number;
  unshippedOrdersCount: number;

  cancelledOrdersThisMonth: number;
  cancelledOrdersPrevMonth: number;

  paymentsThisMonth: number;
  paymentsPrevMonth: number;

  productsCount: number;
  categoriesCount: number;

  usersCount: number;
  newUsersThisMonth: number;

  refundedOrdersThisMonth: number;
  ordersThisMonth: number;

  lowStockProductsCount: number;
}
