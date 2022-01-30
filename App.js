import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback, TextInput, ScrollView } from 'react-native';
import { theme } from './colors';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  useEffect(() => {
    loadToDos()
  }, []);
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);
  const STORAGE_KEY = "@toDos"

  const addToDo = async () => {
    if (text == "") {
      return
    }
    // save to do
    //const newToDos = Object.assign({}, toDos, {[Date.now()] : { text,  work : working}})
    const newToDos = {...toDos, [Date.now()] : { text, working}};
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText(""); 
  };

  const saveToDos = async (toSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    } catch (e) {
      // saving error
    }
  };

  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    //console.log(s, JSON.parse(s)); // string을 JavaScript object로 만들어 준다.
    setToDos(JSON.parse(s))
  };

  console.log(toDos);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" /> 
      <View style={styles.header}> 
        <TouchableOpacity onPress = {work}>
          <Text style={{...styles.btnText, color : working ? "white" : theme.gray}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress = {travel}>
          <Text style={{...styles.btnText, color: !working ? "white" : theme.gray }}>Travel</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput 
        returnKeyType="done"
        onSubmitEditing = {addToDo}
        value={text} // 이 컴포넌트를 제어 하기 위해 사용
        onChangeText={onChangeText}
        style={styles.input} placeholder={working ? "Add To Do" : "When Do you want to go?"}
        />
      </View>
      <ScrollView>
        {Object.keys(toDos).map((key) => (
          toDos[key].working === working ? <View style={styles.toDo}key={key}>
            <Text style={styles.toDoText}>{toDos[key].text}</Text>
          </View> : null
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 100,
  },
  btnText: {
    fontSize: 44,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20, 
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.gray,
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 15,
  },
  toDoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: "500",
  },
});
