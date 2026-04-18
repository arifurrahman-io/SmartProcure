import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import EmptyState from "../../components/common/EmptyState";
import AppLoader from "../../components/common/AppLoader";
import AppButton from "../../components/common/AppButton";
import AppInput from "../../components/common/AppInput";
import StatusBadge from "../../components/common/StatusBadge";

import { createUserAsAdmin } from "../../services/auth/authService";
import {
  createUserProfile,
  getAllUsers,
  setUserRole,
  disableUser,
  enableUser,
  softDeleteUserProfile,
  updateUserProfile,
} from "../../services/firebase/userService";

import useAuthStore from "../../store/useAuthStore";
import { getRoleLabel, isAdminRole } from "../../utils/roleHelpers";
import { getErrorMessage } from "../../utils/errorHandler";

const INITIAL_MEMBER_FORM = {
  name: "",
  email: "",
  password: "",
  role: "member",
  campus: "",
  shift: "",
  designation: "",
  phoneNumber: "",
};

const ROLE_OPTIONS = ["member", "staff", "admin"];

const buildMemberForm = (user = {}) => ({
  name: user.name || "",
  email: user.email || "",
  password: "",
  role: user.rawRole || user.role || "member",
  campus: user.campus === "-" ? "" : user.campus || "",
  shift: user.shift === "-" ? "" : user.shift || "",
  designation: user.designation || "",
  phoneNumber: user.phoneNumber || "",
});

function UserCard({
  item,
  currentUserId,
  onEditUser,
  onMakeAdmin,
  onRemoveAdmin,
  onDisableUser,
  onEnableUser,
  onDeleteUser,
  actionLoadingId,
}) {
  const isCurrentUser = String(item.id) === String(currentUserId);
  const isAdmin = isAdminRole(item.rawRole);
  const isDeleted = String(item.status || "").toLowerCase() === "deleted";
  const isDisabled =
    String(item.status || "").toLowerCase() === "disabled" || item.disabled;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.content}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.email}>{item.email}</Text>

          <View style={styles.metaWrap}>
            <Text style={styles.meta}>Role: {item.role}</Text>
            <Text style={styles.meta}>Campus: {item.campus}</Text>
          </View>
        </View>

        <StatusBadge
          status={
            isDeleted
              ? "Deleted"
              : isDisabled
                ? "Disabled"
                : item.status || "Active"
          }
        />
      </View>

      <View style={styles.actions}>
        {!isCurrentUser ? (
          <>
            <View style={styles.actionItem}>
              <AppButton
                title="Edit Member"
                onPress={() => onEditUser(item)}
                style={styles.neutralAction}
              />
            </View>

            {isAdmin ? (
              <View style={styles.actionItem}>
                <AppButton
                  title={
                    actionLoadingId === `remove-admin-${item.id}`
                      ? "Removing..."
                      : "Remove Admin"
                  }
                  onPress={() => onRemoveAdmin(item)}
                  loading={actionLoadingId === `remove-admin-${item.id}`}
                  style={styles.secondaryAction}
                />
              </View>
            ) : (
              <View style={styles.actionItem}>
                <AppButton
                  title={
                    actionLoadingId === `make-admin-${item.id}`
                      ? "Updating..."
                      : "Make Admin"
                  }
                  onPress={() => onMakeAdmin(item)}
                  loading={actionLoadingId === `make-admin-${item.id}`}
                />
              </View>
            )}

            {isDisabled ? (
              <View style={styles.actionItem}>
                <AppButton
                  title={
                    actionLoadingId === `enable-${item.id}`
                      ? "Enabling..."
                      : "Enable User"
                  }
                  onPress={() => onEnableUser(item)}
                  loading={actionLoadingId === `enable-${item.id}`}
                />
              </View>
            ) : (
              <View style={styles.actionItem}>
                <AppButton
                  title={
                    actionLoadingId === `disable-${item.id}`
                      ? "Removing..."
                      : "Remove User"
                  }
                  onPress={() => onDisableUser(item)}
                  loading={actionLoadingId === `disable-${item.id}`}
                  style={styles.dangerAction}
                />
              </View>
            )}

            <View style={styles.actionItem}>
              <AppButton
                title={
                  actionLoadingId === `delete-${item.id}`
                    ? "Deleting..."
                    : "Delete Member"
                }
                onPress={() => onDeleteUser(item)}
                loading={actionLoadingId === `delete-${item.id}`}
                style={styles.deleteAction}
              />
            </View>
          </>
        ) : (
          <Text style={styles.selfNote}>
            You cannot modify your own account here.
          </Text>
        )}
      </View>
    </View>
  );
}

