# 프로젝트 생성

## 시작
```shell
$ npm init -y
$ npm i -D webpack webpack-cli webpack-dev-server@next
```
webpack-dev-server는 개발 시 편리한 기능을 포함한 패키지.  
코드 저장 시 자동으로 리빌드해서 화면에 뿌려주는 기능 포함.

## in package.json
```json
  "scripts": {
    "dev": "webpack-dev-server --mode development",
    "build": "webpack --mode production"
  },
```

## in index.html
1. 기본적 내용 작성
2. title 하단에 reset css cdn 링크 추가.
3. root 경로에 js/main.js 생성.
4. root 경로에 webpack.config.js 생성.

# entry, output

## in webpack.config.js
```js
// node.js 환경에서 동작.

// import 
const path = require('path') // path는 별도의 설치가 필요 없다. node js 환경에서 언제든 사용 가능한 전역 모듈

// export
module.exports = {
  // parcel main.js
  // 파일을 읽어들이기 시작하는 진입점 생성
  entry: './js/main.js',

  // 결과물(번들)을 반환하는 설정
  output: {
    path: path.resolve(__dirname, 'dist'), // 디폴트 값은 dist 이다.
    // 절대경로를 사용해야 한다. (node.js에서 필요하다.)
    // path 모듈을 사용해서 표기한다.
    // paht.resolve(1, 2) : 1과 2의 기본적인 경로를 합쳐준다.
    // __dirname: node.js 환경에서 전역적으로 사용 가능한 변수. 현재 파일이 있는 그 경로를 의미.
    // 
    filename: 'main.js',
    clean: true // 그전에 build됐던 파일들 삭제
  }
}
// entry에 있는 경로에 연결된 모든 내용들을 번들로 만들어 내보내준다.

```

# plugins
```
$ npm i -D html-webpack-plugin
```

## in webpack.config.js
```js
const HtmlPlugin = require('html-webpack-plugin')

module.exports = {
  // 번들링 후 결과물의 처리 방식 등 다양한 플러그인들을 설정.
  // entry의 내용들과 아래의 플러그인들을 합병하는 기능.
  plugins: [
    new HtmlPlugin({
      template: './index.html'
    })
  ],

  // npm run dev
  devServer: {
    host: 'localhost'
  }
}
```

# 정적 파일 연결
```
$ npm i -D copy-webpack-plugin
```
root 경로에 static 폴더, 그 내부에 images폴더를 생성하고  
logo.jpg는 images 폴더 안에, favicon.ico는 static폴더 안에 넣은 후 저장한다.  

index.html에서 img 태그를 추가한다.
```html
  <img src="./images/logo.jpg" alt="BLOGPY" />
```
여기서 상대 경로로 바로 images로 들어갈 수 있는 이유는, 컴파일 후 dist폴더에서는 저런 상대 경로를 통해 접근할 수 있기 때문이다.

## in webpack.config.js
```js
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
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
}
```

# module

index.html에 main.css를 연결하는 방법은 두 가지가 있다.  
1. static 폴더에 /css/main.css 를 생성 후 연결하는 방법.  
index.html에는 다음과 같이 입력한다.
```html
<link rel="stylesheet" href="./css/main.css"/>
```
2. main.js에 css를 직접 연결한다.  
이를 이용하면 webpack.config.js의 import를 통해 index.html과 버무려준다.  
다만 webpack.config.js가 css를 읽어들일 수 없으니 이를 읽어주는 패키지를 설치한다.
<br/><br/>

```
$ npm i -D css-loader style-loader
```
style-loader: 해석된 css를 html의 header에 style태그로 집어넣어 준다.
## in main.js
```js
import '../css/main.css'
```

## in webpack.config.js
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/, //정규표현식 사용. .css로 끝나는 것을 찾는것.
        use: [ // 순서 중요하다. 먼저 해석되는 것은 css-loader.
          'style-loader', // html에 해석된 css를 적용하는 용도
          'css-loader' // js파일에서 css파일을 해석하는 용도
        ]
      }
    ]
  },
}
```

# scss
scss를 적용하는 법은 css와 비슷하다.

## in webpack.config.js

```
npm i -D sass-loader sass
```
sass-loader: scss 파일을 읽어들이는 용도.  
sass: scss 파일을 해석하는 용도.


```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.s?css$/, //정규표현식 사용. .scss 또는 .css로 끝나는 것을 찾는것.
        use: [ // 순서 중요하다. 먼저 해석되는 것은 css-loader.
          'style-loader', // html에 해석된 css를 적용하는 용도
          'css-loader', // js파일에서 css파일을 해석하는 용도\
          'sass-loader'
        ]
      }
    ]
  },
}
```

# 공급업체 접두사 Autoprefixer(PostCSS)

```
npm i -D postcss autoprefixer postcss-loader
```
postcss: 스타일의 후처리를 돕는 패키지  
autoprefixer: 공급업체 접두사를 붙여주는 패키지  
postcss-loader: postcss를 webpack에서 동작시켜주는 패키지  

## in webpack.config.js
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.s?css$/,
  //정규표현식 사용. .scss 또는 .css로 끝나는 것을 찾는것.
        use: [
           // 순서 중요하다. 먼저 해석되는 것은 css-loader.
          'style-loader',
           // html에 해석된 css를 적용하는 용도
          'css-loader',
           // js파일에서 css파일을 해석하는 용도
          'postcss-loader',
  // sass로 해석후에 postcss로 붙여야하므로 이 위치에 넣는다.
          'sass-loader'
        ]
      }
    ]
  },
}
```

## in package.json
```json
{
  "browserslist": [
    "> 1%",
    "last 2 versions"
  ]
}
```
이후 root 경로에 .postcssrc.js 파일 생성

## in .postcssrc.js
```js
module.exports = {
  plugins: [
    require('autoprefixer')
  ]
}
```

# babel
```
npm i -D @babel/core @babel/preset-env @babel/plugin-transform-runtime babel-loader
```

root 경로에 .babelIrc.js 파일 생성

## in .babelIrc.js
```js
module.exports= {
  presets: ['@babel/preset-env'],
  // 일일히 따로 명시해야하는 js의 기능을 한번에 지원
  plugins: [ // 2차원 배열
    ['@babel/plugin-transform-runtime']
    // 비동기 처리를 위한 패키지.
  ]
}
```

## in webpack.config.js

```js
module.exports = {
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
        test: /\.js$/, // .js로 끝나는 파일을 찾는다.
        use: [
          'babel-loader' // babel-loader 패키지를 사용할 것.
        ]
      }
    ]
  },
}
```

# Netlify 배포
git으로 버전관리 해야함.