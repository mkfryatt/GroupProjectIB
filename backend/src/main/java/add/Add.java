package main.java.add;
import database.DatabaseConnector;


public class Add {
    public static DatabaseConnector dbCon = new DatabaseConnector("database.db");

    public static void add(String table, int key) {
        switch(table) {
            case "UNEP HQ":
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
