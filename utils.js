const matches = (toMatch, matchers) => {
  if (!matchers) {
    return false;
  }

  if (matchers instanceof RegExp) {
    return matchers.test(toMatch);
  }

  if (typeof matchers === 'string') {
    return toMatch.includes(matchers);
  }

  return matchers.some((matcher) => {
    if (matcher instanceof RegExp) {
      return matcher.test(toMatch);
    } else {
      return toMatch.includes(matcher);
    }
  });
};

const getModifiedElement = (tag, mediaValue) => {
  return Object.assign({}, tag, {
    attributes: Object.assign({}, tag.attributes, {
      media: mediaValue,
    }),
  });
};

const isStylesheetTag = (tag) => {
  return tag.tagName === 'link' && tag.attributes.rel === 'stylesheet' &&
      tag.attributes.href;
};

module.exports = {
  isStylesheetTag,
  matches,
  getModifiedElement,
};
