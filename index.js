// imports
import PluginError from "plugin-error";
import through from 'through2';
// name
const pluginName = `gulp_img_transform_to_picture`;

function gulp_img_transform_to_picture (config) { // options obj.
	let default_config = {
		avif: true,
		webp: true,
		logger: false,
		logger_extended: false,
		extensions: ["jpg","png","jpeg"],
		webp_prefix: '',
		avif_postfix: '',
		webp_postfix: '',
		avif_prefix: ''
	}

	if (!(config.webp == null))  default_config.webp = config.webp;
	if (!(config.logger == null))  default_config.logger = config.logger;
	if (!(config.logger_extended == null))  default_config.logger_extended = config.logger_extended;
	if (!(config.avif == null))  default_config.avif = config.avif;
	if (config.webp_prefix) default_config.webp_prefix = config.webp_prefix;
	if (config.avif_postfix) default_config.avif_postfix = config.avif_postfix;
	if (config.webp_postfix) default_config.webp_postfix = config.webp_postfix;
	if (config.avif_prefix) default_config.avif_prefix = config.avif_prefix;
	if (config.extensions) default_config.extensions = config.extensions;
	return through.obj(
		function (file, encoding, cb) {
			if (file.isStream()) {
				cb(new PluginError(pluginName, '[ERROR] Streaming not supported'));
				return
			}
			try {
				let l_comments = 0;
				let l_pictures = 0;
				let l_imgs = 0;
				let l_imgs_replaced = 0;
				let l_imgs_excluded = 0;
				let l_imgs_excluded_by_extensions = 0;
				let excluded_img = [];
				let excluded_img_ext = [];
				let output = [];
				let data = file.contents.toString();
				const regexp_tag = /<(\/)?(!)?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'"`>\s]+))?)+\s*|\s*)>|(?=<!--)([\s\S]*?)-->|(?<=(<(\/)?(!)?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'"`>\s]+))?)+\s*|\s*)>))(\s*|\n*)([\s\S\n]*?)(\s*|\n*)(?=<)/gs;
				const regexp_src = new RegExp(`src(\\s*)=(\\s*)["'\`]([\\s\\S]*?)["'\`]`, "gs");
				const regexp_quotes = new RegExp(`["'\`]([\\s\\S]*?)["'\`]`, "gs");
				const regexp_filename = new RegExp(`((?<=")(.*?)(?="))`, "gs");
				let tags = data.match(regexp_tag);
				let outside_picture = true;
				let outside_comment = true;
				if (tags){
					tags.map((tag) => {
						if (tag.includes('<!--')) {
							l_comments++;
						}
						if (tag.includes('<picture')) {
							outside_picture = false;
							l_pictures++;
						}
						if (tag.includes('/picture>')) outside_picture = true;
						if (tag.includes('<img')){
							l_imgs++;
							if (tag.includes('<img') && outside_picture && outside_comment) {
								let filename = tag.match(regexp_src)
								if (filename) {
									filename = filename[0].match(regexp_quotes)
								} else {console.log(`[WARNING] ${tag} have incorrect src, please check it. Plugin exclude it.`);l_imgs_excluded++; return}
								if (filename) {
									filename = filename[0].match(regexp_filename)
								} else {console.log(`[WARNING] ${tag} have incorrect src, please check it. Plugin exclude it.`);l_imgs_excluded++; return}
								if (filename) {
									filename = filename[0].split('.')
								} else {console.log(`[WARNING] ${tag} have incorrect src, please check it. Plugin exclude it.`);l_imgs_excluded++; return}
								let extension = filename.pop().split('#')[0].toLowerCase();
								filename = filename.join('.')
								if (default_config.extensions.includes(extension)){
									let line = `<picture>\t`;
									if (default_config.avif === true){
										line += `<source srcset="${default_config.avif_prefix}${filename}${default_config.avif_postfix}.avif" type="image/avif">\t`
									}
									if (default_config.webp === true){
										line += `<source srcset="${default_config.webp_prefix}${filename}${default_config.webp_postfix}.webp" type="image/webp">\t`
									}
									line += `${tag}\t</picture>`;
									tag = line;

									l_imgs_replaced++;
								} else {
									excluded_img_ext.push(tag)
									l_imgs_excluded_by_extensions++;
									output.push(tag);
									return;
								}
							} else {
								excluded_img.push(tag)
								l_imgs_excluded++
							}
						}
						output.push(tag);
					})
				}
				if (default_config.logger === true || default_config.logger_extended === true){
					console.log(`${pluginName} logger:\n comments found = ${l_comments}\n < pictures > found = ${l_pictures}\n < img > found = ${l_imgs}\n < img > replaced = ${l_imgs_replaced}\n < img > excluded = ${l_imgs_excluded}, excluded by wrong extension = ${l_imgs_excluded_by_extensions}`)
				}
				if (default_config.logger_extended === true){
					if (excluded_img.length > 0){
						console.log({logger_extended: 'Excluded because < img > inside comment or < picture >:'})
						excluded_img.map((item, index) =>{
							console.log({img:item, index:index})
						})
					}
					if (excluded_img_ext.length > 0){
						console.log({logger_extended: 'Excluded because file extension in not defined in config (extensions):'})
						excluded_img_ext.map((item, index) =>{
							console.log({img:item, index:index})
						})
					}
				}
				file.contents = new Buffer.from(output.join(''))
				this.push(file)
			} catch (err) { // logging errors
				this.emit('error', new PluginError(pluginName, err))
			}
			cb();
		}
	)
}
export default gulp_img_transform_to_picture;
