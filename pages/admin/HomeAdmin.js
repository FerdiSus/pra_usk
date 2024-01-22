import AsyncStorage from "@react-native-async-storage/async-storage"
import { View } from "react-native";
import axios from "axios";
import API_BASE_URL from "../../const/url";
import { useState } from "react";
import { Text, Button } from "react-native";

const HomeAdmin = ({navigation, route} ) =>{
   const [loading,setLoading] = useState(true);
   const [dataAdmin,setdataAdmin] = useState([]);

   const getDataAdmin = async () => {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}getsiswa`,{
        headers: {
            rization: `Bearer ${token}`,
        },
    });
    setdataAdmin(response.data);
    setLoading(false)
   }

   const Logout = async () =>{
    const token = await AsyncStorage.getItem( "token" );
    try{
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
    }

return(
 <View>
     {loading ? (
        <>
          <Text>...loading</Text>
          <Button title="logout" onPress={Logout} />
        </>
      ) : (
        <View>
          <Button title="logout" onPress={Logout} />
        </View>
      )}
 </View>
)
}


export default HomeAdmin