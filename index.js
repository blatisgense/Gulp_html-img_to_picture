import PluginError from "plugin-error";
import through from 'through2';
var Gulp_img_transform_to_picture;
(function (Gulp_img_transform_to_picture) {
    class Config {
        display_contents;
        quotes;
        extensions;
        ignore_attr;
        logger;
        constructor({ extensions, display_contents, quotes, ignore_attr, logger }) {
            this.quotes = (quotes !== undefined) ? quotes : '"';
            this.display_contents = (display_contents !== undefined) ? display_contents : false;
            this.ignore_attr = (ignore_attr !== undefined) ? ignore_attr : "data-ignore";
            this.logger = (logger !== undefined) ? logger : false;
            if (extensions !== undefined) {
                extensions.png = (extensions.png !== undefined) ? extensions.png : "webp";
                extensions.jpg = (extensions.jpg !== undefined) ? extensions.jpg : true;
                extensions.jpeg = (extensions.jpeg !== undefined) ? extensions.jpeg : true;
                this.extensions = extensions;
            }
            else
                this.extensions = {
                    png: "webp",
                    jpg: true,
                    jpeg: true
                };
        }
    }
    Gulp_img_transform_to_picture.Config = Config;
})(Gulp_img_transform_to_picture || (Gulp_img_transform_to_picture = {}));
export default function gulp_img_transform_to_picture(config) {
    config = (config !== undefined) ? new Gulp_img_transform_to_picture.Config(config) : new Gulp_img_transform_to_picture.Config({});
    const tag_rg = new RegExp(`<img[^>]*?src(\\s+)?=(\\s+)?${config.quotes}?([^'"\` >]+?)[ ${config.quotes}][^>]*?>`, "g");
    const path_rg = new RegExp(`(?<=src(\\s+)?=(\\s+)?${config.quotes})(\\w|\\.|/|-|_)+(?=[ ${config.quotes}])`, "g");
    return through.obj(function (file, _encoding, cb) {
        try {
            if (file.contents == null) {
                this.emit('error', new PluginError("gulp_img_transform_to_picture", "File not found, cannot extract data."));
                return;
            }
            let filename;
            let transformed = { filename: "", items: [] };
            if (config.logger) {
                filename = (file.history !== undefined && file.history !== null) ? file.history[0].split("\\").pop() : "unrecognized";
                transformed.filename = filename;
            }
            let html = file.contents.toString();
            let tags = html.match(tag_rg);
            if (tags) {
                tags.map((tag) => {
                    if (tag.includes(config.ignore_attr)) {
                        return;
                    }
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
                            if (config.logger === "stats" || config.logger === true) {
                                transformed.items.push(tag);
                            }
                        }
                        return;
                    }
                    if (config.logger === "error" || config.logger === true) {
                        console.log({
                            error: {
                                filename: filename,
                                message: `[WARNING] Cannot extract image info.`,
                                item: tag
                            },
                        });
                    }
                });
            }
            file.contents = new Buffer.from(html);
            this.push(file);
            if (config.logger === "stats" || config.logger === true) {
                let message = `\nGulp_img_transform_to_picture logger:\nFilename: ${transformed.filename},\nTransformed items: [\n`;
                transformed.items.map((el) => {
                    message += `\t${el}\n`;
                });
                message += "]\n";
                console.log(message);
            }
        }
        catch (err) {
            this.emit('error', new PluginError("gulp_img_transform_to_picture", err));
        }
        cb();
    });
}
//# sourceMappingURL=index.js.map