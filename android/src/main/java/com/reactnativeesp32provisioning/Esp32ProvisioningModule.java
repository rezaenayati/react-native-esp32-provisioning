package com.reactnativeesp32provisioning;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.module.annotations.ReactModule;
import com.espressif.provisioning.ESPConstants;
import com.espressif.provisioning.ESPDevice;
import com.espressif.provisioning.ESPProvisionManager;
import com.espressif.provisioning.WiFiAccessPoint;
import com.espressif.provisioning.listeners.WiFiScanListener;

import java.util.ArrayList;

@ReactModule(name = Esp32ProvisioningModule.NAME)
public class Esp32ProvisioningModule extends ReactContextBaseJavaModule {
    public static final String NAME = "Esp32Provisioning";
    private ESPProvisionManager provisionManager;
    private ESPDevice espDevice;
    private final ReactApplicationContext context;

    public Esp32ProvisioningModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.context = reactContext;
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }


    // Example method
    // See https://reactnative.dev/docs/native-modules-android
    @ReactMethod
    public void multiply(double a, double b, Promise promise) {
        promise.resolve(a * b);
    }

    @ReactMethod
    public void initESPModule(String pop, Promise promise) {
        try {
            provisionManager = ESPProvisionManager.getInstance(this.context);
            espDevice = provisionManager.createESPDevice(ESPConstants.TransportType.TRANSPORT_SOFTAP, ESPConstants.SecurityType.SECURITY_1);
            provisionManager.getEspDevice().setProofOfPossession(pop);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void scanWifiList(Promise promise) {
        espDevice.scanNetworks(new WiFiScanListener() {
            @Override
            public void onWifiListReceived(ArrayList<WiFiAccessPoint> wifiList) {
                promise.resolve(wifiList);
            }

            @Override
            public void onWiFiScanFailed(Exception e) {
                promise.reject(e);
            }
        });
    }

}
