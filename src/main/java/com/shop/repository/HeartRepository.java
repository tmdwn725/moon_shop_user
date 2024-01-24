package com.shop.repository;

import com.shop.domain.Heart;
import com.shop.repository.custom.HeartConfig;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HeartRepository extends JpaRepository<Heart, Long>, HeartConfig {

}
