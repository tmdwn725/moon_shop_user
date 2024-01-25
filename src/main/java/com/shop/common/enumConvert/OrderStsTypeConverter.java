package com.shop.common.enumConvert;

import com.shop.domain.enums.OrderStsType;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.util.EnumSet;
import java.util.NoSuchElementException;
@Converter(autoApply = true)
public class OrderStsTypeConverter implements AttributeConverter<OrderStsType, String> {
    @Override
    public String convertToDatabaseColumn(OrderStsType attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getCode();
    }
    @Override
    public OrderStsType convertToEntityAttribute(String dbData) {
        return EnumSet.allOf(OrderStsType.class).stream()
                .filter(e->e.getCode().equals(dbData))
                .findAny()
                .orElseThrow(()-> new NoSuchElementException());
    }
}
