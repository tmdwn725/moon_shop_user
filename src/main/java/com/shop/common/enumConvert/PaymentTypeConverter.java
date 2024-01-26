package com.shop.common.enumConvert;

import com.shop.domain.enums.PaymentType;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.util.EnumSet;
import java.util.NoSuchElementException;
@Converter(autoApply = true)
public class PaymentTypeConverter implements AttributeConverter<PaymentType, String> {
    @Override
    public String convertToDatabaseColumn(PaymentType attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getCode();
    }
    @Override
    public PaymentType convertToEntityAttribute(String dbData) {
        return EnumSet.allOf(PaymentType.class).stream()
                .filter(e->e.getCode().equals(dbData))
                .findAny()
                .orElseThrow(()-> new NoSuchElementException());
    }
}
