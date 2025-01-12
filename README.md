  README - Android & iOS App body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; } h1, h2, h3 { color: #333; } code { background-color: #f4f4f4; padding: 2px 4px; border-radius: 4px; } pre { background-color: #f4f4f4; padding: 10px; border-radius: 4px; overflow-x: auto; } a { color: #007bff; text-decoration: none; }

README - Android & iOS Application
==================================

Project Overview
----------------

This application allows users to add, view, and delete places with GPS coordinates. It uses **Capacitor** and **React** to create a cross-platform mobile app for Android and iOS.

Features
--------

*   Add new places with a name, description, and GPS coordinates.
*   View details of a selected place, including its location on a map.
*   Delete places from the list.
*   Data is stored persistently using `@capacitor/storage`.
*   Integration with GPS and Maps API for real-time location display.

Setup Instructions
------------------

### Prerequisites

*   Node.js and npm installed
*   Capacitor CLI installed globally (`npm install -g @capacitor/cli`)
*   Expo CLI installed globally (`npm install -g expo-cli`)

### Installation

    git clone <repository-url>
    cd <project-folder>
    npm install

### Running the App

**For Android:**

    npx cap open android

**For iOS:** (Using Codemagic or Mac device)

    npx cap open ios

Building the App
----------------

To build the app for production:

    npx cap copy
    npx cap sync

Using Codemagic for iOS Builds
------------------------------

If you don't have access to a Mac device, you can use [Codemagic](https://codemagic.io/) for iOS builds. Follow these steps:

1.  Connect your GitHub repository to Codemagic.
2.  Trigger the build and download the resulting IPA file.

Dependencies
------------

*   `react`
*   `@capacitor/core`
*   `@capacitor/android`
*   `@capacitor/ios`
*   `@capacitor/storage`
*   `react-navigation`
*   `react-native-maps`

License
-------

This project is licensed under the MIT License - see the LICENSE file for details.
