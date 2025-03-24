
import express from 'express';

import swaggerRoute from './Docs/swagger.route';
import config from './Common/Config/config';

import uploadRoute from './Modules/Upload/upload.route';

const router = express.Router();

const defaultRoutes = [
    {
        path: '/upload',
        route: uploadRoute,
    },
];


defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

const devRoutes = [
    // routes available only in development mode
    {
        path: '/docs',
        route: swaggerRoute,
    },
];

/* istanbul ignore next */
if (["development", "test"].includes(config.env)) {
    devRoutes.forEach((route) => {
        router.use(route.path, route.route);
    });
}

export default router;