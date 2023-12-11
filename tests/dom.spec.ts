import assert from "assert";
import {
  addClass,
  createFromTemplate,
  createNodeWith,
  getAttribute,
  getData,
  hasAttribute,
  hasClass,
  hasTagName,
  is,
  isCommentNode,
  isHTMLElement,
  isSelfClosing,
  isTextNode,
  removeClass,
  removeCommentNodes,
  removeEmptyTextNodes,
  removeNodes,
  removeNodesRecursively,
  replaceNodeStyleByTag,
  replaceNodeWith,
  resetAttributesTo,
  setAttribute,
  setData,
  textifyNode,
  trimTag,
  unwrapNode,
  updateCSS,
} from "../src/dom.js";

it("core.dom.isCommentNode", () => {
  const template = "<div><!--Comment Node-->Text Node<p>HTML Element</p></div>";
  const node = createFromTemplate(template);

  assert.strictEqual(isCommentNode(node.childNodes[0]), true);
});

it("core.dom.isTextNode", () => {
  const template = "<div><!--Comment Node-->Text Node<p>HTML Element</p></div>";
  const node = createFromTemplate(template);

  assert.strictEqual(isTextNode(node.childNodes[1]), true);
});

it("core.dom.isHTMLElement", () => {
  const template = "<div><!--Comment Node-->Text Node<p>HTML Element</p></div>";
  const node = createFromTemplate(template);

  assert.strictEqual(isHTMLElement(node.childNodes[2]), true);
});

it("core.dom.createFromTemplate", () => {
  const template = '<p class="bar" foo="bar">Hello world</p>';
  const node = createFromTemplate(template);

  assert.strictEqual(node.outerHTML, template);
});

it("core.dom.updateCSS", () => {
  document.body.innerHTML = "<div></div>";
  const node = document.querySelector("div")!;

  updateCSS(node, "color", "red");
  updateCSS(node, "font-size", "20px");
  updateCSS(node, { top: "10px", "background-color": "blue", "text-align": "center" });

  assert.strictEqual(node.style.color, "red");
  assert.strictEqual(node.style.fontSize, "20px");
  assert.strictEqual(node.style.top, "10px");
  assert.strictEqual(node.style.backgroundColor, "blue");
  assert.strictEqual(node.style.textAlign, "center");

  updateCSS(node, "color", "blue");
  updateCSS(node, "font-size", "30px");
  updateCSS(node, { top: "20px", "background-color": "red", "text-align": "left" });

  assert.strictEqual(node.style.color, "blue");
  assert.strictEqual(node.style.fontSize, "30px");
  assert.strictEqual(node.style.top, "20px");
  assert.strictEqual(node.style.backgroundColor, "red");
  assert.strictEqual(node.style.textAlign, "left");

  updateCSS(node, "color", null);
  updateCSS(node, "font-size", null);
  updateCSS(node, { top: null, "background-color": null, "text-align": null });

  assert.strictEqual(node.style.color, "");
  assert.strictEqual(node.style.fontSize, "");
  assert.strictEqual(node.style.top, "");
  assert.strictEqual(node.style.backgroundColor, "");
  assert.strictEqual(node.style.textAlign, "");
});

it("core.dom.hasAttribute", () => {
  document.body.innerHTML = '<p class="bar" foo="bar">Hello world</p>';
  const node = document.querySelector("p")!;

  assert.strictEqual(hasAttribute(node, "foo"), true);
});

it("core.dom.getAttribute", () => {
  document.body.innerHTML = '<p class="bar" foo="bar">Hello world</p>';
  const node = document.querySelector("p")!;

  assert.strictEqual(getAttribute(node, "foo"), "bar");
});

it("core.dom.setAttribute", () => {
  document.body.innerHTML = '<p class="bar" foo="bar">Hello world</p>';
  const node = document.querySelector("p")!;

  setAttribute(node, "foo", null);
  setAttribute(node, "bar", "foo");

  assert.strictEqual(node.getAttribute("foo"), null);
  assert.strictEqual(node.getAttribute("bar"), "foo");
});

