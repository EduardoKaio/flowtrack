package com.flowtrack.flowtrack.enums;

public enum Moods {
    EXCELENTE(0),
    BOM(1),
    NEUTRO(2),
    RUIM(3),
    PESSIMO(4);
    
    private final int id;

    Moods(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }
}
