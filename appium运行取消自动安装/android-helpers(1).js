'use strict';

var _defineProperty = require('babel-runtime/helpers/define-property')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _teen_process = require('teen_process');

var _asyncbox = require('asyncbox');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _appiumSupport = require('appium-support');

var _appiumAndroidIme = require('appium-android-ime');

var _ioAppiumSettings = require('io.appium.settings');

var _appiumUnlock = require('appium-unlock');

var _appiumAndroidBootstrap = require('appium-android-bootstrap');

var _appiumAndroidBootstrap2 = _interopRequireDefault(_appiumAndroidBootstrap);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _appiumAdb = require('appium-adb');

var _appiumAdb2 = _interopRequireDefault(_appiumAdb);

var _unlockHelpers = require('./unlock-helpers');

var _unlockHelpers2 = _interopRequireDefault(_unlockHelpers);

var PACKAGE_INSTALL_TIMEOUT = 90000; // milliseconds
var CHROME_BROWSER_PACKAGE_ACTIVITY = {
  chrome: {
    pkg: 'com.android.chrome',
    activity: 'com.google.android.apps.chrome.Main'
  },
  chromium: {
    pkg: 'org.chromium.chrome.shell',
    activity: '.ChromeShellActivity'
  },
  chromebeta: {
    pkg: 'com.chrome.beta',
    activity: 'com.google.android.apps.chrome.Main'
  },
  browser: {
    pkg: 'com.android.browser',
    activity: 'com.android.browser.BrowserActivity'
  },
  'chromium-browser': {
    pkg: 'org.chromium.chrome',
    activity: 'com.google.android.apps.chrome.Main'
  },
  'chromium-webview': {
    pkg: 'org.chromium.webview_shell',
    activity: 'org.chromium.webview_shell.WebViewBrowserActivity'
  },
  'default': {
    pkg: 'com.android.chrome',
    activity: 'com.google.android.apps.chrome.Main'
  }
};
var SETTINGS_HELPER_PKG_ID = 'io.appium.settings';
var SETTINGS_HELPER_PKG_ACTIVITY = ".Settings";
var UNLOCK_HELPER_PKG_ID = 'io.appium.unlock';
var UNLOCK_HELPER_PKG_ACTIVITY = ".Unlock";

var helpers = {};

helpers.parseJavaVersion = function (stderr) {
  var lines = stderr.split("\n");
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = _getIterator(lines), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var line = _step.value;

      if (new RegExp(/(java|openjdk) version/).test(line)) {
        return line.split(" ")[2].replace(/"/g, '');
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator['return']) {
        _iterator['return']();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return null;
};

helpers.getJavaVersion = function callee$0$0() {
  var _ref, stderr, javaVer;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _logger2['default'].debug("Getting Java version");

        context$1$0.next = 3;
        return _regeneratorRuntime.awrap((0, _teen_process.exec)('java', ['-version']));

      case 3:
        _ref = context$1$0.sent;
        stderr = _ref.stderr;
        javaVer = helpers.parseJavaVersion(stderr);

        if (!(javaVer === null)) {
          context$1$0.next = 8;
          break;
        }

        throw new Error("Could not get the Java version. Is Java installed?");

      case 8:
        _logger2['default'].info('Java version is: ' + javaVer);
        return context$1$0.abrupt('return', javaVer);

      case 10:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.prepareEmulator = function callee$0$0(adb, opts) {
  var avd, avdArgs, language, locale, avdLaunchTimeout, avdReadyTimeout, avdName, runningAVD;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        avd = opts.avd;
        avdArgs = opts.avdArgs;
        language = opts.language;
        locale = opts.locale;
        avdLaunchTimeout = opts.avdLaunchTimeout;
        avdReadyTimeout = opts.avdReadyTimeout;

        if (avd) {
          context$1$0.next = 8;
          break;
        }

        throw new Error("Cannot launch AVD without AVD name");

      case 8:
        avdName = avd.replace('@', '');
        context$1$0.next = 11;
        return _regeneratorRuntime.awrap(adb.getRunningAVD(avdName));

      case 11:
        runningAVD = context$1$0.sent;

        if (!(runningAVD !== null)) {
          context$1$0.next = 21;
          break;
        }

        if (!(avdArgs && avdArgs.toLowerCase().indexOf("-wipe-data") > -1)) {
          context$1$0.next = 19;
          break;
        }

        _logger2['default'].debug('Killing \'' + avdName + '\' because it needs to be wiped at start.');
        context$1$0.next = 17;
        return _regeneratorRuntime.awrap(adb.killEmulator(avdName));

      case 17:
        context$1$0.next = 21;
        break;

      case 19:
        _logger2['default'].debug("Not launching AVD because it is already running.");
        return context$1$0.abrupt('return');

      case 21:
        avdArgs = this.prepareAVDArgs(opts, adb, avdArgs);
        context$1$0.next = 24;
        return _regeneratorRuntime.awrap(adb.launchAVD(avd, avdArgs, language, locale, avdLaunchTimeout, avdReadyTimeout));

      case 24:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.prepareAVDArgs = function (opts, adb, avdArgs) {
  var args = avdArgs ? [avdArgs] : [];
  if (!_lodash2['default'].isUndefined(opts.networkSpeed)) {
    var networkSpeed = this.ensureNetworkSpeed(adb, opts.networkSpeed);
    args.push('-netspeed', networkSpeed);
  }
  if (opts.isHeadless) {
    args.push('-no-window');
  }
  return args.join(' ');
};

helpers.ensureNetworkSpeed = function (adb, networkSpeed) {
  if (_lodash2['default'].values(adb.NETWORK_SPEED).indexOf(networkSpeed) !== -1) {
    return networkSpeed;
  }
  _logger2['default'].warn('Wrong network speed param ' + networkSpeed + ', using default: full. Supported values: ' + _lodash2['default'].values(adb.NETWORK_SPEED));
  return adb.NETWORK_SPEED.FULL;
};

helpers.ensureDeviceLocale = function callee$0$0(adb, language, country) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!(!_lodash2['default'].isString(language) && !_lodash2['default'].isString(country))) {
          context$1$0.next = 4;
          break;
        }

        _logger2['default'].warn('setDeviceLanguageCountry requires language or country.');
        _logger2['default'].warn('Got language: \'' + language + '\' and country: \'' + country + '\'');
        return context$1$0.abrupt('return');

      case 4:
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(adb.setDeviceLanguageCountry(language, country));

      case 6:
        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(adb.ensureCurrentLocale(language, country));

      case 8:
        if (context$1$0.sent) {
          context$1$0.next = 10;
          break;
        }

        throw new Error('Failed to set language: ' + language + ' and country: ' + country);

      case 10:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.getDeviceInfoFromCaps = function callee$0$0() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var adb, udid, emPort, devices, availDevicesStr, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, device, deviceOS;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(_appiumAdb2['default'].createADB({
          javaVersion: opts.javaVersion,
          adbPort: opts.adbPort,
          remoteAdbHost: opts.remoteAdbHost,
          suppressKillServer: opts.suppressKillServer,
          clearDeviceLogsOnStart: opts.clearDeviceLogsOnStart
        }));

      case 2:
        adb = context$1$0.sent;
        udid = opts.udid;
        emPort = null;

        if (!opts.avd) {
          context$1$0.next = 12;
          break;
        }

        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(helpers.prepareEmulator(adb, opts));

      case 8:
        udid = adb.curDeviceId;
        emPort = adb.emulatorPort;
        context$1$0.next = 64;
        break;

      case 12:
        // no avd given. lets try whatever's plugged in devices/emulators
        _logger2['default'].info("Retrieving device list");
        context$1$0.next = 15;
        return _regeneratorRuntime.awrap(adb.getDevicesWithRetry());

      case 15:
        devices = context$1$0.sent;

        if (!udid) {
          context$1$0.next = 21;
          break;
        }

        if (!_lodash2['default'].includes(_lodash2['default'].map(devices, 'udid'), udid)) {
          _logger2['default'].errorAndThrow('Device ' + udid + ' was not in the list ' + 'of connected devices');
        }
        emPort = adb.getPortFromEmulatorString(udid);
        context$1$0.next = 64;
        break;

      case 21:
        if (!opts.platformVersion) {
          context$1$0.next = 62;
          break;
        }

        opts.platformVersion = ('' + opts.platformVersion).trim();

        // a platform version was given. lets try to find a device with the same os
        _logger2['default'].info('Looking for a device with Android \'' + opts.platformVersion + '\'');

        // in case we fail to find something, give the user a useful log that has
        // the device udids and os versions so they know what's available
        availDevicesStr = [];
        _iteratorNormalCompletion2 = true;
        _didIteratorError2 = false;
        _iteratorError2 = undefined;
        context$1$0.prev = 28;
        _iterator2 = _getIterator(devices);

      case 30:
        if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
          context$1$0.next = 44;
          break;
        }

        device = _step2.value;
        context$1$0.next = 34;
        return _regeneratorRuntime.awrap(adb.setDeviceId(device.udid));

      case 34:
        context$1$0.next = 36;
        return _regeneratorRuntime.awrap(adb.getPlatformVersion());

      case 36:
        deviceOS = context$1$0.sent;

        // build up our info string of available devices as we iterate
        availDevicesStr.push(device.udid + ' (' + deviceOS + ')');

        // we do a begins with check for implied wildcard matching
        // eg: 4 matches 4.1, 4.0, 4.1.3-samsung, etc

        if (!(deviceOS.indexOf(opts.platformVersion) === 0)) {
          context$1$0.next = 41;
          break;
        }

        udid = device.udid;
        return context$1$0.abrupt('break', 44);

      case 41:
        _iteratorNormalCompletion2 = true;
        context$1$0.next = 30;
        break;

      case 44:
        context$1$0.next = 50;
        break;

      case 46:
        context$1$0.prev = 46;
        context$1$0.t0 = context$1$0['catch'](28);
        _didIteratorError2 = true;
        _iteratorError2 = context$1$0.t0;

      case 50:
        context$1$0.prev = 50;
        context$1$0.prev = 51;

        if (!_iteratorNormalCompletion2 && _iterator2['return']) {
          _iterator2['return']();
        }

      case 53:
        context$1$0.prev = 53;

        if (!_didIteratorError2) {
          context$1$0.next = 56;
          break;
        }

        throw _iteratorError2;

      case 56:
        return context$1$0.finish(53);

      case 57:
        return context$1$0.finish(50);

      case 58:

        // we couldn't find anything! quit
        if (!udid) {
          _logger2['default'].errorAndThrow('Unable to find an active device or emulator ' + ('with OS ' + opts.platformVersion + '. The following ') + 'are available: ' + availDevicesStr.join(', '));
        }

        emPort = adb.getPortFromEmulatorString(udid);
        context$1$0.next = 64;
        break;

      case 62:
        // a udid was not given, grab the first device we see
        udid = devices[0].udid;
        emPort = adb.getPortFromEmulatorString(udid);

      case 64:

        _logger2['default'].info('Using device: ' + udid);
        return context$1$0.abrupt('return', { udid: udid, emPort: emPort });

      case 66:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[28, 46, 50, 58], [51,, 53, 57]]);
};

