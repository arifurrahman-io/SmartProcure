import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";

import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import EmptyState from "../../components/common/EmptyState";
import AppLoader from "../../components/common/AppLoader";
import StatusBadge from "../../components/common/StatusBadge";

import { getAllUsers } from "../../services/firebase/userService";
import { getRoleLabel } from "../../utils/roleHelpers";
import { getErrorMessage } from "../../utils/errorHandler";

function UserCard({ item }) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.content}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.email}>{item.email}</Text>
        </View>

        <StatusBadge status={item.status} />
      </View>

      <View style={styles.metaWrap}>
        <Text style={styles.meta}>Role: {item.role}</Text>
        <Text style={styles.meta}>Campus: {item.campus}</Text>
      </View>
    </View>
  );
}

export default function UserManagementScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const mappedUsers = useMemo(() => {
    return (users || []).map((item) => ({
      id: item.id,
      name: item.name || item.displayName || "Unnamed User",
      email: item.email || "-",
      role: getRoleLabel(item.role),
      campus: item.campus || "-",
      status: item.status || "Approved",
    }));
  }, [users]);

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

      <FlatList
        data={mappedUsers}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        onRefresh={fetchUsers}
        refreshing={isLoading}
        renderItem={({ item }) => <UserCard item={item} />}
        ListEmptyComponent={<EmptyState text={error || "No users found"} />}
        contentContainerStyle={styles.contentContainer}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#EEF2F7",
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
});
