package br.com.joaocarloslima.vinteum.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.joaocarloslima.vinteum.model.Arriscada;
import br.com.joaocarloslima.vinteum.model.Cautelosa;
import br.com.joaocarloslima.vinteum.model.EstiloDeJogo;
import br.com.joaocarloslima.vinteum.model.Jogo;
import br.com.joaocarloslima.vinteum.model.Padrao;

// a tela 3D conversa com o Jogo por aqui (não precisa mexer)
@RestController
@RequestMapping("/api")
public class JogoApiController {

    private final List<EstiloDeJogo> estilos = List.of(new Cautelosa(), new Padrao(), new Arriscada());
    private EstiloDeJogo estilo = estilos.get(1);
    private Jogo jogo = novoJogo();

    private Jogo novoJogo() {
        Jogo novo = new Jogo();
        novo.getMesa().setEstilo(estilo);
        return novo;
    }

    @GetMapping("/estado")
    public Estado estado() {
        return Estado.de(jogo);
    }

    @PostMapping("/pedir")
    public Estado pedir() {
        jogo.pedirCarta();
        return Estado.de(jogo);
    }

    @PostMapping("/parar")
    public Estado parar() {
        jogo.parar();
        return Estado.de(jogo);
    }

    @PostMapping("/novo")
    public Estado novo() {
        jogo = novoJogo();
        return Estado.de(jogo);
    }

    @GetMapping("/estilos")
    public List<String> estilos() {
        List<String> nomes = new ArrayList<>();
        for (EstiloDeJogo e : estilos) {
            nomes.add(e.getNome());
        }
        return nomes;
    }

    @PostMapping("/estilo/{nome}")
    public Estado escolherEstilo(@PathVariable String nome) {
        for (EstiloDeJogo e : estilos) {
            if (e.getNome().equals(nome)) {
                estilo = e;
                jogo.getMesa().setEstilo(e);
            }
        }
        return Estado.de(jogo);
    }
}
