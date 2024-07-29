import { AboutController } from "@controllers";
import { Router } from "express";
import { Route } from "..";
import { RestActions } from "../../enum";

export class AboutRoute {
  private static path = Router();
  private static corceController = new AboutController();

  public static draw() {
    // this.path.route("/corce").get(this.corceController.index);
    Route.resource(this.path, AboutController, { only: [RestActions.Index] });

    return this.path;
  }
}
