package main.java.add;

import database.DatabaseConnector;

import java.sql.SQLException;


public class Add {
    // TODO CHANGE FILEPATH
//    public static DatabaseConnector dbCon = new DatabaseConnector("C:\\Users\\keval\\Documents\\Cambridge\\Part " +
//            "1B\\Group Project\\Juliet\\backend\\database.db");
    public static DatabaseConnector dbCon;

    public Add(String database_path) {
        dbCon = new DatabaseConnector(database_path);
    }

    public static void add(String table, int key) throws SQLException {
        switch (table) {
            case "unep_presences":
            case "trips":
                AddedAggregatedUnepPresence.add(table, key);
                break;
            case "presences":
            case "trip_org_presences":
                AddedAggregatedOrgPresence.add(table, key);
                break;
            case "wishes":
                AddedAggregatedWish.add(key);
                break;
            default:
                System.out.println("Unknown table string. Pls fix.");
        }
    }

    public static void main(String[] args) throws SQLException{
        // Expecting 3 commmandline arguments - database path, table, key
        String databasePath = args[0];
        String table = args[1];
        int key = Integer.parseInt(args[2]);
        Add adder = new Add(databasePath);
        adder.add(table, key);



    }
}
