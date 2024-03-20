import PluginError from "plugin-error";
import through from 'through2';
var Gulp_img_transform_to_picture;
(function (Gulp_img_transform_to_picture) {
    class Config {
        display_contents;
        quotes;
        extensions;
        constructor({ extensions, display_contents, quotes }) {
            this.quotes = (quotes !== undefined) ? quotes : '"';
            this.display_contents = (display_contents !== undefined) ? display_contents : false;
            this.extensions = (extensions !== undefined) ? extensions : {
                png: "webp",
                jpg: true,
                jpeg: true
            };
        }
    }
    Gulp_img_transform_to_picture.Config = Config;
})(Gulp_img_transform_to_picture || (Gulp_img_transform_to_picture = {}));
export default function gulp_img_transform_to_picture(config) {
    config = config || new Gulp_img_transform_to_picture.Config({});
    config.quotes = config.quotes || '"';
    config.extensions = config.extensions || {
        png: "webp",
        jpg: true,
        jpeg: true
    };
    config.display_contents = config.display_contents || false;
    const tag_rg = new RegExp(`<img[^>]*?src(\\s+)?=(\\s+)?${config.quotes}?([^'"\` >]+?)[ ${config.quotes}][^>]*?>`, "g");
    const path_rg = new RegExp(`(?<=src(\\s+)?=(\\s+)?${config.quotes})(\\w|\\.|/|-|_)+(?=[ ${config.quotes}])`, "g");
    return through.obj(function (file, _encoding, cb) {
        try {
            let html = file.contents.toString();
            let tags = html.match(tag_rg);
            if (tags) {
                tags.map((tag) => {
                    let path = tag.match(path_rg)[0].split(".");
                    if (path && path.length >= 2) {
                        let ext = path.pop();
                        if (ext === "png" || ext === "jpg" || ext === "jpeg") {
                            let template = "";
                            template += (config.display_contents === false) ? `<picture>` : `<picture style="display: contents">`;
                            if (config.extensions[ext] === true) {
                                template += `<source srcset="${path}.avif" type="image/avif"><source srcset="${path}.webp" type="image/webp">`;
                            }
                            else {
                                template += `<source srcset="${path}.${config.extensions[ext]}" type="image/${config.extensions[ext]}">`;
                            }
                            template += `${tag}</picture>`;
                            html = html.replace(tag, template);
                        }
                        return;
                    }
                    console.log({ error: { message: `[WARNING] Cannot extract image info.` }, item: tag });
                });
            }
            file.contents = new Buffer.from(html);
            this.push(file);
        }
        catch (err) {
            this.emit('error', new PluginError("gulp_img_transform_to_picture", err));
        }
        cb();
    });
}
//# sourceMappingURL=index.js.map