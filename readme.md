# A11y Menu

JavaScript for making a navigation menu keyboard accessible:

- toggles a sub menu(*) when a parent menu item receives focus using `TAB` key or is hovered,
- adds a sub menu toggle button,
- enables touching a parent menu item link once to toggle its sub menu(*),
- closes last opened sub menu(*) when `ESC` key is pressed.

(*) Well, this should be done with your CSS styles. All the script is actually doing is toggling a `has-expanded-sub-menu` class (configurable) on menu items and setting & toggling proper ARIA attributes where needed.


## Which file to use?

In your projects, load the `a11y-menu.dist.min.js` file. It is a distribution ready compiled and minified version of the development `a11y-menu.js` file.


## Documentation

Please check out the project [wiki pages](https://github.com/webmandesign/a11y-menu/wiki) for instructions on how to use the script.


## Browser compatibility

All modern web browsers.


## License

[GPL-3.0-or-later](https://www.gnu.org/licenses/gpl-3.0-standalone.html)


## Copyright

&copy; 2019-2026 WebMan Design, Oliver Juhas, https://www.webmandesign.eu
