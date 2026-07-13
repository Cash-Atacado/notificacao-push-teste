package com.hersheys.demo.service;

import com.hersheys.demo.dto.DashboardDTO;
import com.hersheys.demo.dto.FornecedorDTO;
import com.hersheys.demo.repository.DashboardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DashboardRepository repository;

    public DashboardDTO obterResumo() {

        return DashboardDTO.builder()
                .totalProdutos(repository.totalProdutos())
                .totalFornecedores(repository.totalFornecedores())
                .precoMedio(repository.precoMedio())
                .shelfLifeMedio(repository.shelfLifeMedio())
                .build();
    }

    public List<FornecedorDTO> topFornecedores() {
        return repository.topFornecedores();
    }
}