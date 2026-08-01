package com.assettrackr.repository;

import com.assettrackr.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssetRepository extends JpaRepository<Asset, String> {

    List<Asset> findByUserIdOrderByCreatedAtDesc(String userId);

    Optional<Asset> findByIdAndUserId(String id, String userId);
}
