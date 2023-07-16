# gulp_img_transform_to_picture
#### Author @blatisgense
### Replaces the 'img' to 'picture' in HTML files. Formats Webp and Avif (Exclude GIF, SVG). Saves all attributes from "img".
## How to use
```js
const gulp_function = () => {
    return gulp.src(src)
        // plugins
        .pipe(gulp_img_transform_to_picture()) // should use before minify
        // plugins
        .pipe(gulp.dest(dest))
}
```
## Input:
```html
<img src="filename.png">

<img src="filename.jpg" alt="" class="img" srcset="">

<img src="filename.jpg" srcset="">
```
## Output:
```html
<picture>
    <source srcset="filename.avif" type="image/avif">
    <source srcset="filename.webp" type="image/webp">
    <img src="filename.png">
</picture>

<picture>
    <source srcset="filename.avif" type="image/avif">
    <source srcset="filename.webp" type="image/webp">
    <img src="filename.jpg" alt="" srcset="">
</picture>

<picture>
    <source srcset="filename.avif" type="image/avif">
    <source srcset="filename.webp" type="image/webp">
    <img src="filename.jpg"  class="img" srcset="">
</picture>
```
#
###
### Do not transform "img" that already in "picture", and .gif, .svg.
```html
<!--no-->
<picture>
<img src="filename.png"></picture>
<!--no-->
<picture><img src="filename.png"></picture>
<!--no-->
<picture><img src="filename.png">
</picture>
<!--no-->
<img src="filename.GIF">
<!--no-->
<img src="filename.gif">
<!--no-->
<img src="filename.svg">
<!--no-->
<img src="filename.SVG">
```
### Do not support 2 and more tags at 1 line (Fix in future);
```html
<!--no-->
<img src="filename.jpg" alt="" class="img" srcset=""> <img src="filename.jpg" alt="" class="img" srcset="">
<!--yes-->
<img src="filename.jpg" alt="" class="img" srcset=""> 
<img src="filename.jpg" alt="" class="img" srcset="">
```
##
# Options
```JS
gulp_html_img_to_picture({
    avif: Boolean, // Add avif 'source'? Default true. =>
        // <source srcset="filename.avif" type="image/avif">

    webp: Boolean, // Add webp 'source'? Default true. =>
        // <source srcset="filename.webp" type="image/webp">

    webp_prefix: String, // Set prefix to webp filename. Default '' (empty). =>
        // <source srcset="PREFIXfilename.webp" type="image/webp">

    webp_postfix: String, // Set postfix to webp filename. Default '' (empty). =>
        // <source srcset="filenamePOSTFIX.webp" type="image/webp">

    avif_prefix: String, // Set prefix to avif filename. Default '' (empty). =>
        // <source srcset="PREFIXfilename.avif" type="image/avif">

    avif_postfix: String // Set postfix to avif filename. Default '' (empty). =>
        // <source srcset="filenamePOSTFIX.avif" type="image/avif">
})
```
# Contacts:
- Gmail: lavr.marudenko@gmail.com,
- Skype and telegram @blatisgense.