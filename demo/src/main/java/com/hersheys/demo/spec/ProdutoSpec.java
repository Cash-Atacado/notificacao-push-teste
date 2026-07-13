package com.hersheys.demo.spec;

import com.hersheys.demo.entity.Produto;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ProdutoSpec {

    public static Specification<Produto> filtrar(
            String descricao, String codigo,
            String fornecedor, String ncm) {

        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            if (descricao != null && !descricao.isBlank())
                predicates.add(cb.like(
                        cb.lower(root.get("descricao")),
                        "%" + descricao.toLowerCase() + "%"));

            if (codigo != null && !codigo.isBlank())
                predicates.add(cb.equal(root.get("codigoProduto"), codigo));

            if (fornecedor != null && !fornecedor.isBlank()) {
                Join<Object, Object> forn = root.join("fornecedor");
                predicates.add(cb.like(
                        cb.lower(forn.get("nome")),
                        "%" + fornecedor.toLowerCase() + "%"));
            }

            if (ncm != null && !ncm.isBlank()) {
                Join<Object, Object> fiscal = root.join("informacaoFiscal");
                predicates.add(cb.equal(fiscal.get("ncm"), ncm));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}