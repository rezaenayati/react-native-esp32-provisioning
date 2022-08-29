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

export function multiply(a: number, b: number): Promise<number> {
    return Esp32Provisioning.multiply(a, b);
}

export function initESPModule(pop: string): Promise<boolean> {
    return Esp32Provisioning.initESPModule(pop);
}

export function scanWifiList(): Promise<WiFiAccessPoint> {
    return Esp32Provisioning.scanWifiList();
}