// returns a new adb instance with deviceId set
helpers.createADB = function callee$0$0(javaVersion, udid, emPort, adbPort, suppressKillServer, remoteAdbHost, clearDeviceLogsOnStart) {
  var adb;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(_appiumAdb2['default'].createADB({
          javaVersion: javaVersion,
          adbPort: adbPort,
          suppressKillServer: suppressKillServer,
          remoteAdbHost: remoteAdbHost,
          clearDeviceLogsOnStart: clearDeviceLogsOnStart
        }));

      case 2:
        adb = context$1$0.sent;

        adb.setDeviceId(udid);
        if (emPort) {
          adb.setEmulatorPort(emPort);
        }

        return context$1$0.abrupt('return', adb);

      case 6:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.getLaunchInfo = function callee$0$0(adb, opts) {
  var app, appPackage, appActivity, appWaitPackage, appWaitActivity, _ref2, apkPackage, apkActivity;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        app = opts.app;
        appPackage = opts.appPackage;
        appActivity = opts.appActivity;
        appWaitPackage = opts.appWaitPackage;
        appWaitActivity = opts.appWaitActivity;

        if (app) {
          context$1$0.next = 8;
          break;
        }

        _logger2['default'].warn("No app sent in, not parsing package/activity");
        return context$1$0.abrupt('return');

      case 8:
        if (!(appPackage && appActivity)) {
          context$1$0.next = 10;
          break;
        }

        return context$1$0.abrupt('return');

      case 10:

        _logger2['default'].debug("Parsing package and activity from app manifest");
        context$1$0.next = 13;
        return _regeneratorRuntime.awrap(adb.packageAndLaunchActivityFromManifest(app));

      case 13:
        _ref2 = context$1$0.sent;
        apkPackage = _ref2.apkPackage;
        apkActivity = _ref2.apkActivity;

        if (apkPackage && !appPackage) {
          appPackage = apkPackage;
        }
        if (!appWaitPackage) {
          appWaitPackage = appPackage;
        }
        if (apkActivity && !appActivity) {
          appActivity = apkActivity;
        }
        if (!appWaitActivity) {
          appWaitActivity = appActivity;
        }
        _logger2['default'].debug('Parsed package and activity are: ' + apkPackage + '/' + apkActivity);
        return context$1$0.abrupt('return', { appPackage: appPackage, appWaitPackage: appWaitPackage, appActivity: appActivity, appWaitActivity: appWaitActivity });

      case 22:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.resetApp = function callee$0$0(adb) {
  var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var app, appPackage, fastReset, fullReset, _opts$androidInstallTimeout, androidInstallTimeout, autoGrantPermissions, isInstalled, output;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        app = opts.app;
        appPackage = opts.appPackage;
        fastReset = opts.fastReset;
        fullReset = opts.fullReset;
        _opts$androidInstallTimeout = opts.androidInstallTimeout;
        androidInstallTimeout = _opts$androidInstallTimeout === undefined ? PACKAGE_INSTALL_TIMEOUT : _opts$androidInstallTimeout;
        autoGrantPermissions = opts.autoGrantPermissions;

        if (appPackage) {
          context$1$0.next = 9;
          break;
        }

        throw new Error("'appPackage' option is required");

      case 9:
        context$1$0.next = 11;
        return _regeneratorRuntime.awrap(adb.isAppInstalled(appPackage));

      case 11:
        isInstalled = context$1$0.sent;

        if (!isInstalled) {
          context$1$0.next = 37;
          break;
        }

        context$1$0.prev = 13;
        context$1$0.next = 16;
        return _regeneratorRuntime.awrap(adb.forceStop(appPackage));

      case 16:
        context$1$0.next = 20;
        break;

      case 18:
        context$1$0.prev = 18;
        context$1$0.t0 = context$1$0['catch'](13);

      case 20:
        if (!(!fullReset && fastReset)) {
          context$1$0.next = 37;
          break;
        }

        context$1$0.next = 23;
        return _regeneratorRuntime.awrap(adb.clear(appPackage));

      case 23:
        output = context$1$0.sent;

        if (!(_lodash2['default'].isString(output) && output.toLowerCase().includes('failed'))) {
          context$1$0.next = 26;
          break;
        }

        throw new Error('Cannot clear the application data of \'' + appPackage + '\'. Original error: ' + output);

      case 26:
        if (!autoGrantPermissions) {
          context$1$0.next = 35;
          break;
        }

        context$1$0.prev = 27;
        context$1$0.next = 30;
        return _regeneratorRuntime.awrap(adb.grantAllPermissions(appPackage));

      case 30:
        context$1$0.next = 35;
        break;

      case 32:
        context$1$0.prev = 32;
        context$1$0.t1 = context$1$0['catch'](27);

        _logger2['default'].error('Unable to grant permissions requested. Original error: ' + context$1$0.t1.message);

      case 35:
        _logger2['default'].debug('Performed fast reset on the installed \'' + appPackage + '\' application (stop and clear)');
        return context$1$0.abrupt('return');

      case 37:
        if (app) {
          context$1$0.next = 39;
          break;
        }

        throw new Error("'app' option is required for reinstall");

      case 39:

        _logger2['default'].debug('Running full reset on \'' + appPackage + '\' (reinstall)');

        if (!isInstalled) {
          context$1$0.next = 43;
          break;
        }

        context$1$0.next = 43;
        return _regeneratorRuntime.awrap(adb.uninstallApk(appPackage));

      case 43:
        context$1$0.next = 45;
        return _regeneratorRuntime.awrap(adb.install(app, {
          grantPermissions: autoGrantPermissions,
          timeout: androidInstallTimeout
        }));

      case 45:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[13, 18], [27, 32]]);
};

helpers.installApk = function callee$0$0(adb) {
  var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var app, appPackage, fastReset, fullReset, _opts$androidInstallTimeout2, androidInstallTimeout, autoGrantPermissions, shouldPerformFastReset;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        app = opts.app;
        appPackage = opts.appPackage;
        fastReset = opts.fastReset;
        fullReset = opts.fullReset;
        _opts$androidInstallTimeout2 = opts.androidInstallTimeout;
        androidInstallTimeout = _opts$androidInstallTimeout2 === undefined ? PACKAGE_INSTALL_TIMEOUT : _opts$androidInstallTimeout2;
        autoGrantPermissions = opts.autoGrantPermissions;

        if (!(!app || !appPackage)) {
          context$1$0.next = 9;
          break;
        }

        throw new Error("'app' and 'appPackage' options are required");

      case 9:
        if (!fullReset) {
          context$1$0.next = 13;
          break;
        }

        context$1$0.next = 12;
        return _regeneratorRuntime.awrap(this.resetApp(adb, opts));

      case 12:
        return context$1$0.abrupt('return');

      case 13:
        context$1$0.t0 = fastReset;

        if (!context$1$0.t0) {
          context$1$0.next = 18;
          break;
        }

        context$1$0.next = 17;
        return _regeneratorRuntime.awrap(adb.isAppInstalled(appPackage));

      case 17:
        context$1$0.t0 = context$1$0.sent;

      case 18:
        shouldPerformFastReset = context$1$0.t0;
        context$1$0.next = 21;
        return _regeneratorRuntime.awrap(adb.installOrUpgrade(app, appPackage, {
          grantPermissions: autoGrantPermissions,
          timeout: androidInstallTimeout
        }));

      case 21:
        if (!shouldPerformFastReset) {
          context$1$0.next = 25;
          break;
        }

        _logger2['default'].info('Performing fast reset on \'' + appPackage + '\'');
        context$1$0.next = 25;
        return _regeneratorRuntime.awrap(this.resetApp(adb, opts));

      case 25:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

/**
 * Installs an array of apks
 * @param {ADB} adb Instance of Appium ADB object
 * @param {Object} opts Opts defined in driver.js
 */
helpers.installOtherApks = function callee$0$0(otherApps, adb, opts) {
  var _opts$androidInstallTimeout3, androidInstallTimeout, autoGrantPermissions;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _opts$androidInstallTimeout3 = opts.androidInstallTimeout;
        androidInstallTimeout = _opts$androidInstallTimeout3 === undefined ? PACKAGE_INSTALL_TIMEOUT : _opts$androidInstallTimeout3;
        autoGrantPermissions = opts.autoGrantPermissions;
        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(_bluebird2['default'].all(otherApps.map(function (otherApp) {
          _logger2['default'].debug('Installing app: ' + otherApp);
          return adb.installOrUpgrade(otherApp, null, {
            grantPermissions: autoGrantPermissions,
            timeout: androidInstallTimeout
          });
        })));

      case 5:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.initUnicodeKeyboard = function callee$0$0(adb) {
  var defaultIME, appiumIME;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _logger2['default'].debug('Enabling Unicode keyboard support');
        _logger2['default'].debug("Pushing unicode ime to device...");
        context$1$0.next = 4;
        // return _regeneratorRuntime.awrap(adb.install(_appiumAndroidIme.path, { replace: false }));
		return context$1$0.abrupt('return',defaultIME);
      case 4:
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(adb.defaultIME());

      case 6:
        defaultIME = context$1$0.sent;

        _logger2['default'].debug('Unsetting previous IME ' + defaultIME);
        appiumIME = 'io.appium.android.ime/.UnicodeIME';

        _logger2['default'].debug('Setting IME to \'' + appiumIME + '\'');
        context$1$0.next = 12;
        return _regeneratorRuntime.awrap(adb.enableIME(appiumIME));

      case 12:
        context$1$0.next = 14;
        return _regeneratorRuntime.awrap(adb.setIME(appiumIME));

      case 14:
        return context$1$0.abrupt('return', defaultIME);

      case 15:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.setMockLocationApp = function callee$0$0(adb, app) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(adb.getApiLevel());

      case 3:
        context$1$0.t0 = context$1$0.sent;

        if (!(context$1$0.t0 < 23)) {
          context$1$0.next = 9;
          break;
        }

        context$1$0.next = 7;
        return _regeneratorRuntime.awrap(adb.shell(['settings', 'put', 'secure', 'mock_location', '1']));

      case 7:
        context$1$0.next = 11;
        break;

      case 9:
        context$1$0.next = 11;
        return _regeneratorRuntime.awrap(adb.shell(['appops', 'set', app, 'android:mock_location', 'allow']));

      case 11:
        context$1$0.next = 16;
        break;

      case 13:
        context$1$0.prev = 13;
        context$1$0.t1 = context$1$0['catch'](0);

        _logger2['default'].warn('Unable to set mock location for app \'' + app + '\': ' + context$1$0.t1.message);

      case 16:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[0, 13]]);
};

helpers.installHelperApp = function callee$0$0(adb, apkPath, packageId, appName) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(adb.installOrUpgrade(apkPath, packageId, { grantPermissions: true }));

      case 3:
        context$1$0.next = 8;
        break;

      case 5:
        context$1$0.prev = 5;
        context$1$0.t0 = context$1$0['catch'](0);

        _logger2['default'].warn('Ignored error while installing Appium ' + appName + ' helper: ' + ('\'' + context$1$0.t0.message + '\'. Manually uninstalling the application ') + ('with package id \'' + packageId + '\' may help. Expect some Appium ') + 'features may not work as expected unless this problem is ' + 'fixed.');

      case 8:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[0, 5]]);
};

helpers.pushSettingsApp = function callee$0$0(adb) {
  var throwError = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _logger2['default'].debug("Pushing settings apk to device...");

        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(helpers.installHelperApp(adb, _ioAppiumSettings.path, SETTINGS_HELPER_PKG_ID, 'Settings'));

      case 3:
        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(adb.processExists(SETTINGS_HELPER_PKG_ID));

      case 5:
        if (!context$1$0.sent) {
          context$1$0.next = 8;
          break;
        }

        _logger2['default'].debug(SETTINGS_HELPER_PKG_ID + ' is already running. ' + 'There is no need to reset its permissions.');
        return context$1$0.abrupt('return');

      case 8:
        context$1$0.prev = 8;
        context$1$0.next = 11;
        return _regeneratorRuntime.awrap(adb.startApp({
          pkg: SETTINGS_HELPER_PKG_ID,
          activity: SETTINGS_HELPER_PKG_ACTIVITY,
          action: "android.intent.action.MAIN",
          category: "android.intent.category.LAUNCHER",
          flags: "0x10200000",
          stopApp: false
        }));

      case 11:
        context$1$0.next = 18;
        break;

      case 13:
        context$1$0.prev = 13;
        context$1$0.t0 = context$1$0['catch'](8);

        _logger2['default'].warn('Failed to launch settings app: ' + context$1$0.t0.message);

        if (!throwError) {
          context$1$0.next = 18;
          break;
        }

        throw context$1$0.t0;

      case 18:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[8, 13]]);
};

helpers.pushUnlock = function callee$0$0(adb) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _logger2['default'].debug("Pushing unlock helper app to device...");

        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(helpers.installHelperApp(adb, _appiumUnlock.path, UNLOCK_HELPER_PKG_ID, 'Unlock'));

      case 3:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

/**
 * Extracts string.xml and converts it to string.json and pushes
 * it to /data/local/tmp/string.json on for use of bootstrap
 * If app is not present to extract string.xml it deletes remote strings.json
 * If app does not have strings.xml we push an empty json object to remote
 *
 * @param {?string} language - Language abbreviation, for example 'fr'. The default language
 * is used if this argument is not defined.
 * @param {Object} adb - The adb mofdule instance.
 * @param {Object} opts - Driver options dictionary.
 * @returns {Object} The dictionary, where string resourtces identifiers are keys
 * along with their corresponding values for the given language or an empty object
 * if no matching resources were extracted.
 */
helpers.pushStrings = function callee$0$0(language, adb, opts) {
  var remoteDir, stringsJson, remoteFile, stringsTmpDir, _ref3, apkStrings, localPath;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        remoteDir = '/data/local/tmp';
        stringsJson = 'strings.json';
        remoteFile = remoteDir + '/' + stringsJson;
        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(adb.rimraf(remoteFile));

      case 5:
        context$1$0.t0 = _lodash2['default'].isEmpty(opts.appPackage);

        if (context$1$0.t0) {
          context$1$0.next = 10;
          break;
        }

        context$1$0.next = 9;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.exists(opts.app));

      case 9:
        context$1$0.t0 = !context$1$0.sent;

      case 10:
        if (!context$1$0.t0) {
          context$1$0.next = 12;
          break;
        }

        return context$1$0.abrupt('return', {});

      case 12:
        stringsTmpDir = _path2['default'].resolve(opts.tmpDir, opts.appPackage);
        context$1$0.prev = 13;

        _logger2['default'].debug('Extracting strings from apk', opts.app, language, stringsTmpDir);
        context$1$0.next = 17;
        return _regeneratorRuntime.awrap(adb.extractStringsFromApk(opts.app, language, stringsTmpDir));

      case 17:
        _ref3 = context$1$0.sent;
        apkStrings = _ref3.apkStrings;
        localPath = _ref3.localPath;
        context$1$0.next = 22;
        return _regeneratorRuntime.awrap(adb.push(localPath, remoteDir));

      case 22:
        return context$1$0.abrupt('return', apkStrings);

      case 25:
        context$1$0.prev = 25;
        context$1$0.t1 = context$1$0['catch'](13);

        _logger2['default'].warn('Could not get strings, continuing anyway. Original error: ' + context$1$0.t1.message);
        context$1$0.next = 30;
        return _regeneratorRuntime.awrap(adb.shell('echo', ['\'{}\' > ' + remoteFile]));

      case 30:
        context$1$0.prev = 30;
        context$1$0.next = 33;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.rimraf(stringsTmpDir));

      case 33:
        return context$1$0.finish(30);

      case 34:
        return context$1$0.abrupt('return', {});

      case 35:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[13, 25, 30, 34]]);
};

