package com.assettrackr.controller;

import com.assettrackr.dto.AssetRequest;
import com.assettrackr.dto.AssetResponse;
import com.assettrackr.service.AssetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assets")
public class AssetController {

    private final AssetService assetService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    @GetMapping
    public ResponseEntity<List<AssetResponse>> getAssets(Authentication authentication) {
        return ResponseEntity.ok(assetService.getAssets(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<AssetResponse> createAsset(@Valid @RequestBody AssetRequest request,
                                                     Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(assetService.createAsset(authentication.getName(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AssetResponse> updateAsset(@PathVariable String id,
                                                     @Valid @RequestBody AssetRequest request,
                                                     Authentication authentication) {
        return ResponseEntity.ok(assetService.updateAsset(authentication.getName(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteAsset(@PathVariable String id,
                                                           Authentication authentication) {
        assetService.deleteAsset(authentication.getName(), id);
        return ResponseEntity.ok(Map.of("message", "Asset deleted"));
    }
}
