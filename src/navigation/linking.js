import ROUTES from "./routes";

const linking = {
  prefixes: ["smartprocure://"],
  config: {
    screens: {
      [ROUTES.LOADING]: "loading",
      [ROUTES.AUTH_ROOT]: {
        screens: {
          [ROUTES.LOGIN]: "login",
          [ROUTES.FORGOT_PASSWORD]: "forgot-password",
        },
      },

      [ROUTES.MAIN_TABS]: {
        screens: {
          [ROUTES.DASHBOARD]: "dashboard",

          [ROUTES.REQUESTS]: {
            screens: {
              [ROUTES.REQUEST_LIST]: "requests",
              [ROUTES.CREATE_REQUEST]: "requests/create",
              [ROUTES.REQUEST_DETAILS]: "requests/details/:requestId",
              [ROUTES.EDIT_REQUEST]: "requests/edit/:requestId",
              [ROUTES.MY_REQUESTS]: "my-requests",
              [ROUTES.SUBMIT_QUOTATION]: "quotations/submit/:requestId",
              [ROUTES.QUOTATION_LIST]: "quotations/:requestId",
              [ROUTES.QUOTATION_COMPARISON]: "quotations/compare/:requestId",
            },
          },

          [ROUTES.INSTRUCTIONS]: "instructions",
          [ROUTES.HISTORY]: "history",
          [ROUTES.PROFILE]: "profile",
        },
      },

      [ROUTES.ADMIN_ROOT]: {
        screens: {
          [ROUTES.ADMIN_DASHBOARD]: "admin",
          [ROUTES.PENDING_APPROVALS]: "admin/pending-approvals",
          [ROUTES.USER_MANAGEMENT]: "admin/users",
          [ROUTES.REPORTS]: "admin/reports",
          [ROUTES.REQUEST_DETAILS]: "admin/request/:requestId",
          [ROUTES.INSTRUCTION_DETAILS]: "admin/instruction/:instructionId",
        },
      },

      [ROUTES.NOTIFICATIONS]: "notifications",
      [ROUTES.SETTINGS]: "settings",
      [ROUTES.INSTRUCTION_DETAILS]: "instructions/:instructionId",
      [ROUTES.AUDIT_TRAIL]: "audit/:historyId",
    },
  },
};

export default linking;
