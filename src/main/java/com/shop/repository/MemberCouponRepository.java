package com.shop.repository;

import com.shop.domain.MemberCoupon;
import org.springframework.data.jpa.repository.JpaRepository;
public interface MemberCouponRepository extends JpaRepository<MemberCoupon, Long> {

}