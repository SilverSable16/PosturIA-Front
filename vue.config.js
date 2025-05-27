module.exports = {
	runtimeCompiler: true,
  
	chainWebpack: config => {
	  config
		.plugin('html')
		.tap(args => {
		  args[0].title = 'PosturIA'
		  return args
		})
	},
  
	devServer: {
	  port: 4200
	}
}