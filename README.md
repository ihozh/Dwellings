# 中国民居邮票 3D 可视化

这是一个围绕中国邮政“中国民居”普通邮票系列的 3D 可视化原型。首版以 21 枚普23、普25、普26、普27民居邮票为目录，用参数化 Three.js 建筑模型表现不同地域民居的体量、屋顶、院落、水岸、土楼、窑洞和蒙古包等特征。

## 运行

```bash
npm install
npm run dev
```

## Cloudflare 部署

Cloudflare Workers + Static Assets 构建设置：

```text
Build command: npm run build
Deploy command: npx wrangler deploy
Non-production branch deploy command: npx wrangler versions upload
```

`wrangler.jsonc` 会把 `dist/` 作为静态网站资源目录。网页运行所需的静态资源放在 `public/` 下。`Blender/`、`material/`、`node_modules/`、`dist/` 等本地素材和构建目录不会上传到 GitHub。

## 数据范围

- 普23：中国民居，14 枚
- 普25：中国民居，2 枚
- 普26：中国民居，3 枚
- 普27：中国民居，2 枚

## 资料校对来源

- 中国集邮有限公司《民居》普23页面：https://cpi.chinapost.com.cn/xhtml1/appreciationstamp/24101/6222-1.htm
- 中国集邮有限公司《民居》普26页面：https://zhejiang.chinapost.com.cn/html1/appreciationstamp/24101/6312-1.htm
- ChinaStamp.org R25/PU25 目录页：https://www.xabusiness.com/china-stamps-1989/r25.htm
- ChinaStamp.org R27/PU27 目录页：https://chinesestamp.org/r27-pu27-%E6%99%AE27-folk-house%E3%80%8A%E6%B0%91%E5%B1%85%E3%80%8B/

后续可以把每枚邮票替换为更精确的图像纹理、补充发行日期和志号来源，并逐步将程序化模型升级为单独的建筑模型资产。
