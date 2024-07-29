import userData from "@models/faker/about.json";
import { Request, Response } from "express";
import { ApplicationController } from "../application.controller";

export class AboutController extends ApplicationController {
  public index(req: Request, res: Response) {
    const about = userData;
    res.render("about.view/index", { title: "about", users: about });
  }
}
