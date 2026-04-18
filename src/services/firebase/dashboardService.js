import { getAllRequests } from "./requestService";
import { getAllInstructions } from "./instructionService";
import { getAllUsers } from "./userService";
import { isPendingApprovalStatus } from "../../constants/requestStatus";

const isPermissionDenied = (error) => error?.code === "permission-denied";

const getCollectionForSummary = async (loader) => {
  try {
    return await loader();
  } catch (error) {
    if (isPermissionDenied(error)) {
      return [];
    }

    throw error;
  }
};

const getUsersForSummary = async (includeUsers) => {
  if (!includeUsers) return [];

  return getCollectionForSummary(getAllUsers);
};

export const getDashboardSummary = async ({ includeUsers = false } = {}) => {
  const [requests, instructions, users] = await Promise.all([
    getCollectionForSummary(getAllRequests),
    getCollectionForSummary(getAllInstructions),
    getUsersForSummary(includeUsers),
  ]);

  const pendingApprovals = requests.filter((item) =>
    isPendingApprovalStatus(item.status),
  ).length;

  const completedInstructions = instructions.filter(
    (item) => String(item.status).toLowerCase() === "completed",
  ).length;

  const activeInstructions = instructions.filter(
    (item) => String(item.status).toLowerCase() !== "completed",
  ).length;

  return {
    totalRequests: requests.length,
    pendingApprovals,
    completedInstructions,
    activeInstructions,
    totalUsers: users.length,
  };
};
