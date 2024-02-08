//import {..., ..., ...} 解构导入 只导入指定“成员名称”的部分
//Api 是用来定义和创建 API Gateway的
// API Gateway是前端和后端的中间层，包括REST HTTP和WebSocket API
//  REST API --- HTTP方法（如GET、POST、PUT、DELETE）操作json或XML
//  WebSocket API --- 建立服务器与客户端的持续连接 双向 实时
// API Gateway 让后端服务免于直接暴露 并且可以授权、认证和记录

//StaticSite 用于部署静态网站 比如React生成的单页应用（SPA）
// 上传文件到AWS S3（存储桶）

//StackContext
// 上下文对象（Context Object）让我们定义栈的时候 知道这个栈的位置、状态、属性
// 通过StackContext可以找到我们目前正在定义的Stack对象
//  栈是一组“云资源（如Lambda函数、DynamoDB表、API Gateway等）”的集合

import { Api, StaticSite, StackContext, Table } from "sst/constructs";

// export 把某个函数标记为 “部署时执行” SST
// ExampleStack 在 “npx sst deploy” 时执行

// ExampleStack({ stack }: StackContext)
//  当npx sst deploy时-- > 生成管理StackContext对象-- > StackContext.Stack属性 是这个函数的传参
//    我们通过{Stack}：StackContext 解构StackContext对象 并且把Stack入参给函数
//    Stack属性 是一个CDK的‘Stack’的实例 告诉我们这个函数即将绑定给哪个 云函数CloudFormation栈

export function ExampleStack({ stack }: StackContext) {
  // Create the table --- 告诉AWS.S3创建DynamoDB table
  //    官方文档 https://docs.sst.dev/constructs/Table

  // new Table 创建一个实例，用来封装DynamoDB表的创建逻辑
  //   stack 我们当前栈的位置
  //   “Counter” 我们创建的表的名字
  //   {fields 表的字段
  //      :{counter 字段名: 类型},
  //    primaryIndex 主键,
  //      :{partitionKey 主键: "counter" 字段名}
  const table = new Table(stack, "Counter", {
    fields: {
      counter: "string",
      //‘String’, 键值对后面加逗号 哪怕之后没有内容也没关系的（JS或TS）
    },
    primaryIndex: { partitionKey: "counter" },
  });

  // Create the api --- 告诉AWS.S3创建API Gateway

  //路由：根据 URL/请求/方法 决定 如何处理信息
  //  类似把不同的URL映射到不同的函数/方法上
  //  我传输给API的信息应该是什么样子？是包括Post这些方法的信息吗？路由如何判断什么样的信息应该传输给后端，如何传给？
  const api = new Api(stack, "Api", {
    defaults: {
      function: {
        // Bind the table name to our API
        bind: [table],
      },
    },
    routes: {
      "POST /": "packages/functions/src/lambda.main",
      //前端 - API request - Limbda函数 - DynamoDB
      //  前端：“http://a.b/post....X=10086” (其中 /post 是路由)--> API
      //  API 根据请求 --> 调用对应的limbda函数（如 createPost.handler）
      //lambda.handler大概率需要手动书写
    },
  });

  // Show the URLs in the output
  // 这个输出被反馈给调用者 npx sst deploy
  // stack.addOutputs({
  //   ApiEndpoint: api.url,
  // });

  // Deploy our React app
  const site = new StaticSite(stack, "ReactSite", {
    path: "packages/frontend",
    buildCommand: "npm run build",
    buildOutput: "build",
    //先 npm run build 然后把build文件夹上传到S3
    environment: {
      REACT_APP_API_URL: api.url,
      // 传递给React应用的环境变量(API的url)

      // Deploy our React app 绑定域名（可选）
      //    customDomain: "www.my-react-app.com",
    },
  });

  // Show the URLs in the output
  stack.addOutputs({
    SiteUrl: site.url,
    //输出返回静态网站的url
    ApiEndpoint: api.url,
    //输出返回API的url
  });
}

// 转 -> 然后去创建和书写 packages/functions/src/lambda.ts
