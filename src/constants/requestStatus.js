export const REQUEST_STATUS = {
  PENDING: "Pending",
  QUOTATION_RECEIVED: "quotation_received",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
  PURCHASE_IN_PROGRESS: "Purchase In Progress",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
};

export const REQUEST_STATUS_LIST = [
  REQUEST_STATUS.PENDING,
  REQUEST_STATUS.QUOTATION_RECEIVED,
  REQUEST_STATUS.APPROVED,
  REQUEST_STATUS.REJECTED,
  REQUEST_STATUS.CANCELLED,
  REQUEST_STATUS.PURCHASE_IN_PROGRESS,
  REQUEST_STATUS.DELIVERED,
  REQUEST_STATUS.COMPLETED,
];

export const normalizeRequestStatus = (status) =>
  String(status || "")
    .replace(/_/g, " ")
    .trim()
    .toLowerCase();

export const isQuotationOpenStatus = (status) =>
  ["pending", "draft", "quotation received"].includes(
    normalizeRequestStatus(status),
  );

export const isPendingApprovalStatus = (status) =>
  ["pending", "quotation received"].includes(normalizeRequestStatus(status));

export default REQUEST_STATUS;
