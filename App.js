import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MainKantin from "./pages/kantin/MainKantin";
import MainAdmin from "./pages/admin/MainAdmin";
import MainBank from "./pages/bank/MainBank";
import MainUser from "./pages/user/MainUser";
import LoginPage from "./pages/LoginPage";
import HomeUser from './pages/user/HomeUser';
import HistoryUser from './pages/user/HistoryUser';


const App =()=> {
  const Stack = createNativeStackNavigator();
  const navigationRef = useRef();
  const checkAuth = async () => {
    const role = await AsyncStorage.getItem("role");
    const token = await AsyncStorage.getItem("token");
    console.log(role, token);
    if (token && role !== null) {
      switch (role) {
        case "admin":
          navigationRef.current?.navigate("MainAdmin");
          break;
        case "kantin":
          navigationRef.current?.navigate("MainKantin");
          break;
        case "bank":
          navigationRef.current?.navigate("MainBank");
          break;
        default:
          navigationRef.current?.navigate("MainUser");
          break;
      }
    }
  };
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator
        initialRouteName="LoginPage"
        screenOptions={{ animation: "fade" }}
      >
        <Stack.Screen
          name="LoginPage"
          component={LoginPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeUser"
          component={HomeUser}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="HistoryUser" component={HistoryUser} />
        <Stack.Screen
          name="MainKantin"
          component={MainKantin}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainAdmin"
          component={MainAdmin}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainBank"
          component={MainBank}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="MainUser"
          component={MainUser}
          options={{ headerShown: false }}
        />

        {/* <Stack.Screen name="DownloadPage" component={DownloadPage} />
        <Stack.Screen name="EditProduct" component={EditProduct} />
        <Stack.Screen name="EditCategory" component={EditCategory} />
        <Stack.Screen name="EditUser" component={EditUser} />
        <Stack.Screen name="CartUser" component={CartUser} />
        <Stack.Screen name="CreateProduct" component={CreateProduct} />
        <Stack.Screen name="CreateUser" component={CreateUser} />
        <Stack.Screen name="CreateCategory" component={CreateCategory} />
        <Stack.Screen name="ReportPage" component={ReportPage} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App