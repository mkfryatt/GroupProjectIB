package data;

import java.util.ArrayList;
import java.util.List;

public class Wish implements Timeframe {
  int id;
  public int startTime, endTime;
  public ArrayList<OrganisationConstraint> orgConstraints;
  public LocationConstraint locConstraint;
  public TimeConstraint timeConstraint;

  public Wish(int id, int startTime, int endTime) {
    this.id = id;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  public Wish(){
    orgConstraints = new ArrayList<>();
  }

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public int getStartTime() {
    return startTime;
  }

  public void setStartTime(int startTime) {
    this.startTime = startTime;
  }

  public int getEndTime() {
    return endTime;
  }

  public void setEndTime(int endTime) {
    this.endTime = endTime;
  }

}
