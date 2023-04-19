import { notifications } from "@mantine/notifications";
import { SeivtFetch } from "@seivt/request";
const sFetch = new SeivtFetch({
  BASE: "/api/xxxx",
  WITH_CREDENTIALS: true,
  CREDENTIALS: "include",
  HEADERS: {
    corpHeader: "xxx",
  },
});

sFetch.setInterceptors({
  request(config) {
    const token = localStorage.getItem("at");
    config.headers["tokenHeader"] = token;
    return config;
  },
  responseError(error) {
    console.log("error", error);
    notifications.show({
      title: "错误提示",
      message: `${error.body.err || "error"}`,
      color: "red",
    });
  },
});

export default sFetch.request.bind(sFetch);
