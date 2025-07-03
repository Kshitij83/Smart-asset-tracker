package com.assettrackr.controller;

import com.assettrackr.dto.PredictionRequest;
import com.assettrackr.dto.PredictionResponse;
import com.assettrackr.service.PredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/predictions")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class PredictionController {

    @Autowired
    private PredictionService predictionService;

    @PostMapping("/stock")
    public ResponseEntity<PredictionResponse> predictStockPrice(
            @RequestBody PredictionRequest request,
            Authentication authentication) {
        String userId = authentication.getName();
        PredictionResponse response = predictionService.predictStockPrice(request, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history/{symbol}")
    public ResponseEntity<List<PredictionResponse>> getPredictionHistory(
            @PathVariable String symbol,
            Authentication authentication) {
        String userId = authentication.getName();
        List<PredictionResponse> history = predictionService.getPredictionHistory(symbol, userId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/user")
    public ResponseEntity<List<PredictionResponse>> getUserPredictions(
            Authentication authentication) {
        String userId = authentication.getName();
        List<PredictionResponse> predictions = predictionService.getUserPredictions(userId);
        return ResponseEntity.ok(predictions);
    }
}
