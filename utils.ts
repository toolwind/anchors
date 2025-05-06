import { parseModifier as parseModifierV4 } from './node_modules/tailwindcss-v4/src/candidate.js';

const prefixAnchorName = (name: string) => `--tw-anchor_${name}`;

const validateVarName = (name: string) => {
  if (!name.startsWith('--') || name.length <= 2) {
    throw new Error(`Invalid variable name: ${name}`);
  }
}

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
  if (!modifier) return null;
  /** current bug: v4 parses variable shorthand syntax in modifiers as
   * standard arbitrary values and replaces underscores with spaces,
   * so this undoes that as a stop-gap-solution */
  modifier = modifier.trim().replace(/ /g, '_');

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
  // Trim leading/trailing whitespace - potentially needed for v4 pre-processed values
  console.group({ rawModifier: `"${modifier}" (original)`, modifier: `"${modifier.trim()}"`, isV4 });
  modifier = modifier.trim();

  console.log(`test parseModifier :: ${modifier} === ${JSON.stringify(parseModifierV4(modifier))}`);

  if (!modifier) {
    return null;
  }

  try {
    // --- V4 LOGIC ---
    if (isV4) {
      /** this console.log has to stay here while the other logs are here,
       * because the compiler is breaking with the console.group() without
       * inner console.log's, presumably */
      console.log("test");
      return normalizeAnchorNameCore(modifier);
    }
    // --- V3 LOGIC ---
    else {
      console.log("V3 Path");
      // Use the *trimmed* modifier for V3 parsing logic.
      // Direct CSS var
      if (modifier.startsWith('(') && modifier.endsWith(')')) {
        throw new Error(`This variable shorthand syntax is only supported in Tailwind CSS v4.0 and above: ${modifier}. In v3.x, you must use [${modifier.slice(1,-1)}].`);
      }
      // in v3, [--name] is the variable shorthand syntax, so wrap in var()
      if (modifier.startsWith('[--')) {
        return `var(${modifier.slice(1, -1)})`;
      }
      return normalizeAnchorNameCore(parseModifierV4(modifier)?.value);
    }
  } catch (e) {
    console.error(e);
    return null;
  } finally {
    console.groupEnd();
  }
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

