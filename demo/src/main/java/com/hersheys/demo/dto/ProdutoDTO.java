package com.hersheys.demo.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class ProdutoDTO {

    // Produto
    private Integer id;
    private String codigoProduto;
    private String descricao;
    private Integer shelfLifeDias;
    private String nivel1, nivel2, nivel3, nivel4, nivel5;
    private String complemento;

    // Fornecedor
    private String fornecedor;

    // Compra
    private String comprador;
    private String formaAbastecimento;
    private Integer embalagemCompra;
    private BigDecimal margemCategoriaPct;

    // Fiscal
    private String ncm;
    private BigDecimal ipiPct;
    private BigDecimal icmsPct;
    private String cest;
    private String cfop;

    // Logística
    private Integer caixaEmbarqueQtd;
    private Integer unidadeSecundariaQtd;
    private String dunCaixa;
    private String eanDisplay;
    private String eanUnidade;

    // Custos
    private BigDecimal custoCaixaMaster;
    private BigDecimal custoDisplay;
    private BigDecimal custoUnidade;

}