package com.shop.repository.impl;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.shop.domain.*;
import com.shop.repository.custom.CouponConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class CouponRepositoryImpl implements CouponConfig {
    private final JPAQueryFactory queryFactory;
    QCoupon qCoupon = QCoupon.coupon;
    QMember qMember = QMember.member;
    QMemberCoupon qMemberCoupon = QMemberCoupon.memberCoupon;

    /**
     * 내쿠폰 정보 조회
     * @param memberSeq
     * @return
     */
    public List<MemberCoupon> selectMyCouponList(Long memberSeq){
        return queryFactory.selectFrom(qMemberCoupon)
                .join(qMemberCoupon.coupon, qCoupon)
                .where(qMemberCoupon.member.memberSeq.eq(memberSeq).and(qMemberCoupon.useYn.eq("N")))
                .fetch();
    }
    /**
     * 사용자 쿠폰 정보 조회
     * @param memberCouponSeq
     * @return
     */
    public MemberCoupon selectMemberCouponInfo(Long memberCouponSeq) {
        return queryFactory.selectFrom(qMemberCoupon)
                .join(qMemberCoupon.coupon,qCoupon)
                .where(qMemberCoupon.memberCouponSeq.eq(memberCouponSeq))
                .fetchOne();
    }

    /**
     * 쿠폰 사용여부 수정
     * @param memberCouponSeq
     * @param useYn
     */
    public void updateMemberCouponUseYn(Long memberCouponSeq, String useYn){
        queryFactory.update(qMemberCoupon)
                .set(qMemberCoupon.useYn,useYn)
                .where(qMemberCoupon.memberCouponSeq.eq(memberCouponSeq))
                .execute();

    }

}
