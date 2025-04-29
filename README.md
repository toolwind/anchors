<h1 align="center">Mixins for Tailwind CSS</h1>

<div align="center">

[![minified size](https://img.shields.io/bundlephobia/min/tailwindcss-mixins)](https://bundlephobia.com/package/tailwindcss-mixins)
[![license](https://img.shields.io/github/license/brandonmcconnell/tailwindcss-mixins?label=license)](https://github.com/brandonmcconnell/tailwindcss-mixins/blob/main/LICENSE)
[![version](https://img.shields.io/npm/v/tailwindcss-mixins)](https://www.npmjs.com/package/tailwindcss-mixins)
[![twitter](https://img.shields.io/twitter/follow/branmcconnell)](https://twitter.com/branmcconnell)

</div>

Mixins for Tailwind CSS is a plugin that introduces a new `mixin` variant/utility pair, allowing you to create reusable groups of Tailwind CSS utilities. This provides a more declarative and maintainable approach compared to traditional methods of targeting descendants with arbitrary variants or non-Tailwind CSS selectors.

## Installation

You can install the plugin via npm:

```bash
npm install tailwindcss-mixins
```

Then, include it in your `tailwind.config.js`:

```js
module.exports = {
  plugins: [
    require('tailwindcss-mixins'),
  ]
}
```

## Usage

The `mixin` variant can be used to define a group of utilities that will be applied to multiple elements simultaneously. Here's an example:

```html
<div class="mixin:inline-block mixin:font-bold mixin:underline">
  <div class="mixin">Test 1</div>
  <div class="mixin">Test 2</div>
  <div class="mixin">Test 3</div>
  <div class="mixin">Test 4</div>
</div>
```
<sup>[View this example on Tailwind Play](https://play.tailwindcss.com/JrwBfc7snO)</sup>

In this example, the utilities `inline-block`, `font-bold`, and `underline` are applied to all elements with the `mixin` class.

Mixins help reduce repetitive class names, keeping your code DRY (Don't Repeat Yourself) and adhering to the utility-first approach of Tailwind CSS. Instead of using arbitrary variants or non-Tailwind CSS classes to target descendants, mixins provide a consistent and declarative pattern for creating reusable styles.

### Naming Mixins

If you need to differentiate between multiple mixins, you can use the Tailwind CSS modifier syntax to name your mixins:

```html
<div class="
  mixin/button:inline-block
  mixin/button:font-bold
  mixin/button:underline
  mixin/link:text-blue-500
  mixin/link:hover:underline
">
  <a class="mixin/link" href="#">Link</a>
  <button class="mixin/button">Button</button>
</div>
```
<sup>[View this example on Tailwind Play](https://play.tailwindcss.com/NGONvODQCs)</sup>

In this example, we've named our mixins `mixin/{name}`, allowing us to distinguish between different mixins and apply them accordingly.

### Applying Variants to Mixins

When using mixins, you can apply Tailwind CSS variants to the declaration of the mixin itself. This will affect only the property it's applied to, allowing for more customization of mixins.

For example:

```html
<div class="sm:mixin:inline-block">
  <div class="mixin"></div>
</div>
```

In this case, the `inline-block` utility will be applied to the elements with the `mixin` class only on small screens and above.

Note that the use of a variant on the consumer of the mixin, like in the below example, will not affect the mixin itself. Variants must be applied directly to the mixin declaration.

This will not work:

```html
<div class="mixin:inline-block">
  <div class="sm:mixin"></div>
</div>
```

## Why use Mixins for Tailwind CSS?

Mixins for Tailwind CSS provides several benefits:

- Simplifies the application of styles to multiple elements
- Reduces code duplication and improves maintainability
- Provides a more declarative and consistent approach to styling
- Adheres to the utility-first approach of Tailwind CSS
- Improves developer experience by avoiding the need for arbitrary targeting and non-Tailwind CSS classes

## Why NOT use Mixins for Tailwind CSS?

While Mixins for Tailwind CSS is a simple and powerful tool, it may not be suitable for every project. Some potential drawbacks include:

- **Learning Curve**: Mixins introduce a new concept and syntax that developers will need to learn and understand.
- **Complexity**: As the number of mixins and nested mixins increases, the complexity of your codebase may also increase, potentially leading to maintainability issues.
- **Performance**: Mixins may have a slight impact on performance due to the additional CSS rules generated. However, this impact is likely to be negligible in most cases.

As with any tool or technique, it's important to weigh the pros and cons and choose the approach that best fits your project's needs and team's preferences.

---

I hope you find `tailwindcss-mixins` a valuable addition to your projects. If you have any issues or suggestions, don't hesitate to open an issue or pull request.

If you liked this, you might also like my other Tailwind CSS plugins:
* [tailwindcss-multi](https://github.com/brandonmcconnell/tailwindcss-multi): Group utilities together by variant
* [tailwindcss-signals](https://github.com/brandonmcconnell/tailwindcss-signals): Apply styles based on parent or ancestor state, a state-driven alterative to groups
* [tailwindcss-members](https://github.com/brandonmcconnell/tailwindcss-members): Apply styles based on child or descendant state, the inverse of groups
* [tailwindcss-mixins](https://github.com/brandonmcconnell/tailwindcss-mixins): Construct reusable & aliased sets of utilities inline
* [tailwindcss-selector-patterns](https://github.com/brandonmcconnell/tailwindcss-selector-patterns): Dynamic CSS selector patterns
* [tailwindcss-js](https://github.com/brandonmcconnell/tailwindcss-js): Effortless build-time JS script injection
* [tailwindcss-directional-shadows](https://github.com/brandonmcconnell/tailwindcss-directional-shadows): Supercharge your shadow utilities with added directional support (includes directional `shadow-border` utilities too ✨)
* [tailwindcss-default-shades](https://github.com/brandonmcconnell/tailwindcss-default-shades): Default shades for simpler color utility classes
* [tailwind-lerp-colors](https://github.com/brandonmcconnell/tailwind-lerp-colors): Expand your color horizons and take the fuss out of generating new—or expanding existing—color palettes