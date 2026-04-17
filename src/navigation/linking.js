const linking = {
  prefixes: ["smartprocure://"],
  config: {
    screens: {
      Loading: "loading",
      Login: "login",
      ForgotPassword: "forgot-password",
      MainTabs: {
        screens: {
          Dashboard: "dashboard",
          Requests: {
            screens: {
              RequestList: "requests",
              CreateRequest: "requests/create",
              RequestDetails: "requests/details/:requestId",
              EditRequest: "requests/edit/:requestId",
              MyRequests: "my-requests",
              SubmitQuotation: "quotations/submit/:requestId",
              QuotationList: "quotations/:requestId",
              QuotationComparison: "quotations/compare/:requestId",
            },
          },
          Instructions: "instructions",
          History: "history",
          Profile: "profile",
        },
      },
      Notifications: "notifications",
      Settings: "settings",
      AdminDashboard: "admin",
      PendingApprovals: "admin/pending-approvals",
      UserManagement: "admin/users",
      Reports: "admin/reports",
      InstructionDetails: "instructions/:instructionId",
      AuditTrail: "audit/:historyId",
    },
  },
};

export default linking;
