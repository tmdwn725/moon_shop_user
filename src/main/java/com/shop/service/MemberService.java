package com.shop.service;

import com.shop.common.FileUtil;
import com.shop.common.ModelMapperUtil;
import com.shop.domain.File;
import com.shop.domain.Member;
import com.shop.domain.OrderInfo;
import com.shop.domain.Review;
import com.shop.dto.MemberDTO;
import com.shop.dto.ReviewDTO;
import com.shop.dto.Role;
import com.shop.repository.FileRepository;
import com.shop.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
@Service
@RequiredArgsConstructor
public class MemberService implements UserDetailsService {
    @Value("${root.filePath}")
    private String filePath;
    @Value("${image.profile.path}")
    private String imageUploadPath;
    private final MemberRepository memberRepository;
    private final FileRepository fileRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Member member = memberRepository.findByMemberId(username);

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
        Member member = memberRepository.findByMemberId(id);
        MemberDTO memberDTO = null;
        if(member != null){
            memberDTO = ModelMapperUtil.map(member, MemberDTO.class);
        }
        return memberDTO;
    }
    /**
     * 프로필 저장
     * @param memberId
     * @param profile
     */
    @Transactional
    public void saveMemberProfile(String memberId, MultipartFile profile){
        // 현재 날짜와 시간 취득
        LocalDateTime nowDate = LocalDateTime.now();
        String filePth = imageUploadPath;
        String saveFilePth = FileUtil.saveFile(profile, filePath, filePth);
        File fileInfo = new File();
        fileInfo.CreateFile(profile.getSize(), nowDate, null, profile.getOriginalFilename(), saveFilePth, "jpg");
        fileRepository.save(fileInfo);
        memberRepository.updateProfile(memberId, fileInfo);
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
     * 이메일 정보 저장
     * @param memberId
     * @param email
     */
    @Transactional
    public void saveMemberEmail(String memberId, String email){
        memberRepository.updateEmail(memberId,email);
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