helpers.unlockWithUIAutomation = function callee$0$0(driver, adb, unlockCapabilities) {
  var _PIN_UNLOCK$PASSWORD_UNLOCK$PATTERN_UNLOCK$FINGERPRINT_UNLOCK$unlockType;

  var unlockType, unlockKey, unlockMethod;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        unlockType = unlockCapabilities.unlockType;

        if (_unlockHelpers2['default'].isValidUnlockType(unlockType)) {
          context$1$0.next = 3;
          break;
        }

        throw new Error('Invalid unlock type ' + unlockType);

      case 3:
        unlockKey = unlockCapabilities.unlockKey;

        if (_unlockHelpers2['default'].isValidKey(unlockType, unlockKey)) {
          context$1$0.next = 6;
          break;
        }

        throw new Error('Missing unlockKey ' + unlockKey + ' capability for unlockType ' + unlockType);

      case 6:
        unlockMethod = (_PIN_UNLOCK$PASSWORD_UNLOCK$PATTERN_UNLOCK$FINGERPRINT_UNLOCK$unlockType = {}, _defineProperty(_PIN_UNLOCK$PASSWORD_UNLOCK$PATTERN_UNLOCK$FINGERPRINT_UNLOCK$unlockType, _unlockHelpers.PIN_UNLOCK, _unlockHelpers2['default'].pinUnlock), _defineProperty(_PIN_UNLOCK$PASSWORD_UNLOCK$PATTERN_UNLOCK$FINGERPRINT_UNLOCK$unlockType, _unlockHelpers.PASSWORD_UNLOCK, _unlockHelpers2['default'].passwordUnlock), _defineProperty(_PIN_UNLOCK$PASSWORD_UNLOCK$PATTERN_UNLOCK$FINGERPRINT_UNLOCK$unlockType, _unlockHelpers.PATTERN_UNLOCK, _unlockHelpers2['default'].patternUnlock), _defineProperty(_PIN_UNLOCK$PASSWORD_UNLOCK$PATTERN_UNLOCK$FINGERPRINT_UNLOCK$unlockType, _unlockHelpers.FINGERPRINT_UNLOCK, _unlockHelpers2['default'].fingerprintUnlock), _PIN_UNLOCK$PASSWORD_UNLOCK$PATTERN_UNLOCK$FINGERPRINT_UNLOCK$unlockType)[unlockType];
        context$1$0.next = 9;
        return _regeneratorRuntime.awrap(unlockMethod(adb, driver, unlockCapabilities));

      case 9:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.unlockWithHelperApp = function callee$0$0(adb) {
  var startOpts, firstRun;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _logger2['default'].info("Unlocking screen");

        context$1$0.prev = 1;
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(adb.forceStop(UNLOCK_HELPER_PKG_ID));

      case 4:
        context$1$0.next = 9;
        break;

      case 6:
        context$1$0.prev = 6;
        context$1$0.t0 = context$1$0['catch'](1);

        // Sometimes we can see the below error, but we can ignore it.
        // [W3C] Encountered internal error running command: Error: Error executing adbExec. Original error: 'Command 'adb -P 5037 -s emulator-5554 shell am force-stop io.appium.unlock' timed out after 20000ms'; Stderr: ''; Code: 'null'
        _logger2['default'].warn('An error in unlockWithHelperApp: ' + context$1$0.t0.message);

      case 9:
        startOpts = {
          pkg: UNLOCK_HELPER_PKG_ID,
          activity: UNLOCK_HELPER_PKG_ACTIVITY,
          action: "android.intent.action.MAIN",
          category: "android.intent.category.LAUNCHER",
          flags: "0x10200000",
          stopApp: false,
          retry: false,
          waitDuration: 1000
        };
        firstRun = true;
        context$1$0.next = 13;
        return _regeneratorRuntime.awrap((0, _asyncbox.retry)(3, function callee$1$0() {
          return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                if (!firstRun) {
                  context$2$0.next = 4;
                  break;
                }

                firstRun = false;
                context$2$0.next = 16;
                break;

              case 4:
                context$2$0.prev = 4;
                context$2$0.next = 7;
                return _regeneratorRuntime.awrap(adb.isScreenLocked());

              case 7:
                if (context$2$0.sent) {
                  context$2$0.next = 9;
                  break;
                }

                return context$2$0.abrupt('return');

              case 9:
                context$2$0.next = 16;
                break;

              case 11:
                context$2$0.prev = 11;
                context$2$0.t0 = context$2$0['catch'](4);

                _logger2['default'].warn('Error in isScreenLocked: ' + context$2$0.t0.message);
                _logger2['default'].warn("\"adb shell dumpsys window\" command has timed out.");
                _logger2['default'].warn("The reason of this timeout is the delayed adb response. Resetting adb server can improve it.");

              case 16:

                _logger2['default'].info('Launching ' + UNLOCK_HELPER_PKG_ID);

                // The command takes too much time so we should not call the command over twice continuously.
                context$2$0.next = 19;
                return _regeneratorRuntime.awrap(adb.startApp(startOpts));

              case 19:
              case 'end':
                return context$2$0.stop();
            }
          }, null, this, [[4, 11]]);
        }));

      case 13:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[1, 6]]);
};

helpers.unlock = function callee$0$0(driver, adb, capabilities) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(adb.isScreenLocked());

      case 2:
        if (context$1$0.sent) {
          context$1$0.next = 5;
          break;
        }

        _logger2['default'].info("Screen already unlocked, doing nothing");
        return context$1$0.abrupt('return');

      case 5:

        _logger2['default'].debug("Screen is locked, trying to unlock");

        if (!_lodash2['default'].isUndefined(capabilities.unlockType)) {
          context$1$0.next = 12;
          break;
        }

        _logger2['default'].warn("Using app unlock, this is going to be deprecated!");
        context$1$0.next = 10;
        return _regeneratorRuntime.awrap(helpers.unlockWithHelperApp(adb));
	
      case 10:
        context$1$0.next = 16;
        break;

      case 12:
        context$1$0.next = 14;
        return _regeneratorRuntime.awrap(helpers.unlockWithUIAutomation(driver, adb, { unlockType: capabilities.unlockType, unlockKey: capabilities.unlockKey }));

      case 14:
        context$1$0.next = 16;
        return _regeneratorRuntime.awrap(helpers.verifyUnlock(adb));

      case 16:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.verifyUnlock = function callee$0$0(adb) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    var _this = this;

    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap((0, _asyncbox.retryInterval)(2, 1000, function callee$1$0() {
          return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                context$2$0.next = 2;
                return _regeneratorRuntime.awrap(adb.isScreenLocked());

              case 2:
                if (!context$2$0.sent) {
                  context$2$0.next = 4;
                  break;
                }

                throw new Error("Screen did not unlock successfully, retrying");

              case 4:
                _logger2['default'].debug("Screen unlocked successfully");

              case 5:
              case 'end':
                return context$2$0.stop();
            }
          }, null, _this);
        }));

      case 2:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.initDevice = function callee$0$0(adb, opts) {
  var defaultIME;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(adb.waitForDevice());

      case 2:
        if (opts.avd) {
          context$1$0.next = 7;
          break;
        }

        context$1$0.next = 5;
        // return _regeneratorRuntime.awrap(helpers.pushSettingsApp(adb));
		return context$1$0.abrupt('return',defaultIME);

      case 5:
        context$1$0.next = 7;
        return _regeneratorRuntime.awrap(helpers.setMockLocationApp(adb, SETTINGS_HELPER_PKG_ID));

      case 7:
        context$1$0.next = 9;
        return _regeneratorRuntime.awrap(helpers.ensureDeviceLocale(adb, opts.language, opts.locale));

      case 9:
        context$1$0.next = 11;
        return _regeneratorRuntime.awrap(adb.startLogcat());

      case 11:
        defaultIME = undefined;

        if (!opts.unicodeKeyboard) {
          context$1$0.next = 16;
          break;
        }

        context$1$0.next = 15;
        return _regeneratorRuntime.awrap(helpers.initUnicodeKeyboard(adb));

      case 15:
        defaultIME = context$1$0.sent;

      case 16:
        if (!_lodash2['default'].isUndefined(opts.unlockType)) {
          context$1$0.next = 19;
          break;
        }

        context$1$0.next = 19;
        // return _regeneratorRuntime.awrap(helpers.pushUnlock(adb));
		return context$1$0.abrupt('return',defaultIME);

      case 19:
        return context$1$0.abrupt('return', defaultIME);

      case 20:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.removeNullProperties = function (obj) {
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = _getIterator(_lodash2['default'].keys(obj)), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var key = _step3.value;

      if (_lodash2['default'].isNull(obj[key]) || _lodash2['default'].isUndefined(obj[key])) {
        delete obj[key];
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3['return']) {
        _iterator3['return']();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }
};

helpers.truncateDecimals = function (number, digits) {
  var multiplier = Math.pow(10, digits),
      adjustedNum = number * multiplier,
      truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

  return truncatedNum / multiplier;
};

helpers.isChromeBrowser = function (browser) {
  return _lodash2['default'].includes(_Object$keys(CHROME_BROWSER_PACKAGE_ACTIVITY), (browser || '').toLowerCase());
};

helpers.getChromePkg = function (browser) {
  return CHROME_BROWSER_PACKAGE_ACTIVITY[browser.toLowerCase()] || CHROME_BROWSER_PACKAGE_ACTIVITY['default'];
};

helpers.removeAllSessionWebSocketHandlers = function callee$0$0(server, sessionId) {
  var activeHandlers, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, pathname;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!(!server || !_lodash2['default'].isFunction(server.getWebSocketHandlers))) {
          context$1$0.next = 2;
          break;
        }

        return context$1$0.abrupt('return');

      case 2:
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(server.getWebSocketHandlers(sessionId));

      case 4:
        activeHandlers = context$1$0.sent;
        _iteratorNormalCompletion4 = true;
        _didIteratorError4 = false;
        _iteratorError4 = undefined;
        context$1$0.prev = 8;
        _iterator4 = _getIterator(_lodash2['default'].keys(activeHandlers));

      case 10:
        if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
          context$1$0.next = 17;
          break;
        }

        pathname = _step4.value;
        context$1$0.next = 14;
        return _regeneratorRuntime.awrap(server.removeWebSocketHandler(pathname));

      case 14:
        _iteratorNormalCompletion4 = true;
        context$1$0.next = 10;
        break;

      case 17:
        context$1$0.next = 23;
        break;

      case 19:
        context$1$0.prev = 19;
        context$1$0.t0 = context$1$0['catch'](8);
        _didIteratorError4 = true;
        _iteratorError4 = context$1$0.t0;

      case 23:
        context$1$0.prev = 23;
        context$1$0.prev = 24;

        if (!_iteratorNormalCompletion4 && _iterator4['return']) {
          _iterator4['return']();
        }

      case 26:
        context$1$0.prev = 26;

        if (!_didIteratorError4) {
          context$1$0.next = 29;
          break;
        }

        throw _iteratorError4;

      case 29:
        return context$1$0.finish(26);

      case 30:
        return context$1$0.finish(23);

      case 31:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[8, 19, 23, 31], [24,, 26, 30]]);
};

/**
 * Takes a desired capability and tries to JSON.parse it as an array,
 * and either returns the parsed array or a singleton array.
 *
 * @param {any} cap A desired capability
 */
helpers.parseArray = function (cap) {
  var parsedCaps = undefined;
  try {
    parsedCaps = JSON.parse(cap);
  } catch (ign) {}

  if (_lodash2['default'].isArray(parsedCaps)) {
    return parsedCaps;
  } else if (_lodash2['default'].isString(cap)) {
    return [cap];
  }

  throw new Error('must provide a string or JSON Array; received ' + cap);
};

helpers.bootstrap = _appiumAndroidBootstrap2['default'];
helpers.unlocker = _unlockHelpers2['default'];

exports['default'] = helpers;
module.exports = exports['default'];

// we can create a throwaway ADB instance here, so there is no dependency
// on instantiating on earlier (at this point, we have no udid)
// we can only use this ADB object for commands that would not be confused
// if multiple devices are connected

// a specific avd name was given. try to initialize with that

// udid was given, lets try to init with that device

// first try started devices/emulators

// direct adb calls to the specific device

// fullReset has priority over fastReset

// executing `shell pm clear` resets previously assigned application permissions as well

// There is no need to reset the newly installed app

// Install all of the APK's asynchronously

// get the default IME so we can return back to it later if we want

// Reinstall will stop the settings helper process anyway, so
// there is no need to continue if the application is still running

// lauch io.appium.settings app due to settings failing to be set
// if the app is not launched prior to start the session on android 7+
// see https://github.com/appium/appium/issues/8957

// clean up remote string.json if present

// Unlock succeed with a couple of retries.

// To reduce a time to call adb.isScreenLocked() since `adb shell dumpsys window` is easy to hang adb commands

