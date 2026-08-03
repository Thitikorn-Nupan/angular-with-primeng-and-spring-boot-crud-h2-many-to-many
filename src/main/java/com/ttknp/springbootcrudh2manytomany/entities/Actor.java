package com.ttknp.springbootcrudh2manytomany.entities;

import com.ttknp.springbootcrudh2manytomany.custom_annotations.IgnoreGenerateSQL;
import lombok.*;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Table(schema = SchemaAndTable.SCHEMA ,name = SchemaAndTable.A)
public class Actor {

    private String aid;
    @Column("full_name")
    private String fullName;
    private LocalDate born; // LocalDate map Date
    private String contact;
    @IgnoreGenerateSQL
    private Set<Movie> movies;

    public Actor(String aid, String fullName, LocalDate born, String contact) {
        this.aid = aid;
        this.fullName = fullName;
        this.born = born;
        this.contact = contact;
    }

}