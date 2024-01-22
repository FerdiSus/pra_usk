import { View, Text, Button, FlatList, Modal, TextInput, SafeAreaView } from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Card from "../../component/Card";
import API_BASE_URL from "../../const/url";
import { FontAwesome } from "@expo/vector-icons";
import CartUser from "./CartUser";
import { Feather } from "@expo/vector-icons";
import { RefreshControl } from "react-native";
import { ScrollView } from "react-native";


const HomeUser = ({ route, navigation }) => {
  const [dataSiswa, setdataSiswa] = useState([]);
  const [loading, setloading] = useState(true);
  const { getDataSiswaCallBack } = route.params || {};
  const { username } = route.params || {};
  const [roleAuth, setroleAuth] = useState("");
  const [name, setname] = useState("");
  const [credit, setcredit] = useState("");
  const [openModal, setopenModal] = useState(false);
  const currentTime = new Date();
  const [refreshing, setRefreshing] = useState(false);
  const seconds = currentTime.getSeconds();

  const formatToRp = (value) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
    return formatter.format(value);
  };

  const topUp = async () => {
    const token = await AsyncStorage.getItem("token");
    await axios.post(
      `${API_BASE_URL}topup`,
      {
        credit: parseInt(credit),
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setcredit("");
    setopenModal(false);
    navigation.navigate("HistoryUser", { successTopUp: seconds });
  };

  const getDataSiswa = async () => {
    const token = await AsyncStorage.getItem("token");
    const role = await AsyncStorage.getItem("role");
    const name = await AsyncStorage.getItem("name");
    const response = await axios.get(`${API_BASE_URL}get-product-siswa`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setdataSiswa(response.data);
    setloading(false);
    setroleAuth(role);
    setname(name);
  };

  useEffect(() => {
    getDataSiswa();
    if (getDataSiswaCallBack) {
      getDataSiswa();
    }
  }, [getDataSiswaCallBack]);

  const Tab = createMaterialTopTabNavigator();

  const logout = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      await axios.post(
        `${API_BASE_URL}logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await AsyncStorage.multiRemove(["token", "role"]);
      navigation.navigate("LoginPage");
    } catch (error) {
      await AsyncStorage.multiRemove(["token", "role"]);
      navigation.navigate("LoginPage");
    }
  };

  const onRefresh = () => {
    getDataSiswa();
  };

  return (
    <View className="container mx-auto mt-10 h-full w-full">
      {loading ? (
            <>
             <Text>...loading</Text>
           </>
      ) : (
        <View className="flex flex-col h-full w-full">
          <View className="flex flex-row justify-between items-center border-gray-300 border-b p-2 bg-white">
            <View className="flex flex-row items-center">
              <Text className="ml-2">{username ?? name}| |Saldo:</Text>
              <Text className="bg-green-400 p-2 rounded-md mr-2">
                {formatToRp(dataSiswa.difference)}
              </Text>
                <FontAwesome name="money" size={24} color="black" onPress={() => setopenModal(true)} />
            </View>
            <Modal
              visible={openModal}
              onRequestClose={() => setopenModal(false)}
            >
              <View className="flex flex-col justify-center items-center h-full w-full">
                <Text className="mb-3">Masukkan Nominal</Text>
                <TextInput
                  keyboardType="numeric"
                  value={credit}
                  className="h-12 rounded-md px-6 mb-4 text-lg bg-gray-200 w-1/2"
                  onChangeText={(e) => setcredit(e)}
                  placeholder="nominal"
                />
                <Button title="top up" onPress={topUp} />
                <Text></Text>
                <Button className="" title="close" onPress={() => setopenModal(false)} />
              </View>
            </Modal>
            <View className="flex flex-row">
              <Button title="logout" onPress={logout} />
            </View>
          </View>
          <View>
          <FlatList
            className="mb-28"
             refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            keyExtractor={(item) => item.id.toString()}
            data={dataSiswa.products}
            renderItem={({ item, index }) => (
              <Card
                key={index}
                name={item.name}
                desc={item.desc}
                photo={`http://192.168.1.14:8002${item.photo}`}
                price={item.price}
                role={roleAuth}
                stand={item.stand}
                stock={item.stock}
                id={item.id}
                navigation={navigation}
                saldo={dataSiswa.difference}
              />
            )}
          />
          </View>
        </View>
      )}
    </View>
  );
};

export default HomeUser;