import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
    `The package 'react-native-esp32-provisioning' doesn't seem to be linked. Make sure: \n\n` +
    Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
    '- You rebuilt the app after installing the package\n' +
    '- You are not using Expo managed workflow\n';

const Esp32Provisioning = NativeModules.Esp32Provisioning  ? NativeModules.Esp32Provisioning  : new Proxy(
        {},
        {
            get() {
            throw new Error(LINKING_ERROR);
            },
        }
    );

interface WiFiAccessPoint {
    wifiName: string , // SSID
    rssi: number,
    security: number,
    password: string
}

class Esp32{
    private static inited: boolean = false

    static init(pop: string): void {
        if (!pop) {
            throw new Error("Pop cannot be empty");
        }
        this.inited = Esp32Provisioning.initESPModule(pop);
    }

    static scanWifi(): Promise<WiFiAccessPoint[]>  {
        if (!this.inited) {
            throw new Error("You should call init first");
        }
        return Esp32Provisioning.scanWifiList();
    }

    static provise(ssid: string, password: string): Promise<boolean> {
        return Esp32Provisioning.provision(ssid, password)
    }
}

export default Esp32
export {
    WiFiAccessPoint
}