import userData from "@models/faker/corce.json";
import { Request, Response } from "express";
import { ApplicationController } from "../application.controller";

export class CorseController extends ApplicationController {
  public index(req: Request, res: Response) {
    const corce = userData;
    res.render("corce.view/index", { title: "Corse", users: corce });
  }
}
