package com.shop.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;

import javax.persistence.*;

@Entity
@Getter
@Table(name="member_coupon")
public class MemberCoupon {
    @Id
    @Column(name="member_coupon_seq")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long memberCouponSeq;
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="member_seq", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Member member;
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coupon_seq", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Coupon coupon;
    @Column(name="use_yn")
    private String useYn;
    public void createMemberCoupon(Member member, Coupon coupon, String useYn){
        this.member = member;
        this.coupon = coupon;
        this.useYn = useYn;
    }
}
