
import express from 'express';
import { UploadController } from './upload.controller';
import { UploadValidation } from './upload.validation';
import { validate } from '../../Middlewares/validate';
import { catchAsync } from '../../Middlewares/catchAsync';
import { AuthMiddleware } from '../../Middlewares/AuthMiddleware';


const uploadController = new UploadController();
const uploadValidation = new UploadValidation();
const authMiddleWare = new AuthMiddleware();


const router = express.Router();
router.get('/', authMiddleWare.auth(), validate(uploadValidation.getUploads), catchAsync(uploadController.getUploads));

export default router;



/**
 * @swagger
 * /upload:
 *   get:
 *     summary: List of Upload 
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *        - in: query
 *          name: name
 *          required: false
 *          schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Upload list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               $ref: '#/components/schemas/Success'
 *             example:
 *              message: Success
 *              code: SC001
 *              status: true
 *              data: [ { "id": "714f5381-4de5-420a-95d9-c7f500006720", "createdAt": "2024-04-23T12:38:10.967Z", "updatedAt": "2024-04-23T12:53:02.454Z" } ]          
 *       "500":
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              message: Unknown error occurred.
 *              code: EC006
 *              status: false
 */
