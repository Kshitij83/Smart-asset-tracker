package com.assettrackr.controller;

import com.assettrackr.service.PortfolioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary(Authentication authentication) {
        return ResponseEntity.ok(portfolioService.getSummary(authentication.getName()));
    }

    @GetMapping("/history")
    public ResponseEntity<List<Map<String, Object>>> getHistory(@RequestParam(defaultValue = "1m") String timeframe,
                                                                Authentication authentication) {
        return ResponseEntity.ok(portfolioService.getHistory(authentication.getName(), timeframe));
    }
}
