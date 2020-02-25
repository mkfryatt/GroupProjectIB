package main.java.add;

import database.DatabaseConnector;

import java.sql.SQLException;


public class Add {
    public static DatabaseConnector dbCon = new DatabaseConnector("C:\\Users\\keval\\Documents\\Cambridge\\Part " +
            "1B\\Group Project\\Juliet\\backend\\database.db");


    public static void add(String table, int key) throws SQLException {
        switch (table) {
            case "unep_presences":
                AddedAggregatedUnepPresence.add(table, key);
            case "UNEP Trip":
                AddedAggregatedUnepPresence.add(table, key);
            case "Organisation HQ":
                AddedAggregatedOrgPresence.add(table, key);
            case "Wish":
                AddedAggregatedWish.add(table, key);


        }
    }
}
