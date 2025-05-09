import crypto from 'crypto';
import { parseModifier as parseModifierV4 } from './node_modules/tailwindcss-v4/src/candidate.js';

const prefixAnchorName = (name: string) => `--tw-anchor_${name}`;

const reservedNames = [
  // global values
  'inherit',
  'initial',
  'revert',
  'revert-layer',
  'unset',
  // none is a reserved value for `anchor-name`
  'none',
];

const normalizeAnchorNameCore = (modifier: string | undefined) => {
  // trim in case of any leading/trailing whitespace
  modifier = modifier?.trim();
  if (!modifier) return null;

  /** current bug: v4 parses variable shorthand syntax in modifiers as
   * standard arbitrary values and replaces underscores with spaces,
   * so this undoes that as a stop-gap-solution */
  modifier = modifier.replace(/ /g, '_');

  if (
    reservedNames.some(name => modifier === name) ||
    modifier.startsWith('--') ||
    modifier.startsWith('var(')
  ) {
    return modifier;
  }
  return prefixAnchorName(modifier);
}

export const normalizeAnchorName = (modifier: string, isV4: boolean) => {
  if (!modifier) return null;
  if (isV4) return normalizeAnchorNameCore(modifier);
  // Don't allow v3 to use v4 variable shorthand syntax: `(--name)` -> `var(--name)`
  if (modifier.startsWith('(') && modifier.endsWith(')')) {
    throw new Error(`This variable shorthand syntax is only supported in Tailwind CSS v4.0 and above: ${modifier}. In v3.x, you must use [${modifier.slice(1,-1)}].`);
  }
  // Explicitly support v3 variable shorthand syntax: `[--name]` -> `var(--name)`
  if (modifier.startsWith('[--')) {
    return `var(${modifier.slice(1, -1)})`;
  }
  return normalizeAnchorNameCore(parseModifierV4(modifier)?.value);
};

// encode & decode functions to normalize anchor names for use in view-transition-name
export const encoding = {
  encode: (str: string) => {
    let encoded = '';
    for (const char of str) {
      encoded += char.charCodeAt(0).toString(36);
    }
    return encoded;
  },
  decode: (encodedStr: string) => {
    const decodedChars = [];
    let charCode = '';
    for (const char of encodedStr) {
      charCode += char;
      const code = Number.parseInt(charCode, 36);
      if (!isNaN(code) && code >= 32 && code <= 126) {
        decodedChars.push(String.fromCharCode(code));
        charCode = '';
      }
    }
    return decodedChars.join('');
  }
};

export const generateRandomString = (length = 10) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const values = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    result += charset[(values[i] ?? 0) % charset.length];
  }

  return result;
}

type ToggleReturn = ReturnType<typeof createToggle>;
type TogglesReturn = [
  cssStyles: ToggleReturn[0],
  toggles: Record<string, ToggleReturn[1]>,
  groupedToggles: {
    on: ToggleReturn[1]['on'];
    off: ToggleReturn[1]['off'];
  },
];

export const createToggle = (property: string, on: string, off: string) => {
  const varName = `--toolwind-toggle-${generateRandomString()}`;
  return [
    {
      [property]: `var(${varName}, ${off})`,
    },
    {
      on: { [varName]: on, },
      off: { [varName]: off, },
    },
  ] as const;
}

export const createToggles = (
  togglesData: Parameters<typeof createToggle>[],
): TogglesReturn => {
  return togglesData.reduce(
    (acc: TogglesReturn, [property, on, off]) => {
      const [cssStyles, toggle] = createToggle(property, on, off);
      return [
        { ...acc[0], ...cssStyles },
        { ...acc[1], [property]: toggle },
        { ...acc[2], on: { ...acc[2].on, ...toggle.on }, off: { ...acc[2].off, ...toggle.off } },
      ];
    },
    [{}, {}, { on: {}, off: {} }],
  );
};

// position area values for use in anchored and position-try-fallbacks utilities
export const positionAreaValues = Object.fromEntries(
  [
    'top center',
    'top span-left',
    'top span-right',
    'top',
    'left center',
    'left span-top',
    'left span-bottom',
    'left',
    'right center',
    'right span-top',
    'right span-bottom',
    'right',
    'bottom center',
    'bottom span-left',
    'bottom span-right',
    'bottom',
    'top left',
    'top right',
    'bottom left',
    'bottom right',
  ].map((value) => [value.replace(/ /g, '-'), value])
);

