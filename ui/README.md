# Holochain Playground

Visit the [playground](https://holochain-open-dev.github.io/holochain-playground/).

This is an experimental ongoing effort to build a holochain playground simulation. It's trying to follow as accurately as possible the internal mechanisms of holochain, displaying the DHT and enablind detailed inspection.

For now, it includes a limited set of features (cannot modify redundancy factor, or number or nodes...). My intention is to maintain it and improve it, to also achieve dynamic situtations (nodes dropping out of the network), contributions would be highly appreciated.

This package is also distributed as an [NPM package](https://npmjs.com/package/holochain-playground), in the form of a `<holochain-playground>` customElement build with the [Custom Elements](https://developers.google.com/web/fundamentals/web-components/customelements) API.

## Custom Element Usage

1. Install the package with `npm i holochain-playground`.
2. Import the package in your application like this:

```js
import "holochain-playground";
```

3. Declare the `<holochain-playground></holochain-playground>` element:

```html
<body>
  <holochain-playground id="playground"></holochain-playground>
</body>
```

4. Optionally, set the conductor urls to the nodes you want to bind the playground to:

```html
<body>
  <holochain-playground id="playground"></holochain-playground>

  <script>
    const playground = document.getElementById("playground");
    playground.conductorUrls = ["ws://localhost:33000"];
  </script>
</body>
```
