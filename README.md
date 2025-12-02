# Emma Health

Emma Health is a basic Node.js application with a structured setup including middleware, routes, controllers, views, and common utilities.

## Project Structure

```
emmaHealth/
├── app.js
├── common/
│   └── response.js
├── config/
│   └── config.js
├── controllers/
│   ├── authController.js
│   ├── blobController.js
│   └── homeController.js
├── helpers/
│   └── userHelper.js
├── middleware/
│   ├── blobStorage.js
│   └── logger.js
├── routes/
│   ├── authRoutes.js
│   ├── blobRoutes.js
│   └── index.js
├── views/
│   └── forgotPasswordEmail.ejs
├── .env
├── .eslintrc.json
├── eslint.config.js
├── README.md
└── swagger/
    └── swaggerOptions.js
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/emmaHealth.git
   cd emmaHealth
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example` and configure your environment variables, including the database connection string.

## Usage

1. Start the server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000`.

## API Documentation

The API documentation is available at `http://localhost:3000/api-docs`.

## Environment Variables

The following environment variables need to be configured in the `.env` file:

```
DB_SERVER=your_db_server
DB_DATABASE=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=false
DB_CONNECTION_TIMEOUT=30000

AZURE_STORAGE_CONNECTION_STRING=your_azure_storage_connection_string
AZURE_STORAGE_SAS_TOKEN=your_generated_sas_token

SWAGGER_USER=your_swagger_user
SWAGGER_PASS=your_swagger_password

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

"# Emma-BE" 
