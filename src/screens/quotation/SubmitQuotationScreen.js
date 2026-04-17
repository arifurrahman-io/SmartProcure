import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

import ScreenWrapper from "../../components/common/ScreenWrapper";
import AppHeader from "../../components/common/AppHeader";
import AppButton from "../../components/common/AppButton";
import QuotationForm from "../../components/quotation/QuotationForm";

import useQuotations from "../../hooks/useQuotations";
import ROUTES from "../../navigation/routes";
import { validateQuotationForm } from "../../utils/validators";
import {
  createFormChangeHandler,
  getTrimmedFormValues,
} from "../../utils/formHelpers";
import { getErrorMessage } from "../../utils/errorHandler";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

const INITIAL_FORM = {
  vendorName: "",
  vendorContact: "",
  amount: "",
  specification: "",
  deliveryTime: "",
  warranty: "",
  notes: "",
};

export default function SubmitQuotationScreen({ navigation, route }) {
  const requestId = route?.params?.requestId;

  const [values, setValues] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  const { submitQuotation } = useQuotations(requestId, false);

  const handleChange = createFormChangeHandler(setValues);

  const resetForm = () => {
    setValues(INITIAL_FORM);
  };

  const handleSubmit = async () => {
    if (!requestId) {
      showErrorToast("Invalid Request", "No request reference was provided");
      return;
    }

    const trimmedValues = getTrimmedFormValues(values);
    const validationErrors = validateQuotationForm(trimmedValues);

    if (Object.keys(validationErrors).length > 0) {
      showErrorToast("Validation Error", Object.values(validationErrors)[0]);
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...trimmedValues,
        amount: Number(trimmedValues.amount),
      };

      await submitQuotation(payload);

      showSuccessToast(
        "Quotation Submitted",
        "Your quotation has been submitted successfully",
      );

      resetForm();

      navigation.replace(ROUTES.QUOTATION_LIST, {
        requestId,
      });
    } catch (error) {
      showErrorToast(
        "Submit Failed",
        getErrorMessage(error, "Failed to submit quotation"),
      );
    } finally {
      setSaving(false);
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
          loading={saving}
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
