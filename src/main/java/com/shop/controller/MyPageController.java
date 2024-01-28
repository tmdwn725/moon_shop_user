package com.shop.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shop.dto.*;
import com.shop.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * 마이페이지 Controller
 */
@Controller
@RequiredArgsConstructor
@RequestMapping("/myPage")
public class MyPageController {
    private final MemberService memberService;
    private final ProductService productService;
    private final OrderInfoService orderInfoService;
    private final PaymentService paymentService;
    private final HeartService heartService;
    private final ReviewService reviewService;
    private final PasswordEncoder passwordEncoder;

    /**
     * 마이페이지 조회
     * @param model
     * @return
     */
    @GetMapping("myPage")
    public String myPage(Model model){
        String memberId = SecurityContextHolder.getContext().getAuthentication().getName();
        MemberDTO member = memberService.selectMemberById(memberId);
        model.addAttribute("member", member);
        return "myPage/myPage";
    }
    /**
     * 비밀번호 변경
     * @param request
     * @param response
     * @param memberDTO
     * @throws IOException
     */
    @PostMapping("/changePassword")
    public void changePassword(HttpServletRequest request, HttpServletResponse response, MemberDTO memberDTO) throws IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Map<String, String> responseData = new HashMap<>();
        long result = 0;
        boolean passwordCheck = false;

        String memberId = SecurityContextHolder.getContext().getAuthentication().getName();
        MemberDTO member = memberService.selectMemberById(memberId);
        // 현재 비밀번호 확인
        if(passwordEncoder.matches(memberDTO.getPassword(),member.getPassword())){
            passwordCheck = true;
        }

        if(passwordCheck){
            memberDTO.setMemberId(memberId);
            memberDTO.setNewPassword(passwordEncoder.encode(memberDTO.getNewPassword()));
            result = memberService.changeMyPassword(memberDTO);
            if(result > 0) {
                responseData.put("result", "success");
                responseData.put("message", "비밀번호가 성공적으로 변경되었습니다.");
            }else {
                responseData.put("result", "failure");
                responseData.put("message", "비밀번호 변경에 실패했습니다.");
            }
        }else{
            responseData.put("result", "failure");
            responseData.put("message", "비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인하세요.");
        }

        ObjectMapper objectMapper = new ObjectMapper();
        String jsonResponse = objectMapper.writeValueAsString(responseData);

        // JSON 응답을 클라이언트에 보냄
        response.getWriter().write(jsonResponse);
    }
}
