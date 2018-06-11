
**************************************************

Ocean Day Interactive (aka 3 ships Interactive)


Configuration & operation notes

**************************************************

The interactive can be launched by running the batch file 'oceanday' on the desktop.

When run, this batch file first uses the 'QRes.exe' utility to check the desktop resolution and change it to fullHD (1920x1080px), if not already the case. Note that the interactive should *not* be run at the screen's native 4k resolution (3840x2160px) for reasons of performance.

Note also that Windows 'display settings' should not be configured to apply any 'UI scaling' while the screen is running at fullHD resolution. When running at 4k resolution, this would normally be set to scale the Windows UI to 150%.

After setting resolution, the launcher then opens 'localhost/oceanday/index.html' in the Chrome browser, with the 'kiosk mode', 'disable-pinch' and 'start-fullscreen' parameters.

Note that the interactive has not been designed to run in Edge, Internet Explorer or Firefox so is not likely to display correctly in these browsers.

Under the hood, the interactive is made available at this URL by being served to a local Apache server via XAMPP. The XAMPP control panel ("xampp-control.exe"), configured to start the local Apache host automatically on load, has been added to startup commands so that it itself launches whenever Windows loads.

In order to lock down the Interactive and protect against a user accidentally or maliciously accessing any of the functionality of Windows beyond the Interactive itself, the following steps have been taken:

- context menus ('right click' menus) are disabled throughout the Interactive in javascript
- the Chrome 'kiosk mode' applies various settings to prevent users leaving the page being displayed in the browser
- the Chrome 'disable-pinch' flag prevents the pinch gesture being used to zoom in on the interactive
- on-screen keyboard?
- edge swipes?
- other multi-touch gestures?









