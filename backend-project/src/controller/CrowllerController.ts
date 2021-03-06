import "reflect-metadata";
import fs from "fs";
import path from "path";
import Crowller from "../utils/crowller";
import Analyzer from "../utils/analyzer";
import { Request, Response, NextFunction } from "express";
import { controller, use, get } from "../decorator";
import { getResponseData } from "../utils/util";

interface BodyRequest extends Request {
  body: { [key: string]: string | undefined };
}

const checkLogin = (
  req: BodyRequest,
  res: Response,
  next: NextFunction
): void => {
  const isLogin = !!(req.session ? req.session.login : false);
  if (isLogin) {
    next();
  } else {
    res.json(getResponseData(null, "please login"));
  }
};

@controller("/api")
export class CrowllerController {
  @get("/getData")
  @use(checkLogin)
  getData(req: BodyRequest, res: Response): void {
    const url = "https://lovetodream.com.au/stage-1-swaddling/";
    const anaylzer = Analyzer.getInstance();
    new Crowller(url, anaylzer);
    res.json(getResponseData<responseResult.getData>(true));
  }

  @get("/showData")
  @use(checkLogin)
  showData(req: BodyRequest, res: Response): void {
    try {
      const position = path.resolve(__dirname, "../../data/product.json");
      const result = fs.readFileSync(position, "utf-8");
      res.json(getResponseData<responseResult.showData>(JSON.parse(result)));
    } catch (e) {
      res.json(getResponseData<responseResult.showData>(false, "no data"));
    }
  }
}
