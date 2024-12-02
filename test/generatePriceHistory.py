import csv
import random
import uuid
from datetime import datetime, timedelta

# Define stock data
stocks = [
    {"stock_ticker": "HOH", "base_price": 105.0, "price_noise_factor": 0.05, "total_volume": 100000},
    {"stock_ticker": "RBH", "base_price": 92.5, "price_noise_factor": 0.03, "total_volume": 80000},
    {"stock_ticker": "TGH", "base_price": 115.0, "price_noise_factor": 0.04, "total_volume": 120000},
    {"stock_ticker": "VOI", "base_price": 78.0, "price_noise_factor": 0.02, "total_volume": 50000},
]


# Generate random timestamps within the last 3 months
def random_timestamp():
    start_date = datetime.now() - timedelta(days=90)
    random_time = start_date + timedelta(
        seconds=random.randint(0, int((datetime.now() - start_date).total_seconds()))
    )
    return random_time.isoformat()


# Generate stock price history data
def generate_stock_price_history(stocks, num_records=1000):
    history = []
    for _ in range(num_records):
        stock = random.choice(stocks)
        price = round(
            stock["base_price"] * random.uniform(1 - stock["price_noise_factor"], 1 + stock["price_noise_factor"]), 2
        )
        volume_traded = random.randint(0, stock["total_volume"])
        history.append({
            "price_history_id": str(uuid.uuid4()),
            "stock_ticker": stock["stock_ticker"],
            "price": price,
            "timestamp": random_timestamp(),
            "volume_traded": volume_traded,
        })
    return history


# Generate data
stock_price_history = generate_stock_price_history(stocks, num_records=1000)

# Save to CSV
csv_file_path = 'csv_files/stock_price_history.csv'

with open(csv_file_path, 'w', newline='') as csvfile:
    fieldnames = ["price_history_id", "stock_ticker", "price", "timestamp", "volume_traded"]
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    for record in stock_price_history:
        writer.writerow(record)

print(f"Stock price history saved to {csv_file_path}")
