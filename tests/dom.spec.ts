import assert from "assert";
import {
  addClass,
  addClassToElement,
  addClassToElements,
  createFragmentFromTemplate,
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
  removeClassFromElement,
  removeClassFromElements,
  removeCommentNodes,
  removeEmptyTextNodes,
  removeNodes,
  removeNodesRecursively,
  replaceAllText,
  replaceNodeStyleByTag,
  replaceNodeWith,
  resetAttributesTo,
  setAttribute,
  setData,
  textifyNode,
  trimTag,
  unwrapNode,
  updateCSS,
  updateCSSOfElement,
  updateCSSOfElements,
} from "../src/dom.js";

it("dom.isCommentNode", () => {
  const template = "<div><!--Comment Node-->Text Node<p>HTML Element</p></div>";
  const node = createFromTemplate(template);

  assert.strictEqual(isCommentNode(node.childNodes[0]), true);
});

it("dom.isTextNode", () => {
  const template = "<div><!--Comment Node-->Text Node<p>HTML Element</p></div>";
  const node = createFromTemplate(template);

  assert.strictEqual(isTextNode(node.childNodes[1]), true);
});

it("dom.isHTMLElement", () => {
  const template = "<div><!--Comment Node-->Text Node<p>HTML Element</p></div>";
  const node = createFromTemplate(template);

  assert.strictEqual(isHTMLElement(node.childNodes[2]), true);
});

it("dom.createFragmentFromTemplate", () => {
  const template = '<p class="bar" foo="bar">Hello world</p><br /><p class="foo">Bar</p>';
  const fragment = createFragmentFromTemplate(template);

  const [p1Node, brNode, p2Node] = fragment.children;
  assert.strictEqual(p1Node.outerHTML, '<p class="bar" foo="bar">Hello world</p>');
  assert.strictEqual(brNode.outerHTML, "<br>");
  assert.strictEqual(p2Node.outerHTML, '<p class="foo">Bar</p>');
});

it("dom.createFromTemplate", () => {
  const template = '<p class="bar" foo="bar">Hello world</p>';
  const node = createFromTemplate(template);

  assert.strictEqual(node.outerHTML, template);
});

