import pandas as pd
import yfinance as yf
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data"

holdings_path = DATA_DIR / "holdings.csv"
output_path = DATA_DIR / "portfolio_summary.csv"

holdings = pd.read_csv(holdings_path)


def get_latest_price(ticker):
    if ticker == "CASH":
        return 1.0

    data = yf.download(ticker, period="5d", progress=False, auto_adjust=False)

    if data.empty:
        raise ValueError(f"No price data found for {ticker}")

    latest_price = data["Close"].dropna().iloc[-1]

    if isinstance(latest_price, pd.Series):
        latest_price = latest_price.iloc[0]

    return float(latest_price)

prices = []

for ticker in holdings["ticker"]:
    price = get_latest_price(ticker)
    prices.append(price)

holdings["latest_price"] = prices
holdings["current_value"] = holdings["shares"] * holdings["latest_price"]

total_value = holdings["current_value"].sum()

holdings["actual_weight"] = holdings["current_value"] / total_value
holdings["allocation_drift"] = holdings["actual_weight"] - holdings["target_weight"]
holdings["target_value"] = holdings["target_weight"] * total_value
holdings["rebalance_amount"] = holdings["target_value"] - holdings["current_value"]

holdings["suggested_action"] = holdings["rebalance_amount"].apply(
    lambda x: "Buy" if x > 0 else "Sell" if x < 0 else "Hold"
)

columns_to_round = [
    "latest_price",
    "current_value",
    "actual_weight",
    "allocation_drift",
    "target_value",
    "rebalance_amount",
]

holdings[columns_to_round] = holdings[columns_to_round].round(4)

holdings.to_csv(output_path, index=False)

print("Portfolio summary created successfully.")
print(f"Total portfolio value: ${total_value:,.2f}")
print(
    holdings[
        [
            "ticker",
            "current_value",
            "target_weight",
            "actual_weight",
            "allocation_drift",
            "rebalance_amount",
            "suggested_action",
        ]
    ]
)