package com.assettrackr.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class PredictionResponse {

    private String symbol;
    private List<PredictionData> predictions;
    private BigDecimal accuracy;
    private String model;

    public PredictionResponse() {}

    public PredictionResponse(String symbol, List<PredictionData> predictions, BigDecimal accuracy, String model) {
        this.symbol = symbol;
        this.predictions = predictions;
        this.accuracy = accuracy;
        this.model = model;
    }

    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public List<PredictionData> getPredictions() { return predictions; }
    public void setPredictions(List<PredictionData> predictions) { this.predictions = predictions; }

    public BigDecimal getAccuracy() { return accuracy; }
    public void setAccuracy(BigDecimal accuracy) { this.accuracy = accuracy; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public static class PredictionData {
        private LocalDate date;
        private BigDecimal predictedPrice;
        private BigDecimal confidence;

        public PredictionData() {}

        public PredictionData(LocalDate date, BigDecimal predictedPrice, BigDecimal confidence) {
            this.date = date;
            this.predictedPrice = predictedPrice;
            this.confidence = confidence;
        }

        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }

        public BigDecimal getPredictedPrice() { return predictedPrice; }
        public void setPredictedPrice(BigDecimal predictedPrice) { this.predictedPrice = predictedPrice; }

        public BigDecimal getConfidence() { return confidence; }
        public void setConfidence(BigDecimal confidence) { this.confidence = confidence; }
    }
}
