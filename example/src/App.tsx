import * as React from 'react';
import { StyleSheet, View, Text, Button, TextInput, ActivityIndicator } from 'react-native';
import ESP32 from 'react-native-esp32-provisioning';

enum Screen {
    InputPop = "InputPop",
    InputWifiCredential = "InputWifiCredential",
    Success = "Success",
    Error = "Error",
    Loading = "Loading"
}

export default function App() {
    const [error, setError] = React.useState<any>();
    const [screen, setScreen] = React.useState<Screen>();
    
    const provise = (SSID: string, Password: string) => async () => {
        try {
            setScreen(Screen.Loading)
            
            await ESP32.provise(SSID, Password)

            setScreen(Screen.Success)
        } catch (error) {
            showErrorScreen(error)
        }
    }

    function showProviseScreen() {
        setScreen(Screen.InputWifiCredential)
    }

    function showErrorScreen(error: any) {
        setScreen(Screen.Error)
        setError(error)
    }

    const setProofOfPosseion = (pop: string) => async () => {
        try {
            setScreen(Screen.Loading)
            
            await ESP32.init(pop)

            showProviseScreen()
        } catch (error) {            
            showErrorScreen(error)
        }
    }


    function restartApp() {
        setScreen(Screen.InputPop)
        setError(undefined)
    }


    React.useEffect(() => {
        restartApp()
    }, []);

    function Router(props: { screen: Screen | undefined, props: any }) {
        switch (props.screen) {
            case Screen.InputPop:
                return <InputPopContainer setPop={props.props.setPop} />;
            case Screen.InputWifiCredential:
                return <InputWifiCredentialContainer provise={props.props.provise} />;
            case Screen.Loading:
                return <LoadingContainer />;
            case Screen.Success:
                return <SuccessContainer restartApp={props.props.restartApp}/>;
            case Screen.Error:
                return <ErrorContainer restartApp={props.props.restartApp} error={props.props.error} />;
            default:
                return <Text>Nothing to show</Text>
        }
    }
    
    
    function InputPopContainer(props: { setPop: any }) {
        const [pop, setPop] = React.useState<string>();

        const submit = () => {  
            props.setPop(pop)();
        }

        return (
            <>
                <Text style={styles.marginBottom}>Please connect to device access point then enter pop of device:</Text>
                <TextInput value={pop} onChangeText={setPop} placeholder='Enter pop' style={styles.input} />
                <Button style={styles.marginBottom} onPress={submit} title={'Next'} />
            </>
        )
    }
    
    function InputWifiCredentialContainer(props: { provise: any }) {
        const [ssid, setSsid] = React.useState<string>();
        const [password, setPassword] = React.useState<string>();

        const submit = () => {  
            props.provise(ssid, password)();
        }

        return (
            <>
                <Text style={styles.marginBottom}>Enter wifi credential to start privisioning:</Text>
                <TextInput value={ssid} onChangeText={setSsid} placeholder='Enter Wifi SSID' style={styles.input} />
                <TextInput value={password} onChangeText={setPassword} placeholder='Enter Wifi Password' style={styles.input} />
                <Button style={styles.marginBottom} onPress={submit} title={'Provise'} />
            </>
        )
    }
    
    function SuccessContainer(props: { restartApp: any }) {
        return (
            <>
                <Text style={styles.marginBottom}>Device Provised Successfully</Text>
                <Button style={styles.marginBottom} onPress={props.restartApp} title={'Restart App'} />
            </>
        )
    }
    
    
    function ErrorContainer(props: { restartApp: any, error: any }) {
        return (
            <>
                <Text style={styles.marginBottom}>Error encountered:</Text>
                <Text>{props?.error?.message}</Text>
                <Button style={styles.marginBottom} onPress={props.restartApp} title={'Restart App'} />
            </>
        )
    }
    
    function LoadingContainer() {
        return (
            <>
                <ActivityIndicator />
            </>
        )
    }

    return (
        <View style={styles.container}>
            <Router 
                screen={screen}
                props={{ 
                    setPop: setProofOfPosseion,
                    provise,
                    restartApp,
                    error
                }} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 50
    },
    box: {
        width: 60,
        height: 60,
        marginVertical: 20,
    },
    marginBottom: {
        marginBottom: 10
    },
    input: {
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 10,
        width: "100%"
    }
});
