package com.shop.service;

import com.shop.common.ModelMapperUtil;
import com.shop.domain.Member;
import com.shop.domain.Product;
import com.shop.domain.enums.ProductType;
import com.shop.dto.HeartDTO;
import com.shop.dto.MemberDTO;
import com.shop.dto.ProductDTO;
import com.shop.repository.HeartRepository;
import com.shop.repository.MemberRepository;
import com.shop.repository.ProductRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

	@Mock
	private ProductRepository productRepository;

	@Mock
	private MemberRepository memberRepository;

	@Mock
	private HeartRepository heartRepository;

	@InjectMocks
	private ProductService productService;

	@Test
	@DisplayName("상품 목록 조회 - 매핑 및 페이지 정보 확인")
	void selectProductList_success() {
		// given
		String memberId = "tester";
		int start = 1;
		int limit = 10;
		ProductType type = ProductType.TEE;
		String search = "shirt";

		Member member = new Member();
		ReflectionTestUtils.setField(member, "memberSeq", 100L);
		when(memberRepository.findByMemberId(memberId)).thenReturn(member);

		List<Product> products = Arrays.asList(new Product(), new Product());
		PageRequest pageRequest = PageRequest.of(start - 1, limit);
		// totalElements = 30 -> totalPages = 3
		Page<Product> productPage = new PageImpl<>(products, pageRequest, 30);
		when(productRepository.selectProductList(any(PageRequest.class), eq(0L), eq(100L), eq(type), eq(search)))
				.thenReturn(productPage);

		List<ProductDTO> mappedList = Arrays.asList(new ProductDTO(), new ProductDTO());
		try (MockedStatic<ModelMapperUtil> utilities = Mockito.mockStatic(ModelMapperUtil.class)) {
			utilities.when(() -> ModelMapperUtil.mapAll(products, ProductDTO.class)).thenReturn(mappedList);

			// when
			Page<ProductDTO> result = productService.selectProductList(start, limit, memberId, type, search);

			// then
			assertThat(result.getContent()).hasSize(2);
			assertThat(result.getPageable().getPageNumber()).isEqualTo(2); // totalPages(3) - 1
			verify(memberRepository).findByMemberId(memberId);
			verify(productRepository).selectProductList(any(PageRequest.class), eq(0L), eq(100L), eq(type), eq(search));
		}
	}

	@Test
	@DisplayName("상품 개수 그룹핑 - 부모 카테고리 코드 기준 합산")
	void selectProductCount_groupingAndSum() {
		// given: 두 개는 TOP 하위(TEE, SHIRT), 하나는 PANTS 하위(DENIM_PANTS)
		ProductDTO d1 = new ProductDTO();
		d1.setProductType(ProductType.TEE);
		d1.setProductTypeCount(5);
		ProductDTO d2 = new ProductDTO();
		d2.setProductType(ProductType.SHIRT);
		d2.setProductTypeCount(7);
		ProductDTO d3 = new ProductDTO();
		d3.setProductType(ProductType.DENIM_PANTS);
		d3.setProductTypeCount(4);

		when(productRepository.selectProductCount()).thenReturn(Arrays.asList(d1, d2, d3));

		// when
		Map<String, Long> result = productService.selectProductCount();

		// then: TOP의 code는 "T", PANTS의 code는 "P"
		assertThat(result.get("T")).isEqualTo(12L);
		assertThat(result.get("P")).isEqualTo(4L);
		verify(productRepository).selectProductCount();
	}

	@Test
	@DisplayName("상품 상세 조회 - 현재 사용자 하트 정보 설정")
	void selectProductInfo_setsUserHeart() {
		// given
		String memberId = "tester";
		long memberSeq = 77L;
		long productSeq = 10L;

		Member member = new Member();
		ReflectionTestUtils.setField(member, "memberSeq", memberSeq);
		when(memberRepository.findByMemberId(memberId)).thenReturn(member);

		Product product = new Product();
		when(productRepository.selectProduct(productSeq, memberSeq)).thenReturn(product);

		// 매핑된 DTO에 하트 리스트를 포함시켜 현재 유저의 하트를 찾아 설정
		ProductDTO mapped = new ProductDTO();
		MemberDTO heartOwner = new MemberDTO();
		heartOwner.setMemberSeq(memberSeq);
		HeartDTO heartDTO = new HeartDTO();
		heartDTO.setMember(heartOwner);
		mapped.getHeartList().add(heartDTO);

		try (MockedStatic<ModelMapperUtil> utilities = Mockito.mockStatic(ModelMapperUtil.class)) {
			utilities.when(() -> ModelMapperUtil.map(product, ProductDTO.class)).thenReturn(mapped);

			// when
			ProductDTO result = productService.selectProductInfo(productSeq, memberId);

			// then
			assertThat(result.getHeart()).isNotNull();
			assertThat(result.getHeart().getMember().getMemberSeq()).isEqualTo(memberSeq);
			verify(memberRepository).findByMemberId(memberId);
			verify(productRepository).selectProduct(productSeq, memberSeq);
		}
	}

	@Test
	@DisplayName("좋아요 등록 - updateYn=Y 일 때 저장 호출")
	void updateHeartInfo_saveWhenY() {
		// given
		String memberId = "tester";
		long memberSeq = 1L;
		long productSeq = 22L;

		Member member = new Member();
		ReflectionTestUtils.setField(member, "memberSeq", memberSeq);
		when(memberRepository.findByMemberId(memberId)).thenReturn(member);

		Product product = new Product();
		when(productRepository.findById(productSeq)).thenReturn(Optional.of(product));

		ProductDTO dto = new ProductDTO();
		dto.setProductSeq(productSeq);
		dto.setUpdateYn("Y");

		// when
		productService.updateHeartInfo(dto, memberId);

		// then
		ArgumentCaptor<com.shop.domain.Heart> captor = ArgumentCaptor.forClass(com.shop.domain.Heart.class);
		verify(heartRepository, times(1)).save(captor.capture());
		verify(heartRepository, never()).delete(any());
		verify(heartRepository, never()).selectHeartInfo(any());
		assertThat(captor.getValue()).isNotNull();
	}

	@Test
	@DisplayName("좋아요 취소 - updateYn!=Y 일 때 삭제 호출")
	void updateHeartInfo_deleteWhenNotY() {
		// given
		String memberId = "tester";
		long memberSeq = 2L;
		long productSeq = 33L;

		Member member = new Member();
		ReflectionTestUtils.setField(member, "memberSeq", memberSeq);
		when(memberRepository.findByMemberId(memberId)).thenReturn(member);

		Product product = new Product();
		when(productRepository.findById(productSeq)).thenReturn(Optional.of(product));

		com.shop.domain.Heart existing = new com.shop.domain.Heart();
		when(heartRepository.selectHeartInfo(any())).thenReturn(existing);

		ProductDTO dto = new ProductDTO();
		dto.setProductSeq(productSeq);
		dto.setUpdateYn("N");

		// when
		productService.updateHeartInfo(dto, memberId);

		// then
		verify(heartRepository, times(1)).selectHeartInfo(any());
		verify(heartRepository, times(1)).delete(existing);
		verify(heartRepository, never()).save(any());
	}
}


