const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
      title: 'devCamper api',
      description: 'Api related to the devCamper coding bootcamp'
    },
    host: 'https://devcamper-api-kvc0.onrender.com/api/v1',
    securityDefinitions: {
      bearerAuth: { // This name MUST match the inline security reference
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: 'Enter the Bearer Token in the format "Bearer <token>"',
      },
    },
  };
  
  const outputFile = './swagger-output.json';
  const routes = ['./routes/auth.js','./routes/bootcamps.js','./routes/courses.js','./routes/reviews.js','./routes/users.js'];
  
  /* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
  root file where the route starts, such as index.js, app.js, routes.js, etc ... */
  
  swaggerAutogen(outputFile, routes, doc);
