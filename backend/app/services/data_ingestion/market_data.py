from typing import List, Dict, Any
import math

class MarketDataService:
    """
    Serves real historical and simulated parameter data for the 6 concept studios:
    1. Compounding
    2. Risk vs Return
    3. Diversification
    4. Dollar-Cost Averaging (DCA)
    5. Inflation Erosion
    6. Market Cycles
    """

    # Real historical asset class benchmarks (1994-2024 trailing 30-year annualized)
    ASSET_CLASSES = [
        {"name": "U.S. Cash / T-Bills", "ticker": "BIL", "expected_return": 2.6, "volatility": 0.8, "category": "Cash"},
        {"name": "10-Year U.S. Treasuries", "ticker": "IEF", "expected_return": 4.8, "volatility": 6.9, "category": "Bonds"},
        {"name": "Investment Grade Corporate Bonds", "ticker": "LQD", "expected_return": 5.9, "volatility": 8.4, "category": "Bonds"},
        {"name": "U.S. Large Cap (S&P 500)", "ticker": "SPY", "expected_return": 10.2, "volatility": 15.3, "category": "Equities"},
        {"name": "U.S. Small Cap (Russell 2000)", "ticker": "IWM", "expected_return": 11.1, "volatility": 19.8, "category": "Equities"},
        {"name": "Emerging Markets Equity", "ticker": "EEM", "expected_return": 8.9, "volatility": 22.4, "category": "Equities"},
        {"name": "Gold", "ticker": "GLD", "expected_return": 7.4, "volatility": 16.1, "category": "Commodities"},
    ]

    # Historical Market Drawdowns & Cycle Regimes
    HISTORICAL_CYCLES = [
        {
            "name": "Dot-Com Bust (2000-2002)",
            "start_year": 2000,
            "trough_year": 2002,
            "max_drawdown_pct": -49.1,
            "recovery_months": 56,
            "description": "Speculative technology valuations detached from cash flows, leading to a multi-year consolidation."
        },
        {
            "name": "Global Financial Crisis (2007-2009)",
            "start_year": 2007,
            "trough_year": 2009,
            "max_drawdown_pct": -56.8,
            "recovery_months": 49,
            "description": "Subprime mortgage credit collapse transmitted systemic banking stress across global equities."
        },
        {
            "name": "COVID-19 Shock (2020)",
            "start_year": 2020,
            "trough_year": 2020,
            "max_drawdown_pct": -33.9,
            "recovery_months": 5,
            "description": "Sharpest 30% decline in stock market history followed by rapid stimulus and digital acceleration."
        },
        {
            "name": "Inflation & Rate Tightening (2022)",
            "start_year": 2022,
            "trough_year": 2022,
            "max_drawdown_pct": -25.4,
            "recovery_months": 22,
            "description": "Rapid Federal Reserve interest rate hikes compressed equity multiples and bond prices concurrently."
        }
    ]

    def compute_compounding(
        self,
        principal: float = 5000.0,
        monthly_contribution: float = 250.0,
        annual_rate: float = 8.0,
        years: int = 20,
        pause_contribution_year: int = 0
    ) -> Dict[str, Any]:
        """
        Computes year-by-year trajectory for with-contributions vs without-contributions.
        """
        r = annual_rate / 100.0
        monthly_r = r / 12.0

        with_contrib_series = []
        without_contrib_series = []

        curr_with = principal
        curr_without = principal
        total_invested_with = principal
        total_invested_without = principal

        for y in range(0, years + 1):
            if y == 0:
                with_contrib_series.append({"year": 0, "total": round(curr_with, 2), "invested": round(total_invested_with, 2)})
                without_contrib_series.append({"year": 0, "total": round(curr_without, 2), "invested": round(total_invested_without, 2)})
                continue

            for m in range(12):
                # With contributions
                active_contrib = monthly_contribution if (pause_contribution_year == 0 or y <= pause_contribution_year) else 0.0
                curr_with = (curr_with + active_contrib) * (1.0 + monthly_r)
                total_invested_with += active_contrib

                # Without contributions
                curr_without = curr_without * (1.0 + monthly_r)

            with_contrib_series.append({
                "year": y,
                "total": round(curr_with, 2),
                "invested": round(total_invested_with, 2)
            })
            without_contrib_series.append({
                "year": y,
                "total": round(curr_without, 2),
                "invested": round(total_invested_without, 2)
            })

        return {
            "parameters": {
                "principal": principal,
                "monthly_contribution": monthly_contribution,
                "annual_rate": annual_rate,
                "years": years,
                "pause_contribution_year": pause_contribution_year
            },
            "final_with_contributions": round(curr_with, 2),
            "final_without_contributions": round(curr_without, 2),
            "with_contrib_series": with_contrib_series,
            "without_contrib_series": without_contrib_series,
            "insight": (
                "The surprising part isn't the first few years. "
                f"Over {years} years, your contributions of ${int(total_invested_with):,} generated "
                f"${int(curr_with - total_invested_with):,} in compound returns. "
                "Notice how the curve bends upward as time takes over."
            )
        }

    def compute_risk_return(self, expected_return: float = 8.0) -> Dict[str, Any]:
        """
        Dynamically calculates the uncertainty envelope (1st & 2nd standard deviation outcomes)
        as expected return is manipulated. Demonstrates that higher expected return expands uncertainty.
        """
        # Empirical relationship: Volatility increases non-linearly with expected return
        # Approximate baseline: Vol ~ (Return - 2.5) * 1.6 + 6.0
        volatility = max(1.0, (expected_return - 2.0) * 1.6 + 4.5)
        
        # 1-year 68% confidence interval: [Return - Vol, Return + Vol]
        range_lower_1sigma = expected_return - volatility
        range_upper_1sigma = expected_return + volatility

        # 95% confidence interval
        range_lower_2sigma = expected_return - (2 * volatility)
        range_upper_2sigma = expected_return + (2 * volatility)

        return {
            "expected_return": expected_return,
            "implied_volatility": round(volatility, 1),
            "range_68pct": [round(range_lower_1sigma, 1), round(range_upper_1sigma, 1)],
            "range_95pct": [round(range_lower_2sigma, 1), round(range_upper_2sigma, 1)],
            "real_benchmarks": self.ASSET_CLASSES,
            "insight": (
                f"You set expected return to {expected_return}%. "
                f"Notice that the range of annual outcomes widens to between {range_lower_1sigma:.1f}% and {range_upper_1sigma:.1f}%. "
                "Higher expected return does not create certainty — it expands the horizon of outcomes."
            )
        }

    def compute_diversification(self, asset_count: int = 3) -> Dict[str, Any]:
        """
        Simulates how branching from 1 asset to N uncorrelated assets
        reduces overall portfolio variance while maintaining expected return.
        """
        selected_assets = self.ASSET_CLASSES[:min(asset_count, len(self.ASSET_CLASSES))]
        avg_ret = sum(a["expected_return"] for a in selected_assets) / len(selected_assets)
        
        # Portfolio volatility under assumption of moderate correlation (~0.3)
        single_vol = selected_assets[-1]["volatility"]
        # Diversified variance formula: sigma_p = sqrt( (1/N)*var + ((N-1)/N)*cov )
        corr = 0.35
        n = len(selected_assets)
        avg_var = sum(a["volatility"]**2 for a in selected_assets) / n
        port_vol = math.sqrt((avg_var / n) + ((n - 1) / n) * avg_var * corr)

        return {
            "asset_count": n,
            "assets": selected_assets,
            "portfolio_expected_return": round(avg_ret, 1),
            "single_asset_volatility": round(single_vol, 1),
            "portfolio_volatility": round(port_vol, 1),
            "volatility_reduction_pct": round(((single_vol - port_vol) / single_vol) * 100, 1),
            "insight": (
                f"With {n} independent asset classes, portfolio volatility compressed from {single_vol:.1f}% to {port_vol:.1f}% "
                f"({round(((single_vol - port_vol) / single_vol) * 100)}% smoother) while preserving an expected return of {avg_ret:.1f}%. "
                "The thread branched, but the outcome calmed."
            )
        }

    def compute_inflation_erosion(self, years: int = 20, inflation_rate: float = 3.0) -> Dict[str, Any]:
        """
        Shows the shrinking purchasing power of $10,000 cash over decades.
        """
        initial_val = 10000.0
        trajectory = []
        for y in range(0, years + 1, 2):
            real_val = initial_val / ((1.0 + (inflation_rate / 100.0)) ** y)
            trajectory.append({
                "year": y,
                "nominal": initial_val,
                "purchasing_power": round(real_val, 2),
                "loss_pct": round(((initial_val - real_val) / initial_val) * 100, 1)
            })

        final_power = trajectory[-1]["purchasing_power"]
        return {
            "initial_cash": initial_val,
            "years": years,
            "inflation_rate": inflation_rate,
            "final_purchasing_power": final_power,
            "purchasing_power_loss_pct": round(((initial_val - final_power) / initial_val) * 100, 1),
            "trajectory": trajectory,
            "insight": (
                f"At {inflation_rate}% annual inflation, $10,000 in cash preserves its nominal face value, "
                f"but its real purchasing power shrinks to ${int(final_power):,} after {years} years. "
                "Holding uninvested cash carries its own invisible risk: guaranteed loss of purchasing power."
            )
        }

market_data_service = MarketDataService()
