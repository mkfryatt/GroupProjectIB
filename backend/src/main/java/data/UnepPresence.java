package main.java.data;

public class UnepPresence implements Timeframe {
  int id;
  Location loc;
  int startTime, endTime;

  public UnepPresence(int id, Location loc, int startTime, int endTime) {
    this.id = id;
    this.loc = loc;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  public UnepPresence(int id, Location loc) {
    this(id,loc,0,Integer.MAX_VALUE);

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
}
