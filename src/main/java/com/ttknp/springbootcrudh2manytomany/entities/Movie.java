package com.ttknp.springbootcrudh2manytomany.entities;

import com.ttknp.springbootcrudh2manytomany.custom_annotations.IgnoreGenerateSQL;
import lombok.*;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Table(schema = SchemaAndTable.SCHEMA ,name = SchemaAndTable.M)
public class Movie {
    private String mid;
    private String title;
    private String categories;
    private BigDecimal rate;
    @Column("`year`") // it's bug when create seem like "year" it about syntax
    private LocalDate year;
    @IgnoreGenerateSQL
    private Set<Actor> actors;

    public Movie(String mid, String title, String categories, BigDecimal rate, LocalDate year) {
        this.mid = mid;
        this.title = title;
        this.categories = categories;
        this.rate = rate;
        this.year = year;
    }
}