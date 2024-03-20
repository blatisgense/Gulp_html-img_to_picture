## Replace the \<img> to \<picture> within HTML files, support Webp and Avif formats.
### How to use
```js
import gulp from 'gulp';
import gulp_img_transform_to_picture from 'gulp_img_transform_to_picture';

const gulp_function = () => {
    return gulp.src(src)
        // plugins
        .pipe(gulp_img_transform_to_picture( {options} )) // should use before minify
        // plugins
        .pipe(gulp.dest(dest))
}
```
### Input:
```html
<img src="filename.jpg" alt="alt" class="img" any-attr="value">
```
### Output:
```html
<picture>
    <source srcset="filename.avif" type="image/avif">
    <source srcset="filename.webp" type="image/webp">
    <img src="filename.jpg" alt="alt"  class="img" any-attr="value">
</picture>
```
## Options
```JS
gulp_html_img_to_picture({
    display_contents: Boolean, //insert display: contents; as an inline stype for <picture>, default: false
    
    extensions: {
        jpg: "avif" | "webp" | Boolean, 
        png: "avif" | "webp" | Boolean, 
        jpeg: "avif" | "webp" | Boolean
    }, // configure behavior for formats, default: jpg, jpeg: both and png: only webp
    
    quotes: `'` | `"`, // define the quotes for HTML attributes, default: `"`
})
```
### You can see changelogs at GitHub page https://github.com/blatisgense/gulp_img_transform_to_picture
#### If you notice any bug, or you want to suggest an idea please write to me (Contacts below).
## Contacts:
- **[Telegram](https://t.me/Blatisgense)**: @Blatisgense (best way)
- **[Discord](https://discordapp.com/users/559703556295360512)**: blatisgense
- **[Email](mailto:lavr.marudenko@gmail.com)**: lavr.marudenko@gmail.com