it("core.dom.getData", () => {
  document.body.innerHTML = '<p class="bar" data-key="value" data-dashed-key="dashed">Hello world</p>';
  const node = document.querySelector("p")!;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = getData(node) as any;
  const dashed = getData(node, "dashedKey");

  assert.strictEqual(data.key, "value");
  assert.strictEqual(data.dashedKey, "dashed");
  assert.strictEqual(dashed, "dashed");
});

it("core.dom.setData", () => {
  document.body.innerHTML = '<p class="bar" data-key="value">Hello world</p>';
  const node = document.querySelector("p")!;
  setData(node, "key", "bar");
  setData(node, "foo", "bar");

  assert.strictEqual(getData(node, "key"), "bar");
  assert.strictEqual(getData(node, "foo"), "bar");
});

it("core.dom.hasTagName", () => {
  document.body.innerHTML = "<p>Hello world</p>";
  const node = document.querySelector("p")!;

  assert.strictEqual(hasTagName(node, "i"), false);
  assert.strictEqual(hasTagName(node, ["i", "u"]), false);
  assert.strictEqual(hasTagName(node, "p"), true);
  assert.strictEqual(hasTagName(node, ["i", "u", "p"]), true);
});

it("core.dom.hasClass", () => {
  document.body.innerHTML = '<p class="bar">Hello world</p>';
  const node = document.querySelector("p")!;

  assert.strictEqual(hasClass(node, "foo"), false);
  assert.strictEqual(hasClass(node, "bar"), true);
});

it("core.dom.addClass", () => {
  document.body.innerHTML = '<p class="bar">Hello world</p>';
  const node = document.querySelector("p")!;
  addClass(node, "foo");
  addClass(node, ["abc", "def"]);

  const classList = node.classList;
  assert.strictEqual(
    ["bar", "foo", "abc", "def"].every((className) => classList.contains(className)),
    true
  );
});

it("core.dom.removeClass", () => {
  document.body.innerHTML = '<p class="bar foo abc def">Hello world</p>';
  const node = document.querySelector("p")!;
  removeClass(node, "foo");
  removeClass(node, ["abc", "def"]);

  const classList = node.classList;
  assert.strictEqual(
    ["foo", "abc", "def"].some((className) => classList.contains(className)),
    false
  );
});

it("core.dom.is", () => {
  document.body.innerHTML = '<p class="bar">Hello world</p>';
  const node = document.querySelector("p")!;

  assert.strictEqual(is(node, "p.bar"), true);
});

it("core.dom.createNodeWith", () => {
  const node1 = createNodeWith("span", {
    innerHTML: "<b>Bold text</b>",
    attributes: { attr1: "value1", attr2: "value2" },
  });
  assert.strictEqual(node1.outerHTML, '<span attr1="value1" attr2="value2"><b>Bold text</b></span>');

  const node2 = createNodeWith("span", {
    textContent: "Simple text",
    attributes: { attr1: "value1", attr2: "value2" },
  });
  assert.strictEqual(node2.outerHTML, '<span attr1="value1" attr2="value2">Simple text</span>');
});

it("core.dom.replaceNodeWith", () => {
  document.body.innerHTML = "<p>Hello world</p>";
  const node = document.createElement("span");
  node.textContent = "Simple text";

  replaceNodeWith(document.querySelector("p")!, node);
  assert.strictEqual(document.body.innerHTML, "<span>Simple text</span>");
});

it("core.dom.unwrapNode", () => {
  document.body.innerHTML = "<div><b>Hello world</b>, this is a simple text</div>";

  const newNodes = unwrapNode(document.querySelector("div")!);
  assert.strictEqual(document.body.innerHTML, "<b>Hello world</b>, this is a simple text");
  assert.strictEqual(newNodes.length, 2);
  assert.strictEqual(newNodes[0], document.querySelector("b"));
  assert.strictEqual(newNodes[1].nodeType, Node.TEXT_NODE);
  assert.strictEqual(newNodes[1].textContent, ", this is a simple text");
});

