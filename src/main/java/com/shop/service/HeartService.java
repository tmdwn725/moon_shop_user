package com.shop.service;

import com.shop.common.ModelMapperUtil;
import com.shop.domain.Heart;
import com.shop.domain.Member;
import com.shop.domain.OrderInfo;
import com.shop.dto.HeartDTO;
import com.shop.dto.OrderInfoDTO;
import com.shop.repository.HeartRepository;
import com.shop.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HeartService {
    private final MemberRepository memberRepository;
    private final HeartRepository heartRepository;

    /**
     * 좋아요 목록 조회
     * @param start
     * @param limit
     * @param id
     * @return
     */
    public Page<HeartDTO> selectHeartList(int start, int limit, String id) {
        Member member = memberRepository.fingByMemberId(id);
        PageRequest pageRequest = PageRequest.of(start-1, limit);
        Page<HeartDTO> result = heartRepository.selectHeartList(pageRequest,member.getMemberSeq());
        int total = result.getTotalPages();
        if (total > 0) {
            pageRequest = PageRequest.of((total-1), limit);
        }
        return new PageImpl<>(result.getContent(), pageRequest, total);
    }
}
