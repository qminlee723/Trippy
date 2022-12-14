package com.ssafy.trippy.Service;


import com.ssafy.trippy.Domain.Badge;
import com.ssafy.trippy.Dto.Response.ResponseBadgeDto;

import java.util.List;

public interface BadgeService {
    ResponseBadgeDto saveBadge(Long badgeId,Long memberId);

    List<ResponseBadgeDto> getBadgesByMemberId(Long memberId);
}
