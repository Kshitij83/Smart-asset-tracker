package com.assettrackr.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public class AssetRequest {

    @NotBlank
    private String symbol;

    @NotBlank
    private String name;

    @NotBlank
    private String type;

    @NotBlank
    private String sector;

    @NotNull
    @DecimalMin("0")
    private BigDecimal quantity;

    @NotNull
    @DecimalMin("0")
    private BigDecimal purchasePrice;

    private BigDecimal currentPrice;

    @NotNull
    private LocalDate purchaseDate;

    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getSector() { return sector; }
    public void setSector(String sector) { this.sector = sector; }

    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }

    public BigDecimal getPurchasePrice() { return purchasePrice; }
    public void setPurchasePrice(BigDecimal purchasePrice) { this.purchasePrice = purchasePrice; }

    public BigDecimal getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(BigDecimal currentPrice) { this.currentPrice = currentPrice; }

    public LocalDate getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(LocalDate purchaseDate) { this.purchaseDate = purchaseDate; }
}
