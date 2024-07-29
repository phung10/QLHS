import userData from "@models/faker/user.json";
import { Request, Response } from "express";
import { ApplicationController } from "../application.controller";

export class HomeController extends ApplicationController {
  public index(req: Request, res: Response) {
    const user = userData;
    res.render("home.view/index", { title: "Irwin Framework", users: user });
  }
}
