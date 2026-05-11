import sqlite3
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data"
SQL_DIR = BASE_DIR / "sql"

csv_path = DATA_DIR / "portfolio_summary.csv"
db_path = SQL_DIR / "portfolio.db"

portfolio = pd.read_csv(csv_path)

connection = sqlite3.connect(db_path)

portfolio.to_sql(
    "portfolio_summary",
    connection,
    if_exists="replace",
    index=False
)

connection.close()

print("Portfolio data loaded into SQLite database successfully.")
print(f"Database created at: {db_path}")
print(f"Rows loaded: {len(portfolio)}")