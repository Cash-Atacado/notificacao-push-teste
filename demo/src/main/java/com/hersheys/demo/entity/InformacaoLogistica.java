package com.hersheys.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity @Table(name = "informacoes_logisticas")
@Data @NoArgsConstructor
public class InformacaoLogistica {

    @Id
    @Column(name = "id_produto")
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id_produto")
    private Produto produto;

    @Column(name = "caixa_embarque_qtd")    private Integer caixaEmbarqueQtd;
    @Column(name = "unidade_secundaria_qtd") private Integer unidadeSecundariaQtd;
    @Column(name = "dun_caixa")   private String dunCaixa;
    @Column(name = "ean_display") private String eanDisplay;
    @Column(name = "ean_unidade") private String eanUnidade;
    @Column(name = "paletizacao_camada") private Integer paletizacaoCamada;
    @Column(name = "paletizacao_altura") private Integer paletizacaoAltura;

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

    public Integer getCaixaEmbarqueQtd() {
        return caixaEmbarqueQtd;
    }

    public void setCaixaEmbarqueQtd(Integer caixaEmbarqueQtd) {
        this.caixaEmbarqueQtd = caixaEmbarqueQtd;
    }

    public Integer getUnidadeSecundariaQtd() {
        return unidadeSecundariaQtd;
    }

    public void setUnidadeSecundariaQtd(Integer unidadeSecundariaQtd) {
        this.unidadeSecundariaQtd = unidadeSecundariaQtd;
    }

    public String getDunCaixa() {
        return dunCaixa;
    }

    public void setDunCaixa(String dunCaixa) {
        this.dunCaixa = dunCaixa;
    }

    public String getEanDisplay() {
        return eanDisplay;
    }

    public void setEanDisplay(String eanDisplay) {
        this.eanDisplay = eanDisplay;
    }

    public String getEanUnidade() {
        return eanUnidade;
    }

    public void setEanUnidade(String eanUnidade) {
        this.eanUnidade = eanUnidade;
    }

    public Integer getPaletizacaoCamada() {
        return paletizacaoCamada;
    }

    public void setPaletizacaoCamada(Integer paletizacaoCamada) {
        this.paletizacaoCamada = paletizacaoCamada;
    }

    public Integer getPaletizacaoAltura() {
        return paletizacaoAltura;
    }

    public void setPaletizacaoAltura(Integer paletizacaoAltura) {
        this.paletizacaoAltura = paletizacaoAltura;
    }
}