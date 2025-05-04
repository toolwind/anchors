const prefixAnchorName = (name: string) => `--tw-anchor_${name}`;

const validateVarName = (name: string) => {
  if (!name.startsWith('--') || name.length <= 2) {
    throw new Error(`Invalid variable name: ${name}`);
  }
}

export const getIdentVarValue = (modifier: string, isV4: boolean, reserved: string[] = []) => {
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
    // reserved arbitrary value names
    const reservedValues = [...reserved, 'inherit', 'initial', 'revert', 'unset'];
    if (reservedValues.includes(modifierInner)) {
      return modifierInner;
    }
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
    throw new Error(`Invalid modifier: ${modifier}.`);
  }
  return prefixAnchorName(modifier);
}
