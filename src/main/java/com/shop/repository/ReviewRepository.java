package com.shop.repository;

import com.shop.domain.Review;
import com.shop.repository.custom.ReviewConfig;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long>, ReviewConfig {
}
