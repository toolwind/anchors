const prefixAnchorName = (name: string) => `--tw-anchor_${name}`;

const validateVarName = (name: string) => {
  if (!name.startsWith('--') || name.length <= 2) {
    throw new Error(`Invalid variable name: ${name}`);
  }
}

export const getIdentVarValue = (modifier: string) => {
  if (modifier.startsWith('--')) {
    validateVarName(modifier);
    return modifier;
  }
  if (([['(',')'],['[',']']] as const).some(([start, end]) => modifier.startsWith(start) && modifier.endsWith(end))) {
    return modifier;
  }
  return prefixAnchorName(modifier);
}
