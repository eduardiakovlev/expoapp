import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import {  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  Image,
  TextInput,
  FlatList } from 'react-native';
import db from './src/services/firebase';

export default function App() {

  const [burgers, setBurgers] = useState([]);
  const [eaten, setEaten] = useState(false);
  const [burger, setBurger] = useState('');

  useEffect(() => {
    db.collection('burgers')
      .get()
      .then(res => {
        const data = res.docs.map((doc) => {
          return { id: doc.id, ...doc.data() }
        });
        setBurgers(data);
      })
      .catch(err => {
      console.log(err, 'err');
      })
  }, []);

  const addBurger = () => {
    db.collection("burgers")
          .add({name: burger, status: false})
          .then(res => {
            setBurgers([...burgers, {status: false, name: burger, id: res.id}]);
            setBurger('')
          })
          .catch(err => {
            console.log(err, 'err');
          });
  }

  const updateStatus = (id) => {
    db.collection("burgers")
          .doc(id)
          .update({status: !eaten})
          .then(res => {
            let list = burgers;
            let index = list.findIndex(it => it.id === id);
            list[index] = {...list[index], status: !eaten};
            setBurgers([...list]);
          })
          .catch(err => {
            console.log(err, 'err');
          });
  };

  const deleteBurger = (id) => {
    db.collection("burgers")
          .doc(id)
          .delete()
          .then(res => {
            let list = burgers;
            let index = list.findIndex(it => it.id === id);
            list.splice(index, 1);
            setBurgers([...list]);
          })
          .catch(err => {
            console.log(err, 'err');
          });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle={'dark-content'}/>
      <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        <Text style={styles.title}>Burger made</Text>
        <FlatList
          data={burgers.filter(item => item.status === false)}
          keyExtractor={(item) => item.id}
          renderItem={(data) => {
            let item = data.item;
            return(
              <View style={styles.item}>
              <Text style={styles.name}>{item.name}</Text>
              <View style={{flexDirection: 'row'}}>
                {!eaten && <TouchableOpacity onPress={() => updateStatus(item.id)} style={styles.eatBt}>
                  <Text style={styles.eatBtText}>Eat it</Text>
                </TouchableOpacity>}
                <TouchableOpacity onPress={() => deleteBurger(item.id)} style={styles.rightBt}>
                    <Image style={{width: 20, height: 20}} source={require('./src/source/delete.png')}/>
                </TouchableOpacity>
              </View>
              </View>
            )
          }}
        />
      <View style={[styles.item, {marginVertical: 15}]}>
                <TextInput style={styles.input} value={burger} 
                          onChangeText={e => setBurger(e)} placeholder={'Add burger'}/>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity style={styles.rightBt} onPress={() => {
                    burger.length > 0 && addBurger();
                  }}>
                      <Image style={{width: 20, height: 20}} source={require('./src/source/send.png')}/>
                  </TouchableOpacity>
                </View>
      </View>
      </View>
      <View style={{flex: 1}}>
        <Text style={styles.title}>Burgers Eaten</Text>
        <FlatList
          data={burgers.filter(item => item.status === true)}
          keyExtractor={(item) => item.id}
          renderItem={(data) => {
            let item = data.item;
            return(
              <View style={styles.item}>
              <Text style={styles.name}>{item.name}</Text>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity onPress={() => deleteBurger(item.id)} style={styles.rightBt}>
                    <Image style={{width: 20, height: 20}} source={require('./src/source/delete.png')}/>
                </TouchableOpacity>
              </View>
              </View>
            )
          }}
        />
      </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '500',
    paddingHorizontal: 16,
    paddingVertical: 20
  },
  bottomControl: {
    flexDirection: 'row',
    borderTopColor: '#f1f1f7',
    borderTopWidth: 1
  },
  bottomBt: {
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  activeBt: {
    backgroundColor: '#04004D'
  },
  item:{
    backgroundColor: '#f1f1f7',
    height: 55,
    marginHorizontal: 16,
    borderRadius: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 12
  },
  name: {
    fontSize: 16,
    paddingHorizontal: 16
  },
  rightBt: {
    width: 55,
    height: 55,
    backgroundColor: '#04004D',
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  eatBt: {
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  eatBtText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#04004D'
  },
  input: {
    fontSize: 16,
    flex: 1,
    paddingHorizontal: 16
  }
});
