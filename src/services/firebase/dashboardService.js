import { getAllRequests } from "./requestService";
import { getAllInstructions } from "./instructionService";
import { getAllUsers } from "./userService";

export const getDashboardSummary = async () => {
  const [requests, instructions, users] = await Promise.all([
    getAllRequests(),
    getAllInstructions(),
    getAllUsers(),
  ]);

  const pendingApprovals = requests.filter(
    (item) => String(item.status).toLowerCase() === "pending",
  ).length;

  const completedInstructions = instructions.filter(
    (item) => String(item.status).toLowerCase() === "completed",
  ).length;

  return {
    totalRequests: requests.length,
    pendingApprovals,
    completedInstructions,
    totalUsers: users.length,
  };
};
