package main.java.add;

import data.Location;

import java.sql.ResultSet;
import java.sql.SQLException;

public class AddedHelperFunctions {

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
}
