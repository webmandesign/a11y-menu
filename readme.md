# A11y Menu

A keyboard accessible navigational menu script.

Transforms your inaccessible website navigational menu into a keyboard accessible one:

- Toggles a sub menu(*) when a menu item receives focus using `TAB` key,
- Adds a sub menu toggle button,
- Touching a menu item link once toggles a sub menu(*),
- Closes all sub menus(*) when `ESC` key pressed.

(*) Well, this should be done with your CSS styles. All the script is actually doing is toggling a `has-expanded-sub-menu` class (configurable) on menu items and setting & toggling proper ARIA attributes where needed.


## Documentation

Please check out the project [wiki pages](https://github.com/webmandesign/a11y-menu/wiki) for instructions on how to use the script.


## Browser compatibility

All modern web browsers, back to Edge and IE11.


## Included polyfills

The script includes a polyfill for [`NodeList.forEach()`](https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach#Polyfill) and [`Element.matches()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill).


## License

[GPL-3.0-or-later](https://www.gnu.org/licenses/gpl-3.0-standalone.html)


## Copyright

&copy; 2019 WebMan Design, Oliver Juhas, https://www.webmandesign.eu
