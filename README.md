# SPS_Back
>域名修改：config下的index.js找到
<code>
    proxyTable: {
      "/sps": {
        target: "http://192.168.1.125/Sps/",
        changeOrigin: true,
        pathRewrite: {
          '^/sps': '/'
        }
      }
    },</code>
    修改target（接口文档api/xxx前的内容）

    图片路径修改：
    static下的urlf.js 的mainurl。同上