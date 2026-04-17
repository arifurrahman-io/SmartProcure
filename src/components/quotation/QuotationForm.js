import { View, StyleSheet } from "react-native";
import AppInput from "../common/AppInput";

export default function QuotationForm({ values, onChange }) {
  return (
    <View style={styles.container}>
      <AppInput
        label="Vendor Name"
        placeholder="Enter vendor name"
        value={values.vendorName}
        onChangeText={(text) => onChange("vendorName", text)}
      />

      <AppInput
        label="Vendor Contact"
        placeholder="Enter vendor contact"
        value={values.vendorContact}
        onChangeText={(text) => onChange("vendorContact", text)}
      />

      <AppInput
        label="Quoted Amount"
        placeholder="Enter amount"
        value={values.amount}
        onChangeText={(text) => onChange("amount", text)}
      />

      <AppInput
        label="Brand / Specification"
        placeholder="Enter product brand or specification"
        value={values.specification}
        onChangeText={(text) => onChange("specification", text)}
      />

      <AppInput
        label="Delivery Time"
        placeholder="e.g. 3 days"
        value={values.deliveryTime}
        onChangeText={(text) => onChange("deliveryTime", text)}
      />

      <AppInput
        label="Warranty"
        placeholder="e.g. 1 year"
        value={values.warranty}
        onChangeText={(text) => onChange("warranty", text)}
      />

      <AppInput
        label="Remarks"
        placeholder="Additional notes"
        value={values.notes}
        onChangeText={(text) => onChange("notes", text)}
        multiline
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
});
