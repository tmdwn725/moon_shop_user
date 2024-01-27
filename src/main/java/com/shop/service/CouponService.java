package com.shop.service;

import com.shop.common.ModelMapperUtil;
import com.shop.domain.Member;
import com.shop.domain.MemberCoupon;
import com.shop.dto.MemberCouponDTO;
import com.shop.dto.MemberDTO;
import com.shop.repository.CouponRepository;
import com.shop.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 쿠폰 관련 Service
 */
@Service
@RequiredArgsConstructor
public class CouponService {
    private final CouponRepository couponRepository;
    private final MemberRepository memberRepository;

    /**
     * 내 쿠폰정보 조회
     * @param memberId
     * @return
     */
    public MemberDTO selectMyCouponInfo(String memberId) {
        Member member = memberRepository.fingByMemberId(memberId);
        List<MemberCoupon> list = couponRepository.selectMyCouponList(member.getMemberSeq());
        MemberDTO memberDTO = ModelMapperUtil.map(member, MemberDTO.class);
        List<MemberCouponDTO> memberCoupons = ModelMapperUtil.mapAll(list, MemberCouponDTO.class);
        memberDTO.setMemberCouponList(memberCoupons);
        return memberDTO;
    }
}
