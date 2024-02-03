package com.shop.repository.impl;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.shop.domain.File;
import com.shop.domain.Member;
import com.shop.domain.QMember;
import com.shop.repository.custom.MemberConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

@RequiredArgsConstructor
public class MemberRepositoryImpl implements MemberConfig {
    private final JPAQueryFactory queryFactory;
    QMember qmember = QMember.member;
    public Member findByMemberId(String memberId) {
        return queryFactory.selectFrom(qmember)
                .where(qmember.memberId.eq(memberId))
                .fetchOne();
    }
    public long updateProfile(String memberId, File file) {
        return queryFactory.update(qmember)
                .set(qmember.profile,file)
                .where(qmember.memberId.eq(memberId))
                .execute();
    }
    public long updatePassword(String memberId, String newPassword) {
        return queryFactory.update(qmember)
                .set(qmember.password,newPassword)
                .where(qmember.memberId.eq(memberId))
                .execute();
    }
    public long updateEmail(String memberId, String email) {
        return queryFactory.update(qmember)
                .set(qmember.email,email)
                .where(qmember.memberId.eq(memberId))
                .execute();
    }
}