it("dom.updateCSS", () => {
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

it("dom.updateCSSOfElement", () => {
  document.body.innerHTML = '<div id="foo"></div>';
  const node = document.getElementById("foo")!;

  updateCSSOfElement("foo", "color", "red");
  updateCSSOfElement("foo", "font-size", "20px");
  updateCSSOfElement("foo", { top: "10px", "background-color": "blue", "text-align": "center" });

  assert.strictEqual(node.style.color, "red");
  assert.strictEqual(node.style.fontSize, "20px");
  assert.strictEqual(node.style.top, "10px");
  assert.strictEqual(node.style.backgroundColor, "blue");
  assert.strictEqual(node.style.textAlign, "center");

  updateCSSOfElement("foo", "color", "blue");
  updateCSSOfElement("foo", "font-size", "30px");
  updateCSSOfElement("foo", { top: "20px", "background-color": "red", "text-align": "left" });

  assert.strictEqual(node.style.color, "blue");
  assert.strictEqual(node.style.fontSize, "30px");
  assert.strictEqual(node.style.top, "20px");
  assert.strictEqual(node.style.backgroundColor, "red");
  assert.strictEqual(node.style.textAlign, "left");

  updateCSSOfElement("foo", "color", null);
  updateCSSOfElement("foo", "font-size", null);
  updateCSSOfElement("foo", { top: null, "background-color": null, "text-align": null });

  assert.strictEqual(node.style.color, "");
  assert.strictEqual(node.style.fontSize, "");
  assert.strictEqual(node.style.top, "");
  assert.strictEqual(node.style.backgroundColor, "");
  assert.strictEqual(node.style.textAlign, "");
});

it("dom.updateCSSOfElements", () => {
  document.body.innerHTML = '<div class="foo"></div>';
  const node = document.querySelector<HTMLElement>(".foo")!;

  updateCSSOfElements(".foo", "color", "red");
  updateCSSOfElements(".foo", "font-size", "20px");
  updateCSSOfElements(".foo", { top: "10px", "background-color": "blue", "text-align": "center" });

  assert.strictEqual(node.style.color, "red");
  assert.strictEqual(node.style.fontSize, "20px");
  assert.strictEqual(node.style.top, "10px");
  assert.strictEqual(node.style.backgroundColor, "blue");
  assert.strictEqual(node.style.textAlign, "center");

  updateCSSOfElements(".foo", "color", "blue");
  updateCSSOfElements(".foo", "font-size", "30px");
  updateCSSOfElements(".foo", { top: "20px", "background-color": "red", "text-align": "left" });

  assert.strictEqual(node.style.color, "blue");
  assert.strictEqual(node.style.fontSize, "30px");
  assert.strictEqual(node.style.top, "20px");
  assert.strictEqual(node.style.backgroundColor, "red");
  assert.strictEqual(node.style.textAlign, "left");

  updateCSSOfElements(".foo", "color", null);
  updateCSSOfElements(".foo", "font-size", null);
  updateCSSOfElements(".foo", { top: null, "background-color": null, "text-align": null });

  assert.strictEqual(node.style.color, "");
  assert.strictEqual(node.style.fontSize, "");
  assert.strictEqual(node.style.top, "");
  assert.strictEqual(node.style.backgroundColor, "");
  assert.strictEqual(node.style.textAlign, "");
});

it("dom.hasAttribute", () => {
  document.body.innerHTML = '<p class="bar" foo="bar">Hello world</p>';
  const node = document.querySelector("p")!;

  assert.strictEqual(hasAttribute(node, "foo"), true);
});

it("dom.getAttribute", () => {
  document.body.innerHTML = '<p class="bar" foo="bar">Hello world</p>';
  const node = document.querySelector("p")!;

  assert.strictEqual(getAttribute(node, "foo"), "bar");
});

it("dom.setAttribute", () => {
  document.body.innerHTML = '<p class="bar" foo="bar">Hello world</p>';
  const node = document.querySelector("p")!;

  setAttribute(node, "foo", null);
  setAttribute(node, "bar", "foo");

  assert.strictEqual(node.getAttribute("foo"), null);
  assert.strictEqual(node.getAttribute("bar"), "foo");
});

it("dom.getData", () => {
  document.body.innerHTML = '<p class="bar" data-key="value" data-dashed-key="dashed">Hello world</p>';
  const node = document.querySelector("p")!;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = getData(node) as any;
  const dashed = getData(node, "dashedKey");

  assert.strictEqual(data.key, "value");
  assert.strictEqual(data.dashedKey, "dashed");
  assert.strictEqual(dashed, "dashed");
});

it("dom.setData", () => {
  document.body.innerHTML = '<p class="bar" data-key="value">Hello world</p>';
  const node = document.querySelector("p")!;
  setData(node, "key", "bar");
  setData(node, "foo", "bar");

  assert.strictEqual(getData(node, "key"), "bar");
  assert.strictEqual(getData(node, "foo"), "bar");
});

it("dom.hasTagName", () => {
  document.body.innerHTML = "<p>Hello world</p>";
  const node = document.querySelector("p")!;

  assert.strictEqual(hasTagName(node, "i"), false);
  assert.strictEqual(hasTagName(node, ["i", "u"]), false);
  assert.strictEqual(hasTagName(node, "p"), true);
  assert.strictEqual(hasTagName(node, ["i", "u", "p"]), true);
});

it("dom.hasClass", () => {
  document.body.innerHTML = '<p class="bar">Hello world</p>';
  const node = document.querySelector("p")!;

  assert.strictEqual(hasClass(node, "foo"), false);
  assert.strictEqual(hasClass(node, "bar"), true);
});

it("dom.addClass", () => {
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

it("dom.addClassToElement", () => {
  document.body.innerHTML = '<p id="id" class="bar">Hello world</p>';
  const node = document.getElementById("id")!;
  addClassToElement("id", "foo");
  addClassToElement("id", ["abc", "def"]);

  const classList = node.classList;
  assert.strictEqual(
    ["bar", "foo", "abc", "def"].every((className) => classList.contains(className)),
    true
  );
});

it("dom.addClassToElements", () => {
  document.body.innerHTML = '<p class="bar">Hello world</p>';
  const node = document.querySelector(".bar")!;
  addClassToElements(".bar", "foo");
  addClassToElements(".bar", ["abc", "def"]);

  const classList = node.classList;
  assert.strictEqual(
    ["bar", "foo", "abc", "def"].every((className) => classList.contains(className)),
    true
  );
});

it("dom.removeClass", () => {
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

it("dom.removeClassFromElement", () => {
  document.body.innerHTML = '<p id="id" class="bar foo abc def">Hello world</p>';
  const node = document.getElementById("id")!;
  removeClassFromElement("id", "foo");
  removeClassFromElement("id", ["abc", "def"]);

  const classList = node.classList;
  assert.strictEqual(
    ["foo", "abc", "def"].some((className) => classList.contains(className)),
    false
  );
});

it("dom.removeClassFromElements", () => {
  document.body.innerHTML = '<p class="bar foo abc def">Hello world</p>';
  const node = document.querySelector(".bar")!;
  removeClassFromElements(".bar", "foo");
  removeClassFromElements(".bar", ["abc", "def"]);

  const classList = node.classList;
  assert.strictEqual(
    ["foo", "abc", "def"].some((className) => classList.contains(className)),
    false
  );
});

it("dom.is", () => {
  document.body.innerHTML = '<p class="bar">Hello world</p>';
  const node = document.querySelector("p")!;

  assert.strictEqual(is(node, "p.bar"), true);
});

it("dom.createNodeWith", () => {
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

it("dom.replaceNodeWith", () => {
  document.body.innerHTML = "<p>Hello world</p>";
  const node = document.createElement("span");
  node.textContent = "Simple text";

  replaceNodeWith(document.querySelector("p")!, node);
  assert.strictEqual(document.body.innerHTML, "<span>Simple text</span>");
});

it("dom.unwrapNode", () => {
  document.body.innerHTML = "<div><b>Hello world</b>, this is a simple text</div>";

  const newNodes = unwrapNode(document.querySelector("div")!);
  assert.strictEqual(document.body.innerHTML, "<b>Hello world</b>, this is a simple text");
  assert.strictEqual(newNodes.length, 2);
  assert.strictEqual(newNodes[0], document.querySelector("b"));
  assert.strictEqual(newNodes[1].nodeType, Node.TEXT_NODE);
  assert.strictEqual(newNodes[1].textContent, ", this is a simple text");
});

it("dom.textifyNode", () => {
  document.body.innerHTML = "<div><b>Hello world</b>, this is a simple text</div>";

  textifyNode(document.querySelector("div")!);
  assert.strictEqual(document.body.innerHTML, "Hello world, this is a simple text");
});

it("dom.isSelfClosing", () => {
  assert.strictEqual(isSelfClosing("I"), false);
  assert.strictEqual(isSelfClosing("B"), false);
  assert.strictEqual(isSelfClosing("P"), false);
  assert.strictEqual(isSelfClosing("BR"), true);
  assert.strictEqual(isSelfClosing("HR"), true);
  assert.strictEqual(isSelfClosing("IMG"), true);
});

it("dom.removeNodes", () => {
  document.body.innerHTML = "<div></div><p>Hello world</p><span></span>";

  removeNodes(document.body, (el) => el.nodeType === Node.ELEMENT_NODE && (el as HTMLElement).tagName !== "P");
  assert.strictEqual(document.body.innerHTML, "<p>Hello world</p>");
});

it("dom.removeNodesRecursively", () => {
  document.body.innerHTML =
    "<div><span></span></div><p>This is a simple text with <i>italic text<span></span></i> and empty tags<b></b></p><span></span>";

  removeNodesRecursively(
    document.body,
    (el) => el.nodeType === Node.ELEMENT_NODE && ((el as HTMLElement).textContent?.length ?? 0) === 0
  );
  assert.strictEqual(document.body.innerHTML, "<p>This is a simple text with <i>italic text</i> and empty tags</p>");
});

it("dom.removeEmptyTextNodes", () => {
  document.body.innerHTML = "<p>Hello world <b> </b></p> <!-- Comments --> <div> </div>";

  removeEmptyTextNodes(document.body);
  assert.strictEqual(document.body.innerHTML, "<p>Hello world <b> </b></p><!-- Comments --><div> </div>");
});

it("dom.removeCommentNodes", () => {
  document.body.innerHTML = "<p>Hello world <b> </b></p> <!-- Comments --> <div> </div>";

  removeCommentNodes(document.body);
  assert.strictEqual(document.body.innerHTML, "<p>Hello world <b> </b></p>  <div> </div>");
});

it("dom.resetAttributesTo", () => {
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

it("dom.replaceNodeStyleByTag", () => {
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

it("dom.trimTag", () => {
  document.body.innerHTML = "<div></div><div></div><p>Hello world</p><div></div><span>Simple text</span><div></div>";

  trimTag(document.body, "div");
  assert.strictEqual(document.body.innerHTML, "<p>Hello world</p><div></div><span>Simple text</span>");
});

it("dom.replaceAllText", () => {
  const template = `<p>Lorem ipsum dolor sit amet sea est imperdiet vel amet dolores amet elitr. <i class="test">Et eirmod dolore aliquyam eirmod ipsum rebum at labore clita dolores at ut.</i> Invidunt voluptua diam dolor <b>clita et aliquyam <a href="#" title="title">lorem et justo</a> ut no amet ipsum</b> ut rebum nostrud et.</p>`;
  const node = createFromTemplate(template);

  assert.throws(() => replaceAllText(node, /dolor/, "lorem"));

  replaceAllText(node, "dolor", "lorem");
  assert.strictEqual(
    node.outerHTML,
    `<p>Lorem ipsum lorem sit amet sea est imperdiet vel amet loremes amet elitr. <i class="test">Et eirmod loreme aliquyam eirmod ipsum rebum at labore clita loremes at ut.</i> Invidunt voluptua diam lorem <b>clita et aliquyam <a href="#" title="title">lorem et justo</a> ut no amet ipsum</b> ut rebum nostrud et.</p>`
  );

  replaceAllText(node, /lorem/gi, `<span class="foo">lorem</span>`);
  assert.strictEqual(
    node.outerHTML,
    `<p><span class="foo">lorem</span> ipsum <span class="foo">lorem</span> sit amet sea est imperdiet vel amet <span class="foo">lorem</span>es amet elitr. <i class="test">Et eirmod <span class="foo">lorem</span>e aliquyam eirmod ipsum rebum at labore clita <span class="foo">lorem</span>es at ut.</i> Invidunt voluptua diam <span class="foo">lorem</span> <b>clita et aliquyam <a href="#" title="title"><span class="foo">lorem</span> et justo</a> ut no amet ipsum</b> ut rebum nostrud et.</p>`
  );
});
