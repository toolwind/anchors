import type { PluginCreator } from 'tailwindcss/plugin';

const getStyleVarName = (modifier: string) =>
  modifier.startsWith('--') || modifier.startsWith('var(--')
    ? modifier
    : modifier.startsWith('[var(--')
      ? modifier.slice(1, -1)
      : `--tw-anchor_${modifier}`

const generateViewTransitionId = (str: string) => `--tw-anchor-view-transition-${encodeString(str)}`

// using empty values here so the compiler plays nice and generates the styles without values
const EMPTY_VALUES = { values: { DEFAULT: '' } }

// Explicitly type the function passed to plugin()
const anchors = (({ matchUtilities, theme }) => {
  // anchor utilities (anchor-name)
  matchUtilities(
    {
      anchor: (_, { modifier }) => {
        const styles: Record<string, string> = {};
        if (modifier) {
          const anchorName = getStyleVarName(modifier);
          if (anchorName) {
            styles['anchor-name'] = anchorName;
          }
        }
        return styles;
      },
    },
    {
      ...EMPTY_VALUES,
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
          baseStyles['position-anchor'] = getStyleVarName(modifier);
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
        DEFAULT: '',
        'top-center': 'top center',
        'top-span-left': 'top span-left',
        'top-span-right': 'top span-right',
        top: 'top',
        'left-center': 'left center',
        'left-span-top': 'left span-top',
        'left-span-bottom': 'left span-bottom',
        left: 'left',
        'right-center': 'right center',
        'right-span-top': 'right span-top',
        'right-span-bottom': 'right span-bottom',
        right: 'right',
        'bottom-center': 'bottom center',
        'bottom-span-left': 'bottom span-left',
        'bottom-span-right': 'bottom span-right',
        bottom: 'bottom',
        'top-left': 'top left',
        'top-right': 'top right',
        'bottom-left': 'bottom left',
        'bottom-right': 'bottom right',
      },
      modifiers: 'any',
    },
  );
  // anchor() utilities
  ;([
    ['top', theme('top')],
    ['right', theme('right')],
    ['bottom', theme('bottom')],
    ['left', theme('left')],
    ['inset', theme('inset')],
  ] as const).forEach(([property, themeValues]) => {
    ;['top', 'right', 'bottom', 'left', 'start', 'end', 'self-start', 'self-end', 'center'].forEach(
      (anchorSide) => {
        matchUtilities(
          {
            [`${property}-anchor-${anchorSide}`]: (offset, { modifier }) => {
              const anchorRef = modifier ? `${getStyleVarName(modifier)} ` : ''
              const anchorFnExpr = `anchor-size(${anchorRef}${anchorSide})`
              const value = offset ? `calc(${anchorFnExpr} + ${offset})` : anchorFnExpr
              return {
                [property]: value,
              }
            },
          },
          {
            values: themeValues,
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
              const anchorRef = modifier ? `${getStyleVarName(modifier)} ` : ''
              const anchorFnExpr = `anchor-size(${anchorRef}${anchorSize})`
              const value = offset ? `calc(${anchorFnExpr} + ${offset})` : anchorFnExpr
              return {
                [property]: value,
              }
            },
          },
          {
            values: themeValues,
            modifiers: 'any',
          },
        )
      },
    )
  })
}) satisfies PluginCreator;

// Cast to any to resolve d.ts generation issue
export default anchors as any;

/* encode & decode functions to normalize anchor names for use as custom dashed idents */

function encodeString(str: string) {
  let encoded = ''
  for (let i = 0; i < str.length; i++) {
    encoded += str.charCodeAt(i).toString(36) // Convert to base 36
  }
  return encoded
}

function decodeString(encodedStr: string) {
  const decodedChars = []
  let charCode = ''

  for (let i = 0; i < encodedStr.length; i++) {
    charCode += encodedStr[i]
    if (parseInt(charCode, 36) >= 32 && parseInt(charCode, 36) <= 126) {
      decodedChars.push(String.fromCharCode(parseInt(charCode, 36)))
      charCode = ''
    }
  }
  return decodedChars.join('')
}
