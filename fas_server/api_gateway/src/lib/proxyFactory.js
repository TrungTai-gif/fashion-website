import proxy from "express-http-proxy";

export function createServiceProxy(serviceUrl) {
  return proxy(serviceUrl, {
    proxyReqPathResolver: (req) => req.originalUrl,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      // ensure headers object exists
      proxyReqOpts.headers = proxyReqOpts.headers || {};

      // forward original authorization header so downstream services can verify if needed
      if (srcReq.headers && srcReq.headers.authorization) {
        proxyReqOpts.headers["authorization"] = srcReq.headers.authorization;
      }

      // forward decoded user info from gateway middleware
      if (srcReq.user) {
        proxyReqOpts.headers["x-user-id"] =
          srcReq.user.userId || srcReq.user.id || srcReq.user._id || "";
        proxyReqOpts.headers["x-user-email"] =
          srcReq.user.email || srcReq.user.username || "";
      }

      return proxyReqOpts;
    },
  });
}

export default createServiceProxy;
