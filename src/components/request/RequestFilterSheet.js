import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AppButton from "../common/AppButton";

const campuses = ["All", "Banasree", "Malibag", "Mohammadpur"];
const shifts = ["All", "A", "B", "C", "Old", "New", "Day", "Morning"];
const statuses = ["All", "Pending", "Approved", "Completed", "Rejected"];

export default function RequestFilterSheet({
  selectedCampus,
  selectedShift,
  selectedStatus,
  onSelectCampus,
  onSelectShift,
  onSelectStatus,
  onApply,
  onReset,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Filter Requests</Text>

      <FilterGroup
        title="Campus"
        options={campuses}
        selected={selectedCampus}
        onSelect={onSelectCampus}
      />

      <FilterGroup
        title="Shift"
        options={shifts}
        selected={selectedShift}
        onSelect={onSelectShift}
      />

      <FilterGroup
        title="Status"
        options={statuses}
        selected={selectedStatus}
        onSelect={onSelectStatus}
      />

      <View style={styles.actionRow}>
        <TouchableOpacity onPress={onReset} style={styles.resetBtn}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>

        <View style={styles.applyWrap}>
          <AppButton title="Apply Filters" onPress={onApply} />
        </View>
      </View>
    </View>
  );
}

function FilterGroup({ title, options, selected, onSelect }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.optionsWrap}>
        {options.map((option) => {
          const active = selected === option;
          return (
            <TouchableOpacity
              key={option}
              style={[styles.optionChip, active && styles.activeChip]}
              onPress={() => onSelect(option)}
              activeOpacity={0.85}
            >
              <Text style={[styles.optionText, active && styles.activeText]}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
  },
  heading: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 14,
  },
  group: {
    marginBottom: 18,
  },
  groupTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 10,
  },
  optionsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionChip: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  activeChip: {
    backgroundColor: "#EEF4FF",
    borderColor: "#4F46E5",
  },
  optionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  activeText: {
    color: "#4338CA",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  resetBtn: {
    paddingVertical: 12,
    paddingRight: 14,
  },
  resetText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748B",
  },
  applyWrap: {
    flex: 1,
  },
});
