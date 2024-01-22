import { View, Text, ScrollView, Button, RefreshControl, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_BASE_URL from "../../const/url";

const TransactionKantin = () => {
  const [transactionKantin, settransactionKantin] = useState([]);
  const [loading, setloading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const formatToRp = (value) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
    return formatter.format(value);
  };

  const getTransactionKantin = async () => {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}transaction-kantin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    settransactionKantin(response.data);
    setloading(false);
  };

  const verifPengambilan = async (id) => {
    const token = await AsyncStorage.getItem("token");
    await axios.put(
      `${API_BASE_URL}transaction-kantin/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    getTransactionKantin();
  };

  useEffect(() => {
    getTransactionKantin();
  }, []);

  const onRefresh = () => {
    getTransactionKantin();
  };

  return (
    <ScrollView
      className="mt-10"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="container mx-auto">
        {loading ? (
          <Text>loading</Text>
        ) : (
          <View className="flex flex-col h-full w-full p-3">
            <View className="flex flex-col bg-white rounded-lg p-3">
              <Text className="text-lg font-bold">Transaksi Pembelian Barang</Text>
              {transactionKantin.transactions.map((item, index) => (
                <View
                  className="flex flex-row justify-between items-center bg-white p-3 mt-2 rounded-lg border border-gray-300"
                  key={index}
                >
                  <View className="flex flex-col">
                    <Text className="underline">{item.order_code}</Text>
                    <View className="flex flex-row">
                        <Text className="mr-2">{item.products.name}</Text>
                        <Text>
                            {formatToRp(item.price)} | {item.quantity}x
                        </Text>
                    </View>
                    {item.user_transactions.map((val, ind) => (
                        <Text className="font-bold text-blue-300 " key={ind}>{val.name}</Text>
                    ))}
                  </View>
                  <View className="flex flex-row">
                    <Text
                      className={
                        item.status === "dibayar"
                          ? `py-2 text-yellow-600 font-semibold text-sm`
                          : `font-bold text-sm`
                      }
                    >
                      {item.status}
                    </Text>
                    {item.status === "dibayar" ? (
                        <TouchableOpacity className="justify-center p-2 border rounded-lg mx-1 bg-blue-400" onPress={() => verifPengambilan(item.id)}>
                            <Text className="font-bold text-sm">Accept</Text>
                        </TouchableOpacity>
                    ) : (
                      <></>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default TransactionKantin;