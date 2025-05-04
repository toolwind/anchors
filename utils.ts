const prefixAnchorName = (name: string) => `--tw-anchor_${name}`;

/**
 * Normalize the anchor name to a valid dashed identifier
 * @param modifier - The anchor name to normalize
 * @returns The normalized anchor name
 */
export const normalizeAnchorName = (modifier: string) => {
  /* cases to preserve the passed value as is: */
  if (
    /* 1. modifier is already an explicit custom ident, return it */
    (modifier.startsWith('--') && modifier.length > 2) ||
    /* 2. modifier is a function call or array access, return it */
    (([['(',')'],['[',']']] as const).some(([start, end]) => modifier.startsWith(start) && modifier.endsWith(end)))
  ) {
    return modifier;
  }
  /**
   * otherwise, assume the user knows what they're doing.
   * 1. treat the value as a the custom-ident
   * 2. convert it to a valid dashed identifier
   */
  return `--tw-anchor_${modifier}`;
}

/* encode & decode functions to normalize anchor names for use in view-transition-name */
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

/**
 * Position area values for use in the anchored and position-try-fallbacks utilities
 */
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

