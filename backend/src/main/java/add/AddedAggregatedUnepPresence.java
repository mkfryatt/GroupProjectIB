package main.java.add;

import main.java.data.*;
import java.sql.ResultSet;
import java.sql.SQLException;

public class AddedAggregatedUnepPresence {


    public static int add(String table, int key) throws SQLException {
        int generatedSuggestions = 0;
        ResultSet rsUnepPres = Add.dbCon.executeQuery("SELECT * FROM aggregate_unep_presences WHERE table_id = " + key + " AND type = '" + table + "'");
        if (!rsUnepPres.next())
            throw new InternalError("key " + key + ": does not exist in specified table (" + table + ")");
        int UPloc_id = rsUnepPres.getInt("loc_id");
        Location UPlocation = AddedHelperFunctions.getLocationById(UPloc_id);
        System.out.println("here");
        int UPstartTime = rsUnepPres.getInt("startTime");
        int UPendTime = rsUnepPres.getInt("endTime");
        if (rsUnepPres.next())
            throw new InternalError("key " + key + ": identifies multiple entries in specified table (" + table + ")");

        System.out.println("first part getting uneppres info done");

        ResultSet wishes = Add.dbCon.executeQuery("SELECT * FROM wishes");
        //For each wish:
        while (wishes.next()) {
            int id = wishes.getInt("id");
            //Fetch the single (possible) location constraint associated with the query
            Location locationConstraint = null;
            {
                ResultSet rsLoc = Add.dbCon.executeQuery("SELECT * FROM wish_constraints WHERE type = 'LOCATION' AND wish_id = " + id);
                if (rsLoc.next()) {
                    int location_id = rsLoc.getInt("loc_id");
                    if (rsLoc.next())
                        throw new InternalError("ill-formed wish " + id + ": multiple location constraints");
                    locationConstraint = AddedHelperFunctions.getLocationById(location_id);
                }
            }

            //does it have any Organization Constraints?
            ResultSet orgConstraints = Add.dbCon.executeQuery("SELECT * FROM wish_constraints WHERE type = 'ORGANISATION' AND wish_id = " + id);
            if (orgConstraints.next()) {
                //Yes, it does.
                String sqlMatchingOrgPresences = "SELECT * FROM aggregate_org_presences WHERE id IN (SELECT DISTINCT org_id FROM wish_constraints WHERE type = 'ORGANISATION' AND wish_id =" + id + ") ";
                //There might also be a location constraint in this wish: if so, we should consider it.
                if (locationConstraint != null)
                    sqlMatchingOrgPresences += " AND loc_id = " + locationConstraint.getId();
                ResultSet matchingOrgPresences = Add.dbCon.executeQuery(sqlMatchingOrgPresences);
                while (matchingOrgPresences.next()) {
                    // For each OrgPresence, consider the intersection between timeframe of that OrgPresence and the union of the wish timeframes.
                    ResultSet timeConstraints = Add.dbCon.executeQuery("SELECT * FROM wish_constraints WHERE type = 'TIME' AND wish_id = " + id);
                    if (AddedHelperFunctions.insertSuggestion(
                            wishes.getInt("id"), table, key,
                            matchingOrgPresences.getString("type"),
                            matchingOrgPresences.getInt("table_id"),
                            UPlocation,
                            AddedHelperFunctions.getLocationById(matchingOrgPresences.getInt("loc_id")),
                            AddedHelperFunctions.smallestTimeDeltaFiltered(timeConstraints, matchingOrgPresences.getInt("startTime"), matchingOrgPresences.getInt("endTime"), UPstartTime, UPendTime)
                            )) generatedSuggestions++;
                }
            } else {
                // No, it doesn't. Then there should be one (and only one) location constraint.
                if (locationConstraint == null)
                    throw new InternalError("ill-formed wish " + id + ": no org constraint nor location constraint");
                //Consider all time constraints
                ResultSet timeConstraints = Add.dbCon.executeQuery("SELECT * FROM wish_constraints WHERE type = 'TIME' AND wish_id = " + id);
                // Finally we can generate 1 suggestion, relying only on "table".key, with the aforementioned cost
                if (AddedHelperFunctions.insertSuggestion(wishes.getInt("id"), table, key, null, 0, UPlocation, locationConstraint, AddedHelperFunctions.smallestTimeDelta(timeConstraints, UPstartTime, UPendTime)))
                    generatedSuggestions++;
            }
        }
        return generatedSuggestions;
    }
}
