// vue.config.js
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
	// 选项...
	publicPath: process.env.NODE_ENV === 'production' ? '/table' : '/',
	// devServer: {
	// 	compress: false, // 开启压缩
	// 	proxy: {
			
	// 	},
	// },
	pluginOptions: {
		pwa: {
			iconPaths: {
				favicon32: './static/favicon.ico',
				favicon16: './static/favicon.ico',
				appleTouchIcon: './static/favicon.ico',
				maskIcon: './static/favicon.ico',
				msTileImage: './static/favicon.ico'
			}
		}
	},
	
	chainWebpack: (config) => {
		config.resolve.alias //配置别名
			.set('@', path.resolve('src'))
			.set('assets', path.resolve('src/assets'))
			.set('components', path.resolve('src/components'))
			.set('views', path.resolve('src/views')).end()
		// 开启图片压缩
		// config.module.rule('images')
		//     .test(/\.(png|jpe?g|gif)(\?.*)?$/)
		//     .use('image-webpack-loader')
		//     .loader('image-webpack-loader')
		//     .options({ bypassOnDebug: true })
		// if (process.env.NODE_ENV === 'production') {
		// 	config.plugin('compressionPlugin')
		// 		.use(new CompressionPlugin({
		// 			test: /\.js$|\.html$|.\css/, // 匹配文件名
		// 			threshold: 10240, // 对超过10k的数据压缩
		// 			deleteOriginalAssets: false // 不删除源文件
		// 		}))
		// }

		// config.module//插件压缩大图片并转base64
		//     .rule('images')
		//     .use('image-webpack-loader')
		//     .loader('image-webpack-loader')
		//     .options({
		//       bypassOnDebug: true
		//     })
		//     .end()
	},
	productionSourceMap: false,
	runtimeCompiler: true,
	indexPath: "index.html",
	assetsDir: 'static',
}
