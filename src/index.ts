import PluginError from "plugin-error";
import through from 'through2';
import internal from "node:stream";

namespace Gulp_img_transform_to_picture {
    type Quotes = `'` | `"`;
    type Extension = "avif" | "webp" | boolean;
    interface Extensions<T> {png?: T;jpg?: T;jpeg?: T;}

    export class Config {
        display_contents?: boolean;
        quotes?: Quotes;
        extensions?: Extensions<Extension>
        constructor({extensions, display_contents, quotes} : {extensions?: Extensions<Extension>; display_contents?: boolean; quotes?: Quotes;}) {
            this.quotes = (quotes !== undefined) ? quotes : '"';
            this.display_contents = (display_contents !== undefined) ? display_contents : false;
            this.extensions = (extensions !== undefined) ? extensions : {
                png: "webp",
                jpg: true,
                jpeg: true
            };
        }
    }
}

export default function gulp_img_transform_to_picture (config?: Gulp_img_transform_to_picture.Config): internal.Transform {
    config = config || new Gulp_img_transform_to_picture.Config({});
    config.quotes = config.quotes || '"';
    config.extensions = config.extensions || {
        png: "webp",
        jpg: true,
        jpeg: true
    };
    config.display_contents = config.display_contents || false;

    const tag_rg: RegExp = new RegExp(`<img[^>]*?src(\\s+)?=(\\s+)?${config.quotes}?([^'"\` >]+?)[ ${config.quotes}][^>]*?>`, "g");
    const path_rg: RegExp = new RegExp(`(?<=src(\\s+)?=(\\s+)?${config.quotes})(\\w|\\.|/|-|_)+(?=[ ${config.quotes}])`, "g");
    return through.obj(
    function (file: any, _encoding: BufferEncoding, cb: through.TransformCallback): void {
            try {
                let html: string = file.contents.toString();
                let tags = html.match(tag_rg);
                if (tags) {
                    tags.map((tag: string): void => {
                        let path: Array<string> = tag.match(path_rg)[0].split(".");
                        if (path && path.length >= 2) {
                            let ext: string = path.pop();
                            if (ext === "png" || ext === "jpg" || ext === "jpeg") {
                                let template: string = "";
                                template += (config.display_contents === false) ? `<picture>` : `<picture style="display: contents">`;
                                if (config.extensions[ext] === true) {
                                    template += `<source srcset="${path}.avif" type="image/avif"><source srcset="${path}.webp" type="image/webp">`;
                                } else {
                                    template += `<source srcset="${path}.${config.extensions[ext]}" type="image/${config.extensions[ext]}">`;
                                }
                                template += `${tag}</picture>`;
                                html = html.replace(tag, template);
                            }
                            return;
                        }
                        console.log({error: {message: `[WARNING] Cannot extract image info.`}, item: tag});
                    })
                }
                file.contents = new (Buffer.from as any)(html);
                this.push(file)
            } catch (err: any) {
                this.emit('error', new PluginError("gulp_img_transform_to_picture", err))
            }
            cb();
        }
    )
}
