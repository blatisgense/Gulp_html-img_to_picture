// imports
import PluginError from "plugin-error";
import through from 'through2';
// name
const pluginName = `gulp_img_transform_to_picture`;

function gulp_html_img_to_picture (avif, webp, avif_prefix, webp_prefix, avif_postfix, webp_postfix) { // options
	let default_config = {
		avif: true,
		webp: true,
		webp_prefix: '',
		avif_postfix: '',
		webp_postfix: '',
		avif_prefix: ''
	}
	if (webp) default_config.webp = webp;
	if (avif) avif = default_config.avif;
	if (webp_prefix) default_config.webp_prefix = webp_prefix;
	if (avif_postfix) default_config.avif_postfix = avif_postfix;
	if (webp_postfix) default_config.webp_postfix = webp_postfix;
	if (avif_prefix) default_config.avif_prefix = avif_prefix;
	// function =>
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
							const Re = /<img([^>]*)src=["'`](\S+)["'`]([^>]*)>/gi; // RegExp for img, includes all attributes
							let regexArr = [], img_arr = [], url_array = [], newHTMLArr = [];
							regexArr.push(Re.exec(line));
							regexArr.forEach(item => {
								if (item){ // check for item exist
									url_array.push(item[2]) // filename.ext
									img_arr.push(item[0]) // original tag <img>
								} else {
									console.log({error: `[ERROR] ${line}  not correspond to condition.` })
									return;
								}
							});
							// replacing part =>
							for (let i = 0; i < url_array.length; i++) {
								// check for not replace gif and svg
								if ((!url_array[i].includes('.svg')) && !(url_array[i].includes('.gif')) && (!url_array[i].includes('.SVG')) && !(url_array[i].includes('.GIF'))) {
									let name = url_array[i].split('.')[0];
									if (!(line.includes('picture>')) && !(line.includes('<picture'))){ // check if img already in <picture>, if yes we're not replace it
										// create replace line function =>
										const create_line = () => {
											let line = `<picture>`;
											if (default_config.avif === true){
												line += `<source srcset="${default_config.avif_prefix}${name}${default_config.avif_postfix}.avif" type="image/avif">`
											}
											if (default_config.webp === true){
												line += `<source srcset="${default_config.webp_prefix}${name}${default_config.webp_postfix}.webp" type="image/webp">`
											}
											line += `${img_arr[i]}</picture>`;
											return line;
										}
										let replace = create_line();
										newHTMLArr.push(replace);
										line = line.replace(img_arr[i], newHTMLArr[i]) // replacing
									}
								}
							}
							return line;
						}
						return line;
					}).join('\n') // join map
				file.contents = new Buffer.from(data)
				this.push(file)
			} catch (err) {
				this.emit('error', new PluginError(pluginName, err))
			}
			cb();
		}
	)
}
export default gulp_html_img_to_picture;
