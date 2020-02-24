package data;

import java.util.ArrayList;
import java.util.List;

public class Trip {
  int id;
  Location loc;
  Timeframe time;
  ArrayList<Organisation> presentOrgs;
  ArrayList<UnepRep> presentReps;

  public Trip(int id, Location loc, Timeframe time,
      List<Organisation> presentOrgs, List<UnepRep> presentReps) {
    this.id = id;
    this.loc = loc;
    this.time = time;
    this.presentOrgs = new ArrayList<>(presentOrgs);
    this.presentReps = new ArrayList<>(presentReps);
  }

  public Trip(){
    this.presentOrgs = new ArrayList<>();
    this.presentReps = new ArrayList<>();
  }

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public Location getLoc() {
    return loc;
  }

  public void setLoc(Location loc) {
    this.loc = loc;
  }

  public Timeframe getTime() {
    return time;
  }

  public void setTime(Timeframe time) {
    this.time = time;
  }

  public ArrayList<Organisation> getPresentOrgs() {
    return presentOrgs;
  }

  public void setPresentOrgs(ArrayList<Organisation> presentOrgs) {
    this.presentOrgs = presentOrgs;
  }

  public ArrayList<UnepRep> getPresentReps() {
    return presentReps;
  }

  public void setPresentReps(ArrayList<UnepRep> presentReps) {
    this.presentReps = presentReps;
  }
}
