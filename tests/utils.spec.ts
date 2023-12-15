import assert from "assert";
import { escape } from "../src/utils.js";

it("utils.escape", () => {
  const string = "<This \"' is the string to &escape !>";
  const escaped = escape(string);
  const expected = "&lt;This &quot;&#39; is the string to &amp;escape !&gt;";

  assert.strictEqual(escaped, expected);
});
