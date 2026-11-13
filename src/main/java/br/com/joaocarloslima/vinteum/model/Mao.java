package br.com.joaocarloslima.vinteum.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Mao {
    private final List<Carta> cartas = new ArrayList<>();

    public void adicionarCarta(Carta carta) {
        cartas.add(carta);
    }

    public List<Carta> getCartas() {
        return Collections.unmodifiableList(cartas);
    }

    public int getPontos() {
        int pontos = 0;
        int ases = 0;

        for (Carta carta : cartas) {
            pontos += carta.getPontos();

            if (carta.isAs()) {
                ases++;
            }
        }

        while (pontos > 21 && ases > 0) {
            pontos -= 10;
            ases--;
        }

        return pontos;
    }

    public boolean estourou() {
        return getPontos() > 21;
    }

    public boolean temBlackjack() {
        return cartas.size() == 2 && getPontos() == 21;
    }

    public void limpar() {
        cartas.clear();
    }
}