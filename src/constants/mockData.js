import { REQUEST_STATUS } from "./requestStatus";

export const MOCK_REQUESTS = [
  {
    id: "1",
    title: "Printer Toner Purchase",
    itemName: "Printer Toner",
    category: "Office Supplies",
    campus: "Banasree",
    shift: "Morning",
    requester: "Arifur Rahman",
    requesterName: "Arifur Rahman",
    date: "17 Apr 2026",
    createdAt: "2026-04-17T10:20:00.000Z",
    status: REQUEST_STATUS.PENDING,
    urgency: "High",
    quantity: "5 pcs",
    budget: "৳ 15,000",
    reason: "Urgent need for exam printing and office documentation.",
    neededBy: "25 Apr 2026",
    quotationCount: 3,
  },
  {
    id: "2",
    title: "Projector Purchase",
    itemName: "Projector",
    category: "IT Equipment",
    campus: "Malibag",
    shift: "Day",
    requester: "Nayeem Hasan",
    requesterName: "Nayeem Hasan",
    date: "16 Apr 2026",
    createdAt: "2026-04-16T09:10:00.000Z",
    status: REQUEST_STATUS.APPROVED,
    urgency: "Medium",
    quantity: "1 pc",
    budget: "৳ 45,000",
    reason: "Classroom presentation support.",
    neededBy: "28 Apr 2026",
    quotationCount: 2,
  },
];

export const MOCK_QUOTATIONS = [
  {
    id: "q1",
    requestId: "1",
    vendorName: "Tech World BD",
    vendorContact: "017XXXXXXXX",
    specification: "Original toner cartridge",
    amount: "৳ 14,500",
    deliveryTime: "3 days",
    warranty: "6 months",
    notes: "Original toner with delivery included.",
    submittedBy: "Rahim",
    submittedAt: "17 Apr 2026",
    isApproved: false,
  },
  {
    id: "q2",
    requestId: "1",
    vendorName: "Office Supply House",
    vendorContact: "018XXXXXXXX",
    specification: "Compatible toner cartridge",
    amount: "৳ 13,900",
    deliveryTime: "5 days",
    warranty: "No warranty",
    notes: "Bulk price quotation.",
    submittedBy: "Nayeem",
    submittedAt: "17 Apr 2026",
    isApproved: true,
  },
];

export const MOCK_INSTRUCTIONS = [
  {
    id: "i1",
    itemName: "Projector",
    vendorName: "Tech World BD",
    amount: "৳ 45,000",
    campus: "Banasree",
    shift: "Morning",
    approvedBy: "Admin",
    approvedAt: "17 Apr 2026",
    status: "Purchase In Progress",
  },
];

export const MOCK_NOTIFICATIONS = [
  {
    id: "n1",
    title: "New Purchase Request",
    message:
      "A new request for projector has been submitted for Banasree campus.",
    time: "10 min ago",
    type: "request",
    isRead: false,
  },
  {
    id: "n2",
    title: "Quotation Approved",
    message: "Admin approved a quotation for office chair procurement.",
    time: "Yesterday",
    type: "approval",
    isRead: true,
  },
];

export const MOCK_USERS = [
  {
    id: "u1",
    name: "Arifur Rahman",
    email: "arifur@email.com",
    role: "admin",
    campus: "Banasree",
    status: "Approved",
  },
  {
    id: "u2",
    name: "Nayeem Hasan",
    email: "nayeem@email.com",
    role: "member",
    campus: "Malibag",
    status: "Approved",
  },
];
