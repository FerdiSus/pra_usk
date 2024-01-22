import { View, FlatList, Text, RefreshControl, Button } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_BASE_URL from "../../const/url";

const TopUp= ()=>{
const [loading, setloading] = useState(true);
const [dataBank, setdataBank] = useState([]);
const [refreshing, setRefreshing] = useState(false);
const [roles, setRoles] = useState([]);


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

    const acceptTopUp = async (id) => {
        const token = await AsyncStorage.getItem("token");
        await axios.put(
          `${API_BASE_URL}topup-success/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        getDataBank();
      };

 const onRefresh = () => {
    getDataBank();
 };

return(
    <View className="w-full mb-5 container mt-10">
          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            className="h-full px-3"
            data={dataBank.wallets}
            renderItem={({ item, index }) => (
              <View
                className="flex flex-row justify-between p-3 bg-white border border-gray-300 rounded-lg mt-2"
                key={index}
              >
                <View className="flex flex-col justify-center">
                  <View className="flex flex-row items-center">
                    <Text>{item.user.name}</Text>
                    {item.user.roles_id !== 4 ? (
                      <Text className="ml-1 p-1 bg-yellow-400 rounded">
                        Bank
                      </Text>
                    ) : (
                      <Text className="ml-1 p-1 bg-blue-400 rounded">
                        Siswa
                      </Text>
                    )}
                  </View>

                  <Text>
                    Credit {formatToRp(item.credit) ?? "0"} | Debit{" "}
                    {formatToRp(item.debit) ?? "0"}
                  </Text>
                </View>

                <View className="flex flex-row items-center">
                  <Text
                    className={
                      item.status === "process"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }
                  >
                    {item.status}
                  </Text>
                  {item.status === "selesai" ? (
                    <Text className="ml-3 rounded bg-green-500 p-3">OK</Text>
                  ) : (
                    <Button
                      title="Accept"
                      onPress={() => acceptTopUp(item.id)}
                    />
                  )}
                </View>
              </View>
            )}
          />
    </View>
)

}

export default TopUp;