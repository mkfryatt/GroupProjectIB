import database.DatabaseConnector;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import main.java.data.*;
import java.util.Set;

public class DataManager {

  HashMap<Integer, UnepRep> unepRepMap;
  HashMap<Integer, Organisation> orgMap;
  HashMap<Integer, Location> locMap;
  HashMap<Integer, Presence> presenceMap;
  HashMap<Integer, UnepPresence> unepPresenceMap;
  HashMap<Integer, Trip> tripMap;
  HashMap<Integer, Wish> wishMap;
  HashMap<Integer, WishConstraint> constraintMap;
  HashMap<Integer, Suggestion> suggestionMap;

  HashMap<Organisation, ArrayList<Presence>> orgPresenceMap;

  public DataManager() {
    unepRepMap = new HashMap<>();
    orgMap = new HashMap<>();
    locMap = new HashMap<>();
    presenceMap = new HashMap<>();
    unepPresenceMap = new HashMap<>();
    tripMap = new HashMap<>();
    wishMap = new HashMap<>();
    constraintMap = new HashMap<>();
    suggestionMap = new HashMap<>();

    orgPresenceMap = new HashMap<>();
  }

  public boolean loadDatabase(DatabaseConnector dbc) {
    HashMap<String, String> queryStrings = new HashMap<>();
    queryStrings.put("unepRep", "SELECT id, firstName, lastName FROM unep_reps");
    queryStrings.put("organisation", "SELECT id, name FROM organisations");
    queryStrings.put("location", "SELECT id, name, lat, lon FROM locations");
    queryStrings.put("presence", "SELECT id, org_id, loc_id, startTime, endTime FROM presences");
    queryStrings.put("unepPresence", "SELECT id, loc_id, startTime, endTime FROM unep_presences");
    queryStrings.put("trip", "SELECT id, loc_id, startTime, endTime FROM presences");
    queryStrings.put("trip_org", "SELECT id, trip_id, org_id FROM trip_org_presences");
    queryStrings.put("rep_trip", "SELECT id, rep_id, trip_id FROM rep_trips");
    queryStrings.put("wish", "SELECT id, wisher_id FROM wishes");
    queryStrings
        .put("wish_constraint", "SELECT id, type, wish_id, loc_id, org_id FROM wish_constraints");
    queryStrings.put("suggestion",
        "SELECT id, wish_id, trip_id, loc_id, startTime, endTime FROM suggestions");

    //add reps
    try {
      //UnepRep
      ResultSet rs = dbc.executeQuery(queryStrings.get("unepRep"));
      while (rs.next()) {
        int id = rs.getInt("id");
        String firstName = rs.getString("firstName");
        String lastName = rs.getString("lastName");
        unepRepMap.put(id, new UnepRep(id, firstName, lastName));
      }

      //Orgs
      rs = dbc.executeQuery(queryStrings.get("organisation"));
      while (rs.next()) {
        int id = rs.getInt("id");
        String name = rs.getString("name");
        orgMap.put(id, new Organisation(id, name));
      }

      //Locations
      rs = dbc.executeQuery(queryStrings.get("location"));
      while (rs.next()) {
        int id = rs.getInt("id");
        String name = rs.getString("name");
        double lon = rs.getDouble("lon");
        double lat = rs.getDouble("lat");
        locMap.put(id, new Location(id, name, lon, lat));
      }

      //Presences
      rs = dbc.executeQuery(queryStrings.get("presence"));
      while (rs.next()) {
        int id = rs.getInt("id");
        Organisation org = orgMap.get(rs.getInt("org_id"));
        Location loc = locMap.get(rs.getInt("loc_id"));
        int startTime = rs.getInt("startTime");
        int endTime = rs.getInt("endTime");
        Presence presence = new Presence(id, org, loc, startTime, endTime);
        presenceMap.put(id, presence);

        orgPresenceMap.getOrDefault(org, new ArrayList<>()).add(presence);
      }

      rs = dbc.executeQuery(queryStrings.get("unepPresence"));
      while (rs.next()){
        int id = rs.getInt("id");
        int startTime = rs.getInt("startTime");
        int endTime = rs.getInt("endTime");
        Location loc = locMap.get(rs.getInt("loc_id"));
        UnepPresence up = new UnepPresence(id,loc,startTime,endTime);
        unepPresenceMap.put(id,up);
      }

      //Trips
      rs = dbc.executeQuery(queryStrings.get("trip"));
      while (rs.next()) {
        int id = rs.getInt("id");
        Location loc = locMap.get(rs.getInt("loc_id"));
        Trip trip = new Trip();
        trip.setId(id);
        trip.setLoc(loc);
        trip.setStartTime(rs.getInt("startTime"));
        trip.setEndTime(rs.getInt("endTime"));
        tripMap.put(id, trip);
      }

      //Trip_org_presence
      rs = dbc.executeQuery(queryStrings.get("trip_org"));
      while (rs.next()) {
        int id = rs.getInt("id");
        Organisation org = orgMap.get(rs.getInt("org_id"));
        Trip trip = tripMap.get(rs.getInt("trip_id"));
        trip.getPresentOrgs().add(org);
      }

      //rep_trips
      rs = dbc.executeQuery(queryStrings.get("rep_trip"));
      while (rs.next()) {
        int id = rs.getInt("id");
        UnepRep rep = unepRepMap.get(rs.getInt("rep_id"));
        Trip trip = tripMap.get(rs.getInt("trip_id"));
        trip.getPresentReps().add(rep);
      }

      //Wishes
      rs = dbc.executeQuery(queryStrings.get("wish"));
      while (rs.next()) {
        int id = rs.getInt("id");
        Wish wish = new Wish();
        wish.setId(id);
        wish.wisher = unepRepMap.get(rs.getInt("rep_id"));
        wishMap.put(id, wish);
      }

      //Wish_constraints
      rs = dbc.executeQuery(queryStrings.get("wish_constraint"));
      while (rs.next()) {
        int id = rs.getInt("id");
        String type = rs.getString("type");
        Wish wish = wishMap.get(rs.getInt("wish_id"));
        WishConstraint constraint;
        switch (type) {
          case "TIME":
            int startTime = rs.getInt("startTime");
            int endTime = rs.getInt("endTime");
            constraint = new TimeConstraint(id, wish, startTime, endTime);
            break;
          case "ORGANISATION":
            Organisation org = orgMap.get(rs.getInt("org_id"));
            constraint = new OrganisationConstraint(id, wish, org);
            break;
          case "LOCATION":
            Location loc = locMap.get(rs.getInt("loc_id"));
            constraint = new LocationConstraint(id, wish, loc);
            break;
          default:
            System.out
                .println("UNKNOWN CONSTRAINT TYPE '" + type + "'! (that's an error, pls fix).");
            constraint = null;
        }
        if (constraint != null) {
          switch (type) {
            case "TIME":
              wish.timeConstraint = (TimeConstraint) constraint;
              break;
            case "ORGANISATION":
              wish.orgConstraints.add((OrganisationConstraint) constraint);
              break;
            case "LOCATION":
              wish.locConstraint = (LocationConstraint) constraint;
              break;
          }
          constraintMap.put(id, constraint);
        }
      }

      //suggestions

      /*

      rs = dbc.executeQuery(queryStrings.get("suggestion"));
      while(rs.next()){
        int id = rs.getInt("id");
        Wish wish = wishMap.get(rs.getInt("wish_id"));
        Trip trip = tripMap.get(rs.getInt("trip_id"));
        Location loc = locMap.get(rs.getInt("loc_id"));
        Timeframe time = timeMap.get(rs.getInt("time_id"));
        suggestionMap.put(id,new Suggestion(id,wish,trip,loc,time));
      }

      */

    } catch (SQLException e) {
      e.printStackTrace();
      return false;
    }

    return true;
  }

//  public Suggestion generateNewSuggestion(Wish w, Trip trip, Location l, int startTime, int endTime,
//      double score) {
//    //REALLY hacky, please don't do it like this
//    //supposed to be done using get_last_inserted() from database after inserting with null id
//    Set<Integer> sgIds = suggestionMap.keySet();
//    int i = 1;
//    while (sgIds.contains(i)) {
//      i++;
//    }
//    Suggestion sg = new Suggestion(i, w, trip, l, startTime, endTime, score);
//    suggestionMap.put(i, sg);
//    return sg;
//  }
//
//  public boolean pushSuggestions(DatabaseConnector dbc) {
//    String suggestionSQL = "REPLACE INTO suggestions(wish_id, trip_id, unep_presence_id, org_presence_id, trip_org_id, emissions, emmission_delta, time_wasted, score) ";
//    Connection conn = dbc.getConn();
//    try {
//
//      for (Suggestion s : suggestionMap.values()) {
//        PreparedStatement pstmt = conn.prepareStatement(suggestionSQL);
//        pstmt.setInt(1, s.getId());
//        pstmt.setInt(2, s.getWish().getId());
//        pstmt.setInt(3, s.getTrip().getId());
//        pstmt.setInt(4, s.getLoc().getId());
//        pstmt.setInt(5, s.getStartTime());
//        pstmt.setInt(6, s.getEndTime());
//        pstmt.executeUpdate();
//      }
//    } catch (SQLException e) {
//      e.printStackTrace();
//    }
//    return true;
//  }


}
