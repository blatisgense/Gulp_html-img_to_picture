import PluginError from "plugin-error";
import through from 'through2';

const pluginName = 'gulp_html_img_to_picture';

function gulp_html_img_to_picture () {
	return through.obj(
		function (file, encoding, cb) {

			if (file.isStream()) {
				cb(new PluginError(pluginName, '[ERROR] Streaming not supported'));
				return
			} 	// check for streaming support

			try {
				let inside_picture = true; // boolean for checking;

				const data = file.contents // get HTML file
					.toString() // convert HTML to string
					.split('\n') // split to single lines
					.map(function (line) {
						// check for img, that already in <picture> =>

						if (line.indexOf('<picture') + 1) {
							inside_picture = false
						}

						if (line.indexOf('</picture') + 1) {
							inside_picture = true
						}


						if (line.indexOf('<img') + 1 && inside_picture) {

							const Re = /<img([^>]*)src="(\S+)"([^>]*)>/gi; // RegExp for img, includes all attributes
							let regexArr = [], img_arr = [], url_array = [], newHTMLArr = [];


							regexArr.push(Re.exec(line));

							regexArr.forEach(item => {
								url_array.push(item[2]) // filename.ext
								img_arr.push(item[0])
							})

							// replacing part =>
							for (let i = 0; i < url_array.length; i++) {
								// check for not replace gif and svg
								if ((!url_array[i].includes('.svg')) && !(url_array[i].includes('.gif')) && (!url_array[i].includes('.SVG')) && !(url_array[i].includes('.GIF'))) {
									let src = url_array[i].split(",")[0];
									let replaced = ext_replace(src);

									if (!(line.includes('picture>')) && !(line.includes('<picture'))){ // check if img already in <picture>, if yes we not replace it
										newHTMLArr.push(`<picture><source srcset="${replaced}" type="image/webp">${img_arr[i]}</picture>`) // line for replace
										line = line.replace(img_arr[i], newHTMLArr[i]) // replacing
									}
								}
							}
							return line;
						}
						return line;
					}).join('\n') // join map
				function ext_replace(name) {
					return name.replace(name.split('.')[1], 'webp');
				}

				file.contents = new Buffer.from(data)
				this.push(file)

			} catch (err) {
				this.emit('error', new PluginError(pluginName, err))
			}
			cb();
		}
	)
}

//todo add option to  include original file and avif

//srcset in original img doesnt support

export default gulp_html_img_to_picture;
