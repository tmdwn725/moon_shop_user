package com.shop.controller;

import com.shop.dto.EmailMessage;
import com.shop.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Random;

/**
 * 이메일 Controller
 */
@Controller
@Slf4j
@RequiredArgsConstructor
public class EmailController {
    private final EmailService emailService;
    // 임시 비밀번호 발급
    @PostMapping("/password")
    public ResponseEntity sendPasswordMail(@RequestBody String email) {
        String title = "[SAVIEW] 이메일 인증을 위한 인증 코드 발송";
        String authCode = this.createCode();

        emailService.sendEmail(email, title, authCode);

        return ResponseEntity.ok().build();
    }

    // 회원가입 이메일 인증 - 요청 시 body로 인증번호 반환하도록 작성하였음
    @PostMapping("/sendEmail")
    public ResponseEntity sendEmail(@RequestBody String email) {

        String title = "[SAVIEW] 이메일 인증을 위한 인증 코드 발송";
        String authCode = this.createCode();

        emailService.sendEmail("sjmoon@beintech.co.kr", title, authCode);
        return ResponseEntity.ok().build();
    }

    private String createCode() {
        int lenth = 6;
        try {
            Random random = SecureRandom.getInstanceStrong();
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < lenth; i++) {
                builder.append(random.nextInt(10));
            }
            return builder.toString();
        } catch (NoSuchAlgorithmException e) {
            log.debug("MemberService.createCode() exception occur");
        }
        return null;
    }
}
