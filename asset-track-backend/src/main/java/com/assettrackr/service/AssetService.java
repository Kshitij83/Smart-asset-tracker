package com.assettrackr.service;

import com.assettrackr.dto.AssetRequest;
import com.assettrackr.dto.AssetResponse;
import com.assettrackr.entity.Asset;
import com.assettrackr.entity.User;
import com.assettrackr.repository.AssetRepository;
import com.assettrackr.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssetService {

    private final AssetRepository assetRepository;
    private final UserRepository userRepository;

    public AssetService(AssetRepository assetRepository, UserRepository userRepository) {
        this.assetRepository = assetRepository;
        this.userRepository = userRepository;
    }

    public List<AssetResponse> getAssets(String userId) {
        return assetRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(AssetResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public AssetResponse createAsset(String userId, AssetRequest request) {
        User user = getUser(userId);
        Asset asset = new Asset(
                request.getSymbol().toUpperCase(),
                request.getName(),
                Asset.AssetType.valueOf(request.getType()),
                request.getSector(),
                request.getQuantity(),
                request.getPurchasePrice(),
                request.getPurchaseDate(),
                user);
        asset.setCurrentPrice(request.getCurrentPrice() != null
                ? request.getCurrentPrice()
                : request.getPurchasePrice());
        return new AssetResponse(assetRepository.save(asset));
    }

    @Transactional
    public AssetResponse updateAsset(String userId, String id, AssetRequest request) {
        Asset asset = assetRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Asset not found"));
        asset.setSymbol(request.getSymbol().toUpperCase());
        asset.setName(request.getName());
        asset.setType(Asset.AssetType.valueOf(request.getType()));
        asset.setSector(request.getSector());
        asset.setQuantity(request.getQuantity());
        asset.setPurchasePrice(request.getPurchasePrice());
        asset.setPurchaseDate(request.getPurchaseDate());
        if (request.getCurrentPrice() != null) {
            asset.setCurrentPrice(request.getCurrentPrice());
        }
        return new AssetResponse(assetRepository.save(asset));
    }

    @Transactional
    public void deleteAsset(String userId, String id) {
        Asset asset = assetRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Asset not found"));
        assetRepository.delete(asset);
    }

    private User getUser(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
