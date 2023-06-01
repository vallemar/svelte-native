const svelteConfig = require('./svelte.config');

module.exports = webpack => {
    webpack.merge({ resolve: { conditionNames: ['svelte'] } })
    webpack.chainWebpack((config) => {
        config.resolve.extensions.merge([".ts", ".mjs", ".js", ".svelte", ".scss", ".css"]);
        config.module
            .rule('svelte')
            .test(/\.svelte$/)
            .use('svelte-loader')
            .loader(require.resolve('svelte-loader'))
            .options({
                ...svelteConfig
            });
    });
};
