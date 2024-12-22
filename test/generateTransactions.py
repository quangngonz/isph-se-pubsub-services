import random

from faker import Faker

fake = Faker()

# Define the available stocks
stocks = {
    "HOH": [],
    "RBH": [],
    "TGH": [],
    "VOI": []
}


def generate_transactions(stock_data, num_transactions_range, user_ids):
    """
    Generate fake transactions for a given stock data structure.

    Parameters:
    - stock_data: dict, the stock data with stock tickers as keys.
    - num_transactions_range: tuple, (lower_bound, upper_bound) for number of transactions.
    - user_ids: list, predefined list of user UUIDs.

    Returns:
    - List of transaction dictionaries.
    """
    transactions = []
    transaction_types = ["BUY", "SELL"]
    user_stock_holdings = {user_id: {ticker: 0 for ticker in stock_data.keys()} for user_id in user_ids}

    lower_bound, upper_bound = num_transactions_range
    total_transactions = random.randint(lower_bound, upper_bound)

    for _ in range(total_transactions):
        user_id = random.choice(user_ids)
        stock_ticker = random.choice(list(stock_data.keys()))

        # Decide transaction type based on current holdings
        if user_stock_holdings[user_id][stock_ticker] == 0:
            transaction_type = "BUY"
        else:
            transaction_type = random.choice(transaction_types)

        quantity = random.randint(1, 100)

        if transaction_type == "SELL":
            # Ensure the user cannot sell more than they own
            quantity = min(quantity, user_stock_holdings[user_id][stock_ticker])
            user_stock_holdings[user_id][stock_ticker] -= quantity
        else:  # BUY
            user_stock_holdings[user_id][stock_ticker] += quantity

        transaction = {
            "transaction_id": fake.uuid4(),
            "user_id": user_id,
            "stock_ticker": stock_ticker,
            "quantity": quantity,
            "transaction_type": transaction_type,
            "timestamp": fake.date_time_between(start_date="-30d", end_date="now").isoformat()
        }
        transactions.append(transaction)

    return transactions


# Generate transactions
user_ids = ["7gmGtCPGLUfmWa94l7Pnl2Eqbqq2", "QHrWvCXzryfIPze5dUzyVVOES4f1"]
num_transactions_range = (150, 200)  # Example range for the number of transactions
transactions = generate_transactions(stocks, num_transactions_range, user_ids)

for transaction in transactions:
    print(transaction)

output_obj = {}

for transaction in transactions:
    output_obj[transaction["transaction_id"]] = transaction

import json

with open("test/json_files/transactions.json", "w") as f:
    json.dump(output_obj, f, indent=4)
