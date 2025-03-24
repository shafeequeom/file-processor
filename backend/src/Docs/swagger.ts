import config from "../Common/Config/config";

const swaggerDef = {
    openapi: '3.0.3',
    info: {
        title: 'Al POS documentation',
        version: "1.0",
    },
    servers: [
        {
            url: `${config.server}/api/v1`,
        },
    ],
    // host: `${config.server}`, // the host or url of the app
    // basePath: '/'
};

export default swaggerDef;