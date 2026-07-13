package com.hersheys.demo.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class DashboardDTO {

    private Long totalProdutos;
    private Long totalFornecedores;
    private BigDecimal precoMedio;
    private Double shelfLifeMedio;
}