# ETF Portfolio Rebalancing Dashboard

## Project Overview

This project is an end-to-end data analytics and business intelligence project that analyzes a sample ETF portfolio, calculates current allocation versus target allocation, identifies allocation drift, and generates buy/sell rebalancing recommendations.

The project uses Python for data processing, SQLite and SQL for structured data storage and analysis, Power BI for dashboard reporting, and a React/Tailwind CSS prototype for a front-end dashboard concept.

## Dashboard Preview

![ETF Portfolio Rebalancing Dashboard](docs/dashboard_screenshot.png)

## Tools & Technologies

- Python
- pandas
- yfinance
- SQLite
- SQL
- Power BI
- React
- Tailwind CSS
- VS Code

## Business Problem

Investment portfolios can drift away from their target allocation as ETF prices change over time. This can cause a portfolio to become overweight or underweight in certain asset classes, regions, or holdings.

This project helps answer:

- What is the total current portfolio value?
- How does actual allocation compare to target allocation?
- Which ETFs are overweight or underweight?
- How much should be bought or sold to rebalance the portfolio?
- What is the portfolio exposure by region and asset class?

## Portfolio Strategy

The sample portfolio is built around a CAD-based ETF allocation with exposure to:

- Canadian equity ETFs
- U.S. equity ETFs
- Canadian bond ETFs
- Gold/commodity ETFs
- Cash

The target allocation is designed to balance growth, stability, diversification, and liquidity.

## Project Workflow

1. Create sample ETF holdings data in CSV format.
2. Use Python and yfinance to retrieve recent ETF prices.
3. Calculate:
   - latest price
   - current value
   - total portfolio value
   - actual weight
   - target weight
   - allocation drift
   - target value
   - rebalance amount
   - suggested buy/sell action
4. Export the cleaned portfolio summary to CSV.
5. Load the portfolio summary into a SQLite database.
6. Write SQL queries to analyze portfolio value, exposure, and rebalancing recommendations.
7. Build a Power BI dashboard with portfolio KPIs and visualizations.
8. Build a React/Tailwind CSS prototype showing the same portfolio insights in a front-end interface.

## Folder Structure

```text
etf-rebalancing-tool/
├── data/
│   ├── holdings.csv
│   └── portfolio_summary.csv
├── scripts/
│   ├── calculate_portfolio.py
│   └── load_to_database.py
├── sql/
│   ├── portfolio.db
│   └── portfolio_queries.sql
├── powerbi/
│   ├── ETF_Portfolio_Rebalancing_Dashboard.pbix
│   └── finance_theme.json
├── react-app/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── portfolioData.js
│   ├── package.json
│   └── vite.config.js
├── docs/
│   └── dashboard_screenshot.png
├── .gitignore
└── README.md