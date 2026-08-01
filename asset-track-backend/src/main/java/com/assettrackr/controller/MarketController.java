package com.assettrackr.controller;

import com.assettrackr.service.MarketService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/market")
public class MarketController {

    private final MarketService marketService;

    public MarketController(MarketService marketService) {
        this.marketService = marketService;
    }

    @GetMapping("/{symbol}")
    public ResponseEntity<List<Map<String, Object>>> getMarketData(@PathVariable String symbol,
                                                                   @RequestParam(defaultValue = "1m") String timeframe) {
        return ResponseEntity.ok(marketService.getMarketData(symbol, timeframe));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> search(@RequestParam(defaultValue = "") String q) {
        return ResponseEntity.ok(marketService.searchStocks(q));
    }
}
