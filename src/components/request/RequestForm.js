import { View, StyleSheet } from "react-native";
import AppInput from "../common/AppInput";

export default function RequestForm({ values, onChange }) {
  return (
    <View style={styles.container}>
      <AppInput
        label="Request Title"
        placeholder="Enter request title"
        value={values.title}
        onChangeText={(text) => onChange("title", text)}
      />

      <AppInput
        label="Item Name"
        placeholder="Enter item name"
        value={values.itemName}
        onChangeText={(text) => onChange("itemName", text)}
      />

      <AppInput
        label="Category"
        placeholder="e.g. IT Equipment"
        value={values.category}
        onChangeText={(text) => onChange("category", text)}
      />

      <AppInput
        label="Campus"
        placeholder="e.g. Banasree"
        value={values.campus}
        onChangeText={(text) => onChange("campus", text)}
      />

      <AppInput
        label="Shift"
        placeholder="e.g. Morning"
        value={values.shift}
        onChangeText={(text) => onChange("shift", text)}
      />

      <AppInput
        label="Quantity"
        placeholder="Enter quantity"
        value={values.quantity}
        onChangeText={(text) => onChange("quantity", text)}
      />

      <AppInput
        label="Estimated Budget"
        placeholder="Enter estimated budget"
        value={values.budget}
        onChangeText={(text) => onChange("budget", text)}
      />

      <AppInput
        label="Purpose / Reason"
        placeholder="Why is this needed?"
        value={values.reason}
        onChangeText={(text) => onChange("reason", text)}
      />

      <AppInput
        label="Needed By Date"
        placeholder="e.g. 25 Apr 2026"
        value={values.neededBy}
        onChangeText={(text) => onChange("neededBy", text)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
});
