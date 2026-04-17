import { FlatList, View, Text, StyleSheet } from "react-native";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";

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
  const users = [
    {
      id: "1",
      name: "Arifur Rahman",
      email: "arifur@email.com",
      role: "Admin",
      campus: "Banasree",
      status: "Approved",
    },
    {
      id: "2",
      name: "Nayeem Hasan",
      email: "nayeem@email.com",
      role: "Member",
      campus: "Malibag",
      status: "Approved",
    },
    {
      id: "3",
      name: "Rahim Uddin",
      email: "rahim@email.com",
      role: "Member",
      campus: "Mohammadpur",
      status: "Pending",
    },
  ];

  return (
    <ScreenWrapper>
      <AppHeader title="User Management" onBack={() => navigation.goBack()} />

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <UserCard item={item} />}
        ListEmptyComponent={<EmptyState text="No users found" />}
        contentContainerStyle={styles.content}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 20,
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
