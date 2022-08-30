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
import com.espressif.provisioning.listeners.ProvisionListener;

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

    @ReactMethod
    public void init(String pop, Promise promise) {
        try {
            provisionManager = ESPProvisionManager.getInstance(this.context);
            provisionManager.createESPDevice(ESPConstants.TransportType.TRANSPORT_SOFTAP, ESPConstants.SecurityType.SECURITY_1);
            provisionManager.getEspDevice().setProofOfPossession(pop);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void provision(String ssid, String password, Promise promise) {
        provisionManager.getEspDevice().provision(ssid, password, new ProvisionListener() {
            @Override
            public void onProvisioningFailed(Exception e) {
                promise.reject(e);
            }
            
            @Override
            public void createSessionFailed(Exception e) {
                promise.reject(e);
            }

            @Override
            public void wifiConfigSent() {
            }

            @Override
            public void wifiConfigFailed(Exception e) {
                promise.reject(e);
            }

            @Override
            public void wifiConfigApplied() {
            }

            @Override
            public void wifiConfigApplyFailed(Exception e) {
                promise.reject(e);
            }

            @Override
            public void provisioningFailedFromDevice(ESPConstants.ProvisionFailureReason failureReason) {
                promise.reject(String.valueOf(failureReason));
            }

            @Override
            public void deviceProvisioningSuccess() {
                promise.resolve(true);
            }
        });
    }

}
