import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import RequestForm from "../../components/request/RequestForm";
import AppButton from "../../components/common/AppButton";

export default function EditRequestScreen({ navigation, route }) {
  const requestId = route?.params?.requestId;

  const [values, setValues] = useState({
    title: "Printer Toner Purchase",
    itemName: "Printer Toner",
    category: "Office Supplies",
    campus: "Banasree",
    shift: "Morning",
    quantity: "5",
    budget: "15000",
    reason: "Urgent need for exam printing.",
    neededBy: "25 Apr 2026",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      console.log("Update request:", requestId, values);

      navigation.goBack();
    } catch (error) {
      console.log("Update request error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <AppHeader title="Edit Request" onBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <RequestForm values={values} onChange={handleChange} />

        <AppButton
          title="Update Request"
          onPress={handleUpdate}
          loading={loading}
          style={styles.button}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 8,
    marginBottom: 20,
  },
});
