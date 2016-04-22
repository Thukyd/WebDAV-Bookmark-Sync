# WebDAV-Bookmark-Sync

A browser plug-in for Firefox and Chromium to synchronize your bookmarks to a compatible WebDAV server. This plugin is being developed mainly from my personal need to sync bookmarks to my OwnCloud instance, but it should work nicely with most WebDAV or SabreDAV implementations.

## Building the browser extensions

For the compilation and building of the extension, Grunt.js is used. You can run the following command to build an installable plugin for Firefox and Google Chrome:

    grunt dist

Which will then place the plugins into the respective folders under `/dist`.
