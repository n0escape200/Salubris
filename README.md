To uninstall app

$ adb uninstall com.salubris

Start with clear cache

$ npm start -- --reset-cache

    install patch-package
    make a clean install (npm install - BEFORE building the app - otherwise it gets all sorts of other stuff that patch-package can't handle)
    edit node_modules/react-native-worklets-core/android/CMakeLists.txt
    change hermes-engine::libhermes to hermes-engine::hermesvm (around line 84)
    run patch-package (npx patch-package react-native-worklets-core)
    (if you want to, run npm install again) (package is already OK - patch package ensure it stays OK)
    clean build gradle and all that then:
    rebuild and .... voilà !
