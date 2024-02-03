package com.shop.repository.custom;

import com.shop.domain.File;
import com.shop.domain.Member;

public interface MemberConfig {
    Member findByMemberId(String memberId);
    long updateProfile(String memberId, File file);
    long updatePassword(String memberId, String newPassword);
    long updateEmail(String memberId, String email);
}
