package main.java.add;

import java.sql.ResultSet;
import java.sql.SQLException;

import com.sun.net.httpserver.Authenticator;
import main.java.cost.Cost;
import main.java.data.Location;

public class AddedAggregatedWish {

    // Three options for wish:
    // 1: 0 org constraints therefore 1 location constraint
    //      Go through each unep_presence, calculate cost of unep_loc and wish_loc
    // 2: 1 or more org constraints, 0 location constraints
    //      For each organisation:
    //          filter aggr_org_presence with organisation
    //              for each of these entries
    //                  if type = trip, then means unep already there, cost(time_diff, org_loc, org_loc)
    //                  if type = HQ, iterate over unep_presences, cost(time_diff, org_loc, unep_loc)
    //
    // 3: 1 or more org constraints, 1 location constraint
    //      For each organisation:
    //          filter aggr_org_presence with organisation and location
    //             for each of these entries
    //                  if type = trip, then means unep already there, cost(time_diff, org_loc, org_loc)
    //                  if type = HQ, iterate over unep_presences, cost(time_diff, org_loc, unep_loc)

    // Uses emission estimates not actual values
    public static int add(int wishId) throws SQLException {
        int generatedSuggestions = 0;

        ResultSet rsWish = Add.dbCon.executeQuery("SELECT * FROM wishes WHERE id = " + wishId);
        if(!rsWish.next()) {
            throw new InternalError("key " + wishId + ": does not exists in wishes");
        }
        ResultSet timeConstraints = Add.dbCon.executeQuery("SELECT * FROM wish_constraints WHERE type = 'TIME' AND " + "wish_id = " + wishId);

        // get the 0 or 1 location constraints
        Location locationConstraint = null;
        {
            ResultSet rsLoc = Add.dbCon.executeQuery("SELECT * FROM wish_constraints WHERE type = " +
                    "'LOCATION' AND wish_id = " + wishId);
            if (rsLoc.next()) {
                int locId = rsLoc.getInt("loc_id");
                if (rsLoc.next()) {
                    throw new InternalError("ill-formed-wish " + wishId + ": multiple location constraints");
                }
                locationConstraint = AddedHelperFunctions.getLocationById(locId);
            }
        }

        ResultSet orgConstraints = Add.dbCon.executeQuery("SELECT * FROM wish_constraints WHERE type = 'ORGANISATION'" +
                " AND" +
                " wish_id = " + wishId);

        if (orgConstraints.next()) {
            // if 0 loc constraints, then filter on org
            String sqlMatchingOrgPresences = "SELECT * FROM aggregate_org_presences WHERE id IN (SELECT DISTINCT " +
                    "org_id FROM wish_constraints WHERE type = 'ORGANISATION' AND wish_id =" + wishId + ") ";

            if (locationConstraint != null) {
                // if 1 loc constraints, then filter by org and location
                sqlMatchingOrgPresences += " AND loc_id = " + locationConstraint.getId();
            }


            ResultSet matchingOrgPresence = Add.dbCon.executeQuery(sqlMatchingOrgPresences);

            // if type = trip, then unep already there, so location is the same
            while (matchingOrgPresence.next()) {
                String orgType = matchingOrgPresence.getString("type");
                int orgTypeId = matchingOrgPresence.getInt("table_id");
                int matchingOrgStartTime = matchingOrgPresence.getInt("startTime");
                int matchingOrgEndTime = matchingOrgPresence.getInt("endTime");
                int orgLocId = matchingOrgPresence.getInt("loc_id");
                Location orgLocation = AddedHelperFunctions.getLocationById(orgLocId);
                ResultSet rsUnepPres = Add.dbCon.executeQuery("SELECT * FROM aggregate_unep_presences");
                while (rsUnepPres.next()) {
                    int UnepPresStartTime = rsUnepPres.getInt("startTime");
                    int UnepPresEndTime = rsUnepPres.getInt("endTime");
                    String unepPresType = rsUnepPres.getString("type");
                    int unepPresTypeId = rsUnepPres.getInt("table_id");
                    int time_wasted = AddedHelperFunctions.smallestTimeDeltaFiltered(
                            timeConstraints,
                            matchingOrgStartTime,
                            matchingOrgEndTime,
                            UnepPresStartTime,
                            UnepPresEndTime
                    );
                    Location matchLocation = AddedHelperFunctions.getLocationById(rsUnepPres.getInt("loc_id"));
                    if(AddedHelperFunctions.insertWishSuggestionFaster(
                            wishId, unepPresType, unepPresTypeId, orgType, orgTypeId, orgLocation, matchLocation
                            , time_wasted
                    )) {
                        generatedSuggestions ++;
                    }
                }
            }

        } else {
            // must have 1 location constraints
            if (locationConstraint == null) {
                throw new InternalError("ill formed wish " + wishId + ": no organisation or location constraints " +
                        "given");
            }
            ResultSet unepPres = Add.dbCon.executeQuery("SELECT * FROM aggregate_unep_presences");

            // Go through each unep_presence, calculate cost of unep_loc and wish_loc
            while (unepPres.next()) {
                int unepPresLoc = unepPres.getInt("loc_id");
                String unepPresenceType = unepPres.getString("type");
                Location matchLocation = AddedHelperFunctions.getLocationById(unepPresLoc);
                int unepPresStartTime = unepPres.getInt("startTime");
                int unepPresEndTime = unepPres.getInt("endTime");
                int unepPresId = unepPres.getInt("table_id");
                int time_wasted = AddedHelperFunctions.smallestTimeDelta(timeConstraints, unepPresStartTime,
                        unepPresEndTime);
                if(AddedHelperFunctions.insertWishSuggestionFaster(
                        wishId, unepPresenceType, unepPresId, null,0,locationConstraint, matchLocation, time_wasted
                )) {
                    generatedSuggestions ++;
                }
            }
        }
        return generatedSuggestions;
    }
}
