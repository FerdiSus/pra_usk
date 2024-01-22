import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native-web";
import HomeAdmin from "./HomeAdmin";
import { AntDesign } from "@expo/vector-icons";


const MainAdmin = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeAdmin"
        component={HomeAdmin}
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({}) => <AntDesign name="home" size={24} color="black" />,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainAdmin;