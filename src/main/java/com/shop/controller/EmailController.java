package com.shop.controller;

import com.shop.dto.EmailMessage;
import com.shop.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

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
    // 회원가입 이메일 인증 - 요청 시 body로 인증번호 반환하도록 작성하였음
    @PostMapping("/sendEmail")
    public ResponseEntity sendEmail(@RequestBody String email) {
        String title = "[SAVIEW] 이메일 인증을 위한 인증 코드 발송";
        emailService.sendEmail(email, title);
        return ResponseEntity.ok().build();
    }



    @PostMapping("/emailAuth")
    public ResponseEntity<String> emailAuth(@RequestBody String email, @RequestBody String code) throws NoSuchAlgorithmException {
        if (emailService.verifyEmailCode(email, code)) {
            return ResponseEntity.ok(SecurityContextHolder.getContext().getAuthentication().getName());
        }
        return ResponseEntity.notFound().build();
    }
}
