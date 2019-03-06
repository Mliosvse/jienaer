module.exports = {
  baseUrl: process.env.NODE_ENV === "production" ? "/jn/" : "/",
  devServer: {
    proxy: {
      '^/api/': {
        target: 'http://tloanapi.zjlinxi.com'
      },
      '': {
        target: 'http://tjnh5.hzlinxi.com'
        // target: 'http://10.0.0.218:8001'
      }
    }
  }
};
