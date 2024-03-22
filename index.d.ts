/// <reference types="node" resolution-mode="require"/>
import internal from "node:stream";
declare namespace Gulp_img_transform_to_picture {
    type Quotes = `'` | `"`;
    type Extension = "avif" | "webp" | boolean;
    type Logger = boolean | "error" | "stats";
    interface Extensions<T> {
        [key: string]: T;
        png?: T;
        jpg?: T;
        jpeg?: T;
    }
    export interface Transformed {
        filename: string;
        items: Array<string>;
    }
    export class Config {
        display_contents: boolean;
        quotes: Quotes;
        extensions: Extensions<Extension>;
        ignore_attr: string;
        logger: Logger;
        constructor({ extensions, display_contents, quotes, ignore_attr, logger }: {
            extensions?: Extensions<Extension>;
            display_contents?: boolean;
            quotes?: Quotes;
            ignore_attr?: string;
            logger?: Logger;
        });
    }
    export {};
}
export default function gulp_img_transform_to_picture(config?: Gulp_img_transform_to_picture.Config): internal.Transform;
export {};
