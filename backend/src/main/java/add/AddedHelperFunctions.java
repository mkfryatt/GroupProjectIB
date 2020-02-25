package main.java.add;

import main.java.cost.Cost;
import main.java.data.Location;

import java.sql.ResultSet;
import java.sql.SQLException;

public class AddedHelperFunctions {

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
        double emissions = Cost.calculateFlightEmissions(startLocation, endLocation);
        double score = Cost.calculateCost(time_wasted, endLocation, startLocation);
        if (org_presence_type == null) {
            Add.dbCon.executeStatement(String.format(
                    "INSERT INTO suggestions (wish_id,unep_presence_type,unep_table_id,emissions,time_wasted,score) VALUES (%d,%s,%d,%f,%d,%f) "
                    , wish_id, unep_presence_type, unep_table_id, emissions, time_wasted, score));
        } else {
            Add.dbCon.executeStatement(String.format(
                    "INSERT INTO suggestions (wish_id,unep_presence_type,unep_table_id,org_presence_type,org_table_id,emissions,time_wasted,score) VALUES (%d,%s,%d,%s,%d,%f,%d,%f) "
                    , wish_id, unep_presence_type, unep_table_id, org_presence_type, org_table_id, emissions, time_wasted, score));
        }
        return true;
    }

    public static void main(String[] args) throws SQLException{

    }
}
