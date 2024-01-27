package com.shop.dto;

import lombok.Data;

@Data
public class MemberCouponDTO {
    private Long memberCouponSeq;
    private MemberDTO member;
    private CouponDTO coupon;
    private String useYn;
}
