// node.js 환경에서 동작.

// import 
const path = require('path') // path는 별도의 설치가 필요 없다. node js 환경에서 언제든 사용 가능한 전역 모듈
const HtmlPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')


// export
module.exports = {
  // parcel main.js
  // 파일을 읽어들이기 시작하는 진입점 생성
  entry: './js/main.js',

  // 결과물(번들)을 반환하는 설정
  output: { // entry에 있는 경로에 연결된 모든 내용들을 번들로 만들어 내보내준다.
    path: path.resolve(__dirname, 'dist'), // 디폴트 값은 dist 이다.
    // 절대경로를 사용해야 한다. (node.js에서 필요하다.)
    // path 모듈을 사용해서 표기한다.
    // paht.resolve(1, 2) : 1과 2의 기본적인 경로를 합쳐준다.
    // __dirname: node.js 환경에서 전역적으로 사용 가능한 변수. 현재 파일이 있는 그 경로를 의미.
    // 
    filename: 'main.js',
    clean: true // 그전에 build됐던 파일들 삭제
  },

  module: {
    rules: [
      {
        test: /\.s?css$/, //정규표현식 사용. .scss 또는 .css로 끝나는 것을 찾는것.
        use: [ // 순서 중요하다. 먼저 해석되는 것은 css-loader.
          'style-loader', // html에 해석된 css를 적용하는 용도
          'css-loader', // js파일에서 css파일을 해석하는 용도
          'postcss-loader', // sass로 해석후에 postcss로 붙여야하므로 이 위치에 넣는다.
          'sass-loader'
        ]
      },
      {
        test: /\.js$/,
        use: [
          'babel-loader'
        ]
      }
    ]
  },

  // 번들링 후 결과물의 처리 방식 등 다양한 플러그인들을 설정.
  // entry의 내용들과 아래의 플러그인들을 합병하는 기능.
  plugins: [
    new HtmlPlugin({
      template: './index.html'
    }),
    new CopyPlugin({
      patterns: [
        { from: 'static' }
      ]
    })
  ],

  // devServer: {
  //   host: 'localhost'
  // }
}

