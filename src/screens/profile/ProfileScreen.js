import { ScrollView, StyleSheet, Text } from "react-native";

import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileMenuItem from "../../components/profile/ProfileMenuItem";
import LogoutButton from "../../components/profile/LogoutButton";
import EmptyState from "../../components/common/EmptyState";
import AppLoader from "../../components/common/AppLoader";

import ROUTES from "../../navigation/routes";
import useAuth from "../../hooks/useAuth";
import useUserRole from "../../hooks/useUserRole";
import { getRoleLabel } from "../../utils/roleHelpers";
import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from "../../utils/toast";

export default function ProfileScreen({ navigation }) {
  const { profile, isLoading, logout } = useAuth();
  const { isAdmin, isMember } = useUserRole();

  const handleBack = navigation.canGoBack() ? () => navigation.goBack() : null;

  const navigateToRequestScreen = (screen, params) => {
    navigation.navigate(ROUTES.REQUESTS, {
      screen,
      params,
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      showSuccessToast("Logged out", "You have been signed out successfully");
    } catch (error) {
      showErrorToast("Logout Failed", error?.message || "Please try again");
    }
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <AppHeader title="Profile" onBack={handleBack} />
        <AppLoader />
      </ScreenWrapper>
    );
  }

  if (!profile) {
    return (
      <ScreenWrapper>
        <AppHeader title="Profile" onBack={handleBack} />
        <EmptyState text="User profile not found" />
      </ScreenWrapper>
    );
  }

  const displayName = profile?.name || profile?.displayName || "User";
  const roleLabel = getRoleLabel(profile?.role);
  const campusLabel = profile?.campus || "Campus not set";
  const statusLabel = profile?.disabled
    ? "Disabled"
    : profile?.status || "Active";
  const profileSubtitle = isAdmin
    ? "Manage procurement approvals, users, and reports"
    : isMember
      ? "Create requests and track your procurement activity"
      : "Review your procurement profile and app access";

  return (
    <ScreenWrapper>
      <AppHeader title="Profile" onBack={handleBack} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <ProfileHeader
          name={displayName}
          email={profile?.email || "-"}
          role={roleLabel}
          campus={campusLabel}
        />

        <Text style={styles.sectionTitle}>Account</Text>

        <ProfileMenuItem
          title="Settings"
          subtitle="Profile, password, theme and notification preferences"
          icon="settings-outline"
          onPress={() => navigation.navigate(ROUTES.SETTINGS)}
        />

        <ProfileMenuItem
          title="Notifications"
          subtitle="View all recent alerts and updates"
          icon="notifications-outline"
          onPress={() => navigation.navigate(ROUTES.NOTIFICATIONS)}
        />

        <ProfileMenuItem
          title="Account Status"
          subtitle={profileSubtitle}
          icon="shield-checkmark-outline"
          rightText={statusLabel}
        />

        {isAdmin ? (
          <>
            <Text style={styles.sectionTitle}>Admin Tools</Text>

            <ProfileMenuItem
              title="Pending Approvals"
              subtitle="Review requests waiting for admin decision"
              icon="checkmark-done-outline"
              onPress={() => navigation.navigate(ROUTES.PENDING_APPROVALS)}
            />

            <ProfileMenuItem
              title="User Management"
              subtitle="Add, edit, disable, or promote members"
              icon="people-outline"
              onPress={() => navigation.navigate(ROUTES.USER_MANAGEMENT)}
            />

            <ProfileMenuItem
              title="Reports"
              subtitle="Review procurement totals and campus insights"
              icon="bar-chart-outline"
              onPress={() => navigation.navigate(ROUTES.REPORTS)}
            />

            <ProfileMenuItem
              title="All Requests"
              subtitle="Search and review every procurement request"
              icon="documents-outline"
              onPress={() => navigateToRequestScreen(ROUTES.REQUEST_LIST)}
            />
          </>
        ) : isMember ? (
          <>
            <Text style={styles.sectionTitle}>Member Actions</Text>

            <ProfileMenuItem
              title="New Request"
              subtitle="Create a procurement request"
              icon="add-circle-outline"
              onPress={() => navigateToRequestScreen(ROUTES.CREATE_REQUEST)}
            />

            <ProfileMenuItem
              title="My Requests"
              subtitle="See requests you have submitted"
              icon="folder-open-outline"
              onPress={() => navigateToRequestScreen(ROUTES.MY_REQUESTS)}
            />

            <ProfileMenuItem
              title="All Requests"
              subtitle="Track request status and quotation progress"
              icon="documents-outline"
              onPress={() => navigateToRequestScreen(ROUTES.REQUEST_LIST)}
            />
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Access</Text>

            <ProfileMenuItem
              title="Role Review Needed"
              subtitle="Ask an admin to assign your member access"
              icon="alert-circle-outline"
              rightText="Limited"
            />
          </>
        )}

        <Text style={styles.sectionTitle}>Workspace</Text>

        <ProfileMenuItem
          title="Instructions"
          subtitle="Open active purchase instructions"
          icon="clipboard-outline"
          onPress={() => navigation.navigate(ROUTES.INSTRUCTIONS)}
        />

        <ProfileMenuItem
          title="Purchase History"
          subtitle="Completed and archived procurements"
          icon="time-outline"
          onPress={() => navigation.navigate(ROUTES.HISTORY)}
        />

        <ProfileMenuItem
          title="Help & Support"
          subtitle={
            isAdmin
              ? "Get help with system administration"
              : "Contact your admin for account or procurement help"
          }
          icon="help-circle-outline"
          onPress={() =>
            showInfoToast(
              "Support",
              isAdmin
                ? "Please contact the SmartProcure support team"
                : "Please contact your system admin",
            )
          }
        />

        {!isAdmin ? (
          <ProfileMenuItem
            title="Request Account Removal"
            subtitle="Ask an admin to remove your app access"
            icon="trash-outline"
            danger
            onPress={() =>
              showInfoToast(
                "Admin Required",
                "Contact an admin to request account removal",
              )
            }
          />
        ) : null}

        <LogoutButton onPress={handleLogout} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
  },
  sectionTitle: {
    marginTop: 6,
    marginBottom: 10,
    fontSize: 13,
    fontWeight: "800",
    color: "#475569",
    textTransform: "uppercase",
  },
});
