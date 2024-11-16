class ErrorLoadingException extends Error {
  constructor(message) {
    super(message);
    this.name = "ErrorLoadingException";
  }
}

function matchingKey(value, script) {
  const regex = new RegExp(`,${value}=((?:0x)?([0-9a-fA-F]+))`);
  const match = script.match(regex);
  if (match) {
    return match[2];
  } else {
    throw new ErrorLoadingException("Failed to match the key");
  }
}

function getKeys(script) {
  const regex =
    /case\s*0x[0-9a-f]+:(?![^;]*=partKey)\s*\w+\s*=\s*(\w+)\s*,\s*\w+\s*=\s*(\w+);/g;
  const matches = script.matchAll(regex);

  return Array.from(matches, (match) => {
    const matchKey1 = matchingKey(match[1], script);
    const matchKey2 = matchingKey(match[2], script);
    try {
      return [parseInt(matchKey1, 16), parseInt(matchKey2, 16)];
    } catch (e) {
      return [];
    }
  }).filter((pair) => pair.length > 0);
}

export default getKeys;
