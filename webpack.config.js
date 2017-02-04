const rootPath = __dirname;

const
    webpack = require('webpack'),
    UglifyJsPlugin = webpack.optimize.UglifyJsPlugin,
    HtmlWebpackPlugin = require('html-webpack-plugin');

//webpack配置
module.exports = {
    //入口文件路径配置
    entry: {
        main: `${rootPath}/src/scripts/main.js`,
        'force-demo1': `${rootPath}/src/scripts/force-demo1.js`,
        'force-demo2': `${rootPath}/src/scripts/force-demo2.js`,
        barchart: `${rootPath}/src/scripts/barchart.js`,
        brush: `${rootPath}/src/scripts/brush.js`,
        barchart1: `${rootPath}/src/scripts/barchart1.js`,
        scatterchart: `${rootPath}/src/scripts/scatterchart.js`,
        'histogram-rect': `${rootPath}/src/scripts/histogram-rect.js`,
        'histogram-curve': `${rootPath}/src/scripts/histogram-curve.js`,
        piechart: `${rootPath}/src/scripts/piechart.js`,

        relationship: `${rootPath}/src/scripts/relationship.js`
    },
    //输出文件路径配置
    output: {
        path: `${rootPath}/assets/`,
        publicPath: "/assets/",
        filename: '[name].js'
    },
    //模块加载器配置
    module: {
        loaders: [
            //script加载器
            {test: /\.js[x]?$/, exclude: /node_modules/, loader: 'babel-loader'},
            //image加载器
            {test: /\.(png|jp[e]?g|gif)$/, loader: 'url-loader?limit=10240&name=images/[name].[hash:5].[ext]'},
            //font加载器
            {test: /\.(woff|svg|eot|ttf)$/, loader: 'url-loader?limit=10240&name=fonts/[name].[hash:5].[ext]'},
            //css加载器
            {test: /\.css$/, loader: 'style-loader!css-loader'},
            //sass加载器
            {test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader?sourceMap'},
            //json加载器
            {test: /\.json$/, loader: 'json'},
            // expose-loader将需要的变量从依赖包中暴露出来
            // {test: require.resolve("jquery"), loader: "expose?$! expose?jQuery"}
        ]
    },
    //插件配置
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        //压缩js
        // new UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     },
        //     except: ['$super', '$', 'exports', 'require']
        // }),
        //编译html
        new HtmlWebpackPlugin({
            filename: `${rootPath}/assets/entry.html`,
            template: `${rootPath}/src/views/entry.html`,
            hash: true,
            chunks: ['main']
        }),
        new HtmlWebpackPlugin({
            filename: `${rootPath}/assets/force-demo1.html`,
            template: `${rootPath}/src/views/force-demo1.html`,
            hash: true,
            chunks: ['force-demo1']
        }),
        new HtmlWebpackPlugin({
            filename: `${rootPath}/assets/force-demo2.html`,
            template: `${rootPath}/src/views/force-demo2.html`,
            hash: true,
            chunks: ['force-demo2']
        }),
        new HtmlWebpackPlugin({
            filename: `${rootPath}/assets/relationship.html`,
            template: `${rootPath}/src/views/relationship.html`,
            hash: true,
            chunks: ['relationship']
        }),
        new HtmlWebpackPlugin({
            filename: `${rootPath}/assets/brush.html`,
            template: `${rootPath}/src/views/brush.html`,//指定视图
            hash: true,
            chunks: ['brush']//为视图指定js和css，名字在entry中选一个或多个
        }),
        new HtmlWebpackPlugin({
            filename: `${rootPath}/assets/barchart.html`,
            template: `${rootPath}/src/views/barchart.html`,
            hash: true,
            chunks: ['barchart']
        }),
        new HtmlWebpackPlugin({
            filename: `${rootPath}/assets/piechart.html`,
            template: `${rootPath}/src/views/piechart.html`,
            hash: true,
            chunks: ['piechart']
        }),
        new HtmlWebpackPlugin({
            filename: `${rootPath}/assets/barchart1.html`,
            template: `${rootPath}/src/views/barchart1.html`,
            hash: true,
            chunks: ['barchart1']
        }),
        new HtmlWebpackPlugin({
            filename: `${rootPath}/assets/scatterchart.html`,
            template: `${rootPath}/src/views/scatterchart.html`,
            hash: true,
            chunks: ['scatterchart']
        }),
        new HtmlWebpackPlugin({
            filename: `${rootPath}/assets/histogram-rect.html`,
            template: `${rootPath}/src/views/histogram-rect.html`,
            hash: true,
            chunks: ['histogram-rect']
        }),
        new HtmlWebpackPlugin({
            filename: `${rootPath}/assets/histogram-curve.html`,
            template: `${rootPath}/src/views/histogram-curve.html`,
            hash: true,
            chunks: ['histogram-curve']
        })
    ]
};