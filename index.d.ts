/// <reference types="node" resolution-mode="require"/>
import internal from "node:stream";
declare namespace Gulp_img_transform_to_picture {
    type Quotes = `'` | `"`;
    type Extension = "avif" | "webp" | boolean;
    interface Extensions<T> {
        png?: T;
        jpg?: T;
        jpeg?: T;
    }
    export class Config {
        display_contents?: boolean;
        quotes?: Quotes;
        extensions?: Extensions<Extension>;
        constructor({ extensions, display_contents, quotes }: {
            extensions?: Extensions<Extension>;
            display_contents?: boolean;
            quotes?: Quotes;
        });
    }
    export {};
}
export default function gulp_img_transform_to_picture(config?: Gulp_img_transform_to_picture.Config): internal.Transform;
export {};
