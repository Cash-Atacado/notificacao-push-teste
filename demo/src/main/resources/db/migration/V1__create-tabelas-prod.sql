
CREATE TABLE fornecedores (
    id_fornecedor SERIAL primary key,
    nome_fornecedor VARCHAR(100) UNIQUE NOT NULL

);

CREATE TABLE produtos (
    id_produto SERIAL PRIMARY KEY,
    codigo_produto VARCHAR(20) UNIQUE NOT NULL,
    descricao VARCHAR(150) NOT NULL,
    shelf_life_dias INT,
    nivel_1 VARCHAR(50),
    nivel_2 VARCHAR(50),
    nivel_3 VARCHAR(50),
    nivel_4 VARCHAR(50),
    nivel_5 VARCHAR(50),
    complemento VARCHAR(100),
    id_fornecedor INT NOT NULL,
    CONSTRAINT fk_produto_fornecedor
        FOREIGN KEY (id_fornecedor)
        REFERENCES fornecedores(id_fornecedor)
);

CREATE TABLE diretrizes_compra (
    id_produto INT PRIMARY KEY,
    codigo_compra VARCHAR(20),
    comprador VARCHAR(100),
    forma_abastecimento VARCHAR(150),
    embalagem_compra INT,
    margem_categoria_pct NUMERIC(5,2),
    CONSTRAINT fk_compra_produto
        FOREIGN KEY (id_produto)
        REFERENCES produtos(id_produto)
        ON DELETE CASCADE
);

CREATE TABLE informacoes_fiscais (
    id_produto INT PRIMARY KEY,
    ncm VARCHAR(10) NOT NULL,
    ipi_pct NUMERIC(5,2),
    icms_pct NUMERIC(5,2),
    cst_operacao VARCHAR(10),
    cest VARCHAR(10),
    cfop VARCHAR(10),
    reducao_base_calculo BOOLEAN,
    aliquota_reducao_base NUMERIC(5,2),
    substituicao_tributaria BOOLEAN,
    aliquota_substituicao NUMERIC(5,2),
    pauta_tributaria BOOLEAN,
    CONSTRAINT fk_fiscal_produto
        FOREIGN KEY (id_produto)
        REFERENCES produtos(id_produto)
        ON DELETE CASCADE
);

CREATE TABLE informacoes_logisticas (
    id_produto INT PRIMARY KEY,
    caixa_embarque_qtd INT,
    unidade_secundaria_qtd INT,
    dun_caixa VARCHAR(14),
    ean_display VARCHAR(14),
    ean_unidade VARCHAR(14),
    paletizacao_camada INT,
    paletizacao_altura INT,
    CONSTRAINT fk_logistica_produto
        FOREIGN KEY (id_produto)
        REFERENCES produtos(id_produto)
        ON DELETE CASCADE
);

