package com.flowtrack.flowtrack.enums;

public enum Prioridade {
    BAIXA(0),
    MEDIA(1),
    ALTA(2);
    
    private final int id;

    Prioridade(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }
}
