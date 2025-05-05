const prefixAnchorName = (name: string) => `--tw-anchor_${name}`;

const validateVarName = (name: string) => {
  if (!name.startsWith('--') || name.length <= 2) {
    throw new Error(`Invalid variable name: ${name}`);
  }
}

export type E_Type = ((className: string) => string);

export const normalizeAnchorName = (modifier: string, isV4: boolean, e: E_Type) => {
  // Trim leading/trailing whitespace - potentially needed for v4 pre-processed values
  const processedModifier = modifier.trim();
  console.group({ modifier: `"${modifier}" (original)`, processedModifier: `"${processedModifier}"`, isV4 });

  try {
    // --- V4 LOGIC ---
    if (isV4) {
      console.log("V4 Path");
      // V4 pre-processes/escapes, so we check the processed value directly.
      // Check if it's already a valid variable or var() function.
      if (processedModifier.startsWith('--')) {
        validateVarName(processedModifier);
        console.log("V4: Direct CSS var:", processedModifier);
        return processedModifier;
      }
      if (processedModifier.startsWith('var(--') && processedModifier.endsWith(')')) {
        validateVarName(processedModifier.slice(4, -1));
        console.log("V4: var() function:", processedModifier);
        return processedModifier;
      }
      // Otherwise, assume it's a plain name needing prefixing.
      // For V4, `e` should be the identity function `(str => str)`.
      const escapedForV4 = e(processedModifier);
      const prefixedName = prefixAnchorName(escapedForV4);
      console.log(`V4: Plain name -> Prefixed: ${prefixedName}`);
      return prefixedName;
    }
    // --- V3 LOGIC ---
    else {
      console.log("V3 Path");
      // Use the *trimmed* modifier for V3 parsing logic.
      // Direct CSS var
      if (processedModifier.startsWith('--')) {
        validateVarName(processedModifier);
        console.log("V3: Direct CSS var:", processedModifier);
        return processedModifier; // Return as-is
      }
      // Arbitrary Value [...]
      if (processedModifier.startsWith('[') && processedModifier.endsWith(']')) {
        const modifierInner = processedModifier.slice(1, -1);
        // Apply v3 escape function to the inner content
        const escapedInner = e(modifierInner);
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
       if (processedModifier.startsWith('(') && processedModifier.endsWith(')')) {
         throw new Error(`This variable shorthand syntax is only supported in Tailwind CSS v4.0 and above: ${processedModifier}. In v3.x, you must use [${processedModifier.slice(1,-1)}].`);
       }
      // Plain Modifier Name
      console.log(`V3: Plain name: "${processedModifier}"`);
      // Escape the plain modifier name for v3
      const escapedModifier = e(processedModifier);
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

