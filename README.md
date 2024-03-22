# gulp_img_transform_to_picture
Replace the `<img>` to `<picture>` within HTML files, support Webp and Avif formats.
- **[Usage example](#Usage-example)**
- **[Options](#Options)**
- **[Last changes](#Last-changes)**
- **[Contacts](#Contacts)**
## Usage example
- Gulpfile: 
```js
import gulp from 'gulp';
import gulp_img_transform_to_picture from 'gulp_img_transform_to_picture';

const gulp_function = () => {
    return gulp.src("./src/**/*.html")
        .pipe(gulp_img_transform_to_picture(Config)) // recomend to use before minify
        .pipe(gulp.dest("./dest/"))
}
```
- Input:
```html
<img src="filename.jpg" ...any_attributes>
<img src="filename.jpg" ...any_attributes data-ignore>
```
- Output:
```html
<picture>
    <source srcset="filename.avif" type="image/avif">
    <source srcset="filename.webp" type="image/webp">
    <img src="filename.jpg" ...any_attributes>
</picture>
<img src="filename.jpg" ...any_attributes data-ignore>
```
## Options
### display_contents
Type: `boolean`<br>Default: `false`<br>Description: insert `display: contents;` as an inline style for \<picture>. **[Official documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/display#contents)**


### extensions
Type:
```ts
type Extension = "avif" | "webp" | boolean;
interface Extensions<T> {
    [key: string]: T; // any custom formats
    png?: T;
    jpg?: T;
    jpeg?: T;
}
```
Default:
```ts
{
    png: "webp";
    jpg: true;
    jpeg: true;
}
```
Description:
Configure behavior for different extensions. `false` disable transformation,
`true` insert `<source>` for both Webp and Avif, `"avif"` or `"webp"` only specified one. 


### quotes
Type:`'` | `"`<br>Default:`"`<br>Description: Quotes type within HTML tags.


### ignore_attr
Type:`string`<br>Default:`data-ignore`<br>Description: Ignores and not transform `<img>` with this attribute.


### logger
Type:`boolean | "error" | "success"`<br>Default:`false`<br>Description: Logger outputs info about plugin's work
(errors and statistics).
`false` disable Logger, `true` logs both Errors and Statistics, `"error"` of `"stats"` only specified one.
## Last changes
**Patch 3.1.0:**
- Fix issues with default config values.
- Added ignore feature. Now able to ignore tags with special ignore attribute.
- Added _Logger_, outputs info about plugin's work (errors and statistics)

<br><br>You can see full changelogs and source code at **[GitHub repository](https://github.com/blatisgense/gulp_img_transform_to_picture)**
## Contacts:
If you notice any bug, or you want to suggest an idea, please contact me.
- **[Telegram](https://t.me/Blatisgense)**: @Blatisgense (best way)
- **[Discord](https://discordapp.com/users/559703556295360512)**: blatisgense
- **[Email](mailto:lavr.marudenko@gmail.com)**: lavr.marudenko@gmail.com
