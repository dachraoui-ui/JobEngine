package com.jobengine.common;

import java.util.List;
import java.util.stream.Collectors;

public class PaginationHelper {

    public static <T> PagedResponse<T> toPagedResponse(List<T> list, int page, int size) {
        int defaultSize = size <= 0 ? 10 : size;
        int defaultPage = page < 0 ? 0 : page;

        int totalElements = list.size();
        int totalPages = (int) Math.ceil((double) totalElements / defaultSize);
        if (totalPages == 0) totalPages = 1;

        List<T> pagedContent = list.stream()
                .skip((long) defaultPage * defaultSize)
                .limit(defaultSize)
                .collect(Collectors.toList());

        boolean last = (defaultPage + 1) >= totalPages;

        return PagedResponse.<T>builder()
                .content(pagedContent)
                .page(defaultPage)
                .size(defaultSize)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .last(last)
                .build();
    }
}
