const prefixAnchorName = (name: string) => `--tw-anchor_${name}`;

const validateVarName = (name: string) => {
  if (!name.startsWith('--') || name.length <= 2) {
    throw new Error(`Invalid variable name: ${name}`);
  }
}

export const normalizeAnchorName = (modifier: string, isV4: boolean) => {
  if (modifier.startsWith('--')) {
    validateVarName(modifier);
    return modifier;
  }
  if (modifier.startsWith('(') && modifier.endsWith(')')) {
    const modifierInner = modifier.slice(1, -1);
    validateVarName(modifierInner);
    if (!isV4) {
      throw new Error(`This variable shorthand syntax is only supported in Tailwind CSS v4.0 and above: ${modifier}. In v3.x, you must use [${modifierInner}].`);
    }
    return `var(${modifierInner})`;
  }
  if (modifier.startsWith('[') && modifier.endsWith(']')) {
    const modifierInner = modifier.slice(1, -1);
    if (modifierInner.startsWith('var(--') && modifierInner.endsWith(')')) {
      // validate the variable name inside `var(…)`
      validateVarName(modifierInner.slice(4, -1));
      return modifierInner;
    }
    if (modifierInner.startsWith('--')) {
      validateVarName(modifierInner);
      if (!isV4) {
        return `var(${modifierInner})`;
      }
      return modifierInner;
    }
    // assume that the user is passing a valid value (e.g. inherit, initial, etc.)
    return modifierInner;
  }
  return prefixAnchorName(modifier);
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

