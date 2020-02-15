package data;

import java.util.ArrayList;
import java.util.List;

public class Trip implements Timeframe {

  int id;
  Location loc;
  public int startTime, endTime;
  ArrayList<Organisation> presentOrgs;
  ArrayList<UnepRep> presentReps;

  public Trip(int id, Location loc, int startTime, int endTime,
      List<Organisation> presentOrgs, List<UnepRep> presentReps) {
    this.id = id;
    this.loc = loc;
    this.startTime = startTime;
    this.endTime = endTime;
    this.presentOrgs = new ArrayList<>(presentOrgs);
    this.presentReps = new ArrayList<>(presentReps);
  }

  public Trip() {
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

  @Override
  public int getStartTime() {
    return startTime;
  }

  @Override
  public void setStartTime(int startTime) {
    this.startTime = startTime;
  }

  @Override
  public int getEndTime() {
    return endTime;
  }

  @Override
  public void setEndTime(int endTime) {
    this.endTime = endTime;
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
