package com.assettrackr.dto;

import com.assettrackr.entity.Asset;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class AssetResponse {

    private String id;
    private String symbol;
    private String name;
    private String type;
    private String sector;
    private BigDecimal quantity;
    private BigDecimal purchasePrice;
    private BigDecimal currentPrice;
    private LocalDate purchaseDate;
    private String userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AssetResponse() {}

    public AssetResponse(Asset asset) {
        this.id = asset.getId();
        this.symbol = asset.getSymbol();
        this.name = asset.getName();
        this.type = asset.getType() != null ? asset.getType().name() : null;
        this.sector = asset.getSector();
        this.quantity = asset.getQuantity();
        this.purchasePrice = asset.getPurchasePrice();
        this.currentPrice = asset.getCurrentPrice();
        this.purchaseDate = asset.getPurchaseDate();
        this.userId = asset.getUser() != null ? asset.getUser().getId() : null;
        this.createdAt = asset.getCreatedAt();
        this.updatedAt = asset.getUpdatedAt();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

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

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
