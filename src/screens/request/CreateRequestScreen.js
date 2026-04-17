import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import RequestForm from "../../components/request/RequestForm";
import AppButton from "../../components/common/AppButton";

export default function CreateRequestScreen({ navigation }) {
  const [values, setValues] = useState({
    title: "",
    itemName: "",
    category: "",
    campus: "",
    shift: "",
    quantity: "",
    budget: "",
    reason: "",
    neededBy: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      console.log("Create request:", values);

      navigation.goBack();
    } catch (error) {
      console.log("Create request error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <AppHeader title="Create Request" onBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <RequestForm values={values} onChange={handleChange} />

        <AppButton
          title="Submit Request"
          onPress={handleSubmit}
          loading={loading}
          style={styles.submitButton}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  submitButton: {
    marginTop: 8,
    marginBottom: 20,
  },
});
