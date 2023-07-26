# gulp_img_transform_to_picture
#### Author @blatisgense
## Please update plugin to 2.2.0 version (all know bug fixed, and many options added).
### Replaces the 'img' to 'picture' in HTML files. Formats Webp and Avif (Exclude GIF, SVG). Saves all attributes from "img".
## How to use
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
## Input:
```html
<img src="filename.jpg" alt="alt" class="img" any-attr="value">
```
## Output:
```html
<picture>
    <source srcset="filename.avif" type="image/avif">
    <source srcset="filename.webp" type="image/webp">
    <img src="filename.jpg" alt="alt"  class="img" any-attr="value">
</picture>
```

###
### Do not transform "img" that already in "picture" and comment.
```html
<picture><img src="filename.png"></picture>

<!--<img src="filename.jpg">-->
```
##
# Options
```JS
gulp_html_img_to_picture({
    avif: Boolean, // Add avif 'source'? Default true. =>
        // <source srcset="filename.avif" type="image/avif">
    
    webp: Boolean, // Add webp 'source'? Default true. =>
        // <source srcset="filename.webp" type="image/webp">

    logger: Boolean, // logs any statistics. Default false.
    
    logger_extended: Boolean, // logs any statistics and tags that has been exluded. Default false.
    
    extensions: Array[String], // replace < img > with this extensions. Default ["jpg","png","jpeg"].
    
    quotes: String, //sets the quotes for HTML attributes. Default  ' and ".
    
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
###
### You can see changelogs at GitHub page https://github.com/blatisgense/gulp_img_transform_to_picture
### If you notice any bug, or you want to suggest an idea please write to me (Contacts below).
# Contacts:
- Gmail: lavr.marudenko@gmail.com,
- Skype and telegram @blatisgense.