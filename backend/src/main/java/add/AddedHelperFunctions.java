package main.java.add;

import main.java.cost.Cost;
import main.java.data.Location;

import java.sql.ResultSet;
import java.sql.SQLException;

public class AddedHelperFunctions {

    public static Location unepCambridgeLocation = new Location(0, "UNEP Cambridge Office", 0.091957, 52.21987);

    public static Location getLocationById(int loc_id) throws SQLException {
        ResultSet rs = Add.dbCon.executeQuery("SELECT * FROM locations WHERE id = " + loc_id);
        Location location = null;
        if(rs.next()) {
            location = new Location(loc_id, rs.getString("city"), rs.getDouble("lon"), rs.getDouble("lat"));
        }
        if(rs.next()) {
            throw new InternalError("key " + loc_id + " gives incorrect number of arguments");
        }
        return location;
    }

    public static int countResultSet(ResultSet rs) {
        int entries = 0;
        try {
            while(rs.next()) {
                entries += 1;
            }
        } catch(SQLException e) {
            e.printStackTrace();
        }
         return entries;
    }

    public static int intervalTimeDelta(int startTimeA, int endTimeA, int startTimeB, int endTimeB) {
        if (endTimeA < startTimeB) return startTimeB - endTimeA;
        if (endTimeB < startTimeA) return startTimeA - endTimeB;
        return 0;
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

    static class TimeInterval {
        public int startTime, endTime;

        public TimeInterval(int s, int e) {
            startTime = s;
            endTime = e;
        }
    }

    static boolean insertSuggestion(int wish_id, String unep_presence_type, int unep_table_id, String org_presence_type, int org_table_id, Location startLocation, Location endLocation, int time_wasted) {
        final int timeLimit = Integer.MAX_VALUE;
        if (time_wasted >= timeLimit) return false;
        double suggestionEmissions = Cost.calculateFlightEmissions(startLocation, endLocation);
        double fromCamEmissions = Cost.calculateFlightEmissions(unepCambridgeLocation, endLocation);
        double emissionsDelta = fromCamEmissions - suggestionEmissions;
        double score = Cost.calculateCost(time_wasted, endLocation, startLocation);
        if(score == 0) {
            return false;
        }
        String sql =
                "INSERT INTO suggestions (wish_id,emissions,emmission_delta,time_wasted,score,"+unep_presence_type+
                "__dep_id";
        if(org_presence_type!=null)sql+=","+org_presence_type+"__dep_id";
        sql+=String.format(") VALUES (%d,%f,%f, %d,%f,%d",wish_id,suggestionEmissions,emissionsDelta, time_wasted,score,
                unep_table_id);
        if(org_presence_type!=null)sql+=String.format(",%d",org_table_id);
        sql+=")";
        System.out.println(sql);
        Add.dbCon.executeStatement(sql);
        return true;
    }

    static boolean insertWishSuggestion(int wish_id, String unepPresType, int unepPresId, String orgPresType,
                                        int orgPresId, Location wish, Location match, int time_wasted) {
        final int timeLimit = Integer.MAX_VALUE;
        if (time_wasted >= timeLimit) return false;
        double suggestionEmissions = Cost.calculateFlightEmissions(match, wish);
        double fromCamEmissions = Cost.calculateFlightEmissions(unepCambridgeLocation, wish);
        double emissionsDelta = fromCamEmissions - suggestionEmissions;
        double score = Cost.calculateCost(time_wasted, wish, match);
        if(score == 0) {
            return false;
        }
        String sql;
        if(unepPresType != null) {
            String unepPresTypeId = unepPresType + "__dep_id";
            if(orgPresType != null) {
                String orgPresTypeId = orgPresType + "__dep_id";
                // unep and org constraint
                sql =
                        "INSERT into suggestions (wish_id, emissions, emmission_delta, time_wasted, score, " + unepPresTypeId + ", " + orgPresTypeId + ")";
                sql += String.format(" VALUES(%d, %f, %f, %d, %f, %d, %d", wish_id, suggestionEmissions,
                        emissionsDelta, time_wasted, score, unepPresId, orgPresId);
            } else {
                // unep constraint
                sql =
                        "INSERT into suggestions (wish_id, emissions, emmission_delta, time_wasted, score, " + unepPresTypeId + ")";
                sql += String.format(" VALUES(%d, %f, %f, %d, %f, %d", wish_id, suggestionEmissions,
                        emissionsDelta, time_wasted, score, unepPresId);
            }
        } else {
            // no unepPresType
            if(orgPresType != null) {
                // org constraint
                String orgPresTypeId = orgPresType + "__dep_id";
                sql =
                        "INSERT into suggestions (wish_id, emissions, emmission_delta, time_wasted, score, " + orgPresTypeId + ")";
                sql += String.format(" VALUES(%d, %f, %f, %d, %f, %d", wish_id, suggestionEmissions,
                        emissionsDelta, time_wasted, score, orgPresId);
            } else {
                return false;
            }
        }
        sql += ")";
        System.out.println(sql);
        Add.dbCon.executeStatement(sql);
        return true;
    }
    public static void main(String[] args) throws SQLException{
        ResultSet timeConstraints = Add.dbCon.executeQuery("SELECT * FROM wish_constraints WHERE type = 'TIME' AND " +
                "wish_id = 3");
        int time_wasted = smallestTimeDeltaFiltered(timeConstraints, 20, 30, 15, 30);
    }
}
