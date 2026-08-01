package com.assettrackr.repository;

import com.assettrackr.entity.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PredictionRepository extends JpaRepository<Prediction, String> {

    List<Prediction> findBySymbolAndUserIdOrderByCreatedAtDesc(String symbol, String userId);

    List<Prediction> findByUserIdOrderByCreatedAtDesc(String userId);
}
