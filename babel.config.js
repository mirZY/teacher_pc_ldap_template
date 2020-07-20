let plugins = [];
// 生成环境去掉console.log
if (process.env.VUE_APP_IS_DEBUG === 'false') {
  plugins.push('transform-remove-console');
}

module.exports = {
  plugins: [
    ...plugins
  ],
  presets: [
    '@vue/cli-plugin-babel/preset'
  ]
}