CREATE TABLE custos_produtos (
    id_produto INT PRIMARY KEY,
    custo_caixa_master NUMERIC(10,2),
    custo_display NUMERIC(10,2),
    custo_unidade NUMERIC(10,2),
    CONSTRAINT fk_custo_produto
        FOREIGN KEY (id_produto)
        REFERENCES produtos(id_produto)
        ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION importar_produto(
    p_codigo_produto        VARCHAR,
    p_descricao_familia     VARCHAR,
    p_shelf_life            INT,
    p_nivel1                VARCHAR,
    p_nivel2                VARCHAR,
    p_nivel3                VARCHAR,
    p_nivel4                VARCHAR,
    p_nivel5                VARCHAR,
    p_complemento           VARCHAR,
    p_nome_fornecedor       VARCHAR,
    p_codigo_compra         VARCHAR,
    p_comprador             VARCHAR,
    p_forma_abastecimento   VARCHAR,
    p_embalagem_compra      INT,
    p_margem                NUMERIC,
    p_ncm                   VARCHAR,
    p_ipi                   NUMERIC,
    p_icms                  NUMERIC,
    p_cst                   VARCHAR,
    p_cest                  VARCHAR,
    p_cfop                  VARCHAR,
    p_reducao               BOOLEAN,
    p_aliq_reducao          NUMERIC,
    p_st                    BOOLEAN,
    p_aliq_st               NUMERIC,
    p_pauta                 BOOLEAN,
    p_caixa_embarque        INT,
    p_unidade_secundaria    INT,
    p_dun                   VARCHAR,
    p_ean_display           VARCHAR,
    p_ean_unidade           VARCHAR,
    p_camada                INT,
    p_altura                INT,
    p_custo_caixa_master    NUMERIC,
    p_custo_display         NUMERIC,
    p_custo_unidade         NUMERIC
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_fornecedor INT;
    v_id_produto    INT;
BEGIN

    -- Fornecedor
    INSERT INTO fornecedores (nome_fornecedor)
    VALUES (p_nome_fornecedor)
    ON CONFLICT (nome_fornecedor)
    DO UPDATE SET nome_fornecedor = EXCLUDED.nome_fornecedor
    RETURNING id_fornecedor INTO v_id_fornecedor;

    -- Produto
    INSERT INTO produtos (
        codigo_produto, descricao, shelf_life_dias,
        nivel_1, nivel_2, nivel_3, nivel_4, nivel_5,
        complemento, id_fornecedor
    )
    VALUES (
        p_codigo_produto, p_descricao_familia, p_shelf_life,
        p_nivel1, p_nivel2, p_nivel3, p_nivel4, p_nivel5,
        p_complemento, v_id_fornecedor
    )
    ON CONFLICT (codigo_produto)
    DO UPDATE SET
        descricao       = EXCLUDED.descricao,
        shelf_life_dias = EXCLUDED.shelf_life_dias,
        nivel_1         = EXCLUDED.nivel_1,
        nivel_2         = EXCLUDED.nivel_2,
        nivel_3         = EXCLUDED.nivel_3,
        nivel_4         = EXCLUDED.nivel_4,
        nivel_5         = EXCLUDED.nivel_5,
        complemento     = EXCLUDED.complemento,
        id_fornecedor   = EXCLUDED.id_fornecedor
    RETURNING id_produto INTO v_id_produto;

    -- Diretrizes de compra
    INSERT INTO diretrizes_compra (
        id_produto, codigo_compra, comprador,
        forma_abastecimento, embalagem_compra, margem_categoria_pct
    )
    VALUES (
        v_id_produto, p_codigo_compra, p_comprador,
        p_forma_abastecimento, p_embalagem_compra, p_margem
    )
    ON CONFLICT (id_produto)
    DO UPDATE SET
        codigo_compra       = EXCLUDED.codigo_compra,
        comprador           = EXCLUDED.comprador,
        forma_abastecimento = EXCLUDED.forma_abastecimento,
        embalagem_compra    = EXCLUDED.embalagem_compra,
        margem_categoria_pct = EXCLUDED.margem_categoria_pct;

    -- Fiscal
    INSERT INTO informacoes_fiscais (
        id_produto, ncm, ipi_pct, icms_pct, cst_operacao,
        cest, cfop, reducao_base_calculo, aliquota_reducao_base,
        substituicao_tributaria, aliquota_substituicao, pauta_tributaria
    )
    VALUES (
        v_id_produto, p_ncm, p_ipi, p_icms, p_cst,
        p_cest, p_cfop, p_reducao, p_aliq_reducao,
        p_st, p_aliq_st, p_pauta
    )
    ON CONFLICT (id_produto)
    DO UPDATE SET
        ncm                     = EXCLUDED.ncm,
        ipi_pct                 = EXCLUDED.ipi_pct,
        icms_pct                = EXCLUDED.icms_pct,
        cst_operacao            = EXCLUDED.cst_operacao,
        cest                    = EXCLUDED.cest,
        cfop                    = EXCLUDED.cfop,
        reducao_base_calculo    = EXCLUDED.reducao_base_calculo,
        aliquota_reducao_base   = EXCLUDED.aliquota_reducao_base,
        substituicao_tributaria = EXCLUDED.substituicao_tributaria,
        aliquota_substituicao   = EXCLUDED.aliquota_substituicao,
        pauta_tributaria        = EXCLUDED.pauta_tributaria;

    -- Logística
    INSERT INTO informacoes_logisticas (
        id_produto, caixa_embarque_qtd, unidade_secundaria_qtd,
        dun_caixa, ean_display, ean_unidade,
        paletizacao_camada, paletizacao_altura
    )
    VALUES (
        v_id_produto, p_caixa_embarque, p_unidade_secundaria,
        p_dun, p_ean_display, p_ean_unidade,
        p_camada, p_altura
    )
    ON CONFLICT (id_produto)
    DO UPDATE SET
        caixa_embarque_qtd    = EXCLUDED.caixa_embarque_qtd,
        unidade_secundaria_qtd = EXCLUDED.unidade_secundaria_qtd,
        dun_caixa             = EXCLUDED.dun_caixa,
        ean_display           = EXCLUDED.ean_display,
        ean_unidade           = EXCLUDED.ean_unidade,
        paletizacao_camada    = EXCLUDED.paletizacao_camada,
        paletizacao_altura    = EXCLUDED.paletizacao_altura;

    -- Custos
    INSERT INTO custos_produtos (
        id_produto, custo_caixa_master, custo_display, custo_unidade
    )
    VALUES (
        v_id_produto, p_custo_caixa_master, p_custo_display, p_custo_unidade
    )
    ON CONFLICT (id_produto)
    DO UPDATE SET
        custo_caixa_master = EXCLUDED.custo_caixa_master,
        custo_display      = EXCLUDED.custo_display,
        custo_unidade      = EXCLUDED.custo_unidade;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Erro ao importar produto %: %', p_codigo_produto, SQLERRM;
END;
$$;

-- Verificar se deu tudo certo. Tem que conter a qntd de produtos na planilha
SELECT
    (SELECT COUNT(*) FROM produtos)            AS produtos,
    (SELECT COUNT(*) FROM fornecedores)        AS fornecedores,
    (SELECT COUNT(*) FROM diretrizes_compra)   AS compras,
    (SELECT COUNT(*) FROM informacoes_fiscais) AS fiscal,
    (SELECT COUNT(*) FROM informacoes_logisticas) AS logistica,
    (SELECT COUNT(*) FROM custos_produtos)     AS custos;

SELECT
    p.codigo_produto,
    p.descricao,
    p.shelf_life_dias,
    f.nome_fornecedor,
    dc.comprador,
    dc.forma_abastecimento,
    dc.embalagem_compra,
    fi.ncm,
    fi.cest,
    il.caixa_embarque_qtd,
    il.unidade_secundaria_qtd,
    il.ean_unidade,
    il.dun_caixa,
    cp.custo_caixa_master,
    cp.custo_unidade
FROM produtos p
JOIN fornecedores f         ON f.id_fornecedor = p.id_fornecedor
LEFT JOIN diretrizes_compra dc  ON dc.id_produto = p.id_produto
LEFT JOIN informacoes_fiscais fi ON fi.id_produto = p.id_produto
LEFT JOIN informacoes_logisticas il ON il.id_produto = p.id_produto
LEFT JOIN custos_produtos cp    ON cp.id_produto = p.id_produto
ORDER BY p.codigo_produto;

SELECT pg_get_function_arguments('importar_produto'::regproc);