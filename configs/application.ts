import { exec } from "child_process";
import cookieParser from "cookie-parser";
import express, { Express, NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { join, resolve } from "path";
import serverless from "serverless-http";
import env from "./env";
import { Route } from "./routes";

type RouteInfo = {
  method: string;
  prefix: string;
  path: string;
};

class Application {
  private readonly port = env.PORT || "3000";
  private readonly app: Express = express();
  private readonly routes: RouteInfo[] = [];

  constructor() {
    // cài đặc template engine
    this.app.set("views", join(resolve("./app"), "views"));
    this.app.set("view engine", "pug");

      //cài đătcj các công cụ giải mã
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
 
      //xuất file tĩnh như CSS ,JS và các thư viện như bootstrap ,Vue
    this.app.use(express.static(join(resolve("app"), "assets")));
    this.app.use(
      "/css",
      express.static(join(resolve("./node_modules"), "bootstrap/dist/css"))
    );
    this.app.use(
      "/js",
      express.static(join(resolve("./node_modules"), "bootstrap/dist/js"))
    );
    this.app.use(
      "/js",
      express.static(join(resolve("./node_modules"), "jquery/dist"))
    );
    this.app.use(
      "/js",
      express.static(join(resolve("./node_modules"), "vue/dist"))
    );

      //Cài đặc các route được xây dựng trong hệ thống
    this.mountRoutes();

    //Báo lỗi khi hệ thống ghi nhận sai sốt
    this.on404Handler();
    this.onErrorHandler();

    //Hàm dùng để hỗ trợ lt viên kra những route đã được cài đặt trong hệ thống
    this.getRoutes();
  }

  mountRoutes() {
    this.app.use(Route.draw());
  }

  on404Handler() {
    this.app.use(
      (err: any, req: Request, res: Response, next: NextFunction) => {
        next(createError(404));
      }
    );
  }

  onErrorHandler() {
    this.app.use(
      (err: any, req: Request, res: Response, next: NextFunction) => {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get("env") === "development" ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render("error");
      }
    );
  }

  processRoutes(route: any, prefix: string = ""): any {
    if (route.name === "router") {
      prefix += route.regexp
        .toString()
        .replace(/\/\^|\/\?|\/\$/g, "")
        .replace("(?=\\/|$)", "")
        .replace(/\\(.)/g, "$1")
        .replace(/\/i\n/g, "")
        .replace(/\/i$/, "");
      route.handle.stack?.map((r: any) => {
        const path = r.route?.path;

        if (r.route)
          r.route?.stack?.map((r: any) => {
            this.routes.push({
              method: r.method.toUpperCase(),
              prefix: prefix,
              path: path,
            });
          });
        else this.processRoutes(r, prefix);
      });
    }
  }

  getRoutes() {
    this.app._router.stack.map((r: any) => {
      this.processRoutes(r);
    });

    this.routes.sort((a: RouteInfo, b: RouteInfo) => {
      const nameA = a.prefix.toUpperCase();
      const nameB = b.prefix.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      return 0;
    });
  }

  showRoutes(search?: string) {
    this.routes.forEach((route) => {
      if (!search || JSON.stringify(route).includes(search)) console.log(route);
    });
  }

  handler() {
    return serverless(this.app);
  }

  run() {
    this.app
      .listen(this.port, () => {
        const url = `http://localhost:${this.port}`;
        console.log(`[server]:⚡️ Server is running at ${url}`);
        if (env.NODE_ENV === "development") exec(`start microsoft-edge:${url}`);
      })
      .on("error", (_error) => {
        return console.log("Error: ", _error.message);
      });
  }
}

export default new Application();
