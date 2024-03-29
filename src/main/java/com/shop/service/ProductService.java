package com.shop.service;

import com.shop.common.FileUtil;
import com.shop.common.ModelMapperUtil;
import com.shop.domain.*;
import com.shop.domain.enums.ProductType;
import com.shop.dto.HeartDTO;
import com.shop.dto.ProductDTO;
import com.shop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final MemberRepository memberRepository;
    private final HeartRepository heartRepository;

    /**
     * 상품목록조회
     * @param start
     * @param limit
     * @return
     */
    public Page<ProductDTO> selectProductList(int start, int limit, String memberId, ProductType productType, String searchStr){
        Member member = memberRepository.findByMemberId(memberId);
        PageRequest pageRequest = PageRequest.of(start-1, limit);
        Page<Product> result = productRepository.selectProductList(pageRequest, 0L, member.getMemberSeq(), productType,searchStr);
        int total = result.getTotalPages();
        pageRequest = PageRequest.of((total-1), limit);
        List<ProductDTO> list = ModelMapperUtil.mapAll(result.getContent(), ProductDTO.class);
        return new PageImpl<>(list, pageRequest, total);
    }
    /**
     * 상품별 개수 확인
     * @return
     */
    public Map<String,Long> selectProductCount(){
        List<ProductDTO> countList =  productRepository.selectProductCount();
        Map<String, Long> result = countList.stream()
                .collect(Collectors.groupingBy(dto -> dto.getProductType().getParentCategory().get().getCode()
                        , Collectors.summingLong(ProductDTO::getProductTypeCount)));
        return result;
    }
    /**
     * 상품정보조회
     * @param productSeq
     * @return
     */
    public ProductDTO selectProductInfo(Long productSeq, String memberId){
        Member member = memberRepository.findByMemberId(memberId);
        Product productInfo = productRepository.selectProduct(productSeq, member.getMemberSeq());
        ProductDTO product = ModelMapperUtil.map(productInfo, ProductDTO.class);
        HeartDTO heart = Optional.ofNullable(product)
                .map(ProductDTO::getHeartList)
                .orElse(null)
                .stream()
                .filter(heartDTO -> heartDTO.getMember() != null && heartDTO.getMember().getMemberSeq() == member.getMemberSeq())
                .findFirst()
                .orElse(null);
        product.setHeart(heart);
        return product;
    }
    /**
     * 좋아요 등록/삭제
     * @param productDTO
     * @param memberId
     */
    @Transactional
    public void updateHeartInfo(ProductDTO productDTO, String memberId) {
        LocalDateTime nowDate = LocalDateTime.now();
        Heart heart = new Heart();
        Member member = memberRepository.findByMemberId(memberId);
        Product product = productRepository.findById(productDTO.getProductSeq()).get();
        heart.createHeart(member, product, nowDate);
        // 좋아요 취소시 삭제
        if("Y".equals(productDTO.getUpdateYn())) {
            heartRepository.save(heart);
        }else {
            heart = heartRepository.selectHeartInfo(heart);
            heartRepository.delete(heart);
        }
    }
}
