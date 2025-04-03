# Using an animated svg/gif for image

## Using astalify to make a custom WebView widget

```tsx
import WebKit from "gi://WebKit?version=6.0";

const WebView = astalify<WebKit.WebView, WebKit.WebView.ConstructorProps>(
  WebKit.WebView,
  {},
);
```

## Then using the custom widget

```tsx
<WebView
  setup={(self) => {
    self.load_uri(`file://${SRC}/<path>`); // Using SRC to point to the ags config location
    self.set_background_color(
      new Gdk.RGBA({ red: 0, green: 0, blue: 0, alpha: 0 }),
    );
  }}
  widthRequest={32}
  heightRequest={32}
/>
```

# Using webview to access a website

```tsx
<WebView
  setup={(self) => {
    self.load_uri(`<URL>`); // URL to a website
    self.set_background_color(
      new Gdk.RGBA({ red: 0, green: 0, blue: 0, alpha: 0 }),
    );
    self.set_zoom_level(0.75);
  }}
  widthRequest={32}
  heightRequest={32}
/>
````
