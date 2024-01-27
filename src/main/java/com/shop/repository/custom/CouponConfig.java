package com.shop.repository.custom;

import com.shop.domain.Member;
import com.shop.domain.MemberCoupon;

import java.util.List;

public interface CouponConfig {
    List<MemberCoupon> selectMyCouponList(Long memberId);
    MemberCoupon selectMemberCouponInfo(Long memberCouponSeq);
    void updateMemberCouponUseYn(Long memberCouponSeq, String useYn);
}
