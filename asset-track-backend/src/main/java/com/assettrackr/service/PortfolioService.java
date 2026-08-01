package com.assettrackr.service;

import com.assettrackr.entity.Asset;
import com.assettrackr.repository.AssetRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class PortfolioService {

    private final AssetRepository assetRepository;

    public PortfolioService(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    public Map<String, Object> getSummary(String userId) {
        List<Asset> assets = assetRepository.findByUserIdOrderByCreatedAtDesc(userId);

        BigDecimal totalValue = BigDecimal.ZERO;
        BigDecimal totalCost = BigDecimal.ZERO;

        for (Asset asset : assets) {
            BigDecimal price = asset.getCurrentPrice() != null ? asset.getCurrentPrice() : asset.getPurchasePrice();
            totalValue = totalValue.add(price.multiply(asset.getQuantity()));
            totalCost = totalCost.add(asset.getPurchasePrice().multiply(asset.getQuantity()));
        }

        BigDecimal totalGain = totalValue.subtract(totalCost);
        BigDecimal totalGainPercent = totalCost.compareTo(BigDecimal.ZERO) > 0
                ? totalGain.multiply(BigDecimal.valueOf(100)).divide(totalCost, 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalValue", totalValue);
        summary.put("totalGain", totalGain);
        summary.put("totalGainPercent", totalGainPercent);
        summary.put("assetCount", assets.size());
        return summary;
    }

    public List<Map<String, Object>> getHistory(String userId, String timeframe) {
        int days = switch (timeframe == null ? "1m" : timeframe) {
            case "1w" -> 7;
            case "1m" -> 30;
            case "3m" -> 90;
            case "6m" -> 180;
            case "1y" -> 365;
            default -> 30;
        };

        List<Asset> assets = assetRepository.findByUserIdOrderByCreatedAtDesc(userId);
        BigDecimal baseValue = assets.stream()
                .map(a -> {
                    BigDecimal price = a.getCurrentPrice() != null ? a.getCurrentPrice() : a.getPurchasePrice();
                    return price.multiply(a.getQuantity());
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (baseValue.compareTo(BigDecimal.ZERO) <= 0) {
            baseValue = BigDecimal.valueOf(10000);
        }

        List<Map<String, Object>> history = new ArrayList<>();
        LocalDate today = LocalDate.now();
        double drift = (Math.random() - 0.45) * 0.01;

        for (int i = days; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            double factor = 1.0 + drift * (days - i) + (Math.random() - 0.5) * 0.02;
            BigDecimal value = baseValue.multiply(BigDecimal.valueOf(factor)).setScale(2, RoundingMode.HALF_UP);
            Map<String, Object> point = new LinkedHashMap<>();
            point.put("date", date.toString());
            point.put("value", value);
            history.add(point);
        }
        return history;
    }
}
