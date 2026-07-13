package com.hersheys.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity @Table(name = "custos_produtos")
@Data @NoArgsConstructor
public class CustoProduto {

    @Id
    @Column(name = "id_produto")
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id_produto")
    private Produto produto;

    @Column(name = "custo_caixa_master") private BigDecimal custoCaixaMaster;
    @Column(name = "custo_display")      private BigDecimal custoDisplay;
    @Column(name = "custo_unidade")      private BigDecimal custoUnidade;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Produto getProduto() {
        return produto;
    }

    public void setProduto(Produto produto) {
        this.produto = produto;
    }

    public BigDecimal getCustoCaixaMaster() {
        return custoCaixaMaster;
    }

    public void setCustoCaixaMaster(BigDecimal custoCaixaMaster) {
        this.custoCaixaMaster = custoCaixaMaster;
    }

    public BigDecimal getCustoDisplay() {
        return custoDisplay;
    }

    public void setCustoDisplay(BigDecimal custoDisplay) {
        this.custoDisplay = custoDisplay;
    }

    public BigDecimal getCustoUnidade() {
        return custoUnidade;
    }

    public void setCustoUnidade(BigDecimal custoUnidade) {
        this.custoUnidade = custoUnidade;
    }
}