// pushSettingsApp required before calling ensureDeviceLocale for API Level 24+
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9hbmRyb2lkLWhlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztzQkFBYyxRQUFROzs7O29CQUNMLE1BQU07Ozs7NEJBQ0YsY0FBYzs7d0JBQ0UsVUFBVTs7c0JBQzVCLFVBQVU7Ozs7NkJBQ1YsZ0JBQWdCOztnQ0FDSSxvQkFBb0I7O2dDQUNuQixvQkFBb0I7OzRCQUN0QixlQUFlOztzQ0FDL0IsMEJBQTBCOzs7O3dCQUNsQyxVQUFVOzs7O3lCQUVSLFlBQVk7Ozs7NkJBQ3lFLGtCQUFrQjs7OztBQUd2SCxJQUFNLHVCQUF1QixHQUFHLEtBQUssQ0FBQztBQUN0QyxJQUFNLCtCQUErQixHQUFHO0FBQ3RDLFFBQU0sRUFBRTtBQUNOLE9BQUcsRUFBRSxvQkFBb0I7QUFDekIsWUFBUSxFQUFFLHFDQUFxQztHQUNoRDtBQUNELFVBQVEsRUFBRTtBQUNSLE9BQUcsRUFBRSwyQkFBMkI7QUFDaEMsWUFBUSxFQUFFLHNCQUFzQjtHQUNqQztBQUNELFlBQVUsRUFBRTtBQUNWLE9BQUcsRUFBRSxpQkFBaUI7QUFDdEIsWUFBUSxFQUFFLHFDQUFxQztHQUNoRDtBQUNELFNBQU8sRUFBRTtBQUNQLE9BQUcsRUFBRSxxQkFBcUI7QUFDMUIsWUFBUSxFQUFFLHFDQUFxQztHQUNoRDtBQUNELG9CQUFrQixFQUFFO0FBQ2xCLE9BQUcsRUFBRSxxQkFBcUI7QUFDMUIsWUFBUSxFQUFFLHFDQUFxQztHQUNoRDtBQUNELG9CQUFrQixFQUFFO0FBQ2xCLE9BQUcsRUFBRSw0QkFBNEI7QUFDakMsWUFBUSxFQUFFLG1EQUFtRDtHQUM5RDtBQUNELGFBQVM7QUFDUCxPQUFHLEVBQUUsb0JBQW9CO0FBQ3pCLFlBQVEsRUFBRSxxQ0FBcUM7R0FDaEQ7Q0FDRixDQUFDO0FBQ0YsSUFBTSxzQkFBc0IsR0FBRyxvQkFBb0IsQ0FBQztBQUNwRCxJQUFNLDRCQUE0QixHQUFHLFdBQVcsQ0FBQztBQUNqRCxJQUFNLG9CQUFvQixHQUFHLGtCQUFr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UTs7Ozs7Y0FMZixDQUFDLE1BQU0sSUFBSSxDQUFDLG9CQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsQ0FBQTs7Ozs7Ozs7O3lDQUk1QixNQUFNLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDOzs7QUFBN0Qsc0JBQWM7Ozs7O2tDQUNHLG9CQUFFLElBQUksQ0FBQyxjQUFjLENBQUM7Ozs7Ozs7O0FBQWxDLGdCQUFROzt5Q0FDWCxNQUFNLENBQUMsc0JBQXNCLENBQUMsUUFBUSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBRWhELENBQUM7Ozs7Ozs7O0FBUUYsT0FBTyxDQUFDLFVBQVUsR0FBRyxVQUFVLEdBQUcsRUFBRTtBQUNsQyxNQUFJLFVBQVUsWUFBQSxDQUFDO0FBQ2YsTUFBSTtBQUNGLGNBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQzlCLENBQUMsT0FBTyxHQUFHLEVBQUUsRUFBRzs7QUFFakIsTUFBSSxvQkFBRSxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUU7QUFDekIsV0FBTyxVQUFVLENBQUM7R0FDbkIsTUFBTSxJQUFJLG9CQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUMxQixXQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7R0FDZDs7QUFFRCxRQUFNLElBQUksS0FBSyxvREFBa0QsR0FBRyxDQUFHLENBQUM7Q0FDekUsQ0FBQzs7QUFFRixPQUFPLENBQUMsU0FBUyxzQ0FBWSxDQUFDO0FBQzlCLE9BQU8sQ0FBQyxRQUFRLDZCQUFXLENBQUM7O3FCQUViLE9BQU8iLCJmaWxlIjoibGliL2FuZHJvaWQtaGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGV4ZWMgfSBmcm9tICd0ZWVuX3Byb2Nlc3MnO1xuaW1wb3J0IHsgcmV0cnksIHJldHJ5SW50ZXJ2YWwgfSBmcm9tICdhc3luY2JveCc7XG5pbXBvcnQgbG9nZ2VyIGZyb20gJy4vbG9nZ2VyJztcbmltcG9ydCB7IGZzIH0gZnJvbSAnYXBwaXVtLXN1cHBvcnQnO1xuaW1wb3J0IHsgcGF0aCBhcyB1bmljb2RlSU1FUGF0aCB9IGZyb20gJ2FwcGl1bS1hbmRyb2lkLWltZSc7XG5pbXBvcnQgeyBwYXRoIGFzIHNldHRpbmdzQXBrUGF0aCB9IGZyb20gJ2lvLmFwcGl1bS5zZXR0aW5ncyc7XG5pbXBvcnQgeyBwYXRoIGFzIHVubG9ja0Fwa1BhdGggfSBmcm9tICdhcHBpdW0tdW5sb2NrJztcbmltcG9ydCBCb290c3RyYXAgZnJvbSAnYXBwaXVtLWFuZHJvaWQtYm9vdHN0cmFwJztcbmltcG9ydCBCIGZyb20gJ2JsdWViaXJkJztcblxuaW1wb3J0IEFEQiBmcm9tICdhcHBpdW0tYWRiJztcbmltcG9ydCB7IGRlZmF1bHQgYXMgdW5sb2NrZXIsIFBJTl9VTkxPQ0ssIFBBU1NXT1JEX1VOTE9DSywgUEFUVEVSTl9VTkxPQ0ssIEZJTkdFUlBSSU5UX1VOTE9DSyB9IGZyb20gJy4vdW5sb2NrLWhlbHBlcnMnO1xuXG5cbmNvbnN0IFBBQ0tBR0VfSU5TVEFMTF9USU1FT1VUID0gOTAwMDA7IC8vIG1pbGxpc2Vjb25kc1xuY29uc3QgQ0hST01FX0JST1dTRVJfUEFDS0FHRV9BQ1RJVklUWSA9IHtcbiAgY2hyb21lOiB7XG4gICAgcGtnOiAnY29tLmFuZHJvaWQuY2hyb21lJyxcbiAgICBhY3Rpdml0eTogJ2NvbS5nb29nbGUuYW5kcm9pZC5hcHBzLmNocm9tZS5NYWluJyxcbiAgfSxcbiAgY2hyb21pdW06IHtcbiAgICBwa2c6ICdvcmcuY2hyb21pdW0uY2hyb21lLnNoZWxsJyxcbiAgICBhY3Rpdml0eTogJy5DaHJvbWVTaGVsbEFjdGl2aXR5JyxcbiAgfSxcbiAgY2hyb21lYmV0YToge1xuICAgIHBrZzogJ2NvbS5jaHJvbWUuYmV0YScsXG4gICAgYWN0aXZpdHk6ICdjb20uZ29vZ2xlLmFuZHJvaWQuYXBwcy5jaHJvbWUuTWFpbicsXG4gIH0sXG4gIGJyb3dzZXI6IHtcbiAgICBwa2c6ICdjb20uYW5kcm9pZC5icm93c2VyJyxcbiAgICBhY3Rpdml0eTogJ2NvbS5hbmRyb2lkLmJyb3dzZXIuQnJvd3NlckFjdGl2aXR5JyxcbiAgfSxcbiAgJ2Nocm9taXVtLWJyb3dzZXInOiB7XG4gICAgcGtnOiAnb3JnLmNocm9taXVtLmNocm9tZScsXG4gICAgYWN0aXZpdHk6ICdjb20uZ29vZ2xlLmFuZHJvaWQuYXBwcy5jaHJvbWUuTWFpbicsXG4gIH0sXG4gICdjaHJvbWl1bS13ZWJ2aWV3Jzoge1xuICAgIHBrZzogJ29yZy5jaHJvbWl1bS53ZWJ2aWV3X3NoZWxsJyxcbiAgICBhY3Rpdml0eTogJ29yZy5jaHJvbWl1bS53ZWJ2aWV3X3NoZWxsLldlYlZpZXdCcm93c2VyQWN0aXZpdHknLFxuICB9LFxuICBkZWZhdWx0OiB7XG4gICAgcGtnOiAnY29tLmFuZHJvaWQuY2hyb21lJyxcbiAgICBhY3Rpdml0eTogJ2NvbS5nb29nbGUuYW5kcm9pZC5hcHBzLmNocm9tZS5NYWluJyxcbiAgfSxcbn07XG5jb25zdCBTRVRUSU5HU19IRUxQRVJfUEtHX0lEID0gJ2lvLmFwcGl1bS5zZXR0aW5ncyc7XG5jb25zdCBTRVRUSU5HU19IRUxQRVJfUEtHX0FDVElWSVRZID0gXCIuU2V0dGluZ3NcIjtcbmNvbnN0IFVOTE9DS19IRUxQRVJfUEtHX0lEID0gJ2lvLmFwcGl1bS51bmxvY2snO1xuY29uc3QgVU5MT0NLX0hFTFBFUl9QS0dfQUNUSVZJVFkgPSBcIi5VbmxvY2tcIjtcblxubGV0IGhlbHBlcnMgPSB7fTtcblxuaGVscGVycy5wYXJzZUphdmFWZXJzaW9uID0gZnVuY3Rpb24gKHN0ZGVycikge1xuICBsZXQgbGluZXMgPSBzdGRlcnIuc3BsaXQoXCJcXG5cIik7XG4gIGZvciAobGV0IGxpbmUgb2YgbGluZXMpIHtcbiAgICBpZiAobmV3IFJlZ0V4cCgvKGphdmF8b3BlbmpkaykgdmVyc2lvbi8pLnRlc3QobGluZSkpIHtcbiAgICAgIHJldHVybiBsaW5lLnNwbGl0KFwiIFwiKVsyXS5yZXBsYWNlKC9cIi9nLCAnJyk7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuaGVscGVycy5nZXRKYXZhVmVyc2lvbiA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgbG9nZ2VyLmRlYnVnKFwiR2V0dGluZyBKYXZhIHZlcnNpb25cIik7XG5cbiAgbGV0IHtzdGRlcnJ9ID0gYXdhaXQgZXhlYygnamF2YScsIFsnLXZlcnNpb24nXSk7XG4gIGxldCBqYXZhVmVyID0gaGVscGVycy5wYXJzZUphdmFWZXJzaW9uKHN0ZGVycik7XG4gIGlmIChqYXZhVmVyID09PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGQgbm90IGdldCB0aGUgSmF2YSB2ZXJzaW9uLiBJcyBKYXZhIGluc3RhbGxlZD9cIik7XG4gIH1cbiAgbG9nZ2VyLmluZm8oYEphdmEgdmVyc2lvbiBpczogJHtqYXZhVmVyfWApO1xuICByZXR1cm4gamF2YVZlcjtcbn07XG5cbmhlbHBlcnMucHJlcGFyZUVtdWxhdG9yID0gYXN5bmMgZnVuY3Rpb24gKGFkYiwgb3B0cykge1xuICBsZXQge2F2ZCwgYXZkQXJncywgbGFuZ3VhZ2UsIGxvY2FsZSwgYXZkTGF1bmNoVGltZW91dCxcbiAgICAgICBhdmRSZWFkeVRpbWVvdXR9ID0gb3B0cztcbiAgaWYgKCFhdmQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgbGF1bmNoIEFWRCB3aXRob3V0IEFWRCBuYW1lXCIpO1xuICB9XG4gIGxldCBhdmROYW1lID0gYXZkLnJlcGxhY2UoJ0AnLCAnJyk7XG4gIGxldCBydW5uaW5nQVZEID0gYXdhaXQgYWRiLmdldFJ1bm5pbmdBVkQoYXZkTmFtZSk7XG4gIGlmIChydW5uaW5nQVZEICE9PSBudWxsKSB7XG4gICAgaWYgKGF2ZEFyZ3MgJiYgYXZkQXJncy50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCItd2lwZS1kYXRhXCIpID4gLTEpIHtcbiAgICAgIGxvZ2dlci5kZWJ1ZyhgS2lsbGluZyAnJHthdmROYW1lfScgYmVjYXVzZSBpdCBuZWVkcyB0byBiZSB3aXBlZCBhdCBzdGFydC5gKTtcbiAgICAgIGF3YWl0IGFkYi5raWxsRW11bGF0b3IoYXZkTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZ2dlci5kZWJ1ZyhcIk5vdCBsYXVuY2hpbmcgQVZEIGJlY2F1c2UgaXQgaXMgYWxyZWFkeSBydW5uaW5nLlwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgYXZkQXJncyA9IHRoaXMucHJlcGFyZUFWREFyZ3Mob3B0cywgYWRiLCBhdmRBcmdzKTtcbiAgYXdhaXQgYWRiLmxhdW5jaEFWRChhdmQsIGF2ZEFyZ3MsIGxhbmd1YWdlLCBsb2NhbGUsIGF2ZExhdW5jaFRpbWVvdXQsXG4gICAgICAgICAgICAgICAgICAgICAgYXZkUmVhZHlUaW1lb3V0KTtcbn07XG5cbmhlbHBlcnMucHJlcGFyZUFWREFyZ3MgPSBmdW5jdGlvbiAob3B0cywgYWRiLCBhdmRBcmdzKSB7XG4gIGxldCBhcmdzID0gYXZkQXJncyA/IFthdmRBcmdzXSA6IFtdO1xuICBpZiAoIV8uaXNVbmRlZmluZWQob3B0cy5uZXR3b3JrU3BlZWQpKSB7XG4gICAgbGV0IG5ldHdvcmtTcGVlZCA9IHRoaXMuZW5zdXJlTmV0d29ya1NwZWVkKGFkYiwgb3B0cy5uZXR3b3JrU3BlZWQpO1xuICAgIGFyZ3MucHVzaCgnLW5ldHNwZWVkJywgbmV0d29ya1NwZWVkKTtcbiAgfVxuICBpZiAob3B0cy5pc0hlYWRsZXNzKSB7XG4gICAgYXJncy5wdXNoKCctbm8td2luZG93Jyk7XG4gIH1cbiAgcmV0dXJuIGFyZ3Muam9pbignICcpO1xufTtcblxuaGVscGVycy5lbnN1cmVOZXR3b3JrU3BlZWQgPSBmdW5jdGlvbiAoYWRiLCBuZXR3b3JrU3BlZWQpIHtcbiAgaWYgKF8udmFsdWVzKGFkYi5ORVRXT1JLX1NQRUVEKS5pbmRleE9mKG5ldHdvcmtTcGVlZCkgIT09IC0xKSB7XG4gICAgcmV0dXJuIG5ldHdvcmtTcGVlZDtcbiAgfVxuICBsb2dnZXIud2FybihgV3JvbmcgbmV0d29yayBzcGVlZCBwYXJhbSAke25ldHdvcmtTcGVlZH0sIHVzaW5nIGRlZmF1bHQ6IGZ1bGwuIFN1cHBvcnRlZCB2YWx1ZXM6ICR7Xy52YWx1ZXMoYWRiLk5FVFdPUktfU1BFRUQpfWApO1xuICByZXR1cm4gYWRiLk5FVFdPUktfU1BFRUQuRlVMTDtcbn07XG5cbmhlbHBlcnMuZW5zdXJlRGV2aWNlTG9jYWxlID0gYXN5bmMgZnVuY3Rpb24gKGFkYiwgbGFuZ3VhZ2UsIGNvdW50cnkpIHtcbiAgaWYgKCFfLmlzU3RyaW5nKGxhbmd1YWdlKSAmJiAhXy5pc1N0cmluZyhjb3VudHJ5KSkge1xuICAgIGxvZ2dlci53YXJuKGBzZXREZXZpY2VMYW5ndWFnZUNvdW50cnkgcmVxdWlyZXMgbGFuZ3VhZ2Ugb3IgY291bnRyeS5gKTtcbiAgICBsb2dnZXIud2FybihgR290IGxhbmd1YWdlOiAnJHtsYW5ndWFnZX0nIGFuZCBjb3VudHJ5OiAnJHtjb3VudHJ5fSdgKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBhd2FpdCBhZGIuc2V0RGV2aWNlTGFuZ3VhZ2VDb3VudHJ5KGxhbmd1YWdlLCBjb3VudHJ5KTtcblxuICBpZiAoIWF3YWl0IGFkYi5lbnN1cmVDdXJyZW50TG9jYWxlKGxhbmd1YWdlLCBjb3VudHJ5KSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIHNldCBsYW5ndWFnZTogJHtsYW5ndWFnZX0gYW5kIGNvdW50cnk6ICR7Y291bnRyeX1gKTtcbiAgfVxufTtcblxuaGVscGVycy5nZXREZXZpY2VJbmZvRnJvbUNhcHMgPSBhc3luYyBmdW5jdGlvbiAob3B0cyA9IHt9KSB7XG4gIC8vIHdlIGNhbiBjcmVhdGUgYSB0aHJvd2F3YXkgQURCIGluc3RhbmNlIGhlcmUsIHNvIHRoZXJlIGlzIG5vIGRlcGVuZGVuY3lcbiAgLy8gb24gaW5zdGFudGlhdGluZyBvbiBlYXJsaWVyIChhdCB0aGlzIHBvaW50LCB3ZSBoYXZlIG5vIHVkaWQpXG4gIC8vIHdlIGNhbiBvbmx5IHVzZSB0aGlzIEFEQiBvYmplY3QgZm9yIGNvbW1hbmRzIHRoYXQgd291bGQgbm90IGJlIGNvbmZ1c2VkXG4gIC8vIGlmIG11bHRpcGxlIGRldmljZXMgYXJlIGNvbm5lY3RlZFxuICBsZXQgYWRiID0gYXdhaXQgQURCLmNyZWF0ZUFEQih7XG4gICAgamF2YVZlcnNpb246IG9wdHMuamF2YVZlcnNpb24sXG4gICAgYWRiUG9ydDogb3B0cy5hZGJQb3J0LFxuICAgIHJlbW90ZUFkYkhvc3Q6IG9wdHMucmVtb3RlQWRiSG9zdCxcbiAgICBzdXBwcmVzc0tpbGxTZXJ2ZXI6IG9wdHMuc3VwcHJlc3NLaWxsU2VydmVyLFxuICAgIGNsZWFyRGV2aWNlTG9nc09uU3RhcnQ6IG9wdHMuY2xlYXJEZXZpY2VMb2dzT25TdGFydCxcbiAgfSk7XG4gIGxldCB1ZGlkID0gb3B0cy51ZGlkO1xuICBsZXQgZW1Qb3J0ID0gbnVsbDtcblxuICAvLyBhIHNwZWNpZmljIGF2ZCBuYW1lIHdhcyBnaXZlbi4gdHJ5IHRvIGluaXRpYWxpemUgd2l0aCB0aGF0XG4gIGlmIChvcHRzLmF2ZCkge1xuICAgIGF3YWl0IGhlbHBlcnMucHJlcGFyZUVtdWxhdG9yKGFkYiwgb3B0cyk7XG4gICAgdWRpZCA9IGFkYi5jdXJEZXZpY2VJZDtcbiAgICBlbVBvcnQgPSBhZGIuZW11bGF0b3JQb3J0O1xuICB9IGVsc2Uge1xuICAgIC8vIG5vIGF2ZCBnaXZlbi4gbGV0cyB0cnkgd2hhdGV2ZXIncyBwbHVnZ2VkIGluIGRldmljZXMvZW11bGF0b3JzXG4gICAgbG9nZ2VyLmluZm8oXCJSZXRyaWV2aW5nIGRldmljZSBsaXN0XCIpO1xuICAgIGxldCBkZXZpY2VzID0gYXdhaXQgYWRiLmdldERldmljZXNXaXRoUmV0cnkoKTtcblxuICAgIC8vIHVkaWQgd2FzIGdpdmVuLCBsZXRzIHRyeSB0byBpbml0IHdpdGggdGhhdCBkZXZpY2VcbiAgICBpZiAodWRpZCkge1xuICAgICAgaWYgKCFfLmluY2x1ZGVzKF8ubWFwKGRldmljZXMsICd1ZGlkJyksIHVkaWQpKSB7XG4gICAgICAgIGxvZ2dlci5lcnJvckFuZFRocm93KGBEZXZpY2UgJHt1ZGlkfSB3YXMgbm90IGluIHRoZSBsaXN0IGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgb2YgY29ubmVjdGVkIGRldmljZXNgKTtcbiAgICAgIH1cbiAgICAgIGVtUG9ydCA9IGFkYi5nZXRQb3J0RnJvbUVtdWxhdG9yU3RyaW5nKHVkaWQpO1xuICAgIH0gZWxzZSBpZiAob3B0cy5wbGF0Zm9ybVZlcnNpb24pIHtcbiAgICAgIG9wdHMucGxhdGZvcm1WZXJzaW9uID0gYCR7b3B0cy5wbGF0Zm9ybVZlcnNpb259YC50cmltKCk7XG5cbiAgICAgIC8vIGEgcGxhdGZvcm0gdmVyc2lvbiB3YXMgZ2l2ZW4uIGxldHMgdHJ5IHRvIGZpbmQgYSBkZXZpY2Ugd2l0aCB0aGUgc2FtZSBvc1xuICAgICAgbG9nZ2VyLmluZm8oYExvb2tpbmcgZm9yIGEgZGV2aWNlIHdpdGggQW5kcm9pZCAnJHtvcHRzLnBsYXRmb3JtVmVyc2lvbn0nYCk7XG5cbiAgICAgIC8vIGluIGNhc2Ugd2UgZmFpbCB0byBmaW5kIHNvbWV0aGluZywgZ2l2ZSB0aGUgdXNlciBhIHVzZWZ1bCBsb2cgdGhhdCBoYXNcbiAgICAgIC8vIHRoZSBkZXZpY2UgdWRpZHMgYW5kIG9zIHZlcnNpb25zIHNvIHRoZXkga25vdyB3aGF0J3MgYXZhaWxhYmxlXG4gICAgICBsZXQgYXZhaWxEZXZpY2VzU3RyID0gW107XG5cbiAgICAgIC8vIGZpcnN0IHRyeSBzdGFydGVkIGRldmljZXMvZW11bGF0b3JzXG4gICAgICBmb3IgKGxldCBkZXZpY2Ugb2YgZGV2aWNlcykge1xuICAgICAgICAvLyBkaXJlY3QgYWRiIGNhbGxzIHRvIHRoZSBzcGVjaWZpYyBkZXZpY2VcbiAgICAgICAgYXdhaXQgYWRiLnNldERldmljZUlkKGRldmljZS51ZGlkKTtcbiAgICAgICAgbGV0IGRldmljZU9TID0gYXdhaXQgYWRiLmdldFBsYXRmb3JtVmVyc2lvbigpO1xuXG4gICAgICAgIC8vIGJ1aWxkIHVwIG91ciBpbmZvIHN0cmluZyBvZiBhdmFpbGFibGUgZGV2aWNlcyBhcyB3ZSBpdGVyYXRlXG4gICAgICAgIGF2YWlsRGV2aWNlc1N0ci5wdXNoKGAke2RldmljZS51ZGlkfSAoJHtkZXZpY2VPU30pYCk7XG5cbiAgICAgICAgLy8gd2UgZG8gYSBiZWdpbnMgd2l0aCBjaGVjayBmb3IgaW1wbGllZCB3aWxkY2FyZCBtYXRjaGluZ1xuICAgICAgICAvLyBlZzogNCBtYXRjaGVzIDQuMSwgNC4wLCA0LjEuMy1zYW1zdW5nLCBldGNcbiAgICAgICAgaWYgKGRldmljZU9TLmluZGV4T2Yob3B0cy5wbGF0Zm9ybVZlcnNpb24pID09PSAwKSB7XG4gICAgICAgICAgdWRpZCA9IGRldmljZS51ZGlkO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHdlIGNvdWxkbid0IGZpbmQgYW55dGhpbmchIHF1aXRcbiAgICAgIGlmICghdWRpZCkge1xuICAgICAgICBsb2dnZXIuZXJyb3JBbmRUaHJvdyhgVW5hYmxlIHRvIGZpbmQgYW4gYWN0aXZlIGRldmljZSBvciBlbXVsYXRvciBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYHdpdGggT1MgJHtvcHRzLnBsYXRmb3JtVmVyc2lvbn0uIFRoZSBmb2xsb3dpbmcgYCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBhcmUgYXZhaWxhYmxlOiBgICsgYXZhaWxEZXZpY2VzU3RyLmpvaW4oJywgJykpO1xuICAgICAgfVxuXG4gICAgICBlbVBvcnQgPSBhZGIuZ2V0UG9ydEZyb21FbXVsYXRvclN0cmluZyh1ZGlkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gYSB1ZGlkIHdhcyBub3QgZ2l2ZW4sIGdyYWIgdGhlIGZpcnN0IGRldmljZSB3ZSBzZWVcbiAgICAgIHVkaWQgPSBkZXZpY2VzWzBdLnVkaWQ7XG4gICAgICBlbVBvcnQgPSBhZGIuZ2V0UG9ydEZyb21FbXVsYXRvclN0cmluZyh1ZGlkKTtcbiAgICB9XG4gIH1cblxuICBsb2dnZXIuaW5mbyhgVXNpbmcgZGV2aWNlOiAke3VkaWR9YCk7XG4gIHJldHVybiB7dWRpZCwgZW1Qb3J0fTtcbn07XG5cbi8vIHJldHVybnMgYSBuZXcgYWRiIGluc3RhbmNlIHdpdGggZGV2aWNlSWQgc2V0XG5oZWxwZXJzLmNyZWF0ZUFEQiA9IGFzeW5jIGZ1bmN0aW9uIChqYXZhVmVyc2lvbiwgdWRpZCwgZW1Qb3J0LCBhZGJQb3J0LCBzdXBwcmVzc0tpbGxTZXJ2ZXIsIHJlbW90ZUFkYkhvc3QsIGNsZWFyRGV2aWNlTG9nc09uU3RhcnQpIHtcbiAgbGV0IGFkYiA9IGF3YWl0IEFEQi5jcmVhdGVBREIoe1xuICAgIGphdmFWZXJzaW9uLFxuICAgIGFkYlBvcnQsXG4gICAgc3VwcHJlc3NLaWxsU2VydmVyLFxuICAgIHJlbW90ZUFkYkhvc3QsXG4gICAgY2xlYXJEZXZpY2VMb2dzT25TdGFydCxcbiAgfSk7XG5cbiAgYWRiLnNldERldmljZUlkKHVkaWQpO1xuICBpZiAoZW1Qb3J0KSB7XG4gICAgYWRiLnNldEVtdWxhdG9yUG9ydChlbVBvcnQpO1xuICB9XG5cbiAgcmV0dXJuIGFkYjtcbn07XG5cbmhlbHBlcnMuZ2V0TGF1bmNoSW5mbyA9IGFzeW5jIGZ1bmN0aW9uIChhZGIsIG9wdHMpIHtcbiAgbGV0IHthcHAsIGFwcFBhY2thZ2UsIGFwcEFjdGl2aXR5LCBhcHBXYWl0UGFja2FnZSwgYXBwV2FpdEFjdGl2aXR5fSA9IG9wdHM7XG4gIGlmICghYXBwKSB7XG4gICAgbG9nZ2VyLndhcm4oXCJObyBhcHAgc2VudCBpbiwgbm90IHBhcnNpbmcgcGFja2FnZS9hY3Rpdml0eVwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGFwcFBhY2thZ2UgJiYgYXBwQWN0aXZpdHkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBsb2dnZXIuZGVidWcoXCJQYXJzaW5nIHBhY2thZ2UgYW5kIGFjdGl2aXR5IGZyb20gYXBwIG1hbmlmZXN0XCIpO1xuICBsZXQge2Fwa1BhY2thZ2UsIGFwa0FjdGl2aXR5fSA9XG4gICAgYXdhaXQgYWRiLnBhY2thZ2VBbmRMYXVuY2hBY3Rpdml0eUZyb21NYW5pZmVzdChhcHApO1xuICBpZiAoYXBrUGFja2FnZSAmJiAhYXBwUGFja2FnZSkge1xuICAgIGFwcFBhY2thZ2UgPSBhcGtQYWNrYWdlO1xuICB9XG4gIGlmICghYXBwV2FpdFBhY2thZ2UpIHtcbiAgICBhcHBXYWl0UGFja2FnZSA9IGFwcFBhY2thZ2U7XG4gIH1cbiAgaWYgKGFwa0FjdGl2aXR5ICYmICFhcHBBY3Rpdml0eSkge1xuICAgIGFwcEFjdGl2aXR5ID0gYXBrQWN0aXZpdHk7XG4gIH1cbiAgaWYgKCFhcHBXYWl0QWN0aXZpdHkpIHtcbiAgICBhcHBXYWl0QWN0aXZpdHkgPSBhcHBBY3Rpdml0eTtcbiAgfVxuICBsb2dnZXIuZGVidWcoYFBhcnNlZCBwYWNrYWdlIGFuZCBhY3Rpdml0eSBhcmU6ICR7YXBrUGFja2FnZX0vJHthcGtBY3Rpdml0eX1gKTtcbiAgcmV0dXJuIHthcHBQYWNrYWdlLCBhcHBXYWl0UGFja2FnZSwgYXBwQWN0aXZpdHksIGFwcFdhaXRBY3Rpdml0eX07XG59O1xuXG5oZWxwZXJzLnJlc2V0QXBwID0gYXN5bmMgZnVuY3Rpb24gKGFkYiwgb3B0cyA9IHt9KSB7XG4gIGNvbnN0IHthcHAsIGFwcFBhY2thZ2UsIGZhc3RSZXNldCwgZnVsbFJlc2V0LFxuICAgIGFuZHJvaWRJbnN0YWxsVGltZW91dCA9IFBBQ0tBR0VfSU5TVEFMTF9USU1FT1VULFxuICAgIGF1dG9HcmFudFBlcm1pc3Npb25zfSA9IG9wdHM7XG5cbiAgaWYgKCFhcHBQYWNrYWdlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiJ2FwcFBhY2thZ2UnIG9wdGlvbiBpcyByZXF1aXJlZFwiKTtcbiAgfVxuXG4gIGNvbnN0IGlzSW5zdGFsbGVkID0gYXdhaXQgYWRiLmlzQXBwSW5zdGFsbGVkKGFwcFBhY2thZ2UpO1xuXG4gIGlmIChpc0luc3RhbGxlZCkge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBhZGIuZm9yY2VTdG9wKGFwcFBhY2thZ2UpO1xuICAgIH0gY2F0Y2ggKGlnbikge31cbiAgICAvLyBmdWxsUmVzZXQgaGFzIHByaW9yaXR5IG92ZXIgZmFzdFJlc2V0XG4gICAgaWYgKCFmdWxsUmVzZXQgJiYgZmFzdFJlc2V0KSB7XG4gICAgICBjb25zdCBvdXRwdXQgPSBhd2FpdCBhZGIuY2xlYXIoYXBwUGFja2FnZSk7XG4gICAgICBpZiAoXy5pc1N0cmluZyhvdXRwdXQpICYmIG91dHB1dC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCdmYWlsZWQnKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBjbGVhciB0aGUgYXBwbGljYXRpb24gZGF0YSBvZiAnJHthcHBQYWNrYWdlfScuIE9yaWdpbmFsIGVycm9yOiAke291dHB1dH1gKTtcbiAgICAgIH1cbiAgICAgIC8vIGV4ZWN1dGluZyBgc2hlbGwgcG0gY2xlYXJgIHJlc2V0cyBwcmV2aW91c2x5IGFzc2lnbmVkIGFwcGxpY2F0aW9uIHBlcm1pc3Npb25zIGFzIHdlbGxcbiAgICAgIGlmIChhdXRvR3JhbnRQZXJtaXNzaW9ucykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGF3YWl0IGFkYi5ncmFudEFsbFBlcm1pc3Npb25zKGFwcFBhY2thZ2UpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGxvZ2dlci5lcnJvcihgVW5hYmxlIHRvIGdyYW50IHBlcm1pc3Npb25zIHJlcXVlc3RlZC4gT3JpZ2luYWwgZXJyb3I6ICR7ZXJyb3IubWVzc2FnZX1gKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbG9nZ2VyLmRlYnVnKGBQZXJmb3JtZWQgZmFzdCByZXNldCBvbiB0aGUgaW5zdGFsbGVkICcke2FwcFBhY2thZ2V9JyBhcHBsaWNhdGlvbiAoc3RvcCBhbmQgY2xlYXIpYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgaWYgKCFhcHApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCInYXBwJyBvcHRpb24gaXMgcmVxdWlyZWQgZm9yIHJlaW5zdGFsbFwiKTtcbiAgfVxuXG4gIGxvZ2dlci5kZWJ1ZyhgUnVubmluZyBmdWxsIHJlc2V0IG9uICcke2FwcFBhY2thZ2V9JyAocmVpbnN0YWxsKWApO1xuICBpZiAoaXNJbnN0YWxsZWQpIHtcbiAgICBhd2FpdCBhZGIudW5pbnN0YWxsQXBrKGFwcFBhY2thZ2UpO1xuICB9XG4gIGF3YWl0IGFkYi5pbnN0YWxsKGFwcCwge1xuICAgIGdyYW50UGVybWlzc2lvbnM6IGF1dG9HcmFudFBlcm1pc3Npb25zLFxuICAgIHRpbWVvdXQ6IGFuZHJvaWRJbnN0YWxsVGltZW91dFxuICB9KTtcbn07XG5cbmhlbHBlcnMuaW5zdGFsbEFwayA9IGFzeW5jIGZ1bmN0aW9uIChhZGIsIG9wdHMgPSB7fSkge1xuICBjb25zdCB7YXBwLCBhcHBQYWNrYWdlLCBmYXN0UmVzZXQsIGZ1bGxSZXNldCxcbiAgICBhbmRyb2lkSW5zdGFsbFRpbWVvdXQgPSBQQUNLQUdFX0lOU1RBTExfVElNRU9VVCxcbiAgICBhdXRvR3JhbnRQZXJtaXNzaW9uc30gPSBvcHRzO1xuXG4gIGlmICghYXBwIHx8ICFhcHBQYWNrYWdlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiJ2FwcCcgYW5kICdhcHBQYWNrYWdlJyBvcHRpb25zIGFyZSByZXF1aXJlZFwiKTtcbiAgfVxuXG4gIGlmIChmdWxsUmVzZXQpIHtcbiAgICBhd2FpdCB0aGlzLnJlc2V0QXBwKGFkYiwgb3B0cyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gVGhlcmUgaXMgbm8gbmVlZCB0byByZXNldCB0aGUgbmV3bHkgaW5zdGFsbGVkIGFwcFxuICBjb25zdCBzaG91bGRQZXJmb3JtRmFzdFJlc2V0ID0gZmFzdFJlc2V0ICYmIGF3YWl0IGFkYi5pc0FwcEluc3RhbGxlZChhcHBQYWNrYWdlKTtcblxuICBhd2FpdCBhZGIuaW5zdGFsbE9yVXBncmFkZShhcHAsIGFwcFBhY2thZ2UsIHtcbiAgICBncmFudFBlcm1pc3Npb25zOiBhdXRvR3JhbnRQZXJtaXNzaW9ucyxcbiAgICB0aW1lb3V0OiBhbmRyb2lkSW5zdGFsbFRpbWVvdXRcbiAgfSk7XG5cbiAgaWYgKHNob3VsZFBlcmZvcm1GYXN0UmVzZXQpIHtcbiAgICBsb2dnZXIuaW5mbyhgUGVyZm9ybWluZyBmYXN0IHJlc2V0IG9uICcke2FwcFBhY2thZ2V9J2ApO1xuICAgIGF3YWl0IHRoaXMucmVzZXRBcHAoYWRiLCBvcHRzKTtcbiAgfVxufTtcblxuLyoqXG4gKiBJbnN0YWxscyBhbiBhcnJheSBvZiBhcGtzXG4gKiBAcGFyYW0ge0FEQn0gYWRiIEluc3RhbmNlIG9mIEFwcGl1bSBBREIgb2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRzIGRlZmluZWQgaW4gZHJpdmVyLmpzXG4gKi9cbmhlbHBlcnMuaW5zdGFsbE90aGVyQXBrcyA9IGFzeW5jIGZ1bmN0aW9uIChvdGhlckFwcHMsIGFkYiwgb3B0cykge1xuICBsZXQge1xuICAgIGFuZHJvaWRJbnN0YWxsVGltZW91dCA9IFBBQ0tBR0VfSU5TVEFMTF9USU1FT1VULFxuICAgIGF1dG9HcmFudFBlcm1pc3Npb25zXG4gIH0gPSBvcHRzO1xuXG4gIC8vIEluc3RhbGwgYWxsIG9mIHRoZSBBUEsncyBhc3luY2hyb25vdXNseVxuICBhd2FpdCBCLmFsbChvdGhlckFwcHMubWFwKChvdGhlckFwcCkgPT4ge1xuICAgIGxvZ2dlci5kZWJ1ZyhgSW5zdGFsbGluZyBhcHA6ICR7b3RoZXJBcHB9YCk7XG4gICAgcmV0dXJuIGFkYi5pbnN0YWxsT3JVcGdyYWRlKG90aGVyQXBwLCBudWxsLCB7XG4gICAgICBncmFudFBlcm1pc3Npb25zOiBhdXRvR3JhbnRQZXJtaXNzaW9ucyxcbiAgICAgIHRpbWVvdXQ6IGFuZHJvaWRJbnN0YWxsVGltZW91dCxcbiAgICB9KTtcbiAgfSkpO1xufTtcblxuaGVscGVycy5pbml0VW5pY29kZUtleWJvYXJkID0gYXN5bmMgZnVuY3Rpb24gKGFkYikge1xuICBsb2dnZXIuZGVidWcoJ0VuYWJsaW5nIFVuaWNvZGUga2V5Ym9hcmQgc3VwcG9ydCcpO1xuICBsb2dnZXIuZGVidWcoXCJQdXNoaW5nIHVuaWNvZGUgaW1lIHRvIGRldmljZS4uLlwiKTtcbiAgYXdhaXQgYWRiLmluc3RhbGwodW5pY29kZUlNRVBhdGgsIHtyZXBsYWNlOiBmYWxzZX0pO1xuXG4gIC8vIGdldCB0aGUgZGVmYXVsdCBJTUUgc28gd2UgY2FuIHJldHVybiBiYWNrIHRvIGl0IGxhdGVyIGlmIHdlIHdhbnRcbiAgbGV0IGRlZmF1bHRJTUUgPSBhd2FpdCBhZGIuZGVmYXVsdElNRSgpO1xuXG4gIGxvZ2dlci5kZWJ1ZyhgVW5zZXR0aW5nIHByZXZpb3VzIElNRSAke2RlZmF1bHRJTUV9YCk7XG4gIGNvbnN0IGFwcGl1bUlNRSA9ICdpby5hcHBpdW0uYW5kcm9pZC5pbWUvLlVuaWNvZGVJTUUnO1xuICBsb2dnZXIuZGVidWcoYFNldHRpbmcgSU1FIHRvICcke2FwcGl1bUlNRX0nYCk7XG4gIGF3YWl0IGFkYi5lbmFibGVJTUUoYXBwaXVtSU1FKTtcbiAgYXdhaXQgYWRiLnNldElNRShhcHBpdW1JTUUpO1xuICByZXR1cm4gZGVmYXVsdElNRTtcbn07XG5cbmhlbHBlcnMuc2V0TW9ja0xvY2F0aW9uQXBwID0gYXN5bmMgZnVuY3Rpb24gKGFkYiwgYXBwKSB7XG4gIHRyeSB7XG4gICAgaWYgKGF3YWl0IGFkYi5nZXRBcGlMZXZlbCgpIDwgMjMpIHtcbiAgICAgIGF3YWl0IGFkYi5zaGVsbChbJ3NldHRpbmdzJywgJ3B1dCcsICdzZWN1cmUnLCAnbW9ja19sb2NhdGlvbicsICcxJ10pO1xuICAgIH0gZWxzZSB7XG4gICAgICBhd2FpdCBhZGIuc2hlbGwoWydhcHBvcHMnLCAnc2V0JywgYXBwLCAnYW5kcm9pZDptb2NrX2xvY2F0aW9uJywgJ2FsbG93J10pO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgbG9nZ2VyLndhcm4oYFVuYWJsZSB0byBzZXQgbW9jayBsb2NhdGlvbiBmb3IgYXBwICcke2FwcH0nOiAke2Vyci5tZXNzYWdlfWApO1xuICB9XG59O1xuXG5oZWxwZXJzLmluc3RhbGxIZWxwZXJBcHAgPSBhc3luYyBmdW5jdGlvbiAoYWRiLCBhcGtQYXRoLCBwYWNrYWdlSWQsIGFwcE5hbWUpIHtcbiAgdHJ5IHtcbiAgICBhd2FpdCBhZGIuaW5zdGFsbE9yVXBncmFkZShhcGtQYXRoLCBwYWNrYWdlSWQsIHtncmFudFBlcm1pc3Npb25zOiB0cnVlfSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGxvZ2dlci53YXJuKGBJZ25vcmVkIGVycm9yIHdoaWxlIGluc3RhbGxpbmcgQXBwaXVtICR7YXBwTmFtZX0gaGVscGVyOiBgICtcbiAgICAgICAgICAgICAgICBgJyR7ZXJyLm1lc3NhZ2V9Jy4gTWFudWFsbHkgdW5pbnN0YWxsaW5nIHRoZSBhcHBsaWNhdGlvbiBgICtcbiAgICAgICAgICAgICAgICBgd2l0aCBwYWNrYWdlIGlkICcke3BhY2thZ2VJZH0nIG1heSBoZWxwLiBFeHBlY3Qgc29tZSBBcHBpdW0gYCArXG4gICAgICAgICAgICAgICAgYGZlYXR1cmVzIG1heSBub3Qgd29yayBhcyBleHBlY3RlZCB1bmxlc3MgdGhpcyBwcm9ibGVtIGlzIGAgK1xuICAgICAgICAgICAgICAgIGBmaXhlZC5gKTtcbiAgfVxufTtcblxuaGVscGVycy5wdXNoU2V0dGluZ3NBcHAgPSBhc3luYyBmdW5jdGlvbiAoYWRiLCB0aHJvd0Vycm9yID0gZmFsc2UpIHtcbiAgbG9nZ2VyLmRlYnVnKFwiUHVzaGluZyBzZXR0aW5ncyBhcGsgdG8gZGV2aWNlLi4uXCIpO1xuXG4gIGF3YWl0IGhlbHBlcnMuaW5zdGFsbEhlbHBlckFwcChhZGIsIHNldHRpbmdzQXBrUGF0aCwgU0VUVElOR1NfSEVMUEVSX1BLR19JRCwgJ1NldHRpbmdzJyk7XG5cbiAgLy8gUmVpbnN0YWxsIHdpbGwgc3RvcCB0aGUgc2V0dGluZ3MgaGVscGVyIHByb2Nlc3MgYW55d2F5LCBzb1xuICAvLyB0aGVyZSBpcyBubyBuZWVkIHRvIGNvbnRpbnVlIGlmIHRoZSBhcHBsaWNhdGlvbiBpcyBzdGlsbCBydW5uaW5nXG4gIGlmIChhd2FpdCBhZGIucHJvY2Vzc0V4aXN0cyhTRVRUSU5HU19IRUxQRVJfUEtHX0lEKSkge1xuICAgIGxvZ2dlci5kZWJ1ZyhgJHtTRVRUSU5HU19IRUxQRVJfUEtHX0lEfSBpcyBhbHJlYWR5IHJ1bm5pbmcuIGAgK1xuICAgICAgICAgICAgICAgICBgVGhlcmUgaXMgbm8gbmVlZCB0byByZXNldCBpdHMgcGVybWlzc2lvbnMuYCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gbGF1Y2ggaW8uYXBwaXVtLnNldHRpbmdzIGFwcCBkdWUgdG8gc2V0dGluZ3MgZmFpbGluZyB0byBiZSBzZXRcbiAgLy8gaWYgdGhlIGFwcCBpcyBub3QgbGF1bmNoZWQgcHJpb3IgdG8gc3RhcnQgdGhlIHNlc3Npb24gb24gYW5kcm9pZCA3K1xuICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2FwcGl1bS9hcHBpdW0vaXNzdWVzLzg5NTdcbiAgdHJ5IHtcbiAgICBhd2FpdCBhZGIuc3RhcnRBcHAoe1xuICAgICAgcGtnOiBTRVRUSU5HU19IRUxQRVJfUEtHX0lELFxuICAgICAgYWN0aXZpdHk6IFNFVFRJTkdTX0hFTFBFUl9QS0dfQUNUSVZJVFksXG4gICAgICBhY3Rpb246IFwiYW5kcm9pZC5pbnRlbnQuYWN0aW9uLk1BSU5cIixcbiAgICAgIGNhdGVnb3J5OiBcImFuZHJvaWQuaW50ZW50LmNhdGVnb3J5LkxBVU5DSEVSXCIsXG4gICAgICBmbGFnczogXCIweDEwMjAwMDAwXCIsXG4gICAgICBzdG9wQXBwOiBmYWxzZSxcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgbG9nZ2VyLndhcm4oYEZhaWxlZCB0byBsYXVuY2ggc2V0dGluZ3MgYXBwOiAke2Vyci5tZXNzYWdlfWApO1xuICAgIGlmICh0aHJvd0Vycm9yKSB7XG4gICAgICB0aHJvdyBlcnI7XG4gICAgfVxuICB9XG59O1xuXG5oZWxwZXJzLnB1c2hVbmxvY2sgPSBhc3luYyBmdW5jdGlvbiAoYWRiKSB7XG4gIGxvZ2dlci5kZWJ1ZyhcIlB1c2hpbmcgdW5sb2NrIGhlbHBlciBhcHAgdG8gZGV2aWNlLi4uXCIpO1xuXG4gIGF3YWl0IGhlbHBlcnMuaW5zdGFsbEhlbHBlckFwcChhZGIsIHVubG9ja0Fwa1BhdGgsIFVOTE9DS19IRUxQRVJfUEtHX0lELCAnVW5sb2NrJyk7XG59O1xuXG4vKipcbiAqIEV4dHJhY3RzIHN0cmluZy54bWwgYW5kIGNvbnZlcnRzIGl0IHRvIHN0cmluZy5qc29uIGFuZCBwdXNoZXNcbiAqIGl0IHRvIC9kYXRhL2xvY2FsL3RtcC9zdHJpbmcuanNvbiBvbiBmb3IgdXNlIG9mIGJvb3RzdHJhcFxuICogSWYgYXBwIGlzIG5vdCBwcmVzZW50IHRvIGV4dHJhY3Qgc3RyaW5nLnhtbCBpdCBkZWxldGVzIHJlbW90ZSBzdHJpbmdzLmpzb25cbiAqIElmIGFwcCBkb2VzIG5vdCBoYXZlIHN0cmluZ3MueG1sIHdlIHB1c2ggYW4gZW1wdHkganNvbiBvYmplY3QgdG8gcmVtb3RlXG4gKlxuICogQHBhcmFtIHs/c3RyaW5nfSBsYW5ndWFnZSAtIExhbmd1YWdlIGFiYnJldmlhdGlvbiwgZm9yIGV4YW1wbGUgJ2ZyJy4gVGhlIGRlZmF1bHQgbGFuZ3VhZ2VcbiAqIGlzIHVzZWQgaWYgdGhpcyBhcmd1bWVudCBpcyBub3QgZGVmaW5lZC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBhZGIgLSBUaGUgYWRiIG1vZmR1bGUgaW5zdGFuY2UuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyAtIERyaXZlciBvcHRpb25zIGRpY3Rpb25hcnkuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgZGljdGlvbmFyeSwgd2hlcmUgc3RyaW5nIHJlc291cnRjZXMgaWRlbnRpZmllcnMgYXJlIGtleXNcbiAqIGFsb25nIHdpdGggdGhlaXIgY29ycmVzcG9uZGluZyB2YWx1ZXMgZm9yIHRoZSBnaXZlbiBsYW5ndWFnZSBvciBhbiBlbXB0eSBvYmplY3RcbiAqIGlmIG5vIG1hdGNoaW5nIHJlc291cmNlcyB3ZXJlIGV4dHJhY3RlZC5cbiAqL1xuaGVscGVycy5wdXNoU3RyaW5ncyA9IGFzeW5jIGZ1bmN0aW9uIChsYW5ndWFnZSwgYWRiLCBvcHRzKSB7XG4gIGNvbnN0IHJlbW90ZURpciA9ICcvZGF0YS9sb2NhbC90bXAnO1xuICBjb25zdCBzdHJpbmdzSnNvbiA9ICdzdHJpbmdzLmpzb24nO1xuICBjb25zdCByZW1vdGVGaWxlID0gYCR7cmVtb3RlRGlyfS8ke3N0cmluZ3NKc29ufWA7XG5cbiAgLy8gY2xlYW4gdXAgcmVtb3RlIHN0cmluZy5qc29uIGlmIHByZXNlbnRcbiAgYXdhaXQgYWRiLnJpbXJhZihyZW1vdGVGaWxlKTtcblxuICBpZiAoXy5pc0VtcHR5KG9wdHMuYXBwUGFja2FnZSkgfHwgIShhd2FpdCBmcy5leGlzdHMob3B0cy5hcHApKSkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIGNvbnN0IHN0cmluZ3NUbXBEaXIgPSBwYXRoLnJlc29sdmUob3B0cy50bXBEaXIsIG9wdHMuYXBwUGFja2FnZSk7XG4gIHRyeSB7XG4gICAgbG9nZ2VyLmRlYnVnKCdFeHRyYWN0aW5nIHN0cmluZ3MgZnJvbSBhcGsnLCBvcHRzLmFwcCwgbGFuZ3VhZ2UsIHN0cmluZ3NUbXBEaXIpO1xuICAgIGNvbnN0IHthcGtTdHJpbmdzLCBsb2NhbFBhdGh9ID0gYXdhaXQgYWRiLmV4dHJhY3RTdHJpbmdzRnJvbUFwayhvcHRzLmFwcCwgbGFuZ3VhZ2UsIHN0cmluZ3NUbXBEaXIpO1xuICAgIGF3YWl0IGFkYi5wdXNoKGxvY2FsUGF0aCwgcmVtb3RlRGlyKTtcbiAgICByZXR1cm4gYXBrU3RyaW5ncztcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgbG9nZ2VyLndhcm4oYENvdWxkIG5vdCBnZXQgc3RyaW5ncywgY29udGludWluZyBhbnl3YXkuIE9yaWdpbmFsIGVycm9yOiAke2Vyci5tZXNzYWdlfWApO1xuICAgIGF3YWl0IGFkYi5zaGVsbCgnZWNobycsIFtgJ3t9JyA+ICR7cmVtb3RlRmlsZX1gXSk7XG4gIH0gZmluYWxseSB7XG4gICAgYXdhaXQgZnMucmltcmFmKHN0cmluZ3NUbXBEaXIpO1xuICB9XG4gIHJldHVybiB7fTtcbn07XG5cbmhlbHBlcnMudW5sb2NrV2l0aFVJQXV0b21hdGlvbiA9IGFzeW5jIGZ1bmN0aW9uIChkcml2ZXIsIGFkYiwgdW5sb2NrQ2FwYWJpbGl0aWVzKSB7XG4gIGxldCB1bmxvY2tUeXBlID0gdW5sb2NrQ2FwYWJpbGl0aWVzLnVubG9ja1R5cGU7XG4gIGlmICghdW5sb2NrZXIuaXNWYWxpZFVubG9ja1R5cGUodW5sb2NrVHlwZSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdW5sb2NrIHR5cGUgJHt1bmxvY2tUeXBlfWApO1xuICB9XG4gIGxldCB1bmxvY2tLZXkgPSB1bmxvY2tDYXBhYmlsaXRpZXMudW5sb2NrS2V5O1xuICBpZiAoIXVubG9ja2VyLmlzVmFsaWRLZXkodW5sb2NrVHlwZSwgdW5sb2NrS2V5KSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgTWlzc2luZyB1bmxvY2tLZXkgJHt1bmxvY2tLZXl9IGNhcGFiaWxpdHkgZm9yIHVubG9ja1R5cGUgJHt1bmxvY2tUeXBlfWApO1xuICB9XG4gIGNvbnN0IHVubG9ja01ldGhvZCA9IHtcbiAgICBbUElOX1VOTE9DS106IHVubG9ja2VyLnBpblVubG9jayxcbiAgICBbUEFTU1dPUkRfVU5MT0NLXTogdW5sb2NrZXIucGFzc3dvcmRVbmxvY2ssXG4gICAgW1BBVFRFUk5fVU5MT0NLXTogdW5sb2NrZXIucGF0dGVyblVubG9jayxcbiAgICBbRklOR0VSUFJJTlRfVU5MT0NLXTogdW5sb2NrZXIuZmluZ2VycHJpbnRVbmxvY2tcbiAgfVt1bmxvY2tUeXBlXTtcbiAgYXdhaXQgdW5sb2NrTWV0aG9kKGFkYiwgZHJpdmVyLCB1bmxvY2tDYXBhYmlsaXRpZXMpO1xufTtcblxuaGVscGVycy51bmxvY2tXaXRoSGVscGVyQXBwID0gYXN5bmMgZnVuY3Rpb24gKGFkYikge1xuICBsb2dnZXIuaW5mbyhcIlVubG9ja2luZyBzY3JlZW5cIik7XG5cbiAgdHJ5IHtcbiAgICBhd2FpdCBhZGIuZm9yY2VTdG9wKFVOTE9DS19IRUxQRVJfUEtHX0lEKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIFNvbWV0aW1lcyB3ZSBjYW4gc2VlIHRoZSBiZWxvdyBlcnJvciwgYnV0IHdlIGNhbiBpZ25vcmUgaXQuXG4gICAgLy8gW1czQ10gRW5jb3VudGVyZWQgaW50ZXJuYWwgZXJyb3IgcnVubmluZyBjb21tYW5kOiBFcnJvcjogRXJyb3IgZXhlY3V0aW5nIGFkYkV4ZWMuIE9yaWdpbmFsIGVycm9yOiAnQ29tbWFuZCAnYWRiIC1QIDUwMzcgLXMgZW11bGF0b3ItNTU1NCBzaGVsbCBhbSBmb3JjZS1zdG9wIGlvLmFwcGl1bS51bmxvY2snIHRpbWVkIG91dCBhZnRlciAyMDAwMG1zJzsgU3RkZXJyOiAnJzsgQ29kZTogJ251bGwnXG4gICAgbG9nZ2VyLndhcm4oYEFuIGVycm9yIGluIHVubG9ja1dpdGhIZWxwZXJBcHA6ICR7ZS5tZXNzYWdlfWApO1xuICB9XG5cbiAgbGV0IHN0YXJ0T3B0cyA9IHtcbiAgICBwa2c6IFVOTE9DS19IRUxQRVJfUEtHX0lELFxuICAgIGFjdGl2aXR5OiBVTkxPQ0tfSEVMUEVSX1BLR19BQ1RJVklUWSxcbiAgICBhY3Rpb246IFwiYW5kcm9pZC5pbnRlbnQuYWN0aW9uLk1BSU5cIixcbiAgICBjYXRlZ29yeTogXCJhbmRyb2lkLmludGVudC5jYXRlZ29yeS5MQVVOQ0hFUlwiLFxuICAgIGZsYWdzOiBcIjB4MTAyMDAwMDBcIixcbiAgICBzdG9wQXBwOiBmYWxzZSxcbiAgICByZXRyeTogZmFsc2UsXG4gICAgd2FpdER1cmF0aW9uOiAxMDAwXG4gIH07XG5cbiAgLy8gVW5sb2NrIHN1Y2NlZWQgd2l0aCBhIGNvdXBsZSBvZiByZXRyaWVzLlxuICBsZXQgZmlyc3RSdW4gPSB0cnVlO1xuICBhd2FpdCByZXRyeSgzLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgLy8gVG8gcmVkdWNlIGEgdGltZSB0byBjYWxsIGFkYi5pc1NjcmVlbkxvY2tlZCgpIHNpbmNlIGBhZGIgc2hlbGwgZHVtcHN5cyB3aW5kb3dgIGlzIGVhc3kgdG8gaGFuZyBhZGIgY29tbWFuZHNcbiAgICBpZiAoZmlyc3RSdW4pIHtcbiAgICAgIGZpcnN0UnVuID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICghKGF3YWl0IGFkYi5pc1NjcmVlbkxvY2tlZCgpKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBsb2dnZXIud2FybihgRXJyb3IgaW4gaXNTY3JlZW5Mb2NrZWQ6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgICBsb2dnZXIud2FybihcIlxcXCJhZGIgc2hlbGwgZHVtcHN5cyB3aW5kb3dcXFwiIGNvbW1hbmQgaGFzIHRpbWVkIG91dC5cIik7XG4gICAgICAgIGxvZ2dlci53YXJuKFwiVGhlIHJlYXNvbiBvZiB0aGlzIHRpbWVvdXQgaXMgdGhlIGRlbGF5ZWQgYWRiIHJlc3BvbnNlLiBSZXNldHRpbmcgYWRiIHNlcnZlciBjYW4gaW1wcm92ZSBpdC5cIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbG9nZ2VyLmluZm8oYExhdW5jaGluZyAke1VOTE9DS19IRUxQRVJfUEtHX0lEfWApO1xuXG4gICAgLy8gVGhlIGNvbW1hbmQgdGFrZXMgdG9vIG11Y2ggdGltZSBzbyB3ZSBzaG91bGQgbm90IGNhbGwgdGhlIGNvbW1hbmQgb3ZlciB0d2ljZSBjb250aW51b3VzbHkuXG4gICAgYXdhaXQgYWRiLnN0YXJ0QXBwKHN0YXJ0T3B0cyk7XG4gIH0pO1xufTtcblxuaGVscGVycy51bmxvY2sgPSBhc3luYyBmdW5jdGlvbiAoZHJpdmVyLCBhZGIsIGNhcGFiaWxpdGllcykge1xuICBpZiAoIShhd2FpdCBhZGIuaXNTY3JlZW5Mb2NrZWQoKSkpIHtcbiAgICBsb2dnZXIuaW5mbyhcIlNjcmVlbiBhbHJlYWR5IHVubG9ja2VkLCBkb2luZyBub3RoaW5nXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxvZ2dlci5kZWJ1ZyhcIlNjcmVlbiBpcyBsb2NrZWQsIHRyeWluZyB0byB1bmxvY2tcIik7XG4gIGlmIChfLmlzVW5kZWZpbmVkKGNhcGFiaWxpdGllcy51bmxvY2tUeXBlKSkge1xuICAgIGxvZ2dlci53YXJuKFwiVXNpbmcgYXBwIHVubG9jaywgdGhpcyBpcyBnb2luZyB0byBiZSBkZXByZWNhdGVkIVwiKTtcbiAgICBhd2FpdCBoZWxwZXJzLnVubG9ja1dpdGhIZWxwZXJBcHAoYWRiKTtcbiAgfSBlbHNlIHtcbiAgICBhd2FpdCBoZWxwZXJzLnVubG9ja1dpdGhVSUF1dG9tYXRpb24oZHJpdmVyLCBhZGIsIHt1bmxvY2tUeXBlOiBjYXBhYmlsaXRpZXMudW5sb2NrVHlwZSwgdW5sb2NrS2V5OiBjYXBhYmlsaXRpZXMudW5sb2NrS2V5fSk7XG4gICAgYXdhaXQgaGVscGVycy52ZXJpZnlVbmxvY2soYWRiKTtcbiAgfVxufTtcblxuaGVscGVycy52ZXJpZnlVbmxvY2sgPSBhc3luYyBmdW5jdGlvbiAoYWRiKSB7XG4gIGF3YWl0IHJldHJ5SW50ZXJ2YWwoMiwgMTAwMCwgYXN5bmMgKCkgPT4ge1xuICAgIGlmIChhd2FpdCBhZGIuaXNTY3JlZW5Mb2NrZWQoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2NyZWVuIGRpZCBub3QgdW5sb2NrIHN1Y2Nlc3NmdWxseSwgcmV0cnlpbmdcIik7XG4gICAgfVxuICAgIGxvZ2dlci5kZWJ1ZyhcIlNjcmVlbiB1bmxvY2tlZCBzdWNjZXNzZnVsbHlcIik7XG4gIH0pO1xufTtcblxuaGVscGVycy5pbml0RGV2aWNlID0gYXN5bmMgZnVuY3Rpb24gKGFkYiwgb3B0cykge1xuICBhd2FpdCBhZGIud2FpdEZvckRldmljZSgpO1xuXG4gIGlmICghb3B0cy5hdmQpIHtcbiAgICAvLyBwdXNoU2V0dGluZ3NBcHAgcmVxdWlyZWQgYmVmb3JlIGNhbGxpbmcgZW5zdXJlRGV2aWNlTG9jYWxlIGZvciBBUEkgTGV2ZWwgMjQrXG4gICAgYXdhaXQgaGVscGVycy5wdXNoU2V0dGluZ3NBcHAoYWRiKTtcbiAgICBhd2FpdCBoZWxwZXJzLnNldE1vY2tMb2NhdGlvbkFwcChhZGIsIFNFVFRJTkdTX0hFTFBFUl9QS0dfSUQpO1xuICB9XG5cbiAgYXdhaXQgaGVscGVycy5lbnN1cmVEZXZpY2VMb2NhbGUoYWRiLCBvcHRzLmxhbmd1YWdlLCBvcHRzLmxvY2FsZSk7XG4gIGF3YWl0IGFkYi5zdGFydExvZ2NhdCgpO1xuICBsZXQgZGVmYXVsdElNRTtcbiAgaWYgKG9wdHMudW5pY29kZUtleWJvYXJkKSB7XG4gICAgZGVmYXVsdElNRSA9IGF3YWl0IGhlbHBlcnMuaW5pdFVuaWNvZGVLZXlib2FyZChhZGIpO1xuICB9XG4gIGlmIChfLmlzVW5kZWZpbmVkKG9wdHMudW5sb2NrVHlwZSkpIHtcbiAgICBhd2FpdCBoZWxwZXJzLnB1c2hVbmxvY2soYWRiKTtcbiAgfVxuICByZXR1cm4gZGVmYXVsdElNRTtcbn07XG5cbmhlbHBlcnMucmVtb3ZlTnVsbFByb3BlcnRpZXMgPSBmdW5jdGlvbiAob2JqKSB7XG4gIGZvciAobGV0IGtleSBvZiBfLmtleXMob2JqKSkge1xuICAgIGlmIChfLmlzTnVsbChvYmpba2V5XSkgfHwgXy5pc1VuZGVmaW5lZChvYmpba2V5XSkpIHtcbiAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICB9XG4gIH1cbn07XG5cbmhlbHBlcnMudHJ1bmNhdGVEZWNpbWFscyA9IGZ1bmN0aW9uIChudW1iZXIsIGRpZ2l0cykge1xuICBsZXQgbXVsdGlwbGllciA9IE1hdGgucG93KDEwLCBkaWdpdHMpLFxuICAgICAgYWRqdXN0ZWROdW0gPSBudW1iZXIgKiBtdWx0aXBsaWVyLFxuICAgICAgdHJ1bmNhdGVkTnVtID0gTWF0aFthZGp1c3RlZE51bSA8IDAgPyAnY2VpbCcgOiAnZmxvb3InXShhZGp1c3RlZE51bSk7XG5cbiAgcmV0dXJuIHRydW5jYXRlZE51bSAvIG11bHRpcGxpZXI7XG59O1xuXG5oZWxwZXJzLmlzQ2hyb21lQnJvd3NlciA9IGZ1bmN0aW9uIChicm93c2VyKSB7XG4gIHJldHVybiBfLmluY2x1ZGVzKE9iamVjdC5rZXlzKENIUk9NRV9CUk9XU0VSX1BBQ0tBR0VfQUNUSVZJVFkpLCAoYnJvd3NlciB8fCAnJykudG9Mb3dlckNhc2UoKSk7XG59O1xuXG5oZWxwZXJzLmdldENocm9tZVBrZyA9IGZ1bmN0aW9uIChicm93c2VyKSB7XG4gIHJldHVybiBDSFJPTUVfQlJPV1NFUl9QQUNLQUdFX0FDVElWSVRZW2Jyb3dzZXIudG9Mb3dlckNhc2UoKV0gfHxcbiAgICAgICAgIENIUk9NRV9CUk9XU0VSX1BBQ0tBR0VfQUNUSVZJVFkuZGVmYXVsdDtcbn07XG5cbmhlbHBlcnMucmVtb3ZlQWxsU2Vzc2lvbldlYlNvY2tldEhhbmRsZXJzID0gYXN5bmMgZnVuY3Rpb24gKHNlcnZlciwgc2Vzc2lvbklkKSB7XG4gIGlmICghc2VydmVyIHx8ICFfLmlzRnVuY3Rpb24oc2VydmVyLmdldFdlYlNvY2tldEhhbmRsZXJzKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGFjdGl2ZUhhbmRsZXJzID0gYXdhaXQgc2VydmVyLmdldFdlYlNvY2tldEhhbmRsZXJzKHNlc3Npb25JZCk7XG4gIGZvciAoY29uc3QgcGF0aG5hbWUgb2YgXy5rZXlzKGFjdGl2ZUhhbmRsZXJzKSkge1xuICAgIGF3YWl0IHNlcnZlci5yZW1vdmVXZWJTb2NrZXRIYW5kbGVyKHBhdGhuYW1lKTtcbiAgfVxufTtcblxuLyoqXG4gKiBUYWtlcyBhIGRlc2lyZWQgY2FwYWJpbGl0eSBhbmQgdHJpZXMgdG8gSlNPTi5wYXJzZSBpdCBhcyBhbiBhcnJheSxcbiAqIGFuZCBlaXRoZXIgcmV0dXJucyB0aGUgcGFyc2VkIGFycmF5IG9yIGEgc2luZ2xldG9uIGFycmF5LlxuICpcbiAqIEBwYXJhbSB7YW55fSBjYXAgQSBkZXNpcmVkIGNhcGFiaWxpdHlcbiAqL1xuaGVscGVycy5wYXJzZUFycmF5ID0gZnVuY3Rpb24gKGNhcCkge1xuICBsZXQgcGFyc2VkQ2FwcztcbiAgdHJ5IHtcbiAgICBwYXJzZWRDYXBzID0gSlNPTi5wYXJzZShjYXApO1xuICB9IGNhdGNoIChpZ24pIHsgfVxuXG4gIGlmIChfLmlzQXJyYXkocGFyc2VkQ2FwcykpIHtcbiAgICByZXR1cm4gcGFyc2VkQ2FwcztcbiAgfSBlbHNlIGlmIChfLmlzU3RyaW5nKGNhcCkpIHtcbiAgICByZXR1cm4gW2NhcF07XG4gIH1cblxuICB0aHJvdyBuZXcgRXJyb3IoYG11c3QgcHJvdmlkZSBhIHN0cmluZyBvciBKU09OIEFycmF5OyByZWNlaXZlZCAke2NhcH1gKTtcbn07XG5cbmhlbHBlcnMuYm9vdHN0cmFwID0gQm9vdHN0cmFwO1xuaGVscGVycy51bmxvY2tlciA9IHVubG9ja2VyO1xuXG5leHBvcnQgZGVmYXVsdCBoZWxwZXJzO1xuIl0sInNvdXJjZVJvb3QiOiIuLi8uLiJ9
