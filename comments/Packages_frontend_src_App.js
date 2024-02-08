import { useState } from "react";
// useState 是 React 的一个 Hook，它允许你在函数组件中添加 state状态

import "./App.css";

export default function App() {
  const [count, setCount] = useState(null);
  //  使用useState Hook创建了一个状态变量count和一个更新这个状态的函数setCount
  //    状态变量，可以理解为“响应式变量”
  //    当count里面的值更改 会触发页面重新渲染
  //    setCount是我们用来触发改变的函数

  console.log(process.env.REACT_APP_API_URL);

  function onClick() {
    fetch(process.env.REACT_APP_API_URL, {
      method: "POST",
    })
      //通过POST方法，向环境变量中读取的API URL
      .then((response) => response.text())
      .then(setCount);
      //then(fn) then里面加入的都是函数（） 如上的箭头也是匿名函数 意味着要对then的主体做的一个操作
  }
  //fetch(...).then((response) => response.text())
  //  意味着我们将API的响应转换为文本
  //fetch(...).then(setCount)
  //  意味着我们将文本setCount设置为count状态

  return (
    <div className="App">
      {count && <p>You clicked me {count} times.</p>}
      <button onClick={onClick}>Click Me!</button>
    </div>
  );
}

//  入口文件一般是index.js
//  在入口文件中，指明了要调用<App />
//    <App />是一个react组件，当react渲染时会执行app.js中的”函数”，或者“类的render方法”

// 渲染流程 
//  1. 首先，react会调用app.js中的函数，定义变量、定义函数，
//  2. 然后app.js，react会将return内容转换为一个DOM元素
//  3. react会将这个DOM元素插入到页面中
//  4. 当按钮被点击时，onClick函数会被调用，导致fetch函数被调用，然后将API的响应转换为文本，然后将文本setcount
//  5. 当状态变量count更改时，react会重新执行app.js中的所有代码（函数定义不被执行），返回新的return，完成渲染
//  6. 然后，react会将这个新的react元素转换为一个新的DOM元素
//  7. 最后，react会将这个新的DOM元素替换掉页面中的旧DOM元素
//  8. 通过这样的流程，我们就实现了页面的更新

// 一定要用npm run build 才会设置环境变量！

// 当整个SST项目 build成功之后 前端页面才会正常显示
// 项目展示页面 https://d3le389kpsidbp.cloudfront.net/

// clean-up
//    $ npx sst remove
//    $ npx sst remove --stage prod