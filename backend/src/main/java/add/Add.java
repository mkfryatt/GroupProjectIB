package main.java.add;

import database.DatabaseConnector;

import java.sql.SQLException;


public class Add {

    public static DatabaseConnector dbCon;

    public static void setDbCon(String databasePath) {
        dbCon = new DatabaseConnector(databasePath);
    }

    public static void add(String table, int key) throws SQLException {
        if(dbCon == null) {
            throw new InternalError("path to database has not been initialised");
        }
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
                System.out.println("Table name " + table + " is unknown");
        }
    }

    public static void main(String[] args) throws SQLException{
        // Expecting 3 commmandline arguments - database path, table, key
        if(args.length != 3) {
            throw new IllegalArgumentException("Incorrect number of arguments supplied");
        }
        String databasePath = args[0];
        String table = args[1];
        int key = Integer.parseInt(args[2]);
        setDbCon(databasePath);
        add(table, key);

    }
}
