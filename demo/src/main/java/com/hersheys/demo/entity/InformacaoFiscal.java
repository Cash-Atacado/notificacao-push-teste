package com.hersheys.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity @Table(name = "informacoes_fiscais")
@Data @NoArgsConstructor
public class InformacaoFiscal {

    @Id
    @Column(name = "id_produto")
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id_produto")
    private Produto produto;

    @Column(name = "ncm")   private String ncm;
    @Column(name = "ipi_pct")  private BigDecimal ipiPct;
    @Column(name = "icms_pct") private BigDecimal icmsPct;
    @Column(name = "cst_operacao") private String cstOperacao;
    @Column(name = "cest")  private String cest;
    @Column(name = "cfop")  private String cfop;
    @Column(name = "reducao_base_calculo")   private Boolean reducaoBaseCalculo;
    @Column(name = "aliquota_reducao_base")  private BigDecimal aliquotaReducaoBase;
    @Column(name = "substituicao_tributaria") private Boolean substituicaoTributaria;
    @Column(name = "aliquota_substituicao")  private BigDecimal aliquotaSubstituicao;
    @Column(name = "pauta_tributaria")       private Boolean pautaTributaria;

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

    public String getNcm() {
        return ncm;
    }

    public void setNcm(String ncm) {
        this.ncm = ncm;
    }

    public BigDecimal getIpiPct() {
        return ipiPct;
    }

    public void setIpiPct(BigDecimal ipiPct) {
        this.ipiPct = ipiPct;
    }

    public BigDecimal getIcmsPct() {
        return icmsPct;
    }

    public void setIcmsPct(BigDecimal icmsPct) {
        this.icmsPct = icmsPct;
    }

    public String getCstOperacao() {
        return cstOperacao;
    }

    public void setCstOperacao(String cstOperacao) {
        this.cstOperacao = cstOperacao;
    }

    public String getCest() {
        return cest;
    }

    public void setCest(String cest) {
        this.cest = cest;
    }

    public String getCfop() {
        return cfop;
    }

    public void setCfop(String cfop) {
        this.cfop = cfop;
    }

    public Boolean getReducaoBaseCalculo() {
        return reducaoBaseCalculo;
    }

    public void setReducaoBaseCalculo(Boolean reducaoBaseCalculo) {
        this.reducaoBaseCalculo = reducaoBaseCalculo;
    }

    public BigDecimal getAliquotaReducaoBase() {
        return aliquotaReducaoBase;
    }

    public void setAliquotaReducaoBase(BigDecimal aliquotaReducaoBase) {
        this.aliquotaReducaoBase = aliquotaReducaoBase;
    }

    public Boolean getSubstituicaoTributaria() {
        return substituicaoTributaria;
    }

    public void setSubstituicaoTributaria(Boolean substituicaoTributaria) {
        this.substituicaoTributaria = substituicaoTributaria;
    }

    public BigDecimal getAliquotaSubstituicao() {
        return aliquotaSubstituicao;
    }

    public void setAliquotaSubstituicao(BigDecimal aliquotaSubstituicao) {
        this.aliquotaSubstituicao = aliquotaSubstituicao;
    }

    public Boolean getPautaTributaria() {
        return pautaTributaria;
    }

    public void setPautaTributaria(Boolean pautaTributaria) {
        this.pautaTributaria = pautaTributaria;
    }
}
