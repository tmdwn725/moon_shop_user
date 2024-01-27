package com.shop.repository;

import com.shop.domain.Coupon;
import com.shop.repository.custom.CouponConfig;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CouponRepository extends JpaRepository<Coupon, Long>, CouponConfig {
}
