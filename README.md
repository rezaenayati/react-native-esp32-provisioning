# react-native-esp32-provisioning
This Package is for wifi provisioning esp32 device based on official native android package (https://github.com/espressif/esp-idf-provisioning-android)

You can find a document in esp32 website https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/provisioning/wifi_provisioning.html#provisioning-tools

## Installation

```sh
npm install react-native-esp32-provisioning
```

or

```sh
yarn add react-native-esp32-provisioning
```

## Usage

```js
import ESP32 from 'react-native-esp32-provisioning';

// ...

await ESP32.init(pop)

await ESP32.provise(SSID, Password)
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
