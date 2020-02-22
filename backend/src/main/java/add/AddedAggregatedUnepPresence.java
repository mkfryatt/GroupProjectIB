package main.java.add;


import data.Location;
import data.UnepRep;
import data.Wish;
import cost.Cost;

import java.sql.ResultSet;
import java.sql.SQLException;

//For each wish:
//does it have any Organization Constraints?
// No, it doesn't
// It HAS to be one (and only one) location constraints.
// Consider cost of the union of the time constraints of the wish and the timeframe (possibly infinte) of the newly added uneppresence. use this to generate 1 suggestion.
// Yes it does
// query in AggregatedOrgPresences where org is one of the OrgConstraints associated with the wish, and also filter for a possible location constraints (if no location constraints, don't filter by location)
// For each OrgPresence, consider the intersection between timeframe of that OrgPresence and the union of the wish timefrmaes; for each interval generate 1 suggestion.


public class AddedAggregatedUnepPresence {

    public static Location getLocationById(int loc_id) throws SQLException {
        ResultSet rs = Add.dbCon.executeQuery("SELECT * FROM locations WHERE id = " + loc_id);
        if (!rs.next()) throw new InternalError("key " + loc_id + ": no such location");
        if (rs.next()) throw new InternalError("key " + loc_id + ": identifies multiple locations");
        return new Location(loc_id, rs.getString("name"), rs.getDouble("lon"), rs.getDouble("lat"));
    }

    public static int intervalTimeDelta(int startTimeA, int endTimeA, int startTimeB, int endTimeB) {
        if (endTimeA < startTimeB) return startTimeB - endTimeA;
        if (endTimeB < startTimeA) return startTimeA - endTimeB;
        return 0;
    }

    static class TimeInterval {
        public int startTime, endTime;

        public TimeInterval(int s, int e) {
            startTime = s;
            endTime = e;
        }
    }

    public static TimeInterval intervalIntersection(int startTimeA, int endTimeA, int startTimeB, int endTimeB) {
        if (endTimeA < startTimeB) return null;
        if (endTimeB < startTimeA) return null;
        return new TimeInterval(Math.max(startTimeA, startTimeB), Math.min(endTimeA, endTimeB));
    }

    public static int smallestTimeDelta(ResultSet intervals, int startTime, int endTime) throws SQLException {
        if (!intervals.next()) return 0;
        int bestTimeDiff = Integer.MAX_VALUE;
        do {
            int iStartTime = intervals.getInt("startTime");
            int iEndTime = intervals.getInt("endTime");
            bestTimeDiff = Math.min(bestTimeDiff, intervalTimeDelta(iStartTime, iEndTime, startTime, endTime));
        } while (intervals.next());
        return bestTimeDiff;
    }

    public static int smallestTimeDeltaFiltered(ResultSet intervals, int filterStartTime, int filterEndTime, int startTime, int endTime) throws SQLException {
        if (!intervals.next()) return intervalTimeDelta(filterStartTime, filterEndTime, startTime, endTime);
        int bestTimeDiff = Integer.MAX_VALUE;
        do {
            int iStartTime = intervals.getInt("startTime");
            int iEndTime = intervals.getInt("endTime");
            TimeInterval interval = intervalIntersection(iStartTime, iEndTime, filterStartTime, filterEndTime);
            if (interval != null)
                bestTimeDiff = Math.min(bestTimeDiff, intervalTimeDelta(interval.startTime, interval.endTime, startTime, endTime));
        } while (intervals.next());
        return bestTimeDiff;
    }


    public static void add(String table, int key) throws SQLException {
        ResultSet rsUnepPres = Add.dbCon.executeQuery("SELECT * FROM aggregate_unep_presences WHERE table_id = " + key + " AND type = '" + table + "'");
        if (!rsUnepPres.next())
            throw new InternalError("key " + key + ": does not exist in specified table (" + table + ")");
        int UPloc_id = rsUnepPres.getInt("loc_id");///TODO: ensure loc_id is in the aggregated view
        int UPstartTime = rsUnepPres.getInt("startTime");
        int UPendTime = rsUnepPres.getInt("startTime");
        if (rsUnepPres.next())
            throw new InternalError("key " + key + ": identifies multiple entries in specified table (" + table + ")");
        //TODO: query for all wishes
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
                    locationConstraint = getLocationById(location_id);
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
                    double cost = Cost.calculateCost(
                            smallestTimeDeltaFiltered(timeConstraints, matchingOrgPresences.getInt("startTime"), matchingOrgPresences.getInt("endTime"), UPstartTime, UPendTime),
                            getLocationById(matchingOrgPresences.getInt("loc_id")),
                            getLocationById(UPloc_id));
                    //TODO: insert this suggestion in DB
                }
            } else {
                // No, it doesn't. Then there should be one (and only one) location constraint.
                if (locationConstraint == null)
                    throw new InternalError("ill-formed wish " + id + ": no org constraint nor location constraint");
                //Consider all time constraints
                ResultSet timeConstraints = Add.dbCon.executeQuery("SELECT * FROM wish_constraints WHERE type = 'TIME' AND wish_id = " + id);
                double cost = Cost.calculateCost(
                        smallestTimeDelta(timeConstraints, UPstartTime, UPendTime),
                        locationConstraint,
                        getLocationById(UPloc_id));
                // Finally we can generate 1 suggestion, relying only on "table".key, with the aforementioned cost
                //TODO: insert this suggestion in DB
            }
        }
    }
}
