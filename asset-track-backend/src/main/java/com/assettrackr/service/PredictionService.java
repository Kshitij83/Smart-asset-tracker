package com.assettrackr.service;

import com.assettrackr.dto.PredictionRequest;
import com.assettrackr.dto.PredictionResponse;
import com.assettrackr.entity.Prediction;
import com.assettrackr.entity.User;
import com.assettrackr.repository.PredictionRepository;
import com.assettrackr.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PredictionService {

    @Autowired
    private PredictionRepository predictionRepository;

    @Autowired
    private UserRepository userRepository;

    public PredictionResponse predictStockPrice(PredictionRequest request, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // This is where you would integrate your ML models
        // For now, we'll generate mock predictions
        List<PredictionResponse.PredictionData> predictions = generateMockPredictions(
                request.getSymbol(), request.getDays());

        // Save predictions to database
        savePredictions(request, predictions, user);

        return new PredictionResponse(
                request.getSymbol(),
                predictions,
                BigDecimal.valueOf(0.87), // Mock accuracy
                request.getModel().toString()
        );
    }

    private List<PredictionResponse.PredictionData> generateMockPredictions(String symbol, int days) {
        List<PredictionResponse.PredictionData> predictions = new ArrayList<>();
        BigDecimal basePrice = BigDecimal.valueOf(175.0); // Mock base price
        
        for (int i = 1; i <= days; i++) {
            LocalDate date = LocalDate.now().plusDays(i);
            // Simple random walk for demo
            double change = (Math.random() - 0.5) * 0.1;
            basePrice = basePrice.multiply(BigDecimal.valueOf(1 + change));
            BigDecimal confidence = BigDecimal.valueOf(0.85 + Math.random() * 0.1);
            
            predictions.add(new PredictionResponse.PredictionData(
                    date, basePrice, confidence));
        }
        
        return predictions;
    }

    private void savePredictions(PredictionRequest request, 
                               List<PredictionResponse.PredictionData> predictions, User user) {
        for (PredictionResponse.PredictionData pred : predictions) {
            Prediction prediction = new Prediction(
                    request.getSymbol(),
                    pred.getDate(),
                    pred.getPredictedPrice(),
                    pred.getConfidence(),
                    Prediction.ModelType.valueOf(request.getModel().toString()),
                    BigDecimal.valueOf(0.87), // Mock accuracy
                    user
            );
            predictionRepository.save(prediction);
        }
    }

    public List<PredictionResponse> getPredictionHistory(String symbol, String userId) {
        List<Prediction> predictions = predictionRepository.findBySymbolAndUserIdOrderByCreatedAtDesc(symbol, userId);
        return groupPredictionsBySession(predictions);
    }

    public List<PredictionResponse> getUserPredictions(String userId) {
        List<Prediction> predictions = predictionRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return groupPredictionsBySession(predictions);
    }

    private List<PredictionResponse> groupPredictionsBySession(List<Prediction> predictions) {
        // Group predictions by symbol and creation time (session)
        // This is a simplified implementation
        return predictions.stream()
                .collect(Collectors.groupingBy(p -> p.getSymbol() + "_" + p.getCreatedAt().toLocalDate()))
                .values()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private PredictionResponse convertToResponse(List<Prediction> predictions) {
        if (predictions.isEmpty()) return null;
        
        Prediction first = predictions.get(0);
        List<PredictionResponse.PredictionData> predictionData = predictions.stream()
                .map(p -> new PredictionResponse.PredictionData(
                        p.getPredictionDate(), p.getPredictedPrice(), p.getConfidence()))
                .collect(Collectors.toList());

        return new PredictionResponse(
                first.getSymbol(),
                predictionData,
                first.getAccuracy(),
                first.getModel().toString()
        );
    }
}
