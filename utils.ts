const prefixAnchorName = (name: string) => `--tw-anchor_${name}`;

const validateVarName = (name: string) => {
  if (!name.startsWith('--') || name.length <= 2) {
    throw new Error(`Invalid variable name: ${name}`);
  }
}

export type E_Type = ((className: string) => string);

export const normalizeAnchorName = (modifier: string, isV4: boolean, e: E_Type) => {
  modifier = modifier.trim();
  try {
    console.group({ modifier, isV4 });
    if (modifier.startsWith('--')) {
      validateVarName(modifier);
      console.log(`${modifier}.startsWith('--')`);
      console.log(modifier);
      return modifier;
    }
    // in v4, even using `modifiers: 'any', the variable name is pre-processed (`(--x)` -> `var(--x)`)
    if (modifier.startsWith('var(--') && modifier.endsWith(')')) {
      console.log(`${modifier}.startsWith('[') && ${modifier}.endsWith(']')`);
      // validate the variable name inside `var(…)`
      validateVarName(modifier.slice(4, -1));
      console.log(`${modifier}.startsWith('var(--') && ${modifier}.endsWith(')')`);
      console.log(modifier);
      return modifier;
    }
    if (modifier.startsWith('(') && modifier.endsWith(')')) {
      console.log(`${modifier}.startsWith('(') && ${modifier}.endsWith(')')`);
      const modifierInner = modifier.slice(1, -1);
      validateVarName(modifierInner);
      if (!isV4) {
        throw new Error(`This variable shorthand syntax is only supported in Tailwind CSS v4.0 and above: ${modifier}. In v3.x, you must use [${modifierInner}].`);
      }
      console.log(modifier);
      return `var${modifierInner}`;
    }
    if (modifier.startsWith('[') && modifier.endsWith(']')) {
      console.log(`${modifier}.startsWith('[') && ${modifier}.endsWith(']')`);
      let modifierInner = modifier.slice(1, -1);
      // Apply escape function to the inner content
      modifierInner = e(modifierInner);

      if (modifierInner.startsWith('var(--') && modifierInner.endsWith(')')) {
        console.log(`${modifierInner}.startsWith('var(--') && ${modifierInner}.endsWith(')')`);
        // validate the variable name inside `var(…)`
        validateVarName(modifierInner.slice(4, -1));
        console.log(modifier);
        return modifierInner;
      }
      if (modifierInner.startsWith('--')) {
        console.log(`${modifierInner}.startsWith('--')`);
        validateVarName(modifierInner);
        if (!isV4) {
          console.log(`!isV4`);
          // TODO: TEST THIS B/C I ADDED THE () AFTER `VAR`
          console.log(`var(${modifierInner})`);
          return `var(${modifierInner})`;
        }
        console.log(modifierInner);
        return modifierInner;
      }
      // assume that the user is passing a valid value (e.g. inherit, initial, etc.)
      console.log(`(ELSE-DEPTH-1)`);
      console.log(modifierInner);
      return modifierInner; // Return escaped inner value
    }
    console.log(`(ELSE-DEPTH-0)`);
    // Apply escape function before prefixing
    const escapedModifier = e(modifier);
    const prefixedName = prefixAnchorName(escapedModifier);
    console.log(`${prefixedName}`); // Log prefixed name
    return prefixedName;
  } finally {
    console.groupEnd();
  }
}

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

