package com.shop.service;

import com.shop.common.ModelMapperUtil;
import com.shop.domain.Member;
import com.shop.dto.MemberDTO;
import com.shop.dto.Role;
import com.shop.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
@Service
@RequiredArgsConstructor
public class MemberService implements UserDetailsService {
    private final MemberRepository memberRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Member member = memberRepository.fingByMemberId(username);
        return User.builder()
                .username(member.getMemberId())
                .password(member.getPassword())
                .roles(member.getRole().name())
                .build();
    }

    /**
     * id로 member 정보 조회
     * @param id
     * @return
     */
    
    public MemberDTO selectMemberById(String id) {
        Member member = memberRepository.fingByMemberId(id);
        MemberDTO memberDTO = null;
        if(member != null){
            memberDTO = ModelMapperUtil.map(member, MemberDTO.class);
        }
        return memberDTO;
    }

    /**
     * 비밀번호 변경
     * @param memberDTO
     * @return
     */
    @Transactional
    public long changeMyPassword(MemberDTO memberDTO) {
        long result = 0;
        Member member = new Member();
        result = memberRepository.updatePassword(memberDTO.getMemberId(), memberDTO.getNewPassword());
        return result;
    }

    /**
     * 회원가입
     * @param memberDTO
     */
    @Transactional
    public void signUpMember(MemberDTO memberDTO){
        Member member = new Member();
        // 현재 날짜와 시간 취득
        LocalDateTime nowDate = LocalDateTime.now();
        member.createMember(nowDate, Role.ROLE_USER, memberDTO.getMemberId(), memberDTO.getName(), memberDTO.getPassword()
                ,memberDTO.getName(),memberDTO.getEmail(), memberDTO.getZipCode()
                , memberDTO.getAddress(), memberDTO.getDetailAddress(), memberDTO.getTelNo());
        memberRepository.save(member);
    }
}
