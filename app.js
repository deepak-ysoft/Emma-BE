const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger/swaggerOptions');
const Routes = require('./routes/index');
const cors = require('cors');
const basicAuth = require('express-basic-auth');
const { handleStripeWebhook } = require('./controllers/stripeWebhookController');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Basic authentication configuration
const authorizedUser = process.env.SWAGGER_USER || 'healthClub';
const authorizedPassword = process.env.SWAGGER_PASSWORD || '3R@kdn!nrtt';

// Allow all origins for CORS
app.use(cors({
  origin: '*', // Or use your frontend origin, e.g. 'http://localhost:5173'
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());

// Important: We need raw body for webhook verification
app.use('/webhook/stripe', express.raw({ type: 'application/json' }));
// For all other routes, use regular JSON parsing
app.use(express.json({ type: 'application/json' }));

// Stripe Webhook Endpoint
app.post('/webhook/stripe', handleStripeWebhook);

// Apply Basic Auth Middleware for Swagger UI
app.use(
  `/api-docs`,
  basicAuth({
    users: { [authorizedUser]: authorizedPassword },
    challenge: true,
    unauthorizedResponse: 'Unauthorized access to Swagger UI',
  }),
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs)
);

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '1000mb', extended: true }));

// Static file serving and view engine setup
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/api', Routes);

app.get('/', (req, res) => {
  res.send('EMMA Health');
});

// Start the server
const server = app.listen(port, () => {
  const swaggerUrl = process.env.SWAGGER_URL || `http://localhost:${port}/api-docs`;
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Swagger is running on ${swaggerUrl}`);
});

// Graceful shutdown for Azure Web App
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});