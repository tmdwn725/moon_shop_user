package com.shop.common.enumConvert;

import com.shop.domain.enums.ProductType;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.util.EnumSet;
import java.util.NoSuchElementException;

@Converter(autoApply = true)
public class ProductTypeConverter implements AttributeConverter<ProductType, String> {
    @Override
    public String convertToDatabaseColumn(ProductType attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getCode();
    }
    @Override
    public ProductType convertToEntityAttribute(String dbData) {
        return EnumSet.allOf(ProductType.class).stream()
                .filter(e->e.getCode().equals(dbData))
                .findAny()
                .orElseThrow(()-> new NoSuchElementException());
    }
}

