import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import AppButton from "../../components/common/AppButton";
import QuotationForm from "../../components/quotation/QuotationForm";

export default function SubmitQuotationScreen({ navigation, route }) {
  const requestId = route?.params?.requestId;

  const [values, setValues] = useState({
    vendorName: "",
    vendorContact: "",
    amount: "",
    specification: "",
    deliveryTime: "",
    warranty: "",
    notes: "",
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
      console.log("Submit quotation for request:", requestId, values);
      navigation.goBack();
    } catch (error) {
      console.log("Quotation submit error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <AppHeader title="Submit Quotation" onBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <QuotationForm values={values} onChange={handleChange} />

        <AppButton
          title="Submit Quotation"
          onPress={handleSubmit}
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
