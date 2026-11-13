package br.com.joaocarloslima.vinteum.model;

public class Mesa extends Participante {
    private EstiloDeJogo estilo = new Padrao();

    public EstiloDeJogo getEstilo() {
        return estilo;
    }

    public void setEstilo(EstiloDeJogo estilo) {
        if (estilo == null) {
            throw new IllegalArgumentException(
                    "O estilo não pode ser nulo."
            );
        }

        this.estilo = estilo;
    }

    public boolean devePedirCarta() {
        return estilo.devePedirCarta(getPontos());
    }
}