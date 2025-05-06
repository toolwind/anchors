import { parseModifier } from './node_modules/tailwindcss-v4/src/candidate.js';

const prefixAnchorName = (name: string) => `--tw-anchor_${name}`;

const validateVarName = (name: string) => {
  if (!name.startsWith('--') || name.length <= 2) {
    throw new Error(`Invalid variable name: ${name}`);
  }
}

export type E_Type = ((className: string) => string);

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

export const normalizeAnchorName = (modifier: string, isV4: boolean) => {
  // Trim leading/trailing whitespace - potentially needed for v4 pre-processed values
  console.group({ rawModifier: `"${modifier}" (original)`, modifier: `"${modifier.trim()}"`, isV4 });
  modifier = modifier.trim();

  console.log(`test parseModifier :: ${modifier} === ${parseModifier(modifier)}`);

  try {
    // --- V4 LOGIC ---
    if (isV4) {
      /** this console.log has to stay here while the other logs are here,
       * because the compiler is breaking with the console.group() without
       * inner console.log's, presumably */
      console.log("test");
      if (
        reservedNames.some(name => modifier === name) ||
        modifier.startsWith('--') ||
        modifier.startsWith('var(')
      ) {
        return modifier;
      }
      return prefixAnchorName(modifier);
    }
    // --- V3 LOGIC ---
    else {
      const escape = (str: string) => str.replace(/_/g, '\\_').replace(/ /g, '_');
      console.log("V3 Path");
      // Use the *trimmed* modifier for V3 parsing logic.
      // Direct CSS var
      if (modifier.startsWith('--')) {
        validateVarName(modifier);
        console.log("V3: Direct CSS var:", modifier);
        return modifier; // Return as-is
      }
      // Arbitrary Value [...]
      if (modifier.startsWith('[') && modifier.endsWith(']')) {
        const modifierInner = modifier.slice(1, -1);
        // Apply v3 escape function to the inner content
        const escapedInner = escape(modifierInner);
        console.log(`V3: Arbitrary [...] -> Inner: "${modifierInner}", Escaped: "${escapedInner}"`);

        // Check structure of *escaped* inner value
        if (escapedInner.startsWith('--')) {
           validateVarName(escapedInner);
           console.log(`V3: Arbitrary [--x] -> var(${escapedInner})`);
           // Arbitrary CSS vars in v3 need to be wrapped in var()
           return `var(${escapedInner})`;
        }
        if (escapedInner.startsWith('var(--') && escapedInner.endsWith(')')) {
           validateVarName(escapedInner.slice(4, -1));
           console.log(`V3: Arbitrary [var(--x)] -> ${escapedInner}`);
           // It's already var(), just return the escaped content
           return escapedInner;
        }
        // Other arbitrary values (like escaped _foo, inherit, etc.)
        console.log(`V3: Arbitrary [...] -> Other: ${escapedInner}`);
        // Return the properly escaped inner value
        return escapedInner;
      }
       // V4 shorthand () - should error in v3 (this check might be redundant if v4 path handles it, but safe to keep)
       if (modifier.startsWith('(') && modifier.endsWith(')')) {
         throw new Error(`This variable shorthand syntax is only supported in Tailwind CSS v4.0 and above: ${modifier}. In v3.x, you must use [${modifier.slice(1,-1)}].`);
       }
      // Plain Modifier Name
      console.log(`V3: Plain name: "${modifier}"`);
      // Escape the plain modifier name for v3
      const escapedModifier = escape(modifier);
      const prefixedName = prefixAnchorName(escapedModifier);
      console.log(`V3: Plain name -> Prefixed: ${prefixedName}`);
      return prefixedName;
    }
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

