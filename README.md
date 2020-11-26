# Netural Guidelines Assistant for Sketch

![alt text](https://www.netural.com/images/favicon-96x96.png)

> This Sketch assistant validates document opacities, radiuses, shadows, border styles, border
> colors, fill colors, text colors, text sizes, text line-heights and font families against generic
> design tokens defined in a JSON file.

## About Sketch Assistants

First time using a Sketch Assistant?
[🤔 How can I add assistant to my sketch file?](https://www.sketch.com/docs/assistants/#adding-an-assistant-from-a-url-or-file)

## Links

[👉 Netural.com](https://www.netural.com)

[👉 Download this Assistant](https://registry.npmjs.org/netural-guidelines-assistant/-/netural-guidelines-assistant-1.0.3.tgz)

## Linting rules

<h3>Opacity</h3>

Opacities should match the defined token values.

- Reports a violation if a font is different than defined in JSON file.

---

<h3>Radius</h3>

Radiuses should match the defined token values.

- Reports a violation if a radius is different than defined in JSON file.

---

<h3>Shadow</h3>

Shadows should match the defined token values.

- Reports a violation if a shadow is different than defined in JSON file.

---

<h3>Border style</h3>

Border styles should match the defined token values.

- Reports a violation if a border style is different than defined in JSON file.

---

<h3>Border color</h3>

Border colors should match defined border or generic color token values.

- Reports a violation if a border color is different than defined in JSON file.

---

<h3>Fill color</h3>

Fill colors should match defined fill or generic color token values.

- Reports a violation if a fill color is different than defined in JSON file.

---

<h3>Text color</h3>

Text colors should match defined text or generic color token values.

- Reports a violation if a text color is different than defined in JSON file.

---

<h3>Text size</h3>

Text sizes should match the defined token values.

- Reports a violation if a text size is different than defined in JSON file.

---

<h3>Text line height</h3>

Text line heights should match the defined token values.

- Reports a violation if a text line height is different than defined in JSON file.

---

<h3>Text font family</h3>

Font families should match the defined token values.

- Reports a violation if a font family used is different than defined in JSON file.

---

<h3>Artboard names</h3>

Artboard names should follow the naming conventions.

- Reports a violation if an artboard name is different than defined in JSON file.

---

<h3>Symbol names</h3>

Symbol names should follow the naming conventions.

- Reports a violation if a symbol name is different than defined in JSON file.

---

<h3>Shared text style names</h3>

Names of shared text styles should follow the naming conventions.

- Reports a violation if a shared text style name is different than defined in JSON file.

---

<h3>Text content</h3>

Texts should not contain defined phrases.

- Reports a violation if a text contains any of the defined phrases.
