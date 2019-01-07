# MagicMirror² octomirror-module Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

---

## [1.0.6] - Updates for OctoPrint v1.3.10

### Added

### Updated
- Updated Octoprint `packed_client.js` to current version.
- Updated module to obtain session id upon connection per changes made in OctoPrint
    + "auth (since 1.3.10): With the auth message, clients may associate an existing user session with the socket. That is of special importance to receive any kind of messages if the bundled Forcelogin Plugin is enabled (as it is by default), since it will prevent any kind of status messages to be sent to connected unauthenticated clients."
    + *[Source](http://docs.octoprint.org/en/master/api/push.html#sec-api-push)*

## [1.0.5] - Corrected exception state text for disconnected printer #3

### Added
- N/A

### Updated
- N/A

### Fixed
- The OctoPrint offline state text changed with foosel/OctoPrint@55d5df7.

Now the module detects the offline state correct again and does not display the long exception message.

## [1.0.4] - Updates from original module

### Added
- Added Temp Readouts, Auto-hide Option & Translations
- Added ability to disable camera stream
- Added live printer status updates
- Added push messages, console logs
- Added interactive option to disable file menus

### Updated
- Migrated to use OctoPrint Client JS Library

### Fixed
- N/A

