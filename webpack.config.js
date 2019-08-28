const webpack = require('webpack')
const path = require("path")
const UglifyJsPlugin = require('uglifyjs-webpack-plugin') //js压缩
const HtmlWebpackPlugin = require('html-webpack-plugin') // html打包

const ExtractTextPlugin = require('extract-text-webpack-plugin') //css分离 从js中 webpack4.0一下
const MiniCssExtractPlugin = require("mini-css-extract-plugin") // css分离 从js中 webpack4.x
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin") //css压缩
const devMode = process.env.NODE_ENV !== 'production'

var website = {
    publicPath:"http://10.10.8.179:1717/"
} // 绝对路径
const glob = require('glob') // node对对象 同步html

const PurifyCSSPlugin = require("purifycss-webpack") //去除未使用的css //注: 如果使用 可能因为加载的原因 vue文件中的css样式无法加载 导致此插件消除未使用的css

const entry = require('./webpack_config/entry_webpack.js') // 模块化引入
const copyWebpackPlugin = require("copy-webpack-plugin") // 打包静态资源

const VueLoaderPlugin = require('vue-loader/lib/plugin') // webpack4 使用vue-loader 且 vue-loader为15.0.0
module.exports = {
    //入口文件的配置项
    entry:{
        entry:entry.path,
        entery2:'./src/entry2.js',
        vue:'vue',
        jquery:'jquery',
        main:'./src/main.js'
    },
    //出口文件的配置项
    output:{
        //输出的路径，用了Node语法
        path:path.resolve(__dirname,'dist'),
        //输出的文件名称
        filename:'js/[name].js',
        //css文件路径 绝对路径
        publicPath:website.publicPath
    },
    //模块：例如解读CSS,图片如何转换，压缩
    module:{
        rules:[
            {
                test: /\.vue$/,
                use:'vue-loader'
            },
            {
                test:/\.(png|jpg|gif)/,
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            limit:5000,
                            outputPath:'images/'
                        }
                    }
                ]
            },
            //4.0版本一下less css文件加载及分离
            // {
            //     test: /\.less$/,
            //     use: ExtractTextPlugin.extract({
            //         use:[
            //             {
            //                 loader:'css-loader'
            //             },
            //             {
            //                 loader:'less-loader'
            //             }
                         
            //         ],
            //         fallback:'style-loader'
            //     })
            // },
            // {
            //     test: /\.css$/,
            //     use: ExtractTextPlugin.extract({
            //       use: "css-loader",
            //       fallback: "style-loader"
            //     })
            // },
            // {
            //     test: /\.css$/,
            //     use:['style-loader','css-loader']
            // },
            
            // {
            //     test: /\.less$/,
            //     use:['style-loader','css-loader','less-loader']
            // },
            {
                test: /\.less$/,
                use: [
                    {
                      loader: MiniCssExtractPlugin.loader,
                      options: {
                        publicPath: '../'
                      }
                    },
                    "css-loader",
                    "less-loader"
                ]
            },
            {
                test: /\.css$/,
                use: [
                  {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                      publicPath: '../'
                    }
                  },
                  "css-loader"
                ]
            },
            {
                test:/\.(jsx|js)$/,
                use:{
                    loader:'babel-loader'
                },
                exclude:/node_modules/
            },
            // html 中图片路径打包
            {
                test: /\.(htm|html)$/i,
                use:[ 'html-withimg-loader'] 
            }
        ],
    },
    //插件，用于生产模版和各项功能
    plugins:[
        //js压缩
        new UglifyJsPlugin(),
        //html打包
        new HtmlWebpackPlugin({
            minify:{
                removeAttributeQuotes:true
            },
            hash:true,
            template:'./src/index.html'
        }),
        //css打包分离
        // new ExtractTextPlugin('css/index.css'),
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
            // filename: "/css/styles.css",
            chunkFilename: "[id].css"
        }),
        //css压缩
        new OptimizeCssAssetsPlugin(),
        //除去未使用css
        // new PurifyCSSPlugin({
        //     paths: glob.sync(path.join(__dirname, 'src/*.html'))
        // }),
        //配置引入
        new webpack.ProvidePlugin({
            $:'jquery',
        }),
        // new webpack.HotModuleReplacementPlugin(),//热更新
        //资源打包
        new copyWebpackPlugin([{
            from:__dirname+'/src/images/' ,
            to:'./public'
        }]),
        //vue-loader插件
        new VueLoaderPlugin()
    ],
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue': 'vue/dist/vue.esm.js'
        }
    },
    //优化
    optimization: {
        splitChunks: {
            cacheGroups: {
                // commons: {
                //     name: 'jquery',
                //     chunks: "initial",
                //     filename:'/js/[name].js',
                //     minChunks: 2
                // },
                // 比如你要单独把jq之类的官方库文件打包到一起，就可以使用这个缓存组，如想具体到库文件（jq）为例，就可把test写到具体目录下
                vendor: {
                    test: /node_modules/,
                    name: "vendor",
                    priority: 10,
                    enforce: true
                },
                // 这里定义的是在分离前被引用过两次的文件，将其一同打包到common.js中，最小为30K
                common: {
                    name: "common",
                    minChunks: 2,
                    minSize: 30000
                },
                // chunks: "initial",
                // minSize: 40000,

                // styles: {
                //     name: 'css/styles',
                //     test: /\.css$/,
                //     chunks: 'all',
                //     enforce: true
                // }
            }
        }
    },
    //配置webpack开发服务功能
    devServer:{
        //设置基本目录结构
        contentBase:path.resolve(__dirname,'dist'),
        //服务器的IP地址，可以使用IP也可以使用localhost
        host:'10.10.8.179',
        //服务端压缩是否开启
        compress:true,
        //配置服务端口号
        port:1717,
        // hot:true
    },
    //webpack打包监听
    watchOptions:{
        //检测修改的时间，以毫秒为单位
        poll:1000, 
        //防止重复保存而发生重复编译错误。这里设置的500是半秒内重复保存，不进行打包操作
        aggregateTimeout:500, 
        //不监听的目录
        ignored:/node_modules/, 
    },
    mode:'development',
}