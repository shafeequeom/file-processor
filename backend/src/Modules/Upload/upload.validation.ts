import Joi from 'joi';

export class UploadValidation {

  public getUploads = {
    query: Joi.object().keys({
      name: Joi.string().optional(),
    }),
  };

}
