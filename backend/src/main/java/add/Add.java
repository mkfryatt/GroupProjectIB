package main.java.add;

import database.DatabaseConnector;

import java.sql.SQLException;


public class Add {
    // TODO CHANGE FILEPATH
    public static DatabaseConnector dbCon = new DatabaseConnector("C:\\Users\\keval\\Documents\\Cambridge\\Part " +
            "1B\\Group Project\\Juliet\\backend\\database.db");


    public static void add(String table, int key) throws SQLException {
        switch (table) {
            case "unep_presences":
            case "trips":
                AddedAggregatedUnepPresence.add(table, key);
                break;
            case "presences":
                // TODO add all cases that end up in here
                AddedAggregatedOrgPresence.add(table, key);
                break;
            case "wishes":
                AddedAggregatedWish.add(key);
                break;

        }
    }
}
