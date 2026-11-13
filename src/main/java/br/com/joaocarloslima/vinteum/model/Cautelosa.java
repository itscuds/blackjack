package br.com.joaocarloslima.vinteum.model;

public class Cautelosa extends EstiloDeJogo {
    @Override
    public String getNome(){
        return "Cautelosa";
    }

    @Override
    public boolean devePedirCarta(int pontosMesa){
        return pontosMesa < 16;
    }

}
