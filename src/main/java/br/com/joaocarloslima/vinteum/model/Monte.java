package br.com.joaocarloslima.vinteum.model;

import java.util.ArrayList;

import java.util.Collections;

import java.util.List;

public class Monte {
    private final List<Carta> cartas = new ArrayList<>();

    public Monte(){
        this(1);
    }

    public Monte(int quantidadeBaralhos){
        if (quantidadeBaralhos < 1){
            throw new IllegalArgumentException("É necessario pelo menos um baralho");
        }
        for (int b = 0; b < quantidadeBaralhos; b++){
            for (Naipe naipe : Naipe.values() ){
                for (int valor = 2; valor <= 10; valor++){
                    cartas.add(new Carta(valor, naipe));
                }
                cartas.add(new Carta("Jack", naipe));
                cartas.add(new Carta("Queen", naipe));
                cartas.add(new Carta("King", naipe));
                cartas.add(new Carta("Ace", naipe));
            }

        }
        embaralhar();
    }

    public void embaralhar(){
        Collections.shuffle(cartas);
    }

    public Carta comprarCarta(){
        if (cartas.isEmpty()){
            throw new IllegalStateException("O monte não possui mais cartas.");
        }
        return cartas.remove(cartas.size() - 1);
    }

    public Carta retirarCarta(){
        return comprarCarta();
    }

    public int getQuantidade(){
        return cartas.size();
    }

}