export default function UserManagementScreen({ navigation }) {
  const profile = useAuthStore((state) => state.profile);

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [memberModalVisible, setMemberModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [memberForm, setMemberForm] = useState(INITIAL_MEMBER_FORM);

  const currentUserId = profile?.id || profile?.uid || null;
  const currentUserName =
    profile?.name || profile?.displayName || profile?.email || "Admin";

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllUsers();
      setUsers(data || []);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load users"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await fetchUsers();
    } finally {
      setRefreshing(false);
    }
  }, [fetchUsers]);

  const mappedUsers = useMemo(() => {
    return (users || []).map((item) => ({
      id: item.id,
      name: item.name || item.displayName || "Unnamed User",
      email: item.email || "-",
      role: getRoleLabel(item.role),
      rawRole: item.role || "staff",
      campus: item.campus || "-",
      shift: item.shift || "-",
      designation: item.designation || "",
      phoneNumber: item.phoneNumber || "",
      status: item.status || "active",
      disabled: !!item.disabled,
    }));
  }, [users]);

  const runUserAction = async (loadingKey, actionFn, successMessage) => {
    try {
      setActionLoadingId(loadingKey);
      await actionFn();
      await fetchUsers();
      Alert.alert("Success", successMessage);
    } catch (err) {
      Alert.alert(
        "Action failed",
        getErrorMessage(err, "Failed to update user"),
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const openAddMemberModal = () => {
    setEditingUser(null);
    setMemberForm(INITIAL_MEMBER_FORM);
    setMemberModalVisible(true);
  };

  const openEditMemberModal = (user) => {
    setEditingUser(user);
    setMemberForm(buildMemberForm(user));
    setMemberModalVisible(true);
  };

  const closeMemberModal = () => {
    setMemberModalVisible(false);
    setEditingUser(null);
    setMemberForm(INITIAL_MEMBER_FORM);
  };

  const updateMemberForm = (field, value) => {
    setMemberForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateMemberForm = () => {
    if (!memberForm.name.trim()) {
      return "Member name is required.";
    }

    if (!memberForm.email.trim()) {
      return "Email address is required.";
    }

    if (!editingUser && memberForm.password.trim().length < 6) {
      return "Password must be at least 6 characters.";
    }

    return null;
  };

  const handleSaveMember = async () => {
    const validationMessage = validateMemberForm();

    if (validationMessage) {
      Alert.alert("Missing information", validationMessage);
      return;
    }

    const safeEmail = memberForm.email.trim().toLowerCase();
    const profilePayload = {
      name: memberForm.name.trim(),
      email: safeEmail,
      role: memberForm.role || "member",
      campus: memberForm.campus.trim(),
      shift: memberForm.shift.trim(),
      designation: memberForm.designation.trim(),
      phoneNumber: memberForm.phoneNumber.trim(),
      status: "active",
      disabled: false,
      updatedBy: currentUserName,
    };

    const loadingKey = editingUser
      ? `edit-${editingUser.id}`
      : "create-member";

    try {
      setActionLoadingId(loadingKey);

      if (editingUser) {
        await updateUserProfile(editingUser.id, profilePayload);
      } else {
        const authUser = await createUserAsAdmin({
          email: safeEmail,
          password: memberForm.password,
          displayName: memberForm.name,
        });

        await createUserProfile(authUser.uid, {
          ...profilePayload,
          id: authUser.uid,
          uid: authUser.uid,
          createdBy: currentUserName,
        });
      }

      await fetchUsers();
      closeMemberModal();
      Alert.alert(
        "Success",
        editingUser ? "Member updated successfully." : "Member added successfully.",
      );
    } catch (err) {
      Alert.alert(
        editingUser ? "Update failed" : "Create failed",
        getErrorMessage(err, "Unable to save member"),
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleMakeAdmin = (user) => {
    Alert.alert(
      "Make Admin",
      `Are you sure you want to make ${user.name} an admin?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () =>
            runUserAction(
              `make-admin-${user.id}`,
              () => setUserRole(user.id, "admin", currentUserName),
              `${user.name} is now an admin.`,
            ),
        },
      ],
    );
  };

  const handleRemoveAdmin = (user) => {
    Alert.alert(
      "Remove Admin",
      `Are you sure you want to remove admin access from ${user.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () =>
            runUserAction(
              `remove-admin-${user.id}`,
              () => setUserRole(user.id, "staff", currentUserName),
              `${user.name} is no longer an admin.`,
            ),
        },
      ],
    );
  };

  const handleDisableUser = (user) => {
    Alert.alert(
      "Remove User",
      `This will disable ${user.name}'s access in the app. Continue?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: "destructive",
          onPress: () =>
            runUserAction(
              `disable-${user.id}`,
              () => disableUser(user.id, currentUserName),
              `${user.name} has been removed from active access.`,
            ),
        },
      ],
    );
  };

  const handleEnableUser = (user) => {
    Alert.alert("Enable User", `Restore ${user.name}'s access?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        onPress: () =>
          runUserAction(
            `enable-${user.id}`,
            () => enableUser(user.id, currentUserName),
            `${user.name} has been enabled again.`,
          ),
      },
    ]);
  };

  const handleDeleteUser = (user) => {
    Alert.alert(
      "Delete Member",
      `This will delete ${user.name}'s app access. Continue?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            runUserAction(
              `delete-${user.id}`,
              () => softDeleteUserProfile(user.id, currentUserName),
              `${user.name} has been deleted from active access.`,
            ),
        },
      ],
    );
  };

  if (isLoading && users.length === 0) {
    return (
      <ScreenWrapper>
        <AppHeader title="User Management" onBack={() => navigation.goBack()} />
        <AppLoader />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <AppHeader title="User Management" onBack={() => navigation.goBack()} />

      <View style={styles.headerActions}>
        <AppButton
          title={
            actionLoadingId === "create-member"
              ? "Adding..."
              : "Add Member"
          }
          onPress={openAddMemberModal}
          loading={actionLoadingId === "create-member"}
        />
      </View>

      <FlatList
        data={mappedUsers}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={Boolean(refreshing)}
            onRefresh={handleRefresh}
          />
        }
        renderItem={({ item }) => (
          <UserCard
            item={item}
            currentUserId={currentUserId}
            onEditUser={openEditMemberModal}
            onMakeAdmin={handleMakeAdmin}
            onRemoveAdmin={handleRemoveAdmin}
            onDisableUser={handleDisableUser}
            onEnableUser={handleEnableUser}
            onDeleteUser={handleDeleteUser}
            actionLoadingId={actionLoadingId}
          />
        )}
        ListEmptyComponent={
          error ? (
            <EmptyState text={error} />
          ) : (
            <EmptyState text="No users found" />
          )
        }
        contentContainerStyle={styles.contentContainer}
      />

      <MemberFormModal
        visible={memberModalVisible}
        editing={Boolean(editingUser)}
        form={memberForm}
        loading={
          actionLoadingId === "create-member" ||
          actionLoadingId === `edit-${editingUser?.id}`
        }
        onChange={updateMemberForm}
        onClose={closeMemberModal}
        onSave={handleSaveMember}
      />
    </ScreenWrapper>
  );
}

function MemberFormModal({
  visible,
  editing,
  form,
  loading,
  onChange,
  onClose,
  onSave,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>
            {editing ? "Edit Member" : "Add Member"}
          </Text>
          <Text style={styles.modalSubtitle}>
            {editing
              ? "Update member profile, role, campus, and contact details."
              : "Create login access and a SmartProcure member profile."}
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <AppInput
              label="Full Name"
              value={form.name}
              onChangeText={(value) => onChange("name", value)}
              placeholder="Enter member name"
            />

            <AppInput
              label="Email Address"
              value={form.email}
              onChangeText={(value) => onChange("email", value)}
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {!editing ? (
              <AppInput
                label="Temporary Password"
                value={form.password}
                onChangeText={(value) => onChange("password", value)}
                placeholder="Minimum 6 characters"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            ) : null}

            <Text style={styles.fieldLabel}>Role</Text>
            <View style={styles.roleRow}>
              {ROLE_OPTIONS.map((role) => {
                const active = form.role === role;

                return (
                  <TouchableOpacity
                    key={role}
                    style={[styles.roleChip, active && styles.roleChipActive]}
                    onPress={() => onChange("role", role)}
                    activeOpacity={0.85}
                  >
                    <Text
                      style={[
                        styles.roleChipText,
                        active && styles.roleChipTextActive,
                      ]}
                    >
                      {getRoleLabel(role)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <AppInput
              label="Campus"
              value={form.campus}
              onChangeText={(value) => onChange("campus", value)}
              placeholder="Enter campus"
            />

            <AppInput
              label="Shift"
              value={form.shift}
              onChangeText={(value) => onChange("shift", value)}
              placeholder="Enter shift"
            />

            <AppInput
              label="Designation"
              value={form.designation}
              onChangeText={(value) => onChange("designation", value)}
              placeholder="Enter designation"
            />

            <AppInput
              label="Phone Number"
              value={form.phoneNumber}
              onChangeText={(value) => onChange("phoneNumber", value)}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.85}
              disabled={loading}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <View style={styles.saveButtonWrap}>
              <AppButton
                title={editing ? "Save Changes" : "Add Member"}
                onPress={onSave}
                loading={loading}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  headerActions: {
    marginBottom: 14,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    ...Platform.select({
      web: {
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
      },
      default: {
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
      },
    }),
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
  email: {
    marginTop: 5,
    fontSize: 13,
    color: "#64748B",
  },
  metaWrap: {
    marginTop: 12,
    gap: 6,
  },
  meta: {
    fontSize: 12,
    color: "#475569",
  },
  actions: {
    marginTop: 14,
    gap: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  actionItem: {
    flexBasis: "48%",
    flexGrow: 1,
  },
  neutralAction: {
    backgroundColor: "#2563EB",
  },
  secondaryAction: {
    backgroundColor: "#F59E0B",
  },
  dangerAction: {
    backgroundColor: "#DC2626",
  },
  deleteAction: {
    backgroundColor: "#7F1D1D",
  },
  selfNote: {
    fontSize: 12,
    color: "#64748B",
    fontStyle: "italic",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    maxHeight: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 18,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },
  modalSubtitle: {
    marginTop: 6,
    marginBottom: 16,
    fontSize: 13,
    lineHeight: 20,
    color: "#64748B",
  },
  fieldLabel: {
    marginBottom: 8,
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
  },
  roleRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  roleChip: {
    flex: 1,
    minHeight: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  roleChipActive: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  roleChipText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#64748B",
  },
  roleChipTextActive: {
    color: "#1D4ED8",
  },
  modalActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 14,
  },
  cancelButton: {
    minHeight: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#64748B",
  },
  saveButtonWrap: {
    flex: 1,
  },
});
