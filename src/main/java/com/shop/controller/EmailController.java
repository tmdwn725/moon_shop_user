package com.shop.controller;

import com.shop.service.EmailService;
import com.shop.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.security.NoSuchAlgorithmException;

/**
 * 이메일 Controller
 */
@Controller
@Slf4j
@RequiredArgsConstructor
public class EmailController {
    private final EmailService emailService;
    private final MemberService memberService;

    /**
     * 이메일 인증번호 전송
     * @param email
     * @return
     */
    @PostMapping("/sendEmail")
    public ResponseEntity sendEmail(@RequestParam(value="email") String email) {
        String title = "[MoonShop] 이메일 인증을 위한 인증 코드 발송";
        emailService.sendEmail(email, title);
        return ResponseEntity.ok().build();
    }
    /**
     * 이메일 인증
     * @param email
     * @param code
     * @return
     * @throws NoSuchAlgorithmException
     */
    @PostMapping("/emailAuth")
    public ResponseEntity<String> emailAuth(@RequestParam(value="email") String email, @RequestParam(value="code") String code, @RequestParam(value="memberId") String memberId) throws NoSuchAlgorithmException {
        if (emailService.verifyEmailCode(email, code)) {
            if(memberId != null){
                memberService.saveMemberEmail(memberId,email);
            }
            return ResponseEntity.ok(SecurityContextHolder.getContext().getAuthentication().getName());
        }
        return ResponseEntity.notFound().build();
    }
}
