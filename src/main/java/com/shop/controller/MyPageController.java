package com.shop.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shop.dto.*;
import com.shop.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
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
     * 프로필 변경
     * @param profile
     * @return
     */
    @PostMapping("updateProfile")
    public ResponseEntity<Void> updateProfile(@RequestParam("profile") MultipartFile profile){
        String memberId = SecurityContextHolder.getContext().getAuthentication().getName();
        memberService.saveMemberProfile(memberId, profile);
        return  ResponseEntity.ok().build();
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
    /**
     * 내 주문 내역 조회
     * @param model
     * @param page
     * @return
     */
    @GetMapping("/myOrderList")
    public String myOrderList(Model model, @RequestParam(value="page", required = false, defaultValue="1") int page) {
        String memberId = SecurityContextHolder.getContext().getAuthentication().getName();
        Page<OrderInfoDTO> myOrderList = orderInfoService.selectOrderInfoList(page, 10,memberId);
        model.addAttribute("myOrderList", myOrderList);
        return "myPage/myOrderList";
    }
    /**
     * 결제취소
     * @param paymentDTO
     * @return
     */
    @ResponseBody
    @PostMapping(value = "/refund", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> refund(PaymentDTO paymentDTO) {
        try {
            // 입력값 검증
            if (paymentDTO == null || paymentDTO.getPaymentSeq() == null) {
                return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("{\"success\": false, \"message\": \"결제 정보가 없습니다.\"}");
            }
            
            // 개선된 환불 처리 메서드 사용
            String result = paymentService.processRefund(paymentDTO.getPaymentSeq());
            
            // 결과에 따른 응답 반환
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body("{\"success\": true, \"message\": \"" + result.replace("\"", "\\\"") + "\"}");
                
        } catch (IOException e) {
            log.error("결제 취소 중 IO 오류 발생: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(MediaType.APPLICATION_JSON)
                .body("{\"success\": false, \"message\": \"결제 취소 처리 중 오류가 발생했습니다.\"}");
        } catch (Exception e) {
            log.error("결제 취소 중 오류 발생: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(MediaType.APPLICATION_JSON)
                .body("{\"success\": false, \"message\": \"결제 취소에 실패했습니다.\"}");
        }
    }
    /**
     * 내 리뷰 관리 화면
     * @param model
     * @return
     */
    @RequestMapping("/myReviewInfo")
    public String myReviewInfo(Model model, OrderInfoDTO orderInfoDTO, ProductDTO productDTO) {
        String memberId = SecurityContextHolder.getContext().getAuthentication().getName();
        ProductDTO product =  productService.selectProductInfo(productDTO.getProductSeq(), memberId);
        ReviewDTO reviewInfo = reviewService.findReviewInfo(orderInfoDTO);
        product.setSizeType(productDTO.getSizeType());
        model.addAttribute("product",product);
        model.addAttribute("orderInfo", orderInfoDTO);
        model.addAttribute("reviewInfo",reviewInfo);
        return "myPage/myReviewInfo";
    }
    /**
     * 리뷰 등록
     * @param file
     * @param reviewDTO
     * @return
     * @throws IOException
     */
    @RequestMapping("/saveMyReview")
    public ResponseEntity<Void> saveMyReview(@RequestParam("file-img") MultipartFile file, ReviewDTO reviewDTO) throws IOException {
        reviewDTO.setImgFile(file);
        reviewService.saveReviewInfo(reviewDTO);
        return ResponseEntity.ok().build();
    }
    /**
     * 내 좋아요 리스트 조회
     * @param model
     * @param page
     * @return
     */
    @RequestMapping("/myHeartList")
    public String myHeartList(Model model, @RequestParam(value="page", required = false, defaultValue="1") int page){
        String memberId = SecurityContextHolder.getContext().getAuthentication().getName();
        Page<HeartDTO> myHeartList = heartService.selectHeartList(page, 10,memberId);
        model.addAttribute("myHeartList", myHeartList);
        return "myPage/myHeartList";
    }
}
