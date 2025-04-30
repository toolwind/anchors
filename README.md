<h5 align="center"><img src="./feature.png" width="100%" height="auto" alt="Anchors for Tailwind CSS" /><small><i>Anchors for Tailwind CSS</i></small></h5>

<!--<div align="center"> I'll re-add these badges when they're working. I think they're still propagating.

[![minified size](https://img.shields.io/bundlephobia/min/@toolwind/anchors)](https://bundlephobia.com/package/@toolwind/anchors)
[![license](https://img.shields.io/github/license/brandonmcconnell/@toolwind/anchors?label=license)](https://github.com/brandonmcconnell/@toolwind/anchors/blob/main/LICENSE)
[![version](https://img.shields.io/npm/v/@toolwind/anchors)](https://www.npmjs.com/package/@toolwind/anchors)
[![twitter](https://img.shields.io/twitter/follow/branmcconnell)](https://twitter.com/branmcconnell)

</div>-->

---

**Anchors for Tailwind CSS** is a plugin that brings declarative support for the CSS Anchor Positioning API to Tailwind, allowing you to define and position elements relative to custom anchors. It adds utilities for `anchor-name`, `position-anchor`, `position-area`, `anchor()` and `anchor-size()` expressions.

It also lays the groundwork for using View Transitions to animate any anchored elements, which would require separate JS (for now 👀).

## Installation

1. Install the plugin from npm with your preferred package manager:
    
    ```bash
    npm install -D @toolwind/anchors
    ```
2. Then include it in your Tailwind CSS or JS config file:
    
    <details name="install-lang" open><summary><b>CSS (Tailwind CSS v4+)</b></summary>

    ```css
    /* style.css */
    @import "@toolwind/anchors";
    ```

    </details><details name="install-lang"><summary><b>JS (Tailwind CSS v3 compatible)</b></summary>

    ```js
    // tailwind.config.js
    import anchors from "@toolwind/anchors";
    ```

    </details>

## Usage

### Defining an anchor

Use the `anchor/{name}` utility to define an anchor point:

```html
<div class="anchor/my-anchor"></div>
```

The CSS `anchor-name` property requires a dashed ident. For convenience, Anchors for Tailwind CSS automatically converts simple names into dashed idents.

For example, the above utility generates this CSS, prefixed with `--tw-anchor_`:

```css
.anchor\/my-anchor {
  anchor-name: --tw-anchor_my-anchor;
}
```

If you need to use a specific dashed ident for an anchor name, the plugin will respect and preserve the original name if it encounters an ident that is already dashed.

```html
<div class="anchor/--my-anchor"></div>
```

This utility also accepts arbitrary values, so if you want to pass a name via a CSS variable, you can do so using the square bracket syntax, like this:

```html
<div class="[--custom-property:--my-anchor]">
  <div class="anchor/[var(--custom-property)]"></div>
</div>
```

🚧 Note that names passed via a custom property (square bracket syntax) resolves to a dashed ident already, as it's not possible for a plugin to read and manipulate runtime values.

### Positioning relative to an anchor

Once an anchor has been defined, you can anchor other elements to it.

Use `anchored/{name}` to attach an element to an anchor:

```html
<div class="anchored/my-anchor"></div>
```

Use `anchored-{side}` to specify the position area of the anchored element. For example, `anchored-top-center` will position the element at the top center of its anchor, touching the anchored element:

```html
<div class="anchored-top-center"></div>
```

Or, put both together for shorthand syntax:

```html
<div class="anchored-top-center/my-anchor"></div>
```

This sets:

```css
position-anchor: --tw-anchor_my-anchor;
position-area: top center;
position: absolute;
view-transition-name: --tw-anchor-view-transition-313d192p322r2w3336;
/* ☝️ View Transition-ready, with encoded view-transition-name */
```

Both the `position` and `view-transition-name` are applied with zero specificity (via `:where()`), making them easy to overwrite with other values, if you choose. As a rule of thumb, anchored elements must use absolute or fixed positioning. This plugin defaults to `absolute` positioning, but you can add `fixed` to use fixed positioning instead.

This plugin strives to strike a balance between abstracting away the complexity of the CSS Anchor Positioning API and empowering developers to fully leverage it.

## Supported Utilities

#### `anchor/{name}`

Sets `anchor-name: --tw-anchor_{name}`

#### `anchored/{name}`

Sets:
- `position-anchor: --tw-anchor_{name}`
- `view-transition-name` (automatically generated per anchor)

#### `anchor-{position}`

Sets `position-area`. Examples:

- `anchor-top-center` → `top center`
- `anchor-bottom-span-left`
- `anchor-top-right`, etc.

#### `{top|right|bottom|left|inset}-anchor-{side}-{offset}/{name?}`

Generates directional offset using `anchor()`:

```html
<div class="top-anchor-bottom"></div>
```

Results in:

```css
top: anchor(bottom);
```

With offset support:

```html
<div class="top-anchor-bottom-4"></div>
```

```css
top: calc(anchor(bottom) + 1rem); // assuming 4 = theme('spacing.4')
```

#### `{w|h}-anchor{-size?}/{name?}]`

Size utilities using `anchor-size()`:

- **Omitting the anchor size (i.e. default size/dimension)**

  `w-anchor` → `width: anchor-size(width)` 
  If the `{size}` is omitted, the dimension defaults to the `<anchor-size>` keyterm that matches the axis of the property in which the function is included. For example, `width: anchor-size();` is equivalent to `width: anchor-size(width);`. (source: [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/anchor-size#anchor-size))
- **Declaring the anchor-size (width/height/etc.) to use as a length**

  `w-anchor-height` → `width: anchor-size(height)`
- **Setting/omitting the anchor name**

  * `w-anchor` → `width: anchor-size(width)` 
  * `w-anchor/--name` → `width: anchor-size(--name width)` 
  * `w-anchor/name` → `width: anchor-size(--tw-anchor_name width)` 

  Specifying an `<anchor-name>` inside an `anchor-size()` function neither associates nor tethers an element to an anchor; it only defines which anchor the element's property values should be set relative to. (source: [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/anchor-size#anchor-size))

## View Transition API Integration

Every `anchored/{name}` class includes a `view-transition-name`, making your anchored elements animatable with `document.startViewTransition()`:

```js
document.startViewTransition(() => {
  el.classList.remove('anchor-top-left')
  el.classList.add('anchor-bottom-right')
})
```

This animates position shifts smoothly using the browser-native View Transitions API.

## Why use Anchors for Tailwind CSS? 🤔

- Declarative anchor positioning with Tailwind utility syntax
- Full support for native anchor-related CSS properties and functions
- Easy offset control via `calc(anchor(...) + theme spacing)` _(under the hood)_
- Built-in support for View Transitions
- Fully JIT-compatible, no runtime required

## Additional Resources 📚

- MDN: [Guide: Using CSS anchor positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning/Using) | [anchor-size()](https://developer.mozilla.org/en-US/docs/Web/CSS/anchor-size) | [anchor()](https://developer.mozilla.org/en-US/docs/Web/CSS/anchor) | [anchor-name](https://developer.mozilla.org/en-US/docs/Web/CSS/anchor-name) | [position-anchor](https://developer.mozilla.org/en-US/docs/Web/CSS/position-anchor) | [position-area](https://developer.mozilla.org/en-US/docs/Web/CSS/position-area) | [position-try-order](https://developer.mozilla.org/en-US/docs/Web/CSS/position-try-order)
- CSS Tricks: [CSS Anchor Positioning Guide](https://css-tricks.com/css-anchor-positioning-guide/)
- Specification: [CSS Anchor Positioning](https://drafts.csswg.org/css-anchor-position-1/)
- [The Anchor Tool](https://anchor-tool.com/) 👈 probably the best way to get a real fast introduction to the CSS Anchor Positioning API, how it works, and how helpful it can be ✨
- [@Una](https://github.com/una)! I've never met anyone more fired up about CSS Anchor Positioning than Una Kravets, so definitely check out some of the things she's posted about it. I'm not 100% certain, but I think she may have actually created the [The Anchor Tool](https://anchor-tool.com/) mentioned above.

## Coming soon 👀🤞

Some relevant features that are not part of this plugin yet are:
- `anchor-center`
- `position-try-order` | `position-try-fallbacks` | `position-try`
- `position-visibility`

## If you liked this plugin...

Check out more by [@branmcconnell](https://github.com/brandonmcconnell):

- [tailwindcss-signals](https://github.com/brandonmcconnell/tailwindcss-signals): React to parent or ancestor state
- [tailwindcss-members](https://github.com/brandonmcconnell/tailwindcss-members): Style based on child/descendant state
- [tailwindcss-mixins](https://github.com/brandonmcconnell/tailwindcss-mixins): Reusable, aliased groups of utilities
- [tailwindcss-selector-patterns](https://github.com/brandonmcconnell/tailwindcss-selector-patterns): Dynamic selector composition
- [tailwindcss-directional-shadows](https://github.com/brandonmcconnell/tailwindcss-directional-shadows): Shadows with directional awareness
- [tailwindcss-default-shades](https://github.com/brandonmcconnell/tailwindcss-default-shades): Simpler default color utility names
- [tailwindcss-js](https://github.com/brandonmcconnell/tailwindcss-js): Effortless script injection
- [tailwindcss-multi](https://github.com/brandonmcconnell/tailwindcss-multi): Group utility declarations under variants
- [tailwind-lerp-colors](https://github.com/brandonmcconnell/tailwind-lerp-colors): Flexible color interpolation and palette tooling