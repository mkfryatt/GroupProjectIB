import database.DatabaseConnector;
import java.sql.SQLException;
import main.java.add.Add;
import main.java.data.*;
import java.util.ArrayList;
import java.util.HashMap;

public class Main {

  public static void main(String[] args) {
    DatabaseConnector dbc = new DatabaseConnector("database.db");

    String table = args[0];
    int id = Integer.parseInt(args[1]);

    try {
      Add.add(table,id);
    } catch (SQLException e) {
      System.out.println("SQL error as follows:");
      e.printStackTrace();
    }

    System.out.println("done");
  }

//  private static double calculateTimeScore(Timeframe a, Timeframe b){
//    double score = 0;
//    score = a.differenceTo(b);
//    //Do fancy stuff
//    return score;
//  }
//
//  private static double calculateDistanceScore(Location a, Location b){
//    return a.computeDistance(b);
//  }
//
//  public static void generateSuggestions(DataManager dm){
//    HashMap<Organisation, ArrayList<Wish>> orgMap = new HashMap<>();
//    for (Wish w : dm.wishMap.values()){
//      for(OrganisationConstraint orgC : w.orgConstraints){
//        //Add wish to each organisation's list
//        orgMap.getOrDefault(orgC.org, new ArrayList<>()).add(w);
//      }
//    }
//
//    for (Trip t : dm.tripMap.values()){
//      //Check for direct matches
//      for(Organisation presentOrg :  t.getPresentOrgs()){
//        if (orgMap.containsKey(presentOrg)) {
//          for(Wish w : orgMap.get(presentOrg)){
//            //TODO: Create suggestion
//          }
//        }
//      }
//
//      //Calculate distance to other
//      for(Organisation wantedOrg : orgMap.keySet()){
//        for(Presence p : dm.orgPresenceMap.get(wantedOrg)){
//          //TODO: Create suggestion
//        }
//      }
//    }
//
//
//  }

//  public static void generateSuggestionsSimple(DataManager dm) {
//    for (Trip t : dm.tripMap.values()) {
//      for (Wish w : dm.wishMap.values()) {
//        //Look for perfect matches
//        boolean meetsRequirements = true;
//
//        for (WishConstraint wc : w.getConstraints()) {
//          if (!wc.meetsRequirement(t)) {
//            meetsRequirements = false;
//            break;
//          }
//        }
//
//        if (meetsRequirements) {
//          //generate suggestion
//          dm.generateNewSuggestion(w, t, t.getLoc(), t.getStartTime(), t.getEndTime(), 0.0);
//        }
//
//    }
//  }

}
