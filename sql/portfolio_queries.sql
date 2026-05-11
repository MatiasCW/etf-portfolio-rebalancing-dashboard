-- View the full portfolio summary
SELECT *
FROM portfolio_summary;

-- Total portfolio value
SELECT 
    ROUND(SUM(current_value), 2) AS total_portfolio_value
FROM portfolio_summary;

-- Actual allocation by asset class
SELECT 
    asset_class,
    ROUND(SUM(current_value), 2) AS asset_class_value,
    ROUND(SUM(current_value) * 1.0 / (
        SELECT SUM(current_value) 
        FROM portfolio_summary
    ), 4) AS asset_class_weight
FROM portfolio_summary
GROUP BY asset_class
ORDER BY asset_class_value DESC;

-- Actual allocation by region
SELECT 
    region,
    ROUND(SUM(current_value), 2) AS region_value,
    ROUND(SUM(current_value) * 1.0 / (
        SELECT SUM(current_value) 
        FROM portfolio_summary
    ), 4) AS region_weight
FROM portfolio_summary
GROUP BY region
ORDER BY region_value DESC;

-- Rebalancing recommendations
SELECT 
    ticker,
    fund_name,
    ROUND(current_value, 2) AS current_value,
    target_weight,
    actual_weight,
    allocation_drift,
    ROUND(rebalance_amount, 2) AS rebalance_amount,
    suggested_action
FROM portfolio_summary
ORDER BY ABS(allocation_drift) DESC;

-- ETFs that need buying
SELECT 
    ticker,
    fund_name,
    ROUND(rebalance_amount, 2) AS amount_to_buy
FROM portfolio_summary
WHERE suggested_action = 'Buy'
ORDER BY rebalance_amount DESC;

-- ETFs that need selling
SELECT 
    ticker,
    fund_name,
    ROUND(ABS(rebalance_amount), 2) AS amount_to_sell
FROM portfolio_summary
WHERE suggested_action = 'Sell'
ORDER BY ABS(rebalance_amount) DESC;