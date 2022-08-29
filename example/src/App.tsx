import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { initESPModule, scanWifiList } from 'react-native-esp32-provisioning';

export default function App() {
  const [result, setResult] = React.useState<any>();

  React.useEffect(() => {


    initESPModule("3, 7").then((res) => {
      setResult(res)
      scanWifiList().then(res => console.log(res)).catch(err => console.log(err))
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result?.toString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
