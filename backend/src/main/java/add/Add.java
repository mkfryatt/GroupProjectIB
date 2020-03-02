package main.java.add;

import database.DatabaseConnector;
import main.java.cost.Cost;
import main.java.data.Location;

import java.sql.ResultSet;
import java.sql.SQLException;


public class Add {

    public static DatabaseConnector dbCon;

    public static void setDbCon(String databasePath) {
        dbCon = new DatabaseConnector(databasePath);
    }

    public static void add(String table, int key) throws SQLException {
        if (dbCon == null) {
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

    public static void updateSuggestion(int acceptedSuggestionId) {
        Location src, dest;
        Location cambridge = AddedHelperFunctions.unepCambridgeLocation;
        double emissions, emission_delta;

        try {
            ResultSet accSugSet = dbCon.executeQuery("SELECT * FROM acceptedSuggestions where id = " + String.valueOf(acceptedSuggestionId));

            accSugSet.next();

            int srcId = accSugSet.getInt("src_loc_id");
            int destId = accSugSet.getInt("dest_loc_id");
            ResultSet locSrcSet = dbCon.executeQuery("SELECT * FROM locations where id = " + String.valueOf(srcId));
            locSrcSet.next();
            src = new Location(0, "src", locSrcSet.getDouble("lon"), locSrcSet.getDouble("lat"));

            ResultSet locDestSet = dbCon.executeQuery("SELECT * FROM locations where id = " + String.valueOf(destId));
            locDestSet.next();
            dest = new Location(1, "dest", locDestSet.getDouble("lon"), locDestSet.getDouble("lat"));

            double camEmissions = Cost.calculateFlightEmissions(cambridge,dest);
            emissions = Cost.calculateFlightEmissions(src,dest);
            emission_delta = emissions - camEmissions;

            dbCon.executeStatement("UPDATE acceptedSuggestions " +
                    "SET emissions = " + String.valueOf(emissions) +
                    ", emission_delta =  " + String.valueOf(emission_delta) +
                    " WHERE id = " + String.valueOf(acceptedSuggestionId));

        } catch (SQLException e) {
            e.printStackTrace();
        }


    }

    public static void main(String[] args) throws SQLException {
        // Expecting 3 commmand line arguments - database path, table, key

        if (args.length > 4 || args.length < 3) {
            throw new IllegalArgumentException("Incorrect number of arguments supplied:" + String.valueOf(args.length));
        }
        String databasePath = args[0];
        setDbCon(databasePath);

        int mode = Integer.parseInt(args[1]);
        if (mode == 0) {
            String table = args[2];
            int key = Integer.parseInt(args[3]);
            add(table, key);
        } else if (mode == 1) {
            int acceptedSuggestionId = Integer.parseInt(args[2]);
            updateSuggestion(acceptedSuggestionId);
        }


    }
}
