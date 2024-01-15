package com.shop.repository.custom;

import com.shop.domain.Member;

public interface MemberConfig {
    Member fingByMemberId(String memberId);
    public long updatePassword(String memberId, String newPassword);
}
