import { DynamoDB } from "aws-sdk";
//AWS Software Development Kit(SDK) for JavaScript   AWS软件开发包
//  这是与DynamoDB交互的接口

import { Table } from "sst/node/table";
//导入SST预先默认的Table配置 和 已经创建的Table的实例集合
//

const dynamoDb = new DynamoDB.DocumentClient();
//开启一个简单版的DynamoDB客户端
//  可以使用json与客户端交互

export async function main() {
  //这个函数就是Lambda函数的执行入口点
  //这个handler的功能就是 先获取当前的Count，然后+1，然后update给数据库，然后return 200和count

  const getParams = {
    // Get the table name from the environment variable
    //   刚才导入的Table 已经封装好了环境变量，即我们的实例Table Counter，它再DynamoDB的真实表名是什么

    TableName: Table.Counter.tableName,
    // Get the row where the counter is called "clicks"
    Key: {
      counter: "clicks",
    },
  };
  const results = await dynamoDb.get(getParams).promise();

  //promise和await是一对异步函数
  //  promise对象的三个状态“进行中” “已完成” “已失败”
  //  await是等待promise对象的状态变为“已完成”后再执行后面的代码

  // If there is a row, then get the value of the
  // column called "tally"
  //   tally是我们数据库中的一列
  let count = results.Item ? results.Item.tally : 0;

  const putParams = {
    //这是我们要传给DynamoDB数据库的内容：表名、主键、更新tally属性
    // 更新的SQL表达式 -->  “：count”时占位符
    // 更新的具体参数  -->  ":count": ++count,
    TableName: Table.Counter.tableName,
    Key: {
      counter: "clicks",
    },
    // Update the "tally" column
    UpdateExpression: "SET tally = :count",
    //
    ExpressionAttributeValues: {
      // Increase the count
      ":count": ++count,
    },
  };

  await dynamoDb.update(putParams).promise();

  return {
    statusCode: 200,
    body: count,
  };
}

//然后在react-app\packages\functions 安装npm install aws-sdk
//  因为lambda函数需要提前下载好aws的sdk才能运行

// Dev 过程会创建两种资源：CloudFormation堆栈 和 AWS s3存储桶
// CloudFormation堆栈 是AWS的一种资源管理工具 存储我们提到的 云函数、数据库等
// AWS s3存储桶是AWS的一种存储服务 用来存放CDK代码 帮助AWS更理解接下来要做什么

//npx cdk bootstrap aws://590184015833/us-east-1

//如果提示报错，按照如下流程操作：
//  1. 手动删除s3 -> 存储桶 -> cdk-hnb659fds-assets-590184015833-us-east-1
//  2. 手动删除CloudFormation栈 -> 删除CDKToolkit
//  3. 在VSCode的终端，项目文件夹，npx cdk bootstrap
//    Bootstrap操作的目的 1.创建资源存储位置 2.创建部署和管理权限 3.初始化CloudFormation栈
//    npx cdk bootstrap aws://590184015833/us-east-1
//  4. 再次运行 npm run dev

//✔  Deployed:
//      ExampleStack
//      ApiEndpoint: https://qk7wraf2s2.execute-api.us-east-1.amazonaws.com

//  如果是npm run dev 或 sst start
//    不要 Ctrl + C 退出终端 本地开发服务器会关闭
//  如果是npm run deploy
//    这样才是成功部署到AWS上面，可以随时退出终端

//  npx 创建 React项目
//    npx create-react-app packages/frontend --use-npm
//    很长时间没反应↓ 开始DEBUG
//      npm换源 淘宝源头已经被废弃 × https://registry.npm.taobao.org ×
//      npm换源 npm config set registry https://registry.npmmirror.com/
//      npm install -g create-react-app
//      最后通过cmd运行该命令成功解决

//  在frontend文件夹里新增 .env文件 并输入 SKIP_PREFLIGHT_CHECK=true

//  转 -> packages/frontend/src/App.js 接下来去写 React页面！
