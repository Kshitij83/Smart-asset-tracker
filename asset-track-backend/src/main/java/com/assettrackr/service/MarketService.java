package com.assettrackr.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class MarketService {

    private static final List<Map<String, String>> STOCK_UNIVERSE = List.of(
            Map.of("symbol", "AAPL", "name", "Apple Inc.", "sector", "Technology"),
            Map.of("symbol", "TSLA", "name", "Tesla Inc.", "sector", "Automotive"),
            Map.of("symbol", "GOOGL", "name", "Alphabet Inc.", "sector", "Technology"),
            Map.of("symbol", "MSFT", "name", "Microsoft Corp.", "sector", "Technology"),
            Map.of("symbol", "AMZN", "name", "Amazon.com Inc.", "sector", "E-commerce"),
            Map.of("symbol", "NVDA", "name", "NVIDIA Corp.", "sector", "Technology"),
            Map.of("symbol", "META", "name", "Meta Platforms Inc.", "sector", "Technology"),
            Map.of("symbol", "BTC", "name", "Bitcoin", "sector", "Crypto"),
            Map.of("symbol", "ETH", "name", "Ethereum", "sector", "Crypto"));

    public List<Map<String, Object>> getMarketData(String symbol, String timeframe) {
        int days = switch (timeframe == null ? "1m" : timeframe) {
            case "1d" -> 1;
            case "1w" -> 7;
            case "1m" -> 30;
            case "3m" -> 90;
            case "6m" -> 180;
            case "1y" -> 365;
            default -> 30;
        };

        double basePrice = 100 + (hash(symbol) % 400);
        List<Map<String, Object>> data = new ArrayList<>();
        LocalDate today = LocalDate.now();
        double price = basePrice;

        for (int i = days; i >= 0; i--) {
            double change = (Math.random() - 0.5) * 0.03;
            price = price * (1 + change);
            long volume = 1_000_000L + (long) (Math.random() * 5_000_000L);

            Map<String, Object> point = new LinkedHashMap<>();
            point.put("date", today.minusDays(i).toString());
            point.put("price", BigDecimal.valueOf(price).setScale(2, RoundingMode.HALF_UP));
            point.put("volume", volume);
            data.add(point);
        }
        return data;
    }

    public List<Map<String, Object>> searchStocks(String query) {
        String q = query == null ? "" : query.toLowerCase(Locale.ROOT);
        List<Map<String, Object>> results = new ArrayList<>();
        for (Map<String, String> stock : STOCK_UNIVERSE) {
            if (stock.get("symbol").toLowerCase(Locale.ROOT).contains(q)
                    || stock.get("name").toLowerCase(Locale.ROOT).contains(q)) {
                Map<String, Object> item = new LinkedHashMap<>();
                item.put("symbol", stock.get("symbol"));
                item.put("name", stock.get("name"));
                item.put("sector", stock.get("sector"));
                results.add(item);
            }
        }
        return results;
    }

    private long hash(String s) {
        long h = 7;
        for (char c : s.toCharArray()) {
            h = h * 31 + c;
        }
        return Math.abs(h);
    }
}
