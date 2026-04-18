import { useMemo, useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import SearchBar from "../../components/common/SearchBar";
import EmptyState from "../../components/common/EmptyState";
import AppLoader from "../../components/common/AppLoader";
import RequestCard from "../../components/request/RequestCard";

import ROUTES from "../../navigation/routes";
import useRequests from "../../hooks/useRequests";
import useDebounce from "../../hooks/useDebounce";
import { filterRequests, getRequestAuthor } from "../../utils/requestHelpers";
import { formatDate } from "../../utils/formatDate";

const STATUS_FILTERS = [
  "All",
  "Pending",
  "Approved",
  "Quotation Received",
  "Completed",
];

const normalizeStatus = (status) =>
  String(status || "")
    .replace(/_/g, " ")
    .trim()
    .toLowerCase();

const getStatusCount = (requests, status) => {
  if (status === "All") return requests.length;

  const target = normalizeStatus(status);
  return requests.filter((item) => normalizeStatus(item.status) === target)
    .length;
};

export default function RequestListScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const debouncedSearch = useDebounce(search, 300);

  const { requests, loading, refreshRequests } = useRequests(true);

  const isLoading = Boolean(loading);

  const mappedRequests = useMemo(() => {
    return (requests || []).map((item) => {
      const author = getRequestAuthor(item) || {};

      return {
        id: item.id,
        itemName: item.itemName || item.title || "Untitled Request",
        category: item.category || "Uncategorized",
        campus: item.campus || "-",
        shift: item.shift || "-",
        requester: author.name || "Unknown",
        date: formatDate(item.createdAt),
        status: item.status || "Pending",
        urgency: item.urgency || item.priority || "Medium",
        quotationCount: item.quotationCount || 0,
        rawStatus: item.status || "Pending",
      };
    });
  }, [requests]);

  const summary = useMemo(() => {
    const pending = mappedRequests.filter(
      (item) => normalizeStatus(item.rawStatus) === "pending",
    ).length;
    const approved = mappedRequests.filter(
      (item) => normalizeStatus(item.rawStatus) === "approved",
    ).length;
    const completed = mappedRequests.filter(
      (item) => normalizeStatus(item.rawStatus) === "completed",
    ).length;

    return {
      total: mappedRequests.length,
      pending,
      approved,
      completed,
    };
  }, [mappedRequests]);

  const filteredRequests = useMemo(() => {
    const searchedRequests = filterRequests(mappedRequests, {
      search: debouncedSearch,
      campus: "All",
      shift: "All",
      status: "All",
    });

    if (selectedStatus === "All") return searchedRequests;

    const targetStatus = normalizeStatus(selectedStatus);

    return searchedRequests.filter(
      (item) => normalizeStatus(item.rawStatus) === targetStatus,
    );
  }, [mappedRequests, debouncedSearch, selectedStatus]);

  if (isLoading && (!requests || requests.length === 0)) {
    return (
      <ScreenWrapper>
        <AppHeader title="All Requests" onBack={() => navigation.goBack()} />
        <AppLoader />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <AppHeader title="All Requests" onBack={() => navigation.goBack()} />

      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.eyebrow}>Requests</Text>
            <Text style={styles.heroTitle}>{summary.total} total</Text>
          </View>

          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate(ROUTES.CREATE_REQUEST)}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.createButtonText}>New</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{summary.pending}</Text>
            <Text style={styles.summaryLabel}>Pending</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{summary.approved}</Text>
            <Text style={styles.summaryLabel}>Approved</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{summary.completed}</Text>
            <Text style={styles.summaryLabel}>Completed</Text>
          </View>
        </View>
      </View>

      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Search item, category, or campus"
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContent}
        style={styles.filterWrap}
      >
        {STATUS_FILTERS.map((status) => {
          const isActive = selectedStatus === status;
          const count = getStatusCount(mappedRequests, status);

          return (
            <TouchableOpacity
              key={status}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setSelectedStatus(status)}
              activeOpacity={0.85}
            >
              <Text
                style={[styles.filterText, isActive && styles.filterTextActive]}
              >
                {status}
              </Text>
              <Text
                style={[
                  styles.filterCount,
                  isActive && styles.filterCountActive,
                ]}
              >
                {count}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Latest requests</Text>
        <Text style={styles.listCount}>{filteredRequests.length} found</Text>
      </View>

      <FlatList
        data={filteredRequests}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        onRefresh={refreshRequests}
        refreshing={isLoading}
        renderItem={({ item }) => (
          <RequestCard
            {...item}
            onPress={() =>
              navigation.navigate(ROUTES.REQUEST_DETAILS, {
                requestId: item.id,
              })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState text="No requests match your current view" />
        }
        contentContainerStyle={styles.listContent}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: "#0F172A",
    borderRadius: 8,
    padding: 16,
    marginBottom: 14,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  eyebrow: {
    color: "#A7F3D0",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  heroTitle: {
    marginTop: 4,
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
  },
  createButton: {
    minHeight: 40,
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  summaryRow: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.14)",
    paddingTop: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  summaryItem: {
    flex: 1,
  },
  summaryValue: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  summaryLabel: {
    marginTop: 2,
    color: "#CBD5E1",
    fontSize: 12,
    fontWeight: "600",
  },
  summaryDivider: {
    width: 1,
    height: 34,
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    marginHorizontal: 12,
  },
  filterWrap: {
    flexGrow: 0,
    marginBottom: 14,
  },
  filterContent: {
    gap: 8,
    paddingRight: 4,
  },
  filterChip: {
    minHeight: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  filterChipActive: {
    backgroundColor: "#ECFDF5",
    borderColor: "#10B981",
  },
  filterText: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "700",
  },
  filterTextActive: {
    color: "#047857",
  },
  filterCount: {
    minWidth: 22,
    overflow: "hidden",
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    color: "#64748B",
    paddingHorizontal: 6,
    paddingVertical: 2,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "800",
  },
  filterCountActive: {
    backgroundColor: "#D1FAE5",
    color: "#047857",
  },
  listHeader: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listTitle: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "800",
  },
  listCount: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
  },
  listContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
});
