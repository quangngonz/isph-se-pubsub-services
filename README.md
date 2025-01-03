# ISPH Stock Exchange Pub/Sub Services

This repository contains the backend services for the ISPH Stock Exchange, a simulated stock market platform. It includes functionalities for processing market events, evaluating their impact on stock prices, projecting future stock performance, and managing transactions. The system is designed to run on a Node.js environment and utilizes Firebase for real-time data storage and management.

## Features

- **Event Processing**: Processes market events and evaluates their impact on stock prices using AI models (OpenAI and Google Gemini).
- **Stock Price Projection**: Projects future stock prices based on processed events and historical data.
- **Transaction Management**: Manages and simulates stock transactions, including buying and selling.
- **Portfolio Management**: Tracks and updates daily portfolio values for users.
- **Real-time Data Handling**: Uses Firebase for real-time data storage and retrieval.
- **Automated Engine**: Runs a continuous engine to update stock prices and process events at random intervals.
- **Scheduled Tasks**: Automatically saves daily portfolio values and processes transactions.
- **API Integration**: Integrates with OpenAI and Google Gemini for AI-driven evaluations and projections.

## Directory Structure

```

└── quangngonz-isph-se-pubsub-services/
├── Procfile # Heroku Procfile for web process
├── engine.js # Main engine logic for stock market simulation
├── heroku_config.py # Script to set Heroku environment variables
├── package.json # Node.js dependencies and scripts
├── qodana.yaml # Qodana code quality configuration
├── server.js # Main server file with Express.js setup
├── functions/ # Business logic and utility functions
│ ├── manipulateStockPrices.js # Functions to manipulate stock prices
│ ├── priceProjectionTransactions.js # Functions for price projection and transactions
│ ├── proccessEvent.js # Functions to process market events
│ ├── saveCurrentPortfolioValue.js # Functions to save current portfolio values
│ ├── server_data_fetcher.js # Functions to fetch data from the server
│ └── utils/ # Utility functions
│ ├── WeightsProcessor.js # Functions to process event weights
│ └── transactionParser.js # Functions to parse transaction data
├── services/ # Services for interacting with external APIs and databases
│ ├── LLMServices.js # Services for interacting with LLMs (OpenAI, Gemini)
│ ├── dbService.js # Services for database operations
│ ├── evaluationService.js # Services for event evaluation
│ ├── firebaseService.js # Services for Firebase integration
│ └── promptGenerationService.js # Services for generating prompts for LLMs
├── test/ # Test scripts and data
│ ├── analyse_event.py # Script to analyze events
│ ├── firebaseRuleJSON.py # Script to update Firebase rules
│ ├── generatePriceHistory.py # Script to generate stock price history
│ ├── generateTransactions.py # Script to generate fake transactions
│ ├── pushCSVtoFirebase.py # Script to push CSV data to Firebase
│ ├── pushJSONtoFirebase.py # Script to push JSON data to Firebase
│ ├── csv_files/ # CSV files for testing
│ │ ├── stock_price_history.csv # Sample stock price history data
│ │ └── stocks.csv # Sample stock data
│ └── json_files/ # JSON files for testing
│ ├── portfolio.json # Sample portfolio data
│ └── transactions.json # Sample transaction data
└── .github/ # GitHub Actions workflows
└── workflows/
└── qodana_code_quality.yml # Workflow for Qodana code quality checks

```

## Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Firebase account
- Heroku account (for deployment)
- OpenAI API key (optional, for OpenAI integration)
- Google Gemini API key (optional, for Gemini integration)

### Environment Variables

Set the following environment variables in a `.env` file in the root directory:

```

FIREBASE_TYPE=<your-firebase-type>
FIREBASE_PROJECT_ID=<your-firebase-project-id>
FIREBASE_PRIVATE_KEY_ID=<your-firebase-private-key-id>
FIREBASE_PRIVATE_KEY=<your-firebase-private-key>
FIREBASE_CLIENT_EMAIL=<your-firebase-client-email>
FIREBASE_CLIENT_ID=<your-firebase-client-id>
FIREBASE_AUTH_URI=<your-firebase-auth-uri>
FIREBASE_TOKEN_URI=<your-firebase-token-uri>
FIREBASE_AUTH_PROVIDER_CERT_URL=<your-firebase-auth-provider-cert-url>
FIREBASE_CLIENT_CERT_URL=<your-firebase-client-cert-url>
FIREBASE_DATABASE_URL=<your-firebase-database-url>
REDIS_URL=<your-redis-url>
OPENAI_API_KEY=<your-openai-api-key> (optional)
GEMINI_API_KEY=<your-gemini-api-key> (optional)
HEROKU_APP_NAME=<your-heroku-app-name>

```

### Installation Steps

1. Clone the repository:

```bash
git clone https://github.com/your-username/quangngonz-isph-se-pubsub-services.git
cd quangngonz-isph-se-pubsub-services
```

2. Install dependencies:

```bash
npm install
```

3. Set up Firebase:

- Replace the placeholder values in `firebaseService.js` with your Firebase project credentials.
- Ensure your Firebase project is set up with a Realtime Database.

4. Set up Heroku (optional):

- If deploying to Heroku, set the environment variables using the `heroku_config.py` script:

```bash
python heroku_config.py
```

### Running the Application

#### Locally

To start the server locally:

```bash
npm start
```

To run in development mode with nodemon:

```bash
npm run dev
```

#### Heroku

Deploy to Heroku using the following commands:

```bash
git push heroku main
```

## Usage

### API Endpoints

- `POST /trigger-task`: Triggers the event evaluation task.
  - Body: `{ "eventId": "your-event-id" }`
- `GET /`: Redirects to the ISPH SSE frontend.

### Engine

The `engine.js` file contains the main logic for simulating the stock market. It fetches event weights, updates stock prices, and processes transactions. The engine runs at random intervals between 5 and 300 seconds.

### Scheduled Tasks

The `saveCurrentPortfolioValue.js` file contains the logic for saving daily portfolio values. This task runs every 24 hours.

### Test Scripts

The `test/` directory contains scripts for testing various functionalities:

- `analyse_event.py`: Sends POST requests to the `/trigger-task` endpoint to analyze events.
- `firebaseRuleJSON.py`: Updates Firebase rules based on a given date.
- `generatePriceHistory.py`: Generates fake stock price history data and saves it to a CSV file.
- `generateTransactions.py`: Generates fake transaction data and saves it to a JSON file.
- `pushCSVtoFirebase.py`: Pushes data from a CSV file to Firebase.
- `pushJSONtoFirebase.py`: Pushes data from a JSON file to Firebase.

To run a test script, navigate to the `test/` directory and execute the script:

```bash
python analyse_event.py
```

## License

This project is licensed under the MIT License.

## Contribution

Contributions are welcome! Feel free to fork the repository, suggest improvements, or report issues.

For inquiries, contact:

- **School Email**: <quang.n.student@isph.edu.vn>
- **Personal Email**: <quangngo.nz@gmail.com>
