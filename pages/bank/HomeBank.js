import {
  View,
  Text,
  Button,
  Modal,
  TextInput,
  RefreshControl
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_BASE_URL from "../../const/url";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { ScrollView } from "react-native";

const HomeBank = ({ navigation }) => {
  const [loading, setloading] = useState(true);
  const [dataBank, setdataBank] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setselectedUser] = useState(0);
  const [debit, setdebit] = useState("");
  const [debitBank, setdebitBank] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const formatToRp = (value) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
    return formatter.format(value);
  };

  const getDataBank = async () => {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}bank`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const roles = await axios.get(`${API_BASE_URL}roles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("bank", response.data);
    console.log("roles", roles.data.data);
    setdataBank(response.data);
    setRoles(roles.data);
    setloading(false);
  };

  useEffect(() => {
    getDataBank();
  }, []);


  const withDraw = async () => {
    const token = await AsyncStorage.getItem("token");
    await axios.post(
      `${API_BASE_URL}withdraw`,
      {
        users_id: parseInt(selectedUser),
        debit: parseInt(debit),
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setdebit("");
    getDataBank();
  };

  const logout = async () => {
    const token = await AsyncStorage.getItem("token");
    await axios.post(
      `${API_BASE_URL}logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    await AsyncStorage.multiRemove(["token", "role", "name"]);
    navigation.navigate("LoginPage");
  };

  const onRefresh = () => {
    getDataBank();
 };
  return (
    <ScrollView
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
  >
    <View className="container mx-auto mt-10">
      {loading ? (
        <>
          <Text>loading</Text>
          <Button title="logout" onPress={logout} />
        </>
      ) : (
        <View className="flex flex-col h-full w-full">
          <View className="flex flex-row justify-between items-center border-gray-300 border-b p-2 bg-white">
            <View className="flex flex-row items-center">
              <FontAwesome name="user-circle-o" size={24} color="black" />
              <Text className="ml-2">{dataBank.user.name} | Bank</Text>
            </View>
            <View className="flex flex-row">
              <Button title="logout" onPress={logout} />
            </View>
          </View>
          <View className="px-3">
            <View className="flex flex-row bg-white rounded-lg my-4 p-4 justify-between">
              <View className="flex flex-col items-center">
                <Entypo name="wallet" size={24} color="black" />
                <Text>{formatToRp(dataBank.balanceBank)}</Text>
                <Text>Saldo</Text>
              </View>
              <View className="border border-gray-300"></View>
              <View className="flex flex-col items-center">
                <FontAwesome name="exchange" size={24} color="black" />
                <Text>{dataBank.walletCount}</Text>
                <Text>Tarik & Setor Tunai</Text>
              </View>
              <View className="border border-gray-300"></View>
              <View className="flex flex-col items-center">
                <FontAwesome name="user-circle-o" size={24} color="black" />
                <Text>{dataBank.nasabah}</Text>
                <Text>Nasabah</Text>
              </View>
            </View>
          </View>
          <View className="flex flex-col justify-center items-center w-ful bg-white py-10">
                <Text className="mt-5">Penarikan Tunai</Text>
                <View>
                  <Picker
                    style={{ width: 200 }}
                    selectedValue={selectedUser}
                    onValueChange={(e) => setselectedUser(e)}
                  >
                    {roles.data.map((value, index) => (
                      <Picker.Item
                        label={value.name}
                        value={value.id}
                        key={index}
                      />
                    ))}
                  </Picker>
                </View>

                <TextInput
                  keyboardType="numeric"
                  value={debit}
                  onChangeText={(e) => setdebit(e)}
                  className="h-12 rounded-md px-6 mb-4 text-lg bg-gray-200 w-1/2"
                  placeholder="nominal"
                />
                <Button title="withdraw" onPress={withDraw} />
              </View>
        </View>
      )}
    </View>
    </ScrollView>
  );
};


export default HomeBank