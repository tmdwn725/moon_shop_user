package com.shop.controller;

import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.shop.dto.MemberDTO;
import com.shop.service.MemberService;
import io.netty.handler.codec.json.JsonObjectDecoder;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletResponse;

@Controller
@RequiredArgsConstructor
public class LoginController {
    private final MemberService memberService;
    private final PasswordEncoder passwordEncoder;

    /**
     * 로그인 페이지
     * @return
     */
    @GetMapping("/login")
    public String login() {
        return "login/login";
    }

    /**
     *
     * @return
     */
    @RequestMapping("/idDupChk")
    public void idDupChk(MemberDTO memberDTO, HttpServletResponse response) {
        JsonObject resultMap = new JsonObject();
        MemberDTO member = memberService.selectMemberById(memberDTO.getMemberId());
        String dupYn = "N";
        if(member != null) {
            dupYn = "Y";
        }
        resultMap.add("dupYn",new JsonPrimitive(dupYn));
        // JSON으로 응답을 클라이언트에게 보내기 위해 설정
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        try {
            response.getWriter().write(resultMap.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @RequestMapping("/signUp")
    public ResponseEntity<Void> signUp(MemberDTO memberDTO) {
        memberDTO.setPassword(passwordEncoder.encode(memberDTO.getPassword()));
        memberService.signUpMember(memberDTO);
        return ResponseEntity.ok().build();
    }
}
