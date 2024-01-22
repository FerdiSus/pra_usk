import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeBank from "./HomeBank";
import TopUp from "./TopUp";
import { AntDesign } from "@expo/vector-icons";


const MainBank = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeBank"
        component={HomeBank}
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({}) => <AntDesign name="home" size={24} color="black" />,
        }}
      />
      <Tab.Screen
        name="TopUp"
        component={TopUp}
        options={{
          headerShown: false,
          tabBarLabel: "TopUp",
          tabBarIcon: ({}) => <AntDesign name="wallet" size={24} color="black" />,
        }}
      />
  </Tab.Navigator>
  );
};

export default MainBank;