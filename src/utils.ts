const reUnescapedHtml = /[&<>"']/g;
const reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
const escapeHtmlChar = Object.freeze({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
});

/**
 * Escape the characters "&", "<", ">", '"', and "'" in the given string to their corresponding HTML entities.
 * @param {string} string the string to escape
 * @returns {string} the escaped string
 */
export function escape(string: string): string {
  return reHasUnescapedHtml.test(string)
    ? string.replace(reUnescapedHtml, (key: string) => escapeHtmlChar[key as keyof typeof escapeHtmlChar])
    : string;
}
