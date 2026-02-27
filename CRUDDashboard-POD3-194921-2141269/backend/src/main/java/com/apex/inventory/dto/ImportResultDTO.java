package com.apex.inventory.dto;

import java.util.List;

public class ImportResultDTO {
    private int imported;
    private int skipped;
    private List<String> errors;

    public ImportResultDTO() {}

    public ImportResultDTO(int imported, int skipped, List<String> errors) {
        this.imported = imported;
        this.skipped = skipped;
        this.errors = errors;
    }

    public int getImported()              { return imported; }
    public void setImported(int v)        { this.imported = v; }
    public int getSkipped()               { return skipped; }
    public void setSkipped(int v)         { this.skipped = v; }
    public List<String> getErrors()       { return errors; }
    public void setErrors(List<String> v) { this.errors = v; }
}
