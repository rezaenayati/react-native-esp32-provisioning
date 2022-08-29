import * as React from 'react';

import { StyleSheet, View, Text, Button } from 'react-native';
import ESP32, { WiFiAccessPoint } from 'react-native-esp32-provisioning';

export default function App() {
    const [wifiList, setWifiList] = React.useState<WiFiAccessPoint[]>();
    const [error, setError] = React.useState<any>();
    const [status, setStatus] = React.useState<string>();

    async function run() {
        try {
            setStatus("initing ...")
            await ESP32.init("pop")
            setStatus("scaning wifis ...")
            const res1 = await ESP32.scanWifi()
            setWifiList(res1)
            console.log(res1);
            setStatus("list is here ...")
        } catch (error) {
            setStatus("failed")
            console.log(error);
            setError(error)
        }
    }

    async function provise() {
        try {
            setStatus("provisionings ...")
            const res2 = await ESP32.provise("ssid", "password")
            setStatus("completed")
            console.log(res2);
        } catch (error) {
            setStatus("failed")
            console.log(error);
            setError(error)
        }
    }

    React.useEffect(() => {
        run()
    }, []);

    return (
        <View style={styles.container}>
        <Text>Status: {status?.toString()}</Text>
        {
            wifiList?.map((v) => 
                <Button onPress={provise} title={'Provise   ' + v.wifiName} />
            )
        }

        <Text>Errors: {error?.toString()}</Text>
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