it("core.dom.textifyNode", () => {
  document.body.innerHTML = "<div><b>Hello world</b>, this is a simple text</div>";

  textifyNode(document.querySelector("div")!);
  assert.strictEqual(document.body.innerHTML, "Hello world, this is a simple text");
});

it("core.dom.isSelfClosing", () => {
  assert.strictEqual(isSelfClosing("I"), false);
  assert.strictEqual(isSelfClosing("B"), false);
  assert.strictEqual(isSelfClosing("P"), false);
  assert.strictEqual(isSelfClosing("BR"), true);
  assert.strictEqual(isSelfClosing("HR"), true);
  assert.strictEqual(isSelfClosing("IMG"), true);
});

it("core.dom.removeNodes", () => {
  document.body.innerHTML = "<div></div><p>Hello world</p><span></span>";

  removeNodes(document.body, (el) => el.nodeType === Node.ELEMENT_NODE && (el as HTMLElement).tagName !== "P");
  assert.strictEqual(document.body.innerHTML, "<p>Hello world</p>");
});

it("core.dom.removeNodesRecursively", () => {
  document.body.innerHTML =
    "<div><span></span></div><p>This is a simple text with <i>italic text<span></span></i> and empty tags<b></b></p><span></span>";

  removeNodesRecursively(
    document.body,
    (el) => el.nodeType === Node.ELEMENT_NODE && ((el as HTMLElement).textContent?.length ?? 0) === 0
  );
  assert.strictEqual(document.body.innerHTML, "<p>This is a simple text with <i>italic text</i> and empty tags</p>");
});

it("core.dom.removeEmptyTextNodes", () => {
  document.body.innerHTML = "<p>Hello world <b> </b></p> <!-- Comments --> <div> </div>";

  removeEmptyTextNodes(document.body);
  assert.strictEqual(document.body.innerHTML, "<p>Hello world <b> </b></p><!-- Comments --><div> </div>");
});

it("core.dom.removeCommentNodes", () => {
  document.body.innerHTML = "<p>Hello world <b> </b></p> <!-- Comments --> <div> </div>";

  removeCommentNodes(document.body);
  assert.strictEqual(document.body.innerHTML, "<p>Hello world <b> </b></p>  <div> </div>");
});

it("core.dom.resetAttributesTo", () => {
  const node = document.createElement("span");
  node.setAttribute("attr1", "value1");
  node.setAttribute("attr2", "value2");
  node.setAttribute("attr3", "value3");
  node.textContent = "Simple text";

  resetAttributesTo(node, { foo: "bar" });
  assert.strictEqual(node.outerHTML, '<span foo="bar">Simple text</span>');

  resetAttributesTo(node, {});
  assert.strictEqual(node.outerHTML, "<span>Simple text</span>");
});

it("core.dom.replaceNodeStyleByTag", () => {
  let node = document.createElement("b");
  node.setAttribute("style", "font-weight: normal;");
  node.textContent = "Simple text";

  node = replaceNodeStyleByTag(node);
  assert.strictEqual(node.outerHTML, '<span style="font-weight: normal;">Simple text</span>');

  node = document.createElement("span");
  node.setAttribute("style", "font-weight: 900;");
  node.textContent = "Simple text";

  node = replaceNodeStyleByTag(node);
  assert.strictEqual(node.outerHTML, '<b><span style="">Simple text</span></b>');

  node = document.createElement("span");
  node.setAttribute("style", "font-style: italic;");
  node.textContent = "Simple text";

  node = replaceNodeStyleByTag(node);
  assert.strictEqual(node.outerHTML, '<i><span style="">Simple text</span></i>');
});

it("core.dom.trimTag", () => {
  document.body.innerHTML = "<div></div><div></div><p>Hello world</p><div></div><span>Simple text</span><div></div>";

  trimTag(document.body, "div");
  assert.strictEqual(document.body.innerHTML, "<p>Hello world</p><div></div><span>Simple text</span>");
});
