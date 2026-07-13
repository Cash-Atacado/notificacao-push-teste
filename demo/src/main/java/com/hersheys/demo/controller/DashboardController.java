package com.hersheys.demo.controller;

import com.hersheys.demo.dto.DashboardDTO;
import com.hersheys.demo.dto.FornecedorDTO;
import com.hersheys.demo.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/dashboard")
@RequiredArgsConstructor
@CrossOrigin("*")
public class DashboardController {

    private final DashboardService service;

    @GetMapping
    public DashboardDTO resumo() {
        return service.obterResumo();
    }

    @GetMapping("/fornecedores")
    public List<FornecedorDTO> fornecedores() {
        return service.topFornecedores();
    }
}
