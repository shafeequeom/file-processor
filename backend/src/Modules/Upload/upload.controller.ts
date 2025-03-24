
import { Request, Response } from 'express';
import { successResponseWithData } from '../../Common/Utils/apiResponse';
import { APICodes } from '../../Common/Constants';
import { UploadService } from './upload.service';

const uploadService = new UploadService();

export class UploadController {


  async getUploads(req: Request, res: Response) {

    const data = await uploadService.getUploads(req.query);
    return successResponseWithData(res, APICodes.COMMON_SUCCESS, data);

  }


}
