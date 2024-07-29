import { CorseController } from "@controllers";
import { Router } from "express";
import { Route } from "..";
import { RestActions } from "../../enum";

export class CorseRoute {
  private static path = Router();
  private static corceController = new CorseController();

  public static draw() {
    // this.path.route("/corce").get(this.corceController.index);
    Route.resource(this.path, CorseController, { only: [RestActions.Index] });

    return this.path;
  }
}
