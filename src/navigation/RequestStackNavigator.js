import { createNativeStackNavigator } from "@react-navigation/native-stack";

import RequestListScreen from "../screens/request/RequestListScreen";
import CreateRequestScreen from "../screens/request/CreateRequestScreen";
import RequestDetailsScreen from "../screens/request/RequestDetailsScreen";
import EditRequestScreen from "../screens/request/EditRequestScreen";
import MyRequestsScreen from "../screens/request/MyRequestsScreen";

import SubmitQuotationScreen from "../screens/quotation/SubmitQuotationScreen";
import QuotationListScreen from "../screens/quotation/QuotationListScreen";
import QuotationComparisonScreen from "../screens/quotation/QuotationComparisonScreen";

import ROUTES from "./routes";

const Stack = createNativeStackNavigator();

export default function RequestStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.REQUEST_LIST} component={RequestListScreen} />

      <Stack.Screen
        name={ROUTES.CREATE_REQUEST}
        component={CreateRequestScreen}
      />

      <Stack.Screen
        name={ROUTES.REQUEST_DETAILS}
        component={RequestDetailsScreen}
      />

      <Stack.Screen name={ROUTES.EDIT_REQUEST} component={EditRequestScreen} />

      <Stack.Screen name={ROUTES.MY_REQUESTS} component={MyRequestsScreen} />

      <Stack.Screen
        name={ROUTES.SUBMIT_QUOTATION}
        component={SubmitQuotationScreen}
      />

      <Stack.Screen
        name={ROUTES.QUOTATION_LIST}
        component={QuotationListScreen}
      />

      <Stack.Screen
        name={ROUTES.QUOTATION_COMPARISON}
        component={QuotationComparisonScreen}
      />
    </Stack.Navigator>
  );
}
