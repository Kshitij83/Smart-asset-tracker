package com.assettrackr.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class PredictionRequest {

    @NotBlank
    private String symbol;

    @Min(1)
    private int days;

    private String model = "LSTM";

    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public int getDays() { return days; }
    public void setDays(int days) { this.days = days; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
}
