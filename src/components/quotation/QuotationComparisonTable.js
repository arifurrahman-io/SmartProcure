import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function QuotationComparisonTable({
  quotations = [],
  selectedId,
  onSelect,
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.wrapper}>
        <View style={[styles.row, styles.headerRow]}>
          <Cell text="Vendor" header />
          <Cell text="Amount" header />
          <Cell text="Delivery" header />
          <Cell text="Warranty" header />
          <Cell text="Select" header />
        </View>

        {quotations.map((item) => {
          const active = selectedId === item.id;

          return (
            <View key={item.id} style={styles.row}>
              <Cell text={item.vendorName} />
              <Cell text={item.amount} />
              <Cell text={item.deliveryTime} />
              <Cell text={item.warranty} />
              <View style={[styles.cell, styles.selectCell]}>
                <TouchableOpacity
                  style={[styles.selectBtn, active && styles.activeBtn]}
                  onPress={() => onSelect?.(item.id)}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[styles.selectText, active && styles.activeText]}
                  >
                    {active ? "Selected" : "Choose"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

function Cell({ text, header = false }) {
  return (
    <View style={styles.cell}>
      <Text
        style={[styles.cellText, header && styles.headerText]}
        numberOfLines={2}
      >
        {text || "-"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    minWidth: 720,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerRow: {
    backgroundColor: "#F8FAFC",
  },
  cell: {
    width: 144,
    paddingHorizontal: 12,
    paddingVertical: 14,
    justifyContent: "center",
  },
  selectCell: {
    alignItems: "flex-start",
  },
  cellText: {
    fontSize: 13,
    color: "#334155",
  },
  headerText: {
    fontWeight: "700",
    color: "#0F172A",
  },
  selectBtn: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  activeBtn: {
    backgroundColor: "#EEF4FF",
    borderColor: "#4F46E5",
  },
  selectText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },
  activeText: {
    color: "#4338CA",
  },
});
