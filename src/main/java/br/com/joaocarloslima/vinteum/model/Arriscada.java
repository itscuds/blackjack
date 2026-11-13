package br.com.joaocarloslima.vinteum.model;

public class Arriscada extends EstiloDeJogo {

    @Override
    public String getNome() {
        return "Arriscada";
    }

    @Override
    public boolean devePedirCarta(int pontosMesa) {
        return pontosMesa < 19;
    }
}