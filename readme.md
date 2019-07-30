# A11y Menu

A keyboard accessible navigational menu script.
@todo


## Configurating options

Takes an `a11yMenuConfig` global object as a parameter to configure
and override the default options. Useful for configuration in content
management systems, such as when using `wp_localize_script()` in WordPress.

Default values for the config object:

	@todo


## Styling note

Do not hide child menus with `display: block` CSS styles. Doing so would
render the links within the child menu inaccessible, not focusable. Use
accessible styles to hide instead, such as `transform: scale(0);`


## Browser compatibility

IE11, Edge and all modern web browsers.


## Included polyfills

Includes a polyfill for NodeList.forEach() and Element.matches().
