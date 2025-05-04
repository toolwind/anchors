import type { PluginCreator, PluginAPI } from 'tailwindcss/plugin';
import { normalizeAnchorName, positionAreaValues, encoding } from './utils.js';
export { encoding } from './utils.js';

const generateViewTransitionId = (str: string) => `--tw-anchor-view-transition-${encoding.encode(str)}`

const anchors = ((api: PluginAPI) => {
  const { addUtilities, matchUtilities, theme } = api;

  // Detect v4 by checking for the absence of the postcss argument
  const isV4 = !('postcss' in api);

  // anchor utilities (anchor-name)
  matchUtilities(
    {
      anchor: (_, { modifier }) => {
        const styles: Record<string, string> = {};
        if (modifier) {
          const anchorName = normalizeAnchorName(modifier, isV4);
          if (anchorName) {
            styles['anchor-name'] = anchorName;
          }
        }
        return styles;
      },
    },
    {
      values: {
        DEFAULT: '',
      },
      modifiers: 'any',
    },
  );
  // anchored utility (position-area and/or position-anchor)
  matchUtilities(
    {
      anchored: (value, { modifier }) => {
        if (!value && !modifier) return {};

        const baseStyles: Record<string, any> = {};
        if (value) {
          baseStyles['position-area'] = value;
        }
        if (modifier) {
          const viewTransitionName = generateViewTransitionId(modifier);
          baseStyles['position-anchor'] = normalizeAnchorName(modifier, isV4);
          baseStyles[':where(&)'] = {
            position: 'absolute',
            ...(viewTransitionName && { 'view-transition-name': viewTransitionName }),
          };
        }
        return baseStyles;
      },
    },
    {
      values: {
        DEFAULT: '', // will be '' if only a name is being set
        ...positionAreaValues,
      },
      modifiers: 'any',
    },
  );
  // anchor() utilities
  ;([
    ['top', theme('inset')],
    ['right', theme('inset')],
    ['bottom', theme('inset')],
    ['left', theme('inset')],
    ['inset', theme('inset')],
  ] as const).forEach(([property, themeValues]) => {
    ;['top', 'right', 'bottom', 'left', 'start', 'end', 'self-start', 'self-end', 'center'].forEach(
      (anchorSide) => {
        matchUtilities(
          {
            [`${property}-anchor-${anchorSide}`]: (offset, { modifier }) => {
              const anchorRef = modifier ? `${normalizeAnchorName(modifier, isV4)} ` : ''
              const anchorFnExpr = `anchor(${anchorRef}${anchorSide})`
              const value = offset ? `calc(${anchorFnExpr} + ${offset})` : anchorFnExpr
              return {
                [property]: value,
              }
            },
          },
          {
            values: {
              DEFAULT: '',
              ...themeValues,
            },
            modifiers: 'any',
          },
        )
      },
    )
  })
  // anchor-size() utilities
  ;([
    ['w', 'width', theme('width')],
    ['h', 'height', theme('height')],
    ['min-w', 'min-width', theme('minWidth')],
    ['min-h', 'min-height', theme('minHeight')],
    ['max-w', 'max-width', theme('maxWidth')],
    ['max-h', 'max-height', theme('maxHeight')],
  ] as const).forEach(([propertyAbbr, property, themeValues]) => {
    ;['', 'width', 'height', 'block', 'inline', 'self-block', 'self-inline'].forEach(
      (anchorSize) => {
        const anchorSizeUtilitySuffix = anchorSize ? `-${anchorSize}` : anchorSize
        matchUtilities(
          {
            [`${propertyAbbr}-anchor${anchorSizeUtilitySuffix}`]: (offset, { modifier }) => {
              const anchorRef = modifier ? `${normalizeAnchorName(modifier, isV4)} ` : ''
              const anchorFnExpr = `anchor-size(${anchorRef}${anchorSize})`
              const value = offset ? `calc(${anchorFnExpr} + ${offset})` : anchorFnExpr
              return {
                [property]: value,
              }
            },
          },
          {
            values: {
              DEFAULT: '',
              ...themeValues,
            },
            modifiers: 'any',
          },
        )
      },
    )
  })
  // anchor-center utilities
  ;([
    ['justify-self', 'justify-self'],
    ['self', 'align-self'],
    ['justify-items', 'justify-items'],
    ['items', 'align-items'],
    ['place-items', 'place-items'],
    ['place-self', 'place-self'],
  ] as const).forEach(([propertyAbbr, property]) => {
    addUtilities({
      [`.${propertyAbbr}-anchor`]: {
        [property]: 'anchor-center',
      }
    })
  })
  // position-visibility utilities
  matchUtilities(
    {
      'anchored-visible': (value) => ({
        'position-visibility': value,
      }),
    },
    {
      values: {
        always: 'always',
        anchor: 'anchors-visible',
        'no-overflow': 'no-overflow',
        // 'valid': 'anchors-valid', // ⚠️ this is not supported anywhere yet
      },
    },
  )
  // position-try-order utilities
  matchUtilities(
    {
      'try-order': (value) => ({
        'position-try-order': value,
      }),
    },
    {
      values: {
        normal: 'normal',
        w: 'most-width',
        h: 'most-height',
      },
    },
  )
  // position-try-fallbacks utilities
  matchUtilities(
    {
      'try': (value) => ({
        'position-try-fallbacks': value,
      }),
    },
    {
      values: {
        none: 'none',
        'flip-x': 'flip-inline',
        'flip-y': 'flip-block',
        'flip-s': 'flip-start',
        ...positionAreaValues,
      },
    },
  )
}) satisfies PluginCreator;

// Cast to any to resolve d.ts generation issue
export default anchors as any;
