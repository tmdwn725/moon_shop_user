package com.shop.repository;

import com.shop.domain.Product;
import com.shop.repository.custom.ProductConfig;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long>, ProductConfig {
}
